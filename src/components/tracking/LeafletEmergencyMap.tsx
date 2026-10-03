import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Building2, Radio } from 'lucide-react';

interface LeafletEmergencyMapProps {
  patientCoords: { lat: number; lng: number; label?: string };
  hospitalCoords: { lat: number; lng: number; name: string };
  progressPercent: number; // 0 to 100
  speedKmH: number;
  etaFormatted: string;
  language?: 'en' | 'hi' | 'mr';
}

export const LeafletEmergencyMap: React.FC<LeafletEmergencyMapProps> = ({
  patientCoords,
  hospitalCoords,
  progressPercent,
  speedKmH,
  etaFormatted,
  language = 'en',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const polylineTraversedRef = useRef<L.Polyline | null>(null);
  const polylineRemainingRef = useRef<L.Polyline | null>(null);

  // Multilingual translations for map elements
  const txt = {
    telemetryTitle: language === 'hi' ? 'लाइव जीपीएस टेलीमेट्री' : language === 'mr' ? 'थेट जीपीएस टेलिमेट्री' : 'Live GPS Telemetry',
    centerRoute: language === 'hi' ? 'मार्ग केंद्रित करें' : language === 'mr' ? 'मार्ग मध्यवर्ती करा' : 'Center Route',
    patientIncident: language === 'hi' ? 'मरीज घटना स्थल' : language === 'mr' ? 'रुग्ण घटनास्थळ' : 'Patient Incident',
    ambulanceUnit: language === 'hi' ? 'एम्बुलेंस 104' : language === 'mr' ? 'रुग्णवाहिका १०४' : 'Ambulance 104',
    hospitalEr: language === 'hi' ? 'अस्पताल ईआर' : language === 'mr' ? 'रुग्णालय ईआर' : 'Hospital ER',
    etaPrefix: language === 'hi' ? 'ईटीए' : language === 'mr' ? 'ईटीए' : 'ETA',
  };

  // Calculate interpolated ambulance coordinates along the direct road vector
  const clampedProgress = Math.min(100, Math.max(0, progressPercent)) / 100;
  const currentAmbLat = patientCoords.lat + (hospitalCoords.lat - patientCoords.lat) * clampedProgress;
  const currentAmbLng = patientCoords.lng + (hospitalCoords.lng - patientCoords.lng) * clampedProgress;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([patientCoords.lat, patientCoords.lng], 13);

      // Add high-clarity OpenStreetMap Carto tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Create Patient Marker (Red Emergency SOS Pin)
      const patientIcon = L.divIcon({
        className: 'custom-patient-marker',
        html: `
          <div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:34px;height:34px;border-radius:50%;background:#ef4444;opacity:0.35;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:26px;height:26px;border-radius:50%;background:#dc2626;border:2.5px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:10px;letter-spacing:-0.5px;">SOS</div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker([patientCoords.lat, patientCoords.lng], { icon: patientIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;font-size:12px;font-weight:bold;color:#1e293b;">
            <div style="color:#dc2626;font-size:10px;text-transform:uppercase;font-weight:800;">Emergency Incident Scene</div>
            <div>${patientCoords.label || 'Patient Scene Pickup'}</div>
            <div style="font-size:10px;color:#64748b;margin-top:2px;">${patientCoords.lat.toFixed(4)}, ${patientCoords.lng.toFixed(4)}</div>
          </div>`
        );

      // Create Destination Hospital Marker (Red & White Hospital Cross)
      const hospitalIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: `
          <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
            <div style="width:30px;height:30px;border-radius:8px;background:#ffffff;border:2.5px solid #dc2626;box-shadow:0 3px 10px rgba(220,38,38,0.25);display:flex;align-items:center;justify-content:center;color:#dc2626;font-weight:900;font-size:16px;">H</div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([hospitalCoords.lat, hospitalCoords.lng], { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;font-size:12px;font-weight:bold;color:#1e293b;">
            <div style="color:#059669;font-size:10px;text-transform:uppercase;font-weight:800;">Destination Hospital ER</div>
            <div>${hospitalCoords.name}</div>
            <div style="font-size:10px;color:#64748b;margin-top:2px;">${hospitalCoords.lat.toFixed(4)}, ${hospitalCoords.lng.toFixed(4)}</div>
          </div>`
        );

      // Create Ambulance Moving Marker
      const ambulanceIcon = L.divIcon({
        className: 'custom-amb-marker',
        html: `
          <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:40px;height:40px;border-radius:12px;background:#dc2626;opacity:0.25;animation:pulse 1.2s infinite;"></div>
            <div style="width:32px;height:32px;border-radius:10px;background:#b91c1c;border:2px solid #ffffff;box-shadow:0 4px 12px rgba(185,28,28,0.45);display:flex;align-items:center;justify-content:center;color:white;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      ambulanceMarkerRef.current = L.marker([currentAmbLat, currentAmbLng], { icon: ambulanceIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;font-size:12px;font-weight:bold;color:#1e293b;">
            <div style="color:#dc2626;font-size:10px;text-transform:uppercase;font-weight:800;">Ambulance Unit 104 (ALS)</div>
            <div>Speed: ${speedKmH} km/h &middot; ETA: ${etaFormatted}</div>
          </div>`
        );

      // Traversed path (solid emergency red)
      polylineTraversedRef.current = L.polyline(
        [
          [patientCoords.lat, patientCoords.lng],
          [currentAmbLat, currentAmbLng],
        ],
        {
          color: '#dc2626',
          weight: 5,
          opacity: 0.9,
          lineCap: 'round',
        }
      ).addTo(map);

      // Remaining path (dashed rose)
      polylineRemainingRef.current = L.polyline(
        [
          [currentAmbLat, currentAmbLng],
          [hospitalCoords.lat, hospitalCoords.lng],
        ],
        {
          color: '#f87171',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.8,
          lineCap: 'round',
        }
      ).addTo(map);

      // Fit map bounds to encompass both endpoints with margin
      const bounds = L.latLngBounds(
        [patientCoords.lat, patientCoords.lng],
        [hospitalCoords.lat, hospitalCoords.lng]
      );
      map.fitBounds(bounds, { padding: [40, 40] });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update ambulance marker & polyline when progress changes
  useEffect(() => {
    if (!mapInstanceRef.current || !ambulanceMarkerRef.current) return;

    ambulanceMarkerRef.current.setLatLng([currentAmbLat, currentAmbLng]);

    if (polylineTraversedRef.current) {
      polylineTraversedRef.current.setLatLngs([
        [patientCoords.lat, patientCoords.lng],
        [currentAmbLat, currentAmbLng],
      ]);
    }

    if (polylineRemainingRef.current) {
      polylineRemainingRef.current.setLatLngs([
        [currentAmbLat, currentAmbLng],
        [hospitalCoords.lat, hospitalCoords.lng],
      ]);
    }
  }, [currentAmbLat, currentAmbLng, patientCoords, hospitalCoords]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(
        [patientCoords.lat, patientCoords.lng],
        [hospitalCoords.lat, hospitalCoords.lng]
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-red-200 shadow-sm bg-white">
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-[380px] sm:h-[440px] z-0" />

      {/* Floating Top Telemetry Status Strip */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-100 shadow-sm flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="font-extrabold text-red-700 uppercase tracking-wider text-[11px]">{txt.telemetryTitle}</span>
          <span className="text-neutral-300">|</span>
          <span className="font-mono text-neutral-700 font-bold">{speedKmH} km/h</span>
          <span className="text-neutral-300">|</span>
          <span className="font-mono text-red-600 font-extrabold">{txt.etaPrefix} {etaFormatted}</span>
        </div>

        <button
          type="button"
          onClick={handleRecenter}
          className="pointer-events-auto px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-neutral-800 border border-neutral-200 shadow-sm text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <Navigation className="w-3.5 h-3.5 text-red-600" />
          <span>{txt.centerRoute}</span>
        </button>
      </div>

      {/* Bottom Floating Legend Bar */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-3 text-[11px] text-neutral-700 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs inline-block" />
            <span className="font-bold">{txt.patientIncident}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-neutral-900 border border-white shadow-xs inline-block" />
            <span className="font-bold">{txt.ambulanceUnit}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-white border border-red-600 text-red-600 text-[9px] font-black flex items-center justify-center">H</span>
            <span className="font-bold">{txt.hospitalEr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
