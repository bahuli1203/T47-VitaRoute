import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { AppRole } from '../../types/bedlink';
import {
  Heart,
  Ambulance,
  Building2,
  UserCog,
  Stethoscope,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Lock,
  Play,
  Check,
} from 'lucide-react';

interface HomePageProps {
  onEnterApp?: () => void;
}

const HUMAN_DEMO_ACCOUNTS = [
  {
    role: 'ambulance' as AppRole,
    title: 'Paramedic Ambulance Crew',
    subtitle: 'Arjun Singh &middot; Unit 104',
    email: 'ambulance@demo.com',
    icon: Ambulance,
    scenario: 'Looking for nearest hospital with open ICU ventilator for an intubated patient',
    badgeText: 'Dispatch View',
  },
  {
    role: 'nurse' as AppRole,
    title: 'Ward Charge Nurse',
    subtitle: 'Sarah Kowalski &middot; St. Jude Medical',
    email: 'nurse@demo.com',
    icon: Stethoscope,
    scenario: 'Updating ICU and trauma bed counts on ward phone in under 10 seconds',
    badgeText: '10s Bed Counter',
  },
  {
    role: 'hospital' as AppRole,
    title: 'ER Receiving Doctor',
    subtitle: 'Dr. Katherine Vance &middot; City General ER',
    email: 'hospital@demo.com',
    icon: Clock,
    scenario: 'Accepting incoming ambulance hold request within 2-minute confirmation window',
    badgeText: '2m Hold Screen',
  },
  {
    role: 'patient' as AppRole,
    title: 'Citizen Emergency SOS',
    subtitle: 'Rajesh Kumar &middot; Patient Profile',
    email: 'patient@demo.com',
    icon: Heart,
    scenario: 'Triggering 1-tap medical SOS with bundled allergies and cardiac history',
    badgeText: 'Citizen SOS',
  },
  {
    role: 'admin' as AppRole,
    title: 'Regional Health Director',
    subtitle: 'Admin Control Center',
    email: 'admin@demo.com',
    icon: UserCog,
    scenario: 'Monitoring regional hospital diversion statuses and city-wide ambulance fleet',
    badgeText: 'Admin Command',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onEnterApp }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('ambulance@demo.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        onEnterApp?.();
      }
      setIsLoading(false);
    }, 200);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      const result = login(demoEmail, 'demo123');
      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        onEnterApp?.();
      }
      setIsLoading(false);
    }, 150);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col font-sans">
      {/* Crisp White Top Navigation */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              VR
            </div>
            <div>
              <span className="text-base font-bold text-neutral-950 tracking-tight block leading-tight">VitaRoute</span>
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Emergency Bed Coordination</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
            <button onClick={() => scrollToSection('problem-parts')} className="hover:text-neutral-950 transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollToSection('scenarios')} className="hover:text-neutral-950 transition-colors cursor-pointer">
              Patient Scenarios
            </button>
            <button onClick={() => scrollToSection('login-portal')} className="hover:text-neutral-950 transition-colors cursor-pointer">
              Sign In
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleQuickLogin('ambulance@demo.com')}
              className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-black text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Open Paramedic Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Human-Centered Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Built for Paramedics, Ward Nurses &amp; ER Receiving Desks</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 mb-6 leading-tight">
            Get critical patients to the right bed. <span className="underline decoration-rose-500 decoration-4 underline-offset-6">Right now.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
            An ambulance crew with a patient in cardiac arrest or respiratory failure can’t afford to drive 20 minutes to a hospital that has no open ICU beds. VitaRoute matches patient needs with live bed counts, road travel times, and guarantees a 2-minute bed hold.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleQuickLogin('ambulance@demo.com')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Launch Ambulance Dispatch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickLogin('nurse@demo.com')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Test 10s Nurse Bed Counter</span>
            </button>
          </div>

          {/* Real Operational Numbers */}
          <div className="mt-14 pt-8 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">&lt; 10 sec</span>
              <span className="text-xs text-neutral-500 font-medium">Nurse Bed Update</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">4 Constraints</span>
              <span className="text-xs text-neutral-500 font-medium">Beds, ETA, Freshness &amp; Load</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">120 sec</span>
              <span className="text-xs text-neutral-500 font-medium">ER Bed Hold Timer</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">Automatic</span>
              <span className="text-xs text-neutral-500 font-medium">Cascading Re-route on Reject</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Parts Explained Plainly */}
      <section id="problem-parts" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FBFBFB] border-b border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">The 3 Parts of VitaRoute</h2>
            <p className="text-sm text-neutral-600 mt-2">
              Designed to solve the real bottleneck in emergency room admissions: reliable information in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Part 1 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-200">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase">Part 1</span>
                  <h3 className="text-base font-bold text-neutral-950">10-Second Bed Updates</h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  For ward charge nurses. Big tap targets for +1 and -1 on cheap mobile phones. Takes less than 10 seconds to update ICU, ventilator, oxygen, or cardiac bed availability. Caches updates if hospital basement Wi-Fi cuts out.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Touch target: <strong>48px tactile</strong></span>
                <span className="text-emerald-700 font-semibold">Works offline</span>
              </div>
            </div>

            {/* Part 2 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-900 flex items-center justify-center font-bold text-sm mb-4 border border-neutral-200">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase">Part 2</span>
                  <h3 className="text-base font-bold text-neutral-950">Multi-Constraint Dispatch</h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  For ambulance paramedics. Selects patient needs (ventilator, cath lab, trauma bay) and ranks nearby hospitals using four critical factors: bed match, actual road travel time, data freshness in minutes, and current ER crowding.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Data freshness: <strong>Minutes shown</strong></span>
                <span className="font-semibold text-neutral-800">OSRM Road Routing</span>
              </div>
            </div>

            {/* Part 3 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm mb-4 border border-amber-200">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase">Part 3</span>
                  <h3 className="text-base font-bold text-neutral-950">2-Minute Confirm &amp; Hold</h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  For the receiving ER desk. Once the ambulance selects a hospital, an urgent 120-second countdown alert begins. ER staff accept and lock the bed, or reject with a diversion reason. On timeout or rejection, VitaRoute escalates automatically to the next best facility.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Hold window: <strong>120 seconds</strong></span>
                <span className="text-amber-800 font-semibold">Zero ghost beds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Scenarios Tested */}
      <section id="scenarios" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">Tested Clinical Patient Scenarios</h2>
            <p className="text-xs text-neutral-600 mt-1.5">
              Preset emergencies ready to test in the ambulance dispatch console with one click.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Immediate Red</span>
                <span className="text-xs text-neutral-500 font-mono">Cardiac Cath Lab</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Acute STEMI (Heart Attack)</h4>
              <p className="text-xs text-neutral-600 mt-1">Patient has persistent chest pain, ST elevation in anterior leads. Requires 24/7 Primary PCI Cath Lab on standby.</p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Immediate Red</span>
                <span className="text-xs text-neutral-500 font-mono">ICU Ventilator</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Acute Respiratory Failure (ARDS)</h4>
              <p className="text-xs text-neutral-600 mt-1">Oxygen saturation 81% on bag-valve mask. Patient intubated in field. Requires open invasive mechanical ventilator bed.</p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Urgent Yellow</span>
                <span className="text-xs text-neutral-500 font-mono">Burns Isolation</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Severe Chemical Burn</h4>
              <p className="text-xs text-neutral-600 mt-1">35% total body surface area chemical alkali exposure. Requires negative-pressure laminar air flow isolation room.</p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Immediate Red</span>
                <span className="text-xs text-neutral-500 font-mono">Trauma Surgery</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">High-Speed Rollover Trauma</h4>
              <p className="text-xs text-neutral-600 mt-1">Blunt chest and abdominal trauma, hemodynamic shock. Requires Level 1 surgical resuscitation team and rapid blood infuser.</p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Immediate Red</span>
                <span className="text-xs text-neutral-500 font-mono">Thrombectomy</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Acute Ischemic Stroke</h4>
              <p className="text-xs text-neutral-600 mt-1">Onset 40 minutes ago, acute hemiplegia and aphasia. Within golden hour window for endovascular mechanical thrombectomy.</p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Stable Green</span>
                <span className="text-xs text-neutral-500 font-mono">Oxygen Bed</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Exacerbated COPD</h4>
              <p className="text-xs text-neutral-600 mt-1">Moderate dyspnea, responsive to bronchodilators, vitals stable. Requires high-flow wall oxygen bed for continuous monitoring.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Login & Instant Role Access Section */}
      <section id="login-portal" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FBFBFB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Sign In / Role Demo Access</h2>
            <p className="text-xs text-neutral-600 mt-2">
              Click any role card below to jump directly into that user’s screen, or sign in with custom credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Quick 1-Tap Role Demo Cards */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Choose a Role to Test (1 Tap Entry)
              </span>

              {HUMAN_DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email)}
                    disabled={isLoading}
                    className="w-full p-4 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-all text-left flex items-center justify-between gap-4 group cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors">
                            {acc.title}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                            {acc.badgeText}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-medium">{acc.subtitle}</p>
                        <p className="text-xs text-neutral-600 mt-1 line-clamp-1">{acc.scenario}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-neutral-400 group-hover:text-neutral-900 transition-colors">
                      <span className="text-xs font-bold hidden sm:inline">Launch</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Standard Login Box */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="text-center mb-5">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-950">Credential Login</h3>
                <p className="text-xs text-neutral-500">Sign in with an authorized user email</p>
              </div>

              {/* 1-Tap Prefills */}
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Prefill Demo Account:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setEmail('ambulance@demo.com'); setPassword('demo123'); }}
                    className="px-2 py-0.8 rounded text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 cursor-pointer"
                  >
                    Paramedic
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('nurse@demo.com'); setPassword('demo123'); }}
                    className="px-2 py-0.8 rounded text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 cursor-pointer"
                  >
                    Nurse
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('hospital@demo.com'); setPassword('demo123'); }}
                    className="px-2 py-0.8 rounded text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 cursor-pointer"
                  >
                    ER Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('patient@demo.com'); setPassword('demo123'); }}
                    className="px-2 py-0.8 rounded text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 cursor-pointer"
                  >
                    Patient
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="login-email" className="text-xs font-semibold text-neutral-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ambulance@demo.com"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 placeholder:text-neutral-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="text-xs font-semibold text-neutral-700 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="demo123"
                      className="w-full px-3 py-2 pr-9 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 placeholder:text-neutral-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center gap-2 text-xs text-rose-700 font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-neutral-900 hover:bg-black text-white font-bold text-sm transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-neutral-100 text-center text-xs text-neutral-400">
                Demo password: <span className="font-mono font-bold text-neutral-700">demo123</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 px-4 sm:px-6 lg:px-8 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
              VR
            </div>
            <span className="font-bold text-neutral-900">VitaRoute</span>
            <span className="text-neutral-400">&middot; Emergency Hospital Bed Coordination &amp; Ambulance Dispatch</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <span>OpenStreetMap</span>
            <span>OSRM Road Routing</span>
            <span className="text-emerald-700 font-semibold">● System Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
