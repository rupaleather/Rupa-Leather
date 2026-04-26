'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllTestimonials, getVideoTestimonials } from '@/data/testimonials';
import { useInView } from '@/hooks/useInView';
import styles from '@/styles/components/HomeSections.module.css';

export default function TestimonialSection() {
  const { ref, isInView } = useInView();
  const textTestimonials = getAllTestimonials().filter(t => !t.isVideo).slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % textTestimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, textTestimonials.length]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % textTestimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? textTestimonials.length - 1 : prev - 1));
  };

  const goToTestimonial = (idx: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(idx);
  };

  const activeTestimonial = textTestimonials[currentIndex];

  if (!activeTestimonial) return null;

  return (
    <section className={styles.section} id="testimonials-section" ref={ref} style={{ background: '#f0ece3', padding: '100px 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Section Heading */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)'
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#1a1a1a', 
            fontFamily: 'var(--font-heading)'
          }}>
            Apa Kata Mereka Tentang Rupa?
          </h2>
        </div>

        {/* Simple Testimonial Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '60px 40px',
          maxWidth: '800px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)'
        }}>
          {/* Avatar with red border */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '3px solid #e11d48',
            background: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            {activeTestimonial.name.charAt(0)}
          </div>

          {/* Name */}
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            color: '#1a1a1a', 
            marginBottom: '8px' 
          }}>
            {activeTestimonial.name}
          </h3>

          {/* Stars */}
          <div style={{ color: '#fbbf24', fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '30px' }}>
            {'★'.repeat(5)}
          </div>

          {/* Quote Text */}
          <p style={{
            fontSize: '1.25rem',
            lineHeight: '1.8',
            color: '#4a4a4a',
            fontStyle: 'italic',
            maxWidth: '600px'
          }}>
            "{activeTestimonial.text}"
          </p>
        </div>

        {/* Pagination Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '40px',
          opacity: isInView ? 1 : 0,
          transition: 'opacity 0.6s 0.3s'
        }}>
          <button onClick={prevTestimonial} style={{
            width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontSize: '18px'
          }}>←</button>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {textTestimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => goToTestimonial(idx)}
                style={{
                  width: idx === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentIndex ? '#e11d48' : '#d1d5db',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button onClick={nextTestimonial} style={{
            width: '44px', height: '44px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontSize: '18px'
          }}>→</button>
        </div>

      </div>
    </section>
  );
}
