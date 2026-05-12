'use client';

import React, { useState } from 'react';
import {
  FiPlus,
  FiStar,
  FiClock,
  FiSearch,
  FiChevronDown,
  FiArrowRight,
  FiX,
  FiTrash2,
  FiCheck
} from 'react-icons/fi';
import styles from '@/styles/dashboard/products/Categories.module.css';

export default function MasterRecipePage() {
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '' });
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isAddingNewIngredient, setIsAddingNewIngredient] = useState(false);
  const [showConfirmRecipeModal, setShowConfirmRecipeModal] = useState(false);
  const [recipesList, setRecipesList] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [inventoryItems, setInventoryItems] = useState([
    { id: 'i1', name: 'wipecream', cost: 'Rp 25.000', unit: 'ml' },
    { id: 'i2', name: 'Uht', cost: 'Rp 18.000', unit: 'Liter' },
    { id: 'i3', name: 'Terasi', cost: 'Rp 5.000', unit: 'Gram' },
    { id: 'i4', name: 'tepung merah', cost: 'Rp 12.000', unit: 'Kg' }
  ]);
  const [newIngredientData, setNewIngredientData] = useState({
    name: '',
    monitoring: false,
    minStock: '',
    units: [
      { id: Date.now(), unit: '', conversion: '1', buyPrice: '', sku: '' }
    ]
  });

  const handleNumberInput = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const formattedValue = numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
    setNewIngredientData({ ...newIngredientData, [field]: formattedValue });
  };

  React.useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleUnitInput = (id: number, field: string, value: string, formatNumber = false) => {
    let finalValue = value;
    if (formatNumber) {
      const numericValue = value.replace(/[^0-9]/g, '');
      finalValue = numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
    }
    setNewIngredientData({
      ...newIngredientData,
      units: newIngredientData.units.map(u => u.id === id ? { ...u, [field]: finalValue } : u)
    });
  };

  const addUnitRow = () => {
    setNewIngredientData({
      ...newIngredientData,
      units: [...newIngredientData.units, { id: Date.now(), unit: '', conversion: '', buyPrice: '', sku: '' }]
    });
  };

  const removeUnitRow = (id: number) => {
    if (newIngredientData.units.length > 1) {
      setNewIngredientData({
        ...newIngredientData,
        units: newIngredientData.units.filter(u => u.id !== id)
      });
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: '', cost: 'Rp 0', amount: '', unit: '' }]);
  };

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
    if (activeDropdownId === id) setActiveDropdownId(null);
  };

  const selectIngredientItem = (rowId: number, item: any) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id === rowId) {
        return { ...ing, name: item.name, cost: item.cost, unit: item.unit };
      }
      return ing;
    }));
    setActiveDropdownId(null);
    setDropdownSearch('');
  };

  const handleSaveNewIngredient = () => {
    const primaryUnit = newIngredientData.units[0];
    const newItem = {
      id: Date.now().toString(),
      name: newIngredientData.name,
      cost: `Rp ${primaryUnit.buyPrice}`,
      unit: primaryUnit.unit
    };
    setInventoryItems([...inventoryItems, newItem]);
    setIsAddingNewIngredient(false);
    setNotification({ show: true, message: `Bahan baku ${newIngredientData.name} berhasil ditambah` });
    setNewIngredientData({
      name: '',
      monitoring: false,
      minStock: '',
      units: [
        { id: Date.now(), unit: '', conversion: '1', buyPrice: '', sku: '' }
      ]
    });
  };

  const handleSaveRecipeConfirm = () => {
    const newRecipe = {
      id: Date.now(),
      code: formData.code,
      name: formData.name,
      ingredientCount: ingredients.length
    };
    setRecipesList([...recipesList, newRecipe]);
    setShowConfirmRecipeModal(false);
    setIsAddingRecipe(false);
    setFormData({ code: '', name: '' });
    setIngredients([]);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Master Resep</h1>
          <div className={styles.titleIcons}>
            <FiStar style={{ cursor: 'pointer', color: '#94a3b8' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <FiClock style={{ color: '#ff6b00', fontSize: '1.2rem', cursor: 'pointer' }} />
          <span style={{ color: '#ff6b00', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Impor Data</span>
          <span style={{ color: '#ff6b00', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Ekspor Data</span>
          <button 
            onClick={() => setIsAddingRecipe(true)}
            style={{ 
            background: '#ff6b00', 
            color: 'white', 
            border: 'none', 
            padding: '0.6rem 1rem', 
            borderRadius: '8px', 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}>
            <FiPlus style={{ fontSize: '1.1rem' }} />
            <span>Tambah Resep</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          border: '1px solid #cbd5e1', 
          borderRadius: '8px', 
          padding: '0.5rem 1rem', 
          width: '300px',
          gap: '0.5rem'
        }}>
          <FiSearch style={{ color: '#64748b', fontSize: '1.1rem' }} />
          <input 
            type="text" 
            placeholder="Cari ..." 
            style={{ 
              border: 'none', 
              outline: 'none', 
              fontSize: '0.9rem', 
              width: '100%',
              color: '#334155'
            }} 
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: '400px', background: 'white', display: 'flex', flexDirection: 'column' }}>
        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 40px', padding: '1.25rem 2rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>KODE MASTER RESEP</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>NAMA RESEP PRODUK</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>JUMLAH BAHAN</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '24px', height: '24px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <FiPlus style={{ color: '#475569', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {recipesList.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#94a3b8' }}>
            <p>Belum ada data resep</p>
          </div>
        ) : (
          recipesList.map(recipe => (
            <div key={recipe.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 40px', padding: '1.25rem 2rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
              <div style={{ color: '#334155', fontSize: '0.95rem' }}>{recipe.code}</div>
              <div style={{ color: '#334155', fontSize: '0.95rem' }}>{recipe.name}</div>
              <div style={{ color: '#334155', fontSize: '0.95rem' }}>{recipe.ingredientCount}</div>
              <div style={{ display: 'flex', justifyContent: 'center', color: '#0f172a', fontWeight: 800, letterSpacing: '2px', cursor: 'pointer' }}>...</div>
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
          <span>Ditampilkan {recipesList.length > 0 ? 1 : 0} - {recipesList.length} dari {recipesList.length} data</span>
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

      {/* Tambah Resep Full Screen View */}
      {isAddingRecipe && (
        <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar */}
          <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem' }}>
            <div 
              style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setIsAddingRecipe(false)}
            >
              <FiX style={{ fontSize: '1.2rem', color: '#475569' }} />
            </div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Tambah Resep
            </h1>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Card 1: Master Resep */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>Master Resep</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Kode Master Resep */}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '220px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginTop: '0.75rem' }}>
                      Kode Master Resep<span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Contoh: 123456"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.95rem', color: '#0f172a' }}
                      />
                    </div>
                  </div>

                  {/* Nama Resep Produk */}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '220px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginTop: '0.75rem' }}>
                      Nama Resep Produk<span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Contoh: Ayam Goreng"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '0.95rem', color: '#0f172a' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Bahan Baku */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0f172a' }}>Bahan Baku</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 2rem 0' }}>Masukkan bahan baku yang telah dibuat sebelumnya</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {ingredients.map((ing, idx) => (
                    <div key={ing.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: '220px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginTop: '1.5rem' }}>
                        {idx === 0 && <span>Atur Bahan Baku<span style={{ color: '#ef4444' }}>*</span></span>}
                      </div>
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Bahan Baku</label>
                          <div 
                            onClick={() => {
                              if (activeDropdownId !== ing.id) {
                                setActiveDropdownId(ing.id);
                                setDropdownSearch('');
                              } else {
                                setActiveDropdownId(null);
                              }
                            }}
                            style={{ width: '100%', padding: '0.85rem 1rem', border: activeDropdownId === ing.id ? '1px solid #ff6b00' : '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'text', background: 'white' }}
                          >
                            <input 
                              type="text"
                              placeholder="Pilih"
                              value={activeDropdownId === ing.id ? dropdownSearch : (ing.name || '')}
                              onChange={(e) => setDropdownSearch(e.target.value)}
                              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.95rem', color: '#0f172a' }}
                            />
                            <FiChevronDown 
                              style={{ 
                                transform: activeDropdownId === ing.id ? 'rotate(180deg)' : 'rotate(0)', 
                                transition: 'transform 0.2s',
                                color: '#94a3b8',
                                cursor: 'pointer'
                              }} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(activeDropdownId === ing.id ? null : ing.id);
                              }}
                            />
                          </div>
                          
                          {activeDropdownId === ing.id && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', zIndex: 10, overflow: 'hidden' }}>
                              <div 
                                onClick={(e) => { e.stopPropagation(); setIsAddingNewIngredient(true); setActiveDropdownId(null); }}
                                style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ff6b00', fontWeight: 700, cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                              >
                                <FiPlus style={{ fontSize: '1.2rem' }} />
                                <span>Tambah Bahan Baku</span>
                              </div>
                              <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                {inventoryItems
                                  .filter(item => item.name.toLowerCase().includes(dropdownSearch.toLowerCase()))
                                  .map(item => (
                                  <div 
                                    key={item.id}
                                    onClick={() => selectIngredientItem(ing.id, item)}
                                    style={{ padding: '0.85rem 1rem', cursor: 'pointer', fontSize: '0.95rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                  >
                                    {item.name}
                                  </div>
                                ))}
                                {inventoryItems.filter(item => item.name.toLowerCase().includes(dropdownSearch.toLowerCase())).length === 0 && (
                                  <div style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>
                                    Tidak ada hasil
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Harga Modal</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <input type="text" value={ing.cost} readOnly style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f1f5f9', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }} />
                            </div>
                            <FiTrash2 
                              onClick={() => removeIngredient(ing.id)}
                              style={{ color: '#475569', fontSize: '1.2rem', cursor: 'pointer' }} 
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Takaran</label>
                          <input type="text" placeholder="Contoh: 10" style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Satuan</label>
                          <div style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', color: ing.unit ? '#0f172a' : '#94a3b8', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', cursor: 'not-allowed' }}>
                            <span>{ing.unit || 'Pilih'}</span>
                            <FiChevronDown />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', alignItems: 'center', marginTop: ingredients.length > 0 ? '0.5rem' : 0 }}>
                    <div style={{ width: '220px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                      {ingredients.length === 0 && <span>Atur Bahan Baku<span style={{ color: '#ef4444' }}>*</span></span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div 
                        onClick={addIngredient}
                        style={{ 
                          width: '100%', 
                          padding: '0.85rem', 
                          border: '1px solid #ff6b00', 
                          borderRadius: '8px', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          color: '#ff6b00',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: 'white',
                          fontSize: '0.95rem',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        Tambah Bahan Baku
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>

          {/* Bottom Bar */}
          <footer style={{ height: '80px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 3rem', gap: '2rem' }}>
            <button
              style={{ background: 'transparent', border: 'none', color: '#ff6b00', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
              onClick={() => setIsAddingRecipe(false)}
            >
              Batal
            </button>
            <button
              style={{
                background: (formData.code && formData.name) ? '#ff6b00' : '#e2e8f0',
                border: 'none',
                color: (formData.code && formData.name) ? 'white' : '#94a3b8',
                padding: '0.75rem 2.5rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: (formData.code && formData.name) ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
              disabled={!(formData.code && formData.name)}
              onClick={() => setShowConfirmRecipeModal(true)}
            >
              Simpan
            </button>
          </footer>
        </div>
      )}

      {/* Pop-up Tambah Bahan Baku Baru */}
      {isAddingNewIngredient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: 'white', width: '700px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Tambah Bahan Baku</h2>
              <FiX style={{ fontSize: '1.5rem', color: '#64748b', cursor: 'pointer' }} onClick={() => setIsAddingNewIngredient(false)} />
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
              
              {/* Nama Bahan Baku */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Nama Bahan Baku</label>
                <input 
                  type="text" 
                  placeholder="Contoh: nasi padang" 
                  value={newIngredientData.name}
                  onChange={(e) => setNewIngredientData({...newIngredientData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              {/* Monitoring Persediaan */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>Monitoring Persediaan<span style={{ color: '#ef4444' }}>*</span></span>
                <div
                  onClick={() => setNewIngredientData({ ...newIngredientData, monitoring: !newIngredientData.monitoring })}
                  style={{
                    width: '50px',
                    height: '24px',
                    background: newIngredientData.monitoring ? '#ff6b00' : '#cbd5e1',
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
                    left: newIngredientData.monitoring ? '29px' : '3px',
                    transition: 'left 0.3s'
                  }} />
                  <span style={{ position: 'absolute', right: newIngredientData.monitoring ? 'auto' : '6px', left: newIngredientData.monitoring ? '6px' : 'auto', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 800, color: 'white' }}>
                    {newIngredientData.monitoring ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>

              {/* Stok Minimum */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  Stok Minimum <span style={{ color: '#94a3b8', fontSize: '1rem', cursor: 'help' }}>ⓘ</span>
                </label>
                <input 
                  type="text" 
                  placeholder="0" 
                  value={newIngredientData.minStock}
                  onChange={(e) => handleNumberInput('minStock', e.target.value)}
                  disabled={!newIngredientData.monitoring}
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: newIngredientData.monitoring ? 'white' : '#f8fafc', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              {/* Units Grid */}
              {newIngredientData.units.map((unitRow, idx) => (
                <div key={unitRow.id} style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', flex: 1 }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Satuan<span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="text" placeholder="Pilih Satuan" value={unitRow.unit} onChange={(e) => handleUnitInput(unitRow.id, 'unit', e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Konversi</label>
                      {idx === 0 ? (
                        <div style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f1f5f9', color: '#64748b', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>1</span>
                          <span>{unitRow.unit}</span>
                        </div>
                      ) : (
                        <input type="text" value={unitRow.conversion} onChange={(e) => handleUnitInput(unitRow.id, 'conversion', e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }} />
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>Harga Beli<span style={{ color: '#ef4444' }}>*</span></label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden' }}>
                        <span style={{ padding: '0.85rem 0.5rem 0.85rem 1rem', color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>Rp</span>
                        <input type="text" placeholder="0" value={unitRow.buyPrice} onChange={(e) => handleUnitInput(unitRow.id, 'buyPrice', e.target.value, true)} style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 0', border: 'none', background: 'transparent', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>SKU<span style={{ color: '#ef4444' }}>*</span></label>
                      <input type="text" placeholder="Contoh: S001" value={unitRow.sku} onChange={(e) => handleUnitInput(unitRow.id, 'sku', e.target.value)} style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                  </div>
                  <div 
                    onClick={() => removeUnitRow(unitRow.id)}
                    style={{ width: '40px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newIngredientData.units.length > 1 ? 'pointer' : 'not-allowed', color: newIngredientData.units.length > 1 ? '#64748b' : '#cbd5e1' }}
                  >
                    <FiTrash2 style={{ fontSize: '1.2rem' }} />
                  </div>
                </div>
              ))}

              {/* Tambah Satuan Button */}
              <button 
                onClick={addUnitRow}
                style={{ 
                width: '100%', 
                padding: '0.85rem', 
                border: '1px solid #ff6b00', 
                borderRadius: '8px', 
                background: 'white', 
                color: '#ff6b00', 
                fontWeight: 700, 
                fontSize: '0.95rem', 
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Tambah Satuan
              </button>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', alignItems: 'center' }}>
              <span style={{ color: '#ff6b00', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }} onClick={() => setIsAddingNewIngredient(false)}>Batal</span>
              <button 
                onClick={handleSaveNewIngredient}
                style={{ 
                background: (newIngredientData.name && newIngredientData.units[0].unit && newIngredientData.units[0].sku) ? '#ff6b00' : '#e2e8f0', 
                color: (newIngredientData.name && newIngredientData.units[0].unit && newIngredientData.units[0].sku) ? 'white' : '#94a3b8', 
                border: 'none', 
                padding: '0.75rem 2rem', 
                borderRadius: '8px', 
                fontWeight: 700, 
                cursor: (newIngredientData.name && newIngredientData.units[0].unit && newIngredientData.units[0].sku) ? 'pointer' : 'not-allowed',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              disabled={!(newIngredientData.name && newIngredientData.units[0].unit && newIngredientData.units[0].sku)}
              >
                Simpan
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Success Notification */}
      {notification.show && (
        <div style={{ 
          position: 'fixed', 
          top: '2rem', 
          right: '50%',
          transform: 'translateX(50%)',
          background: '#f0fdf4', 
          padding: '1rem 1.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          zIndex: 4000,
          border: '1px solid #22c55e',
          minWidth: '350px',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <div style={{ width: '4px', background: '#22c55e', position: 'absolute', left: 0, top: '1rem', bottom: '1rem', borderRadius: '0 4px 4px 0' }} />
          <div style={{ flex: 1, paddingLeft: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>Berhasil!</span>
              <FiX style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem' }} onClick={() => setNotification({ show: false, message: '' })} />
            </div>
            <div style={{ color: '#334155', fontSize: '0.95rem' }}>
              {notification.message.split(' ').map((word, i) => 
                word === newIngredientData.name || word === inventoryItems[inventoryItems.length - 1]?.name 
                  ? <strong key={i} style={{ color: '#0f172a' }}>{word} </strong> 
                  : word + ' '
              )}
            </div>
          </div>
          <style>{`
            @keyframes slideDown {
              from { transform: translate(50%, -100%); opacity: 0; }
              to { transform: translate(50%, 0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      {/* Confirmation Modal for Saving Recipe */}
      {showConfirmRecipeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ background: 'white', width: '500px', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Simpan Master Resep</h3>
              <FiX style={{ fontSize: '1.5rem', color: '#64748b', cursor: 'pointer' }} onClick={() => setShowConfirmRecipeModal(false)} />
            </div>
            
            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
              <strong style={{ color: '#0f172a' }}>Resep {formData.name}</strong> akan disimpan dan tampil di daftar Resep sesuai dengan pengaturan yang telah dilakukan. Lanjutkan?
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#ff6b00', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', padding: '0.5rem 1rem' }} onClick={() => setShowConfirmRecipeModal(false)}>
                Batal
              </span>
              <button 
                onClick={handleSaveRecipeConfirm}
                style={{ 
                  background: '#ff6b00', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  fontSize: '0.95rem', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 107, 0, 0.2)'
                }}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
