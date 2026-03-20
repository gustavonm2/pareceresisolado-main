import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ClinicGroup, ClinicMember, ProfessionalRole } from '../types';

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'sci_clinic_groups';

export function loadGroups(): ClinicGroup[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

export function saveGroups(groups: ClinicGroup[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoggedUserType = 'admin' | ProfessionalRole | 'paciente' | 'gestor_master';

export interface LoggedUser {
    id: string;
    name: string;
    email: string;
    role: LoggedUserType;
    groupId?: string;
    groupName?: string;
}

interface AuthContextType {
    currentUser: LoggedUser | null;
    isLoggedIn: boolean;
    /** Try to log in with email + password. Returns role on success or null on failure. */
    loginUser: (email: string, password: string) => LoggedUserType | null;
    logoutUser: () => void;
    /** Register a new clinic group and return its id */
    registerGroup: (group: Omit<ClinicGroup, 'id' | 'members' | 'createdAt'>) => string;
    /** Add a member to an existing group */
    addMember: (groupId: string, member: Omit<ClinicMember, 'id' | 'groupId' | 'createdAt'>) => boolean;
    /** Get group by id */
    getGroup: (groupId: string) => ClinicGroup | undefined;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<LoggedUser | null>(() => {
        const raw = localStorage.getItem('sci_current_user');
        return raw ? JSON.parse(raw) : null;
    });

    const loginUser = useCallback((email: string, password: string): LoggedUserType | null => {
        const normalizedEmail = email.toLowerCase().trim();
        const groups = loadGroups();

        for (const group of groups) {
            // Check if admin
            if (
                group.adminEmail.toLowerCase() === normalizedEmail &&
                group.adminPassword === password
            ) {
                const user: LoggedUser = {
                    id: `admin-${group.id}`,
                    name: group.adminName,
                    email: group.adminEmail,
                    role: 'gestor_master',
                    groupId: group.id,
                    groupName: group.name,
                };
                setCurrentUser(user);
                localStorage.setItem('sci_current_user', JSON.stringify(user));
                localStorage.setItem('userRole', 'gestor_master');
                return 'gestor_master';
            }

            // Check members
            const member = group.members.find(
                m => m.email.toLowerCase() === normalizedEmail && m.password === password
            );
            if (member) {
                const user: LoggedUser = {
                    id: member.id,
                    name: member.name,
                    email: member.email,
                    role: member.role,
                    groupId: group.id,
                    groupName: group.name,
                };
                setCurrentUser(user);
                localStorage.setItem('sci_current_user', JSON.stringify(user));
                localStorage.setItem('userRole', member.role);
                return member.role;
            }
        }

        return null; // Not found in any group
    }, []);

    const logoutUser = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('sci_current_user');
        localStorage.removeItem('userRole');
    }, []);

    const registerGroup = useCallback(
        (groupData: Omit<ClinicGroup, 'id' | 'members' | 'createdAt'>): string => {
            const groups = loadGroups();
            const id = `group-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            const newGroup: ClinicGroup = {
                ...groupData,
                id,
                members: [],
                createdAt: new Date().toISOString(),
            };
            saveGroups([...groups, newGroup]);
            return id;
        },
        []
    );

    const addMember = useCallback(
        (groupId: string, memberData: Omit<ClinicMember, 'id' | 'groupId' | 'createdAt'>): boolean => {
            const groups = loadGroups();
            const idx = groups.findIndex(g => g.id === groupId);
            if (idx === -1) return false;

            const newMember: ClinicMember = {
                ...memberData,
                id: `member-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                groupId,
                createdAt: new Date().toISOString(),
            };
            groups[idx].members.push(newMember);
            saveGroups(groups);
            return true;
        },
        []
    );

    const getGroup = useCallback((groupId: string) => {
        return loadGroups().find(g => g.id === groupId);
    }, []);

    return (
        <AuthContext.Provider
            value={{ currentUser, isLoggedIn: !!currentUser, loginUser, logoutUser, registerGroup, addMember, getGroup }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
