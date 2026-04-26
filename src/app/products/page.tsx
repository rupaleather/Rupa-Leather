'use client';
import { useState, useMemo } from 'react';
import { getAllProducts, searchProducts, sortProducts } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { SORT_OPTIONS } from '@/lib/constants';
import { sanitizeSearchQuery } from '@/lib/security';
import styles from '@/styles/components/Products.module.css';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    const q = sanitizeSearchQuery(search);
    const base = q ? searchProducts(q) : getAllProducts();
    return sortProducts(base, sort);
  }, [search, sort]);

  return (
    <>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Semua Produk</h1>
          <p className={styles.pageDesc}>Jelajahi koleksi lengkap tas, dompet, dan aksesori kulit asli premium kami</p>
        </div>
      </header>

      <div className="container">
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="product-search-input"
              aria-label="Search products"
            />
          </div>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            id="product-sort-select"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className={styles.resultCount}>{filtered.length} produk ditemukan</span>
        </div>

        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <span>🔍</span>
            <h3>Produk tidak ditemukan</h3>
            <p>Coba kata kunci lain atau jelajahi kategori kami</p>
          </div>
        )}
      </div>
    </>
  );
}
