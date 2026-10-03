import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBedLink } from '../../context/BedLinkContext';
import { EmergencyCategory } from '../../types/bedlink';
import { EmergencyTimeline } from '../common/EmergencyTimeline';
import {
  AlertCircle,
  User,
  Heart,
  Phone,
  MapPin,
  Clock,
  Ambulance,
  Building2,
  ChevronRight,
  Shield,
  Droplets,
  Pill,
  Activity,
  CheckCircle2,
  ArrowLeft,
  FileText,
  ShieldCheck,
  RefreshCw,
  PhoneCall,
} from 'lucide-react';

const EMERGENCY_CATEGORIES: { id: EmergencyCategory; title: string; tag: string; desc: string }[] = [
  { id: 'cardiac', title: 'Chest Pain / Cardiac', tag: 'CARD', desc: 'Severe pressure, chest pain, arm pain' },
  { id: 'respiratory', title: 'Breathing Distress', tag: 'RESP', desc: 'Shortness of breath, severe asthma' },
  { id: 'trauma', title: 'Major Trauma', tag: 'TRMA', desc: 'Severe injury, fall, accident' },
  { id: 'stroke', title: 'Stroke / Paralysis', tag: 'STRK', desc: 'Facial drooping, weakness, speech difficulty' },
  { id: 'burn', title: 'Severe Burn', tag: 'BURN', desc: 'Thermal or chemical burn' },
  { id: 'general', title: 'Other Emergency', tag: 'EMERG', desc: 'Acute medical distress requiring ER' },
];

export const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    createEmergency,
    activeEmergency,
    emergencies,
    activeHolds,
    liveCoordinates,
    isLocating,
    requestLiveLocation,
    completeEmergency,
  } = useBedLink();

  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('cardiac');
  const [isConfirming, setIsConfirming] = useState(false);

  const profile = user?.patientProfile;

  const handleTriggerSOS = () => {
    if (!profile) return;
    createEmergency(selectedCategory, profile.id, profile.name);
    setIsConfirming(false);
  };

  const activeHold = activeEmergency?.holdRequestId
    ? activeHolds.find((h) => h.id === activeEmergency.holdRequestId)
    : null;

  const latestHoldForEmergency = activeEmergency?.assignedHospitalId
    ? activeHolds.find(
        (h) =>
          h.hospitalId === activeEmergency.assignedHospitalId &&
          (h.status === 'pending' || h.status === 'accepted')
      )
    : null;

  const currentHold = activeHold || latestHoldForEmergency;

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      
      {/* Top Entity Management Breadcrumb & Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
            title="Return to Main Portal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Home</span>
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Patient Management Portal</span>
            <span className="text-xs text-slate-500 font-mono">Patient Record #{profile?.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="px-2.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-mono">
            Blood Group: {profile?.bloodGroup}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
            Age: {profile?.age} Yrs
          </span>
        </div>
      </div>

      {/* Main Management Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Patient Medical Record & SOS Dispatch Controls */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Structured Patient EHR Management Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                Patient Medical Record Summary
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                EHR Verified
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold text-slate-500 w-1/3">Full Name</td>
                    <td className="py-2.5 font-bold text-slate-900">{profile?.name || 'Patient'}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold text-slate-500">Medical History</td>
                    <td className="py-2.5 font-bold text-slate-800">{profile?.medicalConditions.join(', ') || 'None'}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold text-slate-500">Known Allergies</td>
                    <td className="py-2.5 font-extrabold text-rose-700">{profile?.allergies.join(', ') || 'None'}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold text-slate-500">Primary Contact</td>
                    <td className="py-2.5 font-mono font-bold text-slate-900">{profile?.primaryMobile}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 font-bold text-slate-500">Emergency Contact</td>
                    <td className="py-2.5 font-bold text-slate-900">{profile?.emergencyContact}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-500">Backup Mobiles</td>
                    <td className="py-2.5 font-mono text-slate-600">{profile?.backupMobile1} / {profile?.backupMobile2}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* GPS Telematics Status Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Dispatch GPS Telematics</span>
                <span className="font-mono text-slate-500 text-[11px]">
                  {isLocating ? 'Acquiring GPS Signal...' : `${liveCoordinates.lat.toFixed(4)}°N, ${Math.abs(liveCoordinates.lng).toFixed(4)}°W`}
                </span>
              </div>
            </div>
            <button
              onClick={requestLiveLocation}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {/* Emergency Category Grid & SOS Dispatch */}
          {!activeEmergency || activeEmergency.status === 'completed' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Medical Emergency Category
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EMERGENCY_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'border-rose-500 bg-rose-50/80 ring-1 ring-rose-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">{cat.tag}</span>
                      <span className={`text-xs font-bold ${selectedCategory === cat.id ? 'text-rose-900' : 'text-slate-900'}`}>
                        {cat.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{cat.desc}</p>
                  </button>
                ))}
              </div>

              {isConfirming ? (
                <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-5 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
                  <p className="text-sm font-bold text-rose-900">Confirm Emergency Dispatch?</p>
                  <p className="text-xs text-rose-700">
                    An ambulance will be dispatched immediately and nearest hospital ER alerted.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => setIsConfirming(false)}
                      className="py-3 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleTriggerSOS}
                      className="py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm"
                    >
                      CONFIRM SOS
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirming(true)}
                  className="w-full py-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg flex items-center justify-center gap-3 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  <AlertCircle className="w-7 h-7 stroke-[2.5]" />
                  🚨 SOS EMERGENCY
                </button>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-emerald-800">
                ✓ Active emergency dispatch locked and monitored in real time.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Active Emergency Command Panel & Telemetry Timeline */}
        <div className="lg:col-span-7 space-y-5">
          {activeEmergency && activeEmergency.status !== 'completed' ? (
            <>
              {/* Active Emergency Status Card */}
              <div className="bg-white border-2 border-rose-500 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Active Medical Emergency Dispatch</h3>
                      <span className="text-xs text-slate-500 font-mono uppercase">Category: {activeEmergency.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 uppercase tracking-wider border border-rose-200 font-mono">
                    {activeEmergency.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Key Status Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">Ambulance Unit</span>
                    <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mt-1">
                      <Ambulance className="w-4 h-4 text-neutral-800" />
                      {activeEmergency.assignedAmbulance}
                    </span>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">Inbound ETA</span>
                    <span className="text-sm font-bold text-rose-700 font-mono flex items-center gap-1.5 mt-1">
                      <Clock className="w-4 h-4" />
                      ~{activeEmergency.etaMinutes} mins
                    </span>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">Destination ER</span>
                    <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mt-1 truncate">
                      <Building2 className="w-4 h-4 text-neutral-800 shrink-0" />
                      {activeEmergency.assignedHospitalName || 'Matching Hospital...'}
                    </span>
                  </div>
                </div>

                {/* Hospital Hold Status */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">ER Bed Hold Status:</span>
                  {currentHold?.status === 'accepted' ? (
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Bed Confirmed & Held
                    </span>
                  ) : currentHold?.status === 'pending' ? (
                    <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Awaiting ER Confirmation (120s countdown)
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-500">Searching regional bed matrix...</span>
                  )}
                </div>

                {/* Match Reasons Explanation */}
                {activeEmergency.matchReasons.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Clinical Matching Rationale</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeEmergency.matchReasons.slice(0, 6).map((reason, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-slate-700 font-semibold">{reason.replace(/^[✓✗⚠]\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Timeline */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Telemetry Incident Timeline Log
                </h3>
                <EmergencyTimeline events={activeEmergency.timeline} />
              </div>

              {/* Complete button for demo */}
              {activeEmergency.status === 'handed_over' && (
                <button
                  onClick={() => completeEmergency(activeEmergency.id)}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  Mark Emergency as Completed
                </button>
              )}
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Patient Emergency Preparedness Status
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Nearest Mumbai ER Hospitals</span>
                  <span className="text-slate-600 block">KEM Hospital Parel (~2.8 km)</span>
                  <span className="text-slate-600 block">Lilavati Hospital Bandra (~4.2 km)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Emergency Protocol</span>
                  <span className="text-slate-600 block">Press SOS button above for immediate ambulance dispatch.</span>
                </div>
              </div>
            </div>
          )}

          {/* Past Incident History Table */}
          {emergencies.filter((e) => e.status === 'completed').length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Past Medical Incident Records</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-2 px-3 font-bold text-slate-600 uppercase">Category</th>
                      <th className="text-left py-2 px-3 font-bold text-slate-600 uppercase">Hospital</th>
                      <th className="text-center py-2 px-3 font-bold text-slate-600 uppercase">Date</th>
                      <th className="text-center py-2 px-3 font-bold text-slate-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergencies
                      .filter((e) => e.status === 'completed')
                      .slice(0, 4)
                      .map((e) => (
                        <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900 capitalize">{e.category} Incident</td>
                          <td className="py-2.5 px-3 text-slate-700">{e.assignedHospitalName || 'ER Center'}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">{new Date(e.createdAt).toLocaleDateString()}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="text-emerald-800 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
