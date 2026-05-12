'use client';

import React from 'react';
import styles from './settings.module.css';
import { FiSettings, FiHelpCircle, FiHeart } from 'react-icons/fi';

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <h1>Pengaturan</h1>
            <div className={styles.headerIcons}>
              <FiHelpCircle className={styles.headerIcon} />
              <FiHeart className={styles.headerIcon} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.emptyState}>
          <div className={styles.settingsIconWrapper}>
            <FiSettings size={48} color="#cbd5e1" />
          </div>
          <h3>Selamat Datang di Pengaturan</h3>
          <p>Pilih menu di samping untuk mulai mengonfigurasi outlet dan profil Anda.</p>
        </div>
      </div>
    </div>
  );
}
