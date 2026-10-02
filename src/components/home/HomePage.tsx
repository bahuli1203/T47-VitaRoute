import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { AppRole } from '../../types/bedlink';
import {
  Heart,
  Ambulance,
  Building2,
  ShieldCheck,
  UserCog,
  Stethoscope,
  Eye,
  EyeOff,
  AlertCircle,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Shield,
  MapPin,
  Lock,
  PhoneCall,
} from 'lucide-react';

const ROLE_INFO: {
  role: AppRole;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    role: 'patient',
    label: 'Patient Portal',
    desc: 'Instant 1-tap SOS trigger & ambulance tracking',
    icon: Heart,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  {
    role: 'ambulance',
    label: 'Ambulance Paramedic',
    desc: 'Turn-by-turn navigation & patient vitals sync',
    icon: Ambulance,
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  {
    role: 'nurse',
    label: 'Nurse Ward Portal',
    desc: 'Real-time bed availability & EHR auto-sync',
    icon: Stethoscope,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    role: 'hospital',
    label: 'Hospital ER Command',
    desc: '120s hold countdown & bed confirmation',
    icon: Building2,
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    role: 'admin',
    label: 'Admin Operations',
    desc: 'Regional fleet map & bed allocation matrix',
    icon: UserCog,
    color: 'text-slate-800',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
  },
];

export const HomePage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      }
      setIsLoading(false);
    }, 400);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      const result = login(demoEmail, 'demo123');
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
      setIsLoading(false);
    }, 300);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-extrabold text-base shadow-sm tracking-tight">
              VR
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">VitaRoute</span>
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Emergency Operations Platform</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-slate-900 transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('key-features')} className="hover:text-slate-900 transition-colors">
              Key Features
            </button>
            <button onClick={() => scrollToSection('coordination-flow')} className="hover:text-slate-900 transition-colors">
              Coordination Flow
            </button>
            <button onClick={() => scrollToSection('hospital-network')} className="hover:text-slate-900 transition-colors">
              Hospital Network
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('login-portal')}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Sign In / Access Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Dark Soft Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Emergency Healthcare Response"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle dark overlay so text remains sharp and perfectly readable */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-rose-400 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Next-Gen Healthcare Dispatch & Bed Coordination</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            Emergency Response. <span className="text-rose-500">Connected.</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
            AI-powered emergency coordination connecting patients, ambulances and hospitals in real time to eliminate ER wait times and match critical beds instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('login-portal')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              GET STARTED
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              LEARN MORE
            </button>
          </div>

          {/* Key Metrics Banner */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">&lt; 120s</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hospital Hold Response</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">100%</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bed Match Accuracy</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">5 Roles</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unified Coordination</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white block">24 / 7</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Real-Time Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* How VitaRoute Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How VitaRoute Works</h2>
            <p className="text-sm text-slate-600 mt-2">
              From the instant an SOS is triggered to patient admission, VitaRoute orchestrates every step of emergency care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 font-extrabold text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Emergency Trigger</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patient triggers 1-tap SOS or emergency dispatch lodges an alert with GPS coordinates and medical condition category.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 font-extrabold text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Route & Bed Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                VitaRoute evaluates live hospital bed inventory (ICU, Ventilator, Trauma), specialist duty status, traffic, and distance to pick the optimal ER.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
              <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 font-extrabold text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">120s ER Confirmation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hospital ER receives an urgent hold alert. They have 120 seconds to confirm resuscitation bay availability before smart auto-diversion kicks in.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-extrabold text-sm flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Zero-Wait Admission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paramedics deliver the patient directly to the assigned resuscitation bay with vitals pre-synced and bed reserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="key-features" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">Clinical Excellence</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Built for Clinical & Dispatch Operations</h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed specifically for healthcare workers, paramedics, and emergency control room administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Real-Time ER Bed Matrix</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live monitoring of ICU, Ventilator, Trauma, Oxygen, and Monitored Cardiac beds across the entire regional hospital network.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mb-4">
                <Ambulance className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Ambulance Telematics & ETA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turn-by-turn navigation integrated with traffic feeds and patient vital stats broadcasted to the target emergency department.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-700 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">120s Hold Protocol</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated countdown timer prevents ghost reservations. Unacknowledged holds automatically escalate to secondary facilities.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Nurse Ward Portal & EHR Feed</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simple 1-tap bed availability adjustments for charge nurses with automatic HL7 / FHIR ADT event processing.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Transparent Route Logic</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear "Why this hospital?" audit trail explaining exact matching criteria (specialist presence, ventilator status, proximity).
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 mb-4">
                <UserCog className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Admin Command Center</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Regional emergency oversight, mass surge drill triggers, hospital diversion management, and complete incident timeline logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Coordination Flow */}
      <section id="coordination-flow" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">Multi-Party Pipeline</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Emergency Coordination Flow</h2>
            <p className="text-sm text-slate-600 mt-2">
              Synchronized data flow between all stakeholders during active medical emergencies.
            </p>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase text-rose-400 block tracking-wider">Patient Side</span>
                <h4 className="text-base font-bold mt-1 text-white">SOS Triggered</h4>
                <p className="text-xs text-slate-400 mt-2">
                  GPS location acquired, medical history (allergies, blood group) bundled, live tracking active.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center mb-3">
                  <Ambulance className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase text-sky-400 block tracking-wider">Paramedic Side</span>
                <h4 className="text-base font-bold mt-1 text-white">Unit En Route</h4>
                <p className="text-xs text-slate-400 mt-2">
                  Live turn-by-turn routing, vitals logged, destination hospital pre-notified of incoming acuity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase text-emerald-400 block tracking-wider">Hospital ER Side</span>
                <h4 className="text-base font-bold mt-1 text-white">Resuscitation Bay Ready</h4>
                <p className="text-xs text-slate-400 mt-2">
                  120s hold accepted, bay assigned, specialist team alerted before ambulance arrives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hospital Network / Coverage */}
      <section id="hospital-network" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">Network Reliability</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Hospital Network Coverage</h2>
            <p className="text-sm text-slate-600 mt-2">
              Integrated with major regional trauma centers and specialty medical facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-slate-700" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">City General Hospital</h4>
                  <span className="text-xs text-slate-500">Level 1 Trauma Center &middot; Radio #CH-102</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">ICU & Trauma Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Open & Available
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-slate-700" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">St. Jude Medical Center</h4>
                  <span className="text-xs text-slate-500">Cardiac Specialty &middot; Radio #SJ-204</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">Cardiac Cath Lab:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active On-Duty
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-slate-700" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Metro Emergency Hospital</h4>
                  <span className="text-xs text-slate-500">Burn & Neuro Center &middot; Radio #MH-309</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">Neuro Surgery:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN & DEMO ACCESS SECTION */}
      <section id="login-portal" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">Access Control</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Sign In to VitaRoute Portal</h2>
            <p className="text-sm text-slate-300 mt-2">
              Enter your credentials or click any quick role demo access button below to test the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Traditional Form Login */}
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-2 font-bold">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Secure Sign In</h3>
                <p className="text-xs text-slate-500">Authorized personnel & patient login</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="home-login-email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    id="home-login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. patient@demo.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="home-login-password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="home-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-center gap-2 text-xs text-rose-800 font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400">
                Default password for demo: <span className="font-mono font-bold text-slate-700">demo123</span>
              </div>
            </div>

            {/* Right Column: 5 Quick Demo Role Cards */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Instant Demo Access</span>
                <span className="text-xs text-slate-400">Select any role to enter dashboard</span>
              </div>

              {ROLE_INFO.map((r) => {
                const Icon = r.icon;
                const demoUser = DEMO_USERS.find((u) => u.user.role === r.role);
                return (
                  <button
                    key={r.role}
                    onClick={() => demoUser && handleQuickLogin(demoUser.email)}
                    disabled={isLoading}
                    className="w-full p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all text-left flex items-center justify-between gap-4 group disabled:opacity-60 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${r.bgColor} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${r.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                            {r.label}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                            {r.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{r.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                        Launch Demo
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
              VR
            </div>
            <span className="font-bold text-slate-900">VitaRoute Emergency Operations Platform</span>
            <span className="text-slate-400 hidden sm:inline">&middot; Real-Time Emergency Bed Allocation & Dispatch</span>
          </div>

          <div className="flex items-center gap-6 font-semibold text-slate-500">
            <span>System Status: <span className="text-emerald-600 font-bold">● Operational</span></span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
