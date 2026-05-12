'use client';

import React from 'react';
import styles from '@/styles/dashboard/DashboardHome.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.dashboardHome}>
      <div className={styles.mainCard}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.titleArea}>
            <h2>Dashboard Penjualan <span className={styles.heartIcon}>♡</span></h2>
            <p className={styles.updateTime}>Diperbarui 20 Maret 2026, 20:39:12</p>
          </div>

          <div className={styles.filterControls}>
            <div className={styles.buttonGroup}>
              <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>Harian</button>
              <button className={styles.filterBtn}>Mingguan</button>
              <button className={styles.filterBtn}>Bulan</button>
            </div>
            <div className={styles.datePicker}>
              <span className={styles.dateArrow}>⟨</span>
              <span>20 Mar 26 - 20 Mar 26</span>
              <span className={styles.dateArrow}>⟩</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>TOTAL PENJUALAN</span>
            <span className={styles.statValue}>Rp 0</span>
            <div className={styles.statSubGroup}>
              <div className={styles.statSubItem}>
                <span className={styles.statMuted}>Akumulasi dari Awal Bulan</span>
                <span className={styles.statBold}>Rp 1.965.734,00</span>
              </div>
              <div className={styles.statSubItem}>
                <span className={styles.statMuted}>Proyeksi Bulan Ini</span>
                <span className={styles.statBold}>Rp 3.046.887,70</span>
              </div>
            </div>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>PENJUALAN BELUM DIBAYAR</span>
            <span className={styles.statValue}>Rp 0</span>
            <div className={styles.statSubGroup}>
              <div className={styles.statSubItem}>
                <span className={styles.statMuted}>PENJUALAN TERBAYAR</span>
                <span className={styles.statBold}>Rp 0</span>
              </div>
            </div>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>TRANSAKSI</span>
            <span className={styles.statValue}>0</span>
            <div className={styles.statSubGroup}>
              <div className={styles.statSubItem}>
                <span className={styles.statMuted}>PRODUK TERJUAL</span>
                <span className={styles.statBold}>0</span>
              </div>
            </div>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>PENJUALAN PER TRANSAKSI</span>
            <span className={styles.statValue}>Rp 0</span>
            <div className={styles.statSubGroup}>
              <div className={styles.statSubItem}>
                <span className={styles.statMuted}>PRODUK PER TRANSAKSI</span>
                <span className={styles.statBold}>0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Header */}
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Penjualan 20 Maret 2026</h3>
          <div className={styles.highlightBox}>
            <span style={{ fontSize: '0.6rem' }}>●</span> Dengan pakai skala, penjualanmu bulan ini meningkat senilai Rp 254.144
          </div>
        </div>

        {/* Chart Area */}
        <div className={styles.chartArea}>
          <div className={styles.yAxis}>
            <span>1</span>
            <span>0,5</span>
            <span>0</span>
          </div>
          
          <div className={styles.xAxis}>
            <span>00:00</span>
            <span>02:00</span>
            <span>04:00</span>
            <span>06:00</span>
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
            <span>23:59</span>
          </div>

          {/* Bottom chart line matching screenshot */}
          <div className={styles.chartLine}></div>
        </div>
      </div>
    </div>
  );
}
