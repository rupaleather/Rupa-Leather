'use client';

import React from 'react';
import { 
  FiPlus, 
  FiUpload, 
  FiDownload, 
  FiRotateCcw, 
  FiPackage, 
  FiXCircle,
  FiCheckCircle,
  FiAlertTriangle,
  FiChevronDown,
  FiArrowRight,
  FiHelpCircle,
  FiHeart,
  FiMoreHorizontal,
  FiSearch,
  FiTrash2
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import styles from '@/styles/dashboard/Products.module.css';

export default function ProductsPage() {
  const router = useRouter();

  return (
    <div className={styles.productsContainer}>
      <div className={styles.mainCard}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.titleArea}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ margin: 0 }}>Daftar Produk</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '1rem' }}>
                <FiHelpCircle style={{ cursor: 'pointer' }} />
                <FiHeart style={{ cursor: 'pointer' }} />
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.iconBtn} title="Riwayat"><FiRotateCcw /></button>
            <button className={styles.actionBtn}><FiUpload /> Import Data</button>
            <button className={styles.actionBtn}><FiDownload /> Ekspor Data</button>
            <button 
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              onClick={() => router.push('/dashboard/products/add')}
            >
              <FiPlus /> TAMBAH PRODUK
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#f97316' }}>
              <FiPackage />
            </div>
            <div className={styles.statInfo}>
              <h4>TOTAL PRODUK</h4>
              <p>0</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <FiCheckCircle />
            </div>
            <div className={styles.statInfo}>
              <h4>PRODUK AKTIF</h4>
              <p>0</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <FiAlertTriangle />
            </div>
            <div className={styles.statInfo}>
              <h4>STOK MENIPIS</h4>
              <p>0</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fef2f2', color: '#ef4444' }}>
              <FiXCircle />
            </div>
            <div className={styles.statInfo}>
              <h4>KEHABISAN STOK</h4>
              <p>0</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.tabGroup}>
            <button className={`${styles.tabBtn} ${styles.tabActive}`}>Semua</button>
            <button className={styles.tabBtn}>Tampil di Menu</button>
            <button className={styles.tabBtn}>Tidak Tampil di Menu</button>
          </div>

          <div className={styles.filterRight}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input type="text" className={styles.searchInput} placeholder="Cari Produk atau S..." />
            </div>
            <select className={styles.categorySelect}>
              <option>Semua Kategori</option>
            </select>
            <button className={styles.deleteBtn}><FiTrash2 /></button>
          </div>
        </div>

        {/* Table Section */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>NAMA PRODUK</th>
                <th>KATEGORI</th>
                <th>SKU</th>
                <th>HARGA MODAL</th>
                <th>HARGA BELI</th>
                <th>HARGA JUAL</th>
                <th style={{ textAlign: 'center' }}>STATUS</th>
                <th style={{ width: '40px', padding: '1.25rem 2.75rem 1.25rem 0', textAlign: 'center' }}><input type="checkbox" /></th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state for now */}
              <tr>
                <td colSpan={8}>
                  <div className={styles.emptyState}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      background: '#f8fafc',
                      borderRadius: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FiPackage style={{ fontSize: '3rem', color: '#e2e8f0' }} />
                    </div>
                    <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>Belum ada data produk tersedia</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <div className={styles.showCount}>
              <span>Tampilkan:</span>
              <div className={styles.countSelect}>
                10 <FiChevronDown />
              </div>
            </div>
            <span>Ditampilkan 0 - 0 dari 0 data</span>
          </div>

          <div className={styles.pagination}>
            <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
            <button className={styles.nextBtn}>
              Selanjutnya <FiArrowRight />
            </button>
            <div className={styles.gotoPage}>
              <span>Ke Halaman</span>
              <div className={styles.gotoInput}>
                <FiMoreHorizontal />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
