import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/regions?level=provinsi
 * GET /api/regions?level=kota&provinsi=ACEH
 * GET /api/regions?level=kecamatan&provinsi=ACEH&kota=KABUPATEN SIMEULUE
 * GET /api/regions?level=kelurahan&provinsi=ACEH&kota=KABUPATEN SIMEULUE&kecamatan=TEUPAH SELATAN
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  try {
    if (level === 'provinsi') {
      const { data, error } = await supabase
        .from('distinct_provinces')
        .select('provinsi');

      if (error) throw error;

      const unique = data?.map(d => d.provinsi) || [];
      return NextResponse.json({ data: unique });
    }

    if (level === 'kota') {
      const provinsi = searchParams.get('provinsi');
      if (!provinsi) return NextResponse.json({ error: 'Parameter provinsi diperlukan' }, { status: 400 });

      const { data, error } = await supabase
        .rpc('get_cities', { p_prov: provinsi });

      if (error) throw error;

      const unique = data?.map(d => d.kota_kabupaten) || [];
      return NextResponse.json({ data: unique });
    }

    if (level === 'kecamatan') {
      const provinsi = searchParams.get('provinsi');
      const kota = searchParams.get('kota');
      if (!provinsi || !kota) return NextResponse.json({ error: 'Parameter provinsi dan kota diperlukan' }, { status: 400 });

      const { data, error } = await supabase
        .rpc('get_districts', { p_prov: provinsi, p_city: kota });

      if (error) throw error;

      const unique = data?.map(d => d.kecamatan) || [];
      return NextResponse.json({ data: unique });
    }

    if (level === 'kelurahan') {
      const provinsi = searchParams.get('provinsi');
      const kota = searchParams.get('kota');
      const kecamatan = searchParams.get('kecamatan');
      if (!provinsi || !kota || !kecamatan) return NextResponse.json({ error: 'Parameter provinsi, kota, dan kecamatan diperlukan' }, { status: 400 });

      const { data, error } = await supabase
        .from('regions')
        .select('kelurahan, kode_pos')
        .eq('provinsi', provinsi)
        .eq('kota_kabupaten', kota)
        .eq('kecamatan', kecamatan)
        .order('kelurahan', { ascending: true });

      if (error) throw error;

      const unique = data?.filter(d => d.kelurahan && d.kelurahan !== '-')
        .map(d => ({ name: d.kelurahan, kode_pos: d.kode_pos })) || [];

      // Deduplicate by name
      const seen = new Set();
      const deduped = unique.filter(d => {
        if (seen.has(d.name)) return false;
        seen.add(d.name);
        return true;
      });

      return NextResponse.json({ data: deduped });
    }

    return NextResponse.json({ error: 'Parameter level tidak valid' }, { status: 400 });
  } catch (error: any) {
    console.error('Regions API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
