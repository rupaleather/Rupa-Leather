import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all outlets
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('outlets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create new outlet
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mapping from frontend formData to DB columns
    const { data, error } = await supabase
      .from('outlets')
      .insert({
        name: body.name,
        manager_name: body.manager_name,
        manager_email: body.manager_email,
        outlet_type: body.outlet_type || 'penjualan',
        status: body.status || 'buka',
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email,
        address: body.address,
        address_note: body.address_note,
        province: body.province,
        city: body.city,
        district: body.district,
        latitude: body.latitude,
        longitude: body.longitude,
        logo_url: body.logo_url,
        struk_logo_url: body.struk_logo_url,
        social_media: body.social_media || [],
        schedule: body.schedule || {},
        is_main_outlet: body.is_main_outlet || false,
        subscription_plan: 'TRIAL',
        expiry_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
