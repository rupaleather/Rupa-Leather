'use client';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { whatsappUrl } from '@/lib/formatters';
import { useInView } from '@/hooks/useInView';
import styles from '@/styles/components/HomeSections.module.css';

export default function CTABanner() {
  const { ref, isInView } = useInView();

  return (
    <section className={styles.section} id="cta-section" ref={ref} style={{ background: '#fbfbfb', padding: '0' }}>
        <div className={styles.ctaBanner} style={{ 
          opacity: isInView ? 1 : 0, 
          transform: isInView ? 'scale(1)' : 'scale(0.97)', 
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          borderRadius: '0',
          borderLeft: 'none',
          borderRight: 'none',
          padding: '100px 20px'
        }}>
          <h2>Siap Menemukan Kulit Terbaik Anda?</h2>
          <p>Hubungi kami sekarang untuk konsultasi gratis, pesanan khusus, atau corporate gift. Kami siap melayani Anda.</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/products" className="btn btn-primary btn-lg" id="cta-shop-btn">Belanja Sekarang</Link>
            <a href={whatsappUrl(SITE_CONFIG.whatsapp, 'Halo! Saya tertarik dengan produk Rupa Leather.')} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg" id="cta-whatsapp-btn">
              💬 Konsultasi Gratis
            </a>
          </div>
        </div>
    </section>
  );
}
