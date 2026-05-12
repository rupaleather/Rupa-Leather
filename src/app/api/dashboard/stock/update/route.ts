import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
    console.log('🔥 MASUK UPDATE STOCK')

    const body = await req.json()

    const { product_id, warehouse_id, qty, type } = body

    // 🔍 DEBUG INPUT
    console.log('🔍 product_id:', product_id)
    console.log('🔍 warehouse_id:', warehouse_id)
    console.log('🔍 qty:', qty)
    console.log('🔍 type:', type)

    // ✅ VALIDASI
    if (!product_id || !warehouse_id || typeof qty !== 'number') {
        return Response.json(
            { error: 'product_id, warehouse_id, qty wajib' },
            { status: 400 }
        )
    }

    // 🔍 AMBIL DATA INVENTORY (PAKAI maybeSingle BIAR GAK CRASH)
    const { data: inventory, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', product_id)
        .eq('warehouse_id', warehouse_id)
        .maybeSingle()

    // 🔍 DEBUG HASIL QUERY
    console.log('📦 inventory result:', inventory)
    console.log('❌ fetchError:', fetchError)

    if (!inventory) {
        return Response.json(
            { error: 'Inventory tidak ditemukan' },
            { status: 404 }
        )
    }

    let newStock = inventory.available_stock

    // ✅ LOGIC UPDATE
    if (type === 'ADD') newStock += qty
    else if (type === 'OUT') newStock -= qty
    else if (type === 'SET') newStock = qty
    else {
        return Response.json(
            { error: 'type harus ADD / OUT / SET' },
            { status: 400 }
        )
    }

    // ❗ ANTI MINUS
    if (newStock < 0) newStock = 0

    // 🔍 DEBUG BEFORE UPDATE
    console.log('📊 oldStock:', inventory.available_stock)
    console.log('📊 newStock:', newStock)

    // ✅ UPDATE DB
    const { error: updateError } = await supabase
        .from('inventory')
        .update({ available_stock: newStock })
        .eq('id', inventory.id)

    if (updateError) {
        console.log('❌ ERROR UPDATE', updateError)
        return Response.json({ error: updateError }, { status: 400 })
    }

    console.log('✅ STOCK UPDATED:', newStock)

    return Response.json({
        message: 'STOCK UPDATED',
        newStock
    })
}