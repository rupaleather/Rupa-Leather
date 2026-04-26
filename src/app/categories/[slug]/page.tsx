'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductsByCategory } from '@/data/products';
import { CATEGORIES } from '@/lib/constants';
import ProductCard from '@/components/products/ProductCard';
import styles from '@/styles/components/Products.module.css';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const category = CATEGORIES.find(c => c.slug === slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    return (
      <div className={styles.noResults} style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-20))' }}>
        <span>📂</span>
        <h3>Kategori tidak ditemukan</h3>
        <Link href="/products" className="btn btn-outline">Lihat Semua Produk</Link>
      </div>
    );
  }

  return (
    <>
      <header className={styles.pageHeader}>
        <div className="container">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{category.icon}</div>
          <h1 className={styles.pageTitle}>{category.name}</h1>
          <p className={styles.pageDesc}>Koleksi {category.name.toLowerCase()} kulit asli premium Kulit Nusantara</p>
        </div>
      </header>

      <div className="container section">
        {products.length > 0 ? (
          <>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>{products.length} produk ditemukan</p>
            <div className={styles.grid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        ) : (
          <div className={styles.noResults}>
            <span>🔍</span>
            <h3>Belum ada produk di kategori ini</h3>
            <p>Segera hadir! Cek kategori lain terlebih dahulu.</p>
            <Link href="/products" className="btn btn-outline" style={{ marginTop: 'var(--space-4)' }}>Lihat Semua Produk</Link>
          </div>
        )}
      </div>
    </>
  );
}
