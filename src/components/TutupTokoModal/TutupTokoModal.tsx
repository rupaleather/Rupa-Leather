'use client';

import React, { useState, useRef } from 'react';
import styles from './TutupTokoModal.module.css';
import { FiX, FiPrinter } from 'react-icons/fi';

interface TutupTokoModalProps {
  onClose: () => void;
  initialSettings?: Record<string, Record<string, boolean>> | null;
  onSave?: (settings: Record<string, Record<string, boolean>>) => void;
}

const TABS = ['Penerimaan', 'Penjualan', 'Transaksi', 'Produk Penjualan'];

const PENERIMAAN_ITEMS = [
  'Rincian Penerimaan',
  'Modal Awal',
  'Kas Masuk',
  'Kas Keluar',
  'Penerimaan Kasir',
  'Penerimaan Online',
  'Total Penerimaan',
  'Refund',
  'Penerimaan Bersih',
  'Saldo Akhir',
  'Informasi Total Tunai'
];

const TRANSAKSI_ITEMS = [
  'Rincian Transaksi',
  'Transaksi Selesai',
  'Transaksi Belum Terbayar',
  'Transaksi Belum Terbayar (Rp)',
  'Transaksi Void',
  'Transaksi Void (Rp)',
  'Transaksi Penjualan Deposit',
  'Transaksi Penjualan Deposit (Rp)',
  'Penjualan per Transaksi',
  'Produk per Transaksi',
  'Rincian Transaksi E-Commerce'
];

const PENJUALAN_ITEMS = [
  'Rincian Penjualan',
  'Penjualan Kotor',
  'Pajak',
  'Service Charge',
  'Ongkos Kirim',
  'Asuransi',
  'Platform',
  'Biaya Lainnya',
  'Diskon',
  'Kupon',
  'Poin',
  'Komplimen',
  'Total Penjualan',
  'Total Refund',
  'Total Penjualan Bersih'
];

const PRODUK_PENJUALAN_ITEMS = [
  'Rincian Produk Terjual',
  'Produk Terjual',
  'Produk Bonus',
  'Produk Refund',
  'Ekstra Terjual',
  'Ekstra Refund',
  'Deposit Terjual'
];

export default function TutupTokoModal({ onClose, initialSettings, onSave }: TutupTokoModalProps) {
  const [activeTab, setActiveTab] = useState('Penerimaan');
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Tutup Toko</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; color: #000 !important; font-family: 'Courier New', Courier, monospace !important; }
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              color: #000;
              line-height: 1.5;
              width: 80mm;
              padding: 5mm;
            }
            [class*="receiptLine"] {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            [class*="receiptLine"] span:first-child {
              flex: 1;
              padding-right: 8px;
            }
            [class*="receiptHeaderInfo"] {
              display: flex;
              margin-bottom: 2px;
            }
            [class*="receiptHeaderInfo"] span:first-child {
              width: 100px;
              flex-shrink: 0;
            }
            [class*="receiptDividerDouble"] {
              border-bottom: 1px double #000;
              border-top: 1px double #000;
              height: 3px;
              margin: 6px 0;
            }
            [class*="receiptDivider"]:not([class*="Double"]) {
              border-bottom: 1px dashed #000;
              margin: 6px 0;
            }
            [class*="receiptHeader"] {
              text-align: center;
              margin-bottom: 12px;
            }
            [class*="receiptTitle"] {
              font-weight: bold;
              margin-bottom: 4px;
            }
            [class*="receiptStickyHeader"] {
              padding: 0;
            }
            [class*="receiptScrollableBody"] {
              padding: 0;
            }
            @media print {
              body { width: 80mm; margin: 0; padding: 3mm; }
              @page { size: 80mm auto; margin: 0; }
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Initialize state dynamically
  const [settingsState, setSettingsState] = useState<Record<string, Record<string, boolean>>>(
    initialSettings || {
      'Penerimaan': PENERIMAAN_ITEMS.reduce((acc, item) => ({ ...acc, [item]: true }), {}),
      'Penjualan': PENJUALAN_ITEMS.reduce((acc, item) => ({ ...acc, [item]: true }), {}),
      'Transaksi': TRANSAKSI_ITEMS.reduce((acc, item) => ({ ...acc, [item]: true }), {}),
      'Produk Penjualan': PRODUK_PENJUALAN_ITEMS.reduce((acc, item) => ({ ...acc, [item]: true }), {})
    }
  );

  const getMasterKey = (tab: string) => {
    if (tab === 'Produk Penjualan') return 'Rincian Produk Terjual';
    return `Rincian ${tab}`;
  };

  const getTabItems = (tab: string) => {
    switch (tab) {
      case 'Penerimaan': return PENERIMAAN_ITEMS;
      case 'Penjualan': return PENJUALAN_ITEMS;
      case 'Transaksi': return TRANSAKSI_ITEMS;
      case 'Produk Penjualan': return PRODUK_PENJUALAN_ITEMS;
      default: return [];
    }
  };

  const handleToggle = (tab: string, item: string) => {
    const masterKey = getMasterKey(tab);
    const isMaster = item === masterKey;

    // If not master and master is OFF, do nothing
    if (!isMaster && !settingsState[tab]?.[masterKey]) return;

    setSettingsState(prev => {
      const newState = { ...prev };
      const currentTabState = { ...(newState[tab] || {}) };
      const newValue = !currentTabState[item];

      currentTabState[item] = newValue;

      // Master toggle logic: if it's a "Rincian" header, toggle everything in the tab
      if (isMaster) {
        getTabItems(tab).forEach(key => {
          currentTabState[key] = newValue;
        });
      }

      newState[tab] = currentTabState;
      return newState;
    });
  };

  const getActiveItems = () => {
    switch (activeTab) {
      case 'Penerimaan': return PENERIMAAN_ITEMS;
      case 'Penjualan': return PENJUALAN_ITEMS;
      case 'Transaksi': return TRANSAKSI_ITEMS;
      case 'Produk Penjualan': return PRODUK_PENJUALAN_ITEMS;
      default: return [];
    }
  };

  const getActiveState = () => {
    return settingsState[activeTab] || {};
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.closeBtn} onClick={onClose}>
              <FiX size={20} />
            </button>
            <h2 className={styles.title}>Detail Tutup Toko Outlet</h2>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Left Panel - Controls */}
          <div className={styles.leftPanel}>
            <div className={styles.contentWrapper}>
              <h3 className={styles.sectionTitle}>Atur Tampilan Laporan Tutup Toko</h3>

              <div className={styles.tabs}>
                {TABS.map(tab => (
                  <div
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              <div className={styles.settingsList}>
                {getActiveItems().map(item => {
                  const isActive = getActiveState()[item];
                  const masterKey = getMasterKey(activeTab);
                  const isMaster = item === masterKey;
                  const isDisabled = !isMaster && !getActiveState()[masterKey];
                  const hasBorder = isMaster;

                  return (
                    <div key={item} className={`${styles.settingItem} ${hasBorder ? styles.settingItemWithBorder : ''}`}>
                      <span className={`${styles.settingLabel} ${isDisabled ? styles.settingLabelDisabled : ''}`}>{item}</span>
                      <div
                        className={`${styles.switch} ${isActive ? styles.switchActive : ''} ${isDisabled ? styles.switchDisabled : ''}`}
                        onClick={() => handleToggle(activeTab, item)}
                      >
                        <span className={`${styles.switchLabel} ${isActive ? styles.switchLabelOn : styles.switchLabelOff}`}>
                          {isActive ? 'ON' : 'OFF'}
                        </span>
                        <div className={`${styles.switchHandle} ${isActive ? styles.switchHandleActive : ''}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className={styles.rightPanel}>
            <div className={styles.receiptPreview} ref={printRef}>
              {/* Sticky Header */}
              <div className={styles.receiptStickyHeader}>
                {activeTab === 'Penerimaan' && (
                  <>
                    <div className={styles.receiptHeader}>
                      <div className={styles.receiptTitle}>Laporan Tutup Toko</div>
                      <div>Transaksi Penjualan</div>
                    </div>

                    <div className={styles.receiptHeaderInfo}>
                      <span>Waktu Buka</span>
                      <span>: 17/01/2025, 08:00</span>
                    </div>
                    <div className={styles.receiptHeaderInfo}>
                      <span>Waktu Tutup</span>
                      <span>: 17/01/2025, 13:00</span>
                    </div>
                    <div className={styles.receiptHeaderInfo}>
                      <span>Otorisasi</span>
                      <span>: Manager A</span>
                    </div>

                    <div className={styles.receiptDividerDouble}></div>
                  </>
                )}
              </div>

              {/* Scrollable Body */}
              <div className={styles.receiptScrollableBody}>

                {activeTab === 'Penerimaan' && (
                  <>
                    {settingsState['Penerimaan']?.['Modal Awal'] && (
                      <div className={styles.receiptLine}><span>Modal Awal</span><span>100.000</span></div>
                    )}
                    {settingsState['Penerimaan']?.['Kas Masuk'] && (
                      <div className={styles.receiptLine}><span>Kas Masuk</span><span>200.000</span></div>
                    )}
                    {settingsState['Penerimaan']?.['Kas Keluar'] && (
                      <div className={styles.receiptLine}><span>Kas Keluar</span><span>(100.000)</span></div>
                    )}

                    <div className={styles.receiptDividerDouble}></div>

                    {settingsState['Penerimaan']?.['Rincian Penerimaan'] && (
                      <>
                        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>Rincian Penerimaan</div>
                        <div className={styles.receiptDivider}></div>

                        {settingsState['Penerimaan']?.['Penerimaan Kasir'] && (
                          <>
                            <div className={styles.receiptLine}><span>Tunai</span><span>500.000</span></div>
                            <div style={{ color: '#000000' }}>Kartu Debit/Kredit</div>
                            <div className={styles.receiptLine}><span>BCA</span><span>400.000</span></div>
                            <div className={styles.receiptLine}><span>Mandiri</span><span>500.000</span></div>
                            <div style={{ color: '#000000' }}>Transfer</div>
                            <div className={styles.receiptLine}><span>BCA</span><span>500.000</span></div>
                            <div className={styles.receiptLine}><span>QRIS Dinamis</span><span>500.000</span></div>
                            <div className={styles.receiptLine}><span>QRIS Statis</span><span>500.000</span></div>
                            <div style={{ color: '#000000' }}>QRIS lainnya</div>
                            <div className={styles.receiptLine}><span>Dana</span><span>500.000</span></div>
                            <div className={styles.receiptLine}><span>Gopay</span><span>500.000</span></div>
                            <div className={styles.receiptLine}><span>Tunai</span><span>100.000</span></div>
                            <div className={styles.receiptDivider}></div>
                            <div className={styles.receiptLine}><span>Total Penerimaan Kasir</span><span>4.000.000</span></div>
                            <div className={styles.receiptDivider}></div>
                          </>
                        )}

                        {settingsState['Penerimaan']?.['Penerimaan Online'] && (
                          <>
                            <div className={styles.receiptLine}><span>Toko Online</span><span>500.000</span></div>
                            <div className={styles.receiptLine}><span>Consumer App</span><span>500.000</span></div>
                            <div className={styles.receiptDivider}></div>
                            <div className={styles.receiptLine}><span>Total Penerimaan Online</span><span>1.000.000</span></div>
                            <div className={styles.receiptDivider}></div>
                          </>
                        )}

                        {settingsState['Penerimaan']?.['Total Penerimaan'] && (
                          <>
                            <div className={styles.receiptLine} style={{ fontWeight: 'bold' }}><span>Total Penerimaan</span><span>5.000.000</span></div>
                            <div className={styles.receiptDivider}></div>
                          </>
                        )}

                        {settingsState['Penerimaan']?.['Refund'] && (
                          <>
                            <div className={styles.receiptLine}><span>Refund Tunai</span><span>(100.000)</span></div>
                            <div className={styles.receiptLine}><span>Refund Non Tunai</span><span>(300.000)</span></div>
                            <div className={styles.receiptDivider}></div>
                            <div className={styles.receiptLine}><span>Total Refund</span><span>(450.000)</span></div>
                            <div className={styles.receiptDivider}></div>
                          </>
                        )}

                        {settingsState['Penerimaan']?.['Penerimaan Bersih'] && (
                          <>
                            <div className={styles.receiptLine} style={{ fontWeight: 'bold' }}><span>Total Penerimaan Bersih</span><span>4.550.000</span></div>
                            <div className={styles.receiptDivider}></div>
                          </>
                        )}

                        {settingsState['Penerimaan']?.['Saldo Akhir'] && (
                          <>
                            <div className={styles.receiptLine} style={{ fontWeight: 'bold' }}><span>Saldo Akhir</span><span>4.750.000</span></div>
                            <div className={styles.receiptDivider}></div>
                          </>
                        )}

                        {settingsState['Penerimaan']?.['Informasi Total Tunai'] && (
                          <>
                            <div className={styles.receiptLine}><span>Total Tunai Sistem</span><span>700.000</span></div>
                            <div className={styles.receiptLine}><span>Total Tunai Aktual</span><span>650.000</span></div>
                            <div className={styles.receiptLine}><span>Selisih</span><span>50.000</span></div>
                          </>
                        )}

                        <div className={styles.receiptDividerDouble}></div>
                      </>
                    )}
                  </>
                )}

                {activeTab === 'Penjualan' && settingsState['Penjualan']?.['Rincian Penjualan'] && (
                  <>
                    <div className={styles.receiptDividerDouble}></div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Rincian Penerimaan</div>
                    <div className={styles.receiptDivider}></div>

                    {settingsState['Penjualan']?.['Penjualan Kotor'] && <div className={styles.receiptLine}><span>Penjualan Kotor</span><span>1.000.000</span></div>}
                    {settingsState['Penjualan']?.['Pajak'] && <div className={styles.receiptLine}><span>Pajak</span><span>100.000</span></div>}
                    {settingsState['Penjualan']?.['Service Charge'] && <div className={styles.receiptLine}><span>Service Charge</span><span>50.000</span></div>}
                    {settingsState['Penjualan']?.['Ongkos Kirim'] && <div className={styles.receiptLine}><span>Ongkos Kirim</span><span>50.000</span></div>}
                    {settingsState['Penjualan']?.['Asuransi'] && <div className={styles.receiptLine}><span>Asuransi</span><span>50.000</span></div>}
                    {settingsState['Penjualan']?.['Platform'] && <div className={styles.receiptLine}><span>Platform</span><span>10.000</span></div>}
                    {settingsState['Penjualan']?.['Biaya Lainnya'] && <div className={styles.receiptLine}><span>Biaya Lainnya</span><span>10.000</span></div>}
                    {settingsState['Penjualan']?.['Diskon'] && <div className={styles.receiptLine}><span>Diskon</span><span>(100.000)</span></div>}
                    {settingsState['Penjualan']?.['Kupon'] && <div className={styles.receiptLine}><span>Kupon</span><span>(100.000)</span></div>}
                    {settingsState['Penjualan']?.['Poin'] && <div className={styles.receiptLine}><span>Poin</span><span>(300.000)</span></div>}
                    {settingsState['Penjualan']?.['Komplimen'] && <div className={styles.receiptLine}><span>Komplimen</span><span>(400.000)</span></div>}

                    {settingsState['Penjualan']?.['Total Penjualan'] && (
                      <>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Total Penjualan</span><span>370.000</span></div>
                      </>
                    )}
                    
                    {settingsState['Penjualan']?.['Total Refund'] && (
                      <>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Total Refund</span><span>(100.000)</span></div>
                      </>
                    )}
                    
                    {settingsState['Penjualan']?.['Total Penjualan Bersih'] && (
                      <>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Total Penjualan Bersih</span><span>270.000</span></div>
                        <div className={styles.receiptDivider}></div>
                      </>
                    )}
                  </>
                )}

                {activeTab === 'Transaksi' && settingsState['Transaksi']?.['Rincian Transaksi'] && (
                  <>
                    <div className={styles.receiptDividerDouble}></div>

                    {settingsState['Transaksi']?.['Transaksi Selesai'] && <div className={styles.receiptLine}><span>Transaksi Selesai</span><span>5</span></div>}
                    {settingsState['Transaksi']?.['Transaksi Belum Terbayar'] && <div className={styles.receiptLine}><span>Transaksi Belum Terbayar</span><span>2</span></div>}
                    {settingsState['Transaksi']?.['Transaksi Belum Terbayar (Rp)'] && <div className={styles.receiptLine}><span>Transaksi Belum Terbayar (Rp)</span><span>200.000</span></div>}
                    {settingsState['Transaksi']?.['Transaksi Void'] && <div className={styles.receiptLine}><span>Transaksi Void</span><span>1</span></div>}
                    {settingsState['Transaksi']?.['Transaksi Void (Rp)'] && <div className={styles.receiptLine}><span>Transaksi Void (Rp)</span><span>150.000</span></div>}
                    {settingsState['Transaksi']?.['Transaksi Penjualan Deposit'] && <div className={styles.receiptLine}><span>Transaksi Deposit</span><span>3</span></div>}
                    {settingsState['Transaksi']?.['Transaksi Penjualan Deposit (Rp)'] && <div className={styles.receiptLine}><span>Transaksi Deposit (Rp)</span><span>150.000</span></div>}

                    {(settingsState['Transaksi']?.['Penjualan per Transaksi'] || settingsState['Transaksi']?.['Produk per Transaksi']) && (
                      <div className={styles.receiptDivider}></div>
                    )}
                    {settingsState['Transaksi']?.['Penjualan per Transaksi'] && <div className={styles.receiptLine}><span>Penjualan per Transaksi</span><span>200.000</span></div>}
                    {settingsState['Transaksi']?.['Produk per Transaksi'] && <div className={styles.receiptLine}><span>Produk per Transaksi</span><span>40</span></div>}

                    <div className={styles.receiptDividerDouble}></div>

                    {settingsState['Transaksi']?.['Rincian Transaksi E-Commerce'] && (
                      <>
                        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>Informasi Transaksi E-Commerce</div>
                        <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>Per 13/08/2025, 00:00 - 13:00</div>

                        <div className={styles.receiptLine}><span>Masuk & Belum Selesai</span><span>5</span></div>
                        <div className={styles.receiptLine}><span>. Tokopedia (1)</span><span>100.000</span></div>
                        <div className={styles.receiptLine}><span>. Shopee (1)</span><span>100.000</span></div>
                        <div className={styles.receiptLine}><span>. Grabfood (2)</span><span>200.000</span></div>
                        <div className={styles.receiptLine}><span>. Gofood (1)</span><span>100.000</span></div>

                        <div className={styles.receiptLine}><span>Selesai</span><span>6</span></div>
                        <div className={styles.receiptLine}><span>. Tokopedia (1)</span><span>100.000</span></div>
                        <div className={styles.receiptLine}><span>. Shopee (1)</span><span>100.000</span></div>
                        <div className={styles.receiptLine}><span>. Grabfood (2)</span><span>200.000</span></div>
                        <div className={styles.receiptLine}><span>. Gofood (2)</span><span>200.000</span></div>

                        <div className={styles.receiptDividerDouble}></div>
                      </>
                    )}
                  </>
                )}
                {activeTab === 'Produk Penjualan' && settingsState['Produk Penjualan']?.['Rincian Produk Terjual'] && (
                  <>
                    {settingsState['Produk Penjualan']?.['Produk Terjual'] && (
                      <>
                        <div className={styles.receiptDividerDouble}></div>
                        <div style={{ fontWeight: 'bold', color: '#000000' }}>Produk Terjual</div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Aceh Gayo</span><span>100</span></div>
                        <div className={styles.receiptLine}><span>Roti</span><span>50</span></div>
                        <div className={styles.receiptLine}><span>Nasi Goreng</span><span>50</span></div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Total</span><span>200</span></div>
                      </>
                    )}

                    {settingsState['Produk Penjualan']?.['Produk Bonus'] && (
                      <>
                        <div className={styles.receiptDividerDouble}></div>
                        <div style={{ fontWeight: 'bold', color: '#000000' }}>Produk Bonus</div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Aceh Gayo</span><span>100</span></div>
                        <div className={styles.receiptLine}><span>Roti</span><span>20</span></div>
                        <div className={styles.receiptLine}><span>Nasi Goreng</span><span>50</span></div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Total</span><span>170</span></div>
                      </>
                    )}

                    {settingsState['Produk Penjualan']?.['Produk Refund'] && (
                      <>
                        <div className={styles.receiptDividerDouble}></div>
                        <div style={{ fontWeight: 'bold', color: '#000000' }}>Produk Refund</div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Roti</span><span>20</span></div>
                        <div className={styles.receiptLine}><span>Nasi Goreng</span><span>50</span></div>
                      </>
                    )}

                    {settingsState['Produk Penjualan']?.['Ekstra Terjual'] && (
                      <>
                        <div className={styles.receiptDividerDouble}></div>
                        <div style={{ fontWeight: 'bold', color: '#000000' }}>Ekstra Terjual</div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Aceh Gayo</span><span>100</span></div>
                        <div className={styles.receiptLine}><span>Roti</span><span>20</span></div>
                        <div className={styles.receiptLine}><span>Nasi Goreng</span><span>50</span></div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Total</span><span>170</span></div>
                      </>
                    )}

                    {settingsState['Produk Penjualan']?.['Ekstra Refund'] && (
                      <>
                        <div className={styles.receiptDividerDouble}></div>
                        <div style={{ fontWeight: 'bold', color: '#000000' }}>Ekstra Refund</div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Roti</span><span>20</span></div>
                        <div className={styles.receiptLine}><span>Nasi Goreng</span><span>50</span></div>
                      </>
                    )}

                    {settingsState['Produk Penjualan']?.['Deposit Terjual'] && (
                      <>
                        <div className={styles.receiptDividerDouble}></div>
                        <div style={{ fontWeight: 'bold', color: '#000000' }}>Deposit Terjual</div>
                        <div className={styles.receiptDivider}></div>
                        <div className={styles.receiptLine}><span>Langganan 3 Bulan</span><span>8</span></div>
                        <div className={styles.receiptLine}><span>Langganan 6 Bulan</span><span>8</span></div>
                        <div className={styles.receiptLine}><span>Silver</span><span>8</span></div>
                        <div className={styles.receiptLine}><span>Gold</span><span>8</span></div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>Batal</button>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className={styles.btnPrint} onClick={handlePrint}>
              <FiPrinter size={16} />
              Cetak
            </button>
            <button className={styles.btnSave} onClick={() => { onSave?.(settingsState); onClose(); }}>Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
