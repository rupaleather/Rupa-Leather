'use client';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calcDiscount } from '@/lib/formatters';
import type { Product } from '@/data/products';
import styles from '@/styles/components/ProductCard.module.css';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const { name, slug, category, price, salePrice, rating, reviewCount, isNew, isBestSeller } = product;
  const imageSrc = `/images/products/${slug}.png`;

  return (
    <Link href={`/products/${slug}`} className={styles.card} id={`product-card-${slug}`}>
      <div className={styles.imageWrap}>
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
          loading="lazy"
        />
        <div className={styles.badges}>
          {isNew && <span className="badge badge-new">Baru</span>}
          {isBestSeller && <span className="badge">Best Seller</span>}
          {salePrice && <span className="badge badge-sale">-{calcDiscount(price, salePrice)}%</span>}
        </div>
        <div className={styles.quickView}>
          <span className="btn btn-primary btn-sm">Lihat Detail</span>
        </div>
      </div>
      <div className={styles.info}>
        <p className={styles.category}>{category}</p>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.priceRow}>
          <span className={styles.salePrice}>{formatPrice(salePrice || price)}</span>
          {salePrice && <span className={styles.originalPrice}>{formatPrice(price)}</span>}
        </div>
        <div className={styles.rating}>
          <span className={styles.stars}>{'★'.repeat(Math.floor(rating))}</span>
          <span>{rating} ({reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
