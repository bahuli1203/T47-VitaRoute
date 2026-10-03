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
  } = useBedLink();

  const currentRole = role;

  const handleSwitchTab = (targetRole: AppRole) => {
    setRole(targetRole);
  };

  const isDispatchActive = currentRole === 'dispatch' || currentRole === 'ambulance';
  const isNurseActive = currentRole === 'nurse';
  const isERActive = currentRole === 'er' || currentRole === 'hospital';
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
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs group-hover:bg-neutral-800 transition-colors">
                VR
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-neutral-950 tracking-tight leading-none">
                    VitaRoute
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
                    Emergency Bed Ops
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
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

          {/* Center: The 3 Core Operations Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200/80">
            {/* 1. Ambulance Dispatch */}
            <button
              type="button"
              onClick={() => handleSwitchTab('dispatch')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                isDispatchActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <Ambulance className="w-4 h-4" />
              <span>1. Ambulance Dispatch</span>
            </button>

            {/* 2. 10s Nurse Bed Update */}
            <button
              type="button"
              onClick={() => handleSwitchTab('nurse')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                isNurseActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>2. 10s Bed Counter</span>
            </button>

            {/* 3. 2m ER Hold */}
            <button
              type="button"
              onClick={() => handleSwitchTab('er')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none relative ${
                isERActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>3. ER Hold (2m)</span>
              {pendingHoldsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold leading-none animate-pulse">
                  {pendingHoldsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right: Network, Audio, Patient SOS, Home, User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Online / Offline Status */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={isOnline ? 'Online - Live hospital inventory syncing' : 'Offline queue active'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Audio Alert Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 text-xs transition-colors cursor-pointer"
              title={isMuted ? 'Turn Sound On' : 'Mute Audio Alerts'}
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
              title="Regional Admin Operations"
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Return to Home / Overview */}
            {onReturnHome && (
              <button
                type="button"
                onClick={onReturnHome}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold border border-neutral-200 transition-colors cursor-pointer"
                title="Overview & Login Portal"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
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
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION DOCK (Clean White, 48px touch targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1 flex items-center justify-around shadow-sm">
        <button
          type="button"
          onClick={() => handleSwitchTab('dispatch')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer active:scale-95 ${
            isDispatchActive
              ? 'text-neutral-950 font-bold bg-neutral-100'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Ambulance className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Dispatch</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('nurse')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer active:scale-95 ${
            isNurseActive
              ? 'text-neutral-950 font-bold bg-neutral-100'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">10s Beds</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('er')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer active:scale-95 relative ${
            isERActive
              ? 'text-neutral-950 font-bold bg-neutral-100'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">ER Hold</span>
          {pendingHoldsCount > 0 && (
            <span className="absolute top-1 right-2.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
              {pendingHoldsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('patient')}
          className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer active:scale-95 ${
            isPatientActive
              ? 'text-rose-700 font-bold bg-rose-50'
              : 'text-neutral-500 hover:text-rose-600'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">SOS</span>
        </button>

        {onReturnHome && (
          <button
            type="button"
            onClick={onReturnHome}
            className="flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>
        )}
      </nav>
    </>
  );
};
