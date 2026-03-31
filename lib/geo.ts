const R = 3958.8; // Earth radius in miles

const STATE_CAPITALS: Record<string, { name: string; abbr: string; lat: number; lng: number }> = {
  alabama: { name: "Alabama", abbr: "AL", lat: 32.3777, lng: -86.3006 },
  alaska: { name: "Alaska", abbr: "AK", lat: 58.3019, lng: -134.4197 },
  arizona: { name: "Arizona", abbr: "AZ", lat: 33.4484, lng: -112.074 },
  arkansas: { name: "Arkansas", abbr: "AR", lat: 34.7465, lng: -92.2896 },
  california: { name: "California", abbr: "CA", lat: 38.5767, lng: -121.4934 },
  colorado: { name: "Colorado", abbr: "CO", lat: 39.7392, lng: -104.9903 },
  connecticut: { name: "Connecticut", abbr: "CT", lat: 41.7658, lng: -72.6734 },
  delaware: { name: "Delaware", abbr: "DE", lat: 39.1582, lng: -75.5244 },
  florida: { name: "Florida", abbr: "FL", lat: 30.4383, lng: -84.2807 },
  georgia: { name: "Georgia", abbr: "GA", lat: 33.749, lng: -84.388 },
  hawaii: { name: "Hawaii", abbr: "HI", lat: 21.3069, lng: -157.8583 },
  idaho: { name: "Idaho", abbr: "ID", lat: 43.6150, lng: -116.2023 },
  illinois: { name: "Illinois", abbr: "IL", lat: 39.7984, lng: -89.6548 },
  indiana: { name: "Indiana", abbr: "IN", lat: 39.7684, lng: -86.1581 },
  iowa: { name: "Iowa", abbr: "IA", lat: 41.5868, lng: -93.625 },
  kansas: { name: "Kansas", abbr: "KS", lat: 39.0473, lng: -95.6752 },
  kentucky: { name: "Kentucky", abbr: "KY", lat: 38.1867, lng: -84.8753 },
  louisiana: { name: "Louisiana", abbr: "LA", lat: 30.4515, lng: -91.1871 },
  maine: { name: "Maine", abbr: "ME", lat: 44.3106, lng: -69.7795 },
  maryland: { name: "Maryland", abbr: "MD", lat: 38.9784, lng: -76.4922 },
  massachusetts: { name: "Massachusetts", abbr: "MA", lat: 42.3601, lng: -71.0589 },
  michigan: { name: "Michigan", abbr: "MI", lat: 42.7325, lng: -84.5555 },
  minnesota: { name: "Minnesota", abbr: "MN", lat: 44.9537, lng: -93.09 },
  mississippi: { name: "Mississippi", abbr: "MS", lat: 32.2988, lng: -90.1848 },
  missouri: { name: "Missouri", abbr: "MO", lat: 38.5768, lng: -92.1735 },
  montana: { name: "Montana", abbr: "MT", lat: 46.5958, lng: -112.027 },
  nebraska: { name: "Nebraska", abbr: "NE", lat: 40.8136, lng: -96.7026 },
  nevada: { name: "Nevada", abbr: "NV", lat: 39.1638, lng: -119.7674 },
  "new hampshire": { name: "New Hampshire", abbr: "NH", lat: 43.2081, lng: -71.5376 },
  "new jersey": { name: "New Jersey", abbr: "NJ", lat: 40.2206, lng: -74.77 },
  "new mexico": { name: "New Mexico", abbr: "NM", lat: 35.687, lng: -105.9378 },
  "new york": { name: "New York", abbr: "NY", lat: 42.6526, lng: -73.7562 },
  "north carolina": { name: "North Carolina", abbr: "NC", lat: 35.7796, lng: -78.6382 },
  "north dakota": { name: "North Dakota", abbr: "ND", lat: 46.8083, lng: -100.7837 },
  ohio: { name: "Ohio", abbr: "OH", lat: 39.9612, lng: -82.9988 },
  oklahoma: { name: "Oklahoma", abbr: "OK", lat: 35.4676, lng: -97.5164 },
  oregon: { name: "Oregon", abbr: "OR", lat: 44.9429, lng: -123.0351 },
  pennsylvania: { name: "Pennsylvania", abbr: "PA", lat: 40.2732, lng: -76.8867 },
  "rhode island": { name: "Rhode Island", abbr: "RI", lat: 41.824, lng: -71.4128 },
  "south carolina": { name: "South Carolina", abbr: "SC", lat: 34.0007, lng: -81.0348 },
  "south dakota": { name: "South Dakota", abbr: "SD", lat: 44.3668, lng: -100.3538 },
  tennessee: { name: "Tennessee", abbr: "TN", lat: 36.1627, lng: -86.7816 },
  texas: { name: "Texas", abbr: "TX", lat: 30.2672, lng: -97.7431 },
  utah: { name: "Utah", abbr: "UT", lat: 40.7608, lng: -111.891 },
  vermont: { name: "Vermont", abbr: "VT", lat: 44.2601, lng: -72.5754 },
  virginia: { name: "Virginia", abbr: "VA", lat: 37.5407, lng: -77.436 },
  washington: { name: "Washington", abbr: "WA", lat: 47.0379, lng: -122.9007 },
  "west virginia": { name: "West Virginia", abbr: "WV", lat: 38.3498, lng: -81.6326 },
  wisconsin: { name: "Wisconsin", abbr: "WI", lat: 43.0747, lng: -89.3841 },
  wyoming: { name: "Wyoming", abbr: "WY", lat: 41.14, lng: -104.8202 },
  "washington dc": { name: "District of Columbia", abbr: "DC", lat: 38.9072, lng: -77.0369 },
  dc: { name: "District of Columbia", abbr: "DC", lat: 38.9072, lng: -77.0369 },
};

const ABBR_TO_STATE: Record<string, string> = {};
for (const [key, val] of Object.entries(STATE_CAPITALS)) {
  ABBR_TO_STATE[val.abbr.toLowerCase()] = key;
}

export function resolveState(query: string): { abbr: string; lat: number; lng: number } | null {
  const q = query.toLowerCase().trim();
  if (STATE_CAPITALS[q]) {
    return { abbr: STATE_CAPITALS[q].abbr, lat: STATE_CAPITALS[q].lat, lng: STATE_CAPITALS[q].lng };
  }
  if (ABBR_TO_STATE[q] && STATE_CAPITALS[ABBR_TO_STATE[q]]) {
    const s = STATE_CAPITALS[ABBR_TO_STATE[q]];
    return { abbr: s.abbr, lat: s.lat, lng: s.lng };
  }
  return null;
}

export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export async function geocodeZip(
  zip: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=US&format=json&limit=1`,
      { headers: { "User-Agent": "BillyKnightFilm/1.0" }, cache: "no-store" }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

export async function geocodeCity(
  city: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&countrycodes=us&format=json&limit=1`,
      { headers: { "User-Agent": "BillyKnightFilm/1.0" }, cache: "no-store" }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

export async function geocodeAddress(
  address: string,
  city: string,
  state: string,
  zip: string
): Promise<{ lat: number; lng: number } | null> {
  const query = `${address}, ${city}, ${state} ${zip}`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=us&format=json&limit=1`,
      { headers: { "User-Agent": "BillyKnightFilm/1.0" }, cache: "no-store" }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}
