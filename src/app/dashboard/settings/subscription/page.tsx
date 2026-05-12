'use client';

import React, { useState } from 'react';
import styles from './subscription.module.css';
import { 
  FiHeart, 
  FiHelpCircle,
  FiChevronRight
} from 'react-icons/fi';

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState('Langganan Aktif');

  const tabs = ['Langganan Aktif', 'Riwayat Pembelian', 'Support'];

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            Langganan & Support <FiHelpCircle className={styles.helpIcon} /> <FiHeart className={styles.loveIcon} />
          </h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsWrapper}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === 'Langganan Aktif' && (
          <div className={styles.subscriptionCard}>
            <div className={styles.packageInfo}>
              <p className={styles.label}>Paket saat ini:</p>
              <h2 className={styles.packageName}>Prime +</h2>
              <div className={styles.statusBadge}>
                <span className={styles.dot}></span> Langganan Aktif
              </div>
            </div>
            <div className={styles.outletInfo}>
              <p className={styles.label}>Outlet Aktif:</p>
              <h3 className={styles.outletCount}>1 Outlet</h3>
              <a href="#" className={styles.detailLink}>Lihat Detail Langganan</a>
            </div>
          </div>
        )}

        {activeTab !== 'Langganan Aktif' && (
          <div className={styles.placeholderContent}>
            <p>Konten untuk tab {activeTab} akan segera hadir.</p>
          </div>
        )}
      </div>
    </div>
  );
}
