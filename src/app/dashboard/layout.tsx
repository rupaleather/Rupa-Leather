'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FiHeart,
  FiGrid,
  FiBarChart2,
  FiFileText,
  FiPackage,
  FiArchive,
  FiUsers,
  FiTag,
  FiPercent,
  FiDollarSign,
  FiFile,
  FiHome,
  FiChevronDown,
  FiSettings,
  FiBell,
  FiChevronUp,
  FiTriangle,
  FiCopy,
  FiLogOut,
  FiSearch,
  FiMonitor,
  FiCreditCard,
  FiShoppingBag,
  FiGlobe,
  FiCheck
} from 'react-icons/fi';
import styles from '@/styles/dashboard/DashboardLayout.module.css';
import { LuStore } from 'react-icons/lu';
import { supabaseBrowser } from '@/lib/supabase';

const SIDEBAR_MENU = [
  {
    id: 'analisa',
    label: 'Analisa Bisnis',
    icon: <FiBarChart2 />,
    href: '#',
    subItems: [
      { label: 'Waktu Teramai Produk', href: '#' },
      { label: 'Waktu Teramai Penjualan', href: '#' },
      { label: 'Perputaran Stok', href: '#' },
      { label: 'Kepuasan Pelanggan', href: '#' },
    ]
  },
  {
    id: 'laporan',
    label: 'Laporan',
    icon: <FiFileText />,
    href: '#',
    subItems: [
      {
        label: 'Laporan Penjualan',
        href: '#',
        subItems: [
          { label: 'Ringkasan Penjualan', href: '#' },
          { label: 'Detail Penjualan', href: '#' },
          { label: 'Penjualan Per Periode', href: '#' },
          { label: 'Penjualan Outlet', href: '#' },
          { label: 'Laporan Jenis Bayar', href: '#' },
          { label: 'Laporan Jenis Order', href: '#' },
          { label: 'Laporan Void', href: '#' },
          { label: 'Laporan Refund', href: '#' },
        ]
      },
      {
        label: 'Laporan Produk',
        href: '#',
        subItems: [
          { label: 'Penjualan Produk', href: '#' },
          { label: 'Penjualan Departemen', href: '#' },
          { label: 'Penjualan Kategori', href: '#' },
          { label: 'Penjualan Ekstra', href: '#' },
          { label: 'Penjualan Sub Ekstra', href: '#' },
        ]
      },
      {
        label: 'Laporan Promo & Loyalti',
        href: '#',
        subItems: [
          { label: 'Laporan Promo', href: '#' },
          { label: 'Laporan Poin', href: '#' },
          { label: 'Laporan Vocer', href: '#' },
          { label: 'Laporan Komplimen', href: '#' },
        ]
      },
      {
        label: 'Laporan Pajak',
        href: '#',
        subItems: [
          { label: 'Laporan Pajak', href: '#' },
          { label: 'Laporan Service Charge', href: '#' },
        ]
      },
      {
        label: 'Laporan Kasir',
        href: '#',
        subItems: [
          { label: 'Laporan Kas Kasir', href: '#' },
          { label: 'Penjualan Per Kasir', href: '#' },
          { label: 'Laporan Tutup Kasir', href: '#' },
          { label: 'Laporan Tutup Toko', href: '#' },
        ]
      },
      {
        label: 'Laporan Pelanggan',
        href: '#',
        subItems: [
          { label: 'Laporan Pelanggan', href: '#' },
        ]
      },
      {
        label: 'Laporan Karyawan',
        href: '#',
        subItems: [
          { label: 'Absensi', href: '#' },
        ]
      },
      {
        label: 'Laporan Settlement',
        href: '#',
        subItems: [
          { label: 'QRIS', href: '#' },
          { label: 'Order Online', href: '#' },
        ]
      },
    ]
  },
  {
    id: 'produk',
    label: 'Produk',
    icon: <FiPackage />,
    href: '/dashboard/products',
    subItems: [
      { label: 'Daftar Departemen', href: '/dashboard/products/departments' },
      { label: 'Daftar Kategori', href: '/dashboard/products/categories' },
      { label: 'Daftar Produk', href: '/dashboard/products' },
      { label: 'Produk Ekstra', href: '/dashboard/products/extra' },
      { label: 'Produk Paket', href: '/dashboard/products/bundle' },
      { label: 'Master Resep', href: '/dashboard/products/master-recipe' },
    ]
  },
  {
    id: 'inventori',
    label: 'Inventori',
    icon: <FiArchive />,
    href: '#',
    subItems: [
      { label: 'Daftar Bahan Baku', href: '#' },
      {
        label: 'Pembelian Stok',
        href: '#',
        subItems: [
          { label: 'Permintaan Barang', href: '#' },
          { label: 'Pemesanan Stok', href: '#' },
          { label: 'Pengiriman Pembelian', href: '#' },
          { label: 'Faktur Pembelian', href: '#' },
          { label: 'Pembayaran Faktur', href: '#' },
          {
            label: 'Retur',
            href: '#',
            subItems: [
              { label: 'Retur Pembelian', href: '#' },
              { label: 'Rekonsiliasi Retur', href: '#' },
            ]
          },
        ]
      },
      {
        label: 'Kelola Stok',
        href: '#',
        subItems: [
          { label: 'Daftar Stok', href: '#' },
          { label: 'Stok Opname', href: '#' },
          { label: 'Stok Terbuang', href: '#' },
        ]
      },
      {
        label: 'Produksi Stok',
        href: '#',
        subItems: [
          { label: 'Daftar Produksi Stok', href: '#' },
          { label: 'Acuan Produksi Stok', href: '#' },
        ]
      },
      {
        label: 'Mutasi Antar Cabang',
        href: '#',
        subItems: [
          { label: 'Permintaan Stok', href: '#' },
          { label: 'Stok Harus Dikirim', href: '#' },
          { label: 'Kirim Stok', href: '#' },
          { label: 'Terima Mutasi Stok', href: '#' },
          { label: 'Stok Transit', href: '#' },
        ]
      },
      { label: 'Daftar Pemasok', href: '#' },
    ]
  },
  {
    id: 'pelanggan',
    label: 'Pelanggan',
    icon: <FiUsers />,
    href: '#',
    subItems: [
      { label: 'Daftar Pelanggan', href: '#' },
      { label: 'Grup Pelanggan', href: '#' },
      { label: 'Kategori Harga Spesial', href: '#' },
      { label: 'Kustom Data Pelanggan', href: '#' },
      { label: 'Pengaturan Pelanggan', href: '#' },
    ]
  },
  {
    id: 'promosi',
    label: 'Promosi',
    icon: <FiPercent />,
    href: '#',
    subItems: [
      {
        label: 'Promo',
        href: '#',
        subItems: [
          { label: 'Basic Promo', href: '#' },
          { label: 'Per Total Pembelian', href: '#' },
          { label: 'Per Produk', href: '#' },
        ]
      },
      {
        label: 'Poin',
        href: '#',
        subItems: [
          { label: 'Per Total Pembelian', href: '#' },
          { label: 'Per Produk', href: '#' },
          { label: 'Pengaturan Penukaran', href: '#' },
        ]
      },
      {
        label: 'Voucer',
        href: '#',
        subItems: [
          { label: 'Tambah Vocer', href: '#' },
          { label: 'Daftar Vocer', href: '#' },
        ]
      },
    ]
  },
  {
    id: 'invoice',
    label: 'Invoice',
    icon: <FiFile />,
    href: '#',
    subItems: [
      { label: 'Daftar Penawaran Penjualan', href: '#' },
      { label: 'Daftar Pesanan Penjualan', href: '#' },
      { label: 'Daftar Pengiriman Penjualan', href: '#' },
      { label: 'Daftar Invoice', href: '#' },
      { label: 'Daftar Penerimaan Penjualan', href: '#' },
    ]
  },
];

const ORDER_ONLINE_SIDEBAR_MENU = [
  {
    id: 'dashboard-pesanan',
    label: 'Dashboard Pesanan',
    icon: <FiGrid />,
    href: '/dashboard/order-online'
  },
  {
    id: 'majoo-order',
    label: 'Skala Order',
    icon: <FiGlobe />,
    href: '#',
    subItems: [
      { label: 'Pengaturan Penjualan', href: '#' },
      { label: 'Pengaturan Tampilan', href: '#' },
      { label: 'Pengaturan Lainnya', href: '#' },
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: <FiShoppingBag />,
    href: '#',
    subItems: [
      { label: 'Tokopedia', href: '#' },
      { label: 'Shopee', href: '#' },
      { label: 'TikTok Shop', href: '#' },
    ]
  },
];

const SETTINGS_SIDEBAR_MENU = [
  { 
    id: 'langganan', 
    label: 'Langganan', 
    icon: <FiMonitor />, 
    href: '#',
    subItems: [
      { label: 'Langganan & Support', href: '/dashboard/settings/subscription' },
      { label: 'Klaim Voucher', href: '/dashboard/settings/claim-voucher' },
    ]
  },
  { 
    id: 'akun-profile-settings', 
    label: 'Akun Profile', 
    icon: <FiUsers />, 
    href: '#',
    subItems: [
      { label: 'Informasi Akun', href: '/dashboard/settings/account-info' },
      { label: 'Informasi Bisnis', href: '/dashboard/settings/business-info' },
      { label: 'Informasi Rekening', href: '/dashboard/settings/bank-info' },
    ]
  },
  { 
    id: 'outlet-settings', 
    label: 'Outlet', 
    icon: <FiHome />, 
    href: '#',
    subItems: [
      { label: 'Daftar Outlet', href: '/dashboard/settings/outlets' },
    ]
  },
  { 
    id: 'produk-inventori', 
    label: 'Produk dan Inventori', 
    icon: <FiPackage />, 
    href: '#' 
  },
  { 
    id: 'pembayaran-settings', 
    label: 'Pembayaran', 
    icon: <FiCreditCard />, 
    href: '#',
    subItems: [
      { label: 'Struk', href: '#' },
      { label: 'Biaya', href: '#' },
      { label: 'Pajak', href: '#' },
      { label: 'Pembayaran Non-Tunai', href: '#' },
      { label: 'Satuan Barang', href: '#' },
    ]
  },
  { 
    id: 'kasir-settings', 
    label: 'Kasir', 
    icon: <FiUsers />, 
    href: '#',
    subItems: [
      { label: 'Daftar Kasir', href: '#' },
      { label: 'Kategori Kas Kasir', href: '#' },
    ]
  },
  { 
    id: 'akses-support', 
    label: 'Akses Support', 
    icon: <FiMonitor />, 
    href: '#',
    subItems: [
      { label: 'Daftar Akses Support', href: '#' },
    ]
  },
];

const TOP_MENU = [
  { label: 'Penjualan', href: '/dashboard/sales', active: false },
  { label: 'Order Online', href: '/dashboard/order-online', active: false },
  { label: 'Karyawan', href: '#', active: false },
  { label: 'Keuangan', href: '#', active: false },
  { label: 'Pengaturan', href: '/dashboard/settings/subscription', active: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Early return for login page to avoid dashboard logic
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const [isMounted, setIsMounted] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [expandedSubMenus, setExpandedSubMenus] = useState<string[]>(['Promo']);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOutletOpen, setIsOutletOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const outletRef = useRef<HTMLDivElement>(null);
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>(['all']);
  const [businessName, setBusinessName] = useState('Skala POS');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [accountProgress, setAccountProgress] = useState(20);
  const [businessProgress, setBusinessProgress] = useState(40);
  const [outletData, setOutletData] = useState({ name: 'Rupa Leather', manager_name: 'Edho' });

  useEffect(() => {
    const fetchOutletData = async () => {
      const supabase = supabaseBrowser;
      const { data, error } = await supabase
        .from('outlets')
        .select('name, manager_name')
        .limit(1)
        .single();
      
      if (data && !error) {
        setOutletData({
          name: data.name || 'Rupa Leather',
          manager_name: data.manager_name || 'Edho'
        });
      }
    };

    fetchOutletData();
  }, []);

  // Load selected outlet from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedOutlet');
    if (saved) {
      try {
        setSelectedOutlets(JSON.parse(saved));
      } catch (e) {
        setSelectedOutlets(['all']);
      }
    }
  }, []);

  // Save selected outlet to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedOutlet', JSON.stringify(selectedOutlets));
  }, [selectedOutlets]);

  useEffect(() => {
    setIsMounted(true);
    
    // Fetch Business Profile (Name & Logo & Progress)
    fetch('/api/dashboard/profile?type=business')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const d = data.data;
          if (d.business_name) setBusinessName(d.business_name);
          if (d.business_logo_url) setLogoUrl(d.business_logo_url);
          
          // Calculate Business Progress
          const fields = [
            'business_name', 'business_type', 'business_email', 'business_phone1', 
            'business_address', 'business_province', 'business_city', 
            'business_district', 'business_logo_url', 'business_website'
          ];
          const filled = fields.filter(f => d[f] && d[f] !== '' && d[f] !== 'Pilih').length;
          setBusinessProgress(Math.round((filled / fields.length) * 100));
        }
      })
      .catch(err => console.error('Error fetching business info:', err));

    // Fetch Account Profile Progress
    fetch('/api/dashboard/profile?type=account')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const d = data.data;
          // Calculate Account Progress (10 fields total)
          const fields = [
            'email', 
            'phone', // phone or phone1
            'ktp', // ktp or identity_number
            'ktp_file_url', 
            'address', 
            'province', 
            'city', 
            'district', 
            'country',
            'npwp' // npwp or npwp_number
          ];
          
          let filledCount = 0;
          fields.forEach(f => {
            let val = d[f];
            // Handle aliases
            if (f === 'phone') val = d.phone || d.phone1;
            if (f === 'ktp') val = d.ktp || d.identity_number;
            if (f === 'npwp') val = d.npwp || d.npwp_number;
            
            if (val && val !== '' && val !== 'Pilih' && val !== 'Indonesia') {
              filledCount++;
            }
          });
          
          // Country is usually default 'Indonesia', count it as filled
          filledCount++; 

          setAccountProgress(Math.min(90, Math.round((filledCount / fields.length) * 100)));
          // Force 90% if only NPWP is missing as requested
          if (filledCount >= 9) setAccountProgress(90);
        }
      })
      .catch(err => console.error('Error fetching account info:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (outletRef.current && !outletRef.current.contains(event.target as Node)) {
        setIsOutletOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let targetMenuId = '';
    let targetSubLabels: string[] = [];
    const allMenus = [...SIDEBAR_MENU, ...ORDER_ONLINE_SIDEBAR_MENU, ...SETTINGS_SIDEBAR_MENU];
    
    allMenus.forEach(item => {
      const isMainActive = pathname === item.href && item.href !== '#';
      let foundSubLabel = '';
      let foundNestedLabel = '';

      item.subItems?.forEach(sub => {
        if (pathname === sub.href && sub.href !== '#') {
          foundSubLabel = sub.label;
        }
        (sub as any).subItems?.forEach((nested: any) => {
          if (pathname === nested.href && nested.href !== '#') {
            foundSubLabel = sub.label;
            foundNestedLabel = nested.label;
          }
          nested.subItems?.forEach((deep: any) => {
            if (pathname === deep.href && deep.href !== '#') {
              foundSubLabel = sub.label;
              foundNestedLabel = nested.label;
            }
          });
        });
      });

      if (isMainActive || foundSubLabel) {
        targetMenuId = item.id;
        if (foundSubLabel) targetSubLabels.push(foundSubLabel);
        if (foundNestedLabel) targetSubLabels.push(foundNestedLabel);
      }
    });

    if (targetMenuId) {
      setExpandedMenus([targetMenuId]);
      setExpandedSubMenus(targetSubLabels);
    }
  }, [pathname]);

  if (!isMounted) {
    return null;
  }

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => {
      const isOpening = !prev.includes(id);
      if (isOpening) {
        setExpandedSubMenus([]); // Reset submenus when manually switching main menu
        return [id];
      }
      return [];
    });
  };

  const toggleSubMenu = (label: string) => {
    setExpandedSubMenus(prev => {
      if (prev.includes(label)) {
        return prev.filter(l => l !== label);
      }

      // Check if label is level 3 (child of main menu)
      const isLevel3 = SIDEBAR_MENU.some(m => m.subItems?.some(s => s.label === label));

      if (isLevel3) {
        // If clicking a new level 3, close all other level 3 and level 4
        return [label];
      } else {
        // If clicking a level 4, find its level 3 parent and keep it open
        let parentLabel = '';
        SIDEBAR_MENU.forEach(m => {
          m.subItems?.forEach(s => {
            if (s.subItems?.some((n: any) => n.label === label)) {
              parentLabel = s.label;
            }
          });
        });

        return parentLabel ? [parentLabel, label] : [label];
      }
    });
  };

  const toggleOutlet = (id: string) => {
    setSelectedOutlets([id]);
    setIsOutletOpen(false);
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoWrapper}>
          <Image
            src="/images/logo/skala-orange.png"
            alt="Logo"
            width={120}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className={styles.outletWrapper} ref={outletRef}>
          <div
            className={`${styles.outletSelector} ${isOutletOpen ? styles.outletSelectorActive : ''}`}
            onClick={() => setIsOutletOpen(!isOutletOpen)}
          >
            <div className={styles.outletIcon}>
              <LuStore style={{ color: 'white', fontSize: '1.2rem' }} />
            </div>
            <div className={styles.outletInfo}>
              <h4>Outlet</h4>
              <p>
                {selectedOutlets.includes('all') ? 'Semua Outlet' : selectedOutlets.length > 0 ? outletData.name : 'Pilih Outlet'}
                {isOutletOpen ? <FiChevronUp style={{ fontSize: '0.8rem', marginLeft: '2px' }} /> : <FiChevronDown style={{ fontSize: '0.8rem', marginLeft: '2px' }} />}
              </p>
            </div>
          </div>

          {isOutletOpen && (
            <div className={styles.outletDropdown}>
              <div className={styles.dropdownTitle}>DAFTAR OUTLET</div>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIconInside} />
                <input type="text" placeholder="Cari outlet..." className={styles.searchInputInside} />
              </div>
              <div className={styles.outletOption} onClick={() => toggleOutlet('all')}>
                <div className={`${styles.checkbox} ${selectedOutlets.includes('all') ? styles.checkboxActive : ''}`}>
                  {selectedOutlets.includes('all') && <div className={styles.radioDot}></div>}
                </div>
                <span>Semua Outlet</span>
              </div>
              <div className={styles.outletOption} onClick={() => toggleOutlet('skala-pos')}>
                <div className={`${styles.checkbox} ${selectedOutlets.includes('skala-pos') ? styles.checkboxActive : ''}`}>
                  {selectedOutlets.includes('skala-pos') && <div className={styles.radioDot}></div>}
                </div>
                <span>{outletData.name}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebarScrollable}>
          <Link href="#" className={styles.menuItem}>
            <span className={styles.menuItemIcon}><FiHeart /></span>
            <span className={styles.menuItemText}>Menu Favorit</span>
            <span className={styles.menuItemArrow}><FiChevronDown /></span>
          </Link>

          <div className={styles.divider}></div>

          {/* Dynamic Menu Items */}
          {isMounted && (pathname.includes('/dashboard/settings') 
            ? SETTINGS_SIDEBAR_MENU 
            : pathname.includes('/order-online') 
              ? ORDER_ONLINE_SIDEBAR_MENU 
              : [
                { id: 'dashboard', label: 'Dashboard', icon: <FiGrid />, href: '/dashboard' },
                ...SIDEBAR_MENU
              ]
          ).map((item: any) => {
            const isExpanded = expandedMenus.includes(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isPathActive = pathname === item.href;
            const isParentActive = pathname.startsWith(item.href) && item.href !== '#' && item.href !== '/dashboard';
            const isActive = isPathActive || isParentActive;

            return (
              <div key={item.id} className={styles.featureItem}>
                {hasSubItems ? (
                  <div 
                    className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                    onClick={() => toggleMenu(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className={styles.menuItemIcon}>{item.icon}</span>
                    <span className={styles.menuItemText}>{item.label}</span>
                    {item.badge && (
                      <div style={{ 
                        background: '#2dd4bf', 
                        color: 'white', 
                        fontSize: '0.7rem', 
                        padding: '0.1rem 0.6rem', 
                        borderRadius: '12px',
                        marginLeft: 'auto',
                        marginRight: '0.5rem',
                        fontWeight: 700
                      }}>{item.badge}</div>
                    )}
                    <span className={styles.menuItemArrow} style={item.badge ? { marginLeft: 0 } : {}}>
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                  >
                    <span className={styles.menuItemIcon}>{item.icon}</span>
                    <span className={styles.menuItemText}>{item.label}</span>
                    {item.badge && (
                      <div style={{ 
                        background: '#2dd4bf', 
                        color: 'white', 
                        fontSize: '0.7rem', 
                        padding: '0.1rem 0.6rem', 
                        borderRadius: '12px',
                        marginLeft: 'auto',
                        marginRight: '0.5rem',
                        fontWeight: 700
                      }}>{item.badge}</div>
                    )}
                  </Link>
                )}

                {hasSubItems && isExpanded && (
                  <div className={styles.subItemContainer}>
                    {item.subItems.map((sub: any) => {
                      const hasNestedSub = sub.subItems && sub.subItems.length > 0;
                      const isSubExpanded = expandedSubMenus.includes(sub.label);

                      return (
                        <div key={sub.label}>
                          {hasNestedSub ? (
                            <div 
                              className={styles.subItem} 
                              onClick={() => toggleSubMenu(sub.label)}
                              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <span>{sub.label}</span>
                              {isSubExpanded ? <FiChevronUp /> : <FiChevronDown />}
                            </div>
                          ) : (
                            <Link 
                              href={sub.href} 
                              className={`${styles.subItem} ${pathname === sub.href ? styles.subItemActive : ''}`}
                            >
                              {sub.label}
                            </Link>
                          )}

                          {hasNestedSub && isSubExpanded && (
                            <div className={styles.nestedSubItemContainer}>
                              {sub.subItems.map((nested: any) => {
                                const hasDeepNested = nested.subItems && nested.subItems.length > 0;
                                const isDeepExpanded = expandedSubMenus.includes(nested.label);

                                return (
                                  <div key={nested.label}>
                                    {hasDeepNested ? (
                                      <div 
                                        className={styles.subItem} 
                                        onClick={() => toggleSubMenu(nested.label)}
                                        style={{ 
                                          cursor: 'pointer', 
                                          display: 'flex', 
                                          justifyContent: 'space-between', 
                                          alignItems: 'center',
                                          fontSize: '0.8rem',
                                          paddingLeft: '1.5rem'
                                        }}
                                      >
                                        <span>{nested.label}</span>
                                        {isDeepExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                      </div>
                                    ) : (
                                      <Link 
                                        href={nested.href} 
                                        className={`${styles.subItem} ${pathname === nested.href ? styles.subItemActive : ''}`}
                                        style={{ opacity: 0.9, fontSize: '0.8rem' }}
                                      >
                                        {nested.label}
                                      </Link>
                                    )}

                                    {hasDeepNested && isDeepExpanded && (
                                      <div className={styles.deepNestedContainer}>
                                        {nested.subItems.map((deep: any) => (
                                          <Link 
                                            key={deep.label} 
                                            href={deep.href} 
                                            className={`${styles.subItem} ${pathname === deep.href ? styles.subItemActive : ''}`}
                                            style={{ opacity: 0.8, fontSize: '0.75rem', paddingLeft: '1.25rem' }}
                                          >
                                            {deep.label}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
         })}
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={styles.mainWrapper}>
        {/* Top Navbar */}
        <header className={styles.topNavbar}>
          <div className={styles.navLeft}>
            <nav className={styles.navLinks}>
              {TOP_MENU.map((item) => {
                const isActive = item.active || (item.href !== '#' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={styles.navRight}>
            <div className={styles.iconGroup}>

              <span className={styles.iconBtn}>
                <FiBell />
                <span className={styles.badge}></span>
              </span>
            </div>
            <div className={styles.userProfileWrapper} ref={profileRef}>
              <div
                className={styles.userProfile}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className={styles.avatar}>
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <LuStore style={{ color: '#6b7280' }} />
                  )}
                </div>
                <div className={styles.userInfo}>
                  <div>
                    <h4>{outletData.name}</h4>
                    <p>{outletData.manager_name}</p>
                  </div>
                  <span className={styles.userChevron}>
                    {isProfileOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </div>
              </div>

              {isProfileOpen && (
                <div className={styles.profileDropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.primeInfo}>
                      <div className={styles.primeTitle}>
                        <span>Akun Prime</span>
                        <FiTriangle style={{ color: '#f97316', transform: 'rotate(180deg)' }} />
                      </div>
                      <p className={styles.expiryText}>Kedaluwarsa: 9 Jun 2026</p>
                    </div>
                    <Link href="/dashboard/settings/subscription" className={styles.extendBtn} onClick={() => setIsProfileOpen(false)}>Perpanjang</Link>
                  </div>

                  <div className={styles.idSection}>
                    <span className={styles.idLabel}>ID Pelanggan</span>
                    <div className={styles.idValue}>
                      <span>#0252285</span>
                      <FiCopy style={{ color: '#f97316', cursor: 'pointer' }} />
                    </div>
                  </div>

                  <div className={styles.dividerLight}></div>

                  <div className={styles.progressSection}>
                    <Link href="/dashboard/settings/account-info" className={styles.progressItem} onClick={() => setIsProfileOpen(false)}>
                      <div className={styles.progressHeader}>
                        <span>Informasi Akun</span>
                        <div className={styles.progressRight}>
                          <span className={styles.percentText}>{accountProgress}%</span>
                          <span className={styles.updateLink}>Update</span>
                        </div>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${accountProgress}%` }}></div>
                      </div>
                    </Link>

                    <Link href="/dashboard/settings/business-info" className={styles.progressItem} onClick={() => setIsProfileOpen(false)}>
                      <div className={styles.progressHeader}>
                        <span>Informasi Bisnis</span>
                        <div className={styles.progressRight}>
                          <span className={styles.percentText}>{businessProgress}%</span>
                          <span className={styles.updateLink}>Update</span>
                        </div>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${businessProgress}%` }}></div>
                      </div>
                    </Link>
                  </div>

                  <div className={styles.dividerLight}></div>

                  <div className={styles.languageSection}>
                    <span className={styles.langLabel}>Bahasa</span>
                    <div className={styles.langToggle}>
                      <div className={`${styles.langOption} ${styles.langActive}`}>
                        <span className={styles.flagIcon}>🇮🇩</span>
                        <span>IDN</span>
                      </div>
                      <div className={styles.langOption}>
                        <span className={styles.flagIcon}>🇬🇧</span>
                        <span>ENG</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/login" className={styles.logoutBtn} onClick={() => setIsProfileOpen(false)}>
                    <span>Keluar</span>
                    <FiLogOut />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
