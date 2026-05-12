'use client';

import React from 'react';
import { 
  FiPlus, 
  FiHeart, 
  FiSearch,
  FiChevronDown,
  FiArrowRight
} from 'react-icons/fi';
import styles from '@/styles/dashboard/products/ExtraProducts.module.css';

export default function ExtraProductsPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Produk Ekstra</h1>
          <FiHeart className={styles.titleIcon} />
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>Ekspor Data</button>
          <button className={styles.addBtn}>
            <FiPlus />
            <span>Tambah Ekstra</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Cari ..." className={styles.searchInput} />
        </div>
      </div>

      {/* Table Header */}
      <div className={styles.tableHeader}>
        <div className={styles.headerItem}>NAMA EKSTRA</div>
        <div className={styles.headerItem}>SETTING PILIHAN EKSTRA</div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, minHeight: '300px' }}></div>

      {/* Footer / Pagination */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.showCount}>
            <span>Tampilkan:</span>
            <div className={styles.countSelect}>
              <span>10</span>
              <FiChevronDown />
            </div>
          </div>
          <span>Ditampilkan 0 - 0 dari 0 data</span>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.pageControls}>
            <div className={`${styles.pageNum} ${styles.pageActive}`}>1</div>
            <div className={styles.nextBtn}>
              <span>Selanjutnya</span>
              <FiArrowRight />
            </div>
          </div>
          <div className={styles.gotoPage}>
            <span>Ke Halaman</span>
            <div className={styles.gotoInput}></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
