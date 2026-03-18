import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Share2, Settings, UserCircle, LogOut, Menu,
    Briefcase, Users, BarChart2, Activity, Shield,
    ClipboardList, Video, Pill, FlaskConical, FileText, Stethoscope
} from 'lucide-react';

// ── Patient section items (scroll-based nav) ──────────────────────────────────
const PATIENT_SECTIONS = [
    { id: 'sec-prontuario',   label: 'Meu Prontuário',    icon: ClipboardList },
    { id: 'sec-teleconsulta', label: 'Teleconsulta',       icon: Video },
    { id: 'sec-medicacoes',   label: 'Medicações',         icon: Pill },
    { id: 'sec-pareceres',    label: 'Pareceres Médicos',  icon: FileText },
    { id: 'sec-prescricoes',  label: 'Prescrições',        icon: Stethoscope },
    { id: 'sec-exames',       label: 'Exames',             icon: FlaskConical },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('userRole') || 'telemedicina';
    const isPatient = userRole === 'paciente';

    const [activeSection, setActiveSection] = useState<string>('sec-prontuario');

    useEffect(() => {
        if (!isPatient) return;
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        );
        PATIENT_SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [isPatient, location.pathname]);

    const scrollToSection = (id: string) => {
        if (location.pathname !== '/portal-paciente') {
            navigate('/portal-paciente');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActiveSection(id);
    };

    const getMenuItems = () => {
        const baseItems = [
            { path: '/dashboard',    label: 'Dashboard',            icon: BarChart2, roles: ['triador', 'parecerista', 'telemedicina'] },
            { path: '/pacientes',    label: 'Pacientes',            icon: Users,     roles: ['triador'] },
            { path: '/pareceres',    label: 'Central de Pareceres', icon: Share2,    roles: ['parecerista', 'telemedicina'] },
            { path: '/pareceres',    label: 'Pareceres Solicitados',icon: Share2,    roles: ['triador'] },
            { path: '/atendimentos', label: 'Atendimentos',         icon: Activity,  roles: ['parecerista', 'telemedicina', 'triador'] },
            { path: '/gestao',       label: 'Gestão',               icon: Briefcase, roles: ['parecerista', 'telemedicina', 'triador'] },
            { path: '/gestao-master',label: 'Gestão de Perfis',     icon: Shield,    roles: ['gestor_master'] },
        ];
        if (userRole === 'gestor_master') return baseItems.filter(i => i.path === '/gestao-master');
        return baseItems.filter(i => (i as any).roles?.includes(userRole));
    };

    const menuItems = getMenuItems();
    const isActive = (path: string) => path !== '#' && location.pathname === path;

    return (
        <aside
            className="fixed inset-y-0 left-0 w-64 hidden lg:flex flex-col z-10 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-colors duration-300"
            style={{
                backgroundColor: 'var(--color-sidebar-bg)',
                borderRight: '1px solid var(--color-sidebar-border)',
                color: 'var(--color-sidebar-text)',
            }}
        >
            {/* Logo */}
            <div
                className="flex items-center justify-center h-20 transition-colors duration-300"
                style={{ borderBottom: '1px solid var(--color-sidebar-border)' }}
            >
                <div
                    className="rounded-lg p-2 flex items-center justify-center mr-3 shadow-sm w-10 h-10 transition-colors duration-300"
                    style={{ backgroundColor: 'var(--color-sidebar-logo-bg)' }}
                >
                    <span className="text-white font-bold text-xl leading-none">P</span>
                </div>
                <div className="flex flex-col">
                    <span
                        className="font-bold text-xl tracking-tight leading-none transition-colors duration-300"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        SCI
                    </span>
                    <span
                        className="font-medium text-xs transition-colors duration-300"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Pareceres Médicos
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-0.5 overflow-y-auto">
                <p
                    className="px-5 text-[11px] font-bold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    {isPatient ? 'Portal do Paciente' : 'Principal'}
                </p>

                {isPatient ? (
                    PATIENT_SECTIONS.map(({ id, label }) => {
                        const active = activeSection === id;
                        return (
                            <button
                                key={id}
                                onClick={() => scrollToSection(id)}
                                className="w-full flex items-center px-5 py-3 text-[12px] transition-all"
                                style={{
                                    fontWeight: active ? 600 : 500,
                                    backgroundColor: active ? '#E9EEF5' : 'transparent',
                                    color: active ? '#1D4ED8' : '#6B7280',
                                    boxShadow: active
                                        ? 'inset 2px 2px 6px rgba(0,0,0,0.08), inset -2px -2px 6px rgba(255,255,255,0.7)'
                                        : 'none',
                                    borderTop: '1px solid transparent',
                                    borderBottom: '1px solid transparent',
                                    borderRight: '1px solid transparent',
                                    borderLeft: active ? '3px solid #3B82F6' : '3px solid transparent',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = '#F1F5F9'; }}
                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                            >
                                {label}
                            </button>
                        );
                    })
                ) : (
                    menuItems.map(item => {
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.path + item.label}
                                onClick={() => navigate(item.path)}
                                className="w-full flex items-center px-5 py-3 text-[12px] transition-all"
                                style={{
                                    fontWeight: active ? 600 : 500,
                                    backgroundColor: active ? '#E9EEF5' : 'transparent',
                                    color: active ? '#1D4ED8' : '#6B7280',
                                    boxShadow: active
                                        ? 'inset 2px 2px 6px rgba(0,0,0,0.08), inset -2px -2px 6px rgba(255,255,255,0.7)'
                                        : 'none',
                                    borderTop: '1px solid transparent',
                                    borderBottom: '1px solid transparent',
                                    borderRight: '1px solid transparent',
                                    borderLeft: active ? '3px solid #3B82F6' : '3px solid transparent',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = '#F1F5F9'; }}
                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                            >
                                {item.label}
                            </button>
                        );
                    })
                )}
            </nav>

            {/* Bottom: settings + user card */}
            <div
                className="p-4 space-y-2 transition-colors duration-300"
                style={{ borderTop: '1px solid var(--color-sidebar-border)' }}
            >
                <button
                    className="w-full flex items-center px-4 py-3 rounded-lg text-[12px] font-bold transition-all duration-200 hover:opacity-80"
                    style={{ color: 'var(--color-sidebar-text)' }}
                >
                    <Settings className="w-5 h-5 mr-3" style={{ color: 'var(--color-nav-icon)' }} />
                    Configurações
                </button>
                <div
                    className="flex items-center mt-4 px-3 py-2 rounded-xl shadow-sm border transition-colors duration-300"
                    style={{
                        backgroundColor: 'var(--color-card-bg)',
                        borderColor: 'var(--color-border)',
                    }}
                >
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center mr-3 font-bold text-[13px] flex-shrink-0"
                        style={{
                            backgroundColor: isPatient ? 'var(--color-primary-light)' : '#F1F5F9',
                            color: isPatient ? 'var(--color-primary)' : '#94A3B8',
                        }}
                    >
                        {isPatient ? 'CE' : <UserCircle className="w-9 h-9 text-[#CBD5E1]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {isPatient ? 'Carlos E. Lima' : 'Dr. Exemplo'}
                        </p>
                        <p className="text-[11px] font-medium truncate" style={{ color: 'var(--color-text-muted)' }}>
                            {isPatient ? 'Paciente' : 'Cardiologia'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                        title="Sair"
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

const Header = () => (
    <header
        className="lg:hidden sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-colors duration-300"
        style={{
            backgroundColor: 'var(--color-card-bg)',
            borderBottom: '1px solid var(--color-border)',
        }}
    >
        <div className="flex items-center">
            <button className="mr-4 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                <Menu className="w-6 h-6" />
            </button>
            <div
                className="rounded-md p-1.5 flex items-center justify-center mr-2 shadow-sm transition-colors duration-300"
                style={{ backgroundColor: 'var(--color-sidebar-logo-bg)' }}
            >
                <span className="text-white font-bold text-sm leading-none">P</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight leading-none" style={{ color: 'var(--color-text-primary)' }}>SCI</span>
                <span className="font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Pareceres Médicos</span>
            </div>
        </div>
    </header>
);

const Layout: React.FC = () => (
    <div
        className="min-h-screen flex transition-colors duration-300"
        style={{ fontFamily: 'Inter, sans-serif', backgroundColor: 'var(--color-page-bg)' }}
    >
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64 h-screen overflow-hidden">
            <Header />
            <main
                className="flex-1 overflow-x-hidden overflow-y-auto transition-colors duration-300"
                style={{ backgroundColor: 'var(--color-page-bg)' }}
            >
                <Outlet />
            </main>
        </div>
    </div>
);

export default Layout;
