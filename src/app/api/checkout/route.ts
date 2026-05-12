import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
    try {
        const { items } = await req.json()

        if (!items || !Array.isArray(items) || items.length === 0) {
            return Response.json({ error: 'Items wajib ada' }, { status: 400 })
        }

        // Panggil fungsi SQL (Atomic Checkout Transaction)
        // RPC ini akan handle row-level lock, validasi stok, update inventory, dan insert orders.
        const { data, error } = await supabase.rpc('checkout_order', { p_items: items })

        if (error) {
            console.error('❌ Gagal checkout order:', error)
            return Response.json({ error: error.message || 'Gagal memproses checkout' }, { status: 400 })
        }

        return Response.json(data)

    } catch (err) {
        console.error('🔥 CHECKOUT CRITICAL ERROR:', err)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
