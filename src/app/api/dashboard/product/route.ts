import { supabase } from '@/lib/supabase'

export async function GET() {
    return Response.json({ message: 'API OK' })
}

export async function POST(req: Request) {
    console.log('🔥 MASUK API')

    let body: any = {}

    try {
        body = await req.json()
    } catch (err) {
        return Response.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const {
        name,
        sku,
        price,
        cost_price,
        category_id,
        description,
        weight,
        length,
        width,
        height,
        track_stock,
        images
    } = body

    // ✅ VALIDASI
    if (!name || typeof price !== 'number' || price <= 0) {
        return Response.json(
            { error: 'Name wajib & price harus angka > 0' },
            { status: 400 }
        )
    }

    // ✅ INSERT PRODUCT
    const { data: product, error } = await supabase
        .from('products')
        .insert([{
            name,
            sku,
            price,
            cost_price,
            category_id,
            description,
            weight,
            length,
            width,
            height,
            track_stock: track_stock ?? true
        }])
        .select()
        .single()

    if (error || !product) {
        console.log('❌ ERROR PRODUCT', error)
        return Response.json({ error }, { status: 400 })
    }

    // ======================
    // 🔍 DEBUG (WAJIB LIHAT DI TERMINAL)
    console.log('📸 images:', images)
    // ======================

    let imageInserted = false

    // ✅ INSERT IMAGES
    if (Array.isArray(images) && images.length > 0) {
        const imageData = images.map((url: string, i: number) => ({
            product_id: product.id,
            image_url: url,
            position: i
        }))

        const { error: imageError } = await supabase
            .from('product_images')
            .insert(imageData)

        if (imageError) {
            console.log('❌ ERROR IMAGE', imageError)

            await supabase
                .from('products')
                .delete()
                .eq('id', product.id)

            return Response.json({ error: imageError }, { status: 400 })
        }

        imageInserted = true
    }

    // ======================
    // 🔍 DEBUG WAREHOUSE
    const { data: warehouses } = await supabase
        .from('warehouses')
        .select('id')

    console.log('🏬 warehouses:', warehouses)
    // ======================

    // 🔥 FIX PENTING: kalau kosong → bikin default
    let finalWarehouses = warehouses

    if (!warehouses || warehouses.length === 0) {
        console.log('⚠️ NO WAREHOUSE → AUTO CREATE')

        const { data: newWarehouse } = await supabase
            .from('warehouses')
            .insert([{ name: 'Default Warehouse', city: 'Default' }])
            .select()

        finalWarehouses = newWarehouse
    }

    // ✅ INSERT INVENTORY
    if (finalWarehouses && finalWarehouses.length > 0) {
        const inventoryData = finalWarehouses.map((w) => ({
            product_id: product.id,
            warehouse_id: w.id,
            available_stock: 0,
            reserved_stock: 0
        }))

        const { error: invError } = await supabase
            .from('inventory')
            .insert(inventoryData)

        if (invError) {
            console.log('❌ ERROR INVENTORY', invError)

            await supabase.from('products').delete().eq('id', product.id)

            if (imageInserted) {
                await supabase
                    .from('product_images')
                    .delete()
                    .eq('product_id', product.id)
            }

            return Response.json({ error: invError }, { status: 400 })
        }
    }

    console.log('✅ SUCCESS')

    return Response.json({
        message: 'SUCCESS',
        product
    })
}