import midtransClient from 'midtrans-client'
import { supabase } from '@/lib/supabase'

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
})

export async function POST(req: Request) {
    try {
        const { order_id } = await req.json()

        // ambil order dari DB (JANGAN percaya client)
        const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', order_id)
            .single()

        if (!order) {
            return Response.json({ error: 'Order tidak ditemukan' }, { status: 404 })
        }

        const parameter = {
            transaction_details: {
                order_id: order.id,
                gross_amount: order.total_price,
            },
            custom_expiry: {
                expiry_duration: 60,
                unit: 'minute'
            }
        }

        const transaction = await snap.createTransaction(parameter)

        return Response.json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        })

    } catch (err: any) {
        console.error('PAYMENT CREATE ERROR:', err)
        const midtransError = err.ApiResponse?.data?.error_messages || err.message;
        return Response.json({ error: midtransError || 'Internal error' }, { status: 500 })
    }
}