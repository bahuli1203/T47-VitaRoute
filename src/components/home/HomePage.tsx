import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBedLink } from '../../context/BedLinkContext';
import { HeartbeatHeroBackground } from './HeartbeatHeroBackground';
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
  MapPin,
  Calendar,
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
        : 'Finding nearest hospital with open ICU ventilator for an intubated patient',
      badgeText: language === 'hi' ? 'डिस्पैच व्यू' : language === 'mr' ? 'डिस्पॅच दृश्य' : 'Dispatch CAD',
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
      subtitle: 'Regional Operations Center',
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
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* Crisp Medical White & Red Top Navigation */}
      <header className="bg-white/95 backdrop-blur-md border-b border-red-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm tracking-tight shadow-sm">
              VR
            </div>
            <div>
              <span className="text-base font-extrabold text-neutral-900 tracking-tight block leading-tight">VitaRoute</span>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{t.emergencyCoordination}</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-neutral-600">
            <button onClick={() => scrollToSection('simplest-flow')} className="hover:text-red-600 transition-colors cursor-pointer">
              {language === 'hi' ? 'कार्यप्रणाली' : language === 'mr' ? 'कार्यप्रणाली' : 'Emergency Flow'}
            </button>
            <button onClick={() => scrollToSection('clinical-parts')} className="hover:text-red-600 transition-colors cursor-pointer">
              {t.partsTitle}
            </button>
            <button onClick={() => scrollToSection('login-portal')} className="hover:text-red-600 transition-colors cursor-pointer">
              {t.loginPortalTitle}
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-red-50/60 p-0.5 rounded-xl border border-red-200">
              <Globe className="w-3.5 h-3.5 text-red-600 ml-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Interface Language"
                className="bg-transparent text-xs font-bold text-red-900 pr-1 py-1 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            <button
              onClick={() => handleQuickLogin('ambulance@demo.com')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.openParamedicDemo}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Animated ECG Heartbeat Background */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-red-100 overflow-hidden">
        {/* Animated ECG Heartbeat Lifeline Background */}
        <HeartbeatHeroBackground />

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto text-center py-4 sm:py-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>{t.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 mb-6 leading-tight">
            {t.heroTitle} <br className="hidden sm:inline" />
            <span className="text-red-600 underline decoration-red-300 decoration-4 underline-offset-8">
              {t.heroHighlight}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
            {t.heroSubtitle}
          </p>

          {/* Simple Direct 3-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleQuickLogin('patient@demo.com')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t.heroSOSButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickLogin('ambulance@demo.com')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Ambulance className="w-4 h-4" />
              <span>{t.ambulanceDispatch}</span>
            </button>
            <button
              onClick={() => handleQuickLogin('nurse@demo.com')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-red-50 text-red-700 border-2 border-red-200 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{t.nurseUpdate}</span>
            </button>
          </div>

          {/* 4-Step Emergency Pipeline Track - Clean Red & White */}
          <div className="my-10 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {/* Step 1: Citizen SOS */}
              <div 
                onClick={() => handleQuickLogin('patient@demo.com')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-red-200 shadow-xs hover:border-red-400 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 fill-red-100" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 block">Step 01</span>
                  <span className="text-xs font-bold text-neutral-900 leading-tight block">{t.pipelineStep1}</span>
                </div>
              </div>

              {/* Step 2: Ambulance CAD */}
              <div 
                onClick={() => handleQuickLogin('ambulance@demo.com')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-xs hover:border-red-400 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block">Step 02</span>
                  <span className="text-xs font-bold text-neutral-900 leading-tight block">{t.pipelineStep2}</span>
                </div>
              </div>

              {/* Step 3: ER 2-Min Hold */}
              <div 
                onClick={() => handleQuickLogin('hospital@demo.com')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-300 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 block">Step 03</span>
                  <span className="text-xs font-bold text-neutral-900 leading-tight block">{t.pipelineStep3}</span>
                </div>
              </div>

              {/* Step 4: ICU Reserved */}
              <div 
                onClick={() => handleQuickLogin('nurse@demo.com')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-300 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">Step 04</span>
                  <span className="text-xs font-bold text-neutral-900 leading-tight block">{t.pipelineStep4}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Metrics Cards */}
          <div className="pt-6 border-t border-red-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-red-50/50 p-3 rounded-xl border border-red-100">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-red-600 block">&lt; 10 sec</span>
              <span className="text-xs text-neutral-600 font-medium">{t.nurseBedUpdateStat}</span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">4 Constraints</span>
              <span className="text-xs text-neutral-600 font-medium">{t.constraintsStat}</span>
            </div>
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 block">120 sec</span>
              <span className="text-xs text-neutral-600 font-medium">{t.holdTimerStat}</span>
            </div>
            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 block">Auto-Reroute</span>
              <span className="text-xs text-neutral-600 font-medium">{t.autoRerouteStat}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simplest Flow Section (Zero Clutter) */}
      <section id="simplest-flow" className="py-14 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 border-b border-neutral-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">End-to-End Coordination</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mt-1">
              {language === 'hi' ? 'सरलतम आपातकालीन प्रवाह' : language === 'mr' ? 'सर्वात सोपी आणीबाणी कार्यप्रणाली' : 'The Simplest Emergency Flow'}
            </h2>
            <p className="text-xs text-neutral-600 mt-1.5">
              {language === 'hi' 
                ? 'नागरिक के एसओएस से लेकर एम्बुलेंस डिस्पैच, बेड रिजर्वेशन और लाइव जीपीएस ट्रैकिंग तक 3 त्वरित कदम।'
                : language === 'mr'
                ? 'नागरिकाच्या एसओएसपासून रुग्णवाहिका डिस्पॅच, बेड आरक्षण आणि थेट जीपीएस नकाशापर्यंत ३ सोप्या पायऱ्या.'
                : 'From citizen SOS to ambulance CAD, 2-minute hospital bed hold, and live OpenStreetMap route tracking.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div 
              onClick={() => handleQuickLogin('patient@demo.com')}
              className="bg-white border-2 border-red-100 hover:border-red-400 rounded-2xl p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-3 border border-red-200 group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 fill-red-100" />
                </div>
                <span className="text-[11px] font-mono font-bold text-red-600 uppercase block mb-1">Step 1 &middot; Citizen Request</span>
                <h3 className="text-base font-bold text-neutral-950 mb-2">
                  {language === 'hi' ? '1-टैप एसओएस व आवाज इनपुट' : language === 'mr' ? '1-टॅप एसओएस आणि व्हॉईस इनपुट' : '1-Tap SOS or Voice Agent'}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'hi'
                    ? 'मरीज या परिजन एक टैप से अपनी स्थिति बताते हैं। जीपीएस व मरीज का इतिहास स्वतः जुड़ जाता है।'
                    : language === 'mr'
                    ? 'रुग्ण किंवा नातेवाईक एका टॅपवर आणीबाणी नोंदवतात. जीपीएस आणि वैद्यकीय माहिती आपोआप जोडली जाते.'
                    : 'Citizen or bystander triggers emergency SOS. Instant GPS coordinates and clinical details are dispatched.'}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-red-600">
                <span>Launch Citizen SOS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => handleQuickLogin('ambulance@demo.com')}
              className="bg-white border-2 border-neutral-200 hover:border-neutral-900 rounded-2xl p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Ambulance className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase block mb-1">Step 2 &middot; Dispatch & 2m Hold</span>
                <h3 className="text-base font-bold text-neutral-950 mb-2">
                  {language === 'hi' ? 'स्मार्ट डिस्पैच व 120s होल्ड' : language === 'mr' ? 'स्मार्ट डिस्पॅच आणि 120s होल्ड' : 'CAD Match & 2-Min ER Hold'}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'hi'
                    ? 'बेड उपलब्धता, यात्रा समय, डेटा ताजगी व भार के आधार पर अस्पताल रैंक होते हैं। ईआर 2 मिनट में बेड सुरक्षित करता है।'
                    : language === 'mr'
                    ? 'बेड उपलब्धता, प्रवासाचा वेळ, डेटा ताजेपणा आणि ताणानुसार रुग्णालये रँक होतात. ईआर २ मिनिटांत बेड राखून ठेवते.'
                    : 'Multi-constraint scoring ranks hospitals. Target hospital accepts or rejects within 2-minute countdown.'}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-900">
                <span>Open Paramedic CAD</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => handleQuickLogin('hospital@demo.com')}
              className="bg-white border-2 border-red-100 hover:border-red-400 rounded-2xl p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-bold text-red-600 uppercase block mb-1">Step 3 &middot; Live Tracking & Doctor</span>
                <h3 className="text-base font-bold text-neutral-950 mb-2">
                  {language === 'hi' ? 'लाइव मैप ट्रैकर व डॉक्टर कैलेंडर' : language === 'mr' ? 'थेट नकाशा ट्रॅकर आणि डॉक्टर कॅलेंडर' : 'Live Road Map & Doctor Roster'}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'hi'
                    ? 'ओपनस्ट्रीटमैप पर एम्बुलेंस की वास्तविक गति, दूरी व ईटीए दिखता है। ऑन-कॉल स्पेशलिस्ट ईआर में तैयार रहता है।'
                    : language === 'mr'
                    ? 'ओपनस्ट्रीटनकाशावर रुग्णवाहिकेचा वेग, अंतर आणि अचूक ईटीए दिसतो. ऑन-कॉल तज्ज्ञ ईआरमध्ये सज्ज राहतात.'
                    : 'Real OpenStreetMap pins display moving ambulance, patient scene, and hospital with on-duty specialist calendar.'}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-red-600">
                <span>View Map Tracker</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Problem Parts (Crisp Clinical Layout) */}
      <section id="clinical-parts" className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-red-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">{t.partsTitle}</h2>
            <p className="text-xs text-neutral-600 mt-1">
              {t.partsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Part 1 */}
            <div className="bg-neutral-50/50 border border-neutral-200 rounded-2xl p-5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block mb-1">Part 1</span>
              <h3 className="text-sm font-bold text-neutral-950 mb-1.5">{t.part1Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.part1Desc}
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                <span>48px Tactile Targets</span>
                <span className="text-emerald-700 font-bold">{t.statusOnline}</span>
              </div>
            </div>

            {/* Part 2 */}
            <div className="bg-neutral-50/50 border border-neutral-200 rounded-2xl p-5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold mb-3">
                <Ambulance className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block mb-1">Part 2</span>
              <h3 className="text-sm font-bold text-neutral-950 mb-1.5">{t.part2Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.part2Desc}
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Data Freshness Minutes</span>
                <span className="font-bold text-neutral-800">OSRM Road Routing</span>
              </div>
            </div>

            {/* Part 3 */}
            <div className="bg-neutral-50/50 border border-neutral-200 rounded-2xl p-5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block mb-1">Part 3</span>
              <h3 className="text-sm font-bold text-neutral-950 mb-1.5">{t.part3Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.part3Desc}
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                <span>120s Confirmation Window</span>
                <span className="text-amber-800 font-bold">Auto Next-Best</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login & Instant Role Access Section in Clean Red & White */}
      <section id="login-portal" className="py-14 px-4 sm:px-6 lg:px-8 bg-neutral-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">{t.loginPortalTitle}</h2>
            <p className="text-xs text-neutral-600 mt-1">
              {t.loginPortalSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Quick 1-Tap Role Demo Cards */}
            <div className="lg:col-span-7 space-y-2.5">
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
                    className="w-full p-3.5 rounded-xl bg-white hover:bg-red-50/50 border border-neutral-200 hover:border-red-300 transition-all text-left flex items-center justify-between gap-3 group cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-950 group-hover:text-red-700 transition-colors">
                            {acc.title}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200">
                            {acc.badgeText}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-medium">{acc.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-neutral-400 group-hover:text-red-600 transition-colors">
                      <span className="text-xs font-bold hidden sm:inline">{t.signIn}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Standard Login Box */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="text-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-neutral-950">{t.signIn}</h3>
                <p className="text-xs text-neutral-500">Sign in with an authorized account</p>
              </div>

              {error && (
                <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-red-500 bg-neutral-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-red-500 bg-neutral-50/50 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer mt-2"
                >
                  {isLoading ? 'Signing In...' : t.signIn}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Humanized Hospital Footer */}
      <footer className="border-t border-neutral-200 bg-white py-4 px-4 sm:px-6 text-xs text-neutral-500 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            <span className="font-bold text-neutral-900">VitaRoute Medical Coordination</span>
            <span className="hidden sm:inline">&middot; Hospital Bed Allocation & CAD Dispatch</span>
          </div>
          <span className="text-neutral-400">10s Updates &middot; Real Road Travel Times &middot; 2-Min ER Holds</span>
        </div>
      </footer>
    </div>
  );
};
