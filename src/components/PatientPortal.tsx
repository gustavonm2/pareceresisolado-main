import React, { useState, useEffect } from 'react';
import {
    User, Phone, Mail, Calendar,
    CheckCircle, Clock, AlertCircle, Shield,
    Bell, PlusCircle, Star
} from 'lucide-react';
import VideoCallOverlay from './VideoCallOverlay';
import NovaConsultaModal from './NovaConsultaModal';
import RatingModal from './RatingModal';
import {
    getOpinioes, markOpiniaoAsRead, seedMockRatings,
    type StoredOpinion
} from '../utils/patientStore';

// ─── Mock data specific to the patient portal ───────────────────────────────

const MOCK_PATIENT_INFO = {
    name: 'Carlos Eduardo Lima',
    initials: 'CE',
    birthDate: '14/03/1985',
    age: 41,
    cpf: '***.***.456-**',
    phone: '(11) 98765-4321',
    email: 'carlos.lima@email.com',
    city: 'São Paulo - SP',
    bloodType: 'A+',
    status: 'Ativo',
};

const MOCK_OPINIONS = [
    {
        id: 'op1',
        specialty: 'Cardiologia',
        doctor: 'Dr. Marcelo Ferreira',
        date: '10/03/2026',
        status: 'Emitido',
        summary:
            'Paciente com dor torácica atípica. ECG sem alterações isquêmicas agudas. Recomendo acompanhamento ambulatorial com Holter 24h e ecocardiograma. Uso de AAS 100mg/dia.',
    },
    {
        id: 'op2',
        specialty: 'Clínica Geral',
        doctor: 'Dra. Ana Paula Rocha',
        date: '02/02/2026',
        status: 'Emitido',
        summary:
            'Queixa de cefaleia crônica. Sem sinais de alarme. Indicado uso de analgésico simples e hidratação adequada. Retorno em 30 dias.',
    },
];

const MOCK_PRESCRIPTIONS = [
    { id: 'rx1', date: '10/03/2026', doctor: 'Dr. Marcelo Ferreira', meds: ['AAS 100mg – 1 comprimido ao dia, após o jantar', 'Atenolol 25mg – 1 comprimido ao dia, pela manhã'] },
    { id: 'rx2', date: '02/02/2026', doctor: 'Dra. Ana Paula Rocha', meds: ['Dipirona 500mg – 1 comprimido a cada 8h se dor (máx. 3 dias)', 'Escalon 15mg – 1 comprimido ao deitar se necessário'] },
];

const MOCK_EXAMS = [
    { id: 'ex1', name: 'Holter 24 horas', requestDate: '10/03/2026', doctor: 'Dr. Marcelo Ferreira', status: 'Pendente' },
    { id: 'ex2', name: 'Ecocardiograma Transtorácico', requestDate: '10/03/2026', doctor: 'Dr. Marcelo Ferreira', status: 'Pendente' },
    { id: 'ex3', name: 'Hemograma Completo', requestDate: '02/02/2026', doctor: 'Dra. Ana Paula Rocha', status: 'Coletado' },
    { id: 'ex4', name: 'Glicemia em Jejum', requestDate: '02/02/2026', doctor: 'Dra. Ana Paula Rocha', status: 'Coletado' },
];

const MOCK_HISTORY = [
    { id: 'h1', date: '10/03/2026', specialty: 'Cardiologia', doctor: 'Dr. Marcelo Ferreira', complaint: 'Dor torácica atípica e palpitações ocasionais há 2 semanas.' },
    { id: 'h2', date: '02/02/2026', specialty: 'Clínica Geral', doctor: 'Dra. Ana Paula Rocha', complaint: 'Cefaleia frontal recorrente há 15 dias, sem febre.' },
    { id: 'h3', date: '12/11/2025', specialty: 'Clínica Geral', doctor: 'Dr. Ricardo Lemos', complaint: 'Check-up anual de rotina. Sem queixas.' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────


// Table helper
const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <th className={`text-left text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-4 py-3 bg-[#F8FAFC] whitespace-nowrap ${className}`}>{children}</th>
);
const Td: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <td className={`px-4 py-3 text-[12px] border-b border-[#F1F5F9] ${className}`}>{children}</td>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const map: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
        'Emitido': { bg: 'bg-[#D1FAE5] text-[#065F46]', text: 'Emitido', icon: CheckCircle },
        'Aguardando': { bg: 'bg-[#FEF3C7] text-[#92400E]', text: 'Aguardando', icon: Clock },
        'Pendente': { bg: 'bg-[#FEF3C7] text-[#92400E]', text: 'Pendente', icon: Clock },
        'Coletado': { bg: 'bg-[#D1FAE5] text-[#065F46]', text: 'Coletado', icon: CheckCircle },
        'Ativo': { bg: 'bg-[#DBEAFE] text-[#1E40AF]', text: 'Ativo', icon: Shield },
    };
    const cfg = map[status] || { bg: 'bg-[#F1F5F9] text-[#475569]', text: status, icon: AlertCircle };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg}`}>
            <Icon className="w-3 h-3" />
            {cfg.text}
        </span>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const PatientPortal: React.FC = () => {
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [showNovaConsulta, setShowNovaConsulta] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [ratingDoctor, setRatingDoctor] = useState<{ name: string; specialty: string; consultaId: string } | null>(null);
    const [storedOpinioes, setStoredOpinioes] = useState<StoredOpinion[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        setStoredOpinioes(getOpinioes());
        seedMockRatings();
    }, []);

    // Listen for tab selection dispatched by the sidebar
    useEffect(() => {
        const handler = (e: Event) => {
            const tab = (e as CustomEvent<string>).detail;
            setActiveTab(tab);
            // Sync sidebar highlight back
            window.dispatchEvent(new CustomEvent('patient-section-change', { detail: tab }));
        };
        window.addEventListener('patient-tab-select', handler);
        return () => window.removeEventListener('patient-tab-select', handler);
    }, []);

    const handleMarkRead = (id: string) => {
        markOpiniaoAsRead(id);
        setStoredOpinioes(prev => prev.map(o => o.id === id ? { ...o, isNew: false } : o));
    };


    const allOpinioes = [
        ...storedOpinioes,
        ...MOCK_OPINIONS.map(o => ({ ...o, patientId: 'mock', isNew: false })),
    ];
    const hasNew = storedOpinioes.some(o => o.isNew);

    return (
        <div className="w-full bg-[#F1F5F9] min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

                {/* ── Profile Header ── */}
                <div className="bg-white rounded-[14px] shadow-sm border border-[#E2E8F0] p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#1D3461] to-[#162749] text-white flex items-center justify-center font-bold text-[26px] shadow-md">
                            {MOCK_PATIENT_INFO.initials}
                        </div>
                        <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className="text-[20px] font-black text-[#0F172A] tracking-tight">{MOCK_PATIENT_INFO.name}</h1>
                            <StatusBadge status={MOCK_PATIENT_INFO.status} />
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-[#64748B] font-medium mt-1">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {MOCK_PATIENT_INFO.birthDate} ({MOCK_PATIENT_INFO.age} anos)</span>
                            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> CPF: {MOCK_PATIENT_INFO.cpf}</span>
                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {MOCK_PATIENT_INFO.phone}</span>
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {MOCK_PATIENT_INFO.email}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <span className="bg-[#EEF4FA] text-[#1D3461] text-[11px] font-bold px-2.5 py-1 rounded-lg">Tipo sanguíneo: {MOCK_PATIENT_INFO.bloodType}</span>
                            <span className="bg-[#F1F5F9] text-[#475569] text-[11px] font-bold px-2.5 py-1 rounded-lg">{MOCK_PATIENT_INFO.city}</span>
                        </div>
                    </div>

                    {/* Nova Consulta CTA */}
                    <div className="flex-shrink-0 self-center sm:self-auto">
                        <button
                            onClick={() => setShowNovaConsulta(true)}
                            className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-bold text-[14px] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #1D3461 0%, #7C3AED 100%)' }}
                        >
                            {/* Pulse ring */}
                            <span className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ background: 'linear-gradient(135deg, #1D3461 0%, #7C3AED 100%)' }} />
                            <PlusCircle className="w-5 h-5" />
                            Nova Consulta
                        </button>
                    </div>

                </div>


                {/* ── Active Tab Panel ── */}
                {activeTab && (
                    <div className="bg-white rounded-[12px] shadow-sm border border-[#E2E8F0] overflow-hidden mb-6 animate-[fadeIn_0.15s_ease]">

                        {/* Panel header */}
                        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between"
                            style={{ borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: {
                                prontuario: '#1D3461', medicacoes: '#6366F1', historico: '#F59E0B',
                                pareceres: '#10B981', prescricoes: '#8B5CF6', exames: '#0EA5E9'
                            }[activeTab] }}
                        >
                            <h2 className="text-[12px] font-bold text-[#0F172A] tracking-wide uppercase">{{
                                prontuario:   'Prontuário – Histórico de Consultas',
                                medicacoes:   'Medicações em Uso Contínuo',
                                historico:    'Histórico de Saúde',
                                pareceres:    'Pareceres Médicos',
                                prescricoes:  'Prescrições',
                                exames:       'Solicitação de Exames',
                            }[activeTab]}</h2>
                        </div>

                        {/* Panel body */}
                        <div className="p-0">
                            <div className="overflow-x-auto">

                                {/* Prontuário */}
                                {activeTab === 'prontuario' && (
                                    <table className="w-full">
                                        <thead><tr>
                                            <Th>Data</Th><Th>Especialidade</Th><Th>Médico</Th><Th>Queixa Principal</Th><Th>Avaliar</Th>
                                        </tr></thead>
                                        <tbody>{MOCK_HISTORY.map(item => (
                                            <tr key={item.id} className="hover:bg-[#F8FAFC]">
                                                <Td className="whitespace-nowrap text-[#64748B] font-medium">{item.date}</Td>
                                                <Td className="whitespace-nowrap"><span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#EEF4FA] text-[#1D3461]">{item.specialty}</span></Td>
                                                <Td className="whitespace-nowrap font-medium text-[#334155]">{item.doctor}</Td>
                                                <Td className="text-[#475569] font-medium">{item.complaint}</Td>
                                                <Td>
                                                    <button
                                                        onClick={() => { setRatingDoctor({ name: item.doctor, specialty: item.specialty, consultaId: item.id }); setShowRating(true); }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] transition-colors whitespace-nowrap"
                                                    >
                                                        <Star className="w-3 h-3" fill="#F59E0B" stroke="#F59E0B" />
                                                        Avaliar
                                                    </button>
                                                </Td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                )}


                                {/* Medicações */}
                                {activeTab === 'medicacoes' && (
                                    <table className="w-full">
                                        <thead><tr><Th>#</Th><Th>Medicamento / Posologia</Th><Th>Tipo</Th></tr></thead>
                                        <tbody>{[
                                            'Losartana 50mg – 1 comprimido ao dia',
                                            'Atenolol 25mg – 1 comprimido ao dia, pela manhã',
                                            'AAS 100mg – 1 comprimido ao dia, após o jantar',
                                        ].map((med, i) => (
                                            <tr key={i} className="hover:bg-[#F8FAFC]">
                                                <Td className="text-[#94A3B8] font-bold w-8">{i + 1}</Td>
                                                <Td className="font-bold text-[#0F172A]">{med}</Td>
                                                <Td><span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#EEF2FF] text-[#6366F1]">Uso Contínuo</span></Td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                )}

                                {/* Histórico de Saúde */}
                                {activeTab === 'historico' && (
                                    <table className="w-full">
                                        <thead><tr><Th>#</Th><Th>Condição / Informação</Th><Th>Categoria</Th></tr></thead>
                                        <tbody>{[
                                            { cond: 'Hipertensão Arterial Sistêmica', cat: 'Doença Crônica' },
                                            { cond: 'Dislipidemia mista', cat: 'Doença Crônica' },
                                            { cond: 'Sem alergias medicamentosas conhecidas', cat: 'Alergias' },
                                            { cond: 'Apêndicectomia (aos 20 anos)', cat: 'Cirurgia' },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-[#F8FAFC]">
                                                <Td className="text-[#94A3B8] font-bold w-8">{i + 1}</Td>
                                                <Td className="font-bold text-[#0F172A]">{row.cond}</Td>
                                                <Td><span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#FEF3C7] text-[#92400E]">{row.cat}</span></Td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                )}

                                {/* Pareceres */}
                                {activeTab === 'pareceres' && (
                                    <>
                                        {hasNew && (
                                            <div className="mx-6 my-4 flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-4 py-3">
                                                <Bell className="w-4 h-4 text-[#059669]" />
                                                <p className="text-[12px] font-bold text-[#065F46]">Você tem {storedOpinioes.filter(o => o.isNew).length} novo(s) parecer(es).</p>
                                            </div>
                                        )}
                                        <table className="w-full">
                                            <thead><tr>
                                                <Th>Data</Th><Th>Especialidade</Th><Th>Médico</Th><Th>Resumo do Parecer</Th><Th>Status</Th>
                                            </tr></thead>
                                            <tbody>
                                                {allOpinioes.map(op => (
                                                    <tr key={op.id}
                                                        className={`cursor-pointer transition-colors ${op.isNew ? 'bg-[#F0FDF4] hover:bg-[#DCFCE7]' : 'hover:bg-[#F8FAFC]'}`}
                                                        onClick={() => op.isNew && handleMarkRead(op.id)}
                                                    >
                                                        <Td className="whitespace-nowrap text-[#64748B] font-medium">{op.date}</Td>
                                                        <Td className="whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#ECFDF5] text-[#065F46]">{op.specialty}</span>
                                                                {op.isNew && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981] text-white"><Bell className="w-2.5 h-2.5" /> Novo</span>}
                                                            </div>
                                                        </Td>
                                                        <Td className="whitespace-nowrap font-medium text-[#334155]">{op.doctor}</Td>
                                                        <Td className="text-[#475569] font-medium max-w-xs">{op.summary}</Td>
                                                        <Td><StatusBadge status="Emitido" /></Td>
                                                    </tr>
                                                ))}
                                                {allOpinioes.length === 0 && (
                                                    <tr><td colSpan={5} className="px-4 py-6 text-center text-[12px] text-[#94A3B8] font-medium">Nenhum parecer emitido ainda.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {/* Prescrições */}
                                {activeTab === 'prescricoes' && (
                                    <table className="w-full">
                                        <thead><tr><Th>Data</Th><Th>Médico Prescritor</Th><Th>Medicamento / Posologia</Th></tr></thead>
                                        <tbody>{MOCK_PRESCRIPTIONS.flatMap(rx =>
                                            rx.meds.map((med, i) => (
                                                <tr key={`${rx.id}-${i}`} className="hover:bg-[#F8FAFC]">
                                                    <Td className="whitespace-nowrap text-[#64748B] font-medium align-top">{i === 0 ? rx.date : ''}</Td>
                                                    <Td className="whitespace-nowrap font-medium text-[#334155] align-top">{i === 0 ? rx.doctor : ''}</Td>
                                                    <Td className="text-[#0F172A] font-medium">{med}</Td>
                                                </tr>
                                            ))
                                        )}</tbody>
                                    </table>
                                )}

                                {/* Exames */}
                                {activeTab === 'exames' && (
                                    <table className="w-full">
                                        <thead><tr><Th>Exame</Th><Th>Médico Solicitante</Th><Th>Data Solicitação</Th><Th>Status</Th></tr></thead>
                                        <tbody>{MOCK_EXAMS.map(exam => (
                                            <tr key={exam.id} className="hover:bg-[#F8FAFC]">
                                                <Td className="font-bold text-[#0F172A]">{exam.name}</Td>
                                                <Td className="whitespace-nowrap font-medium text-[#475569]">{exam.doctor}</Td>
                                                <Td className="whitespace-nowrap font-medium text-[#64748B]">{exam.requestDate}</Td>
                                                <Td><StatusBadge status={exam.status} /></Td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                )}

                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Video Call Overlay */}
            {showVideoCall && (
                <VideoCallOverlay
                    patientName={MOCK_PATIENT_INFO.name}
                    onClose={() => setShowVideoCall(false)}
                />
            )}

            {/* Nova Consulta Modal */}
            {showNovaConsulta && (
                <NovaConsultaModal onClose={() => setShowNovaConsulta(false)} />
            )}

            {/* Rating Modal */}
            {showRating && ratingDoctor && (
                <RatingModal
                    doctorName={ratingDoctor.name}
                    doctorSpecialty={ratingDoctor.specialty}
                    team="Clínica SCI"
                    consultaId={ratingDoctor.consultaId}
                    patientName={MOCK_PATIENT_INFO.name}
                    onClose={() => { setShowRating(false); setRatingDoctor(null); }}
                />
            )}
        </div>
    );
};

export default PatientPortal;
