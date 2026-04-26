'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInView } from '@/hooks/useInView';
import { SITE_CONFIG } from '@/lib/constants';
import { FiPlay, FiPause } from 'react-icons/fi';
import styles from '@/styles/components/Hero.module.css';

const SLIDES = [
  { 
    type: 'text',
    label: 'Authentic Leather Craftsmanship',
    title: <>Kerajinan Kulit<br /><span>Premium</span> Indonesia</>,
    desc: 'Setiap produk kami adalah karya seni — dibuat oleh tangan berbakat dengan kulit asli pilihan Menghasilkan sebuah karya seni untuk Anda yang menghargai kualitas, karakter, dan keabadian'
  },
  { 
    type: 'image',
    label: 'Timeless Quality',
    images: ['/images/hero/hero1.png', '/images/hero/hero2.png']
  },
  { 
    type: 'image',
    label: 'Handmade Excellence',
    images: ['/images/hero/hero3.png', '/images/hero/hero4.png']
  }
];

export default function HeroSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(nextSlide, 7000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  return (
    <section className={styles.hero} id="hero-section">
      <div className={styles.heroBg} />
      
      {/* Decorative Ornaments */}
      <div className={styles.ornamentBL} aria-hidden="true" />
      <div className={styles.ornamentTR} aria-hidden="true" />

      <div className="container" ref={ref}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent} style={{ 
            opacity: isInView ? 1 : 0, 
            transform: isInView ? 'translateY(0)' : 'translateY(30px)', 
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)', 
            textAlign: 'center', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 10,
            width: '100%',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            
            {SLIDES[currentSlide].type === 'image' ? (
              <div key={`slide-${currentSlide}`} className={`${styles.heroImagesWrapper} ${styles.slideAnimate}`} style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                marginBottom: '0',
                width: '100%',
                maxWidth: '900px'
              }}>
                <div style={{ flex: 1, position: 'relative', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                  <Image 
                    src={SLIDES[currentSlide].images![0]} 
                    alt="Rupa Leather Craftsmanship Left" 
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                <div style={{ flex: 1, position: 'relative', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                  <Image 
                    src={SLIDES[currentSlide].images![1]} 
                    alt="Rupa Leather Craftsmanship Right" 
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
              </div>
            ) : (
              <div key={`slide-${currentSlide}`} className={styles.slideAnimate}>
                <div className={styles.slideContent}>
                  <span className={styles.heroLabel}>{SLIDES[currentSlide].label}</span>
                  <h1 className={styles.heroTitle}>
                    {SLIDES[currentSlide].title}
                  </h1>
                  <p className={styles.heroDesc}>
                    {SLIDES[currentSlide].desc}
                  </p>
                </div>
                <div className={styles.heroCtas}>
                  <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" id="hero-contact-btn">Hubungi Kami</a>
                  <Link href="/about" className="btn btn-outline btn-lg" id="hero-about-btn">Cerita Kami</Link>
                </div>
              </div>
            )}

            {/* Slider Controls */}
            <div className={styles.sliderControls} style={{ marginTop: '40px' }}>
              <div className={styles.pagination}>
                {SLIDES.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                    onClick={() => {
                      setCurrentSlide(index);
                      setIsPlaying(false);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === currentSlide && <div className={styles.progress} />}
                  </button>
                ))}
              </div>
              <button 
                className={styles.playPauseBtn}
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause slider' : 'Play slider'}
              >
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
