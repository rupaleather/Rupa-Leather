'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/components/Products.module.css';

const BLOG_CONTENT: Record<string, { title: string; date: string; category: string; content: string[] }> = {
  'cara-merawat-tas-kulit': {
    title: 'Tips Merawat Tas Kulit agar Awet dan Tetap Elegan',
    date: '15 Maret 2026',
    category: 'Tips',
    content: [
      'Tas kulit day pack adalah pilihan yang tepat untuk Anda yang aktif namun tetap ingin tampil elegan dalam keseharian.',
      'Hal pertama yang perlu diperhatikan adalah menjaga tas kulit dari air. Air bisa membuat kulit menjadi kaku, berubah warna, bahkan berjamur. Jika tas terkena air, segera keringkan dengan lap kering.',
      'Hindari menjemur tas kulit di bawah sinar matahari langsung. Sinar UV dapat membuat warna tas memudar dan tekstur kulit menjadi kering atau retak.',
      'Gunakan kain lembut yang sedikit dibasahi untuk mengelap permukaan tas. Hindari sabun keras atau alkohol karena bisa merusak warna alami kulit.',
      'Sekali-kali, gunakan leather conditioner untuk menjaga kelembapan dan kilau alami tas.',
    ],
  },
  'perbedaan-kulit-asli-sintetis': {
    title: 'Perbedaan Kulit Asli dan Sintetis yang Jarang Diketahui',
    date: '10 Maret 2026',
    category: 'Edukasi',
    content: [
      'Tas berbahan kulit selalu menjadi favorit karena tampilan elegan dan daya tahannya.',
      'Kulit asli memiliki pola serat yang tidak seragam dan terasa berpori saat disentuh. Kulit sintetis cenderung halus dengan pola terlalu sempurna.',
      'Kulit asli memiliki aroma khas alami yang hangat. Berbeda dengan kulit sintetis yang berbau bahan kimia.',
      'Kulit asli akan mengembangkan "patina" — perubahan warna yang justru menambah karakter dan keunikannya.',
      'Dari segi ketahanan, kulit asli bisa bertahan puluhan tahun. Ini membuatnya punya nilai investasi yang tinggi.',
    ],
  },
  'memilih-dompet-kulit': {
    title: 'Hal yang Harus Diperhatikan Saat Membeli Dompet Kulit',
    date: '28 Februari 2026',
    category: 'Tips',
    content: [
      'Dompet bukan hanya tempat menyimpan uang, tapi juga bagian dari gaya dan kepribadian.',
      'Perhatikan jenis kulit yang digunakan. Kulit asli memiliki tekstur yang lebih alami dan tidak seragam.',
      'Jahitan yang rapi dan tidak mudah lepas menandakan kualitas produksi yang baik.',
      'Pilih ukuran yang sesuai kebiasaan Anda. Jika banyak kartu, pilih dompet dengan banyak slot.',
      'Warna netral seperti cokelat tua atau hitam selalu menjadi pilihan aman dan profesional.',
    ],
  },
  'cara-memilih-tas-kulit': {
    title: 'Cara Memilih Tas Kulit yang Tepat untuk Aktivitas Sehari-Hari',
    date: '20 Februari 2026',
    category: 'Edukasi',
    content: [
      'Tas kulit bukan hanya pelengkap gaya, tapi juga teman setia dalam berbagai aktivitas harian.',
      'Pertimbangkan ukuran dan model tas. Jika sering bawa laptop, pilih tas ukuran medium hingga besar.',
      'Kulit asli memiliki tekstur unik, aroma khas, dan semakin lama semakin terlihat karakteristik alaminya.',
      'Perhatikan detail jahitan, lining dalam, serta aksesoris. Kualitas detail menentukan umur panjang tas.',
      'Tas kulit adalah investasi yang meningkatkan kepercayaan diri Anda.',
    ],
  },
};

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = BLOG_CONTENT[slug];

  if (!post) {
    return (
      <div className={styles.noResults} style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-20))' }}>
        <span>📝</span>
        <h3>Artikel tidak ditemukan</h3>
        <Link href="/blog" className="btn btn-outline">Kembali ke Blog</Link>
      </div>
    );
  }

  return (
    <>
      <header className={styles.pageHeader}>
        <div className="container">
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <span className="badge">{post.category}</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{post.date}</span>
          </div>
          <h1 className={styles.pageTitle} style={{ fontSize: 'var(--text-3xl)', maxWidth: '700px', margin: '0 auto' }}>{post.title}</h1>
        </div>
      </header>

      <article className="container section" style={{ maxWidth: '750px' }}>
        {post.content.map((para, i) => (
          <p key={i} style={{ marginBottom: 'var(--space-6)', lineHeight: 1.9, color: 'var(--color-text-secondary)' }}>{para}</p>
        ))}

        <div style={{ marginTop: 'var(--space-12)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', background: 'rgba(var(--color-primary-rgb), 0.08)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Tertarik dengan produk kami?</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>Jelajahi koleksi tas dan dompet kulit asli premium</p>
          <Link href="/products" className="btn btn-primary">Lihat Koleksi</Link>
        </div>

        <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
          <Link href="/blog" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>← Kembali ke Blog</Link>
        </div>
      </article>
    </>
  );
}
