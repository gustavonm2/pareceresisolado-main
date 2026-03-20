import React, { useState } from 'react';
import { Users, Plus, Shield, Check, X, Search, Edit2, Trash2 } from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'Master' | 'Triador_Enfermeiro' | 'Triador_Medico' | 'Especialista';
    status: 'Ativo' | 'Inativo';
    createdAt: string;
}

const mockProfiles: UserProfile[] = [
    { id: '1', name: 'Gestor Principal', email: 'admin@pareceres.io', role: 'Master', status: 'Ativo', createdAt: '10/01/2026' },
    { id: '2', name: 'Dra. Ana Silva', email: 'ana.silva@clinica.com', role: 'Triador_Medico', status: 'Ativo', createdAt: '15/02/2026' },
    { id: '3', name: 'Enf. Carlos Santos', email: 'carlos.s@posto.saude.gov', role: 'Triador_Enfermeiro', status: 'Ativo', createdAt: '20/02/2026' },
    { id: '4', name: 'Dr. Roberto Costa', email: 'roberto.cardio@hospital.com', role: 'Especialista', status: 'Ativo', createdAt: '01/03/2026' },
];

const roleLabels: Record<UserProfile['role'], string> = {
    Master: 'Gestor Master',
    Triador_Enfermeiro: 'Triador / Solicitante (Enfermeiro)',
    Triador_Medico: 'Triador / Solicitante (Médico)',
    Especialista: 'Parecerista / Especialista',
};

interface PatientProfile {
    id: string;
    name: string;
    cpf: string;
    status: 'Ativo' | 'Inativo';
    createdAt: string;
}

const mockPatients: PatientProfile[] = [
    { id: '1', name: 'João Silva Oliveira', cpf: '123.456.789-00', status: 'Ativo', createdAt: '16/03/2026' },
    { id: '2', name: 'Maria Souza Barbosa', cpf: '987.654.321-11', status: 'Ativo', createdAt: '15/03/2026' },
    { id: '3', name: 'Carlos Santos Ferreira', cpf: '456.123.789-22', status: 'Ativo', createdAt: '10/03/2026' },
];

const ProfileManagement: React.FC = () => {
    const [profiles] = useState<UserProfile[]>(mockProfiles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [activeTab, setActiveTab] = useState<'system' | 'patients'>('system');

    const filteredProfiles = profiles.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPatients = mockPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf.includes(searchTerm)
    );

    return (
        <div className="w-full bg-[#F1F5F9] min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[12px] font-bold text-[#0F172A] flex items-center">
                            <Shield className="w-6 h-6 mr-3 text-[#1D3461]" />
                            Gestão de Perfis & Acessos
                        </h1>
                        <p className="text-[#64748B] text-[11px] font-medium mt-1">
                            Administre os usuários do sistema e perfis de pacientes.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary px-5 py-2.5 text-[11px]"
                    >
                        <Plus className="w-[18px] h-[18px] mr-2" />
                        {activeTab === 'system' ? 'Novo Usuário' : 'Novo Paciente'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-[#E2E8F0]">
                    <button
                        onClick={() => setActiveTab('system')}
                        className={`pb-3 px-2 text-[12px] font-bold transition-colors border-b-2 ${activeTab === 'system' ? 'border-[#1D3461] text-[#1D3461]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'}`}
                    >
                        Usuários do Sistema (Profissionais)
                    </button>
                    <button
                        onClick={() => setActiveTab('patients')}
                        className={`pb-3 px-2 text-[12px] font-bold transition-colors border-b-2 ${activeTab === 'patients' ? 'border-[#1D3461] text-[#1D3461]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'}`}
                    >
                        Gerenciar Pacientes
                    </button>
                </div>

                {/* Filters and List */}
                <div className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden">
                    <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                        <div className="relative w-full sm:w-96">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou e-mail..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-[#1D3461] focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {activeTab === 'system' ? (
                                <select className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-[11px] font-medium rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1D3461]">
                                    <option value="all">Todos os Papéis</option>
                                    <option value="Master">Gestor Master</option>
                                    <option value="Especialista">Especialistas</option>
                                    <option value="Triador">Triadores / Solicitantes</option>
                                </select>
                            ) : (
                                <select className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-[11px] font-medium rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1D3461]">
                                    <option value="all">Todos os Status</option>
                                    <option value="ativo">Ativos</option>
                                    <option value="inativo">Inativos</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {activeTab === 'system' ? (
                            <table className="table-container">
                                <thead className="bg-[#F8FAFC]">
                                    <tr>
                                        <th className="table-title text-[11px] whitespace-nowrap">USUÁRIO</th>
                                        <th className="table-title text-[11px] whitespace-nowrap">PAPEL / PERFIL</th>
                                        <th className="table-title text-[11px] whitespace-nowrap">DATA CADASTRO</th>
                                        <th className="table-title text-[11px] whitespace-nowrap">STATUS</th>
                                        <th className="table-title text-[11px] text-right whitespace-nowrap">AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProfiles.map((user) => (
                                        <tr key={user.id} className="table-row-hover">
                                            <td className="table-text whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <p className="text-[11px] font-bold text-[#0F172A]">{user.name}</p>
                                                        <p className="text-[11px] font-medium text-[#64748B]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-text whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] capitalize font-bold bg-[#F1F5F9] text-[#475569]">
                                                    {roleLabels[user.role]}
                                                </span>
                                            </td>
                                            <td className="table-text whitespace-nowrap text-[11px] font-medium text-[#475569]">
                                                {user.createdAt}
                                            </td>
                                            <td className="table-text whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold capitalize ${user.status === 'Ativo'
                                                    ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                                                    : 'bg-[#FEF2F2] text-[#C0392B] border border-[#FECACA]'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="table-text whitespace-nowrap text-right">
                                                <button className="w-8 h-8 inline-flex items-center justify-center text-[#94A3B8] hover:text-[#1D3461] hover:bg-[#EEF4FA] rounded-lg transition-colors mr-1">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="w-8 h-8 inline-flex items-center justify-center text-[#94A3B8] hover:text-[#C0392B] hover:bg-[#FEF2F2] rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="table-container">
                                <thead className="bg-[#F8FAFC]">
                                    <tr>
                                        <th className="table-title text-[11px] whitespace-nowrap">PACIENTE</th>
                                        <th className="table-title text-[11px] whitespace-nowrap">CPF</th>
                                        <th className="table-title text-[11px] whitespace-nowrap">DATA CADASTRO</th>
                                        <th className="table-title text-[11px] whitespace-nowrap">STATUS</th>
                                        <th className="table-title text-[11px] text-right whitespace-nowrap">AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map((patient) => (
                                        <tr key={patient.id} className="table-row-hover">
                                            <td className="table-text whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <p className="text-[11px] font-bold text-[#0F172A]">{patient.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-text whitespace-nowrap text-[11px] font-medium text-[#475569]">
                                                {patient.cpf}
                                            </td>
                                            <td className="table-text whitespace-nowrap text-[11px] font-medium text-[#475569]">
                                                {patient.createdAt}
                                            </td>
                                            <td className="table-text whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold capitalize ${patient.status === 'Ativo'
                                                    ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                                                    : 'bg-[#FEF2F2] text-[#C0392B] border border-[#FECACA]'
                                                    }`}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td className="table-text whitespace-nowrap text-right">
                                                <button className="w-8 h-8 inline-flex items-center justify-center text-[#94A3B8] hover:text-[#1D3461] hover:bg-[#EEF4FA] rounded-lg transition-colors mr-1">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="w-8 h-8 inline-flex items-center justify-center text-[#94A3B8] hover:text-[#C0392B] hover:bg-[#FEF2F2] rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {(activeTab === 'system' ? filteredProfiles.length : filteredPatients.length) === 0 && (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3">
                                    <Users className="w-6 h-6 text-[#94A3B8]" />
                                </div>
                                <p className="text-[11px] font-medium text-[#64748B]">Nenhum registro encontrado com os filtros atuais.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Novo Usuário */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[12px] shadow-[0_16px_40px_rgba(0,0,0,0.1)] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                            <div className="px-6 py-5 border-b border-[#E2E8F0] flex justify-between items-center bg-white sticky top-0 z-10">
                                <h3 className="font-bold text-[12px] text-[#0F172A] flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-[#1D3461]" />
                                    Adicionar Novo Usuário
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#475569] mb-1.5 capitalize">Nome Completo</label>
                                        <input type="text" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-[#1D3461] focus:border-transparent transition-all" placeholder="Ex: Dr. João Silva" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#475569] mb-1.5 capitalize">E-mail Profissional</label>
                                        <input type="email" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-[#1D3461] focus:border-transparent transition-all" placeholder="joao.silva@clinica.com" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#475569] mb-1.5 capitalize">Papel do Usuário no Sistema</label>
                                        <select className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D3461] transition-all">
                                            <option value="">Selecione um papel estrutural...</option>
                                            <option value="Triador_Medico">Triador / Solicitante (Médico)</option>
                                            <option value="Triador_Enfermeiro">Triador / Solicitante (Enfermeiro)</option>
                                            <option value="Especialista">Parecerista / Especialista</option>
                                            <option value="Master">Gestor Master (Acesso Total)</option>
                                        </select>
                                        <p className="mt-2 text-[11px] text-[#64748B] font-medium leading-relaxed">
                                            * O papel define quais menus (Atendimentos, Gestão, Painel Master) estarão disponíveis e se o usuário pode solicitar e/ou responder interconsultas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-3 sticky bottom-0">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary px-5 py-2.5 text-[11px]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-primary px-5 py-2.5 text-[11px]"
                                >
                                    <Check className="w-[18px] h-[18px] mr-2" />
                                    Salvar Usuário
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ProfileManagement;
