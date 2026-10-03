import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { useAuth } from '../../context/AuthContext';
import { DoctorStatus } from '../../types/bedlink';
import {
  Stethoscope,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  Building2,
  Phone,
  Radio,
  BadgeCheck,
  UserCheck,
  ChevronRight,
  Shield,
} from 'lucide-react';

export const DoctorRosterView: React.FC = () => {
  const { user } = useAuth();
  const {
    doctors,
    updateDoctorStatus,
    currentHospital,
    language,
    t,
  } = useBedLink();

  // Find logged-in doctor or default to primary attending specialist
  const activeDoctor = doctors.find((d) => d.hospitalId === currentHospital.id) || doctors[0];
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(activeDoctor.id);
  const [activeTab, setActiveTab] = useState<'my_schedule' | 'colleagues'>('my_schedule');

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || activeDoctor;

  const daysOfWeek = [
    { day: 'Mon', date: 'Oct 06', shift: '08:00 - 16:00', type: 'Day ER Triage', bay: 'Resus Bay 1', onCall: true },
    { day: 'Tue', date: 'Oct 07', shift: '08:00 - 16:00', type: 'Day ER Triage', bay: 'Resus Bay 1', onCall: false },
    { day: 'Wed', date: 'Oct 08', shift: '16:00 - 00:00', type: 'Evening Trauma', bay: 'Trauma OR 2', onCall: true },
    { day: 'Thu', date: 'Oct 09', shift: 'Off Duty', type: 'Scheduled Rest', bay: 'None', onCall: false },
    { day: 'Fri', date: 'Oct 10', shift: '08:00 - 16:00', type: 'Day ER Triage', bay: 'Resus Bay 2', onCall: true },
    { day: 'Sat', date: 'Oct 11', shift: '00:00 - 08:00', type: 'Night Emergency', bay: 'ICU Resus', onCall: true },
    { day: 'Sun', date: 'Oct 12', shift: 'On-Call Standby', type: 'Home Standby', bay: 'Rapid 15m', onCall: true },
  ];

  const handleStatusChange = (status: DoctorStatus) => {
    updateDoctorStatus(currentDoctor.id, status);
  };

  const isAvailable = currentDoctor.status === 'available';
  const isInSurgery = currentDoctor.status === 'in_surgery';
  const isOnCall = currentDoctor.status === 'on_call';

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-2">
      {/* Top Clinical Profile Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-neutral-950">
                {currentDoctor.name}
              </h2>
              <BadgeCheck className="w-4 h-4 text-red-600 shrink-0" />
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              <strong className="text-neutral-800">{currentDoctor.specialty}</strong> &middot; {currentDoctor.hospitalName}
            </p>
            <span className="text-[11px] font-mono text-neutral-400">
              Badge: {currentDoctor.badgeNumber} &middot; Ext: {currentDoctor.phoneExtension}
            </span>
          </div>
        </div>

        {/* View Switcher: My Schedule vs Hospital Colleagues */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('my_schedule')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my_schedule'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            My Schedule & Duty
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('colleagues')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'colleagues'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            On-Duty Team ({doctors.filter((d) => d.hospitalId === currentHospital.id).length})
          </button>
        </div>
      </div>

      {activeTab === 'my_schedule' ? (
        <div className="space-y-4">
          {/* Quick Duty Status Control Bar */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
              Current Duty Status (1-Tap Toggle)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleStatusChange('available')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isAvailable
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-emerald-800">AVAILABLE</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-[11px] text-neutral-600 block">Ready for incoming ER cases</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('in_surgery')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isInSurgery
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200'
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-amber-800">IN SURGERY</span>
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-[11px] text-neutral-600 block">Operating theatre active (~30m)</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('on_call')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isOnCall
                    ? 'bg-red-50 border-red-500 ring-2 ring-red-200'
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-red-700">ON-CALL</span>
                  <Radio className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-[11px] text-neutral-600 block">Rapid 15-minute response standby</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('off_duty')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  currentDoctor.status === 'off_duty'
                    ? 'bg-neutral-200 border-neutral-500 ring-2 ring-neutral-300'
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-neutral-700">OFF-DUTY</span>
                  <Clock className="w-4 h-4 text-neutral-500" />
                </div>
                <span className="text-[11px] text-neutral-500 block">Shift completed / Resting</span>
              </button>
            </div>
          </div>

          {/* 7-Day Shift Calendar */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Weekly Hospital Shift Schedule
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-500">
                Oct 06 &ndash; Oct 12, 2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
              {daysOfWeek.map((item, index) => {
                const isToday = index === 0;
                return (
                  <div
                    key={item.day}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isToday
                        ? 'bg-red-50/60 border-red-300 ring-1 ring-red-200'
                        : 'bg-neutral-50/50 border-neutral-200'
                    }`}
                  >
                    <span className="text-xs font-extrabold text-neutral-900 block">{item.day}</span>
                    <span className="text-[10px] text-neutral-400 block mb-1.5">{item.date}</span>
                    <div className="space-y-1">
                      <span className={`text-[11px] font-bold block ${
                        item.shift === 'Off Duty' ? 'text-neutral-400' : 'text-neutral-950 font-mono'
                      }`}>
                        {item.shift}
                      </span>
                      <span className="text-[10px] text-neutral-600 block font-medium">
                        {item.type}
                      </span>
                      {item.bay !== 'None' && (
                        <span className="text-[9px] font-mono text-red-700 bg-white px-1 py-0.5 rounded border border-red-200 block truncate">
                          {item.bay}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Hospital On-Duty Specialists List */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {doctors
            .filter((d) => d.hospitalId === currentHospital.id)
            .map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">{doc.name}</h4>
                  <p className="text-xs text-neutral-500">{doc.specialty}</p>
                  <span className="text-[10px] font-mono text-neutral-400">Ext: {doc.phoneExtension}</span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    doc.status === 'available'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : doc.status === 'in_surgery'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                  }`}
                >
                  {doc.status.toUpperCase()}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
