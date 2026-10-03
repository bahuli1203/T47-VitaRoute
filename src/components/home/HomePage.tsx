import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBedLink } from '../../context/BedLinkContext';
import { AnimatedRouteHero } from './AnimatedRouteHero';
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
  Navigation,
  Lock,
  Play,
  Check,
  Globe,
  Radio,
} from 'lucide-react';

interface HomePageProps {
  onEnterApp?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterApp }) => {
  const { login } = useAuth();
  const { language, setLanguage, t } = useBedLink();
  const [email, setEmail] = useState('ambulance@demo.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const humanDemoAccounts = [
    {
      role: 'ambulance' as AppRole,
      title: t.roleAmbulance,
      subtitle: 'Arjun Singh · Unit 104',
      email: 'ambulance@demo.com',
      icon: Ambulance,
      scenario: language === 'hi' 
        ? 'वेंटिलेटर पर मरीज के लिए निकटतम आईसीयू बेड और कैथ लैब की खोज'
        : language === 'mr'
        ? 'व्हेंटिलेटरवरील रुग्णासाठी जवळचे आयसीयू बेड आणि कॅथ लॅब शोधणे'
        : 'Looking for nearest hospital with open ICU ventilator for an intubated patient',
      badgeText: language === 'hi' ? 'डिस्पैच व्यू' : language === 'mr' ? 'डिस्पॅच दृश्य' : 'Dispatch View',
    },
    {
      role: 'nurse' as AppRole,
      title: t.roleNurse,
      subtitle: 'Sarah Kowalski · Ward Station 3',
      email: 'nurse@demo.com',
      icon: Stethoscope,
      scenario: language === 'hi'
        ? 'फोन पर 10 सेकंड में आईसीयू व ट्रामा बेड की सटीक संख्या अपडेट करना'
        : language === 'mr'
        ? 'मोबाईलवर 10 सेकंदात आयसीयू आणि ट्रॉमा बेड्स अद्ययावत करणे'
        : 'Updating ICU and trauma bed counts on ward phone in under 10 seconds',
      badgeText: language === 'hi' ? '10s बेड काउंटर' : language === 'mr' ? '10s बेड काउंटर' : '10s Bed Counter',
    },
    {
      role: 'hospital' as AppRole,
      title: t.roleERDoctor,
      subtitle: 'Dr. Katherine Vance · City General ER',
      email: 'hospital@demo.com',
      icon: Clock,
      scenario: language === 'hi'
        ? '120 सेकंड की विंडो में आने वाली एम्बुलेंस का बेड होल्ड अनुरोध स्वीकारना'
        : language === 'mr'
        ? '120 सेकंदांच्या मुदतीत येणाऱ्या रुग्णवाहिकेची बेड होल्ड विनंती स्वीकारणे'
        : 'Accepting incoming ambulance hold request within 2-minute confirmation window',
      badgeText: language === 'hi' ? '120s होल्ड स्क्रीन' : language === 'mr' ? '120s होल्ड स्क्रीन' : '2m Hold Screen',
    },
    {
      role: 'patient' as AppRole,
      title: t.roleCitizen,
      subtitle: 'Rajesh Kumar · Citizen Profile',
      email: 'patient@demo.com',
      icon: Heart,
      scenario: language === 'hi'
        ? '1-टैप में तत्काल जीपीएस के साथ आपातकालीन एसओएस भेजना'
        : language === 'mr'
        ? '1-टॅपमध्ये थेट जीपीएससह आणीबाणी एसओएस सुरू करणे'
        : 'Triggering 1-tap medical SOS with bundled allergies and cardiac history',
      badgeText: language === 'hi' ? 'नागरिक एसओएस' : language === 'mr' ? 'नागरिक एसओएस' : 'Citizen SOS',
    },
    {
      role: 'admin' as AppRole,
      title: t.roleAdmin,
      subtitle: 'Admin Control Center',
      email: 'admin@demo.com',
      icon: UserCog,
      scenario: language === 'hi'
        ? 'क्षेत्रीय अस्पतालों की स्थिति और एम्बुलेंस फ्लीट की निगरानी'
        : language === 'mr'
        ? 'प्रादेशिक रुग्णालयांची स्थिती आणि रुग्णवाहिकांचे नियंत्रण'
        : 'Monitoring regional hospital diversion statuses and city-wide ambulance fleet',
      badgeText: language === 'hi' ? 'एडमिन कमांड' : language === 'mr' ? 'ॲडमिन कमांड' : 'Admin Command',
    },
  ];

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
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{t.emergencyCoordination}</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
            <button onClick={() => scrollToSection('problem-parts')} className="hover:text-neutral-950 transition-colors cursor-pointer">
              {t.partsTitle}
            </button>
            <button onClick={() => scrollToSection('scenarios')} className="hover:text-neutral-950 transition-colors cursor-pointer">
              {t.clinicalScenarios}
            </button>
            <button onClick={() => scrollToSection('login-portal')} className="hover:text-neutral-950 transition-colors cursor-pointer">
              {t.loginPortalTitle}
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <Globe className="w-3.5 h-3.5 text-neutral-600 ml-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Interface Language"
                className="bg-transparent text-xs font-bold text-neutral-900 pr-1 py-1 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            <button
              onClick={() => handleQuickLogin('ambulance@demo.com')}
              className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-black text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.openParamedicDemo}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Transparent Liquid Glass Hero Section with Animated Route Graph */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-b border-neutral-200 overflow-hidden">
        {/* Animated Background Vector Routes & Signals */}
        <AnimatedRouteHero />

        {/* Completely Transparent Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center bg-transparent py-4 sm:py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 text-xs font-semibold text-neutral-800 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>{t.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 mb-6 leading-tight">
            {t.heroTitle} <br className="hidden sm:inline" />
            <span className="underline decoration-rose-500 decoration-4 underline-offset-6 text-neutral-900">
              {t.heroHighlight}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleQuickLogin('patient@demo.com')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{t.heroSOSButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickLogin('ambulance@demo.com')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{t.ambulanceDispatch}</span>
            </button>
            <button
              onClick={() => handleQuickLogin('nurse@demo.com')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{t.nurseUpdate}</span>
            </button>
          </div>

          {/* 4-Step Emergency Pipeline Track - 100% Visible on all devices (Steps 1, 2, 3, 4) */}
          <div className="my-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 text-left">
              {/* Step 1: Citizen SOS */}
              <div 
                onClick={() => handleQuickLogin('patient@demo.com')}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/90 shadow-xs hover:border-neutral-400 transition-all cursor-pointer group"
              >
                <div className="relative shrink-0">
                  <span className="absolute -inset-1 rounded-full bg-rose-500/20 animate-ping" />
                  <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs group-hover:scale-105 transition-transform">
                    <Heart className="w-5 h-5 fill-rose-50" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 block">Step 01</span>
                  <span className="text-xs font-bold text-neutral-900 leading-tight block">{t.pipelineStep1}</span>
                </div>
              </div>

              {/* Step 2: Live GPS & Road CAD - PROMINENTLY VISIBLE */}
              <div 
                onClick={() => handleQuickLogin('ambulance@demo.com')}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/90 shadow-xs hover:border-neutral-400 transition-all cursor-pointer group"
              >
                <div className="relative shrink-0">
                  <span className="absolute -inset-1 rounded-full bg-neutral-900/10 animate-pulse" />
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Radio className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block">Step 02</span>
                  <span className="text-xs font-bold text-neutral-900 leading-tight block">{t.pipelineStep2}</span>
                </div>
              </div>

              {/* Step 3: 120s ER Hold Window - PROMINENTLY VISIBLE */}
              <div 
                onClick={() => handleQuickLogin('hospital@demo.com')}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-300 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
              >
                <div className="relative shrink-0">
                  <span className="absolute -inset-1 rounded-full bg-amber-500/20 animate-pulse" />
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Clock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">Step 03</span>
                  <span className="text-xs font-bold text-neutral-900 leading-tight block">{t.pipelineStep3}</span>
                </div>
              </div>

              {/* Step 4: ICU Bed Reserved */}
              <div 
                onClick={() => handleQuickLogin('nurse@demo.com')}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-300 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
              >
                <div className="relative shrink-0">
                  <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">Step 04</span>
                  <span className="text-xs font-bold text-neutral-900 leading-tight block">{t.pipelineStep4}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Metrics Cards */}
          <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">&lt; 10 sec</span>
              <span className="text-xs text-neutral-500 font-medium">{t.nurseBedUpdateStat}</span>
            </div>
            <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">4 Constraints</span>
              <span className="text-xs text-neutral-500 font-medium">{t.constraintsStat}</span>
            </div>
            <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">120 sec</span>
              <span className="text-xs text-neutral-500 font-medium">{t.holdTimerStat}</span>
            </div>
            <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">Automatic</span>
              <span className="text-xs text-neutral-500 font-medium">{t.autoRerouteStat}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Parts Explained Plainly */}
      <section id="problem-parts" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FBFBFB] border-b border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">{t.partsTitle}</h2>
            <p className="text-sm text-neutral-600 mt-2">
              {t.partsSubtitle}
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
                  <h3 className="text-base font-bold text-neutral-950">{t.part1Title}</h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.part1Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Touch target: <strong>48px tactile</strong></span>
                <span className="text-emerald-700 font-semibold">{t.statusOnline}</span>
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
                  <h3 className="text-base font-bold text-neutral-950">{t.part2Title}</h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.part2Desc}
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
                  <h3 className="text-base font-bold text-neutral-950">{t.part3Title}</h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {t.part3Desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>Hold window: <strong>120 seconds</strong></span>
                <span className="text-amber-800 font-semibold">{t.erConfirmHold}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Scenarios Tested */}
      <section id="scenarios" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">{t.clinicalScenarios}</h2>
            <p className="text-xs text-neutral-600 mt-1.5">
              {language === 'hi' 
                ? 'एम्बुलेंस डिस्पैच कंसोल में 1-क्लिक से परीक्षण के लिए तैयार आपातकालीन परिदृश्य।'
                : language === 'mr'
                ? 'रुग्णवाहिका कन्सोलमध्ये एका क्लिकवर चाचणीसाठी उपलब्ध असलेले वैद्यकीय प्रसंग.'
                : 'Preset emergencies ready to test in the ambulance dispatch console with one click.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Immediate Red</span>
                <span className="text-xs text-neutral-500 font-mono">Cardiac Cath Lab</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                {language === 'hi' ? 'तीव्र स्टेमी (हार्ट अटैक)' : language === 'mr' ? 'तीव्र स्टेमी (हार्ट अटॅक)' : 'Acute STEMI (Heart Attack)'}
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                {language === 'hi'
                  ? 'मरीज को सीने में भारी दर्द, एसटी एलिवेशन। 24/7 प्राइमरी पीसीआई कैथ लैब की आवश्यकता।'
                  : language === 'mr'
                  ? 'छातीत तीव्र वेदना, एसटी एलिव्हेशन. 24/7 प्रायमरी पीसीआय कॅथ लॅब सज्ज असणे आवश्यक.'
                  : 'Patient has persistent chest pain, ST elevation in anterior leads. Requires 24/7 Primary PCI Cath Lab on standby.'}
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Immediate Red</span>
                <span className="text-xs text-neutral-500 font-mono">ICU Ventilator</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                {language === 'hi' ? 'तीव्र श्वसन विफलता (ARDS)' : language === 'mr' ? 'तीव्र श्वसन विकार (ARDS)' : 'Acute Respiratory Failure (ARDS)'}
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                {language === 'hi'
                  ? 'ऑक्सीजन 81% पर। मरीज फील्ड में इंट्यूबेट किया गया। यांत्रिक वेंटिलेटर बेड अनिवार्य।'
                  : language === 'mr'
                  ? 'ऑक्सिजन 81%. जागेवरच इंट्युबेट केले. तात्काळ मेकॅनिकल व्हेंटिलेटर बेडची गरज.'
                  : 'Oxygen saturation 81% on bag-valve mask. Patient intubated in field. Requires open invasive mechanical ventilator bed.'}
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Urgent Yellow</span>
                <span className="text-xs text-neutral-500 font-mono">Burns Isolation</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                {language === 'hi' ? 'गंभीर रासायनिक जलन' : language === 'mr' ? 'केमिकलने भाजलेली दुखापत' : 'Severe Chemical Burn'}
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                {language === 'hi'
                  ? '35% शरीर केमिकल से झुलसा। नेगेटिव-प्रेशर लैमिनार एयर फ्लो आइसोलेशन रूम चाहिए।'
                  : language === 'mr'
                  ? '35% शरीर केमिकलने भाजले. निगेटिव्ह-प्रेशर लॅमिनार एअर फ्लो कक्ष आवश्यक.'
                  : '35% total body surface area chemical alkali exposure. Requires negative-pressure laminar air flow isolation room.'}
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Immediate Red</span>
                <span className="text-xs text-neutral-500 font-mono">Trauma Surgery</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                {language === 'hi' ? 'हाई-स्पीड सड़क दुर्घटना' : language === 'mr' ? 'हाय-स्पीड रस्ता अपघात' : 'High-Speed Rollover Trauma'}
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                {language === 'hi'
                  ? 'सीने और पेट में आंतरिक चोट, रक्तस्राव। लेवल 1 सर्जिकल रीससिटेशन टीम आवश्यक।'
                  : language === 'mr'
                  ? 'छातीत आणि पोटाला अंतर्गत मार, तीव्र रक्तस्त्राव. लेव्हल 1 सर्जिकल टीम सज्ज हवी.'
                  : 'Blunt chest and abdominal trauma, hemodynamic shock. Requires Level 1 surgical resuscitation team and rapid blood infuser.'}
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">Immediate Red</span>
                <span className="text-xs text-neutral-500 font-mono">Thrombectomy</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                {language === 'hi' ? 'तीव्र इस्केमिक स्ट्रोक' : language === 'mr' ? 'तीव्र इस्केमिक स्ट्रोक' : 'Acute Ischemic Stroke'}
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                {language === 'hi'
                  ? '40 मिनट पहले पक्षाघात के लक्षण। गोल्डन ऑवर विंडो में थ्रोम्बेक्टोमी आवश्यक।'
                  : language === 'mr'
                  ? '40 मिनिटांपूर्वी पक्षाघात झाला. गोल्डन अवर विंडोमध्ये थ्रोम्बेक्टॉमी करणे गरजेचे.'
                  : 'Onset 40 minutes ago, acute hemiplegia and aphasia. Within golden hour window for endovascular mechanical thrombectomy.'}
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-[#FAFAFA]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Stable Green</span>
                <span className="text-xs text-neutral-500 font-mono">Oxygen Bed</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                {language === 'hi' ? 'सीओपीडी सांस संकट' : language === 'mr' ? 'सीओपीडी श्वास अडथळा' : 'Exacerbated COPD'}
              </h4>
              <p className="text-xs text-neutral-600 mt-1">
                {language === 'hi'
                  ? 'मध्यम सांस फूलना, दवा से स्थिर। निरंतर हाई-फ्लो दीवार ऑक्सीजन बेड चाहिए।'
                  : language === 'mr'
                  ? 'मध्यम श्वास लागणे, स्थिती स्थिर. सतत हाय-फ्लो ऑक्सिजन बेडची आवश्यकता.'
                  : 'Moderate dyspnea, responsive to bronchodilators, vitals stable. Requires high-flow wall oxygen bed for continuous monitoring.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login & Instant Role Access Section */}
      <section id="login-portal" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FBFBFB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">{t.loginPortalTitle}</h2>
            <p className="text-xs text-neutral-600 mt-2">
              {t.loginPortalSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Quick 1-Tap Role Demo Cards */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                {t.oneTapDemoLogin}
              </span>

              {humanDemoAccounts.map((acc) => {
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
                      <span className="text-xs font-bold hidden sm:inline">{t.signIn}</span>
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
                <h3 className="text-base font-bold text-neutral-950">{t.signIn}</h3>
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
                  {isLoading ? '...' : t.signIn}
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
            <span className="text-neutral-400">&middot; {t.emergencyCoordination}</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <span>OpenStreetMap</span>
            <span>OSRM Road Routing</span>
            <span className="text-emerald-700 font-semibold">● {t.statusOnline}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
