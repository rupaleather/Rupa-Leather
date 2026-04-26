import { getAllTestimonials, getVideoTestimonials } from '@/data/testimonials';
import styles from '@/styles/components/HomeSections.module.css';
import pStyles from '@/styles/components/Products.module.css';

export default function TestimonialsPage() {
  const all = getAllTestimonials();
  const videos = getVideoTestimonials();
  const texts = all.filter(t => !t.isVideo);

  return (
    <>
      <header className={pStyles.pageHeader}>
        <div className="container">
          <h1 className={pStyles.pageTitle}>Testimoni Pelanggan</h1>
          <p className={pStyles.pageDesc}>Kata mereka yang telah merasakan kualitas produk Kulit Nusantara</p>
        </div>
      </header>

      <div className="container section">
        {videos.length > 0 && (
          <div style={{ marginBottom: 'var(--space-16)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)', color: 'var(--color-text-primary)', fontSize: 'var(--text-2xl)' }}>🎬 Video Testimoni</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
              {videos.map(v => (
                <div key={v.id} className={styles.videoCard}>
                  <div className={styles.videoPlaceholder}>
                    <div className={styles.playBtn}>▶</div>
                    <span className={styles.videoLabel}>{v.name} · {v.location}</span>
                    <span className={styles.videoLabel}>{v.productBought}</span>
                    <span className={styles.videoLabel}>50 detik</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-8)', color: 'var(--color-text-primary)', fontSize: 'var(--text-2xl)' }}>💬 Ulasan Tertulis</h2>
        <div className={styles.testimonialGrid}>
          {texts.map(t => (
            <div key={t.id} className={styles.testimonialCard}>
              <div className={styles.tStars}>{'★'.repeat(t.rating)}</div>
              <p className={styles.tText}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.tAuthor}>
                <div className={styles.tAvatar}>{t.name.charAt(0)}</div>
                <div>
                  <p className={styles.tName}>{t.name}</p>
                  <p className={styles.tMeta}>{t.location} · {t.productBought}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
