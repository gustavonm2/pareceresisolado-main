// ─── patientStore.ts ────────────────────────────────────────────────────────
// Central utility for reading and writing shared patient data to localStorage.
// This simulates a backend API while the app uses a frontend-only architecture.
// ─────────────────────────────────────────────────────────────────────────────

export interface StoredOpinion {
    id: string;
    patientId: string;
    patientName: string;
    specialty: string;
    doctor: string;
    date: string;
    summary: string;
    isNew: boolean; // unread flag for patient portal
}

export interface StoredConsulta {
    patientId: string;
    patientName: string;
    date: string;     // e.g. "20/03/2026"
    time: string;     // e.g. "10:00"
    type: string;     // e.g. "Retorno Online"
    status: 'aguardando_whatsapp' | 'aguardando_medico' | 'confirmado';
    modalidade: 'online' | 'parecer';
    doctorConfirmed?: boolean;
}

export interface StoredTriagem {
    id: string;
    patientId: string;
    patientName: string;
    cpf: string;
    age: number;
    // Pre-filled from registration
    initialSymptoms: string;
    cadastroDate: string;
    cadastroTime: string;
    // Filled by triador
    priority: 'Alta' | 'Média' | 'Baixa';
    pa: string;          // e.g. "120/80 mmHg"
    fc: string;          // e.g. "72 bpm"
    temperatura: string; // e.g. "36.5°C"
    spo2: string;        // e.g. "98%"
    queixaDetalhada: string;
    hipotese: string;
    modalidade: 'online' | 'parecer';
    especialidade: string;
    observacoes: string;
    // Metadata
    triadoEm: string;
    triadoPor: string;
    status: 'aguardando_parecer' | 'em_atendimento' | 'finalizado';
}

const OPINOES_KEY = 'pc_opinoes';
const CONSULTA_KEY = 'pc_consulta';
const MODALIDADE_KEY = 'pc_modalidade';
const TRIAGENS_KEY = 'pc_triagens';


// ── Opiniões / Pareceres ──────────────────────────────────────────────────────

export function getOpinioes(patientId?: string): StoredOpinion[] {
    try {
        const raw = localStorage.getItem(OPINOES_KEY);
        const all: StoredOpinion[] = raw ? JSON.parse(raw) : [];
        if (patientId) return all.filter(o => o.patientId === patientId);
        return all;
    } catch {
        return [];
    }
}

export function addOpiniao(opinion: Omit<StoredOpinion, 'id' | 'isNew'>): StoredOpinion {
    const existing = getOpinioes();
    const newOpinion: StoredOpinion = {
        ...opinion,
        id: `op_${Date.now()}`,
        isNew: true,
    };
    localStorage.setItem(OPINOES_KEY, JSON.stringify([newOpinion, ...existing]));
    return newOpinion;
}

export function markOpiniaoAsRead(opinionId: string): void {
    const existing = getOpinioes();
    const updated = existing.map(o => o.id === opinionId ? { ...o, isNew: false } : o);
    localStorage.setItem(OPINOES_KEY, JSON.stringify(updated));
}

export function hasNewOpinioes(patientId?: string): boolean {
    return getOpinioes(patientId).some(o => o.isNew);
}

// ── Consulta agendada (Telemedicina) ─────────────────────────────────────────

export function getConsulta(): StoredConsulta | null {
    try {
        const raw = localStorage.getItem(CONSULTA_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setConsulta(data: StoredConsulta): void {
    localStorage.setItem(CONSULTA_KEY, JSON.stringify(data));
}

export function updateConsultaStatus(status: StoredConsulta['status']): void {
    const current = getConsulta();
    if (current) {
        localStorage.setItem(CONSULTA_KEY, JSON.stringify({ ...current, status }));
    }
}

export function confirmConsultaByDoctor(): void {
    const current = getConsulta();
    if (current) {
        localStorage.setItem(CONSULTA_KEY, JSON.stringify({
            ...current,
            status: 'confirmado',
            doctorConfirmed: true,
        }));
    }
}

// ── Modalidade do paciente ────────────────────────────────────────────────────

export function getModalidadePaciente(): 'online' | 'parecer' | null {
    const m = localStorage.getItem(MODALIDADE_KEY);
    if (m === 'online' || m === 'parecer') return m;
    return null;
}

export function setModalidadePaciente(modalidade: 'online' | 'parecer'): void {
    localStorage.setItem(MODALIDADE_KEY, modalidade);
}

// ── Dev helpers (for testing the flow) ───────────────────────────────────────

export function simulateWhatsAppConfirmation(patientName: string): void {
    setConsulta({
        patientId: 'current',
        patientName,
        date: '20/03/2026',
        time: '10:00',
        type: 'Teleconsulta Online',
        status: 'aguardando_medico',
        modalidade: 'online',
    });
}

// ── Triagens (Triador → Parecerista) ─────────────────────────────────────────

export function getTriagens(): StoredTriagem[] {
    try {
        const raw = localStorage.getItem(TRIAGENS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function addTriagem(triagem: Omit<StoredTriagem, 'id' | 'status' | 'triadoEm'>): StoredTriagem {
    const existing = getTriagens();
    const newTriagem: StoredTriagem = {
        ...triagem,
        id: `tri_${Date.now()}`,
        status: 'aguardando_parecer',
        triadoEm: new Date().toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }),
    };
    localStorage.setItem(TRIAGENS_KEY, JSON.stringify([newTriagem, ...existing]));
    return newTriagem;
}

export function updateTriagemStatus(id: string, status: StoredTriagem['status']): void {
    const existing = getTriagens();
    const updated = existing.map(t => t.id === id ? { ...t, status } : t);
    localStorage.setItem(TRIAGENS_KEY, JSON.stringify(updated));
}

export function clearPatientStore(): void {
    localStorage.removeItem(OPINOES_KEY);
    localStorage.removeItem(CONSULTA_KEY);
    localStorage.removeItem(MODALIDADE_KEY);
    localStorage.removeItem(TRIAGENS_KEY);
}
