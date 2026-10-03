import React from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { AppRole } from '../../types/bedlink';
import {
  AlertCircle,
  Ambulance,
  Clock,
  Building2,
  Stethoscope,
  CheckCircle2,
  ChevronRight,
  Radio,
  MapPin,
  Calendar,
} from 'lucide-react';

interface LiveEmergencyWorkflowBarProps {
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
}

export const LiveEmergencyWorkflowBar: React.FC<LiveEmergencyWorkflowBarProps> = ({
  currentRole,
  onSelectRole,
}) => {
  const {
    activeHolds,
    activeCitizenSOS,
    currentHospital,
    hospitals,
    doctors,
    language,
  } = useBedLink();

  // Find active hold or fallback to first hold
  const activeHold = activeHolds.find((h) => h.status === 'accepted' || h.status === 'pending') || activeHolds[0];
  const targetHospital = hospitals.find((h) => h.id === activeHold?.hospitalId) || currentHospital;
  const availableDoctor = doctors.find((d) => d.hospitalId === targetHospital.id && d.status === 'available');

  const steps: {
    role: AppRole;
    stepNumber: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    isCompleted: boolean;
  }[] = [
    {
      role: 'patient',
      stepNumber: '01',
      title: language === 'hi' ? 'नागरिक एसओएस' : language === 'mr' ? 'नागरिक एसओएस' : 'Patient SOS',
      subtitle: language === 'hi' ? 'आपातकालीन कॉल' : language === 'mr' ? 'आणीबाणी कॉल' : 'Incident Triage',
      icon: AlertCircle,
      isActive: currentRole === 'patient',
      isCompleted: !!activeCitizenSOS || !!activeHold,
    },
    {
      role: 'dispatch',
      stepNumber: '02',
      title: language === 'hi' ? 'एम्बुलेंस डिस्पैच' : language === 'mr' ? 'रुग्णवाहिका डिस्पॅच' : 'Ambulance CAD',
      subtitle: language === 'hi' ? 'बेड व अस्पताल मिलान' : language === 'mr' ? 'बेड आणि रुग्णालय मॅच' : 'Hospital Ranking',
      icon: Ambulance,
      isActive: currentRole === 'dispatch' || currentRole === 'ambulance',
      isCompleted: !!activeHold,
    },
    {
      role: 'er',
      stepNumber: '03',
      title: language === 'hi' ? 'ईआर 2m होल्ड' : language === 'mr' ? 'ईआर 2m होल्ड' : 'ER 2m Hold',
      subtitle: language === 'hi' ? 'बेड लॉक विंडो' : language === 'mr' ? 'बेड लॉक विंडो' : 'Bed Hold Timer',
      icon: Clock,
      isActive: currentRole === 'er' || currentRole === 'hospital',
      isCompleted: activeHold?.status === 'accepted' || activeHold?.status === 'arrived',
    },
    {
      role: 'tracking',
      stepNumber: '04',
      title: language === 'hi' ? 'लाइव ट्रैकिंग' : language === 'mr' ? 'थेट ट्रॅकिंग' : 'Live Tracking',
      subtitle: language === 'hi' ? 'रास्ते में एम्बुलेंस' : language === 'mr' ? 'मार्गावर रुग्णवाहिका' : 'Road Telematics',
      icon: Radio,
      isActive: currentRole === 'tracking',
      isCompleted: activeHold?.status === 'arrived',
    },
    {
      role: 'doctors',
      stepNumber: '05',
      title: language === 'hi' ? 'डॉक्टर रोस्टर' : language === 'mr' ? 'डॉक्टर रोस्टर' : 'Doctor Roster',
      subtitle: language === 'hi' ? 'ऑन-कॉल विशेषज्ञ' : language === 'mr' ? 'ऑन-कॉल तज्ज्ञ' : 'Attending Roster',
      icon: Stethoscope,
      isActive: currentRole === 'doctors',
      isCompleted: false,
    },
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-4 mb-5 shadow-xs space-y-3">
      {/* Live System Operational State Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-neutral-100 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="font-bold text-neutral-900 uppercase tracking-wider font-mono">
            {language === 'hi' ? 'सक्रिय आपातकालीन स्थिति:' : language === 'mr' ? 'सक्रिय आणीबाणी स्थिती:' : 'LIVE EMERGENCY DISPATCH STATUS:'}
          </span>
          <span className="px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 font-semibold font-mono">
            CASE #VR-{activeHold ? activeHold.id.slice(-4).toUpperCase() : '9021'}
          </span>
          <span className="text-neutral-600 font-medium">
            {activeHold?.chiefComplaint || 'Acute Respiratory Distress / Severe Hypoxemia'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-neutral-500 font-medium">Assigned Bed:</span>
          <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200">
            {targetHospital.name.replace('Hospital', '')} &middot; {activeHold?.assignedBay || 'Resuscitation Bay 1'}
          </span>
        </div>
      </div>

      {/* 5-Step Workflow Clickable Progression Bar */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.role}
                type="button"
                onClick={() => onSelectRole(step.role)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative group flex items-start gap-2.5 ${
                  step.isActive
                    ? 'bg-red-50/70 border-red-500 ring-1 ring-red-400'
                    : step.isCompleted
                    ? 'bg-neutral-50 border-neutral-300 hover:border-red-300'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    step.isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : step.isCompleted
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-400">
                      Step {step.stepNumber}
                    </span>
                    {step.isCompleted && (
                      <CheckCircle2 className="w-3 h-3 text-red-600 shrink-0" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold block truncate leading-tight mt-0.5 ${
                      step.isActive ? 'text-red-950 font-black' : 'text-neutral-900'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 truncate block">
                    {step.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
