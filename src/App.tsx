/**
 * VitaRoute - Hospital Emergency Bed Coordination and Ambulance Dispatch
 * High-reliability, real-time emergency healthcare operations software
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BedLinkProvider, useBedLink } from './context/BedLinkContext';
import { Header } from './components/Header';
import { LoginPage } from './components/auth/LoginPage';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { AmbulanceDashboard } from './components/ambulance/AmbulanceDashboard';
import { NurseBedUpdateView } from './components/nurse/NurseBedUpdateView';
import { HospitalDashboard } from './components/hospital/HospitalDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationToast } from './components/common/NotificationToast';

const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { role, setRole } = useBedLink();

  // Sync context role with auth role
  React.useEffect(() => {
    if (user && user.role !== role) {
      setRole(user.role);
    }
  }, [user, role, setRole]);

  const currentRole = user?.role || role;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Operations Section */}
      <main className="flex-1 pb-6">
        {currentRole === 'patient' && <PatientDashboard />}
        {currentRole === 'ambulance' && <AmbulanceDashboard />}
        {currentRole === 'nurse' && <NurseBedUpdateView />}
        {currentRole === 'hospital' && <HospitalDashboard />}
        {currentRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Notification Toast */}
      <NotificationToast />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto">
          <span className="font-medium text-slate-500">VitaRoute Emergency Operations Platform</span>
          <span className="mx-1">&middot;</span>
          <span>Real-Time Bed Allocation & Dispatch</span>
        </div>
      </footer>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BedLinkProvider>
      <DashboardContent />
    </BedLinkProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}
