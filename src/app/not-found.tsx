import Link from 'next/link';
import styles from '@/styles/components/ErrorPages.module.css';

export default function NotFound() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.errorTitle}>Halaman Tidak Ditemukan</h1>
        <p className={styles.errorDesc}>
          Mohon maaf, halaman yang Anda tuju sepertinya sudah dipindahkan, dihapus, atau tidak pernah ada. Mari kembali merajut kisah bersama Rupa.
        </p>
        <div className={styles.errorActions}>
          <Link href="/" className="btn btn-primary">
            Kembali ke Beranda
          </Link>
          <Link href="/categories/semua-produk" className="btn btn-outline">
            Lihat Koleksi
          </Link>
        </div>
      </div>
    </div>
  );
}
