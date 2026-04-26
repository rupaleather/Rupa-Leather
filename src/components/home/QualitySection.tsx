'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from '@/hooks/useInView';
import styles from '@/styles/components/Quality.module.css';

export default function QualitySection() {
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
    <section className={styles.section} id="quality-section" ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.textContent} style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <span className={styles.label}>Premium Quality</span>
            <h2 className={styles.title}>Kualitas yang<br />Abadi & Elegan</h2>
            <p className={styles.desc}>
              Dibuat untuk bertahan selama puluhan tahun. Material kulit asli pilihan yang semakin indah seiring berjalannya waktu dan penggunaan.
            </p>
          </div>
          <div className={styles.visualCol} style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateX(0)' : 'translateX(50px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
          }}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/halaman/new-pouch-pria.png"
                alt="Kualitas Abadi Rupa Leather"
                width={600}
                height={800}
                className={styles.image}
              />
            </div>
            <div className={styles.secondaryImageWrapper} style={{
              opacity: isInView ? 1 : 0,
              transform: isInView
                ? `translate(-20px, ${20 + parallaxOffset}px)`
                : 'translate(0, 0)',
              transition: isInView ? 'opacity 1s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'all 1s ease-out'
            }}>
              <Image
                src="/images/halaman/tas2.png"
                alt="Koleksi Tas Rupa Leather"
                width={400}
                height={500}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
