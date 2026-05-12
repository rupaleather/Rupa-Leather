'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, 
  FiHelpCircle, 
  FiHeart, 
  FiSearch,
  FiChevronDown,
  FiArrowRight,
  FiX,
  FiGrid,
  FiCheck,
  FiMoreVertical,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi';
import styles from '@/styles/dashboard/products/Departments.module.css';

export default function DepartmentsPage() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);
  const [editingDeptId, setEditingDeptId] = useState<string | number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [departments, setDepartments] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<(string | number)[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/departments');
      const json = await res.json();
      if (json.success) {
        setDepartments(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      if (json.success) {
        setAllCategories(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchAllCategories();
  }, []);
  const [deptFormData, setDeptFormData] = useState({
    name: '',
    order: '',
    searchCategory: ''
  });

  const handleSaveDept = () => {
    if (deptFormData.name) {
      setShowConfirmModal(true);
    }
  };

  const handleFinalizeSave = async () => {
    const autoCode = deptFormData.name.toLowerCase().replace(/\s+/g, '-').substring(0, 50);
    
    try {
      if (editingDeptId) {
        // UPDATE
        const res = await fetch(`/api/departments/${editingDeptId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: deptFormData.name, 
            code: autoCode,
            order: deptFormData.order
          }),
        });
        const json = await res.json();
        if (json.success) {
          setNotificationText('Berhasil memperbarui departemen');
          setShowNotification(true);
          fetchDepartments();
        } else {
          setNotificationText(json.error || 'Gagal memperbarui');
          setShowNotification(true);
        }
      } else {
        // CREATE
        const res = await fetch('/api/departments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: deptFormData.name, 
            code: autoCode,
            order: deptFormData.order // Pastikan ini mengirim angka yang benar
          }),
        });
        const json = await res.json();
        if (json.success) {
          setNotificationText('Berhasil menyimpan departemen baru');
          setShowNotification(true);
          fetchDepartments();
        } else {
          setNotificationText(json.error || 'Gagal menyimpan');
          setShowNotification(true);
          return;
        }
      }

      // Update category-department relationships
      const deptId = editingDeptId || departments.find(d => d.name === deptFormData.name)?.id;
      if (deptId) {
        // Find categories that were previously in this dept but now unselected
        const prevCats = allCategories.filter(c => c.department_id === deptId).map(c => c.id);
        const toRemove = prevCats.filter(id => !selectedCategoryIds.includes(id));
        const toAdd = selectedCategoryIds.filter(id => !prevCats.includes(id));

        // Note: For a real production app, you might want a dedicated bulk API.
        // Here we'll do individual updates for simplicity, assuming small numbers.
        await Promise.all([
          ...toRemove.map(id => fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ department_id: null })
          })),
          ...toAdd.map(id => fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ department_id: deptId })
          }))
        ]);
      }
      
      setShowConfirmModal(false);
      setShowAddDepartment(false);
      setEditingDeptId(null);
      setSelectedCategoryIds([]);
      setDeptFormData({ name: '', order: '', searchCategory: '' });
      fetchDepartments(); // Refresh list to show updated category count
    } catch (error) {
      console.error(error);
      setNotificationText('Terjadi kesalahan pada server');
      setShowNotification(true);
    }
  };

  const handleCancel = () => {
    // Jika form masih kosong, langsung tutup saja
    if (!deptFormData.name && !deptFormData.order) {
      finalizeCancel();
    } else {
      setShowCancelConfirm(true);
    }
  };

  const finalizeCancel = () => {
    setDeptFormData({ name: '', order: '', searchCategory: '' });
    setEditingDeptId(null);
    setShowAddDepartment(false);
    setShowCancelConfirm(false);
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
    if (showAddDepartment) {
      fetchAllCategories();
    }
  }, [showAddDepartment]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    if (activeMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId]);

  const handleEdit = (id: string | number) => {
    const dept = departments.find(d => d.id === id);
    if (dept) {
      setDeptFormData({
        name: dept.name || '',
        order: dept.display_order || '',
        searchCategory: ''
      });
      setEditingDeptId(id);
      
      // Initialize selected categories for this department
      const deptCats = allCategories
        .filter(c => c.department_id === id)
        .map(c => c.id);
      setSelectedCategoryIds(deptCats);
      
      setShowAddDepartment(true);
    }
    setActiveMenuId(null);
  };

  const toggleCategory = (catId: string | number) => {
    setSelectedCategoryIds(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId) 
        : [...prev, catId]
    );
  };

  const handleDelete = async (id: number | string) => {
    try {
      const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (res.ok && json.success) {
        setActiveMenuId(null);
        setNotificationText('Berhasil menghapus departemen');
        setShowNotification(true);
        fetchDepartments();
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

  return (
    <div className={styles.container} style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Daftar Departemen</h1>
          <div className={styles.titleIcons}>
            <FiHelpCircle style={{ cursor: 'pointer' }} />
            <FiHeart style={{ cursor: 'pointer' }} />
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddDepartment(true)}>
          <FiPlus />
          <span>Tambah Departemen</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Cari..." className={styles.searchInput} />
        </div>
      </div>

      {/* Table Header */}
      <div className={styles.tableHeader} style={{ fontWeight: 600 }}>
        <div className={styles.headerItem}>DEPARTEMEN</div>
        <div className={styles.headerItem} style={{ textAlign: 'center', fontWeight: 600 }}>JUMLAH KATEGORI</div>
        <div className={styles.headerItem} style={{ textAlign: 'right', paddingRight: '3rem', fontWeight: 600 }}>URUTAN</div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, minHeight: '300px' }}>
        {departments.length > 0 ? (
          departments.map((dept) => (
            <div 
              key={dept.id} 
              onClick={(e) => {
                setActiveMenuId(activeMenuId === dept.id ? null : dept.id);
                setMenuPosition({ x: e.clientX, y: e.clientY });
              }}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr', 
                padding: '1.25rem 2rem', 
                borderBottom: '1px solid #f1f5f9',
                fontSize: '0.85rem',
                color: '#000000',
                fontFamily: "'Roboto', sans-serif",
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{ fontWeight: 400, color: '#000000' }}>{dept.name}</div>
              <div style={{ textAlign: 'center', color: '#000000' }}>
                {allCategories.filter(cat => cat.department_id === dept.id).length}
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2rem' }}>
                <span style={{ marginRight: '1rem', color: '#000000' }}>{dept.display_order || '-'}</span>
                <FiMoreVertical 
                  style={{ color: '#64748b' }} 
                />
                
                {activeMenuId === dept.id && (
                  <div 
                    ref={menuRef}
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
                      minWidth: '180px'
                    }}
                  >
                    <div 
                      onClick={() => handleEdit(dept.id)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        padding: '0.6rem 0.75rem', 
                        cursor: 'pointer',
                        borderRadius: '14px'
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', background: '#fff7ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b00' }}>
                        <FiEdit2 size={16} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>Ubah</span>
                    </div>
                    
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '0.4rem 0.75rem' }} />
                    
                    <div 
                      onClick={() => {
                        setDeptToDelete(dept);
                        setShowDeleteConfirm(true);
                        setActiveMenuId(null);
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        padding: '0.6rem 0.75rem', 
                        cursor: 'pointer',
                        borderRadius: '14px'
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', background: '#fff1f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                        <FiTrash2 size={16} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.85rem' }}>Hapus</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '4rem 0' }}>
            <p style={{ fontWeight: 700, color: '#64748b' }}>Memuat data...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', padding: '4rem 0' }}>
            <FiGrid style={{ fontSize: '4rem', color: '#f1f5f9' }} />
            <p style={{ fontWeight: 700, color: '#64748b' }}>Belum ada departemen</p>
          </div>
        )}
      </div>

      {/* Footer / Pagination */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.showCount}>
            <span>Tampilkan:</span>
            <div className={styles.countSelect}>
              <span>10</span>
              <FiChevronDown />
            </div>
          </div>
          <span>Ditampilkan {departments.length > 0 ? '1 - ' + departments.length : '0 - 0'} dari {departments.length} data</span>
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

      {/* Tambah Departemen Full Screen View */}
      {showAddDepartment && (
        <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar */}
          <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 2rem', position: 'relative' }}>
            <FiX 
              style={{ fontSize: '1.5rem', color: '#64748b', cursor: 'pointer' }} 
              onClick={handleCancel} 
            />
            <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              {editingDeptId ? 'Ubah Departemen' : 'Tambah Departemen'}
            </h1>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '3rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ background: 'white', borderRadius: '32px', padding: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2.5rem', color: '#000' }}>Informasi Departemen</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Nama Departemen */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '220px', fontSize: '1rem', fontWeight: 400, color: '#000' }}>Nama Departemen <span style={{ color: '#ef4444' }}>*</span></div>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="text" 
                        placeholder="Contoh: Retail" 
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                        value={deptFormData.name}
                        onChange={(e) => setDeptFormData({...deptFormData, name: e.target.value})}
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
                        value={deptFormData.order}
                        onChange={(e) => setDeptFormData({...deptFormData, order: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Daftar Kategori */}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '220px', fontSize: '1rem', fontWeight: 400, color: '#000', marginTop: '0.75rem' }}>Daftar Kategori</div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                          type="text" 
                          placeholder="Cari kategori ..." 
                          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                          value={deptFormData.searchCategory}
                          onChange={(e) => setDeptFormData({...deptFormData, searchCategory: e.target.value})}
                        />
                      </div>

                      {/* Empty State for Categories inside form */}
                      <div style={{ 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '16px', 
                        overflow: 'hidden'
                      }}>
                        {allCategories
                          .filter(cat => 
                            cat.name.toLowerCase().includes(deptFormData.searchCategory.toLowerCase())
                          ).length > 0 ? (
                          allCategories
                            .filter(cat => 
                              cat.name.toLowerCase().includes(deptFormData.searchCategory.toLowerCase())
                            )
                            .map((cat, idx) => (
                              <div 
                                key={cat.id} 
                                style={{ 
                                  padding: '1rem 1.5rem', 
                                  borderBottom: idx === allCategories.filter(c => c.name.toLowerCase().includes(deptFormData.searchCategory.toLowerCase())).length - 1 ? 'none' : '1px solid #f1f5f9',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  background: 'white',
                                  cursor: 'pointer'
                                }}
                                onClick={() => toggleCategory(cat.id)}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <div style={{ 
                                    width: '18px', 
                                    height: '18px', 
                                    background: selectedCategoryIds.includes(cat.id) ? '#ff6b00' : 'transparent', 
                                    borderRadius: '5px', 
                                    border: selectedCategoryIds.includes(cat.id) ? 'none' : '2px solid #e2e8f0',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                  }}>
                                    {selectedCategoryIds.includes(cat.id) && <FiCheck style={{ fontSize: '0.7rem', color: 'white', strokeWidth: 5 }} />}
                                  </div>
                                  <span style={{ fontSize: '0.95rem', color: '#0f172a' }}>{cat.name}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                  {cat.productCount || 0} item
                                </div>
                              </div>
                            ))
                        ) : (
                          <div style={{ 
                            padding: '3rem 1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem'
                          }}>
                            <div style={{ width: '60px', height: '60px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiGrid style={{ fontSize: '1.5rem', color: '#e2e8f0' }} />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>Kategori tidak ditemukan</p>
                          </div>
                        )}
                      </div>

                      {selectedCategoryIds.length > 0 && (
                        <div style={{ fontSize: '0.85rem', color: '#ff6b00', fontWeight: 400, marginTop: '0.25rem' }}>
                          {selectedCategoryIds.length} kategori dipilih
                        </div>
                      )}
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
                background: (!deptFormData.name || !deptFormData.order) ? '#f1f5f9' : '#ff6b00', 
                color: (!deptFormData.name || !deptFormData.order) ? '#94a3b8' : 'white', 
                border: 'none', 
                padding: '0.75rem 4rem', 
                borderRadius: '12px', 
                fontWeight: 700, 
                fontSize: '1rem', 
                cursor: (!deptFormData.name || !deptFormData.order) ? 'not-allowed' : 'pointer'
              }}
              disabled={!deptFormData.name || !deptFormData.order}
              onClick={() => setShowConfirmModal(true)}
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>{editingDeptId ? 'Simpan Perubahan' : 'Simpan Departemen Baru'}</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Departemen <strong style={{ color: '#0f172a' }}>{deptFormData.name}</strong> akan {editingDeptId ? 'diperbarui' : 'tersimpan'} dan tampil di menu daftar departemen, Lanjutkan?
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={handleFinalizeSave}
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
                Ya, Lanjutkan
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
                Batal
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Hapus Departemen?</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Departemen <strong style={{ color: '#0f172a' }}>{deptToDelete?.name}</strong> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  handleDelete(deptToDelete.id);
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
                Batal {editingDeptId ? 'Ubah' : 'Tambah'} Departemen
              </h3>
              <FiX style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#64748b' }} onClick={() => setShowCancelConfirm(false)} />
            </div>
            <div style={{ padding: '2rem' }}>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
                Membatalkan <strong style={{ color: '#1e293b' }}>{editingDeptId ? 'Ubah' : 'Tambah'} Departemen</strong> akan menghapus seluruh data yang telah diinput dan tidak dapat dibatalkan. Lanjutkan?
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
          <div style={{ width: '24px', height: '24px', background: notificationText.includes('hapus') ? '#ef4444' : '#ff6b00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
            <FiCheck strokeWidth={4} />
          </div>
          <span style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{notificationText}</span>
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
