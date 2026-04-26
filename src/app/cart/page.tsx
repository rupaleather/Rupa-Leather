'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatters';
import styles from '@/styles/components/Products.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Keranjang Belanja</h1>
          <p className={styles.pageDesc}>{totalItems} item dalam keranjang Anda</p>
        </div>
      </header>

      <div className="container section">
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
            <span style={{ fontSize: '5rem', display: 'block', marginBottom: 'var(--space-4)' }}>🛒</span>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Keranjang Masih Kosong</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Temukan produk kulit premium favorit Anda</p>
            <Link href="/products" className="btn btn-primary btn-lg">Mulai Belanja</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-10)', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {items.map(item => {
                const key = `${item.id}-${item.color}`;
                return (
                  <div key={key} style={{ display: 'flex', gap: 'var(--space-6)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
                    <div style={{ width: 100, height: 100, borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <Image src={`/images/products/${item.slug}.png`} alt={item.name} fill sizes="100px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/products/${item.slug}`} style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: 'var(--text-lg)', fontFamily: 'var(--font-heading)' }}>{item.name}</Link>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{item.color}</p>
                      <p style={{ color: 'var(--color-primary)', fontWeight: 600, marginTop: 'var(--space-2)' }}>{formatPrice((item.salePrice || item.price) * item.quantity)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <button onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '1rem' }}>−</button>
                        <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '1rem' }}>+</button>
                      </div>
                      <button onClick={() => removeItem(key)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.2rem', transition: 'color 0.15s' }} aria-label="Remove">🗑️</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 'calc(var(--navbar-height) + var(--space-6))' }}>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-lg)' }}>Ringkasan Pesanan</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal ({totalItems} item)</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{formatPrice(totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Ongkir</span>
                <span style={{ color: 'var(--color-success)' }}>GRATIS</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Total</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-heading)' }}>{formatPrice(totalPrice)}</span>
              </div>
              <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-6)' }} id="cart-checkout-btn">
                Lanjut ke Checkout
              </Link>
              <Link href="/products" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                ← Lanjut Belanja
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
