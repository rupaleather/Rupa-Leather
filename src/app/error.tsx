'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/components/ErrorPages.module.css';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorCode}>500</div>
        <h1 className={styles.errorTitle}>Terjadi Kesalahan Server</h1>
        <p className={styles.errorDesc}>
          Mohon maaf, sistem kami sedang mengalami gangguan. Tim pengrajin digital kami sedang berusaha memperbaikinya agar pengalaman Anda kembali sempurna.
        </p>
        <div className={styles.errorActions}>
          <button onClick={() => reset()} className="btn btn-primary">
            Coba Lagi
          </button>
          <Link href="/" className="btn btn-outline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
