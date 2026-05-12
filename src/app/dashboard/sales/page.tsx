'use client';

import React, { useState } from 'react';
import styles from './sales-dashboard.module.css';
import { 
  FiHeart, 
  FiChevronLeft, 
  FiChevronRight,
  FiCalendar
} from 'react-icons/fi';

export default function SalesDashboardPage() {
  const [timeFilter, setTimeFilter] = useState('Harian');

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            Dashboard Penjualan <FiHeart className={styles.loveIcon} />
          </h1>
          <p className={styles.updateTime}>Diperbarui 20 Maret 2026, 20:39:12</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.timeFilters}>
            {['Harian', 'Mingguan', 'Bulan'].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${timeFilter === filter ? styles.filterActive : ''}`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className={styles.datePicker}>
            <FiChevronLeft className={styles.dateArrow} />
            <span className={styles.dateRange}>
              <FiCalendar className={styles.calendarIcon} /> 20 Mar 26 - 20 Mar 26
            </span>
            <FiChevronRight className={styles.dateArrow} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <p className={styles.cardLabel}>TOTAL PENJUALAN</p>
          <h2 className={styles.cardValue}>Rp 0</h2>
          <div className={styles.cardDetails}>
            <div className={styles.detailRow}>
              <span>Akumulasi dari Awal Bulan</span>
              <span className={styles.bold}>Rp 1.965.734,00</span>
            </div>
            <div className={styles.detailRow}>
              <span>Proyeksi Bulan Ini</span>
              <span className={styles.bold}>Rp 3.046.887,70</span>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <p className={styles.cardLabel}>PENJUALAN BELUM DIBAYAR</p>
          <h2 className={styles.cardValue}>Rp 0</h2>
          <div className={styles.cardDetails}>
            <div className={styles.detailRow}>
              <span>PENJUALAN TERBAYAR</span>
              <span className={styles.bold}>Rp 0</span>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <p className={styles.cardLabel}>TRANSAKSI</p>
          <h2 className={styles.cardValue}>0</h2>
          <div className={styles.cardDetails}>
            <div className={styles.detailRow}>
              <span>PRODUK TERJUAL</span>
              <span className={styles.bold}>0</span>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <p className={styles.cardLabel}>PENJUALAN PER TRANSAKSI</p>
          <h2 className={styles.cardValue}>Rp 0</h2>
          <div className={styles.cardDetails}>
            <div className={styles.detailRow}>
              <span>PRODUK PER TRANSAKSI</span>
              <span className={styles.bold}>0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Section */}
      <div className={styles.insightBox}>
        <h3 className={styles.insightTitle}>Penjualan 20 Maret 2026</h3>
        <div className={styles.positiveBadge}>
          <span className={styles.badgeDot}></span>
          Dengan pakai skala, penjualanmu bulan ini meningkat senilai Rp 254.144
        </div>
      </div>

      {/* Chart Section Placeholder */}
      <div className={styles.chartArea}>
        <div className={styles.chartGrid}>
          <div className={styles.yAxis}>
            <span>1</span>
            <span>0,5</span>
            <span>0</span>
          </div>
          <div className={styles.chartLine}></div>
        </div>
      </div>
    </div>
  );
}
