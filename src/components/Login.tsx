import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const lowerEmail = email.toLowerCase().trim();

        if (lowerEmail.includes('usuario 1') && password === '1') {
            localStorage.setItem('userRole', 'triador');
            navigate('/dashboard');
        } else if (lowerEmail.includes('usuario 2') && password === '2') {
            localStorage.setItem('userRole', 'parecerista');
            navigate('/dashboard');
        } else if (lowerEmail.includes('usuario 3') && password === '3') {
            localStorage.setItem('userRole', 'paciente');
            navigate('/portal-paciente');
        } else if (lowerEmail === 'gestor' || lowerEmail === 'master' || lowerEmail.includes('master')) {
            localStorage.setItem('userRole', 'gestor_master');
            navigate('/gestao-master');
        } else if (email && password) {
            // Default fallback
            localStorage.setItem('userRole', 'parecerista');
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="sm:mx-auto sm:w-full sm:max-w-[360px]">
                <div className="flex justify-center mb-5">
                    <div className="bg-[#2563EB] rounded-lg p-2 w-10 h-10 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl leading-none">P</span>
                    </div>
                </div>
                <h2 className="mt-1 text-center text-[22px] font-extrabold text-[#0F172A] tracking-tight">
                    Acesse sua conta
                </h2>
                <div className="mt-3 text-center text-sm text-[#64748B] space-y-1">
                    <p>Logins de Teste:</p>
                    <p><strong>usuario 1 / 1</strong>: Triador</p>
                    <p><strong>usuario 2 / 2</strong>: Parecerista</p>
                    <p><strong>usuario 3 / 3</strong>: Paciente</p>
                </div>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[360px] z-10 relative">
                <div className="bg-white py-8 px-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:rounded-[20px] border border-[#E2E8F0] sm:px-8">
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-[#334155]">
                                E-mail ou CRM
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-2.5 border border-[#E2E8F0] rounded-[10px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] focus:border-[#2563EB] sm:text-sm bg-[#F8FAFC] focus:bg-white transition-all text-[#0F172A] font-medium"
                                    placeholder="dr.exemplo@clinica.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-[#334155]">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-2.5 border border-[#E2E8F0] rounded-[10px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] focus:border-[#2563EB] sm:text-sm bg-[#F8FAFC] focus:bg-white transition-all text-[#0F172A] font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#2563EB] focus:ring-[#BFDBFE] border-[#CBD5E1] rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-[13px] font-medium text-[#475569] cursor-pointer">
                                    Lembrar de mim
                                </label>
                            </div>

                            <div className="text-[13px]">
                                <a href="#" className="font-bold text-[#2563EB] hover:text-[#1D4ED8]">
                                    Esqueceu a senha?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[10px] shadow-sm text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] transition-colors"
                            >
                                Entrar no Sistema
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 border-t border-[#E2E8F0] pt-5 flex flex-col items-center">
                        <p className="text-[13px] text-[#64748B] mb-2">Você é um paciente?</p>
                        <button
                            onClick={() => navigate('/cadastro')}
                            className="w-full flex justify-center py-2.5 px-4 border-2 border-[#E2E8F0] rounded-[10px] text-sm font-bold text-[#334155] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors"
                        >
                            Faça seu Cadastro Aqui
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden button for Gestor Master Access (Testing Phase) */}
            <button
                onClick={() => {
                    localStorage.setItem('userRole', 'gestor_master');
                    navigate('/gestao-master');
                }}
                className="fixed bottom-4 right-4 w-12 h-12 opacity-0 hover:opacity-10 transition-opacity bg-black rounded-full z-50 cursor-pointer"
                title="Acesso Oculto: Gestor Master"
            >
                <span className="sr-only">Gestor Master</span>
            </button>
        </div>
    );
};

export default Login;
