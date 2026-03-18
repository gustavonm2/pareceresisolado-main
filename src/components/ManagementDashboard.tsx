import React, { useState } from 'react';
import {
    BarChart2, TrendingUp, Users, MessageSquare, Clock,
    CheckCircle, Calendar, Plus, Trash2, Save, ChevronDown
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TimeSlot {
    id: string;
    start: string;
    end: string;
}

interface DayConfig {
    enabled: boolean;
    slots: TimeSlot[];
}

type WeekSchedule = Record<string, DayConfig>;

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DAY_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const DURATIONS = ['30 min', '45 min', '60 min', '90 min'];

const DEFAULT_SCHEDULE: WeekSchedule = {
    Segunda: { enabled: true,  slots: [{ id: 's1', start: '08:00', end: '12:00' }, { id: 's2', start: '14:00', end: '17:00' }] },
    Terça:   { enabled: true,  slots: [{ id: 't1', start: '08:00', end: '12:00' }] },
    Quarta:  { enabled: false, slots: [] },
    Quinta:  { enabled: true,  slots: [{ id: 'q1', start: '09:00', end: '12:00' }, { id: 'q2', start: '14:00', end: '18:00' }] },
    Sexta:   { enabled: true,  slots: [{ id: 'x1', start: '08:00', end: '12:00' }] },
    Sábado:  { enabled: false, slots: [] },
};

// ── Sub-component: Time Slot Row ──────────────────────────────────────────────

const SlotRow: React.FC<{
    slot: TimeSlot;
    onUpdate: (id: string, field: 'start' | 'end', val: string) => void;
    onRemove: (id: string) => void;
}> = ({ slot, onUpdate, onRemove }) => (
    <div className="flex items-center gap-2 group">
        <input
            type="time"
            value={slot.start}
            onChange={e => onUpdate(slot.id, 'start', e.target.value)}
            className="w-[100px] px-2.5 py-1.5 text-[11px] font-bold text-[#0F172A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] hover:border-[#94A3B8] transition-all"
        />
        <span className="text-[11px] font-bold text-[#94A3B8]">até</span>
        <input
            type="time"
            value={slot.end}
            onChange={e => onUpdate(slot.id, 'end', e.target.value)}
            className="w-[100px] px-2.5 py-1.5 text-[11px] font-bold text-[#0F172A] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] hover:border-[#94A3B8] transition-all"
        />
        <button
            onClick={() => onRemove(slot.id)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] opacity-0 group-hover:opacity-100 transition-all"
            title="Remover horário"
        >
            <Trash2 className="w-3.5 h-3.5" />
        </button>
    </div>
);

// ── Agenda Section Component ──────────────────────────────────────────────────

const AgendaSection: React.FC = () => {
    const [schedule, setSchedule] = useState<WeekSchedule>(DEFAULT_SCHEDULE);
    const [duration, setDuration] = useState('60 min');
    const [saved, setSaved] = useState(false);

    const toggleDay = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                enabled: !prev[day].enabled,
                slots: !prev[day].enabled && prev[day].slots.length === 0
                    ? [{ id: `${day}-${Date.now()}`, start: '08:00', end: '12:00' }]
                    : prev[day].slots,
            }
        }));
    };

    const addSlot = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: [
                    ...prev[day].slots,
                    { id: `${day}-${Date.now()}`, start: '14:00', end: '18:00' }
                ]
            }
        }));
    };

    const updateSlot = (day: string, id: string, field: 'start' | 'end', val: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.map(s => s.id === id ? { ...s, [field]: val } : s)
            }
        }));
    };

    const removeSlot = (day: string, id: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.filter(s => s.id !== id)
            }
        }));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const enabledDaysCount = Object.values(schedule).filter(d => d.enabled).length;
    const totalSlots = Object.values(schedule).reduce((acc, d) => acc + (d.enabled ? d.slots.length : 0), 0);

    return (
        <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden">

            {/* Card Header */}
            <div className="px-6 py-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: '#2563EB' }}>
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <Calendar className="w-4 h-4 text-[#2563EB]" />
                        <h2 className="text-[12px] font-bold text-[#0F172A] uppercase tracking-wide">Minha Agenda de Disponibilidade</h2>
                    </div>
                    <p className="text-[11px] font-medium text-[#64748B]">
                        Configure os dias e horários disponíveis para teleconsultas.
                        Os slots serão enviados ao paciente via WhatsApp para agendamento.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-bold text-[11px] transition-all shadow-sm ${saved ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]' : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:scale-[1.01]'}`}
                >
                    {saved ? <><CheckCircle className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar Agenda</>}
                </button>
            </div>

            {/* Summary Chips */}
            <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                    {enabledDaysCount} dias ativos
                </div>
                <div className="text-[#E2E8F0]">·</div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
                    <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {totalSlots} períodos configurados
                </div>
                <div className="text-[#E2E8F0]">·</div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#475569]">
                    <span>Duração da consulta:</span>
                    <div className="relative">
                        <select
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            className="appearance-none pl-2.5 pr-7 py-1 border border-[#E2E8F0] bg-white rounded-lg text-[11px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] hover:border-[#94A3B8] transition-all cursor-pointer"
                        >
                            {DURATIONS.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Day Rows */}
            <div className="divide-y divide-[#F1F5F9]">
                {DAYS.map((day, idx) => {
                    const cfg = schedule[day];
                    return (
                        <div key={day} className={`px-6 py-4 transition-colors ${cfg.enabled ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                            <div className="flex items-start gap-4">
                                {/* Day Toggle */}
                                <div className="flex flex-col items-center gap-1.5 w-14 flex-shrink-0 pt-0.5">
                                    <span className={`text-[11px] font-black ${cfg.enabled ? 'text-[#0F172A]' : 'text-[#CBD5E1]'}`}>
                                        {DAY_SHORT[idx]}
                                    </span>
                                    <button
                                        onClick={() => toggleDay(day)}
                                        className={`relative w-10 h-5 rounded-full transition-all duration-200 ${cfg.enabled ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`}
                                        aria-label={`Toggle ${day}`}
                                    >
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${cfg.enabled ? 'left-5' : 'left-0.5'}`} />
                                    </button>
                                </div>

                                {/* Slots or Disabled State */}
                                <div className="flex-1">
                                    {cfg.enabled ? (
                                        <div className="flex flex-col gap-2">
                                            {cfg.slots.length === 0 ? (
                                                <p className="text-[11px] font-medium text-[#94A3B8] italic">Nenhum período adicionado</p>
                                            ) : (
                                                cfg.slots.map(slot => (
                                                    <SlotRow
                                                        key={slot.id}
                                                        slot={slot}
                                                        onUpdate={(id, field, val) => updateSlot(day, id, field, val)}
                                                        onRemove={(id) => removeSlot(day, id)}
                                                    />
                                                ))
                                            )}
                                            <button
                                                onClick={() => addSlot(day)}
                                                className="flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] mt-1 w-fit transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Adicionar período
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center h-8">
                                            <span className="text-[11px] font-medium text-[#CBD5E1]">Indisponível</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer hint */}
            <div className="px-6 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                <p className="text-[10px] font-medium text-[#94A3B8]">
                    💡 Os horários disponíveis são calculados automaticamente conforme a duração selecionada e enviados ao paciente via WhatsApp após a triagem.
                </p>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────

const ManagementDashboard: React.FC = () => {
    return (
        <div className="w-full bg-[#F1F5F9] min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[12px] font-bold text-[#0F172A] flex items-center">
                        <BarChart2 className="w-6 h-6 mr-3 text-[#2563EB]" />
                        Gestão de Atendimentos & Performance
                    </h1>
                    <p className="text-[#64748B] text-[12px] font-medium mt-1">
                        Métricas de engajamento via WhatsApp, resolutividade e ocupação de agenda.
                    </p>
                </div>

                {/* Top KPIs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* KPI 1 */}
                    <div className="bg-white p-4 rounded-[10px] border border-[#E2E8F0] shadow-sm flex items-center relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#EFF6FF] rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md mr-4 relative z-10">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="text-[#64748B] text-[12px] font-bold capitalize mb-1 whitespace-nowrap">Total de Consultas</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-[#0F172A] text-[12px] font-black leading-none">1.248</p>
                                <span className="text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center whitespace-nowrap">
                                    <TrendingUp className="w-3 h-3 mr-1" /> +12%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 2 */}
                    <div className="bg-white p-4 rounded-[10px] border border-[#E2E8F0] shadow-sm flex items-center relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#EFF6FF] rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md mr-4 relative z-10">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="text-[#64748B] text-[12px] font-bold capitalize mb-1 whitespace-nowrap">Iterações WhatsApp</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-[#0F172A] text-[12px] font-black leading-none">3.492</p>
                                <span className="text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center whitespace-nowrap">
                                    <TrendingUp className="w-3 h-3 mr-1" /> +24%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 3 */}
                    <div className="bg-white p-4 rounded-[10px] border border-[#E2E8F0] shadow-sm flex items-center relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#EFF6FF] rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md mr-4 relative z-10">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="text-[#64748B] text-[12px] font-bold capitalize mb-1 whitespace-nowrap">Tempo de Resposta</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-[#0F172A] text-[12px] font-black leading-none">14<span className="text-[12px] text-[#64748B] ml-1">min</span></p>
                                <span className="text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center whitespace-nowrap">
                                    Média Diária
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 4 */}
                    <div className="bg-white p-4 rounded-[10px] border border-[#E2E8F0] shadow-sm flex items-center relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#EFF6FF] rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md mr-4 relative z-10">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="text-[#64748B] text-[12px] font-bold capitalize mb-1 whitespace-nowrap">Ocupação da Agenda</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-[#0F172A] text-[12px] font-black leading-none">86<span className="text-[12px] text-[#64748B] ml-1">%</span></p>
                                <span className="text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center whitespace-nowrap">
                                    Estável
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Agenda Section ── */}
                <div className="mb-8">
                    <AgendaSection />
                </div>

                {/* Charts & Reports */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Gráfico de Resolutividade */}
                    <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-6 lg:p-8">
                        <h2 className="text-[12px] font-bold text-[#0F172A] mb-1 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-[#2563EB]" />
                            Resolubilidade (Baseado em Feedbacks)
                        </h2>
                        <p className="text-[#94A3B8] text-[11px] font-medium mb-8">Percentual de casos resolvidos no primeiro atendimento x retornos.</p>

                        <div className="flex flex-col space-y-6">
                            <div>
                                <div className="flex justify-between text-[12px] font-bold mb-2">
                                    <span className="text-[#475569]">Resolvidos Online (Sem Retorno)</span>
                                    <span className="text-[#2563EB]">72%</span>
                                </div>
                                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-[#2563EB] h-1.5 rounded-full transition-all" style={{ width: '72%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-[12px] font-bold mb-2">
                                    <span className="text-[#475569]">Necessitaram de Retorno (Online)</span>
                                    <span className="text-[#F59E0B]">18%</span>
                                </div>
                                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-[#F59E0B] h-1.5 rounded-full transition-all" style={{ width: '18%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-[12px] font-bold mb-2">
                                    <span className="text-[#475569]">Encaminhados P/ Presencial</span>
                                    <span className="text-[#94A3B8]">10%</span>
                                </div>
                                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-[#CBD5E1] h-1.5 rounded-full transition-all" style={{ width: '10%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
                            <span className="text-[12px] font-bold text-[#64748B]">Taxa Geral de Sucesso</span>
                            <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-[11px] font-black rounded-lg border border-[#BFDBFE]">Elevada</span>
                        </div>
                    </div>

                    {/* Funil de Engajamento via WhatsApp */}
                    <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-6 lg:p-8 flex flex-col">
                        <h2 className="text-[12px] font-bold text-[#0F172A] mb-1 flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2 text-[#2563EB]" />
                            Funil de Engajamento via WhatsApp
                        </h2>
                        <p className="text-[#94A3B8] text-[11px] font-medium mb-6">Conversão de mensagens automáticas que geraram respostas ou feedbacks do paciente.</p>

                        <div className="overflow-x-auto -mx-6 -mb-6 mt-2">
                            <table className="table-container">
                                <thead className="bg-[#F8FAFC]">
                                    <tr>
                                        <th className="table-title">ETAPA</th>
                                        <th className="table-title">DESCRIÇÃO</th>
                                        <th className="table-title text-right">VOLUME</th>
                                        <th className="table-title text-right">TAXA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="table-row-hover">
                                        <td className="table-text whitespace-nowrap">
                                            <span className="text-[11px] font-bold text-[#0F172A]">1. Enviadas</span>
                                        </td>
                                        <td className="table-text text-[11px] text-[#475569] whitespace-nowrap">Lembretes, Receitas, Acompanhamento</td>
                                        <td className="table-text text-[11px] font-bold text-[#0F172A] text-right whitespace-nowrap">1.500</td>
                                        <td className="table-text text-right whitespace-nowrap">
                                            <span className="text-[11px] font-medium text-[#94A3B8]">—</span>
                                        </td>
                                    </tr>
                                    <tr className="table-row-hover">
                                        <td className="table-text whitespace-nowrap">
                                            <span className="text-[11px] font-bold text-[#0F172A]">2. Lidas</span>
                                        </td>
                                        <td className="table-text text-[11px] text-[#475569] whitespace-nowrap">Taxa de abertura</td>
                                        <td className="table-text text-[11px] font-bold text-[#0F172A] text-right whitespace-nowrap">1.350</td>
                                        <td className="table-text text-right whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB]">90%</span>
                                        </td>
                                    </tr>
                                    <tr className="table-row-hover">
                                        <td className="table-text whitespace-nowrap">
                                            <span className="text-[11px] font-bold text-[#0F172A]">3. Feedbacks</span>
                                        </td>
                                        <td className="table-text text-[11px] text-[#475569] whitespace-nowrap">Interação ativa via BOT</td>
                                        <td className="table-text text-[11px] font-bold text-[#0F172A] text-right whitespace-nowrap">480</td>
                                        <td className="table-text text-right whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB]">35%</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ManagementDashboard;
