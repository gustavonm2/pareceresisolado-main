import React, { useState, useEffect } from 'react';
import {
    Users, Calendar, MessageCircle, Filter, Search, Clock,
    CheckCircle, AlertCircle, FileText, Smartphone, MoreVertical, User2
} from 'lucide-react';
import { getOpinioes, getConsulta, confirmConsultaByDoctor, getTriagens, type StoredOpinion, type StoredConsulta, type StoredTriagem } from '../utils/patientStore';

const mockHistory = [
    { id: '1', patient: 'João Silva', date: '16/03/2026', time: '09:30', pathology: 'Hipertensão', risk: 'Baixo', status: 'Finalizado' },
    { id: '2', patient: 'Maria Souza', date: '16/03/2026', time: '10:15', pathology: 'Diabetes Tipo 2', risk: 'Médio', status: 'Aguardando Retorno' },
    { id: '3', patient: 'Carlos Rodrigues', date: '15/03/2026', time: '14:20', pathology: 'Cardiopatia', risk: 'Alto', status: 'Em Acompanhamento' },
    { id: '4', patient: 'Ana Oliveira', date: '14/03/2026', time: '11:00', pathology: 'Asma', risk: 'Baixo', status: 'Finalizado' },
];

const mockFeedbacks = [
    { id: '1', patient: 'Carlos Rodrigues', message: 'Doutor, a medicação nova me deu um pouco de náusea. Devo suspender?', time: '10 min atrás', unread: true },
    { id: '2', patient: 'Maria Souza', message: 'Minha glicemia em jejum de hoje foi 98. Estou muito feliz!', time: 'Ontem, 16:45', unread: false },
];

const mockAgenda = [
    { id: '1', patient: 'Roberto Alves', type: 'Retorno Online', date: '17/03/2026', time: '08:00', status: 'Confirmado' },
    { id: '2', patient: 'Juliana Costa', type: 'Primeira Consulta', date: '17/03/2026', time: '09:00', status: 'Aguardando' },
];

const ProfessionalWorkspace: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'historico' | 'agenda' | 'inbox' | 'pacientes'>('historico');
    const [storedPacientes, setStoredPacientes] = useState<StoredOpinion[]>([]);
    const [storedTriagens, setStoredTriagens] = useState<StoredTriagem[]>([]);
    const [consulta, setConsulta] = useState<StoredConsulta | null>(null);

    useEffect(() => {
        setStoredPacientes(getOpinioes());
        setStoredTriagens(getTriagens());
        setConsulta(getConsulta());
    }, []);

    const handleConfirmConsulta = () => {
        confirmConsultaByDoctor();
        setConsulta(getConsulta());
    };

    // Refresh triagens when tab is activated
    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        if (tab === 'pacientes') setStoredTriagens(getTriagens());
    };

    return (
        <div className="w-full bg-[#F1F5F9] min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[12px] font-bold text-[#0F172A] flex items-center">
                        <Users className="w-6 h-6 mr-3 text-[#2563EB]" />
                        Atendimentos e Pacientes
                    </h1>
                    <p className="text-[#64748B] text-[12px] font-medium mt-1">
                        Gerencie seu histórico, agenda de retornos e acompanhe o progresso dos pacientes.
                    </p>
                </div>

                {/* Dashboard Cards Minimal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0] flex items-center cursor-pointer hover:border-[#2563EB] transition-colors" onClick={() => setActiveTab('historico')}>
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mr-4">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-[#64748B] capitalize mb-1">Total Atendidos</p>
                            <h3 className="text-[14px] font-black text-[#0F172A] leading-none">128</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0] flex items-center cursor-pointer hover:border-[#F59E0B] transition-colors" onClick={() => setActiveTab('agenda')}>
                        <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center mr-4">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-[#b45309] capitalize mb-1">Agenda Amanhã</p>
                            <h3 className="text-[14px] font-black text-[#0F172A] leading-none">5</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E2E8F0] flex items-center cursor-pointer hover:border-[#10B981] transition-colors" onClick={() => setActiveTab('inbox')}>
                        <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mr-4 relative">
                            <MessageCircle className="w-5 h-5" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-[#047857] capitalize mb-1">Inbox WhatsApp</p>
                            <h3 className="text-[14px] font-black text-[#0F172A] leading-none">1 Novo</h3>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-[10px] shadow-sm border border-[#E2E8F0] mb-6 p-1 flex overflow-x-auto hide-scrollbar">
                    <button
                        onClick={() => setActiveTab('historico')}
                        className={`flex-1 flex items-center justify-center py-3 px-6 rounded-[16px] text-[12px] font-bold transition-colors whitespace-nowrap ${activeTab === 'historico' ? 'bg-[#F8FAFC] text-[#0F172A] shadow-sm ring-1 ring-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                            }`}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Histórico e Prontuários
                    </button>
                    <button
                        onClick={() => setActiveTab('agenda')}
                        className={`flex-1 flex items-center justify-center py-3 px-6 rounded-[16px] text-[12px] font-bold transition-colors whitespace-nowrap ${activeTab === 'agenda' ? 'bg-[#F8FAFC] text-[#0F172A] shadow-sm ring-1 ring-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                            }`}
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Agenda de Retornos
                    </button>
                    <button
                        onClick={() => setActiveTab('inbox')}
                        className={`flex-1 flex items-center justify-center py-3 px-6 rounded-[16px] text-[12px] font-bold transition-colors whitespace-nowrap ${activeTab === 'inbox' ? 'bg-[#F8FAFC] text-[#0F172A] shadow-sm ring-1 ring-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                            }`}
                    >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Inbox do Paciente
                    </button>
                    <button
                        onClick={() => handleTabChange('pacientes')}
                        className={`flex-1 flex items-center justify-center py-3 px-6 rounded-[16px] text-[12px] font-bold transition-colors whitespace-nowrap ${activeTab === 'pacientes' ? 'bg-[#F8FAFC] text-[#0F172A] shadow-sm ring-1 ring-[#E2E8F0]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                            }`}
                    >
                        <User2 className="w-4 h-4 mr-2" />
                        Pacientes
                        {(storedTriagens.length + storedPacientes.length) > 0 && (
                            <span className="ml-2 bg-[#2563EB] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{storedTriagens.length + storedPacientes.length}</span>
                        )}
                    </button>
                </div>

                {/* --- TAB CONTENT: HISTÓRICO --- */}
                {activeTab === 'historico' && (
                    <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden animate-in fade-in duration-300">
                        {/* Toolbar / Filters */}
                        <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row gap-4 justify-between md:items-center bg-white">
                            <div className="relative w-full md:w-80">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar paciente..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <select className="appearance-none pl-10 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] font-bold text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all cursor-pointer">
                                        <option value="">Filtro: Patologia</option>
                                        <option value="cardio">Cardiologia</option>
                                        <option value="endocrino">Endocrinologia</option>
                                    </select>
                                    <Filter className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
                                </div>
                                <div className="relative">
                                    <select className="appearance-none pl-10 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] font-bold text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all cursor-pointer">
                                        <option value="">Filtro: Risco</option>
                                        <option value="alto">Alto</option>
                                        <option value="medio">Médio</option>
                                        <option value="baixo">Baixo</option>
                                    </select>
                                    <AlertCircle className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table-container">
                                <thead>
                                    <tr>
                                        <th className="table-title">DATA / HORA</th>
                                        <th className="table-title">PACIENTE</th>
                                        <th className="table-title">PATOLOGIA PRINCIPAL</th>
                                        <th className="table-title">NÍVEL RISCO</th>
                                        <th className="table-title">STATUS ATUAL</th>
                                        <th className="table-title text-right">AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockHistory.map((item) => (
                                        <tr key={item.id} className="table-row-hover">
                                            <td className="table-text text-[11px] whitespace-nowrap font-medium text-[#475569]">
                                                {item.date} <span className="text-[#94A3B8] ml-1">{item.time}</span>
                                            </td>
                                            <td className="table-text text-[11px] whitespace-nowrap font-bold text-[#0F172A]">{item.patient}</td>
                                            <td className="table-text text-[11px] whitespace-nowrap text-[#475569]">{item.pathology}</td>
                                            <td className="table-text whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold capitalize ${item.risk === 'Alto' ? 'bg-[#FEF2F2] text-[#DC2626]' :
                                                    item.risk === 'Médio' ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-[#F0FDF4] text-[#16A34A]'
                                                    }`}>
                                                    {item.risk}
                                                </span>
                                            </td>
                                            <td className="table-text whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#F1F5F9] text-[#64748B] capitalize">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="table-text whitespace-nowrap text-right">
                                                <button className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-[11px] bg-[#EFF6FF] px-3 py-1.5 rounded-lg transition-colors">
                                                    Prontuário
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- TAB CONTENT: AGENDA DE RETORNOS --- */}
                {activeTab === 'agenda' && (
                    <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden animate-in fade-in duration-300">
                        <div className="p-6 border-b border-[#E2E8F0] bg-white">
                            <h2 className="text-[12px] font-bold text-[#0F172A]">Próximos Dias</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-container">
                                <thead className="bg-[#F8FAFC]">
                                    <tr>
                                        <th className="table-title">HORÁRIO</th>
                                        <th className="table-title">PACIENTE</th>
                                        <th className="table-title">TIPO RETORNO</th>
                                        <th className="table-title">STATUS</th>
                                        <th className="table-title text-right">AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Scheduled teleconsultation from patientStore */}
                                    {consulta && (
                                        <tr className="table-row-hover">
                                            <td className="table-text text-[11px] whitespace-nowrap font-medium text-[#475569]">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-[#94A3B8]" />
                                                    {consulta.date} <span className="text-[#94A3B8] font-normal ml-1 mr-2">às</span> {consulta.time}
                                                </div>
                                            </td>
                                            <td className="table-text text-[11px] whitespace-nowrap font-bold text-[#0F172A]">{consulta.patientName}</td>
                                            <td className="table-text text-[11px] whitespace-nowrap text-[#475569]">{consulta.type}</td>
                                            <td className="table-text whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold capitalize ${consulta.status === 'confirmado' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FFFBEB] text-[#D97706]'
                                                    }`}>
                                                    {consulta.status === 'confirmado'
                                                        ? <><CheckCircle className="w-3 h-3 mr-1" />Confirmado</>
                                                        : <><Clock className="w-3 h-3 mr-1" />Aguardando</>}
                                                </span>
                                            </td>
                                            <td className="table-text whitespace-nowrap text-right">
                                                {consulta.status !== 'confirmado' ? (
                                                    <button
                                                        onClick={handleConfirmConsulta}
                                                        className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-[11px] bg-[#EFF6FF] px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        Confirmar
                                                    </button>
                                                ) : (
                                                    <span className="text-[#10B981] font-bold text-[11px]">✓ Confirmado</span>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {mockAgenda.map((item) => (
                                        <tr key={item.id} className="table-row-hover">
                                            <td className="table-text text-[11px] whitespace-nowrap font-medium text-[#475569]">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-[#94A3B8]" />
                                                    {item.date} <span className="text-[#94A3B8] font-normal ml-1 mr-2">às</span> {item.time}
                                                </div>
                                            </td>
                                            <td className="table-text text-[11px] whitespace-nowrap font-bold text-[#0F172A]">{item.patient}</td>
                                            <td className="table-text text-[11px] whitespace-nowrap text-[#475569]">{item.type}</td>
                                            <td className="table-text whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold capitalize ${item.status === 'Confirmado' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FFFBEB] text-[#D97706]'
                                                    }`}>
                                                    {item.status === 'Confirmado' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="table-text whitespace-nowrap text-right">
                                                <button className="text-[#64748B] hover:text-[#0F172A] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors inline-block ml-auto">
                                                    <MoreVertical className="w-5 h-5 mx-auto" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!consulta && mockAgenda.length === 0 && (
                                        <tr><td colSpan={5} className="table-text text-center text-[#94A3B8] text-[11px] py-8">Nenhuma consulta agendada.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- TAB CONTENT: INBOX DO PACIENTE --- */}
                {activeTab === 'inbox' && (
                    <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden animate-in fade-in duration-300">
                        <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
                            <h2 className="text-[12px] font-bold text-[#0F172A] flex items-center">
                                <Smartphone className="w-5 h-5 mr-2 text-[#10B981]" />
                                Mensagens Recebidas (Feedbacks via Bot)
                            </h2>
                        </div>
                        <div className="divide-y divide-[#E2E8F0]">
                            {mockFeedbacks.map((msg) => (
                                <div key={msg.id} className={`p-6 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex gap-4 ${msg.unread ? 'bg-[#F1F5F9]/50' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline justify-between mb-1">
                                            <h4 className={`text-[11px] ${msg.unread ? 'font-black text-[#0F172A]' : 'font-bold text-[#334155]'}`}>
                                                {msg.patient}
                                            </h4>
                                            <span className="text-[11px] font-medium text-[#94A3B8]">{msg.time}</span>
                                        </div>
                                        <p className={`text-[11px] leading-relaxed truncate ${msg.unread ? 'font-medium text-[#334155]' : 'text-[#64748B]'}`}>
                                            {msg.message}
                                        </p>
                                    </div>
                                    {msg.unread && (
                                        <div className="flex-shrink-0 flex items-center">
                                            <div className="w-3 h-3 bg-[#2563EB] rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB CONTENT: MEUS PACIENTES --- */}
                {activeTab === 'pacientes' && (
                    <div className="space-y-6 animate-in fade-in duration-300">

                        {/* Triagens do Triador → Parecerista */}
                        <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E2E8F0] bg-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-[12px] font-bold text-[#0F172A] flex items-center">
                                        <Users className="w-5 h-5 mr-2 text-[#2563EB]" />
                                        Pacientes Encaminhados (Triagem)
                                    </h2>
                                    <p className="text-[11px] font-medium text-[#64748B] mt-1">Encaminhados pelo triador — aguardando parecer.</p>
                                </div>
                                <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[11px] font-bold px-3 py-1.5 rounded-lg">
                                    {storedTriagens.length} Paciente(s)
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table-container">
                                    <thead className="bg-[#F8FAFC]">
                                        <tr>
                                            <th className="table-title">PACIENTE</th>
                                            <th className="table-title">ESPECIALIDADE</th>
                                            <th className="table-title">PRIORIDADE</th>
                                            <th className="table-title">HIPÓTESE DIAGNÓSTICA</th>
                                            <th className="table-title">MODALIDADE</th>
                                            <th className="table-title">ENCAMINHADO EM</th>
                                            <th className="table-title text-right">AÇÃO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storedTriagens.length > 0 ? storedTriagens.map((t) => (
                                            <tr key={t.id} className="table-row-hover">
                                                <td className="table-text whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[11px] font-black flex-shrink-0">
                                                            {t.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-bold text-[#0F172A]">{t.patientName}</p>
                                                            <p className="text-[10px] font-medium text-[#94A3B8]">{t.cpf} · {t.age} anos</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="table-text text-[11px] whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB]">{t.especialidade}</span>
                                                </td>
                                                <td className="table-text whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold capitalize border ${
                                                        t.priority === 'Alta' ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]' :
                                                        t.priority === 'Média' ? 'bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]' :
                                                        'bg-[#ECFDF5] text-[#059669] border-[#6EE7B7]'
                                                    }`}>
                                                        {t.priority === 'Alta' && <AlertCircle className="w-3 h-3" />}
                                                        {t.priority}
                                                    </span>
                                                </td>
                                                <td className="table-text text-[11px] text-[#475569] max-w-[200px] truncate" title={t.hipotese}>{t.hipotese}</td>
                                                <td className="table-text text-[11px] whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold ${
                                                        t.modalidade === 'online' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#F5F3FF] text-[#7C3AED]'
                                                    }`}>
                                                        {t.modalidade === 'online' ? 'Teleconsulta' : 'Parecer Assíncrono'}
                                                    </span>
                                                </td>
                                                <td className="table-text text-[11px] whitespace-nowrap font-medium text-[#64748B]">{t.triadoEm}</td>
                                                <td className="table-text whitespace-nowrap text-right">
                                                    <button className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-[11px] bg-[#EFF6FF] px-3 py-1.5 rounded-lg transition-colors">
                                                        Iniciar Parecer
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={7} className="table-text text-center text-[#94A3B8] text-[11px] py-12">
                                                    <Users className="w-8 h-8 mx-auto mb-3 text-[#CBD5E1]" />
                                                    Nenhum paciente encaminhado pelo triador ainda.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pareceres já emitidos */}
                        {storedPacientes.length > 0 && (
                            <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden">
                                <div className="px-6 py-5 border-b border-[#E2E8F0] bg-white flex justify-between items-center">
                                    <div>
                                        <h2 className="text-[12px] font-bold text-[#0F172A] flex items-center">
                                            <FileText className="w-5 h-5 mr-2 text-[#10B981]" />
                                            Pareceres Emitidos
                                        </h2>
                                        <p className="text-[11px] font-medium text-[#64748B] mt-1">Pareceres já finalizados e enviados ao prontuário.</p>
                                    </div>
                                    <span className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[11px] font-bold px-3 py-1.5 rounded-lg">
                                        {storedPacientes.length} Parecer(es)
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table-container">
                                        <thead className="bg-[#F8FAFC]">
                                            <tr>
                                                <th className="table-title">PACIENTE</th>
                                                <th className="table-title">ESPECIALIDADE</th>
                                                <th className="table-title">MÉDICO</th>
                                                <th className="table-title">DATA PARECER</th>
                                                <th className="table-title text-right">PRONTUÁRIO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {storedPacientes.map((p) => (
                                                <tr key={p.id} className="table-row-hover">
                                                    <td className="table-text whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center text-[11px] font-black flex-shrink-0">
                                                                {p.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                            </div>
                                                            <span className="text-[11px] font-bold text-[#0F172A]">{p.patientName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="table-text text-[11px] whitespace-nowrap text-[#475569]">{p.specialty}</td>
                                                    <td className="table-text text-[11px] whitespace-nowrap text-[#475569]">{p.doctor}</td>
                                                    <td className="table-text text-[11px] whitespace-nowrap font-medium text-[#64748B]">{p.date}</td>
                                                    <td className="table-text whitespace-nowrap text-right">
                                                        <button className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-[11px] bg-[#EFF6FF] px-3 py-1.5 rounded-lg transition-colors">
                                                            Ver Prontuário
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProfessionalWorkspace;
