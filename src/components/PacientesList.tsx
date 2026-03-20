import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

type Priority = 'Alta' | 'Média' | 'Baixa';
type PatientStatus = 'Aguardando' | 'Encaminhado';

interface Patient {
    id: number;
    name: string;
    age: number;
    cpf: string;
    date: string;
    time: string;
    status: PatientStatus;
    symptoms: string;
    priority: Priority;
}

const INITIAL_PATIENTS: Patient[] = [
    {
        id: 1,
        name: 'Maria Clara da Silva',
        age: 45,
        cpf: '123.456.789-00',
        date: '17/03/2026',
        time: '08:30',
        status: 'Aguardando',
        symptoms: 'Dor no peito, falta de ar leve',
        priority: 'Alta'
    },
    {
        id: 2,
        name: 'João Pedro Santos',
        age: 32,
        cpf: '987.654.321-11',
        date: '17/03/2026',
        time: '09:15',
        status: 'Aguardando',
        symptoms: 'Febre alta (39°C), tosse seca há 3 dias',
        priority: 'Média'
    },
    {
        id: 3,
        name: 'Ana Júlia Oliveira',
        age: 68,
        cpf: '456.789.123-22',
        date: '17/03/2026',
        time: '10:00',
        status: 'Aguardando',
        symptoms: 'Controle de pressão arterial de rotina',
        priority: 'Baixa'
    }
];

const PacientesList: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients] = useState<Patient[]>(INITIAL_PATIENTS);


    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cpf.includes(searchTerm)
    );

    return (
        <div className="w-full bg-[#F1F5F9] min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 relative animate-in fade-in duration-300">
                <div className="mb-8">
                    <h1 className="text-[12px] font-bold text-slate-800 tracking-tight">Fila de Pacientes (Triagem)</h1>
                    <p className="text-slate-500 mt-1 text-[11px] font-medium">Gerencie e analise as entradas de novos pacientes no sistema</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
                        <div className="relative w-full sm:w-96 text-slate-500">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou CPF..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3461] focus:border-transparent transition-all shadow-sm text-[11px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-[#1D3461] transition-all shadow-sm w-full sm:w-auto justify-center">
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 capitalize">Paciente / CPF</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 capitalize">Triagem Sintomas</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 capitalize text-center">Data / Hora Cadastro</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 capitalize text-center">Status</th>
                                    <th className="py-3 px-6 text-[11px] font-bold text-slate-500 capitalize text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPatients.map((patient) => {
                                    const isEncaminhado = patient.status === 'Encaminhado';
                                    return (
                                        <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-800 text-[11px] group-hover:text-[#1D3461] transition-colors">{patient.name}</div>
                                                <div className="text-[11px] text-slate-500 font-medium mt-0.5">{patient.cpf} • {patient.age} anos</div>
                                            </td>
                                            <td className="py-4 px-6 max-w-[250px]">
                                                <div className="text-[11px] font-medium text-slate-600 truncate" title={patient.symptoms}>
                                                    {patient.symptoms}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="inline-flex flex-col items-center justify-center">
                                                    <span className="text-[11px] font-bold text-slate-700">{patient.date}</span>
                                                    <span className="text-[11px] font-medium text-slate-500 flex items-center mt-0.5">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {patient.time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {isEncaminhado ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                                                        <CheckCircle2 className="w-3 h-3" /> Encaminhado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FFFBEB] text-[#D97706] border border-[#FCD34D]">
                                                        Aguardando
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() => !isEncaminhado && navigate(`/triagem/${patient.id}`)}
                                                    disabled={isEncaminhado}
                                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all shadow-sm ${isEncaminhado ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-[#EEF4FA] text-[#1D3461] hover:bg-[#1D3461] hover:text-white'}`}
                                                    title={isEncaminhado ? 'Já encaminhado' : 'Iniciar triagem'}
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                        {filteredPatients.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center text-slate-500 font-medium text-[11px]">
                                                    Nenhum paciente aguardando triagem no momento.
                                                </td>
                                            </tr>
                                        )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PacientesList;
