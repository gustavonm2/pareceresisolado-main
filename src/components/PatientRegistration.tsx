import React, { useState, useEffect } from 'react';
import { ArrowRight, UserPlus, FileText, Video, Send, CheckCircle, MapPin, Lock, User, Calendar, Phone } from 'lucide-react';
import { setModalidadePaciente } from '../utils/patientStore';

// Mock data for States and Cities
const STATES = [
    { uf: 'AC', name: 'Acre' },
    { uf: 'AL', name: 'Alagoas' },
    { uf: 'AP', name: 'Amapá' },
    { uf: 'AM', name: 'Amazonas' },
    { uf: 'BA', name: 'Bahia' },
    { uf: 'CE', name: 'Ceará' },
    { uf: 'DF', name: 'Distrito Federal' },
    { uf: 'ES', name: 'Espírito Santo' },
    { uf: 'GO', name: 'Goiás' },
    { uf: 'MA', name: 'Maranhão' },
    { uf: 'MT', name: 'Mato Grosso' },
    { uf: 'MS', name: 'Mato Grosso do Sul' },
    { uf: 'MG', name: 'Minas Gerais' },
    { uf: 'PA', name: 'Pará' },
    { uf: 'PB', name: 'Paraíba' },
    { uf: 'PR', name: 'Paraná' },
    { uf: 'PE', name: 'Pernambuco' },
    { uf: 'PI', name: 'Piauí' },
    { uf: 'RJ', name: 'Rio de Janeiro' },
    { uf: 'RN', name: 'Rio Grande do Norte' },
    { uf: 'RS', name: 'Rio Grande do Sul' },
    { uf: 'RO', name: 'Rondônia' },
    { uf: 'RR', name: 'Roraima' },
    { uf: 'SC', name: 'Santa Catarina' },
    { uf: 'SP', name: 'São Paulo' },
    { uf: 'SE', name: 'Sergipe' },
    { uf: 'TO', name: 'Tocantins' }
];

// Simple mock for cities. In a real app, this would be an API call based on the selected state.
const getMockCitiesForState = (uf: string) => {
    if (!uf) return [];
    const baseCities = ['Capital', 'Interior 1', 'Interior 2', 'Litoral'];
    return baseCities.map(city => `${city} - ${uf}`);
};

const PatientRegistration: React.FC = () => {
    const [step, setStep] = useState(1);
    const [modality, setModality] = useState<'online' | 'parecer' | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Identificação
        name: '',
        birthDate: '',
        age: '',
        gender: '',
        cpf: '',
        cns: '',
        motherName: '',
        mobilePhone: '',
        altPhone: '',
        email: '',
        // Step 2: Endereço
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        state: '',
        city: '',
        // Step 3: Senha
        password: '',
        confirmPassword: '',
        // Step 4: Consulta
        complaint: ''
    });

    const [availableCities, setAvailableCities] = useState<string[]>([]);

    // Calculate Age dynamically when birthDate changes
    useEffect(() => {
        if (formData.birthDate) {
            const birth = new Date(formData.birthDate);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                calculatedAge--;
            }
            if (calculatedAge >= 0) {
                setFormData(prev => ({ ...prev, age: calculatedAge.toString() }));
            }
        } else {
            setFormData(prev => ({ ...prev, age: '' }));
        }
    }, [formData.birthDate]);

    // Update cities when State changes
    useEffect(() => {
        setAvailableCities(getMockCitiesForState(formData.state));
        setFormData(prev => ({ ...prev, city: '' })); // Reset city when state changes
    }, [formData.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation before moving to next step
        if (step === 3 && formData.password !== formData.confirmPassword) {
            alert("As senhas informadas não coincidem. Por favor, verifique.");
            return;
        }

        setStep(prev => prev + 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Persist the patient's chosen modality so the portal and professional workspace can react
        if (modality) {
            setModalidadePaciente(modality);
        }
        setStep(5); // Success step
    };

    const getProgressWidth = () => {
        if (step === 5) return '100%';
        return `${((step - 1) / 3) * 100}%`;
    };

    if (step === 5) {
        return (
            <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-[12px] shadow-sm max-w-lg w-full p-8 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-[#10B981]" />
                    </div>
                    <h2 className="text-[24px] font-black text-[#0F172A] mb-3">Cadastro Finalizado!</h2>
                    <p className="text-[15px] font-medium text-[#64748B] mb-8 leading-relaxed">
                        Seu perfil foi criado e sua solicitação recebida com sucesso. A equipe de triagem analisará seu caso e você receberá as próximas instruções diretamente no seu WhatsApp.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-3.5 bg-[#0F172A] hover:bg-black text-white rounded-xl text-[15px] font-bold transition-all shadow-md"
                    >
                        Voltar para o Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
            {/* Simple Header */}
            <div className="bg-white px-6 xl:px-8 py-5 flex items-center shadow-sm relative z-10 border-b border-[#E2E8F0]">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center text-white mr-3 shadow-sm">
                        <span className="font-black text-xl tracking-tighter">P</span>
                    </div>
                    <span className="font-bold text-[18px] tracking-tight text-[#0F172A]">Clínica Pareceres</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-[800px]">

                    {/* Progress Bar Container */}
                    <div className="mb-8 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-[#64748B] capitalize">
                                {step === 1 && 'Etapa 1: Identificação'}
                                {step === 2 && 'Etapa 2: Endereço'}
                                {step === 3 && 'Etapa 3: Senha de Acesso'}
                                {step === 4 && 'Etapa 4: Solicitação de Consulta'}
                            </span>
                            <span className="text-[12px] font-black text-[#2563EB]">{step} de 4</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-[#2563EB] h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: getProgressWidth() }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden border border-[#E2E8F0]">

                        {/* STEP 1: IDENTIFICATION */}
                        {step === 1 && (
                            <div className="p-8 sm:p-10 animate-in slide-in-from-right-8 duration-300">
                                <div className="mb-8">
                                    <h1 className="text-[24px] sm:text-[28px] font-black text-[#0F172A] tracking-tight mb-2 flex items-center">
                                        <User className="w-7 h-7 mr-3 text-[#2563EB]" />
                                        Ficha de Identificação
                                    </h1>
                                    <p className="text-[14px] font-medium text-[#64748B]">Preencha seus dados básicos para criar seu prontuário no sistema.</p>
                                </div>

                                <form onSubmit={handleNextStep} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                        <div className="md:col-span-12 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Nome Completo *</label>
                                            <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Nome sem abreviações" />
                                        </div>

                                        <div className="md:col-span-4 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Data de Nasc. *</label>
                                            <input required name="birthDate" value={formData.birthDate} onChange={handleInputChange} type="date" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Idade</label>
                                            <input disabled name="age" value={formData.age} type="text" className="w-full px-4 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[14px] font-bold text-[#64748B] cursor-not-allowed" placeholder="-" />
                                        </div>
                                        <div className="md:col-span-6 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Sexo biológico *</label>
                                            <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all text-[#0F172A]">
                                                <option value="" disabled>Selecione</option>
                                                <option value="M">Masculino</option>
                                                <option value="F">Feminino</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-6 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">CPF *</label>
                                            <input required name="cpf" value={formData.cpf} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="000.000.000-00" />
                                        </div>
                                        <div className="md:col-span-6 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">CNS (Cartão SUS)</label>
                                            <input name="cns" value={formData.cns} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Opcional" />
                                        </div>

                                        <div className="md:col-span-12 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Nome da Mãe *</label>
                                            <input required name="motherName" value={formData.motherName} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Nome completo da mãe" />
                                        </div>

                                        <div className="md:col-span-6 space-y-2 relative">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Telefone Celular *</label>
                                            <input required name="mobilePhone" value={formData.mobilePhone} onChange={handleInputChange} type="tel" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="(00) 00000-0000" />
                                            <p className="text-[11px] font-bold text-[#10B981] mt-1 flex items-center">
                                                <CheckCircle className="w-3 h-3 mr-1" /> WhatsApp principal
                                            </p>
                                        </div>
                                        <div className="md:col-span-6 space-y-2 flex flex-col justify-start">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Telefone Alternativo / E-mail</label>
                                            <input name="altPhone" value={formData.altPhone} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Outro contato" />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-[#F1F5F9] flex justify-end">
                                        <button type="submit" className="px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-[14px] font-bold transition-all shadow-md flex items-center group">
                                            Próxima Etapa
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* STEP 2: ADDRESS */}
                        {step === 2 && (
                            <div className="p-8 sm:p-10 animate-in slide-in-from-right-8 duration-300">
                                <div className="mb-8">
                                    <h1 className="text-[24px] sm:text-[28px] font-black text-[#0F172A] tracking-tight mb-2 flex items-center">
                                        <MapPin className="w-7 h-7 mr-3 text-[#2563EB]" />
                                        Endereço de Residência
                                    </h1>
                                    <p className="text-[14px] font-medium text-[#64748B]">Defina sua localização para fins de territorialização (UBS de referência).</p>
                                </div>

                                <form onSubmit={handleNextStep} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                        <div className="md:col-span-4 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">CEP *</label>
                                            <input required name="cep" value={formData.cep} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="00000-000" />
                                        </div>
                                        <div className="md:col-span-8 space-y-2">
                                            {/* Spacer for alignment */}
                                        </div>

                                        <div className="md:col-span-9 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Logradouro (Rua, Av.) *</label>
                                            <input required name="street" value={formData.street} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Ex: Av. Brasil" />
                                        </div>
                                        <div className="md:col-span-3 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Número *</label>
                                            <input required name="number" value={formData.number} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="123" />
                                        </div>

                                        <div className="md:col-span-6 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Complemento</label>
                                            <input name="complement" value={formData.complement} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Apto, Bloco (Opcional)" />
                                        </div>
                                        <div className="md:col-span-6 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Bairro *</label>
                                            <input required name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} type="text" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Seu bairro" />
                                        </div>

                                        <div className="md:col-span-5 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Estado (UF) *</label>
                                            <select required name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all text-[#0F172A]">
                                                <option value="" disabled>Selecione</option>
                                                {STATES.map(st => (
                                                    <option key={st.uf} value={st.uf}>{st.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-7 space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Município *</label>
                                            <select required name="city" value={formData.city} onChange={handleInputChange} disabled={!formData.state} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:ring-2 focus:ring-[#2563EB] transition-all text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed">
                                                <option value="" disabled>{formData.state ? 'Selecione o Município' : 'Escolha o Estado 1º'}</option>
                                                {availableCities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-[#F1F5F9] flex items-center justify-between">
                                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center">
                                            Voltar
                                        </button>
                                        <button type="submit" className="px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-[14px] font-bold transition-all shadow-md flex items-center group">
                                            Próxima Etapa
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* STEP 3: PASSWORD */}
                        {step === 3 && (
                            <div className="p-8 sm:p-10 animate-in slide-in-from-right-8 duration-300">
                                <div className="mb-8">
                                    <h1 className="text-[24px] sm:text-[28px] font-black text-[#0F172A] tracking-tight mb-2 flex items-center">
                                        <Lock className="w-7 h-7 mr-3 text-[#2563EB]" />
                                        Credenciais de Acesso
                                    </h1>
                                    <p className="text-[14px] font-medium text-[#64748B]">Crie uma senha segura para acessar o Portal do Paciente posteriormente.</p>
                                </div>

                                <form onSubmit={handleNextStep} className="space-y-6">

                                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6 mb-8 flex items-start">
                                        <div className="bg-white p-2 rounded-lg shadow-sm mr-4 shrink-0">
                                            <User className="w-6 h-6 text-[#2563EB]" />
                                        </div>
                                        <div>
                                            <h3 className="text-[13px] font-bold text-[#1E3A8A] capitalize mb-1">Seu Login será o CPF</h3>
                                            <p className="text-[14px] font-medium text-[#2563EB]">
                                                {formData.cpf || 'O CPF informado na Etapa 1'} será utilizado como seu usuário padrão para retornar à plataforma.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Crie uma Senha *</label>
                                            <input required name="password" value={formData.password} onChange={handleInputChange} type="password" minLength={6} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#0F172A] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Mínimo de 6 caracteres" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-[#475569] capitalize">Confirme a Senha *</label>
                                            <input required name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} type="password" minLength={6} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#0F172A] focus:ring-2 focus:ring-[#2563EB] transition-all" placeholder="Repita a senha" />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-[#F1F5F9] flex items-center justify-between">
                                        <button type="button" onClick={() => setStep(2)} className="px-6 py-3.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center">
                                            Voltar
                                        </button>
                                        <button type="submit" className="px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-[14px] font-bold transition-all shadow-md flex items-center group">
                                            Concluir Cadastro
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* STEP 4: SOLICITAÇÃO DE CONSULTA (OLD STEP 2) */}
                        {step === 4 && (
                            <div className="p-8 sm:p-10 animate-in slide-in-from-right-8 duration-300">
                                <div className="mb-8 flex items-center justify-between">
                                    <div>
                                        <h1 className="text-[24px] sm:text-[28px] font-black text-[#0F172A] tracking-tight mb-2 flex items-center">
                                            <FileText className="w-7 h-7 mr-3 text-[#2563EB]" />
                                            Solicitação de Atendimento
                                        </h1>
                                        <p className="text-[14px] font-medium text-[#64748B]">Conte-nos um pouco sobre seu problema e escolha a modalidade de atendimento.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-[#475569] capitalize">Descrição Breve (Queixa)</label>
                                        <textarea
                                            name="complaint"
                                            value={formData.complaint}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all min-h-[120px] resize-none"
                                            placeholder="Ex: Sinto muita dor de cabeça há 3 dias acompanhada de febre e náuseas..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[11px] font-bold text-[#475569] capitalize">Modalidade Preferencial *</label>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Modalidade 1: Consulta Online */}
                                            <div
                                                onClick={() => setModality('online')}
                                                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${modality === 'online'
                                                    ? 'border-[#2563EB] bg-[#EFF6FF]'
                                                    : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                                                    }`}
                                            >
                                                {modality === 'online' && (
                                                    <div className="absolute top-4 right-4 text-[#2563EB]">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${modality === 'online' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                                                    <Video className="w-6 h-6" />
                                                </div>
                                                <h3 className={`text-[15px] font-bold mb-2 ${modality === 'online' ? 'text-[#0F172A]' : 'text-[#334155]'}`}>
                                                    Teleconsulta (Online)
                                                </h3>
                                                <p className={`text-[12px] font-medium leading-relaxed ${modality === 'online' ? 'text-[#334155]' : 'text-[#64748B]'}`}>
                                                    Conversa ao vivo por vídeo com o especialista. Você receberá o link da sala no seu WhatsApp minutos antes do horário agendado.
                                                </p>
                                            </div>

                                            {/* Modalidade 2: Emissão de Parecer Assíncrono */}
                                            <div
                                                onClick={() => setModality('parecer')}
                                                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${modality === 'parecer'
                                                    ? 'border-[#2563EB] bg-[#EFF6FF]'
                                                    : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                                                    }`}
                                            >
                                                {modality === 'parecer' && (
                                                    <div className="absolute top-4 right-4 text-[#2563EB]">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${modality === 'parecer' ? 'bg-[#2563EB] text-white shadow-md' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <h3 className={`text-[15px] font-bold mb-2 ${modality === 'parecer' ? 'text-[#0F172A]' : 'text-[#334155]'}`}>
                                                    Parecer Médico (Assíncrono)
                                                </h3>
                                                <p className={`text-[12px] font-medium leading-relaxed ${modality === 'parecer' ? 'text-[#334155]' : 'text-[#64748B]'}`}>
                                                    Especialista envia uma resposta formal baseada nos seus relatos e exames anexados, sem necessidade de vídeochamada.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-[#F1F5F9] flex items-center justify-between">
                                        <span className="text-[12px] font-medium text-[#94A3B8]">Você poderá refinar estes dados mais tarde no chat da triagem.</span>
                                        <button
                                            type="submit"
                                            disabled={!modality}
                                            className="px-8 py-3.5 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#94A3B8] disabled:cursor-not-allowed text-white rounded-xl text-[14px] font-bold transition-all shadow-md flex items-center"
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            Finalizar Envio
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    <p className="text-center mt-8 text-[12px] font-medium text-[#94A3B8]">
                        Seus dados são criptografados e tratados conforme a Lei Geral de Proteção de Dados (LGPD).
                    </p>

                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;
