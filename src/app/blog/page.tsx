import Link from 'next/link';
import { formatDate } from '@/lib/formatters';
import styles from '@/styles/components/Products.module.css';

const BLOG_POSTS = [
  { slug: 'cara-merawat-tas-kulit', title: 'Tips Merawat Tas Kulit agar Awet dan Tetap Elegan', excerpt: 'Tas kulit day pack adalah pilihan tepat untuk Anda yang aktif namun tetap ingin tampil elegan.', date: '2026-03-15', category: 'Tips' },
  { slug: 'perbedaan-kulit-asli-sintetis', title: 'Perbedaan Kulit Asli dan Sintetis yang Jarang Diketahui', excerpt: 'Tas berbahan kulit selalu menjadi favorit karena tampilan elegan dan daya tahannya.', date: '2026-03-10', category: 'Edukasi' },
  { slug: 'memilih-dompet-kulit', title: 'Hal yang Harus Diperhatikan Saat Membeli Dompet Kulit', excerpt: 'Dompet bukan hanya tempat menyimpan uang, tapi juga bagian dari gaya dan kepribadian.', date: '2026-02-28', category: 'Tips' },
  { slug: 'cara-memilih-tas-kulit', title: 'Cara Memilih Tas Kulit yang Tepat untuk Aktivitas Sehari-Hari', excerpt: 'Tas kulit bukan hanya sekadar pelengkap gaya, tapi juga teman setia dalam berbagai aktivitas.', date: '2026-02-20', category: 'Edukasi' },
];

export default function BlogPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Blog & Artikel</h1>
          <p className={styles.pageDesc}>Tips, edukasi, dan cerita menarik seputar dunia kulit premium</p>
        </div>
      </header>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s', textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <span className="badge">{post.category}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDate(post.date)}</span>
              </div>
              <h3 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)', lineHeight: 1.4 }}>{post.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{post.excerpt}</p>
              <span style={{ display: 'inline-block', marginTop: 'var(--space-4)', color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Baca Selengkapnya →</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
