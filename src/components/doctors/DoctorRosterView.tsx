import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { DoctorSchedule, DoctorStatus, DoctorSpecialty } from '../../types/bedlink';
import {
  Stethoscope,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Shield,
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  Radio,
  BadgeCheck,
} from 'lucide-react';

export const DoctorRosterView: React.FC = () => {
  const {
    doctors,
    updateDoctorStatus,
    autoUpdateDoctors,
    toggleAutoUpdateDoctors,
    hospitals,
    currentHospitalId,
    setCurrentHospitalId,
    language,
    t,
  } = useBedLink();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState<string>('all');
  const [selectedDoctorForCalendar, setSelectedDoctorForCalendar] = useState<string | null>(null);

  const specialtiesList: { id: string; label: string }[] = [
    { id: 'all', label: language === 'hi' ? 'सभी विशेषज्ञ' : language === 'mr' ? 'सर्व तज्ज्ञ' : 'All Specialists' },
    { id: 'Cardiology & Cath Lab', label: 'Cardiology & Cath Lab' },
    { id: 'Trauma Surgery', label: 'Trauma Surgery' },
    { id: 'Neurosurgery & Stroke', label: 'Neurosurgery & Stroke' },
    { id: 'Emergency Medicine', label: 'Emergency Medicine' },
    { id: 'Critical Care & Pulmonology', label: 'Critical Care & Pulmonology' },
    { id: 'Burn Care & Reconstruction', label: 'Burn Care & Reconstruction' },
    { id: 'Anesthesiology & Resuscitation', label: 'Anesthesiology' },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchSpecialty = selectedSpecialty === 'all' || doc.specialty === selectedSpecialty;
    const matchHospital = selectedHospitalFilter === 'all' || doc.hospitalId === selectedHospitalFilter;
    return matchSpecialty && matchHospital;
  });

  const availableCount = doctors.filter((d) => d.status === 'available').length;
  const inSurgeryCount = doctors.filter((d) => d.status === 'in_surgery').length;
  const onCallCount = doctors.filter((d) => d.status === 'on_call').length;
  const offDutyCount = doctors.filter((d) => d.status === 'off_duty').length;

  return (
    <div className="space-y-5 max-w-6xl mx-auto py-2">
      {/* Top Clinical Header & Auto-Schedule Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-700 inline-block" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'hi' ? 'अस्पताल डॉक्टर उपलब्धता एवं रोस्टर' : language === 'mr' ? 'रुग्णालय डॉक्टर उपलब्धता आणि रोस्टर' : 'Hospital Attending Doctor & Specialist Roster'}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              EHR ON-CALL ROSTER
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {language === 'hi' ? 'विशेषज्ञ डॉक्टर उपलब्धता एवं शिफ्ट कैलेंडर' : language === 'mr' ? 'तज्ज्ञ डॉक्टर उपलब्धता आणि शिफ्ट कॅलेंडर' : 'Emergency Specialist Availability & Shift Calendar'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'आपातकालीन मामलों के लिए ऑन-कॉल सर्जन व डॉक्टरों की रीयल-टाइम स्थिति (स्वचालित व मैनुअल अद्यतन)' : language === 'mr' ? 'आणीबाणीसाठी ऑन-कॉल सर्जन आणि डॉक्टरांची थेट स्थिती (स्वयंचलित आणि मॅन्युअल अद्यतन)' : 'Live duty status, surgical availability, and 7-day shift coverage linked to ambulance dispatch.'}
          </p>
        </div>

        {/* Automatic Rotation Simulation Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleAutoUpdateDoctors}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              autoUpdateDoctors
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoUpdateDoctors ? 'animate-spin' : ''}`} />
            <span>
              {autoUpdateDoctors
                ? (language === 'hi' ? 'स्वचालित अद्यतन: सक्रिय' : language === 'mr' ? 'स्वयंचलित अद्यतन: सुरू' : 'Auto-Sync Shifts: Active')
                : (language === 'hi' ? 'स्वचालित अद्यतन: रुका हुआ' : language === 'mr' ? 'स्वयंचलित अद्यतन: थांबले' : 'Auto-Sync Shifts: Paused')}
            </span>
          </button>
        </div>
      </div>

      {/* Clinical Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Available Now</span>
            <span className="text-2xl font-black font-mono text-emerald-700">{availableCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Ready for ER Triage</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">In Surgery / Busy</span>
            <span className="text-2xl font-black font-mono text-amber-700">{inSurgeryCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Operating Room Active</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">On-Call Standby</span>
            <span className="text-2xl font-black font-mono text-sky-700">{onCallCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">15-Min Response ETA</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Off-Duty Cover</span>
            <span className="text-2xl font-black font-mono text-slate-600">{offDutyCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Night Coverage Listed</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs: Hospital & Specialty */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {language === 'hi' ? 'विभाग व अस्पताल फिल्टर' : language === 'mr' ? 'विभाग व रुग्णालय फिल्टर' : 'Filter Roster by Department & Facility'}
            </span>
          </div>

          {/* Hospital Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <Building2 className="w-4 h-4 text-slate-500" />
            <select
              value={selectedHospitalFilter}
              onChange={(e) => setSelectedHospitalFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="all">All Regional Hospitals</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Specialty Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {specialtiesList.map((spec) => (
            <button
              key={spec.id}
              type="button"
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSpecialty === spec.id
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doc) => {
          const isAvailable = doc.status === 'available';
          const isInSurgery = doc.status === 'in_surgery';
          const isOnCall = doc.status === 'on_call';
          const isOffDuty = doc.status === 'off_duty';
          const showCalendar = selectedDoctorForCalendar === doc.id;

          return (
            <div
              key={doc.id}
              className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs transition-all space-y-3.5 ${
                isAvailable
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : isInSurgery
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              {/* Doctor Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isInSurgery
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : isOnCall
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {doc.name}
                      </h3>
                      <BadgeCheck className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 block mt-0.5">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      Badge: {doc.badgeNumber} · {doc.phoneExtension}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border block ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isInSurgery
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : isOnCall
                        ? 'bg-sky-50 text-sky-800 border-sky-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isAvailable
                      ? 'AVAILABLE'
                      : isInSurgery
                      ? 'IN SURGERY'
                      : isOnCall
                      ? 'ON-CALL'
                      : 'OFF-DUTY'}
                  </span>
                  {isInSurgery && doc.nextAvailableEstimateMinutes && (
                    <span className="text-[10px] text-amber-700 font-mono mt-0.5 block">
                      Free in ~{doc.nextAvailableEstimateMinutes}m
                    </span>
                  )}
                </div>
              </div>

              {/* Facility & Shift Hours */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Hospital Facility</span>
                  <span className="font-bold text-slate-900 truncate block mt-0.5">
                    {doc.hospitalName.replace('Hospital', '')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Shift Hours</span>
                  <span className="font-mono text-slate-800 block mt-0.5">
                    {doc.shiftHours} ({doc.shiftType.replace(' Shift', '')})
                  </span>
                </div>
              </div>

              {/* Current Assignment / Room */}
              {doc.currentRoomOrBay && (
                <div className="text-xs text-slate-700 flex items-center gap-1.5 bg-slate-100/70 px-2.5 py-1.5 rounded border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">
                    <strong>Station:</strong> {doc.currentRoomOrBay}
                  </span>
                </div>
              )}

              {/* Manual Override Controls for Hospital Nurse / ER Admin */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold uppercase tracking-wider">
                    {language === 'hi' ? 'मैनुअल स्थिति बदलाव:' : language === 'mr' ? 'मॅन्युअल स्थिती बदला:' : 'Manual Status Override:'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDoctorForCalendar(showCalendar ? null : doc.id)
                    }
                    className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{showCalendar ? 'Hide Calendar' : 'Weekly Calendar'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateDoctorStatus(doc.id, 'available')}
                    className={`py-1.5 px-1 rounded text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                      isAvailable
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    Available
                  </button>

                  <button
                    type="button"
                    onClick={() => updateDoctorStatus(doc.id, 'in_surgery')}
                    className={`py-1.5 px-1 rounded text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                      isInSurgery
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    In Surgery
                  </button>

                  <button
                    type="button"
                    onClick={() => updateDoctorStatus(doc.id, 'on_call')}
                    className={`py-1.5 px-1 rounded text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                      isOnCall
                        ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    On-Call
                  </button>

                  <button
                    type="button"
                    onClick={() => updateDoctorStatus(doc.id, 'off_duty')}
                    className={`py-1.5 px-1 rounded text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                      isOffDuty
                        ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    Off-Duty
                  </button>
                </div>

                {/* 7-Day Weekly Shift Calendar Drawer */}
                {showCalendar && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 animate-in fade-in duration-150">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                      7-Day Shift Coverage Matrix
                    </span>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                      {doc.weeklySchedule.map((slot, i) => (
                        <div
                          key={i}
                          className={`p-1.5 rounded border flex flex-col items-center justify-between min-h-[46px] ${
                            slot.status === 'on_duty'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                              : slot.status === 'on_call'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                        >
                          <span className="font-extrabold">{slot.day}</span>
                          <span className="text-[9px] mt-0.5 truncate max-w-[40px]">
                            {slot.status === 'on_duty' ? 'Duty' : slot.status === 'on_call' ? 'Call' : 'Off'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
