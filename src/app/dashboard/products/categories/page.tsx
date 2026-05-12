'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FiPlus,
  FiHelpCircle,
  FiHeart,
  FiGrid,
  FiX,
  FiChevronDown,
  FiCheck,
  FiArrowRight,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiPackage
} from 'react-icons/fi';
import styles from '@/styles/dashboard/products/Categories.module.css';

export default function CategoriesPage() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const deptDropdownRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableDepts, setAvailableDepts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCatId, setEditingCatId] = useState<string | number | null>(null);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/categories');
      const json = await res.json();
      console.log('Categories data from API:', json);
      if (json.success && json.data) {
        setCategories(json.data);
      } else {
        setCategories([]);
        console.error('API Error or no data:', json.error);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [selectedOutlets, setSelectedOutlets] = useState(['Kedai Laras']);
  const [categoryFormData, setCategoryFormData] = useState({
    outlets: 'Kedai Laras',
    name: '',
    order: '',
    department: '',
    showInMenu: false
  });

  const isFormValid = selectedOutlets.length > 0 && 
                    categoryFormData.name.trim() !== '' && 
                    categoryFormData.order.trim() !== '';

  const handleSaveCategory = () => {
    if (isFormValid) {
      setShowConfirmModal(true);
    }
  };

  const handleFinalizeSaveCategory = async () => {
    const autoCode = categoryFormData.name.toLowerCase().replace(/\s+/g, '-').substring(0, 50);
    
    try {
      const url = editingCatId ? `/api/categories/${editingCatId}` : '/api/categories';
      const method = editingCatId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryFormData.name,
          code: autoCode,
          department_id: categoryFormData.department || null,
          order: categoryFormData.order,
          is_active: categoryFormData.showInMenu
        })
      });
      
      const json = await res.json();
      if (json.success) {
        setNotificationText(editingCatId ? 'Berhasil mengubah kategori' : 'Berhasil menyimpan kategori baru');
        setShowNotification(true);
        fetchCategories();
      } else {
        setNotificationText(json.error || 'Gagal menyimpan');
        setShowNotification(true);
      }
      
      setShowConfirmModal(false);
      setShowAddCategory(false);
      setEditingCatId(null);
      setCategoryFormData({
        outlets: 'Kedai Laras',
        name: '',
        order: '',
        department: '',
        showInMenu: false
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (res.ok && json.success) {
        setActiveMenuId(null);
        setNotificationText('Berhasil menghapus kategori');
        setShowNotification(true);
        fetchCategories();
      } else {
        setActiveMenuId(null);
        setNotificationText(json.error || 'Gagal menghapus');
        setShowNotification(true);
      }
    } catch (error) {
      console.error(error);
      setActiveMenuId(null);
      setNotificationText('Terjadi kesalahan koneksi');
      setShowNotification(true);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingCatId(cat.id);
    setCategoryFormData({
      outlets: 'Kedai Laras',
      name: cat.name,
      order: cat.display_order || cat.order || '',
      department: cat.department_id || '',
      showInMenu: cat.is_active
    });
    setShowAddCategory(true);
    setActiveMenuId(null);
  };

  const handleCancel = () => {
    // Jika form masih kosong, langsung tutup saja
    if (!categoryFormData.name && !categoryFormData.order) {
      finalizeCancel();
    } else {
      setShowCancelConfirm(true);
    }
  };

  const finalizeCancel = () => {
    setCategoryFormData({
      outlets: 'Kedai Laras',
      name: '',
      order: '',
      department: '',
      showInMenu: false
    });
    setSelectedOutlets(['Kedai Laras']);
    setShowAddCategory(false);
    setShowCancelConfirm(false);
    setEditingCatId(null);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOutletDropdownOpen(false);
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load available departments from backend API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch('/api/departments');
        const json = await res.json();
        if (json.success) {
          setAvailableDepts(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch departments', error);
      }
    };

    if (showAddCategory) {
      fetchDepartments();
    }
  }, [showAddCategory]);

  return (
    <div className={styles.container} style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Daftar Kategori</h1>
          <div className={styles.titleIcons}>
            <FiHelpCircle style={{ cursor: 'pointer' }} />
            <FiHeart style={{ cursor: 'pointer' }} />
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddCategory(true)}>
          <FiPlus />
          <span>Tambah Kategori</span>
        </button>
      </header>

      {/* Table Header */}
      <div className={styles.tableHeader} style={{ fontWeight: 600 }}>
        <div className={styles.headerItem} style={{ fontWeight: 600 }}>NAMA KATEGORI</div>
        <div className={styles.headerItem} style={{ textAlign: 'center', fontWeight: 600 }}>JUMLAH PRODUK</div>
        <div className={styles.headerItem} style={{ textAlign: 'center', fontWeight: 600 }}>URUTAN</div>
        <div className={styles.headerItem} style={{ fontWeight: 600 }}>DEPARTEMEN</div>
        <div className={styles.headerItem} style={{ textAlign: 'center', fontWeight: 600 }}>STATUS</div>
        <div className={styles.headerItem}></div>
      </div>

      {/* Table Content */}
      <div style={{ flex: 1, minHeight: '450px', display: 'flex', flexDirection: 'column', background: 'white' }}>
        {isLoading ? (
          <div className={styles.content}>
            <p style={{ textAlign: 'center', padding: '4rem', color: '#64748b', fontWeight: 700 }}>Memuat data...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className={styles.content}>
            <div className={styles.emptyState} style={{ marginTop: '4rem' }}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: '#f8fafc',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiGrid style={{ fontSize: '3rem', color: '#e2e8f0' }} />
                </div>
              </div>
              <p className={styles.emptyText}>Belum ada kategori</p>
            </div>
          </div>
        ) : (
          categories.map((cat) => (
            <div 
              key={cat.id} 
              className={styles.row}
              onClick={(e) => {
                setActiveMenuId(activeMenuId === cat.id ? null : cat.id);
                setMenuPosition({ x: e.clientX, y: e.clientY });
              }}
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              <div style={{ fontWeight: 400, color: '#000000' }}>{cat.name}</div>
              <div style={{ textAlign: 'center', color: '#000000' }}>{cat.productCount || 0} item</div>
              <div style={{ textAlign: 'center', color: '#000000' }}>{cat.display_order || '-'}</div>
              <div style={{ color: '#000000' }}>{availableDepts.find(d => d.id === cat.department_id)?.name || '-'}</div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  background: cat.is_active ? '#fff7ed' : '#f1f5f9',
                  color: cat.is_active ? '#ff6b00' : '#94a3b8'
                }}>
                  {cat.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
              <div style={{ textAlign: 'right', position: 'relative' }}>
                <FiMoreVertical style={{ color: '#cbd5e1' }} />
                
                {activeMenuId === cat.id && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                      position: 'fixed', 
                      top: `${menuPosition.y + 150 > window.innerHeight ? menuPosition.y - 130 : menuPosition.y + 10}px`, 
                      left: `${menuPosition.x + 200 > window.innerWidth ? menuPosition.x - 190 : menuPosition.x}px`, 
                      background: 'white', 
                      borderRadius: '20px', 
                      padding: '0.5rem', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      minWidth: '180px',
                      textAlign: 'left'
                    }}
                  >
                    <div 
                      onClick={() => handleEdit(cat)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', cursor: 'pointer', borderRadius: '14px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '32px', height: '32px', background: '#fff7ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b00' }}>
                        <FiEdit2 size={14} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>Ubah</span>
                    </div>
                    
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0.4rem 0.75rem' }} />

                    <div 
                      onClick={() => {
                        // Logika navigasi ke daftar produk kategori ini bisa ditambahkan nanti
                        setActiveMenuId(null);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', cursor: 'pointer', borderRadius: '14px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '32px', height: '32px', background: '#f0f9ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                        <FiPackage size={14} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>Lihat Produk</span>
                    </div>
                    
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0.4rem 0.75rem' }} />
                    
                    <div 
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setShowDeleteConfirm(true);
                        setActiveMenuId(null);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', cursor: 'pointer', borderRadius: '14px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '32px', height: '32px', background: '#fff1f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                        <FiTrash2 size={14} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.85rem' }}>Hapus</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.showCount}>
            <span>Tampilkan:</span>
            <div className={styles.countSelect}>
              10 <FiChevronDown />
            </div>
          </div>
          <span>Ditampilkan {categories.length > 0 ? 1 : 0} - {categories.length} dari {categories.length} data</span>
        </div>
        
        <div className={styles.footerRight}>
          <div className={styles.pageControls}>
            <div className={styles.pageNum}>1</div>
            <div className={styles.nextBtn}>
              <span>Selanjutnya</span>
              <FiArrowRight />
            </div>
          </div>
          
          <div className={styles.gotoPage}>
            <span>Ke Halaman</span>
            <div className={styles.gotoInput}>...</div>
          </div>
        </div>
      </footer>

      {/* Tambah Kategori Full Screen View */}
      {showAddCategory && (
        <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar */}
          <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 2rem', position: 'relative' }}>
            <FiX
              style={{ fontSize: '1.5rem', color: '#64748b', cursor: 'pointer' }}
              onClick={handleCancel}
            />
            <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              {editingCatId ? 'Ubah Kategori' : 'Tambah Kategori'}
            </h1>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '3rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ background: 'white', borderRadius: '32px', padding: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2.5rem', color: '#000' }}>Informasi Kategori</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Atur Outlet */}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '220px', fontSize: '1rem', fontWeight: 400, color: '#000', marginTop: '0.75rem' }}>Atur Outlet <span style={{ color: '#ef4444' }}>*</span></div>
                    <div style={{ flex: 1, position: 'relative' }} ref={dropdownRef}>
                      <div 
                        onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem 1rem', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          color: '#0f172a',
                          cursor: 'pointer',
                          background: 'white'
                        }}
                      >
                        <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{selectedOutlets.length} Outlet Terpilih</span>
                        <FiChevronDown style={{ transform: isOutletDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: '#94a3b8' }} />
                      </div>

                      {isOutletDropdownOpen && (
                        <div style={{ 
                          position: 'absolute', 
                          top: 'calc(100% + 8px)', 
                          left: 0, 
                          right: 0, 
                          background: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '16px', 
                          zIndex: 10,
                          overflow: 'hidden',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}>
                          {/* Pilih Semua */}
                          <div 
                            style={{ 
                              padding: '1rem', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              borderBottom: '1px solid #f1f5f9'
                            }}
                          >
                            <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 500 }}>Pilih Semua</span>
                            <div 
                              onClick={() => {
                                if (selectedOutlets.length === 1) setSelectedOutlets([]);
                                else setSelectedOutlets(['Kedai Laras']);
                              }}
                              style={{ 
                                width: '22px', 
                                height: '22px', 
                                borderRadius: '6px', 
                                background: selectedOutlets.length === 1 ? '#ff6b00' : 'transparent',
                                border: selectedOutlets.length === 1 ? 'none' : '2px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              {selectedOutlets.length === 1 && <FiCheck strokeWidth={4} />}
                            </div>
                          </div>
                          {/* Kedai Laras */}
                          <div 
                            style={{ 
                              padding: '1rem', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center'
                            }}
                          >
                            <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 500 }}>Kedai Laras</span>
                            <div 
                              onClick={() => {
                                if (selectedOutlets.includes('Kedai Laras')) setSelectedOutlets([]);
                                else setSelectedOutlets(['Kedai Laras']);
                              }}
                              style={{ 
                                width: '22px', 
                                height: '22px', 
                                borderRadius: '6px', 
                                background: selectedOutlets.includes('Kedai Laras') ? '#ff6b00' : 'transparent',
                                border: selectedOutlets.includes('Kedai Laras') ? 'none' : '2px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              {selectedOutlets.includes('Kedai Laras') && <FiCheck strokeWidth={4} />}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nama Kategori */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '220px', fontSize: '1rem', fontWeight: 400, color: '#000' }}>Nama Kategori <span style={{ color: '#ef4444' }}>*</span></div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Contoh: Tas Pria"
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Urutan Tampilan */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '220px', fontSize: '1rem', fontWeight: 400, color: '#000' }}>Urutan Tampilan <span style={{ color: '#ef4444' }}>*</span></div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Contoh: 1"
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                        value={categoryFormData.order}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, order: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Departemen */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '220px', fontSize: '1rem', fontWeight: 400, color: '#000' }}>Departemen</div>
                    <div style={{ flex: 1, position: 'relative' }} ref={deptDropdownRef}>
                      <div 
                        onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem 1rem', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          color: categoryFormData.department ? '#0f172a' : '#94a3b8',
                          cursor: 'pointer',
                          background: 'white'
                        }}
                      >
                        <span style={{ fontWeight: 400 }}>
                          {categoryFormData.department 
                            ? (availableDepts.find(d => d.id === categoryFormData.department)?.name || 'Pilih ...')
                            : 'Pilih ...'
                          }
                        </span>
                        <FiChevronDown style={{ transform: isDeptDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </div>

                      {isDeptDropdownOpen && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: 0, 
                          right: 0, 
                          background: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '12px', 
                          marginTop: '0.5rem', 
                          zIndex: 10, 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}>
                          {availableDepts.length > 0 ? (
                            availableDepts.map((dept) => (
                              <div 
                                key={dept.id}
                                onClick={() => {
                                  setCategoryFormData({ ...categoryFormData, department: dept.id });
                                  setIsDeptDropdownOpen(false);
                                }}
                                style={{ 
                                  padding: '0.75rem 1rem', 
                                  cursor: 'pointer',
                                  fontSize: '0.95rem',
                                  color: categoryFormData.department === dept.id ? '#ff6b00' : '#1e293b',
                                  background: categoryFormData.department === dept.id ? '#fff4ed' : 'transparent',
                                  fontWeight: categoryFormData.department === dept.id ? 600 : 400,
                                  borderBottom: '1px solid #f1f5f9',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (categoryFormData.department !== dept.id) {
                                    e.currentTarget.style.background = '#f8fafc';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (categoryFormData.department !== dept.id) {
                                    e.currentTarget.style.background = 'transparent';
                                  }
                                }}
                              >
                                <span>{dept.name}</span>
                                {categoryFormData.department === dept.id && <FiCheck />}
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                              Belum ada departemen
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tampil di Menu */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '220px', fontSize: '1rem', fontWeight: 400, color: '#000' }}>Tampil di Menu</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        onClick={() => setCategoryFormData({ ...categoryFormData, showInMenu: !categoryFormData.showInMenu })}
                        style={{
                          width: '50px',
                          height: '24px',
                          background: categoryFormData.showInMenu ? '#ff6b00' : '#cbd5e1',
                          borderRadius: '20px',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background 0.3s'
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          background: 'white',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '3px',
                          left: categoryFormData.showInMenu ? '29px' : '3px',
                          transition: 'left 0.3s'
                        }} />
                        <span style={{ position: 'absolute', right: categoryFormData.showInMenu ? 'auto' : '6px', left: categoryFormData.showInMenu ? '6px' : 'auto', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 800, color: 'white' }}>
                          {categoryFormData.showInMenu ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Tampilkan kategori pada aplikasi kasir</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Bar */}
          <footer style={{ height: '80px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <button
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontWeight: 700, fontSize: '1rem', padding: '0.6rem 2rem', cursor: 'pointer' }}
              onClick={handleCancel}
            >
              BATAL
            </button>
            <button
              style={{ 
                background: !isFormValid ? '#f1f5f9' : '#ff6b00', 
                color: !isFormValid ? '#94a3b8' : 'white', 
                border: 'none', 
                padding: '0.75rem 4rem', 
                borderRadius: '12px', 
                fontWeight: 700, 
                fontSize: '1rem', 
                cursor: !isFormValid ? 'not-allowed' : 'pointer'
              }}
              disabled={!isFormValid}
              onClick={handleSaveCategory}
            >
              SIMPAN
            </button>
          </footer>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: 'white', width: '440px', borderRadius: '32px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Simpan Kategori Baru</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Kategori <strong style={{ color: '#0f172a' }}>{categoryFormData.name}</strong> akan tersimpan dan tampil di menu, Lanjutkan?
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={handleFinalizeSaveCategory}
                style={{ 
                  background: '#ff6b00', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1rem', 
                  borderRadius: '16px', 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 107, 0, 0.2)'
                }}
              >
                YA, LANJUTKAN
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)}
                style={{ 
                  background: '#f8fafc', 
                  color: '#64748b', 
                  border: 'none', 
                  padding: '1rem', 
                  borderRadius: '16px', 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  cursor: 'pointer'
                }}
              >
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: 'white', width: '440px', borderRadius: '32px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
            <div style={{ width: '64px', height: '64px', background: '#fff1f2', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 1.5rem' }}>
              <FiTrash2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Hapus Kategori?</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Kategori <strong style={{ color: '#0f172a' }}>{categoryToDelete?.name}</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  handleDelete(categoryToDelete.id);
                  setShowDeleteConfirm(false);
                }}
                style={{ 
                  background: '#ef4444', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1rem', 
                  borderRadius: '16px', 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                }}
              >
                Ya, Lanjutkan
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{ 
                  background: '#f8fafc', 
                  color: '#64748b', 
                  border: 'none', 
                  padding: '1rem', 
                  borderRadius: '16px', 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: 'white', width: '480px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}>
            <div style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
                Batal Tambah Kategori
              </h3>
              <FiX style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#64748b' }} onClick={() => setShowCancelConfirm(false)} />
            </div>
            <div style={{ padding: '2rem' }}>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
                Membatalkan <strong style={{ color: '#1e293b' }}>Tambah Kategori</strong> akan menghapus seluruh data yang telah diinput dan tidak dapat dibatalkan. Lanjutkan?
              </p>
            </div>
            <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#ffffff' }}>
              <button 
                onClick={() => setShowCancelConfirm(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', padding: '0.5rem 1rem' }}
              >
                Batal
              </button>
              <button 
                onClick={finalizeCancel}
                style={{ 
                  background: '#ef4444', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '12px', 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  cursor: 'pointer' 
                }}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div style={{ 
          position: 'fixed', 
          top: '2rem', 
          right: '2rem', 
          background: 'white', 
          padding: '1rem 2rem', 
          borderRadius: '12px', 
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 4000,
          borderLeft: '4px solid #ff6b00',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ width: '24px', height: '24px', background: '#ff6b00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <FiCheck strokeWidth={4} />
          </div>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{notificationText}</span>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
