'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useInView } from '@/hooks/useInView';
import styles from '@/styles/components/BlogPreview.module.css';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Cara Merawat Tas Kulit Agar Awet Berpuluh Tahun',
    excerpt: 'Tips praktis menjaga kelembaban dan kebersihan tas kulit asli Anda agar tetap seperti baru.',
    image: '/images/halaman/tas1.png',
    date: '24 April 2024',
    slug: 'cara-merawat-tas-kulit'
  },
  {
    id: 2,
    title: 'Mengenal Jenis Kulit Asli di Rupa Leather',
    excerpt: 'Bedah tuntas perbedaan Full Grain, Top Grain, dan Suede yang kami gunakan untuk produk terbaik.',
    image: '/images/halaman/tas2.png',
    date: '20 April 2024',
    slug: 'mengenal-jenis-kulit-asli'
  },
  {
    id: 3,
    title: 'Tren Aksesori Kulit Minimalis 2024',
    excerpt: 'Mengapa gaya minimalis semakin digemari dan bagaimana memilih aksesori yang tepat.',
    image: '/images/halaman/pouch-wanita.png',
    date: '15 April 2024',
    slug: 'tren-aksesori-kulit-2024'
  }
];

export default function BlogPreview() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section className={styles.section} id="blog-preview" ref={ref}>
      <div className="container">
        <div className={styles.header} style={{ 
          opacity: isInView ? 1 : 0, 
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <h2 className={styles.title}>Cerita & Inspirasi</h2>
          <p className={styles.desc}>Jelajahi artikel terbaru kami tentang gaya hidup dan perawatan produk kulit.</p>
        </div>

        <div className={styles.grid}>
          {BLOG_POSTS.map((post, i) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className={styles.postCard}
              style={{ 
                opacity: isInView ? 1 : 0, 
                transform: isInView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s`
              }}
            >
              <div className={styles.imageContainer}>
                <Image src={post.image} alt={post.title} fill className={styles.image} />
                <span className={styles.date}>{post.date}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <span className={styles.readMore}>Baca Selengkapnya</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.footer} style={{ 
          opacity: isInView ? 1 : 0, 
          transition: 'opacity 1s ease 1s'
        }}>
          <Link href="/blog" className={styles.viewAllBtn}>Lihat Semua Artikel</Link>
        </div>
      </div>
    </section>
  );
}
