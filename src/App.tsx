/**
 * VitaRoute - Hospital Emergency Bed Coordination & Ambulance Dispatch
 * High-reliability, real-time emergency healthcare operations software
 */

import React from 'react';
import { BedLinkProvider, useBedLink } from './context/BedLinkContext';
import { Header } from './components/Header';
import { DemoScenarioBar } from './components/common/DemoScenarioBar';
import { NurseBedUpdateView } from './components/nurse/NurseBedUpdateView';
import { AmbulanceDispatchView } from './components/dispatch/AmbulanceDispatchView';
import { ERConfirmHoldView } from './components/er/ERConfirmHoldView';
import { NotificationToast } from './components/common/NotificationToast';

const DashboardContent: React.FC = () => {
  const { role } = useBedLink();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Institutional Hospital Header */}
      <Header />

      {/* Operational Testing Scenarios Bar */}
      <DemoScenarioBar />

      {/* Main Operations Section */}
      <main className="flex-1 pb-16">
        {role === 'nurse' && <NurseBedUpdateView />}
        {role === 'dispatch' && <AmbulanceDispatchView />}
        {role === 'er' && <ERConfirmHoldView />}
      </main>

      {/* Notification Toast */}
      <NotificationToast />

      {/* Hospital Software Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-slate-700 font-semibold">VitaRoute Emergency Operations Platform</span>
            <span>&middot;</span>
            <span>Regional CAD &amp; Hospital Bed Coordination</span>
          </div>
          <div className="text-slate-400">
            HL7 FHIR Clinical Standards Compliant &middot; High-Reliability Emergency Dispatch
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BedLinkProvider>
      <DashboardContent />
    </BedLinkProvider>
  );
}
