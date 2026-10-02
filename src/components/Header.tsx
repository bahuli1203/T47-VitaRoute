import React from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useBedLink } from '../context/BedLinkContext';
import { AppRole } from '../types/bedlink';
import {
  Heart,
  Ambulance,
  Stethoscope,
  Building2,
  UserCog,
  Volume2,
  VolumeX,
  LogOut,
  Wifi,
  WifiOff,
  ArrowLeft,
  ChevronDown,
  LayoutDashboard,
  Building,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, login } = useAuth();
  const {
    role,
    setRole,
    pendingHoldsCount,
    isMuted,
    toggleMute,
    isOnline,
  } = useBedLink();

  const currentRole = user?.role || role;

  const ROLE_META: Record<AppRole, {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
  }> = {
    patient: { label: 'Patient Management', icon: Heart, color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' },
    ambulance: { label: 'Paramedic Fleet Dispatch', icon: Ambulance, color: 'text-sky-700', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' },
    nurse: { label: 'Ward Bed Management', icon: Stethoscope, color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    hospital: { label: 'ER Command Center', icon: Building2, color: 'text-violet-700', bgColor: 'bg-violet-50', borderColor: 'border-violet-200' },
    admin: { label: 'Regional Command Admin', icon: UserCog, color: 'text-slate-800', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' },
  };

  const roleMeta = ROLE_META[currentRole];
  const RoleIcon = roleMeta.icon;

  const handleEntitySwitch = (targetRole: AppRole) => {
    const demoUser = DEMO_USERS.find((u) => u.user.role === targetRole);
    if (demoUser) {
      login(demoUser.email, 'demo123');
      setRole(targetRole);
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left Section: Back Button + Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Back to Home Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer border border-rose-500"
            title="Return to Main Home Portal"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Home</span>
          </button>

          <div className="h-5 w-px bg-slate-700 hidden sm:block" />

          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white text-slate-900 flex items-center justify-center font-black text-xs tracking-tight">
              VR
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-tight block leading-none">VitaRoute</span>
              <span className="hidden lg:inline text-[9px] uppercase font-bold text-slate-400 tracking-wider">Management System</span>
            </div>
          </div>
        </div>

        {/* Center Section: Quick Entity Switcher Bar (Management Portal Navigation) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
          {(['patient', 'ambulance', 'nurse', 'hospital', 'admin'] as AppRole[]).map((r) => {
            const isSelected = r === currentRole;
            const meta = ROLE_META[r];
            const Icon = meta.icon;
            return (
              <button
                key={r}
                onClick={() => handleEntitySwitch(r)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 text-white shadow-xs border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                <span className="capitalize">{r}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Role Badge + Connectivity + User Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Current Entity Badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg ${roleMeta.bgColor} border ${roleMeta.borderColor}`}>
            <RoleIcon className={`w-3.5 h-3.5 ${roleMeta.color}`} />
            <span className={`text-xs font-bold ${roleMeta.color}`}>{roleMeta.label}</span>
            {pendingHoldsCount > 0 && currentRole === 'hospital' && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold leading-none animate-pulse">
                {pendingHoldsCount} Hold Alert
              </span>
            )}
          </div>

          {/* Network Connectivity */}
          <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold ${
            isOnline
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-amber-950/80 text-amber-300 border-amber-800'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Audio Alert Toggle */}
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              isMuted
                ? 'bg-slate-800 text-slate-500 border-slate-700'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Audio Alerts' : 'Mute Audio Alerts'}
            aria-label="Toggle Alert Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* User Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden xl:block text-right">
              <span className="text-xs font-bold text-slate-200 block leading-tight">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-mono block leading-tight">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 border border-slate-700 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
              title="Sign Out to Portal"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
