import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppRole, AuthUser, PatientProfile } from '../types/bedlink';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updatePatientProfile: (profile: Partial<PatientProfile>) => void;
}

const STORAGE_KEY_AUTH = 'vitaroute_auth_v1';

// Demo users for hackathon
const DEMO_USERS: { email: string; password: string; user: AuthUser }[] = [
  {
    email: 'patient@demo.com',
    password: 'demo123',
    user: {
      id: 'user-patient-01',
      email: 'patient@demo.com',
      name: 'Rajesh Kumar',
      role: 'patient',
      patientProfile: {
        id: 'pat-01',
        name: 'Rajesh Kumar',
        age: 45,
        bloodGroup: 'O+',
        allergies: ['Penicillin', 'Sulfa drugs'],
        medicalConditions: ['Type 2 Diabetes', 'Hypertension'],
        primaryMobile: '+91 98765 43210',
        backupMobile1: '+91 87654 32109',
        backupMobile2: '+91 76543 21098',
        emergencyContact: 'Priya Kumar (Wife) — +91 99887 76655',
      },
    },
  },
  {
    email: 'ambulance@demo.com',
    password: 'demo123',
    user: {
      id: 'user-ambulance-01',
      email: 'ambulance@demo.com',
      name: 'Paramedic Arjun Singh',
      role: 'ambulance',
      ambulanceId: 'Ambulance 104 (ALS Paramedic Unit)',
    },
  },
  {
    email: 'nurse@demo.com',
    password: 'demo123',
    user: {
      id: 'user-nurse-01',
      email: 'nurse@demo.com',
      name: 'Nurse Sarah Kowalski',
      role: 'nurse',
      hospitalId: 'sjm-01',
    },
  },
  {
    email: 'hospital@demo.com',
    password: 'demo123',
    user: {
      id: 'user-hospital-01',
      email: 'hospital@demo.com',
      name: 'Dr. Katherine Vance',
      role: 'hospital',
      hospitalId: 'sjm-01',
    },
  },
  {
    email: 'admin@demo.com',
    password: 'demo123',
    user: {
      id: 'user-admin-01',
      email: 'admin@demo.com',
      name: 'Admin Control',
      role: 'admin',
    },
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      setUser(found.user);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  const updatePatientProfile = useCallback((profile: Partial<PatientProfile>) => {
    setUser((prev) => {
      if (!prev || !prev.patientProfile) return prev;
      return {
        ...prev,
        patientProfile: { ...prev.patientProfile, ...profile },
      };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updatePatientProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { DEMO_USERS };
