import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { haversine, geocodeZip, geocodeCity, resolveState } from "@/lib/geo";

interface Screening {
  id: string;
  venue_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  date: string;
  time: string;
  capacity: number;
  tickets_sold: number;
}

interface Showtime {
  id: string;
  date: string;
  time: string;
  capacity: number;
  tickets_sold: number;
  available: number;
}

interface VenueGroup {
  venue_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  distance_miles: number;
  showtimes: Showtime[];
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data: screenings, error } = await supabase
    .from("screenings")
    .select("*")
    .eq("status", "PUBLISHED")
    .eq("is_active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const allScreenings = screenings as Screening[];

  // Check if the query is a US state name or abbreviation
  const stateMatch = resolveState(q);

  let refLat: number;
  let refLng: number;
  let filtered: (Screening & { distance: number })[];

  if (stateMatch) {
    // State search: return all screenings in that state, distance from capital
    refLat = stateMatch.lat;
    refLng = stateMatch.lng;
    filtered = allScreenings
      .filter((s) => s.state.toUpperCase() === stateMatch.abbr.toUpperCase())
      .map((s) => ({
        ...s,
        distance: haversine(refLat, refLng, s.lat, s.lng),
      }))
      .sort((a, b) => a.distance - b.distance || a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  } else {
    // City/zip search: geocode and filter within 100 miles
    const isZip = /^\d{5}$/.test(q);
    const coords = isZip ? await geocodeZip(q) : await geocodeCity(q);

    if (!coords) {
      return NextResponse.json(
        { error: "Could not geocode location" },
        { status: 400 }
      );
    }

    refLat = coords.lat;
    refLng = coords.lng;
    filtered = allScreenings
      .map((s) => ({
        ...s,
        distance: haversine(refLat, refLng, s.lat, s.lng),
      }))
      .filter((s) => s.distance <= 100)
      .sort((a, b) => a.distance - b.distance || a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }

  const venueMap = new Map<string, VenueGroup>();
  for (const s of filtered) {
    const key = `${s.venue_name}|${s.address}`;
    if (!venueMap.has(key)) {
      venueMap.set(key, {
        venue_name: s.venue_name,
        address: s.address,
        city: s.city,
        state: s.state,
        zip: s.zip,
        distance_miles: Math.round(s.distance * 10) / 10,
        showtimes: [],
      });
    }
    venueMap.get(key)!.showtimes.push({
      id: s.id,
      date: s.date,
      time: s.time,
      capacity: s.capacity,
      tickets_sold: s.tickets_sold,
      available: s.capacity - s.tickets_sold,
    });
  }

  const results = Array.from(venueMap.values()).sort(
    (a, b) => a.distance_miles - b.distance_miles
  );

  let nearest_outside_range: VenueGroup | null = null;
  if (results.length === 0) {
    const allWithDistance = allScreenings
      .map((s) => ({ ...s, distance: haversine(refLat, refLng, s.lat, s.lng) }))
      .sort((a, b) => a.distance - b.distance);
    if (allWithDistance.length > 0) {
      const nearest = allWithDistance[0];
      nearest_outside_range = {
        venue_name: nearest.venue_name,
        address: nearest.address,
        city: nearest.city,
        state: nearest.state,
        zip: nearest.zip,
        distance_miles: Math.round(nearest.distance * 10) / 10,
        showtimes: [
          {
            id: nearest.id,
            date: nearest.date,
            time: nearest.time,
            capacity: nearest.capacity,
            tickets_sold: nearest.tickets_sold,
            available: nearest.capacity - nearest.tickets_sold,
          },
        ],
      };
    }
  }

  return NextResponse.json({ results, nearest_outside_range });
}
