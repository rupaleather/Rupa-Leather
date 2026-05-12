import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all categories
export async function GET() {
  try {
    // Ambil data kategori tanpa join otomatis agar tidak error jika relasi belum ada
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API Categories GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Nama Kategori wajib diisi' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert([
        { 
          name: body.name, 
          code: body.code,
          department_id: body.department_id || null,
          parent_category_id: body.parent_category_id || null,
          product_type: body.product_type || '',
          display_order: body.order || '0',
          is_active: body.is_active !== undefined ? body.is_active : true
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: false, error: 'Kode kategori sudah digunakan' }, { status: 409 });
      }
      throw error;
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API Categories POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
