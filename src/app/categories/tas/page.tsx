'use client';
import { useState, useMemo } from 'react';
import { getAllProducts, sortProducts } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import styles from '@/styles/components/Products.module.css';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

export default function TasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = getAllProducts().filter(p => p.categorySlug.includes('tas'));

    // Category Filter
    if (activeCategory === 'tas-pria') {
      result = result.filter(p => p.categorySlug === 'tas-kulit-pria');
    } else if (activeCategory === 'tas-wanita') {
      result = result.filter(p => p.categorySlug === 'tas-kulit-wanita');
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    return sortProducts(result, sortBy);
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className={styles.categoryPage} style={{ minHeight: '100vh', background: '#fcfcfc' }}>
      {/* Hero Banner */}
      <section className={styles.heroBanner} style={{ 
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/images/hero/hero1.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 'var(--space-20) 0',
        textAlign: 'center',
        color: 'white',
        marginBottom: 'var(--space-8)'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-2)', fontFamily: 'var(--font-heading)', letterSpacing: '2px' }}>KOLEKSI TAS</h1>
          <p style={{ fontSize: 'var(--text-sm)', opacity: 0.8, maxWidth: '500px', margin: '0 auto', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Premium Leather Handcrafted in Indonesia
          </p>
        </div>
      </section>

      <div className="container">
        <div style={{ display: 'flex', gap: 'var(--space-10)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* LEFT SIDEBAR */}
          <aside style={{ flex: '0 0 280px', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            
            {/* Search & Filter Group */}
            <div style={{ background: 'white', padding: 'var(--space-6)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '1px' }}>Cari Produk</label>
                <div style={{ position: 'relative' }}>
                  <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input 
                    type="text" 
                    placeholder="Nama tas atau kategori..." 
                    style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '10px', border: '1px solid #eee', fontSize: 'var(--text-sm)', outline: 'none', transition: 'border-color 0.3s' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '1px' }}>Urutkan</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    style={{ width: '100%', padding: '12px 35px 12px 15px', borderRadius: '10px', border: '1px solid #eee', fontSize: 'var(--text-sm)', outline: 'none', appearance: 'none', cursor: 'pointer', background: 'white' }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Semua Produk</option>
                    <option value="price-desc">Harga Tertinggi</option>
                    <option value="price-asc">Harga Terendah</option>
                    <option value="newest">Terbaru</option>
                    <option value="popular">Paling Populer</option>
                  </select>
                  <FiChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999' }} />
                </div>
              </div>
            </div>

            {/* Category Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <button 
                onClick={() => setActiveCategory('all')}
                style={{ 
                  textAlign: 'left', padding: '16px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600, transition: 'all 0.3s',
                  background: activeCategory === 'all' ? 'var(--color-primary)' : 'white',
                  color: activeCategory === 'all' ? 'white' : 'var(--color-text-primary)',
                  boxShadow: activeCategory === 'all' ? '0 4px 15px rgba(200, 169, 126, 0.3)' : '0 2px 10px rgba(0,0,0,0.02)',
                  border: activeCategory === 'all' ? '1px solid var(--color-primary)' : '1px solid #eee'
                }}
              >
                Semua Koleksi Tas
              </button>
              <button 
                onClick={() => setActiveCategory('tas-pria')}
                style={{ 
                  textAlign: 'left', padding: '16px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600, transition: 'all 0.3s',
                  background: activeCategory === 'tas-pria' ? 'var(--color-primary)' : 'white',
                  color: activeCategory === 'tas-pria' ? 'white' : 'var(--color-text-primary)',
                  boxShadow: activeCategory === 'tas-pria' ? '0 4px 15px rgba(200, 169, 126, 0.3)' : '0 2px 10px rgba(0,0,0,0.02)',
                  border: activeCategory === 'tas-pria' ? '1px solid var(--color-primary)' : '1px solid #eee'
                }}
              >
                Tas Pria
              </button>
              <button 
                onClick={() => setActiveCategory('tas-wanita')}
                style={{ 
                  textAlign: 'left', padding: '16px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600, transition: 'all 0.3s',
                  background: activeCategory === 'tas-wanita' ? 'var(--color-primary)' : 'white',
                  color: activeCategory === 'tas-wanita' ? 'white' : 'var(--color-text-primary)',
                  boxShadow: activeCategory === 'tas-wanita' ? '0 4px 15px rgba(200, 169, 126, 0.3)' : '0 2px 10px rgba(0,0,0,0.02)',
                  border: activeCategory === 'tas-wanita' ? '1px solid var(--color-primary)' : '1px solid #eee'
                }}
              >
                Tas Wanita
              </button>
            </nav>
          </aside>

          {/* RIGHT PRODUCT GRID */}
          <main style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {activeCategory === 'all' ? 'Semua Koleksi' : activeCategory === 'tas-pria' ? 'Koleksi Tas Pria' : 'Koleksi Tas Wanita'}
              </h2>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{filteredProducts.length} Produk</span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={styles.grid} style={{ padding: 0 }}>
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-20) 0', background: 'white', borderRadius: '16px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-4)' }}>🔍</span>
                <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Produk tidak ditemukan</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Coba kata kunci lain atau ubah kategori filter.</p>
              </div>
            )}
          </main>

        </div>
      </div>
      <div style={{ height: 'var(--space-20)' }} />
    </div>
  );
}
