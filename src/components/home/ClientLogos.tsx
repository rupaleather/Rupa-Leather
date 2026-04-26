'use client';
import Image from 'next/image';
import styles from '@/styles/components/ClientLogos.module.css';

const CLIENT_LOGOS = [
  { src: '/images/klien/bca.svg', alt: 'BCA', scale: 0.8 },
  { src: '/images/klien/bni.png', alt: 'BNI', scale: 0.8 },
  { src: '/images/klien/bri.png', alt: 'BRI' },
  { src: '/images/klien/kai.png', alt: 'KAI', scale: 1.4 },
  { src: '/images/klien/mandiri.png', alt: 'Mandiri' },
  { src: '/images/klien/morula.png', alt: 'Morula IVF', scale: 1.4 },
];

export default function ClientLogos() {
  // Duplicate array multiple times to ensure seamless infinite scrolling
  const marqueeItems = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className={styles.clientSection}>
      <div className="container">
        <h3 className={styles.sectionTitle}>Mereka Yang Telah Percaya Kami</h3>
      </div>
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((logo, index) => (
            <div key={index} className={styles.logoWrapper}>
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className={styles.clientImg} 
                style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
