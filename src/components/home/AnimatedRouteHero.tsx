import React from 'react';
import {
  AlertCircle,
  Radio,
  Ambulance,
  Building2,
  CheckCircle2,
  Clock,
  Navigation,
} from 'lucide-react';

export const AnimatedRouteHero: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Subtle Ambient Mesh Lighting */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-neutral-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-neutral-100 rounded-full blur-2xl" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-neutral-200/50 rounded-full blur-2xl" />

      {/* SVG Vector Route Lines Tracing the Emergency Pipeline */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#71717a" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#18181b" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0.4" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Primary Pipeline Route: Citizen -> CAD -> Ambulance -> ER -> Bed */}
        <path
          d="M 120,420 C 280,420 320,180 500,180 C 680,180 760,420 940,420 C 1100,420 1200,200 1360,200"
          stroke="url(#routeGradient)"
          strokeWidth="3"
          strokeDasharray="8 6"
          className="animate-[dash_35s_linear_infinite]"
        />

        {/* Alternative Secondary Routing Path */}
        <path
          d="M 120,420 C 260,460 420,460 620,380 C 800,300 1020,420 1360,200"
          stroke="#d4d4d8"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.5"
        />

        {/* Traveling Signal Pulse Animation Along Route */}
        <circle r="6" fill="#18181b" filter="url(#glow)">
          <animateMotion
            path="M 120,420 C 280,420 320,180 500,180 C 680,180 760,420 940,420 C 1100,420 1200,200 1360,200"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="4" fill="#059669">
          <animateMotion
            path="M 120,420 C 280,420 320,180 500,180 C 680,180 760,420 940,420 C 1100,420 1200,200 1360,200"
            dur="8s"
            begin="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Ambient Route Landmarks positioned along margins */}
      {/* Node 1: Citizen SOS */}
      <div className="hidden xl:flex absolute left-[3%] top-[68%] -translate-y-1/2 flex-col items-center gap-1.5 opacity-70">
        <div className="relative">
          <span className="absolute -inset-1 rounded-full bg-rose-500/20 animate-ping" />
          <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-neutral-300 shadow-2xs flex items-center justify-center text-neutral-900">
            <AlertCircle className="w-5 h-5 text-rose-600 stroke-[2.5]" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-neutral-600 bg-white/80 px-2 py-0.5 rounded-full border border-neutral-200">
          SOS Origin
        </span>
      </div>

      {/* Node 2: GPS Telematics (top path) */}
      <div className="hidden xl:flex absolute left-[30%] top-[15%] -translate-y-1/2 flex-col items-center gap-1.5 opacity-70">
        <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-neutral-300 shadow-2xs flex items-center justify-center text-neutral-900">
          <Radio className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-neutral-600 bg-white/80 px-2 py-0.5 rounded-full border border-neutral-200">
          CAD Routing
        </span>
      </div>

      {/* Node 3: In-Transit (lower path) */}
      <div className="hidden xl:flex absolute left-[68%] top-[82%] -translate-y-1/2 flex-col items-center gap-1.5 opacity-70">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white shadow-2xs flex items-center justify-center">
          <Ambulance className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-neutral-600 bg-white/80 px-2 py-0.5 rounded-full border border-neutral-200">
          En Route
        </span>
      </div>

      {/* Node 4: ER Bed */}
      <div className="hidden xl:flex absolute right-[3%] top-[25%] -translate-y-1/2 flex-col items-center gap-1.5 opacity-70">
        <div className="relative">
          <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-neutral-300 shadow-2xs flex items-center justify-center text-neutral-900">
            <Building2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
          Bed Locked
        </span>
      </div>
    </div>
  );
};
