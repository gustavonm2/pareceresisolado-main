import React, { useState } from 'react';
import {
    X, User, Calendar, Clock, AlertCircle, ChevronDown,
    Activity, Stethoscope, CheckCircle, Send
} from 'lucide-react';
import { addTriagem } from '../utils/patientStore';

interface PatientInfo {
    id: number;
    name: string;
    age: number;
    cpf: string;
    date: string;
    time: string;
    symptoms: string;
    priority: 'Alta' | 'Média' | 'Baixa';
}

interface TriagemDrawerProps {
    patient: PatientInfo;
    onClose: () => void;
    onSubmit: (patientId: number) => void; // called after triagem is saved → marks row as "Encaminhado"
}

const ESPECIALIDADES = [
    'Cardiologia', 'Clínica Geral', 'Endocrinologia', 'Neurologia',
    'Pneumologia', 'Ortopedia', 'Dermatologia', 'Ginecologia',
    'Urologia', 'Psiquiatria', 'Gastroenterologia', 'Reumatologia',
];

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
    <label className="block text-[11px] font-bold text-[#334155] mb-1.5">
        {children} {required && <span className="text-[#C0392B]">*</span>}
    </label>
);

const inputCls = (err?: boolean) =>
    `w-full px-3 py-2 text-[11px] font-medium text-[#0F172A] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3461] transition-all ${err ? 'border-[#C0392B]' : 'border-[#CBD5E1]'}`;

const TriagemDrawer: React.FC<TriagemDrawerProps> = ({ patient, onClose, onSubmit }) => {
    const [priority, setPriority] = useState<'Alta' | 'Média' | 'Baixa'>(patient.priority);
    const [pa, setPa] = useState('');
    const [fc, setFc] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [spo2, setSpo2] = useState('');
    const [queixaDetalhada, setQueixaDetalhada] = useState(patient.symptoms);
    const [hipotese, setHipotese] = useState('');
    const [modalidade, setModalidade] = useState<'online' | 'parecer'>('parecer');
    const [especialidade, setEspecialidade] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});



    const validate = () => {
        const e: Record<string, boolean> = {};
        if (!queixaDetalhada.trim()) e.queixaDetalhada = true;
        if (!hipotese.trim()) e.hipotese = true;
        if (!especialidade) e.especialidade = true;
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        addTriagem({
            patientId: String(patient.id),
            patientName: patient.name,
            cpf: patient.cpf,
            age: patient.age,
            initialSymptoms: patient.symptoms,
            cadastroDate: patient.date,
            cadastroTime: patient.time,
            priority,
            pa,
            fc,
            temperatura,
            spo2,
            queixaDetalhada,
            hipotese,
            modalidade,
            especialidade,
            observacoes,
            triadoPor: 'Enfermeiro(a) Triador(a)',
        });

        setSubmitted(true);
        setTimeout(() => {
            onSubmit(patient.id);
            onClose();
        }, 1800);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="fixed top-0 right-0 h-full w-full max-w-[560px] bg-[#F8FAFC] shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {/* Header */}
                <div className="bg-white border-b border-[#E2E8F0] px-6 py-5 flex items-start justify-between flex-shrink-0">
                    <div>
                        <p className="text-[10px] font-bold text-[#1D3461] uppercase tracking-widest mb-1">Triagem</p>
                        <h2 className="text-[14px] font-black text-[#0F172A] leading-tight">{patient.name}</h2>
                        <p className="text-[11px] font-medium text-[#64748B] mt-0.5">{patient.cpf} · {patient.age} anos</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#475569] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Submitted success state */}
                {submitted ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                        <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-[#10B981]" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-[14px] font-black text-[#0F172A] mb-1">Triagem Encaminhada!</h3>
                            <p className="text-[12px] font-medium text-[#64748B]">
                                {patient.name} aparecerá no painel do Parecerista em instantes.
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        {/* Bloco 1 — Dados pré-preenchidos */}
                        <div className="px-6 py-5 bg-white border-b border-[#E2E8F0]">
                            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" /> Dados do Paciente
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-[11px]">
                                <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                                    <div className="flex items-center gap-1.5 text-[#94A3B8] mb-1">
                                        <Calendar className="w-3 h-3" /> <span className="font-bold uppercase tracking-wide text-[9px]">Cadastro</span>
                                    </div>
                                    <p className="font-bold text-[#0F172A]">{patient.date}</p>
                                    <p className="font-medium text-[#64748B] flex items-center gap-1 mt-0.5">
                                        <Clock className="w-3 h-3" /> {patient.time}
                                    </p>
                                </div>
                                <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                                    <div className="flex items-center gap-1.5 text-[#94A3B8] mb-1">
                                        <AlertCircle className="w-3 h-3" /> <span className="font-bold uppercase tracking-wide text-[9px]">Queixa inicial</span>
                                    </div>
                                    <p className="font-medium text-[#334155] leading-snug">{patient.symptoms}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bloco 2 — Avaliação Clínica */}
                        <div className="px-6 py-5 space-y-4">
                            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5" /> Avaliação Clínica
                            </p>

                            {/* Prioridade */}
                            <div>
                                <Label required>Prioridade Sistêmica</Label>
                                <div className="flex gap-2">
                                    {(['Alta', 'Média', 'Baixa'] as const).map(p => {
                                        const isActive = priority === p;
                                        const activeStyles: Record<string, { bg: string; text: string; border: string }> = {
                                            Alta:  { bg: '#FEE2E2', text: '#C0392B', border: '#FCA5A5' },
                                            Média: { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D' },
                                            Baixa: { bg: '#ECFDF5', text: '#059669', border: '#6EE7B7' },
                                        };
                                        return (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className="flex-1 py-2 rounded-lg text-[11px] font-bold transition-all"
                                                style={{
                                                    backgroundColor: isActive ? activeStyles[p].bg : '#FFFFFF',
                                                    color: isActive ? activeStyles[p].text : '#94A3B8',
                                                    border: `1px solid ${isActive ? activeStyles[p].border : '#E2E8F0'}`,
                                                    boxShadow: isActive
                                                        ? 'inset 2px 2px 5px rgba(0,0,0,0.07), inset -2px -2px 5px rgba(255,255,255,0.65)'
                                                        : 'none',
                                                    fontWeight: isActive ? 700 : 500,
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sinais vitais */}
                            <div>
                                <Label>Sinais Vitais</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-[10px] font-bold text-[#94A3B8] mb-1">PA (mmHg)</p>
                                        <input
                                            type="text"
                                            placeholder="ex: 120/80"
                                            className={inputCls()}
                                            value={pa}
                                            onChange={e => setPa(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#94A3B8] mb-1">FC (bpm)</p>
                                        <input
                                            type="text"
                                            placeholder="ex: 72"
                                            className={inputCls()}
                                            value={fc}
                                            onChange={e => setFc(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#94A3B8] mb-1">Temperatura (°C)</p>
                                        <input
                                            type="text"
                                            placeholder="ex: 36.5"
                                            className={inputCls()}
                                            value={temperatura}
                                            onChange={e => setTemperatura(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#94A3B8] mb-1">SpO₂ (%)</p>
                                        <input
                                            type="text"
                                            placeholder="ex: 98"
                                            className={inputCls()}
                                            value={spo2}
                                            onChange={e => setSpo2(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Queixa detalhada */}
                            <div>
                                <Label required>Queixa Principal Detalhada</Label>
                                <textarea
                                    rows={3}
                                    placeholder="Descreva a queixa com maior detalhamento clínico..."
                                    className={inputCls(errors.queixaDetalhada) + ' resize-none'}
                                    value={queixaDetalhada}
                                    onChange={e => { setQueixaDetalhada(e.target.value); if (errors.queixaDetalhada) setErrors(p => ({ ...p, queixaDetalhada: false })); }}
                                />
                                {errors.queixaDetalhada && <p className="text-[10px] text-[#C0392B] font-medium mt-1">Campo obrigatório</p>}
                            </div>

                            {/* Hipótese diagnóstica */}
                            <div>
                                <Label required>Hipótese Diagnóstica</Label>
                                <textarea
                                    rows={2}
                                    placeholder="ex: Síndrome coronariana aguda / IVAS / HAS descompensada..."
                                    className={inputCls(errors.hipotese) + ' resize-none'}
                                    value={hipotese}
                                    onChange={e => { setHipotese(e.target.value); if (errors.hipotese) setErrors(p => ({ ...p, hipotese: false })); }}
                                />
                                {errors.hipotese && <p className="text-[10px] text-[#C0392B] font-medium mt-1">Campo obrigatório</p>}
                            </div>

                            {/* Modalidade */}
                            <div>
                                <Label required>Modalidade de Atendimento</Label>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 py-2.5 text-[11px] font-medium text-[#0F172A] border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3461] appearance-none bg-white transition-all cursor-pointer"
                                        value={modalidade}
                                        onChange={e => setModalidade(e.target.value as 'online' | 'parecer')}
                                    >
                                        <option value="parecer">Parecer Assíncrono — Resposta via plataforma</option>
                                        <option value="online">Teleconsulta Online — Agendamento via WhatsApp</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                                </div>
                            </div>
                            </div>

                        {/* Bloco 3 — Encaminhamento */}
                        <div className="px-6 py-5 space-y-4 bg-white border-t border-[#E2E8F0]">
                            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-1.5">
                                <Stethoscope className="w-3.5 h-3.5" /> Encaminhamento
                            </p>

                            {/* Especialidade */}
                            <div>
                                <Label required>Especialidade Solicitada</Label>
                                <div className="relative">
                                    <select
                                        className={inputCls(errors.especialidade) + ' appearance-none pr-8'}
                                        value={especialidade}
                                        onChange={e => { setEspecialidade(e.target.value); if (errors.especialidade) setErrors(p => ({ ...p, especialidade: false })); }}
                                    >
                                        <option value="">Selecionar especialidade...</option>
                                        {ESPECIALIDADES.map(esp => (
                                            <option key={esp} value={esp}>{esp}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                                </div>
                                {errors.especialidade && <p className="text-[10px] text-[#C0392B] font-medium mt-1">Selecione uma especialidade</p>}
                            </div>

                            {/* Observações */}
                            <div>
                                <Label>Observações Adicionais <span className="text-[#94A3B8] font-medium">(opcional)</span></Label>
                                <textarea
                                    rows={2}
                                    placeholder="Informações complementares para o parecerista..."
                                    className={inputCls() + ' resize-none'}
                                    value={observacoes}
                                    onChange={e => setObservacoes(e.target.value)}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full py-3.5 bg-[#1D3461] hover:bg-[#162749] text-white rounded-xl font-bold text-[12px] shadow-[0_4px_12px_rgba(29,52,97,0.25)] transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Encaminhar para Parecer
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default TriagemDrawer;
