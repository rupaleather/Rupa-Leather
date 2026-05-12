import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET single outlet
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('outlets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update outlet
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log(`[API] Update Outlet ID: ${id}`);
    console.log('[API] Body received:', body);
    console.log('[API] Address Note:', body.address_note);
    
    const { data, error } = await supabase
      .from('outlets')
      .update({
        name: body.name,
        manager_name: body.manager_name,
        manager_email: body.manager_email,
        outlet_type: body.outlet_type,
        status: body.status,
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
        social_media: body.social_media,
        schedule: body.schedule,
        close_store_enabled: body.close_store_enabled,
        tutup_toko_settings: body.tutup_toko_settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] Gagal update:', error);
      throw error;
    }
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE outlet
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('outlets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
