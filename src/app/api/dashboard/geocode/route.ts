import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache to prevent hitting rate limits
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // Create a unique cache key
  let cacheKey = '';
  if (q) {
    cacheKey = `q_${q.toLowerCase().trim()}`;
  } else if (lat && lon) {
    const rLat = parseFloat(lat).toFixed(4);
    const rLon = parseFloat(lon).toFixed(4);
    cacheKey = `rev_${rLat}_${rLon}`;
  } else {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const headers = {
    'User-Agent': 'RupaDashboard/1.0 (admin@rupa.com)',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  };

  try {
    let url = '';
    let isPhoton = false;

    if (q) {
      // Use PHOTON for much better "Fuzzy Search" (finds residences, businesses, etc.)
      url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en`;
      isPhoton = true;
    } else {
      // Use Nominatim for Reverse Geocoding (Coordinates to Address)
      url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    }

    const res = await fetch(url, { headers });
    
    if (res.status === 429) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Silakan tunggu sebentar.' }, { status: 429 });
    }

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }

    let data = await res.json();
    
    // Transform Photon data to match our frontend expectations if needed
    if (isPhoton && data.features) {
      data = data.features.map((f: any) => ({
        display_name: [
          f.properties.name,
          f.properties.street,
          f.properties.city,
          f.properties.state,
          f.properties.country
        ].filter(Boolean).join(', '),
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0]
      }));
    }
    
    // Save to cache
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Geocode Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
