'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, sortProducts } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import styles from '@/styles/components/Products.module.css';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

/* ============================================================
   CATEGORY CONFIG — Peta semua slug ke label, subkategori, dll.
   ============================================================ */
interface SubCategory {
  id: string;
  label: string;
  slugs: string[]; // categorySlug yang cocok di products.ts
}

interface CategoryConfig {
  title: string;
  description: string;
  hero: string;
  allLabel: string;
  subCategories: SubCategory[];
  // Slug produk yang di-include saat "Semua" dipilih
  rootSlugs: string[];
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  tas: {
    title: 'KOLEKSI TAS',
    description: 'Premium Leather Handcrafted in Indonesia',
    hero: '/images/hero/hero1.png',
    allLabel: 'Semua Koleksi Tas',
    rootSlugs: ['tas-kulit-pria', 'tas-kulit-wanita'],
    subCategories: [
      { id: 'tas-pria', label: 'Tas Pria', slugs: ['tas-kulit-pria'] },
      { id: 'tas-wanita', label: 'Tas Wanita', slugs: ['tas-kulit-wanita'] },
    ],
  },
  dompet: {
    title: 'KOLEKSI DOMPET',
    description: 'Dompet Kulit Asli Premium — Handcrafted with Care',
    hero: '/images/hero/hero2.png',
    allLabel: 'Semua Koleksi Dompet',
    rootSlugs: ['dompet-kulit-pria', 'dompet-kulit-wanita'],
    subCategories: [
      { id: 'dompet-pria', label: 'Dompet Pria', slugs: ['dompet-kulit-pria'] },
      { id: 'dompet-wanita', label: 'Dompet Wanita', slugs: ['dompet-kulit-wanita'] },
    ],
  },
  'clutch-pouch': {
    title: 'CLUTCH & POUCH',
    description: 'Elegan dan Praktis — Kulit Asli Pilihan',
    hero: '/images/hero/hero1.png',
    allLabel: 'Semua Clutch & Pouch',
    rootSlugs: ['clutch-pouch'],
    subCategories: [],
  },
  'card-holder': {
    title: 'CARD HOLDER & ID',
    description: 'Minimalis, Tipis, dan Berkelas',
    hero: '/images/hero/hero2.png',
    allLabel: 'Semua Card Holder',
    rootSlugs: ['card-holder'],
    subCategories: [],
  },
  'ikat-pinggang': {
    title: 'IKAT PINGGANG',
    description: 'Aksesori Kulit Terbaik untuk Penampilan Sempurna',
    hero: '/images/hero/hero1.png',
    allLabel: 'Semua Ikat Pinggang',
    rootSlugs: ['ikat-pinggang'],
    subCategories: [],
  },
  'tas-selempang': {
    title: 'TAS SELEMPANG',
    description: 'Gaya Urban yang Fleksibel dan Stylish',
    hero: '/images/hero/hero2.png',
    allLabel: 'Semua Tas Selempang',
    rootSlugs: ['tas-selempang'],
    subCategories: [],
  },
  'totebag-kulit': {
    title: 'TOTEBAG KULIT',
    description: 'Kapasitas Besar, Gaya Tak Tertandingi',
    hero: '/images/hero/hero1.png',
    allLabel: 'Semua Totebag',
    rootSlugs: ['totebag-kulit'],
    subCategories: [],
  },
  'backpack-kulit': {
    title: 'BACKPACK LEATHER',
    description: 'Ransel Kulit Berkelas untuk Profesional Modern',
    hero: '/images/hero/hero2.png',
    allLabel: 'Semua Backpack',
    rootSlugs: ['backpack-kulit'],
    subCategories: [],
  },
  'waist-bag': {
    title: 'WAIST BAG',
    description: 'Versatile dan Praktis — Gaya Aktif Setiap Hari',
    hero: '/images/hero/hero1.png',
    allLabel: 'Semua Waist Bag',
    rootSlugs: ['waist-bag'],
    subCategories: [],
  },
  'aksesori-kulit': {
    title: 'AKSESORI KULIT',
    description: 'Sentuhan Akhir yang Menyempurnakan Penampilan Anda',
    hero: '/images/hero/hero2.png',
    allLabel: 'Semua Aksesori',
    rootSlugs: ['aksesori-kulit'],
    subCategories: [],
  },
};

/* ============================================================
   FALLBACK — slug tidak dikenali
   ============================================================ */
function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: 'calc(var(--navbar-height) + 80px) 0 80px' }}>
      <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>📂</span>
      <h3 style={{ marginBottom: '8px' }}>Kategori tidak ditemukan</h3>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
        Coba lihat kategori lain yang tersedia.
      </p>
      <Link href="/products" className="btn btn-outline">Lihat Semua Produk</Link>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const config = CATEGORY_CONFIG[slug];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredProducts = useMemo(() => {
    if (!config) return [];

    // Tentukan slug produk yang aktif
    let allowedSlugs: string[];
    if (activeSubCategory === 'all') {
      allowedSlugs = config.rootSlugs;
    } else {
      const sub = config.subCategories.find(s => s.id === activeSubCategory);
      allowedSlugs = sub ? sub.slugs : config.rootSlugs;
    }

    let result = getAllProducts().filter(p => allowedSlugs.includes(p.categorySlug));

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }

    return sortProducts(result, sortBy);
  }, [config, activeSubCategory, searchQuery, sortBy]);

  if (!config) return <NotFound />;

  // Judul grid berdasarkan subkategori aktif
  const gridTitle =
    activeSubCategory === 'all'
      ? config.allLabel
      : config.subCategories.find(s => s.id === activeSubCategory)?.label ?? config.allLabel;

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfc' }}>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("${config.hero}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 'var(--space-20) 0',
          textAlign: 'center',
          color: 'white',
          marginBottom: 'var(--space-8)',
          marginTop: 'var(--navbar-height)',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-2)', fontFamily: 'var(--font-heading)', letterSpacing: '2px' }}>
            {config.title}
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', opacity: 0.8, maxWidth: '500px', margin: '0 auto', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {config.description}
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: 'var(--space-20)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-10)', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── LEFT SIDEBAR ── */}
          <aside style={{ flex: '0 0 280px', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

            {/* Search & Sort Card */}
            <div style={{ background: 'white', padding: 'var(--space-6)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>

              {/* Search */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '1px' }}>
                  Cari Produk
                </label>
                <div style={{ position: 'relative' }}>
                  <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input
                    type="text"
                    placeholder="Nama produk atau kata kunci..."
                    style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '10px', border: '1px solid #eee', fontSize: 'var(--text-sm)', outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '1px' }}>
                  Urutkan
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    style={{ width: '100%', padding: '12px 35px 12px 15px', borderRadius: '10px', border: '1px solid #eee', fontSize: 'var(--text-sm)', outline: 'none', appearance: 'none', cursor: 'pointer', background: 'white' }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Terbaru</option>
                    <option value="price-asc">Harga Terendah</option>
                    <option value="price-desc">Harga Tertinggi</option>
                    <option value="popular">Paling Populer</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                  <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999' }} />
                </div>
              </div>
            </div>

            {/* Sub-Category Navigation — hanya muncul jika ada subkategori */}
            {config.subCategories.length > 0 && (
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {/* "Semua" button */}
                <button
                  onClick={() => setActiveSubCategory('all')}
                  style={{
                    textAlign: 'left', padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                    fontSize: 'var(--text-sm)', fontWeight: 600, transition: 'all 0.3s',
                    background: activeSubCategory === 'all' ? 'var(--color-primary)' : 'white',
                    color: activeSubCategory === 'all' ? 'white' : 'var(--color-text-primary)',
                    boxShadow: activeSubCategory === 'all' ? '0 4px 15px rgba(200,169,126,0.3)' : '0 2px 10px rgba(0,0,0,0.02)',
                    border: activeSubCategory === 'all' ? '1px solid var(--color-primary)' : '1px solid #eee',
                  }}
                >
                  {config.allLabel}
                </button>

                {config.subCategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubCategory(sub.id)}
                    style={{
                      textAlign: 'left', padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                      fontSize: 'var(--text-sm)', fontWeight: 600, transition: 'all 0.3s',
                      background: activeSubCategory === sub.id ? 'var(--color-primary)' : 'white',
                      color: activeSubCategory === sub.id ? 'white' : 'var(--color-text-primary)',
                      boxShadow: activeSubCategory === sub.id ? '0 4px 15px rgba(200,169,126,0.3)' : '0 2px 10px rgba(0,0,0,0.02)',
                      border: activeSubCategory === sub.id ? '1px solid var(--color-primary)' : '1px solid #eee',
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </nav>
            )}
          </aside>

          {/* ── RIGHT PRODUCT GRID ── */}
          <main style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {gridTitle}
              </h2>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {filteredProducts.length} Produk
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={styles.grid} style={{ padding: 0 }}>
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-20) 0', background: 'white', borderRadius: '16px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-4)' }}>🔍</span>
                <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                  {searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk di kategori ini'}
                </h3>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {searchQuery ? 'Coba kata kunci lain atau ubah filter.' : 'Segera hadir! Cek kategori lain terlebih dahulu.'}
                </p>
                {!searchQuery && (
                  <Link href="/products" className="btn btn-outline" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
                    Lihat Semua Produk
                  </Link>
                )}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
