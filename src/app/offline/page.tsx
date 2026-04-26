'use client';
import Link from 'next/link';
import styles from '@/styles/components/ErrorPages.module.css';
import { HiOutlineWifi } from 'react-icons/hi2';

export default function OfflinePage() {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorCode} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <HiOutlineWifi size={100} style={{ opacity: 0.3 }} />
        </div>
        <h1 className={styles.errorTitle}>Anda Sedang Offline</h1>
        <p className={styles.errorDesc}>
          Sepertinya koneksi internet Anda terputus. Karya kulit asli kami akan setia menunggu hingga Anda kembali terhubung. Silakan periksa jaringan Anda.
        </p>
        <div className={styles.errorActions}>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    </div>
  );
}
