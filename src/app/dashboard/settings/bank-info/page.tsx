'use client';

import React, { useState } from 'react';
import styles from './bank-info.module.css';
import { 
  FiHeart, 
  FiHelpCircle, 
  FiPlus, 
  FiSearch,
  FiFileText,
  FiX,
  FiUpload,
  FiInfo
} from 'react-icons/fi';

export default function BankInfoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Aktif');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    branch: '',
    outlet: 'Semua Outlet'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branch: '',
      outlet: 'Semua Outlet'
    });
  };

  const handleSave = () => {
    // Logic to save bank account
    console.log('Saving bank info:', formData);
    handleCloseModal();
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            Informasi Rekening <FiHelpCircle className={styles.helpIcon} /> <FiHeart className={styles.loveIcon} />
          </h1>
        </div>
        <div className={styles.headerRight}>
          <a href="#" className={styles.settlementLink}>Atur Rekening Settlement</a>
          <button className={styles.addButton} onClick={() => setShowModal(true)}>
            <FiPlus /> Tambah Rekening Bank
          </button>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Cari ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <button 
            className={`${styles.filterBtn} ${activeFilter === 'Aktif' ? styles.filterActive : ''}`}
            onClick={() => setActiveFilter('Aktif')}
          >
            Aktif
          </button>
          <button 
            className={`${styles.filterBtn} ${activeFilter === 'Tidak Aktif' ? styles.filterActive : ''}`}
            onClick={() => setActiveFilter('Tidak Aktif')}
          >
            Tidak Aktif
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NAMA BANK</th>
              <th>NO REKENING</th>
              <th>PEMEGANG REKENING</th>
              <th>OUTLET</th>
              <th>SETTLEMENT</th>
              <th>PERUBAHAN SETTLEMENT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className={styles.emptyState}>
                <div className={styles.emptyContent}>
                  <FiFileText size={48} color="#e2e8f0" />
                  <p>Belum ada data rekening bank</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Full Page Add Bank Form */}
      {showModal && (
        <div className={styles.fullPageContainer}>
          <div className={styles.fullPageHeader}>
            <div className={styles.fullPageHeaderLeft}>
              <button className={styles.closePageBtn} onClick={handleCloseModal}>
                <FiX size={20} />
              </button>
              <h1>Tambah Rekening Bank</h1>
            </div>
            <div className={styles.majooLogoWrapper}>
              <span style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px' }}>skala</span>
            </div>
          </div>

          <div className={styles.fullPageContent}>
            <div className={styles.formCard}>
              <div className={styles.formGrid}>
                {/* Daftar Outlet */}
                <div className={styles.formRow}>
                  <label>Daftar Outlet<span className={styles.required}>*</span></label>
                  <div>
                    <select 
                      name="outlet"
                      className={`${styles.input} ${styles.select}`}
                      value={formData.outlet}
                      onChange={handleInputChange}
                    >
                      <option value="Pilih">Pilih</option>
                      <option value="KEDAI LARAS">KEDAI LARAS</option>
                    </select>
                    <div className={styles.tagContainer}>
                      <div className={styles.tag}>
                        KEDAI LARAS 
                        <span className={styles.removeTag}><FiX size={12} /></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nama Bank */}
                <div className={styles.formRow}>
                  <label>Nama Bank<span className={styles.required}>*</span></label>
                  <select 
                    name="bankName"
                    className={`${styles.input} ${styles.select}`}
                    value={formData.bankName}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih</option>
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BNI">BNI</option>
                    <option value="BRI">BRI</option>
                  </select>
                </div>

                {/* Nomor Rekening */}
                <div className={styles.formRow}>
                  <label>Nomor Rekening<span className={styles.required}>*</span></label>
                  <input 
                    type="text"
                    name="accountNumber"
                    placeholder="Contoh: 081222333444"
                    className={styles.input}
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Pemegang Rekening */}
                <div className={styles.formRow}>
                  <label>Pemegang Rekening<span className={styles.required}>*</span></label>
                  <input 
                    type="text"
                    name="accountHolder"
                    placeholder="Contoh: Andi"
                    className={styles.input}
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Foto Informasi Rekening */}
                <div className={styles.formRow}>
                  <label>
                    Foto Informasi Rekening<span className={styles.required}>*</span>
                    <FiInfo className={styles.labelInfo} size={14} />
                  </label>
                  <div className={styles.uploadBox}>
                    <FiUpload className={styles.uploadIcon} />
                    <span className={styles.uploadText}>Pilih atau letakkan berkas di sini</span>
                  </div>
                </div>

                {/* KTP / NPWP / KITAS */}
                <div className={styles.formRow}>
                  <label>
                    KTP / NPWP / KITAS Pemegang Rekening<span className={styles.required}>*</span>
                  </label>
                  <div className={styles.uploadBox}>
                    <FiUpload className={styles.uploadIcon} />
                    <span className={styles.uploadText}>Pilih atau letakkan berkas di sini</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.fullPageFooter}>
            <button className={styles.batalBtn} onClick={handleCloseModal}>Batal</button>
            <button 
              className={`${styles.simpanBtn} ${formData.bankName && formData.accountNumber && formData.accountHolder ? styles.simpanBtnActive : ''}`}
              onClick={handleSave}
              disabled={!formData.bankName || !formData.accountNumber || !formData.accountHolder}
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
