import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBedLink } from '../context/BedLinkContext';
import { AppRole } from '../types/bedlink';
import {
  Heart,
  Ambulance,
  Stethoscope,
  Clock,
  MapPin,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Home,
  User,
  LogOut,
  UserCog,
  Globe,
  Radio,
  Calendar,
  Building2,
  AlertCircle,
} from 'lucide-react';

interface HeaderProps {
  onReturnHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReturnHome }) => {
  const { user, logout } = useAuth();
  const {
    role,
    setRole,
    pendingHoldsCount,
    isMuted,
    toggleMute,
    isOnline,
    activeLocationName,
    realHospitalSource,
    language,
    setLanguage,
    t,
  } = useBedLink();

  const currentRole = role;

  const handleSwitchTab = (targetRole: AppRole) => {
    setRole(targetRole);
  };

  const isDispatchActive = currentRole === 'dispatch' || currentRole === 'ambulance';
  const isNurseActive = currentRole === 'nurse';
  const isERActive = currentRole === 'er' || currentRole === 'hospital';
  const isTrackingActive = currentRole === 'tracking';
  const isDoctorsActive = currentRole === 'doctors';
  const isPatientActive = currentRole === 'patient';
  const isAdminActive = currentRole === 'admin';

  return (
    <>
      {/* Clean, Humanized Light Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-neutral-200 text-neutral-900 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          
          {/* Left: Brand & Location */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onReturnHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              title="Return to VitaRoute Overview"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-sm tracking-tight shadow-xs group-hover:bg-red-700 transition-colors">
                VR
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-neutral-950 tracking-tight leading-none">
                    VitaRoute
                  </span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    Emergency Bed Ops
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                  <span className="truncate max-w-[150px] sm:max-w-xs">{activeLocationName}</span>
                  {realHospitalSource === 'live_osm' && (
                    <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                      Live GPS
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Center: The Core Hospital Operations Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            {/* 1. Ambulance Dispatch */}
            <button
              type="button"
              onClick={() => handleSwitchTab('dispatch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                isDispatchActive
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <Ambulance className="w-4 h-4" />
              <span>{t.ambulanceDispatch}</span>
            </button>

            {/* 2. 2m ER Hold */}
            <button
              type="button"
              onClick={() => handleSwitchTab('er')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none relative ${
                isERActive
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{t.erConfirmHold}</span>
              {pendingHoldsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-red-600 text-[10px] font-mono font-bold leading-none animate-pulse">
                  {pendingHoldsCount}
                </span>
              )}
            </button>

            {/* 3. Live Ambulance Tracker */}
            <button
              type="button"
              onClick={() => handleSwitchTab('tracking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                isTrackingActive
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{language === 'hi' ? 'लाइव ट्रैकिंग' : language === 'mr' ? 'थेट ट्रॅकिंग' : 'Live Tracker'}</span>
            </button>

            {/* 4. Doctor Availability Roster */}
            <button
              type="button"
              onClick={() => handleSwitchTab('doctors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                isDoctorsActive
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>{language === 'hi' ? 'डॉक्टर रोस्टर' : language === 'mr' ? 'डॉक्टर रोस्टर' : 'Doctor Roster'}</span>
            </button>

            {/* 5. 10s Nurse Bed Update */}
            <button
              type="button"
              onClick={() => handleSwitchTab('nurse')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                isNurseActive
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.nurseUpdate}</span>
            </button>
          </nav>

          {/* Right: Language Selector, Network, Audio, Patient SOS, Home, User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Multilingual Selector: English, Hindi, Marathi */}
            <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <Globe className="w-3.5 h-3.5 text-neutral-600 ml-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Interface Language"
                className="bg-transparent text-xs font-bold text-neutral-900 pr-1 py-1 focus:outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            {/* Online / Offline Status */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={isOnline ? t.statusOnline : t.statusOffline}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
              <span className="hidden sm:inline">{isOnline ? t.statusOnline : t.statusOffline}</span>
            </div>

            {/* Audio Alert Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs transition-colors cursor-pointer"
              title={isMuted ? t.soundMuted : t.soundOn}
              aria-label="Toggle Alert Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Citizen SOS Button */}
            <button
              type="button"
              onClick={() => handleSwitchTab('patient')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                isPatientActive
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
              title="Emergency SOS"
            >
              <Heart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* Admin Overview */}
            <button
              type="button"
              onClick={() => handleSwitchTab('admin')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer hidden xl:flex items-center gap-1.5 ${
                isAdminActive
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              title={t.adminDashboard}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>{t.adminDashboard}</span>
            </button>

            {/* Return to Home / Overview */}
            {onReturnHome && (
              <button
                type="button"
                onClick={onReturnHome}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold border border-neutral-200 transition-colors cursor-pointer"
                title={t.home}
              >
                <Home className="w-3.5 h-3.5" />
                <span>{t.home}</span>
              </button>
            )}

            {/* User Session & Sign Out */}
            {user && (
              <div className="flex items-center gap-1.5 pl-1 border-l border-neutral-200">
                <div
                  className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800"
                  title={`Logged in as ${user.name}`}
                >
                  <User className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 border border-neutral-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title={t.signOut}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.signOut}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION DOCK (Clean White, 48px touch targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-1 py-1 flex items-center justify-around shadow-sm overflow-x-auto">
        <button
          type="button"
          onClick={() => handleSwitchTab('patient')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer active:scale-95 ${
            isPatientActive
              ? 'text-red-700 font-bold bg-red-50'
              : 'text-neutral-500 hover:text-red-600'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 font-bold">SOS</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('dispatch')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer active:scale-95 ${
            isDispatchActive
              ? 'text-red-700 font-bold bg-red-50'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Ambulance className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 truncate max-w-[50px]">{language === 'hi' ? 'डिस्पैच' : language === 'mr' ? 'डिस्पॅच' : 'Dispatch'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('er')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer active:scale-95 relative ${
            isERActive
              ? 'text-red-700 font-bold bg-red-50'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 truncate max-w-[50px]">{language === 'hi' ? 'ईआर होल्ड' : language === 'mr' ? 'ईआर होल्ड' : 'ER Hold'}</span>
          {pendingHoldsCount > 0 && (
            <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-mono font-bold flex items-center justify-center animate-pulse">
              {pendingHoldsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('tracking')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer active:scale-95 ${
            isTrackingActive
              ? 'text-red-700 font-bold bg-red-50'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 truncate max-w-[50px]">{language === 'hi' ? 'ट्रैकिंग' : language === 'mr' ? 'ट्रॅकिंग' : 'Track'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('doctors')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer active:scale-95 ${
            isDoctorsActive
              ? 'text-red-700 font-bold bg-red-50'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 truncate max-w-[50px]">{language === 'hi' ? 'डॉक्टर' : language === 'mr' ? 'डॉक्टर' : 'Doctors'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('nurse')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer active:scale-95 ${
            isNurseActive
              ? 'text-red-700 font-bold bg-red-50'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 truncate max-w-[50px]">{language === 'hi' ? '10s बेड' : language === 'mr' ? '10s बेड्स' : 'Beds'}</span>
        </button>

        {onReturnHome && (
          <button
            type="button"
            onClick={onReturnHome}
            className="flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 truncate max-w-[50px]">{t.home}</span>
          </button>
        )}
      </nav>
    </>
  );
};
