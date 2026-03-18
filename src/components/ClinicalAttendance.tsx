import React, { useState, useEffect, useRef } from 'react';
import type { QueueItem, ChatMessage } from '../types';
import { getMockPatientDetails, addPatientHistoryItem } from '../utils/patientData';
import { updateOpinionStatus } from '../utils/opinionsData';
import { addOpiniao } from '../utils/patientStore';
import { getGeminiChatResponse, resetChat } from '../services/gemini';
import { ArrowLeft, Send, Bot, Loader2, CheckCircle, BookOpen, FileText } from 'lucide-react';
import PrescriptionVisualizer from './PrescriptionVisualizer';

interface ClinicalAttendanceProps {
  patient: QueueItem;
  onBack: () => void;
}

type AttendanceStage = 'collecting_case' | 'collecting_plan' | 'finalized' | 'review_opinion';

// Nova interface para o modelo de Parecer
interface OpinionSections {
  considerations: string;
  assessment: string;
  plan: string;
  orientations: string;
  scheduling: string;
}

const ClinicalAttendance: React.FC<ClinicalAttendanceProps> = ({ patient, onBack }) => {
  const detailedPatient = getMockPatientDetails(patient.id, patient);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<AttendanceStage>('collecting_case');

  // State for the structured Opinion review
  const [opinionSections, setOpinionSections] = useState<OpinionSections>({
    considerations: '',
    assessment: '',
    plan: '',
    orientations: '',
    scheduling: ''
  });

  const [showPrescription, setShowPrescription] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      resetChat();
      initializeChat();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, stage]);

  const initializeChat = () => {
    let welcomeText = `Olá, Dr(a). Estou pronto para auxiliar na resposta deste Parecer. 
Solicitante: ${detailedPatient.requesterName || 'Não informado'}. 
Motivo: ${detailedPatient.requestDescription || 'Não informado'}.
Por favor, descreva suas considerações e avaliação. Estruturarei a resposta no modelo: Considerações, Avaliação, Plano, Orientações e Programação.`;

    const aiMsg: ChatMessage = {
      id: 'welcome-chat',
      role: 'model',
      text: welcomeText,
      timestamp: new Date()
    };

    setMessages([aiMsg]);
    setIsLoading(false);
  };

  // Helper to parse AI markdown response into Opinion fields
  const parseOpinionResponse = (text: string): OpinionSections => {
    const sections: OpinionSections = { considerations: '', assessment: '', plan: '', orientations: '', scheduling: '' };
    const lines = text.split('\n');
    let currentSection: keyof OpinionSections | null = null;

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      // Detect headers (robust to markdown # or just text)
      if (lowerLine.includes('considerações') || lowerLine.includes('consideracoes')) {
        currentSection = 'considerations';
      } else if (lowerLine.includes('avaliação') || lowerLine.includes('avaliacao')) {
        currentSection = 'assessment';
      } else if (lowerLine.includes('plano')) {
        currentSection = 'plan';
      } else if (lowerLine.includes('orientações') || lowerLine.includes('orientacoes')) {
        currentSection = 'orientations';
      } else if (lowerLine.includes('programação') || lowerLine.includes('programacao')) {
        currentSection = 'scheduling';
      } else if (currentSection) {
        const content = line.replace(/\*\*/g, '').replace(/#/g, '').trim();
        if (content) {
          sections[currentSection] += content + '\n';
        }
      }
    });

    if (!sections.considerations && !sections.assessment) {
      sections.considerations = text;
    }
    return sections;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let messageToSend = input;
    let nextStage = stage;

    // --- FLUXO DE PARECER ---
    if (stage === 'collecting_case') {
      messageToSend = `
        [CONTEXTO PARECER]
        Paciente: ${detailedPatient.patientName} (${detailedPatient.age}a)
        Solicitante: ${detailedPatient.requesterName}
        Motivo: ${detailedPatient.requestDescription}
        
        [RESPOSTA ESPECIALISTA]
        ${input}
        
        [INSTRUÇÃO CRÍTICA]
        Estruture a resposta OBRIGATORIAMENTE usando os seguintes cabeçalhos exatos:
        # Considerações
        # Avaliação
        # Plano
        # Orientações
        # Programação
        
        Seja técnico e direto.
        Finalize perguntando: "Deseja ajustar algo ou finalizar a resposta do parecer?"
        `;
      nextStage = 'collecting_plan'; // Reusing stage name for simplicity, means "reviewing first draft"
    } else if (stage === 'collecting_plan') {
      messageToSend = `
         [AJUSTE]
         ${input}
         
         [INSTRUÇÃO]
         Reescreva o parecer completo com os ajustes, mantendo ESTRITAMENTE a estrutura:
        # Considerações
        # Avaliação
        # Plano
        # Orientações
        # Programação
         `;
      nextStage = 'finalized';
    }

    const responseText = await getGeminiChatResponse(messageToSend, detailedPatient, newMessages);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setStage(nextStage);

    if (nextStage === 'finalized') {
      const parsed = parseOpinionResponse(responseText);
      setOpinionSections(parsed);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- ACTIONS FOR REVIEW SCREEN ---

  const handleGoToReview = () => {
    setStage('review_opinion');
  };

  const handleFinalize = () => {
    // 1. Atualizar Status no "Banco" de Pareceres
    updateOpinionStatus(patient.id, 'Respondido');

    const fullSummary = [
      opinionSections.considerations && `Considerações: ${opinionSections.considerations.trim()}`,
      opinionSections.assessment && `Avaliação: ${opinionSections.assessment.trim()}`,
      opinionSections.plan && `Plano: ${opinionSections.plan.trim()}`,
      opinionSections.orientations && `Orientações: ${opinionSections.orientations.trim()}`,
      opinionSections.scheduling && `Programação: ${opinionSections.scheduling.trim()}`,
    ].filter(Boolean).join(' | ');

    // 2. Salvar parecer no store do paciente (devolutiva → portal do paciente)
    addOpiniao({
      patientId: patient.id,
      patientName: detailedPatient.patientName,
      specialty: detailedPatient.type || 'Especialidade',
      doctor: detailedPatient.requesterName || 'Dr(a). Especialista',
      date: new Date().toLocaleDateString('pt-BR'),
      summary: fullSummary || 'Parecer emitido com sucesso.',
    });

    const alertMessage = `Parecer Finalizado com Sucesso!\n\n1. Resposta enviada ao prontuário do paciente.\n2. Notificação enviada ao médico solicitante: ${detailedPatient.requesterName || 'Solicitante'}.\n3. Status do pedido alterado para "Respondido".`;

    const fullConduct = `CONSIDERAÇÕES: ${opinionSections.considerations} | AVALIAÇÃO: ${opinionSections.assessment} | PLANO: ${opinionSections.plan} | ORIENTAÇÕES: ${opinionSections.orientations} | PROGRAMAÇÃO: ${opinionSections.scheduling}`;

    // 3. Salvar no Prontuário
    addPatientHistoryItem(patient.id, {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      chiefComplaint: `Resposta de Parecer - ${detailedPatient.requesterName || 'Geral'}`,
      conducts: {
        orientations: [fullConduct],
      }
    });

    alert(alertMessage);
    onBack();
  };


  // --- RENDER ---

  // VIEW 2: REVIEW SCREEN (OPINION)
  if (stage === 'review_opinion') {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col relative h-[90vh]">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <button onClick={() => setStage('finalized')} className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Chat
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-gray-900" />
              Revisão de Parecer
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPrescription(true)}
              className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Receituário
            </button>
            <button
              onClick={handleFinalize}
              className="flex items-center justify-center px-6 py-2 bg-gray-900 text-white hover:bg-black rounded-lg font-medium shadow-sm transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Finalizar e Enviar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-grow">
          <div className="p-6 flex-grow overflow-y-auto w-full">

            <div className="flex flex-col gap-6 max-w-full">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded mr-2">1</span>
                  Considerações
                </label>
                <textarea
                  className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-500 text-sm leading-relaxed min-h-[100px]"
                  value={opinionSections.considerations}
                  onChange={(e) => setOpinionSections({ ...opinionSections, considerations: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded mr-2">2</span>
                  Avaliação
                </label>
                <textarea
                  className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-500 text-sm leading-relaxed min-h-[120px]"
                  value={opinionSections.assessment}
                  onChange={(e) => setOpinionSections({ ...opinionSections, assessment: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded mr-2">3</span>
                  Plano
                </label>
                <textarea
                  className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-500 text-sm leading-relaxed min-h-[120px]"
                  value={opinionSections.plan}
                  onChange={(e) => setOpinionSections({ ...opinionSections, plan: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded mr-2">4</span>
                  Orientações
                </label>
                <textarea
                  className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-500 text-sm leading-relaxed min-h-[100px]"
                  value={opinionSections.orientations}
                  onChange={(e) => setOpinionSections({ ...opinionSections, orientations: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded mr-2">5</span>
                  Programação
                </label>
                <textarea
                  className="flex-grow w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-500 text-sm leading-relaxed min-h-[100px]"
                  value={opinionSections.scheduling}
                  onChange={(e) => setOpinionSections({ ...opinionSections, scheduling: e.target.value })}
                />
              </div>
            </div>

          </div>
        </div>

        {showPrescription && (
          <PrescriptionVisualizer
            patientName={detailedPatient.patientName}
            doctorName="Dr(a). Especialista"
            plan={opinionSections.plan}
            orientations={opinionSections.orientations}
            onClose={() => setShowPrescription(false)}
            onSendWhatsapp={() => {
              alert("Receituário enviado via WhatsApp para o paciente!");
              setShowPrescription(false);
            }}
          />
        )}
      </div>
    );
  }

  // VIEW 1: CHAT INTERFACE
  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-6 h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Emissão de Parecer Guiada por IA</h2>
            <p className="text-[11px] font-medium text-gray-500">Paciente: {detailedPatient.patientName} | Parecer solicitado por: {detailedPatient.requesterName}</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 border-x border-gray-200 p-4 md:p-6 space-y-6">
        {/* Welcome AI Message */}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex w-full max-w-3xl ${msg.role === 'model' ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${msg.role === 'model' ? 'bg-black text-white mr-3' : 'bg-gray-200 text-gray-600 ml-3'}`}>
                {msg.role === 'model' ? <Bot className="w-5 h-5" /> : 'M'}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-xl text-sm leading-relaxed shadow-sm ${msg.role === 'model'
                ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                : 'bg-black text-white rounded-tr-none'
                }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-3xl">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-black text-white mr-3">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-xl text-sm bg-white border border-gray-100 text-gray-500 rounded-tl-none flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>IA analisando o caso e estruturando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border border-gray-200 rounded-b-xl p-4">
        {stage === 'finalized' ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Parecer Estruturado!</h3>
            <p className="text-gray-500 text-center max-w-md">O parecer foi completamente formatado. Verifique os campos estruturados antes de finalizar a emissão.</p>
            <button
              onClick={handleGoToReview}
              className="mt-4 px-6 py-3 bg-black text-white hover:bg-gray-800 rounded-lg font-medium shadow-md transition-all flex items-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Revisar Parecer Final
            </button>
          </div>
        ) : (
          <div className="flex items-end bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={stage === 'collecting_case' ? "Escreva suas considerações e conduta clínica de forma livre..." : "Descreva os ajustes necessários no parecer..."}
              className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[60px] text-sm text-gray-900 placeholder-gray-400 p-2"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 ml-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalAttendance;

