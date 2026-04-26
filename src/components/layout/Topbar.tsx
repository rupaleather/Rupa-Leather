import Link from 'next/link';
import styles from '@/styles/components/Topbar.module.css';

export default function Topbar() {
  return (
    <div className={styles.topbar}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.info}>
            Gratis Ongkir Seluruh Indonesia &amp; Garansi Seumur Hidup
          </div>
          <div className={styles.promoMenu}>
            <div className={styles.promoTrigger}>
              <span>Promo</span>
              <span style={{ fontSize: '10px' }}>▼</span>
            </div>
            <div className={styles.dropdown}>
              <Link href="/register" className={styles.dropdownItem}>Daftar Member</Link>
              <Link href="/promo/member" className={styles.dropdownItem}>Diskon Member</Link>
              <Link href="/promo/diskon" className={styles.dropdownItem}>Diskon Spesial</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
