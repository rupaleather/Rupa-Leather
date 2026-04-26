'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from '@/hooks/useInView';
import styles from '@/styles/components/LifestyleShowcase.module.css';

export default function LifestyleShowcase() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax offset (e.g., 10% of scroll position)
  const parallaxOffset = scrollY * 0.15;

  return (
    <section className={styles.section} id="lifestyle-showcase" ref={ref}>
      <div className="container">
        <div className={styles.imageGrid}>
          <div className={styles.imageItem} style={{ 
            opacity: isInView ? 1 : 0, 
            transform: isInView ? 'translateY(-155px)' : 'translateY(-105px)', 
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' 
          }}>
            <Image src="/images/halaman/cover-tangan.png" alt="Showcase 1" width={600} height={450} className={styles.image} />
          </div>
          <div className={styles.imageItem} style={{ 
            opacity: isInView ? 1 : 0, 
            transform: isInView ? 'translate(80px, -80px)' : 'translate(80px, -40px)', 
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' 
          }}>
            <Image src="/images/halaman/dompet-tangan.png" alt="Showcase 2" width={600} height={450} className={styles.image} />
          </div>
        </div>

        <div className={styles.textContent} style={{ 
          opacity: isInView ? 1 : 0, 
          transform: isInView ? 'translateY(-150px)' : 'translateY(-130px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s' 
        }}>
          <h2 className={styles.title}>Jatuh cinta pada Rupa pertama.</h2>
          <p className={styles.desc}>
            Memperkenalkan koleksi otentik Rupa Leather, produk lokal dengan kualitas dunia.<br />
            Dibuat dengan tangan ahli untuk menemani setiap langkah perjalanan Anda.
          </p>

        </div>

        <div className={styles.imageGrid}>
          <div className={styles.imageItem} style={{ 
            opacity: isInView ? 1 : 0, 
            transform: isInView 
              ? `translate(-120px, ${70 - parallaxOffset}px)` 
              : 'translate(-120px, 110px)', 
            transition: isInView ? 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s' 
          }}>
            <Image src="/images/halaman/pocuh-tangan.png" alt="Showcase 3" width={500} height={375} className={styles.image} />
          </div>
          <div className={styles.imageItem} style={{ 
            opacity: isInView ? 1 : 0, 
            transform: isInView ? 'translateY(-197px)' : 'translateY(-157px)', 
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s' 
          }}>
            <Image src="/images/halaman/cardholder-tangan.png" alt="Showcase 4" width={400} height={300} className={styles.image} />
          </div>
        </div>
      </div>
    </section>
  );
}
