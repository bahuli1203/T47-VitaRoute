/**
 * VitaRoute Geolocation and Route Time Utilities
 * Accurate Haversine distance and emergency vehicle travel time modeling
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

  // Road circuitousness factor in metropolitan grid (~1.25x straight-line distance)
  const roadNetworkDistance = rawDistance * 1.28;
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
  // Average urban ambulance speed under lights and sirens: ~42 km/h
  // Traffic congestion multiplier based on hospital district load
  let congestionMultiplier = 1.0;
  if (erLoad === 'Medium') congestionMultiplier = 1.15;
  if (erLoad === 'Surge') congestionMultiplier = 1.35;

  const baseMinutes = (distanceKm / 42) * 60 * congestionMultiplier;
  // Add 1.5 minutes baseline for intersection clearance and bay maneuvering
  const totalMinutes = Math.round(baseMinutes + 1.5);
  return Math.max(3, totalMinutes);
}

/**
 * Known metropolitan sector reference coordinates
 */
export const METRO_SECTORS: Record<string, { label: string; coords: GeoCoordinate }> = {
  'sec-downtown': {
    label: 'Downtown Metro Core (Broadway / 5th Ave)',
    coords: { lat: 40.7128, lng: -74.006 },
  },
  'sec-hwy101': {
    label: 'Expressway Interchange (Mile Marker 24)',
    coords: { lat: 40.735, lng: -74.04 },
  },
  'sec-harbor': {
    label: 'South Harbor Marine Terminal (Pier 19)',
    coords: { lat: 40.682, lng: -74.015 },
  },
  'sec-northridge': {
    label: 'North Heights Residential (Route 8 North)',
    coords: { lat: 40.785, lng: -73.975 },
  },
  'sec-industrial': {
    label: 'West Logistics Park (Gate 3)',
    coords: { lat: 40.745, lng: -74.065 },
  },
};
