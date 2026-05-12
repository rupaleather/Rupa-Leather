'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatters';
import { validateCheckoutForm, validateEmail, sanitizeInput, type CheckoutData } from '@/lib/validators';
import { whatsappUrl } from '@/lib/formatters';
import { SITE_CONFIG } from '@/lib/constants';
import styles from '@/styles/components/Checkout.module.css';
import { FiChevronDown } from 'react-icons/fi';
import RegionSelect from '@/components/RegionSelect/RegionSelect';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [form, setForm] = useState<CheckoutData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    district: '',
    village: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Region data dari Supabase
  const [provinsiList, setProvinsiList] = useState<string[]>([]);
  const [kotaList, setKotaList] = useState<string[]>([]);
  const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  const [kelurahanList, setKelurahanList] = useState<{ name: string; kode_pos: string }[]>([]);
  const [loadingRegion, setLoadingRegion] = useState({ provinsi: true, kota: false, kecamatan: false, kelurahan: false });
  const [kodePos, setKodePos] = useState('');

  useEffect(() => {
    // Load Midtrans Snap script dynamically as soon as the component mounts
    const snapScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-XXXXX';

    // Prevent adding the script multiple times
    if (!document.querySelector(`script[src="${snapScriptUrl}"]`)) {
      const script = document.createElement('script');
      script.src = snapScriptUrl;
      script.setAttribute('data-client-key', clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch Provinsi on mount
  useEffect(() => {
    fetch('/api/regions?level=provinsi')
      .then(r => r.json())
      .then(d => { setProvinsiList(d.data || []); setLoadingRegion(prev => ({ ...prev, provinsi: false })); })
      .catch(() => setLoadingRegion(prev => ({ ...prev, provinsi: false })));
  }, []);

  // Fetch Kota when Provinsi changes
  useEffect(() => {
    if (!form.province) { setKotaList([]); return; }
    setLoadingRegion(prev => ({ ...prev, kota: true }));
    setForm(prev => ({ ...prev, city: '', district: '', village: '' }));
    setKotaList([]); setKecamatanList([]); setKelurahanList([]); setKodePos('');
    fetch(`/api/regions?level=kota&provinsi=${encodeURIComponent(form.province)}`)
      .then(r => r.json())
      .then(d => { setKotaList(d.data || []); setLoadingRegion(prev => ({ ...prev, kota: false })); })
      .catch(() => setLoadingRegion(prev => ({ ...prev, kota: false })));
  }, [form.province]);

  // Fetch Kecamatan when Kota changes
  useEffect(() => {
    if (!form.city) { setKecamatanList([]); return; }
    setLoadingRegion(prev => ({ ...prev, kecamatan: true }));
    setForm(prev => ({ ...prev, district: '', village: '' }));
    setKecamatanList([]); setKelurahanList([]); setKodePos('');
    fetch(`/api/regions?level=kecamatan&provinsi=${encodeURIComponent(form.province)}&kota=${encodeURIComponent(form.city)}`)
      .then(r => r.json())
      .then(d => { setKecamatanList(d.data || []); setLoadingRegion(prev => ({ ...prev, kecamatan: false })); })
      .catch(() => setLoadingRegion(prev => ({ ...prev, kecamatan: false })));
  }, [form.city]);

  // Fetch Kelurahan when Kecamatan changes
  useEffect(() => {
    if (!form.district) { setKelurahanList([]); return; }
    setLoadingRegion(prev => ({ ...prev, kelurahan: true }));
    setForm(prev => ({ ...prev, village: '' }));
    setKelurahanList([]); setKodePos('');
    fetch(`/api/regions?level=kelurahan&provinsi=${encodeURIComponent(form.province)}&kota=${encodeURIComponent(form.city)}&kecamatan=${encodeURIComponent(form.district)}`)
      .then(r => r.json())
      .then(d => { setKelurahanList(d.data || []); setLoadingRegion(prev => ({ ...prev, kelurahan: false })); })
      .catch(() => setLoadingRegion(prev => ({ ...prev, kelurahan: false })));
  }, [form.district]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Auto-correction for WhatsApp/Phone
    if (name === 'phone') {
      let cleaned = value.replace(/[^\d+]/g, ''); // Keep digits and + for initial check
      
      if (cleaned.startsWith('+62')) {
        cleaned = cleaned.slice(3);
      } else if (cleaned.startsWith('62')) {
        cleaned = cleaned.slice(2);
      } else if (cleaned.startsWith('0')) {
        cleaned = cleaned.slice(1);
      }
      
      // Final strip of anything non-digit
      finalValue = cleaned.replace(/\D/g, '');
    }

    setForm(prev => ({ ...prev, [name]: sanitizeInput(finalValue) }));

    // Clear error message when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'email' && value.trim()) {
      const emailResult = validateEmail(value);
      if (!emailResult.valid) {
        setErrors(prev => ({ ...prev, email: emailResult.error! }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.keys(validationErrors)[0];
      document.getElementById(`checkout-${firstError}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoadingPayment(true);

    try {
      // 1. Simpan order ke database (Reserve System)
      const checkoutItems = items.map(i => ({
        // FIXME: Frontend masih pakai mock ID (p001, p002). 
        // Sementara di-hardcode ke UUID asli di DB agar Checkout bisa jalan
        product_id: '71ec82dd-dafc-401f-af4c-9ef8a6850c1e',
        warehouse_id: 'baaacf8a-dc87-4174-b322-d473732c78a5', // ID Default Gudang Utama
        qty: i.quantity
      }));

      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutItems })
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || 'Gagal membuat pesanan');
      }

      // 2. Dapatkan Token Pembayaran dari Midtrans
      const paymentRes = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: checkoutData.order_id })
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.error || 'Gagal mendapatkan token pembayaran');
      }

      // 3. Tampilkan Pop-up Snap Midtrans
      if (!(window as any).snap) {
        throw new Error('Sistem pembayaran Midtrans belum siap. Harap tunggu beberapa detik lalu coba lagi.');
      }

      (window as any).snap.pay(paymentData.token, {
        onSuccess: function (result: any) {
          console.log('Payment success:', result);
          setSubmitted(true);
          clearCart();
        },
        onPending: function (result: any) {
          console.log('Payment pending:', result);
          setSubmitted(true);
          clearCart();
        },
        onError: function (result: any) {
          console.error('Payment error:', result);
          alert('Pembayaran gagal! Silakan coba lagi.');
        },
        onClose: function () {
          console.log('User closed the popup without finishing the payment');
          // Jika Anda ingin membatalkan pesanan otomatis saat popup ditutup:
          // fetch('/api/admin/order/cancel', { method: 'POST', body: JSON.stringify({ order_id: checkoutData.order_id }) });
        }
      });

    } catch (error: any) {
      console.error('Checkout flow error:', error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoadingPayment(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ paddingTop: 'calc(var(--navbar-height) + 80px)', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <span style={{ fontSize: '4rem' }}>✅</span>
        <h2 style={{ color: 'var(--color-text-primary)' }}>Pesanan Terkirim!</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 400 }}>Pesanan Anda telah diteruskan via WhatsApp. Tim kami akan segera menghubungi Anda untuk konfirmasi.</p>
        <Link href="/products" className="btn btn-primary">Lanjut Belanja</Link>
      </div>
    );
  }

  return (
    <>
      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + 40px)', paddingBottom: '80px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>🛒</span>
            <p style={{ color: 'var(--color-text-muted)' }}>Keranjang kosong</p>
            <Link href="/products" className="btn btn-outline" style={{ marginTop: '16px' }}>Belanja Sekarang</Link>
          </div>
        ) : (
          <>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-8)' }}>Detail Pembeli</h2>
            <div className={styles.checkoutGrid}>
              {/* Left: Detail Pembeli */}
              <div className={styles.leftCol}>
                <form onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="checkout-name" className={styles.inputLabel}>Nama Lengkap <span className={styles.requiredStar}>*</span></label>
                      <input
                        id="checkout-name"
                        name="name"
                        type="text"
                        placeholder="Contoh: Wisnu Nugroho"
                        required
                        className={`${styles.inputField} ${errors.name ? styles.inputError : ''}`}
                        value={form.name}
                        onChange={handleChange}
                      />
                      {errors.name && <p className={styles.errorMessage}>* {errors.name}</p>}
                    </div>

                    <div className={styles.inputWrapper}>
                      <label htmlFor="checkout-phone" className={styles.inputLabel}>WhatsApp <span className={styles.requiredStar}>*</span></label>
                      <div className={`${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}>
                        <div className={styles.countryCode}>
                          <span role="img" aria-label="ID">🇮🇩</span>
                          <span>+62</span>
                          <FiChevronDown size={14} />
                        </div>
                        <input
                          id="checkout-phone"
                          name="phone"
                          type="tel"
                          placeholder="8131500855"
                          required
                          className={styles.inputField}
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.phone && <p className={styles.errorMessage}>* {errors.phone}</p>}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="checkout-email" className={styles.inputLabel}>Email (Opsional)</label>
                      <input
                        id="checkout-email"
                        name="email"
                        type="email"
                        placeholder="contoh: nugroho@gmail.com"
                        className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.email && <p className={styles.errorMessage}>* {errors.email}</p>}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="checkout-address" className={styles.inputLabel}>Alamat Lengkap <span className={styles.requiredStar}>*</span></label>
                      <textarea
                        id="checkout-address"
                        name="address"
                        placeholder="Contoh: Jl. Ahmad Yani No. B6, RT01/RW02"
                        required
                        className={`${styles.inputField} ${styles.textareaField} ${errors.address ? styles.inputError : ''}`}
                        value={form.address}
                        onChange={handleChange}
                        rows={2}
                      />
                      {errors.address && <p className={styles.errorMessage}>* {errors.address}</p>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <RegionSelect 
                      label="Provinsi"
                      value={form.province}
                      options={provinsiList}
                      onChange={(val) => setForm(prev => ({ ...prev, province: val }))}
                      loading={loadingRegion.provinsi}
                      required
                    />
                    <RegionSelect 
                      label="Kota/Kabupaten"
                      value={form.city}
                      options={kotaList}
                      onChange={(val) => setForm(prev => ({ ...prev, city: val }))}
                      disabled={!form.province}
                      loading={loadingRegion.kota}
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <RegionSelect 
                      label="Kecamatan"
                      value={form.district}
                      options={kecamatanList}
                      onChange={(val) => setForm(prev => ({ ...prev, district: val }))}
                      disabled={!form.city}
                      loading={loadingRegion.kecamatan}
                      required
                    />
                    <RegionSelect 
                      label="Kelurahan/Desa"
                      value={form.village}
                      options={kelurahanList.map(k => k.name)}
                      onChange={(val) => {
                        setForm(prev => ({ ...prev, village: val }));
                        const selected = kelurahanList.find(k => k.name === val);
                        if (selected) setKodePos(selected.kode_pos || '');
                      }}
                      disabled={!form.district}
                      loading={loadingRegion.kelurahan}
                      required
                    />
                  </div>

                  {kodePos && (
                    <div className={styles.formGroup}>
                      <div className={styles.inputWrapper}>
                        <label className={styles.inputLabel}>Kode Pos</label>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={kodePos}
                          readOnly
                          style={{ background: '#f3f4f6', cursor: 'default' }}
                        />
                      </div>
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="checkout-notes" className={styles.inputLabel}>Catatan (Opsional)</label>
                      <textarea
                        id="checkout-notes"
                        name="notes"
                        placeholder="Tulis catatan untuk kurir atau pesanan Anda..."
                        className={`${styles.inputField} ${styles.textareaField}`}
                        value={form.notes}
                        onChange={handleChange}
                        rows={2}
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Right: Order Detail */}
              <div className={styles.rightCol}>
                <div className={styles.orderSummary}>
                  <h2 className={`${styles.sectionTitle} ${styles.summaryTitle}`}>Order Detail</h2>

                  <div className={styles.itemsList}>
                    {items.map(item => (
                      <div key={`${item.id}-${item.color}`} className={styles.summaryItem}>
                        <div className={styles.itemThumb}>
                          <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className={styles.itemDetails}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <p className={styles.itemName}>{item.name} <span className={styles.itemQty}>x {item.quantity}</span></p>
                            <p className={styles.itemPrice}>{formatPrice((item.salePrice || item.price) * item.quantity)}</p>
                          </div>
                          <p className={styles.itemVarian}>Varian: {item.name.includes('Box') ? 'Eksklusif' : 'Tanpa Box'}</p>
                          <p className={styles.itemVarian}>Warna: {item.color}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.summaryDivider} />

                  <div className={styles.summaryRow}>
                    <span className={styles.rowLabel}>Subtotal</span>
                    <span className={styles.rowValue}>{formatPrice(totalPrice)}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span className={styles.rowLabel}>Biaya Pengiriman</span>
                    <span className={styles.rowValue} style={{ color: '#000', fontWeight: 500 }}>Free Ongkir</span>
                  </div>

                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span className={styles.rowLabel} style={{ color: '#000', fontSize: 'var(--text-lg)' }}>Total Harga</span>
                    <span className={styles.totalValue}>{formatPrice(totalPrice)}</span>
                  </div>

                  <button onClick={handleSubmit} className={styles.checkoutBtn} disabled={loadingPayment}>
                    {loadingPayment ? 'Memproses...' : 'Lanjut Pembayaran'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
