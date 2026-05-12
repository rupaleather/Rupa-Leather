'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/constants';
import styles from '@/styles/components/HomeSections.module.css';

const CATEGORY_IMAGES: Record<string, string> = {
  'tas-kulit-pria': '/images/products/zeus-briefcase.png',
  'tas-kulit-wanita': '/images/products/athena-sling-bag.png',
  'dompet-kulit-pria': '/images/products/maximus-wallet.png',
  'dompet-kulit-wanita': '/images/products/sophia-long-wallet.png',
  'tas-selempang': '/images/products/hera-crossbody.png',
  'clutch-pouch': '/images/products/venus-clutch.png',
  'ikat-pinggang': '/images/products/apollo-belt.png',
  'aksesori-kulit': '/images/products/atlas-pouch-tan.png',
  'backpack-kulit': '/images/products/hercules-backpack.png',
  'waist-bag': '/images/products/ares-waist-bag.png',
  'card-holder': '/images/products/minerva-card-holder.png',
  'totebag-kulit': '/images/products/diana-tote.png',
};

export default function CategoryGrid() {
  const totalItems = CATEGORIES.length;
  const [currentIndex, setCurrentIndex] = useState<number>(totalItems);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const itemsToShow = 4;

  const displayItems = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext]);

  useEffect(() => {
    if (currentIndex >= totalItems * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalItems);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalItems]);

  const getTranslateX = () => {
    return -(currentIndex * (100 / itemsToShow));
  };

  return (
    <section className={styles.categorySliderSection} id="categories-section">
      <div className={styles.sliderContainer}>
        <div
          className={styles.sliderTrack}
          style={{
            transform: `translate3d(${getTranslateX()}%, 0, 0)`,
            transition: isTransitioning ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            display: 'flex',
            width: 'max-content'
          }}
        >
          {displayItems.map((cat, index) => (
            <Link
              key={`${cat.id}-${index}`}
              href={`/categories/${cat.slug}`}
              className={styles.sliderCard}
            >
              <div className={styles.cardImageInner}>
                <Image
                  src={CATEGORY_IMAGES[cat.slug] || '/images/products/atlas-pouch-tan.png'}
                  alt={cat.name}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
                <div className={styles.cardOverlay} />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}