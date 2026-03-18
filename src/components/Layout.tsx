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

    // Scroll-spy: which section card is currently visible
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

    // ── Non-patient menus ──────────────────────────────────────────────────────
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
        <aside className="fixed inset-y-0 left-0 bg-white border-r border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-[#0F172A] w-64 hidden lg:flex flex-col z-10 overflow-hidden">

            {/* Logo */}
            <div className="flex items-center justify-center h-20 border-b border-[#E2E8F0]">
                <div className="bg-[#2563EB] rounded-lg p-2 flex items-center justify-center mr-3 shadow-sm w-10 h-10">
                    <span className="text-white font-bold text-xl leading-none">P</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-xl text-[#0F172A] tracking-tight leading-none">SCI</span>
                    <span className="text-[#64748B] font-medium text-xs">Pareceres Médicos</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p className="px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-4">
                    {isPatient ? 'Portal do Paciente' : 'Principal'}
                </p>

                {isPatient ? (
                    // Patient: section-scroll nav
                    PATIENT_SECTIONS.map(({ id, label, icon: Icon }) => {
                        const active = activeSection === id;
                        return (
                            <button
                                key={id}
                                onClick={() => scrollToSection(id)}
                                className={`w-full flex items-center px-4 py-3 rounded-lg text-[12px] font-bold transition-all ${
                                    active
                                        ? 'bg-[#EFF6FF] text-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.06)]'
                                        : 'text-[#475569] hover:bg-white hover:text-[#0F172A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                                }`}
                            >
                                <Icon className={`w-[20px] h-[20px] mr-3 flex-shrink-0 ${active ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                                {label}
                            </button>
                        );
                    })
                ) : (
                    // Staff/admin: page-route nav
                    menuItems.map(item => (
                        <button
                            key={item.path + item.label}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-[12px] font-bold transition-all ${
                                isActive(item.path)
                                    ? 'bg-[#EFF6FF] text-[#2563EB] shadow-[0_2px_8px_rgba(37,99,235,0.06)]'
                                    : 'text-[#475569] hover:bg-white hover:text-[#0F172A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                            }`}
                        >
                            <item.icon className={`w-[20px] h-[20px] mr-3 ${isActive(item.path) ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                            {item.label}
                        </button>
                    ))
                )}
            </nav>

            {/* Bottom: settings + user card */}
            <div className="p-4 border-t border-[#E2E8F0] space-y-2">
                <button className="w-full flex items-center px-4 py-3 rounded-lg text-[12px] font-bold text-[#475569] hover:bg-white hover:text-[#0F172A] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <Settings className="w-5 h-5 mr-3 text-[#64748B]" />
                    Configurações
                </button>
                <div className="flex items-center mt-4 px-3 py-2 bg-white rounded-xl shadow-sm border border-[#E2E8F0]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 font-bold text-[13px] flex-shrink-0 ${isPatient ? 'bg-[#DBEAFE] text-[#1D4ED8]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                        {isPatient ? 'CE' : <UserCircle className="w-9 h-9 text-[#CBD5E1]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-[#0F172A] truncate">
                            {isPatient ? 'Carlos E. Lima' : 'Dr. Exemplo'}
                        </p>
                        <p className="text-[11px] font-medium text-[#64748B] truncate">
                            {isPatient ? 'Paciente' : 'Cardiologia'}
                        </p>
                    </div>
                    <button onClick={() => navigate('/')} className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Sair">
                        <LogOut className="w-[18px] h-[18px]" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

const Header = () => (
    <header className="lg:hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border-b border-[#E2E8F0] sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
            <button className="text-[#64748B] hover:text-[#0F172A] mr-4 transition-colors">
                <Menu className="w-6 h-6" />
            </button>
            <div className="bg-[#2563EB] rounded-md p-1.5 flex items-center justify-center mr-2 shadow-sm">
                <span className="text-white font-bold text-sm leading-none">P</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-lg text-[#0F172A] tracking-tight leading-none">SCI</span>
                <span className="text-[#64748B] font-medium text-xs">Pareceres Médicos</span>
            </div>
        </div>
    </header>
);

const Layout: React.FC = () => (
    <div className="min-h-screen bg-[#F1F5F9] flex" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64 h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F1F5F9]">
                <Outlet />
            </main>
        </div>
    </div>
);

export default Layout;
