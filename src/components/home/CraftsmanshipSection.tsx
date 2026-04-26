'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from '@/hooks/useInView';
import styles from '@/styles/components/Craftsmanship.module.css';

export default function CraftsmanshipSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = ref.current 
    ? (scrollY - ref.current.offsetTop) * -0.25
    : 0;

  return (
    <section className={styles.section} id="craftsmanship-section" ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <Image 
                src="/images/halaman/pouch-wanita.png" 
                alt="Sentuhan Tangan Ahli Pengrajin Rupa Leather" 
                width={700} 
                height={900} 
                className={styles.image}
                priority
              />
            </div>
            <div className={styles.secondaryImageWrapper} style={{ 
              opacity: isInView ? 1 : 0, 
              transform: isInView 
                ? `translate(20px, ${-250 + parallaxOffset}px)` 
                : 'translate(0, 0)', 
              transition: isInView ? 'opacity 1s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'all 1s ease-out'
            }}>
              <Image 
                src="/images/halaman/tas1.png" 
                alt="Koleksi Tas Rupa Leather" 
                width={400} 
                height={500} 
                className={styles.image}
              />
            </div>
          </div>
          
          <div className={styles.textContent} style={{ 
            opacity: isInView ? 1 : 0, 
            transform: isInView ? 'translateX(0)' : 'translateX(50px)', 
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' 
          }}>
            <span className={styles.label}>Artisan Craft</span>
            <h2 className={styles.title}>Sentuhan Tangan Ahli Pengrajin</h2>
            <p className={styles.desc}>
              Detail presisi di setiap jahitan. Dedikasi penuh para pengrajin lokal untuk menghadirkan produk kelas dunia langsung ke tangan Anda.
            </p>
            <div className={styles.signature}>
              <p className={styles.sigText}>Rupa Leather Artisan</p>
              <div className={styles.line} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
