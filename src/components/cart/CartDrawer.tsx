'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatters';
import styles from '@/styles/components/CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={closeCart} />
      <aside className={`${styles.drawer} ${isOpen ? styles.open : ''}`} id="cart-drawer" role="dialog" aria-label="Shopping Cart">
        <div className={styles.header}>
          <h3>Keranjang ({totalItems})</h3>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">✕</button>
        </div>

        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <span>🛒</span>
              <p>Keranjang masih kosong</p>
              <Link href="/products" className="btn btn-outline btn-sm" onClick={closeCart}>Mulai Belanja</Link>
            </div>
          ) : (
            items.map(item => {
              const key = `${item.id}-${item.color}`;
              return (
                <div key={key} className={styles.cartItem}>
                  <div className={styles.itemImage} style={{ position: 'relative', overflow: 'hidden' }}>
                    <Image src={`/images/products/${item.slug}.png`} alt={item.name} fill sizes="70px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemColor}>{item.color}</p>
                    <p className={styles.itemPrice}>{formatPrice((item.salePrice || item.price) * item.quantity)}</p>
                    <div className={styles.qtyControl}>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeItem(key)} aria-label={`Remove ${item.name}`}>🗑️</button>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
            </div>
            <Link href="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`} onClick={closeCart} id="checkout-btn">
              Checkout Sekarang
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
