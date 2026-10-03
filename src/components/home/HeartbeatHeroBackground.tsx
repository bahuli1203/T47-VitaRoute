import React from 'react';

export const HeartbeatHeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Subtle Clinical Red & White Radial Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-2xl" />

      {/* Sterile Clinical Medical Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #dc2626 1px, transparent 1px),
            linear-gradient(to bottom, #dc2626 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* SVG Real ECG Heartbeat Lifeline Waveform */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 400"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ecgLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#dc2626" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#b91c1c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
          </linearGradient>

          <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 
          Continuous Realistic ECG Waveform Path (Repeated P-Q-R-S-T complexes across 1440px width)
          Baseline y=200. Q dip to 220, R peak spike to 50, S dip to 260, T wave to 160.
        */}
        <path
          id="heartbeatTrack"
          d="
            M 0,200 L 120,200 
            C 130,200 135,185 140,185 C 145,185 150,200 160,200 
            L 190,200 L 195,225 L 205,50 L 215,260 L 225,200 
            L 245,200 C 255,200 265,165 275,165 C 285,165 295,200 305,200 
            L 480,200 
            C 490,200 495,185 500,185 C 505,185 510,200 520,200 
            L 550,200 L 555,225 L 565,50 L 575,260 L 585,200 
            L 605,200 C 615,200 625,165 635,165 C 645,165 655,200 665,200 
            L 840,200 
            C 850,200 855,185 860,185 C 865,185 870,200 880,200 
            L 910,200 L 915,225 L 925,50 L 935,260 L 945,200 
            L 965,200 C 975,200 985,165 995,165 C 1005,165 1015,200 1025,200 
            L 1200,200 
            C 1210,200 1215,185 1220,185 C 1225,185 1230,200 1240,200 
            L 1270,200 L 1275,225 L 1285,50 L 1295,260 L 1305,200 
            L 1325,200 C 1335,200 1345,165 1355,165 C 1365,165 1375,200 1385,200 
            L 1440,200
          "
          stroke="url(#ecgLineGradient)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-35"
        />

        {/* Pulsating Glowing Traveling Signal Bead Along ECG Line */}
        <circle r="6" fill="#dc2626" filter="url(#ecgGlow)">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="
              M 0,200 L 120,200 
              C 130,200 135,185 140,185 C 145,185 150,200 160,200 
              L 190,200 L 195,225 L 205,50 L 215,260 L 225,200 
              L 245,200 C 255,200 265,165 275,165 C 285,165 295,200 305,200 
              L 480,200 
              C 490,200 495,185 500,185 C 505,185 510,200 520,200 
              L 550,200 L 555,225 L 565,50 L 575,260 L 585,200 
              L 605,200 C 615,200 625,165 635,165 C 645,165 655,200 665,200 
              L 840,200 
              C 850,200 855,185 860,185 C 865,185 870,200 880,200 
              L 910,200 L 915,225 L 925,50 L 935,260 L 945,200 
              L 965,200 C 975,200 985,165 995,165 C 1005,165 1015,200 1025,200 
              L 1200,200 
              C 1210,200 1215,185 1220,185 C 1225,185 1230,200 1240,200 
              L 1270,200 L 1275,225 L 1285,50 L 1295,260 L 1305,200 
              L 1325,200 C 1335,200 1345,165 1355,165 C 1365,165 1375,200 1385,200 
              L 1440,200
            "
          />
        </circle>

        {/* Second Signal Bead Following Behind */}
        <circle r="4" fill="#ffffff" stroke="#dc2626" strokeWidth="2">
          <animateMotion
            dur="4s"
            begin="2s"
            repeatCount="indefinite"
            path="
              M 0,200 L 120,200 
              C 130,200 135,185 140,185 C 145,185 150,200 160,200 
              L 190,200 L 195,225 L 205,50 L 215,260 L 225,200 
              L 245,200 C 255,200 265,165 275,165 C 285,165 295,200 305,200 
              L 480,200 
              C 490,200 495,185 500,185 C 505,185 510,200 520,200 
              L 550,200 L 555,225 L 565,50 L 575,260 L 585,200 
              L 605,200 C 615,200 625,165 635,165 C 645,165 655,200 665,200 
              L 840,200 
              C 850,200 855,185 860,185 C 865,185 870,200 880,200 
              L 910,200 L 915,225 L 925,50 L 935,260 L 945,200 
              L 965,200 C 975,200 985,165 995,165 C 1005,165 1015,200 1025,200 
              L 1200,200 
              C 1210,200 1215,185 1220,185 C 1225,185 1230,200 1240,200 
              L 1270,200 L 1275,225 L 1285,50 L 1295,260 L 1305,200 
              L 1325,200 C 1335,200 1345,165 1355,165 C 1365,165 1375,200 1385,200 
              L 1440,200
            "
          />
        </circle>
      </svg>
    </div>
  );
};
