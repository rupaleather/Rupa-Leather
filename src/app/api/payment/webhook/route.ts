import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Webhook ini akan dipanggil otomatis oleh Midtrans saat ada perubahan status pembayaran
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validasi Signature Key (Security Check)
        // Midtrans mengirimkan signature_key = SHA512(order_id + status_code + gross_amount + server_key)
        const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
        const hash = crypto.createHash('sha512').update(
            `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`
        ).digest('hex');

        if (hash !== body.signature_key) {
            console.error('🚨 ALERT [PAYMENT]: Invalid Midtrans Signature!');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        const transactionStatus = body.transaction_status;
        const fraudStatus = body.fraud_status;
        
        // Catatan: Jika Anda menambahkan suffix di order_id saat create (misal: "UUID-123"),
        // Anda perlu split string-nya di sini untuk mendapatkan UUID aslinya.
        // Karena saat ini kita pakai UUID murni, kita langsung pakai:
        const orderId = body.order_id; 

        console.log(`[MIDTRANS WEBHOOK] Order ${orderId} Status: ${transactionStatus}`);

        // 2. Routing Status Pembayaran ke Database
        if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
            if (fraudStatus === 'challenge') {
                // Jangan confirm dulu, tunggu review manual dari dashboard midtrans
                console.log(`Order ${orderId} di-challenge oleh fraud detection.`);
            } else {
                // PEMBAYARAN SUKSES -> Potong stok permanen (Atomic)
                const { error } = await supabase.rpc('confirm_order', { p_order_id: orderId });
                if (error) {
                    console.error('❌ Gagal eksekusi confirm_order dari webhook:', error);
                    // Idealnya kita mencatat ini ke error_logs
                }
            }
        } else if (
            transactionStatus === 'cancel' ||
            transactionStatus === 'deny' ||
            transactionStatus === 'expire'
        ) {
            // PEMBAYARAN GAGAL/EXPIRED -> Kembalikan stok (Atomic)
            const { error } = await supabase.rpc('cancel_order', { p_order_id: orderId });
            if (error) {
                console.error('❌ Gagal eksekusi cancel_order dari webhook:', error);
            }
        } else if (transactionStatus === 'pending') {
            // Menunggu pembayaran, biarkan saja
        }

        // 3. Selalu kembalikan HTTP 200 OK ke Midtrans agar mereka tidak melakukan retry terus menerus
        return NextResponse.json({ message: 'Webhook received and processed' });

    } catch (err) {
        console.error('🔥 CRITICAL WEBHOOK ERROR:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
