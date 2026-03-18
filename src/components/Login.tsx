import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette } from 'lucide-react';
import ColorPalettePanel from './ColorPalettePanel';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPalettePanel, setShowPalettePanel] = useState(false);

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
            localStorage.setItem('userRole', 'parecerista');
            navigate('/dashboard');
        }
    };

    const handleGestorMasterAccess = () => {
        setShowPalettePanel(false);
        localStorage.setItem('userRole', 'gestor_master');
        navigate('/gestao-master');
    };

    return (
        <div
            className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
            style={{ backgroundColor: 'var(--color-login-bg)', transition: 'background-color 0.3s ease' }}
        >
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="sm:mx-auto sm:w-full sm:max-w-[360px]">
                <div className="flex justify-center mb-5">
                    <div
                        className="rounded-lg p-2 w-10 h-10 flex items-center justify-center shadow-md transition-colors duration-300"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <span className="text-white font-bold text-xl leading-none">P</span>
                    </div>
                </div>
                <h2 className="mt-1 text-center text-[22px] font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                    Acesse sua conta
                </h2>
                <div className="mt-3 text-center text-sm space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                    <p>Logins de Teste:</p>
                    <p><strong>usuario 1 / 1</strong>: Triador</p>
                    <p><strong>usuario 2 / 2</strong>: Parecerista</p>
                    <p><strong>usuario 3 / 3</strong>: Paciente</p>
                </div>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[360px] z-10 relative">
                <div
                    className="py-8 px-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:rounded-[20px] border sm:px-8 transition-colors duration-300"
                    style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
                >
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
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
                                    className="appearance-none block w-full px-4 py-2.5 border rounded-[10px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-medium"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        backgroundColor: 'var(--color-surface)',
                                        color: 'var(--color-text-primary)',
                                    }}
                                    placeholder="dr.exemplo@clinica.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
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
                                    className="appearance-none block w-full px-4 py-2.5 border rounded-[10px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all font-medium"
                                    style={{
                                        borderColor: 'var(--color-border)',
                                        backgroundColor: 'var(--color-surface)',
                                        color: 'var(--color-text-primary)',
                                    }}
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
                                    className="h-4 w-4 border-[#CBD5E1] rounded cursor-pointer"
                                    style={{ accentColor: 'var(--color-primary)' }}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-[13px] font-medium cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
                                    Lembrar de mim
                                </label>
                            </div>
                            <div className="text-[13px]">
                                <a href="#" className="font-bold hover:opacity-75 transition-opacity" style={{ color: 'var(--color-primary)' }}>
                                    Esqueceu a senha?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[10px] shadow-sm text-sm font-bold text-white focus:outline-none focus:ring-2 transition-colors duration-200"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-hover)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary)'}
                            >
                                Entrar no Sistema
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 pt-5 flex flex-col items-center" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <p className="text-[13px] mb-2" style={{ color: 'var(--color-text-muted)' }}>Você é um paciente?</p>
                        <button
                            onClick={() => navigate('/cadastro')}
                            className="w-full flex justify-center py-2.5 px-4 rounded-[10px] text-sm font-bold transition-colors"
                            style={{
                                border: '2px solid var(--color-border)',
                                backgroundColor: 'var(--color-card-bg)',
                                color: 'var(--color-text-secondary)',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-card-bg)'}
                        >
                            Faça seu Cadastro Aqui
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Hidden corner: Color Palette toggle ── */}
            <button
                id="sci-palette-trigger"
                onClick={() => setShowPalettePanel(prev => !prev)}
                className="fixed bottom-4 right-4 w-11 h-11 rounded-full flex items-center justify-center z-50 transition-all duration-300 group"
                style={{
                    background: showPalettePanel ? 'var(--color-primary)' : 'transparent',
                    border: '2px solid transparent',
                }}
                onMouseEnter={e => {
                    if (!showPalettePanel) (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)';
                }}
                onMouseLeave={e => {
                    if (!showPalettePanel) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
                title="Configurações de Aparência"
            >
                <Palette
                    className="w-5 h-5 transition-all duration-300"
                    style={{ color: showPalettePanel ? 'white' : 'transparent' }}
                />
                <span className="sr-only">Paleta de Cores</span>
            </button>

            {showPalettePanel && (
                <ColorPalettePanel
                    onClose={() => setShowPalettePanel(false)}
                    onGestorMasterAccess={handleGestorMasterAccess}
                />
            )}
        </div>
    );
};

export default Login;
