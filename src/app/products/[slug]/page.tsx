'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/products/ProductCard';
import { formatPrice, calcDiscount, whatsappUrl } from '@/lib/formatters';
import { FiShoppingCart, FiShoppingBag, FiShoppingBag as FiBag, FiShield, FiTruck, FiStar, FiEdit3 } from 'react-icons/fi';
import styles from '@/styles/components/Products.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);
  const { addItem, openCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [includeBox, setIncludeBox] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className={styles.noResults} style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-20))' }}>
        <span>😕</span>
        <h3>Produk tidak ditemukan</h3>
        <Link href="/products" className="btn btn-outline">Kembali ke Produk</Link>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const imageSrc = `/images/products/${product.slug}.png`;
  
  const boxPrice = 90000;
  const currentPrice = product.salePrice || product.price;
  const totalPrice = (currentPrice + (includeBox ? boxPrice : 0)) * quantity;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: `${product.name}${includeBox ? ' (+Box Eksklusif)' : ''}`,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice ? product.salePrice + (includeBox ? boxPrice : 0) : null,
      basePrice: product.price + (includeBox ? boxPrice : 0),
      image: imageSrc,
      color: selectedColor,
      quantity,
    });
    openCart();
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-20)' }}>
      <div className={styles.detailGrid}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage} style={{ position: 'relative' }}>
            <Image src={imageSrc} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} priority />
          </div>
          <div className={styles.thumbs}>
            {[0, 1, 2].map(i => (
              <div key={i} className={`${styles.thumb} ${i === 0 ? styles.active : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
                <Image src={imageSrc} alt={`${product.name} view ${i + 1}`} fill sizes="70px" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.detailInfo}>
          <div className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / <Link href="/products">Produk</Link> / <span>{product.category}</span>
          </div>

          <h1 className={styles.detailTitle}>{product.name}</h1>

          {product.salePrice ? (
            <div className={styles.priceBox}>
              <span className={styles.detailOrigPrice}>{formatPrice(product.price)}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span className={styles.detailSalePrice}>{formatPrice(product.salePrice + (includeBox ? boxPrice : 0))}</span>
                <span className="badge badge-sale" style={{ textTransform: 'none', background: '#e56b6b', border: 'none', color: 'white' }}>
                  -{calcDiscount(product.price, product.salePrice)}%
                </span>
              </div>
              {includeBox && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>*Sudah termasuk Box Eksklusif (+Rp 90rb)</span>}
            </div>
          ) : (
            <div className={styles.detailPriceRow}>
              <span className={styles.detailSalePrice}>{formatPrice(product.price + (includeBox ? boxPrice : 0))}</span>
              {includeBox && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: 'var(--space-3)' }}>*Termasuk Box (+Rp 90rb)</span>}
            </div>
          )}

          <div style={{ marginTop: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spesifikasi</h3>
            <p className={styles.detailDesc}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 0, borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <div className={styles.guarantees} style={{ flex: '0 0 auto', width: '220px' }}>
              <div className={styles.guarantee}><FiShield size={18} /> Garansi Seumur Hidup</div>
              <div className={styles.guarantee}><FiTruck size={18} /> Gratis Ongkir Indonesia</div>
              <div className={styles.guarantee}><FiStar size={18} /> 100% Kulit Asli Premium</div>
              <div className={styles.guarantee}><FiEdit3 size={18} /> Gratis Grafir Nama</div>
            </div>

            <div className={styles.specs} style={{ flex: 1, borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: 'var(--space-4)', display: 'grid', gridTemplateColumns: '150px 1fr' }}>
              <div className={styles.spec}><p className={styles.specLabel}>Kategori</p><p className={styles.specValue}>{product.category}</p></div>
              <div className={styles.spec}><p className={styles.specLabel}>Berat</p><p className={styles.specValue}>{product.weight}</p></div>
            </div>
          </div>

          <div className={styles.actionBox}>
            <div style={{ display: 'flex', gap: 'var(--space-10)', flexWrap: 'wrap' }}>
              <div className={styles.colorPicker} style={{ flex: 1 }}>
                <span className={styles.colorLabel}>Warna: {selectedColor}</span>
                <div className={styles.colorOptions}>
                  {product.colors.map(color => (
                    <button key={color} className={`${styles.colorOption} ${color === selectedColor ? styles.selected : ''}`} onClick={() => setSelectedColor(color)}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.colorPicker} style={{ flex: 1 }}>
                <span className={styles.colorLabel}>Box:</span>
                <div className={styles.colorOptions}>
                  <button className={`${styles.colorOption} ${!includeBox ? styles.selected : ''}`} onClick={() => setIncludeBox(false)}>
                    Tanpa Box
                  </button>
                  <button className={`${styles.colorOption} ${includeBox ? styles.selected : ''}`} onClick={() => setIncludeBox(true)}>
                    +Box Eksklusif
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.addToCartRow} style={{ flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px', borderRadius: '10px', border: '1.5px solid #1a1a1a', background: 'transparent' }}>
                <style jsx>{`
                  input::-webkit-outer-spin-button,
                  input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                  input[type=number] {
                    -moz-appearance: textfield;
                  }
                `}</style>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', borderRadius: '6px', color: '#1a1a1a', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 500, border: 'none' }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: 40,
                    height: 32,
                    textAlign: 'center',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    fontSize: 'var(--text-sm)',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    margin: 0
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', borderRadius: '6px', color: '#1a1a1a', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 500, border: 'none' }}
                >
                  +
                </button>
              </div>
              <button className="btn btn-outline btn-lg" onClick={handleAddToCart} style={{ flex: 1, textTransform: 'none', gap: '8px' }}>
                <FiShoppingCart size={20} /> Masukkan Keranjang
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ flex: 1, textTransform: 'none', gap: '8px' }}>
                <FiBag size={20} /> Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.relatedSection} id="related-products">
          <h2 className={styles.relatedTitle}>Produk Serupa</h2>
          <div className={styles.grid}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}
