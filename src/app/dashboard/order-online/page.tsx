'use client';

import React, { useState } from 'react';
import styles from './order-management.module.css';
import { 
  FiHeart, 
  FiPackage, 
  FiClock, 
  FiTruck, 
  FiCheckCircle, 
  FiChevronDown, 
  FiCalendar,
  FiSearch,
  FiDatabase
} from 'react-icons/fi';

export default function OrderManagementPage() {
  const [activeStatus, setActiveStatus] = useState('Pesanan Masuk');

  const stats = [
    { label: 'PESANAN MASUK', value: 0, icon: <FiPackage />, color: '#f97316' },
    { label: 'SEDANG DIPROSES', value: 0, icon: <FiClock />, color: '#3b82f6' },
    { label: 'DALAM PENGIRIMAN', value: 0, icon: <FiTruck />, color: '#a855f7' },
    { label: 'SELESAI', value: 0, icon: <FiCheckCircle />, color: '#10b981' },
  ];

  const statuses = ['Pesanan Masuk', 'Diproses', 'Dikirim', 'Diterima', 'Selesai', 'Batal/Refund'];

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleIconWrapper}>
            <FiPackage className={styles.mainIcon} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>
              Manajemen Pesanan <FiHeart className={styles.loveIcon} />
            </h1>
            <p className={styles.subTitle}>PANTAU SEMUA PESANAN ONLINE ANDA SECARA REAL-TIME</p>
          </div>
        </div>
        <div className={styles.headerFilters}>
          <div className={styles.filterBtn}>
            <FiCalendar /> <span>Mar 2026</span> <FiChevronDown />
          </div>
          <div className={styles.filterBtn}>
            <span>Semua Channel</span> <FiChevronDown />
          </div>
          <div className={styles.filterBtn}>
            <span>Semua Outlet</span> <FiChevronDown />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard} style={{ borderBottomColor: stat.color }}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon} style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                {stat.icon}
              </div>
              <FiHeart className={styles.cardInfoIcon} />
            </div>
            <p className={styles.statLabel}>{stat.label}</p>
            <h2 className={styles.statValue}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Tabs and Search */}
      <div className={styles.toolbar}>
        <div className={styles.statusTabs}>
          {statuses.map((status) => (
            <button
              key={status}
              className={`${styles.tabBtn} ${activeStatus === status ? styles.tabActive : ''}`}
              onClick={() => setActiveStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Cari pesanan..." className={styles.searchInput} />
        </div>
      </div>

      {/* Empty State */}
      <div className={styles.emptyState}>
        <div className={styles.emptyIllustration}>
          <FiDatabase size={64} color="#e2e8f0" />
        </div>
        <h3>DATA TIDAK TERSEDIA</h3>
      </div>
    </div>
  );
}
