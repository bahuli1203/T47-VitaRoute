/**
 * VitaRoute Geolocation and Route Time Utilities
 * Accurate Haversine distance and emergency vehicle travel time modeling for Mumbai Metropolitan Region
 */

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

/**
 * Calculates distance between two points in kilometers using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const rawDistance = earthRadiusKm * c;

  // Road circuitousness factor in Mumbai road network (~1.32x straight-line distance)
  const roadNetworkDistance = rawDistance * 1.32;
  return Number(roadNetworkDistance.toFixed(1));
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimates emergency response travel time in minutes factoring in urban speed and congestion
 */
export function estimateEmergencyTravelTime(
  distanceKm: number,
  erLoad: 'Low' | 'Medium' | 'Surge'
): number {
  // Average Mumbai emergency vehicle speed under siren clearance: ~38 km/h
  // Traffic congestion multiplier based on hospital district load
  let congestionMultiplier = 1.0;
  if (erLoad === 'Medium') congestionMultiplier = 1.18;
  if (erLoad === 'Surge') congestionMultiplier = 1.38;

  const baseMinutes = (distanceKm / 38) * 60 * congestionMultiplier;
  // Baseline intersection clearance and bay maneuvering
  const totalMinutes = Math.round(baseMinutes + 1.5);
  return Math.max(3, totalMinutes);
}

/**
 * Mumbai Metropolitan Region sector reference coordinates
 */
export const METRO_SECTORS: Record<string, { label: string; coords: GeoCoordinate }> = {
  'sec-bandra': {
    label: 'Bandra West / BKC Corridor (SV Road Junction)',
    coords: { lat: 19.0596, lng: 72.8295 },
  },
  'sec-parel': {
    label: 'Parel Medical Hub (Dr. Babasaheb Ambedkar Road)',
    coords: { lat: 18.9986, lng: 72.8427 },
  },
  'sec-andheri': {
    label: 'Andheri West (New Link Road / Four Bungalows)',
    coords: { lat: 19.1314, lng: 72.8252 },
  },
  'sec-sion': {
    label: 'Sion Circle (Eastern Express Highway Interchange)',
    coords: { lat: 19.0390, lng: 72.8600 },
  },
  'sec-southmumbai': {
    label: 'Marine Lines / Fort (South Mumbai District)',
    coords: { lat: 18.9388, lng: 72.8286 },
  },
  'sec-mahim': {
    label: 'Mahim Bay / Cadell Road Junction',
    coords: { lat: 19.0330, lng: 72.8397 },
  },

  // Aliases for backward compatibility
  'sec-downtown': {
    label: 'Bandra West / BKC Core (SV Road)',
    coords: { lat: 19.0596, lng: 72.8295 },
  },
  'sec-hwy101': {
    label: 'Western Express Highway (Kalanagar Junction)',
    coords: { lat: 19.0620, lng: 72.8480 },
  },
  'sec-harbor': {
    label: 'Eastern Freeway Hub (Sewri / Docklands)',
    coords: { lat: 19.0010, lng: 72.8580 },
  },
  'sec-northridge': {
    label: 'Andheri West Link Road (Four Bungalows)',
    coords: { lat: 19.1314, lng: 72.8252 },
  },
  'sec-industrial': {
    label: 'Parel Medical Hub (King Edward Memorial Precinct)',
    coords: { lat: 18.9986, lng: 72.8427 },
  },
};
