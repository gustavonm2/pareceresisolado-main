import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Cpu, Laptop, Users, Building2, Heart, Stethoscope } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-['Inter',sans-serif] text-slate-900">

            {/* ===== NAVBAR ===== */}
            <nav className="bg-white fixed w-full z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10">
                            {/* Infinity-like logo using two overlapping circles like Kompa */}
                            <div className="w-10 h-10 rounded-full border-[3px] border-[#2563EB] absolute left-0"></div>
                            <div className="w-10 h-10 rounded-full border-[3px] border-[#0EA5E9] absolute left-4"></div>
                        </div>
                        <div className="ml-5">
                            <span className="font-extrabold text-xl text-[#0F172A] tracking-tight leading-none block">SCI</span>
                            <span className="text-xs text-slate-400 font-medium tracking-widest">Pareceres médicos</span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-10 font-semibold text-sm text-[#1E293B]">
                        <a href="#como-funciona" className="hover:text-[#2563EB] transition-colors">Como funciona</a>
                        <a href="#solucoes" className="hover:text-[#2563EB] transition-colors">Soluções</a>
                        <a href="#contato" className="hover:text-[#2563EB] transition-colors">Contato</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all"
                        >
                            Acesso Restrito <ArrowRight className="inline w-4 h-4 ml-1" />
                        </button>
                    </div>

                    {/* Mobile access button */}
                    <button
                        onClick={() => navigate('/login')}
                        className="md:hidden bg-[#2563EB] text-white font-bold px-4 py-2 rounded-full text-sm"
                    >
                        Acessar
                    </button>
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className="pt-20 bg-white">
                <div className="flex flex-col lg:flex-row" style={{ minHeight: '480px' }}>
                        {/* Left: Image */}
                        <div className="lg:w-1/2 relative min-h-[380px]">
                            <img
                                src="/doctor_hero.png"
                                alt="Médico usando o SCI"
                                className="w-full h-full object-cover object-top"
                                style={{ minHeight: '480px' }}
                            />
                        </div>

                        {/* Right: Text */}
                        <div className="lg:w-1/2 px-12 py-16 flex flex-col justify-center bg-white">
                            <p className="text-[#2563EB] text-xs font-bold tracking-widest uppercase mb-3">
                                SCI — SISTEMA DE CUIDADO INTEGRADO
                            </p>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] leading-tight mb-5">
                                Gestão inteligente de interconsultas, <span className="text-[#2563EB]">mais rápida e segura.</span>
                            </h1>
                            <p className="text-base text-slate-500 leading-relaxed mb-8">
                                Impulsionada por IA e organizada por alçadas de atendimento, oferecemos uma
                                jornada de assistência médica digital completa para equipes hospitalares e pacientes.
                            </p>
                            <div>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 w-fit"
                                >
                                    Solicite uma demonstração <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                </div>
            </section>

            {/* ===== SECTION 2: "Saúde de qualidade na palma da mão" ===== */}
            <section className="py-20 bg-[#F0F4F8]">
                <div className="px-8 lg:px-16">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A]">
                            <span className="text-[#2563EB]">Tecnologia</span> de qualidade na palma da mão!
                        </h2>
                    </div>

                    {/* Two teal cards */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1 */}
                        <div className="bg-[#1E40AF] rounded-2xl p-8 relative flex flex-col justify-between min-h-[200px]">
                            {/* Circular photo in top-left */}
                            <div className="absolute -top-6 left-8">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img src="/testimonial_1.png" alt="Médico" className="w-full h-full object-cover object-top" />
                                </div>
                            </div>
                            <div className="mt-14">
                                <p className="text-white text-lg font-bold leading-snug">
                                    A jornada de interconsulta mais inovadora do mercado, do atendimento médico por IA à telemedicina tradicional.
                                </p>
                            </div>
                            {/* Bottom icon */}
                            <div className="mt-6">
                                <div className="w-9 h-9 rounded-full border-2 border-white/40 flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#0369A1] rounded-2xl p-8 relative flex flex-col justify-between min-h-[200px]">
                            {/* Circular photo */}
                            <div className="absolute -top-6 left-8">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img src="/testimonial_2.png" alt="Médico especialista" className="w-full h-full object-cover object-top" />
                                </div>
                            </div>
                            <div className="mt-14">
                                <p className="text-white text-lg font-bold leading-snug">
                                    Tecnologia no apoio ao corpo clínico visando maior qualidade no diagnóstico e redução de custo operacional!
                                </p>
                            </div>
                            {/* Bottom icon */}
                            <div className="mt-6">
                                <div className="w-9 h-9 rounded-full border-2 border-white/40 flex items-center justify-center">
                                    <Stethoscope className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 3: COMO FUNCIONA ===== */}
            <section id="como-funciona" className="py-20 bg-white">
                <div className="px-8 lg:px-20">
                    <h2 className="text-3xl font-extrabold text-[#0F172A] text-center mb-20">Como funciona?</h2>

                    {/* Steps grid – zigzag layout like reference */}
                    <div className="flex flex-col gap-24">

                        {/* Row 1 – Step 1 left, Step 2 right */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center relative">
                                {/* Decorative shapes */}
                                <div className="absolute -top-6 right-4 w-12 h-12 rounded-full bg-[#BFDBFE] opacity-70"></div>
                                <div className="absolute -top-2 right-0 w-8 h-8 rounded bg-[#2563EB] opacity-50 rotate-12"></div>
                                <div className="absolute top-8 -left-4 w-10 h-10 rounded-full bg-[#0EA5E9] opacity-40"></div>

                                {/* Circle image */}
                                <div className="relative mb-4">
                                    <div className="w-52 h-52 rounded-full overflow-hidden border-8 border-[#EFF6FF] shadow-xl">
                                        <img src="/doctor_hero.png" alt="IA Médica" className="w-full h-full object-cover object-top" />
                                    </div>
                                    {/* Number badge */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#2563EB] text-white font-extrabold text-lg flex items-center justify-center shadow-lg">
                                        1
                                    </div>
                                </div>
                                <h3 className="font-extrabold text-[#0F172A] mt-6 text-lg">Solicitação por IA</h3>
                                <p className="text-slate-500 text-sm mt-2 max-w-xs">
                                    O médico solicita o parecer diretamente pelo sistema. A IA faz a triagem inicial, organiza o quadro clínico e encaminha ao especialista certo.
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="hidden md:flex items-center justify-start pl-4 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none">
                                {/* handled by grid position */}
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center relative">
                                {/* Decorative shapes */}
                                <div className="absolute -top-6 left-4 w-12 h-12 rounded-full bg-[#7DD3FC] opacity-60"></div>
                                <div className="absolute top-4 -right-2 w-8 h-16 rounded-full bg-[#BFDBFE] opacity-60"></div>

                                {/* Circle image */}
                                <div className="relative mb-4">
                                    <div className="w-52 h-52 rounded-full overflow-hidden border-8 border-[#EFF6FF] shadow-xl">
                                        <img src="/doctor_phone.png" alt="Avaliação por chat" className="w-full h-full object-cover object-center" />
                                    </div>
                                    {/* Number badge */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#2563EB] text-white font-extrabold text-lg flex items-center justify-center shadow-lg">
                                        2
                                    </div>
                                </div>
                                <h3 className="font-extrabold text-[#0F172A] mt-6 text-lg">Avaliação por chat:</h3>
                                <p className="text-slate-500 text-sm mt-2 max-w-xs">
                                    O especialista recebe o resumo dos achados, analisa hipóteses diagnósticas e condutas sugeridas pela IA e segue o atendimento ao paciente.
                                </p>
                            </div>
                        </div>

                        {/* Divider arrow */}
                        <div className="flex justify-center -my-10">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#2563EB] fill-[#2563EB]">
                                    <path d="M12 2L2 12h5v10h10V12h5z" />
                                </svg>
                            </div>
                        </div>

                        {/* Row 2 – Step 4 left, Step 3 right (zigzag continues) */}
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center relative">
                                {/* Decorative shapes */}
                                <div className="absolute -top-6 right-2 w-16 h-8 rounded-full bg-[#BFDBFE] opacity-60"></div>
                                <div className="absolute top-12 right-0 w-8 h-8 rounded-full bg-[#7DD3FC] opacity-50"></div>
                                <div className="absolute -top-4 left-6 w-10 h-10 rounded bg-[#1E40AF] opacity-30 rotate-6"></div>

                                {/* Circle image */}
                                <div className="relative mb-4">
                                    <div className="w-52 h-52 rounded-full overflow-hidden border-8 border-[#EFF6FF] shadow-xl">
                                        <img src="/patient_happy.png" alt="Paciente bem atendido" className="w-full h-full object-cover object-top" />
                                    </div>
                                    {/* Number badge */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#2563EB] text-white font-extrabold text-lg flex items-center justify-center shadow-lg">
                                        4
                                    </div>
                                </div>
                                <h3 className="font-extrabold text-[#0F172A] mt-6 text-lg">Desfecho clínico estruturado! :)</h3>
                                <p className="text-slate-500 text-sm mt-2 max-w-xs">
                                    Ofereça uma jornada de saúde inovadora e eficiente. Rápido, acessível e auditável na palma da mão.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center relative">
                                {/* Decorative shapes */}
                                <div className="absolute -top-4 left-2 w-10 h-10 rounded-full bg-[#2563EB] opacity-20"></div>
                                <div className="absolute top-0 right-6 w-14 h-7 rounded-full bg-[#7DD3FC] opacity-50"></div>

                                {/* Circle image */}
                                <div className="relative mb-4">
                                    <div className="w-52 h-52 rounded-full overflow-hidden border-8 border-[#EFF6FF] shadow-xl">
                                        <img src="/doctors_consulting.png" alt="Atendimento por vídeo ou presencial" className="w-full h-full object-cover object-center" />
                                    </div>
                                    {/* Number badge */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#2563EB] text-white font-extrabold text-lg flex items-center justify-center shadow-lg">
                                        3
                                    </div>
                                </div>
                                <h3 className="font-extrabold text-[#0F172A] mt-6 text-lg">Atendimento por vídeo ou presencial:</h3>
                                <p className="text-slate-500 text-sm mt-2 max-w-xs">
                                    Dependendo do caso, o médico pode solicitar teleconsulta por vídeo ou encaminhar para atendimento presencial com todo histórico disponível.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA button below steps */}
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-10 py-4 rounded-full text-base transition-all shadow-lg shadow-blue-500/25"
                        >
                            Faça uma demonstração
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 4: Soluções 100% customizáveis ===== */}
            <section id="solucoes" className="py-16 bg-[#1E40AF]">
                <div className="px-8 lg:px-20">
                    <h2 className="text-2xl font-extrabold text-white text-center mb-14">
                        Soluções 100% customizáveis para hospitais
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Cpu className="w-12 h-12 text-white" strokeWidth={1} />
                            </div>
                            <p className="text-white text-sm font-medium leading-snug">
                                Assistente de triagem por inteligência artificial
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Laptop className="w-12 h-12 text-white" strokeWidth={1} />
                            </div>
                            <p className="text-white text-sm font-medium leading-snug">
                                Plataforma para pareceres assíncronos (chat) e síncronos (vídeo)
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Users className="w-12 h-12 text-white" strokeWidth={1} />
                            </div>
                            <p className="text-white text-sm font-medium leading-snug">
                                Especialistas médicos de diferentes áreas integrados à plataforma
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-white" strokeWidth={1} />
                            </div>
                            <p className="text-white text-sm font-medium leading-snug">
                                Experiência digital em ambulatórios e setores hospitalares
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 5: Depoimentos ===== */}
            <section className="py-20 bg-[#F0F4F8]">
                <div className="px-8 lg:px-20">
                    <h2 className="text-3xl font-extrabold text-[#0F172A] text-center mb-12">
                        O que dizem os <span className="text-[#2563EB]">especialistas</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
                            <div className="text-[64px] font-serif text-[#BFDBFE] absolute top-4 left-6 leading-none select-none">"</div>
                            <p className="text-slate-500 text-base italic relative z-10 mb-8 pt-6">
                                A plataforma transformou nossa emergência. O tempo de espera caiu mais de 40% com a comunicação direta via sistema, garantindo um giro de leito muito mais seguro.
                            </p>
                            <div className="flex items-center border-t border-slate-100 pt-6">
                                <img src="/testimonial_1.png" alt="Dr. Carlos Mendes" className="w-14 h-14 rounded-full object-cover mr-4" />
                                <div>
                                    <h4 className="font-bold text-[#0F172A]">Dr. Carlos Mendes</h4>
                                    <p className="text-sm text-slate-400">Diretor Médico, Hospital Saúde Master</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
                            <div className="text-[64px] font-serif text-[#BFDBFE] absolute top-4 left-6 leading-none select-none">"</div>
                            <p className="text-slate-500 text-base italic relative z-10 mb-8 pt-6">
                                O que mais me impressionou foi a governança clínica que conseguimos estabelecer. Todo parecer é rastreável e as discussões estão todas no prontuário, como deve ser.
                            </p>
                            <div className="flex items-center border-t border-slate-100 pt-6">
                                <img src="/testimonial_2.png" alt="Dra. Helena Freitas" className="w-14 h-14 rounded-full object-cover object-top mr-4" />
                                <div>
                                    <h4 className="font-bold text-[#0F172A]">Dra. Helena Freitas</h4>
                                    <p className="text-sm text-slate-400">Gestão Assistencial, Clínica Nova</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA FINAL ===== */}
            <section id="contato" className="py-24 bg-[#0F172A] relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#1E40AF]/30 blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                        Pronto para modernizar a gestão clínica do seu hospital?
                    </h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                        Agende uma demonstração gratuita e descubra como o SCI pode centralizar o fluxo de pareceres e acelerar desfechos clínicos.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-lg px-10 py-5 rounded-full transition-all shadow-xl shadow-blue-600/20 inline-block"
                    >
                        Solicitar demonstração
                    </button>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-slate-900 border-t border-slate-800 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                            <div className="w-8 h-8 rounded-full border-2 border-[#2563EB] absolute left-0"></div>
                            <div className="w-8 h-8 rounded-full border-2 border-[#0EA5E9] absolute left-3"></div>
                        </div>
                        <div className="ml-4">
                            <span className="font-bold text-lg text-white block leading-none">SCI</span>
                            <span className="text-[#60A5FA] text-xs">Pareceres médicos</span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">© Exônia 2026. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
