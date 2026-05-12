import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';



/**
 * GET /api/dashboard/profile
 * Ambil data profil:
 *   - ?type=business  → ambil dari business_info
 *   - default         → ambil dari profiles
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'business') {
      const { data, error } = await supabase
        .from('business_info')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return NextResponse.json({ data: null });
        throw error;
      }
      return NextResponse.json({ data });
    } else {
      // Default: Ambil profil personal dari tabel profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return NextResponse.json({ data: null });
        throw error;
      }
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    console.error('GET /api/dashboard/profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/dashboard/profile
 * Update data:
 *   - body.type === 'business' → update business_info
 *   - default                  → update profiles
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, ...updateData } = body;

    if (type === 'business') {
      const businessFields = [
        'business_name', 'business_email', 'business_phone1', 'business_phone2', 'business_phone3',
        'business_address', 'business_province', 'business_city', 'business_district',
        'business_country', 'business_logo_url', 'business_description',
        'business_website', 'business_industry', 'business_type', 'business_social_media'
      ];
      const filteredUpdate: Record<string, any> = {};
      for (const key of businessFields) {
        if (key in updateData) filteredUpdate[key] = updateData[key];
      }

      let result;
      if (id) {
        result = await supabase.from('business_info').update(filteredUpdate).eq('id', id).select('id').single();
      } else {
        const { data: existing } = await supabase.from('business_info').select('id').eq('is_active', true).limit(1).single();
        if (existing) {
          result = await supabase.from('business_info').update(filteredUpdate).eq('id', existing.id).select('id').single();
        } else {
          result = await supabase.from('business_info').insert({ ...filteredUpdate, is_active: true }).select('id').single();
        }
      }
      if (result.error) throw result.error;
      return NextResponse.json({ data: result.data, message: 'Informasi bisnis berhasil disimpan' });
    } else {
      // Update Profil Personal di tabel profiles
      const personalFields = [
        'phone1', 'phone2', 'phone3', 'ktp', 'npwp', 'address', 
        'province', 'city', 'district', 'pin', 'email',
        'ktp_file_url', 'npwp_file_url'
      ];
      const filteredUpdate: Record<string, any> = {};
      for (const key of personalFields) {
        if (key in updateData) filteredUpdate[key] = updateData[key];
      }

      let result;
      if (id) {
        result = await supabase.from('profiles').update(filteredUpdate).eq('id', id).select('id').single();
      } else {
        const { data: existing } = await supabase.from('profiles').select('id').eq('is_active', true).limit(1).single();
        if (existing) {
          result = await supabase.from('profiles').update(filteredUpdate).eq('id', existing.id).select('id').single();
        } else {
          return NextResponse.json({ error: 'Data profil tidak ditemukan' }, { status: 404 });
        }
      }
      
      if (result.error) throw result.error;
      return NextResponse.json({ data: result.data, message: 'Profil berhasil disimpan' });
    }
  } catch (error: any) {
    console.error('PATCH /api/dashboard/profile error details:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error',
      details: error
    }, { status: 500 });
  }
}
