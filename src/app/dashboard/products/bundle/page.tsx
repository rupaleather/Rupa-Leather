'use client';

import React from 'react';
import { 
  FiPlus, 
  FiSearch,
  FiChevronDown,
  FiArrowLeft,
  FiArrowRight
} from 'react-icons/fi';
import styles from '@/styles/dashboard/products/BundleProducts.module.css';

export default function BundleProductsPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Produk Paket</h1>
          <p>KEDAI LARAS - 10 Produk</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>Ekspor Data</button>
          <button className={styles.addBtn}>
            <FiPlus />
            <span>Tambah Produk Paket</span>
          </button>
        </div>
      </header>

      {/* Search & Tabs */}
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Cari ..." className={styles.searchInput} />
        </div>
        <div className={styles.filterTabs}>
          <div className={`${styles.tab} ${styles.tabActive}`}>Semua</div>
          <div className={styles.tab}>Tampil di Menu</div>
          <div className={styles.tab}>Tidak Tampil di Menu</div>
        </div>
      </div>

      {/* Table Header */}
      <div className={styles.tableHeader}>
        <div className={styles.checkbox}></div>
        <div className={styles.headerItem}>NAMA PAKET</div>
        <div className={styles.headerItem}>PRODUK</div>
        <div className={styles.headerItem}>KATEGORI</div>
        <div className={styles.headerItem}>HARGA</div>
        <div className={styles.headerItem}>STATUS</div>
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
          <span>Ditampilkan 1 - 10 dari 10 data</span>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.pagination}>
            <div className={styles.pageLink}>
              <FiArrowLeft />
              <span>Sebelumnya</span>
            </div>
            <div className={styles.pageNum}>1</div>
            <div className={`${styles.pageLink} ${styles.pageLinkActive}`}>
              <span>Selanjutnya</span>
              <FiArrowRight />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
