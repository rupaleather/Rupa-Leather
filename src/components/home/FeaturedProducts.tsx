'use client';
import { getBestSellers } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { useInView } from '@/hooks/useInView';
import styles from '@/styles/components/HomeSections.module.css';

export default function FeaturedProducts() {
  const { ref, isInView } = useInView();
  const products = getBestSellers().slice(0, 4);

  return (
    <section className={styles.section} id="featured-section" ref={ref} style={{ background: '#323232' }}>
      <div className="container">
        <div className={styles.sectionHeader} style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <h2 className={styles.sectionTitle} style={{ color: 'var(--color-primary)' }}>Best Seller</h2>
        </div>
        <div className={styles.productGrid}>
          {products.map((product, i) => (
            <div key={product.id} style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)', transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className={styles.viewAllWrap} style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
          <a href="/products" className="btn btn-outline btn-lg">Lihat Produk Terbaru</a>
        </div>
      </div>
    </section>
  );
}
