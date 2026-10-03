import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BedLinkProvider, useBedLink } from './context/BedLinkContext';
import { Header } from './components/Header';
import { HomePage } from './components/home/HomePage';
import { AmbulanceDispatchView } from './components/dispatch/AmbulanceDispatchView';
import { NurseBedUpdateView } from './components/nurse/NurseBedUpdateView';
import { ERConfirmHoldView } from './components/er/ERConfirmHoldView';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationToast } from './components/common/NotificationToast';

interface DashboardContentProps {
  onReturnHome: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ onReturnHome }) => {
  const { user } = useAuth();
  const { role, setRole } = useBedLink();
  const initializedUserRef = React.useRef<string | null>(null);

  // Set initial screen based on login role once, without overriding manual clicks
  React.useEffect(() => {
    if (user && user.id !== initializedUserRef.current) {
      initializedUserRef.current = user.id;
      if (user.role === 'ambulance') {
        setRole('dispatch');
      } else if (user.role === 'hospital') {
        setRole('er');
      } else {
        setRole(user.role);
      }
    }
  }, [user, setRole]);

  const currentRole = role;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-neutral-900 flex flex-col font-sans">
      {/* Top Operations Header */}
      <Header onReturnHome={onReturnHome} />

      {/* Main Operations Section */}
      <main className="flex-1 pb-24 md:pb-12 max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* Screen 1: Ambulance Dispatch (Find Hospital & Bed Match) */}
        {(currentRole === 'dispatch' || currentRole === 'ambulance') && <AmbulanceDispatchView />}

        {/* Screen 2: 10-Second Bed Updates (Ward Nurses) */}
        {currentRole === 'nurse' && <NurseBedUpdateView />}

        {/* Screen 3: 2-Minute Confirm & Hold (Hospital ER Desk) */}
        {(currentRole === 'er' || currentRole === 'hospital') && <ERConfirmHoldView />}

        {/* Citizen SOS & Regional Admin */}
        {currentRole === 'patient' && <PatientDashboard />}
        {currentRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Real-Time Audio & Visual Alerts */}
      <NotificationToast />

      {/* Simple Humanized Footer */}
      <footer className="hidden md:block border-t border-neutral-200/80 bg-white py-4 px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span className="font-semibold text-neutral-800">VitaRoute Emergency Coordination</span>
            <span className="text-neutral-400">&middot; Connecting ambulances directly to hospital ERs</span>
          </div>
          <span className="text-neutral-400">10s Nurse Updates &middot; Real Travel Times &middot; 2-Min ER Holds</span>
        </div>
      </footer>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [showLanding, setShowLanding] = React.useState<boolean>(false);

  // If unauthenticated or user navigated to home overview, show HomePage
  if (!isAuthenticated || showLanding) {
    return (
      <HomePage
        onEnterApp={() => {
          if (isAuthenticated) {
            setShowLanding(false);
          } else {
            login('ambulance@demo.com', 'demo123');
            setShowLanding(false);
          }
        }}
      />
    );
  }

  return (
    <BedLinkProvider>
      <DashboardContent onReturnHome={() => setShowLanding(true)} />
    </BedLinkProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
