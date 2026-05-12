import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json()

    if (!order_id) {
      return Response.json({ error: 'order_id wajib diisi' }, { status: 400 })
    }

    // Panggil fungsi SQL (Atomic Transaction)
    const { error } = await supabase.rpc('confirm_order', { p_order_id: order_id })

    if (error) {
      console.error('❌ Gagal confirm order:', error)
      return Response.json({ error: error.message || 'Gagal mengkonfirmasi order' }, { status: 400 })
    }

    return Response.json({ message: 'Order berhasil dikonfirmasi dan stok dipotong permanen' })

  } catch (err) {
    console.error('🔥 CONFIRM ORDER CRITICAL ERROR:', err)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}