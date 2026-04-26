'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import styles from '@/styles/components/ProductCard.module.css';

const LIMITED_PRODUCTS = [
  {
    id: 'ltd-001',
    name: 'Majapahit Legacy Briefcase',
    price: 8500000,
    image: '/images/products/zeus-1.jpg',
    stock: 5,
    description: 'Dibuat khusus dengan ukiran tembaga asli bertema Majapahit pada bagian buckle. Hanya diproduksi 5 unit di dunia.',
  },
  {
    id: 'ltd-002',
    name: 'Sultanate Midnight Clutch',
    price: 4200000,
    image: '/images/products/athena-1.jpg',
    stock: 12,
    description: 'Kulit domba hitam pekat dengan jahitan benang emas 24k. Koleksi eksklusif untuk perayaan 15 tahun Rupa Leather.',
  },
  {
    id: 'ltd-003',
    name: 'Borobudur Zenith Backpack',
    price: 6750000,
    image: '/images/products/hercules-1.jpg',
    stock: 3,
    description: 'Backpack premium dengan aksen relief Borobudur yang diukir tangan pada panel kulit depan. Masterpiece pengrajin kami.',
  }
];

export default function LimitedEditionPage() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#f5f0e8', minHeight: '100vh', paddingTop: '100px' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 0', textAlign: 'center', borderBottom: '1px solid rgba(200, 169, 126, 0.2)' }}>
        <div className="container">
          <span style={{ color: '#c8a97e', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem', fontWeight: 600 }}>Exclusive Collection</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', margin: '20px 0', fontFamily: 'var(--font-heading)' }}>Limited Edition 🔥</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: '#a8a29e', lineHeight: 1.6 }}>
            Koleksi mahakarya yang diproduksi dalam jumlah sangat terbatas. Setiap unit memiliki nomor seri unik dan sertifikat keaslian fisik. 
            Sekali habis, tidak akan pernah diproduksi kembali.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ padding: '100px 0' }}>
        <div className="container" ref={ref}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            {LIMITED_PRODUCTS.map((product, index) => (
              <div 
                key={product.id} 
                style={{ 
                  backgroundColor: '#1a1a1a', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(200, 169, 126, 0.1)',
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                  <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#c8a97e', color: '#0d0d0d', padding: '6px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Sisa {product.stock} Unit
                  </div>
                </div>
                <div style={{ padding: '30px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>{product.name}</h3>
                  <p style={{ color: '#a8a29e', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>{product.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#c8a97e' }}>Rp {product.price.toLocaleString('id-ID')}</span>
                    <button className="btn btn-primary btn-sm">Dapatkan Sekarang</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section style={{ padding: '100px 0', backgroundColor: '#141414', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px', border: '1px solid rgba(200, 169, 126, 0.3)', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(200, 169, 126, 0.05) 0%, transparent 100%)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>Jangan Sampai Ketinggalan</h2>
            <p style={{ color: '#a8a29e', marginBottom: '30px' }}>Dapatkan notifikasi prioritas untuk koleksi Limited Edition berikutnya langsung ke email Anda.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="email" placeholder="Email Anda" style={{ flex: 1, backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 20px', color: '#fff' }} />
              <button className="btn btn-primary">Gabung Waitlist</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
