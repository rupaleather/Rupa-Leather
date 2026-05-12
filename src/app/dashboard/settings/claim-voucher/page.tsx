'use client';

import React, { useState } from 'react';
import styles from './claim-voucher.module.css';
import { 
  FiHeart, 
  FiFolder
} from 'react-icons/fi';

export default function ClaimVoucherPage() {
  const [voucherCode, setVoucherCode] = useState('');
  const [error, setError] = useState('');

  const handleCheckVoucher = () => {
    if (!voucherCode.trim()) {
      setError('Mohon isi nomor voucher');
    } else {
      setError('');
      // Logika cek voucher di sini
      console.log('Checking voucher:', voucherCode);
    }
  };

  return (
    <div className={styles.container}>
      {/* Claim Section */}
      <div className={styles.claimCard}>
        <h1 className={styles.pageTitle}>
          Klaim Voucher <FiHeart className={styles.loveIcon} />
        </h1>
        <div className={styles.divider}></div>
        <div className={styles.inputArea}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Masukkan kode voucher" 
              value={voucherCode}
              onChange={(e) => {
                setVoucherCode(e.target.value);
                if (e.target.value) setError('');
              }}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
            />
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
          <button className={styles.checkBtn} onClick={handleCheckVoucher}>
            Cek Voucher
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className={styles.historyCard}>
        <h2 className={styles.sectionTitle}>Riwayat Klaim Voucher</h2>
        <div className={styles.divider}></div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>KODE VOUCHER</th>
                <th>SKU/ID PRODUK</th>
                <th>NAMA PRODUK</th>
                <th>TANGGAL KLAIM</th>
                <th>LOKASI KLAIM</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  <div className={styles.emptyContent}>
                    <div className={styles.emptyIllustration}>
                      <div className={styles.folderIconWrapper}>
                        <FiFolder size={64} color="#f97316" />
                        <div className={styles.magnifier}></div>
                      </div>
                    </div>
                    <h3>Data tidak tersedia</h3>
                    <p>Belum ada data yang dapat ditampilkan di halaman ini</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
