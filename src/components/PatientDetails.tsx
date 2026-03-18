import React, { useState } from 'react';
import type { QueueItem } from '../types';
import { getMockPatientDetails } from '../utils/patientData';
import {
  ArrowLeft, Phone, Mail, User, Calendar, Activity,
  Pill, Stethoscope, Info, FileText as FileIcon, ChevronDown, Sparkles, PlusSquare, Video
} from 'lucide-react';
import ClinicalAttendance from './ClinicalAttendance';
import VideoCallOverlay from './VideoCallOverlay';

interface PatientDetailsProps {
  patientId: string;
  onBack: () => void;
  onStartAttendance: () => void;
  onFinishAttendance?: () => void;
  initialData?: QueueItem;
  isAttending?: boolean;
}

const AccordionItem = ({ icon: Icon, title, rightElement, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-[10px] shadow-sm mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors rounded-[10px]"
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-gray-500 mr-3" />
          <span className="font-bold text-gray-800 text-[11px]">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          {rightElement}
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 pb-5 pt-0">
          <div className="w-full h-px bg-gray-100 mb-4"></div>
          {children}
        </div>
      </div>
    </div>
  );
};

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId, onBack, onStartAttendance, onFinishAttendance, initialData, isAttending = false }) => {
  const patient = getMockPatientDetails(patientId, initialData);
  const [showVideoCall, setShowVideoCall] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-[#F8FAFC]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header Card */}
      <div className="bg-white rounded-[10px] shadow-sm p-6 mb-6 relative">
        <button onClick={onBack} className="absolute -top-4 -left-4 bg-white shadow-md p-2 rounded-full hover:bg-gray-50 text-gray-600 transition-colors z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="h-[72px] w-[72px] rounded-full bg-[#EBF3FF] text-[#1E5EFF] flex items-center justify-center font-bold text-[22px] tracking-tight">
                {patient.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#FFB800] border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-[11px] font-bold text-[#0F172A] mb-2 leading-tight">{patient.patientName}</h1>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-medium whitespace-nowrap">
                <span className="flex items-center gap-1.5"><User className="w-[16px] h-[16px] text-gray-400" /> {patient.age} anos</span>
                <span className="text-gray-300">•</span>
                <span>{patient.gender}</span>
                <span className="text-gray-300">•</span>
                <span className="bg-[#F1F5F9] px-2.5 py-1 rounded-md text-[#475569] font-bold text-[11px] tracking-wider capitalize">
                  {patient.type || 'CONSULTA'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2.5 text-[11px] text-[#475569]">
            <div className="flex items-center">
              <Phone className="w-[16px] h-[16px] mr-3 text-gray-400" />
              {patient.contact}
            </div>
            {patient.email && (
              <div className="flex items-center">
                <Mail className="w-[16px] h-[16px] mr-3 text-gray-400" />
                {patient.email}
              </div>
            )}
            <div className="flex items-center mt-1 text-gray-500 font-medium text-[11px]">
              <span className="font-bold text-[#334155] mr-2">ID:</span> {patient.id}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left Column (1/3) */}
        <div className="lg:col-span-1 space-y-5 sticky top-6">



          {/* Queixa Principal */}
          <div className="bg-white rounded-[10px] shadow-sm overflow-hidden border border-transparent">
            <div className="bg-[#FEF2F2] px-6 py-4 flex items-center">
              <Info className="w-[18px] h-[18px] text-[#DC2626] mr-3" />
              <h3 className="font-semibold text-[#DC2626] text-[11px]">Queixa Principal Atual</h3>
            </div>
            <div className="p-6">
              <p className="text-[#334155] font-medium leading-[1.6] text-[11px]">
                {patient.currentChiefComplaint || "Paciente relata dor de cabeça frontal persistente há 3 dias, associada a fotofobia. Nega febre ou vômitos."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {!isAttending ? (
              <>
                <button
                  onClick={onStartAttendance}
                  className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center text-[11px]"
                >
                  <FileIcon className="w-5 h-5 mr-3" />
                  Iniciar atendimento
                </button>
                <button
                  className="w-full py-3.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#2563EB] rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center text-[11px]"
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  Automatização do cuidado
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowVideoCall(true)}
                className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-semibold shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center text-[11px] animate-in slide-in-from-bottom-4 duration-300"
              >
                <Video className="w-5 h-5 mr-3" />
                Iniciar Chamada de Vídeo
              </button>
            )}
          </div>
        </div>

        {/* Right Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <AccordionItem
              icon={Calendar}
              title="Histórico de Consultas"
              defaultOpen={false}
              rightElement={
                <button className="text-[#2563EB] hover:text-[#1D4ED8] text-[11px] font-semibold transition-colors">
                  Ver Prontuário Completo
                </button>
              }
            >
              <div className="relative border-l-2 border-[#E2E8F0] ml-3 space-y-8 py-4">
                {patient.history.map((item) => (
                  <div key={item.id} className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-[3px] border-[#CBD5E1]"></div>
                    <div className="flex flex-col mb-3">
                      <span className="text-[11px] font-bold text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md mb-2 inline-block w-fit capitalize">
                        {item.date}
                      </span>
                      <h4 className="text-[11px] font-bold text-[#0F172A]">{item.chiefComplaint}</h4>
                    </div>
                    <div className="mt-4 bg-[#F8FAFC] rounded-[16px] p-5 border border-[#E2E8F0]">
                      {item.conducts.prescriptions && (
                        <div className="mb-5 last:mb-0">
                          <p className="text-[11px] font-bold text-[#64748B] capitalize mb-2 flex items-center">
                            <Pill className="w-[14px] h-[14px] mr-2" /> Prescrição Externa
                          </p>
                          <ul className="list-none space-y-1 text-[11px] text-[#334155] font-medium">
                            {item.conducts.prescriptions.map((p, idx) => <li key={idx} className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1] mr-3"></div>{p}</li>)}
                          </ul>
                        </div>
                      )}
                      {item.conducts.exams && (
                        <div className="mb-5 last:mb-0">
                          <p className="text-[11px] font-bold text-[#64748B] capitalize mb-2 flex items-center">
                            <Stethoscope className="w-[14px] h-[14px] mr-2" /> Solicitação de Exames
                          </p>
                          <ul className="list-none space-y-1 text-[11px] text-[#334155] font-medium">
                            {item.conducts.exams.map((e, idx) => <li key={idx} className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1] mr-3"></div>{e}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {patient.history.length === 0 && (
                  <p className="text-[11px] text-gray-500 font-medium">Nenhum histórico de consulta encontrado.</p>
                )}
              </div>
            </AccordionItem>

            <AccordionItem icon={PlusSquare} title="Medicações em Uso Contínuo">
              {patient.medications?.continuous && patient.medications.continuous.length > 0 ? (
                <div className="overflow-x-auto -mx-6">
                  <table className="table-container">
                    <thead className="bg-[#F8FAFC]">
                      <tr>
                        <th className="table-title">#</th>
                        <th className="table-title">MEDICAMENTO / POSOLOGIA</th>
                        <th className="table-title">TIPO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.medications.continuous.map((med, idx) => (
                        <tr key={idx} className="table-row-hover">
                          <td className="table-text text-[11px] font-bold text-[#94A3B8] w-8">{idx + 1}</td>
                          <td className="table-text text-[11px] font-bold text-[#0F172A]">{med}</td>
                          <td className="table-text whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] capitalize">Uso Contínuo</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[11px] text-[#64748B] font-medium pt-2">Nenhuma medicação de uso contínuo informada.</p>
              )}
            </AccordionItem>

            <AccordionItem icon={Activity} title="Resultados de Exames">
              {patient.examResults && patient.examResults.length > 0 ? (
                <div className="overflow-x-auto -mx-6">
                  <table className="table-container">
                    <thead className="bg-[#F8FAFC]">
                      <tr>
                        <th className="table-title">EXAME</th>
                        <th className="table-title">DATA / HORA</th>
                        <th className="table-title text-right">AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.examResults.map((exam, idx) => (
                        <tr key={idx} className="table-row-hover cursor-pointer group">
                          <td className="table-text whitespace-nowrap">
                            <div className="flex items-center">
                              <FileIcon className="w-4 h-4 mr-2 text-[#2563EB] group-hover:text-[#1D4ED8] transition-colors" />
                              <span className="text-[11px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{exam.name}</span>
                            </div>
                          </td>
                          <td className="table-text whitespace-nowrap text-[11px] font-medium text-[#475569]">
                            <div className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#94A3B8]" />
                              {exam.date}
                            </div>
                          </td>
                          <td className="table-text whitespace-nowrap text-right">
                            <button className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-[11px] bg-[#EFF6FF] px-3 py-1.5 rounded-lg transition-colors">Ver Laudo</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[11px] text-[#64748B] font-medium pt-2">Nenhum exame anexado.</p>
              )}
            </AccordionItem>
          </div>

          {/* Chat Component rendering inline here if isAttending is true */}
          {isAttending && initialData && onFinishAttendance && (
            <div className="mt-8 animate-in slide-in-from-bottom-8 duration-500 ease-out" id="chat-section">
              <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden border border-[#E2E8F0]">
                <ClinicalAttendance
                  patient={initialData}
                  onBack={onFinishAttendance}
                />
              </div>
            </div>
          )}

        </div>
      </div>



      {/* Telemedicine Video Call Overlay */}
      {showVideoCall && (
        <VideoCallOverlay
          patientName={patient.patientName}
          onClose={() => setShowVideoCall(false)}
        />
      )}

      {/* Floating Help Button - Hide when attending because the UI is already busy */}
      {!isAttending && (
        <div className="fixed bottom-8 right-8 flex items-center gap-4 z-40">
          <div className="bg-white rounded-full px-5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#E2E8F0] text-[11px] font-bold text-[#64748B] transition-opacity hover:opacity-90 cursor-pointer">
            Precisa de ajuda?
          </div>
          <button className="h-14 w-14 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[0_8px_16px_rgba(37,99,235,0.25)] flex items-center justify-center transition-transform hover:scale-105 relative">
            <Sparkles className="w-[22px] h-[22px]" />
            <span className="absolute top-3.5 right-3.5 w-[6px] h-[6px] bg-white rounded-full"></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;