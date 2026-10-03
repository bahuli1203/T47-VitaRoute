import React from 'react';
import {
  AlertCircle,
  Radio,
  Ambulance,
  Building2,
  Bed,
  CheckCircle2,
  Clock,
  Navigation,
} from 'lucide-react';

export const AnimatedRouteHero: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Subtle Radial Mesh Ambient Lighting */}
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
          d="M 120,420 C 280,420 320,240 500,240 C 680,240 760,340 940,340 C 1100,340 1200,200 1360,200"
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
            path="M 120,420 C 280,420 320,240 500,240 C 680,240 760,340 940,340 C 1100,340 1200,200 1360,200"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="4" fill="#059669">
          <animateMotion
            path="M 120,420 C 280,420 320,240 500,240 C 680,240 760,340 940,340 C 1100,340 1200,200 1360,200"
            dur="8s"
            begin="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Floating Monochrome Glass Nodes Positioned Along the Pipeline */}
      {/* Node 1: Citizen SOS Request Beacon */}
      <div className="hidden lg:flex absolute left-[6%] top-[65%] -translate-y-1/2 flex-col items-center gap-2">
        <div className="relative">
          <span className="absolute -inset-2 rounded-full bg-rose-500/20 animate-ping" />
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral-300 shadow-sm flex items-center justify-center text-neutral-900">
            <AlertCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-200 text-[10px] font-bold text-neutral-800 shadow-xs flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>1. Citizen SOS Voice</span>
        </div>
      </div>

      {/* Node 2: GPS Telematics & CAD Router */}
      <div className="hidden lg:flex absolute left-[32%] top-[34%] -translate-y-1/2 flex-col items-center gap-2">
        <div className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral-300 shadow-sm flex items-center justify-center text-neutral-900">
          <Radio className="w-5 h-5" />
        </div>
        <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-200 text-[10px] font-bold text-neutral-800 shadow-xs flex items-center gap-1">
          <Navigation className="w-3 h-3 text-neutral-600" />
          <span>2. Live GPS & Road CAD</span>
        </div>
      </div>

      {/* Node 3: Ambulance Unit in Transit */}
      <div className="hidden lg:flex absolute left-[62%] top-[50%] -translate-y-1/2 flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white shadow-md flex items-center justify-center">
          <Ambulance className="w-6 h-6" />
        </div>
        <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-200 text-[10px] font-bold text-neutral-800 shadow-xs flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>3. 120s Hold Window</span>
        </div>
      </div>

      {/* Node 4: Target Hospital ER & Bed Allocation */}
      <div className="hidden lg:flex absolute right-[5%] top-[28%] -translate-y-1/2 flex-col items-center gap-2">
        <div className="relative">
          <span className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral-300 shadow-sm flex items-center justify-center text-neutral-900">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-200 text-[10px] font-bold text-emerald-900 shadow-xs flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>4. ICU Bed Reserved</span>
        </div>
      </div>
    </div>
  );
};
