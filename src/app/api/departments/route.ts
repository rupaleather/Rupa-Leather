import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all departments
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST new department
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validasi data
    if (!body.code || !body.name) {
      return NextResponse.json(
        { success: false, error: 'Kode dan Nama Departemen wajib diisi' }, 
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('departments')
      .insert([
        { 
          code: body.code, 
          name: body.name, 
          description: body.description || '',
          display_order: body.order || '0',
          is_active: body.is_active !== undefined ? body.is_active : true
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ success: false, error: 'Kode departemen sudah digunakan' }, { status: 409 });
      }
      throw error;
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
