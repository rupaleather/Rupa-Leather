'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatters';
import { validateCheckoutForm, sanitizeInput, type CheckoutData } from '@/lib/validators';
import { whatsappUrl } from '@/lib/formatters';
import { SITE_CONFIG } from '@/lib/constants';
import styles from '@/styles/components/Checkout.module.css';
import { FiChevronDown } from 'react-icons/fi';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: sanitizeInput(value) }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstError = Object.keys(validationErrors)[0];
      document.getElementById(`checkout-${firstError}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const orderSummary = items.map(i => `${i.name} (${i.color}) x${i.quantity}`).join('\n');
    const message = `📦 *PESANAN BARU*\n\n*Nama:* ${form.name}\n*Email:* ${form.email}\n*Telepon:* ${form.phone}\n*Alamat:* ${form.address}, ${form.village}, ${form.district}, ${form.city}, ${form.province}\n*Catatan:* ${form.notes || '-'}\n\n*Produk:*\n${orderSummary}\n\n*Total:* ${formatPrice(totalPrice)}`;
    
    window.open(whatsappUrl(SITE_CONFIG.whatsapp, message), '_blank');
    setSubmitted(true);
    clearCart();
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
    <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + 40px)', paddingBottom: '80px' }}>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>🛒</span>
          <p style={{ color: 'var(--color-text-muted)' }}>Keranjang kosong</p>
          <Link href="/products" className="btn btn-outline" style={{ marginTop: '16px' }}>Belanja Sekarang</Link>
        </div>
      ) : (
        <div className={styles.checkoutGrid}>
          {/* Left: Detail Pembeli */}
          <div className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>Detail Pembeli</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.inputWrapper}>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    placeholder="Nama Lengkap *"
                    className={`${styles.inputField} ${errors.name ? styles.inputError : ''}`}
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className={styles.errorMessage}>* {errors.name}</p>}
                </div>

                <div className={styles.inputWrapper}>
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
                      placeholder="Whatsapp/No. Hp *"
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
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    placeholder="Email *"
                    className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className={styles.errorMessage}>* {errors.email}</p>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <textarea
                    id="checkout-address"
                    name="address"
                    placeholder="Alamat Lengkap (No/Rt/Rw/Rumah/Kantor/Kode Pos) *"
                    className={`${styles.inputField} ${styles.textareaField} ${errors.address ? styles.inputError : ''}`}
                    value={form.address}
                    onChange={handleChange}
                  />
                  {errors.address && <p className={styles.errorMessage}>* {errors.address}</p>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputWrapper}>
                  <select
                    id="checkout-province"
                    name="province"
                    className={`${styles.inputField} ${styles.selectField} ${errors.province ? styles.inputError : ''}`}
                    value={form.province}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Provinsi *</option>
                    <option value="Jakarta">DKI Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                  </select>
                  {errors.province && <p className={styles.errorMessage}>* {errors.province}</p>}
                </div>

                <div className={styles.inputWrapper}>
                  <select
                    id="checkout-city"
                    name="city"
                    className={`${styles.inputField} ${styles.selectField} ${errors.city ? styles.inputError : ''}`}
                    value={form.city}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Kota/Kabupaten *</option>
                    {form.province === 'Jakarta' && <option value="Jakarta Selatan">Jakarta Selatan</option>}
                    {form.province === 'Jawa Barat' && <option value="Bandung">Bandung</option>}
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  {errors.city && <p className={styles.errorMessage}>* {errors.city}</p>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputWrapper}>
                  <select
                    id="checkout-district"
                    name="district"
                    className={`${styles.inputField} ${styles.selectField} ${errors.district ? styles.inputError : ''}`}
                    value={form.district}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Kecamatan *</option>
                    <option value="Kecamatan A">Kecamatan A</option>
                  </select>
                  {errors.district && <p className={styles.errorMessage}>* {errors.district}</p>}
                </div>

                <div className={styles.inputWrapper}>
                  <select
                    id="checkout-village"
                    name="village"
                    className={`${styles.inputField} ${styles.selectField} ${errors.village ? styles.inputError : ''}`}
                    value={form.village}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Kelurahan/Desa *</option>
                    <option value="Kelurahan A">Kelurahan A</option>
                  </select>
                  {errors.village && <p className={styles.errorMessage}>* {errors.village}</p>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <textarea
                    id="checkout-notes"
                    name="notes"
                    placeholder="Notes (Optional)"
                    className={`${styles.inputField} ${styles.textareaField}`}
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Detail */}
          <div className={styles.rightCol}>
            <div className={styles.orderSummary}>
              <h2 className={styles.sectionTitle}>Order Detail</h2>
              
              <div className={styles.itemsList}>
                {items.map(item => (
                  <div key={`${item.id}-${item.color}`} className={styles.summaryItem}>
                    <div className={styles.itemThumb}>
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={styles.itemDetails}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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

              <button onClick={handleSubmit} className={styles.checkoutBtn}>
                Lanjut Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
