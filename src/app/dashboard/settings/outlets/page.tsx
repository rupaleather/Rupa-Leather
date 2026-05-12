'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './outlets.module.css';
import {
  FiStar,
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiFolder,
  FiCheck,
  FiEdit2,
  FiArrowLeft,
  FiArrowRight,
  FiInfo,
  FiMoreHorizontal,
  FiTrash2,
  FiUpload,
  FiX,
  FiClock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import RegionSelect from '@/components/RegionSelect/RegionSelect';
import ImageEditor from '@/components/ImageEditor/ImageEditor';
import LocationPicker from '@/components/LocationPicker/LocationPicker';
import { supabaseBrowser } from '@/lib/supabase';
import TutupTokoModal from '@/components/TutupTokoModal/TutupTokoModal';

const CustomTimePicker = ({ value, onChange, disabled, isDayOff }: { value: string, onChange: (val: string) => void, disabled: boolean, isDayOff?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [hourStr, minStr] = (value || "00:00").split(':');
  let hours = parseInt(hourStr) || 0;
  let mins = parseInt(minStr) || 0;

  const updateTime = (h: number, m: number) => {
    if (h < 0) h = 23;
    if (h > 23) h = 0;
    if (m < 0) m = 59;
    if (m > 59) m = 0;

    const newH = h.toString().padStart(2, '0');
    const newM = m.toString().padStart(2, '0');
    onChange(`${newH}:${newM}`);
  };

  return (
    <div className={styles.customTimePickerWrapper} ref={wrapperRef}>
      <div
        className={`${styles.timeInput} ${disabled ? styles.timeInputDisabled : ''} ${isOpen ? styles.timeInputFocus : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <FiClock className={styles.timeIcon} style={{ color: isDayOff ? '#94a3b8' : '#1e293b' }} />
        <div style={{ flex: 1, userSelect: 'none', color: isDayOff ? '#94a3b8' : '#1e293b' }}>{value}</div>
      </div>

      {isOpen && !disabled && (
        <div className={styles.timePickerPopup}>
          <div className={styles.timePickerColumn}>
            <button type="button" onClick={(e) => { e.stopPropagation(); updateTime(hours + 1, mins); }} className={styles.timePickerBtn}><FiChevronUp size={20} /></button>
            <span className={styles.timePickerValue}>{hourStr}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); updateTime(hours - 1, mins); }} className={styles.timePickerBtn}><FiChevronDown size={20} /></button>
          </div>
          <span className={styles.timePickerColon}>:</span>
          <div className={styles.timePickerColumn}>
            <button type="button" onClick={(e) => { e.stopPropagation(); updateTime(hours, mins + 1); }} className={styles.timePickerBtn}><FiChevronUp size={20} /></button>
            <span className={styles.timePickerValue}>{minStr}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); updateTime(hours, mins - 1); }} className={styles.timePickerBtn}><FiChevronDown size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OutletsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isTutupTokoModalOpen, setIsTutupTokoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    manager_name: '',
    province: 'Pilih',
    city: 'Pilih',
    district: 'Pilih',
    country: 'Indonesia',
    address: '',
    address_note: '',
    phone: '',
    whatsapp: '',
    email: '',
    logo_url: '',
    struk_logo_url: '',
    outlet_type: 'penjualan',
    status: 'buka',
    subscription_plan: 'TRIAL',
    expiry_date: '',
    latitude: -7.7956,
    longitude: 110.3695,
    close_store_enabled: false,
    schedule: {},
    social_media: [{ platform: 'Facebook', username: '' }],
    tutup_toko_settings: null as Record<string, Record<string, boolean>> | null
  });

  const [showMap, setShowMap] = useState(false);
  const [showManagerPicker, setShowManagerPicker] = useState(false);
  const [showManagerConfirm, setShowManagerConfirm] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [generatedNIP, setGeneratedNIP] = useState('');

  // Generate NIP when confirmation modal opens
  useEffect(() => {
    if (showManagerConfirm) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
      const randomNumbers = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedNIP(randomLetters + randomNumbers);
    }
  }, [showManagerConfirm]);

  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);

  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'logo' | 'strukLogo' | null>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [outlets, setOutlets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [managerFormData, setManagerFormData] = useState({
    name: '',
    nip: 'KC260001',
    phone: '',
    position: '',
    outlet: '',
    pin: '123456',
    access_level: '',
    email: ''
  });
  const [showManagerPin, setShowManagerPin] = useState(false);
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [accountEmail, setAccountEmail] = useState('rupaleather@gmail.com');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [managerList, setManagerList] = useState<any[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const accessDropdownRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const strukLogoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaUpdate = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newSocial = [...((prev as any).social_media || [])];
      newSocial[index] = { ...newSocial[index], [field]: value };
      return { ...prev, social_media: newSocial };
    });
  };

  const handleManagerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setManagerFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSocialMedia = () => {
    const currentSocials = (formData as any).social_media || [];
    if (currentSocials.length < 4) {
      const allPlatforms = ['Facebook', 'Instagram', 'Twitter', 'TikTok'];
      const usedPlatforms = currentSocials.map((s: any) => s.platform);
      const availablePlatforms = allPlatforms.filter((p: string) => !usedPlatforms.includes(p));
      const nextPlatform = availablePlatforms.length > 0 ? availablePlatforms[0] : 'Facebook';

      setFormData(prev => ({
        ...prev,
        social_media: [...currentSocials, { platform: nextPlatform, username: '' }]
      }));
    }
  };

  const removeSocialMedia = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      social_media: ((prev as any).social_media || []).filter((_: any, index: number) => index !== indexToRemove)
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDetail(false);
    setShowCancelConfirm(false);
    setEditingId(null);
    setFormData({
      name: '',
      manager_name: '',
      province: 'Pilih',
      city: 'Pilih',
      district: 'Pilih',
      country: 'Indonesia',
      address: '',
      address_note: '',
      phone: '',
      whatsapp: '',
      email: '',
      logo_url: '',
      struk_logo_url: '',
      outlet_type: 'penjualan',
      social_media: [{ platform: 'Facebook', username: '' }],
      status: 'buka',
      subscription_plan: 'TRIAL',
      expiry_date: '',
      latitude: -7.7956,
      longitude: 110.3695,
      close_store_enabled: false,
      schedule: {},
      tutup_toko_settings: null
    });
  };

  const handleScheduleUpdate = (day: string, field: string, value: any, shiftIndex: number = 0) => {
    setFormData(prev => {
      const currentSchedule = (prev.schedule as any) || {};
      const dayData = currentSchedule[day] || {
        enabled: false,
        shifts: [{ open: '00:00', close: '23:59', is24h: true }]
      };

      // Migration: convert old structure to new structure if needed
      let shifts = dayData.shifts || [{
        open: dayData.open || '00:00',
        close: dayData.close || '23:59',
        is24h: dayData.is24h !== undefined ? dayData.is24h : true
      }];

      let newDayData = { ...dayData, shifts: [...shifts] };

      if (field === 'enabled') {
        newDayData.enabled = value;
      } else {
        let shift = { ...newDayData.shifts[shiftIndex] };
        shift[field] = value;

        // If manually editing time, uncheck is24h
        if (field === 'open' || field === 'close') {
          shift.is24h = false;
        }

        // If toggling is24h to ON, reset times to default
        if (field === 'is24h' && value === true) {
          shift.open = '00:00';
          shift.close = '23:59';
        }

        // If toggling is24h to OFF, set times to 08:00 and 17:00
        if (field === 'is24h' && value === false) {
          shift.open = '08:00';
          shift.close = '17:00';
        }

        newDayData.shifts[shiftIndex] = shift;
      }

      return {
        ...prev,
        schedule: {
          ...currentSchedule,
          [day]: newDayData
        }
      };
    });
  };

  const addShift = (day: string) => {
    setFormData(prev => {
      const currentSchedule = (prev.schedule as any) || {};
      const dayData = currentSchedule[day] || {
        enabled: true,
        shifts: [{ open: '08:00', close: '17:00', is24h: false }]
      };

      const shifts = dayData.shifts || [{
        open: dayData.open || '08:00',
        close: dayData.close || '17:00',
        is24h: dayData.is24h || false
      }];

      return {
        ...prev,
        schedule: {
          ...currentSchedule,
          [day]: {
            ...dayData,
            enabled: true,
            shifts: [...shifts, { open: '08:00', close: '17:00', is24h: false }]
          }
        }
      };
    });
  };

  const removeShift = (day: string, index: number) => {
    setFormData(prev => {
      const currentSchedule = (prev.schedule as any) || {};
      const dayData = currentSchedule[day];
      if (!dayData || !dayData.shifts) return prev;

      return {
        ...prev,
        schedule: {
          ...currentSchedule,
          [day]: {
            ...dayData,
            shifts: dayData.shifts.filter((_: any, i: number) => i !== index)
          }
        }
      };
    });
  };

  const toggleAllDays = () => {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const allEnabled = days.every(d => (formData.schedule as any)?.[d]?.enabled);
    setFormData(prev => {
      const currentSchedule = (prev.schedule as any) || {};
      const newSchedule = { ...currentSchedule };
      days.forEach(d => {
        const dayData = newSchedule[d] || {
          enabled: false,
          shifts: [{ open: '00:00', close: '23:59', is24h: true }]
        };
        newSchedule[d] = { ...dayData, enabled: !allEnabled };
      });
      return { ...prev, schedule: newSchedule };
    });
  };

  const handleEditDetail = (outlet: any) => {
    setEditingId(outlet.id);
    setFormData({
      name: outlet.name || '',
      manager_name: '',
      province: outlet.province || 'Pilih',
      city: outlet.city || 'Pilih',
      district: outlet.district || 'Pilih',
      country: outlet.country || 'Indonesia',
      address: outlet.address || '',
      address_note: outlet.address_note || '',
      phone: outlet.phone || '',
      whatsapp: outlet.whatsapp || '',
      email: outlet.email || '',
      logo_url: outlet.logo_url || '',
      struk_logo_url: outlet.struk_logo_url || '',
      outlet_type: outlet.outlet_type || 'penjualan',
      status: outlet.status || 'buka',
      subscription_plan: outlet.subscription_plan || 'TRIAL',
      expiry_date: outlet.expiry_date || '',
      latitude: outlet.latitude || -7.7956,
      longitude: outlet.longitude || 110.3695,
      close_store_enabled: outlet.close_store_enabled || false,
      schedule: outlet.schedule || {},
      social_media: outlet.social_media && outlet.social_media.length > 0
        ? outlet.social_media
        : [{ platform: 'Facebook', username: '' }],
      tutup_toko_settings: outlet.tutup_toko_settings || null
    });
    setShowDetail(true);
  };

  const handleSave = () => {
    setShowSaveConfirm(true);
  };

  const finalizeSave = async () => {
    setIsSaving(true);
    setShowSaveConfirm(false);

    // Clean up empty social media entries before sending
    const cleanedSocialMedia = ((formData as any).social_media || []).filter(
      (s: any) => s && s.username && s.username.trim() !== ''
    );
    const payload = { ...formData, social_media: cleanedSocialMedia };

    console.log('[Frontend] Mengirim data ke API:', payload);

    try {
      const url = editingId ? `/api/dashboard/outlets/${editingId}` : '/api/dashboard/outlets';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        if (result.data) {
          setOutlets(prev => {
            if (editingId) return prev.map(o => o.id === editingId ? result.data : o);
            return [result.data, ...prev];
          });
        }

        // Show Success Toast
        setToastMessage(`Outlet ${formData.name} berhasil ${editingId ? 'diubah' : 'ditambah'}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        handleCloseModal();
      } else {
        alert('Gagal menyimpan outlet: ' + result.error);
      }
    } catch (error: any) {
      console.error('Error saving outlet:', error);
      alert('Gagal menyimpan outlet: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const itemDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target as Node)) {
        setShowItemDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (accessDropdownRef.current && !accessDropdownRef.current.contains(event.target as Node)) {
        setShowAccessDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch outlets and setup real-time
  useEffect(() => {
    const fetchOutlets = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/dashboard/outlets');
        const result = await response.json();

        if (result.success) {
          const data = result.data || [];
          setOutlets(data);
          // Default: Centang semua kota saat pertama kali load
          const allCities = Array.from(new Set(data.map((o: any) => o.city).filter(Boolean))) as string[];
          setSelectedItems(['Semua Kota', ...allCities]);
        } else {
          console.error('Gagal mengambil data outlet:', result.error);
          alert('Gagal mengambil data: ' + result.error);
        }
      } catch (err: any) {
        console.error('Network error:', err.message);
        alert('Gagal menghubungi server: ' + err.message);
      }
      setIsLoading(false);
    };

    const fetchManagers = async () => {
      try {
        const [profileRes, businessRes, staffRes] = await Promise.all([
          fetch('/api/dashboard/profile'),
          fetch('/api/dashboard/profile?type=business'),
          fetch('/api/dashboard/staff')
        ]);

        const profileData = await profileRes.json();
        const businessData = await businessRes.json();
        const staffData = await staffRes.json();

        let allManagers: any[] = [];

        // 1. Tambahkan data dari tabel staff (Supabase)
        if (staffData.success && staffData.data) {
          allManagers = staffData.data.map((m: any) => ({
            ...m,
            outlet: m.outlet_name || 'Rupa Leather',
            supervisor: m.access_level === 'Admin' ? 'Ya' : '-'
          }));
        }

        // 2. Tambahkan profil utama jika belum ada di list
        if (profileData.data) {
          const email = profileData.data.email || 'rupaleather@gmail.com';
          setAccountEmail(email);

          const mainManager = {
            name: 'Edho',
            outlet: businessData.data?.business_name || 'Rupa Leather',
            supervisor: 'Ya',
            id: profileData.data.id || 'main-manager',
            phone: profileData.data.phone1 || '0811111111',
            nip: 'ED4260001',
            position: 'Owner',
            pin: profileData.data.pin || '123456',
            access_level: 'Admin',
            email: email
          };

          const exists = allManagers.some(m => m.email === email);
          if (!exists) {
            allManagers.push(mainManager);
          }
        }

        setManagerList(allManagers);
        if (allManagers.length > 0 && !selectedManagerId) {
          setSelectedManagerId(allManagers[0].id);
        }
      } catch (err) {
        console.error('Error fetching managers:', err);
      }
    };

    fetchOutlets();
    fetchManagers();

    const subscription = supabaseBrowser
      .channel('outlets_realtime')
      .on('postgres_changes', { event: '*', table: 'outlets', schema: 'public' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOutlets(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setOutlets(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
        } else if (payload.eventType === 'DELETE') {
          setOutlets(prev => prev.filter(o => o.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(subscription);
    };
  }, []);

  const filteredOutlets = outlets.filter(outlet => {
    // Filter pencarian
    const matchesSearch = !searchQuery ||
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter Kota (Harus ada yang dicentang agar data muncul)
    const actualSelectedCities = selectedItems.filter(i => i !== 'Semua Kota');
    const matchesCity = actualSelectedCities.includes(outlet.city);

    // Filter Status (Berdasarkan Masa Berlaku)
    const now = new Date();
    const expiryDate = outlet.expiry_date ? new Date(outlet.expiry_date) : null;
    const isExpired = expiryDate ? expiryDate < now : false;

    const matchesStatus = selectedStatus === 'Semua Status' ||
      (selectedStatus === 'Aktif' && !isExpired) ||
      (selectedStatus === 'Kedulawarsa' && isExpired);

    return matchesSearch && matchesCity && matchesStatus;
  });

  // Fetch initial provinces
  useEffect(() => {
    fetch('/api/regions?level=provinsi')
      .then(res => res.json())
      .then(res => { if (res.data) setProvinces(res.data); });
  }, []);

  const toTitleCase = (str: any) => {
    if (!str || typeof str !== 'string' || str === 'Pilih') return str;
    return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleProvinceChange = (province: string) => {
    setFormData(prev => ({ ...prev, province, city: 'Pilih', district: 'Pilih' }));
    setCities([]);
    setDistricts([]);
    if (province !== 'Pilih') {
      setIsLoadingRegions(true);
      fetch(`/api/regions?level=kota&provinsi=${encodeURIComponent(province.toUpperCase())}`)
        .then(res => res.json())
        .then(res => {
          if (res.data) setCities(res.data);
          setIsLoadingRegions(false);
        });
    }
  };

  const handleCityChange = (city: string) => {
    setFormData(prev => ({ ...prev, city, district: 'Pilih' }));
    setDistricts([]);
    if (city !== 'Pilih') {
      setIsLoadingRegions(true);
      fetch(`/api/regions?level=kecamatan&provinsi=${encodeURIComponent(formData.province.toUpperCase())}&kota=${encodeURIComponent(city.toUpperCase())}`)
        .then(res => res.json())
        .then(res => {
          if (res.data) setDistricts(res.data);
          setIsLoadingRegions(false);
        });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'strukLogo') => {
    const file = e.target.files?.[0];
    console.log('File terpilih:', file?.name, 'Ukuran:', file?.size);

    if (file) {
      const r = new FileReader();
      r.onloadstart = () => console.log('Mulai membaca file...');
      r.onloadend = () => {
        console.log('Selesai membaca file. Panjang data:', r.result?.toString().length);
        setEditorImage(r.result as string);
        setEditingField(field);
        setShowImageEditor(true);
        console.log('showImageEditor set to true');
      };
      r.onerror = (err) => console.error('Error membaca file:', err);
      r.readAsDataURL(file);
    }
  };

  const handleEditorSave = (editedImage: string) => {
    if (editingField === 'logo') {
      setFormData(prev => ({ ...prev, logo_url: editedImage }));
    } else {
      setFormData(prev => ({ ...prev, struk_logo_url: editedImage }));
    }
    setShowImageEditor(false);
  };

  const toggleItem = (item: string) => {
    // Ambil daftar kota unik dari data outlet asli
    const allItems = Array.from(new Set(outlets.map(o => o.city).filter(Boolean)));

    if (item === 'Semua Kota') {
      if (selectedItems.includes('Semua Kota')) {
        setSelectedItems([]);
      } else {
        setSelectedItems(['Semua Kota', ...allItems]);
      }
    } else {
      setSelectedItems(prev => {
        const isSelected = prev.includes(item);
        const next = isSelected ? prev.filter(i => i !== item) : [...prev, item];

        // Logika "Pilih Semua" otomatis:
        // Jika setelah klik ini, semua item asli sudah terpilih
        const actualSelected = next.filter(i => i !== 'Semua Kota');
        const hasAll = allItems.length > 0 && allItems.every(i => actualSelected.includes(i));

        if (hasAll && !next.includes('Semua Kota')) {
          return ['Semua Kota', ...next];
        }
        if (!hasAll && next.includes('Semua Kota')) {
          return next.filter(i => i !== 'Semua Kota');
        }
        return next;
      });
    }
  };

  return (
    <div className={styles.container}>
      <input type="file" ref={logoInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleLogoChange(e, 'logo')} />
      <input type="file" ref={strukLogoInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleLogoChange(e, 'strukLogo')} />

      <ImageEditor
        isOpen={showImageEditor}
        onClose={() => setShowImageEditor(false)}
        image={editorImage}
        onSave={handleEditorSave}
      />

      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>
            Daftar Outlet <FiStar className={styles.loveIcon} />
          </h1>
        </div>
        <button className={styles.addButton} onClick={() => setShowModal(true)}>
          <FiPlus /> Tambah Outlet
        </button>
      </div>

      {/* Toolbar Section */}
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
          {/* Pilih Item Dropdown (Multi-select) */}
          <div className={styles.selectWrapper} ref={itemDropdownRef}>
            <div
              className={`${styles.customSelect} ${showItemDropdown ? styles.customSelectActive : ''}`}
              onClick={() => setShowItemDropdown(!showItemDropdown)}
            >
              <span className={styles.customSelectPlaceholder}>Pilih Item</span>
              <FiChevronDown className={`${styles.selectArrow} ${showItemDropdown ? styles.selectArrowOpen : ''}`} />
            </div>
            {showItemDropdown && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownItem} onClick={() => toggleItem('Semua Kota')}>
                  <div className={`${styles.checkbox} ${selectedItems.includes('Semua Kota') ? styles.checkboxActive : ''}`}>
                    {selectedItems.includes('Semua Kota') && <FiCheck size={14} />}
                  </div>
                  <span>Semua Kota</span>
                </div>
                <div className={styles.dropdownSeparator}></div>
                {Array.from(new Set(outlets.map(o => o.city).filter(Boolean))).map((city) => (
                  <div className={styles.dropdownItem} key={city} onClick={() => toggleItem(city)}>
                    <div className={`${styles.checkbox} ${selectedItems.includes(city) ? styles.checkboxActive : ''}`}>
                      {selectedItems.includes(city) && <FiCheck size={14} />}
                    </div>
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            )}
            {selectedItems.length > 0 && (
              <span className={styles.itemSelectedText}>
                {selectedItems.filter(i => i !== 'Semua Kota').length} Item terpilih
              </span>
            )}
          </div>

          {/* Semua Status Dropdown (Single-select) */}
          <div className={styles.selectWrapper} ref={statusDropdownRef}>
            <div
              className={`${styles.customSelect} ${showStatusDropdown ? styles.customSelectActive : ''}`}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <span>{selectedStatus}</span>
              <FiChevronDown className={`${styles.selectArrow} ${showStatusDropdown ? styles.selectArrowOpen : ''}`} />
            </div>
            {showStatusDropdown && (
              <div className={styles.dropdownMenu}>
                <div
                  className={`${styles.dropdownItem} ${selectedStatus === 'Semua Status' ? styles.dropdownItemActive : ''}`}
                  onClick={() => { setSelectedStatus('Semua Status'); setShowStatusDropdown(false); }}
                >
                  Semua Status
                </div>
                <div className={styles.dropdownSeparator}></div>
                <div
                  className={`${styles.dropdownItem} ${selectedStatus === 'Aktif' ? styles.dropdownItemActive : ''}`}
                  onClick={() => { setSelectedStatus('Aktif'); setShowStatusDropdown(false); }}
                >
                  Aktif
                </div>
                <div className={styles.dropdownSeparator}></div>
                <div
                  className={`${styles.dropdownItem} ${selectedStatus === 'Kedulawarsa' ? styles.dropdownItemActive : ''}`}
                  onClick={() => { setSelectedStatus('Kedulawarsa'); setShowStatusDropdown(false); }}
                >
                  Kedulawarsa
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NAMA</th>
              <th>ALAMAT</th>
              <th>KOTA</th>
              <th>JENIS</th>
              <th>MANAGER</th>
              <th>STATUS</th>
              <th>MASA BERLAKU</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  Memuat data...
                </td>
              </tr>
            ) : filteredOutlets.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  {selectedItems.length === 0 ? 'Pilih kota untuk melihat data.' : 'Data tidak ditemukan.'}
                </td>
              </tr>
            ) : (
              filteredOutlets.map((outlet) => (
                <tr key={outlet.id}>
                  <td>
                    <div className={styles.outletNameWrapper}>
                      <span className={styles.outletName}>{outlet.name}</span>
                      {outlet.is_main_outlet && <span className={styles.mainOutletBadge}>Outlet Utama</span>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.addressCell}>
                      {outlet.address || '-'}
                    </div>
                  </td>
                  <td>{outlet.city || '-'}</td>
                  <td>{outlet.outlet_type === 'penjualan' ? 'Penjualan' : 'Gudang'}</td>
                  <td>{outlet.manager_name || '-'}</td>
                  <td>
                    <div className={styles.statusBadgeWrapper}>
                      <div className={`${styles.statusBadge} ${outlet.status === 'buka' ? styles.statusBadgeOpen : styles.statusBadgeClosed}`}>
                        <div className={`${styles.statusDot} ${outlet.status === 'buka' ? styles.statusDotOpen : styles.statusDotClosed}`}></div>
                        {outlet.status === 'buka' ? 'Buka' : 'Tutup'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.expiryWrapper}>
                      <span className={styles.expiryTextDanger}>
                        {outlet.expiry_date ? `Sisa 13 hari` : '-'}
                      </span>
                      <button className={styles.extendBtnTable}>Perpanjang</button>
                    </div>
                  </td>
                  <td>
                    <button className={styles.editBtn} onClick={() => handleEditDetail(outlet)}>
                      <FiEdit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className={styles.pagination}>
        <div className={styles.paginationLeft}>
          <div className={styles.pageSizeSelector}>
            <span>Tampilkan:</span>
            <div className={styles.pageSizeSelect}>
              10 <FiChevronDown size={14} />
            </div>
          </div>
          <span>Ditampilkan 1 - 1 dari 1 data</span>
        </div>
        <div className={styles.paginationRight}>
          <button className={styles.navBtn}>
            <FiArrowLeft /> Sebelumnya
          </button>
          <div className={styles.pageNumber}>1</div>
          <button className={`${styles.navBtn} ${styles.navBtnActive}`}>
            Selanjutnya <FiArrowRight />
          </button>
        </div>
      </div>

      {/* Tambah Outlet Full Page */}
      {showModal && (
        <div className={styles.fullPageContainer}>
          <div className={styles.fullPageHeader}>
            <div className={styles.fullPageHeaderLeft}>
              <button className={styles.closePageBtn} onClick={() => setShowCancelConfirm(true)}>
                <FiX size={20} />
              </button>
              <h1>Tambah Outlet</h1>
            </div>
          </div>

          <div className={styles.fullPageContent}>
            <div className={styles.formCard}>
              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <label>Nama Outlet<span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    className={styles.input}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama Outlet"
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Manager Outlet</label>
                  <input
                    type="text"
                    name="manager_name"
                    className={styles.input}
                    value={formData.manager_name}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama Manager"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.fullPageFooter}>
            <div></div>
            <div className={styles.footerRight}>
              <button className={styles.batalBtn} onClick={() => setShowCancelConfirm(true)}>Batal</button>
              <button
                className={styles.simpanBtn}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Outlet Full Page */}
      {showDetail && (
        <div className={styles.fullPageContainer}>
          <div className={styles.fullPageHeader}>
            <div className={styles.fullPageHeaderLeft}>
              <button className={styles.closePageBtn} onClick={() => setShowDetail(false)}>
                <FiX size={20} />
              </button>
              <h1>Detail Outlet</h1>
            </div>
          </div>

          <div className={styles.fullPageContent}>
            <div className={styles.infoAlert}>
              <FiInfo size={22} className={styles.infoIcon} />
              <span>Pengaturan pada nama, logo, jadwal operasional, dan alamat outlet akan tersimpan di berbagai fitur dan produk skala yang terintegrasi</span>
            </div>

            <div className={styles.formCard}>
              <h2 className={styles.sectionHeader}>Informasi Outlet</h2>

              <div className={styles.formGrid}>
                {/* Detail Logo Section */}
                <div>
                  <h3 className={styles.subSectionHeader}>Detail Logo</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div className={styles.formRow}>
                      <div className={styles.labelWrapper}>
                        <label>
                          Logo Outlet
                          <div className={styles.tooltipWrapper}>
                            <FiInfo size={14} className={styles.labelInfo} />
                            <div className={styles.tooltipText}>Logo outlet akan diterapkan di berbagai fitur dan produk skala yang terintegrasi</div>
                          </div>
                        </label>
                        <span className={styles.labelSubtext}>Ukuran 500px x 500px, maks 1MB</span>
                      </div>
                      <div className={styles.uploadBox} onClick={() => logoInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                        {formData.logo_url ? (
                          <img src={formData.logo_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <>
                            <FiUpload className={styles.uploadIcon} />
                            <span>Pilih atau letakkan berkas di sini</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.labelWrapper}>
                        <label>Logo Struk</label>
                        <span className={styles.labelSubtext}>Ukuran dapat diatur sesuai kebutuhan, maks 1MB</span>
                      </div>
                      <div className={styles.uploadBox} onClick={() => strukLogoInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                        {formData.struk_logo_url ? (
                          <img src={formData.struk_logo_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <>
                            <FiUpload className={styles.uploadIcon} />
                            <span>Pilih atau letakkan berkas di sini</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Outlet Section */}
                <div>
                  <h3 className={styles.subSectionHeader}>Detail Outlet</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className={styles.formRow}>
                      <label>
                        Nama Outlet<span className={styles.required}>*</span>
                        <div className={styles.tooltipWrapper}>
                          <FiInfo size={14} className={styles.labelInfo} />
                          <div className={styles.tooltipText}>Nama Outlet akan diterapkan di berbagai fitur dan produk skala yang terintegrasi</div>
                        </div>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className={styles.input}
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        placeholder="Masukkan Nama Outlet"
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.labelWrapper}>
                        <label>Manager Outlet</label>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className={styles.inputWrapper} style={{ flex: 1 }}>
                            <input
                              type="text"
                              name="manager_name"
                              className={`${styles.input} ${styles.inputManager}`}
                              value={formData.manager_name || ''}
                              placeholder="Pilih manager outlet"
                              readOnly
                            />
                          </div>
                          <div
                            style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onClick={() => {
                              console.log('Opening Manager Picker...');
                              setShowManagerPicker(true);
                            }}
                          >
                            <FiMoreHorizontal size={20} style={{ color: '#64748b' }} />
                          </div>
                        </div>
                        <button
                          className={styles.btnTealBorder}
                          style={{ marginTop: 0 }}
                          onClick={() => {
                            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                            const randomLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
                            const randomNumbers = Math.floor(100000 + Math.random() * 900000).toString();
                            const newNIP = randomLetters + randomNumbers;

                            setManagerFormData({
                              name: '',
                              nip: newNIP,
                              phone: '',
                              position: '',
                              outlet: formData.name || 'Rupa Leather',
                              pin: '123456',
                              access_level: '',
                              email: ''
                            });
                            setEmailError('');
                            setShowAddManagerModal(true);
                          }}
                        >
                          Tambah Manager
                        </button>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <label>Jenis Outlet</label>
                      <div className={styles.radioGroup}>
                        <div
                          className={`${styles.radioOption} ${formData.outlet_type === 'penjualan' ? styles.radioOptionActive : ''}`}
                          onClick={() => setFormData(p => ({ ...p, outlet_type: 'penjualan' }))}
                        >
                          <div className={`${styles.radioCircle} ${formData.outlet_type === 'penjualan' ? styles.radioCircleActive : ''}`}>
                            {formData.outlet_type === 'penjualan' && <div className={styles.radioInner}></div>}
                          </div>
                          <span>Penjualan</span>
                        </div>
                        <div
                          className={`${styles.radioOption} ${formData.outlet_type === 'gudang' ? styles.radioOptionActive : ''}`}
                          onClick={() => setFormData(p => ({ ...p, outlet_type: 'gudang' }))}
                        >
                          <div className={`${styles.radioCircle} ${formData.outlet_type === 'gudang' ? styles.radioCircleActive : ''}`}>
                            {formData.outlet_type === 'gudang' && <div className={styles.radioInner}></div>}
                          </div>
                          <span>Gudang</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <label>Status Outlet</label>
                      <div className={styles.radioGroup}>
                        <div
                          className={`${styles.radioOption} ${formData.status === 'buka' ? styles.radioOptionActive : ''}`}
                          onClick={() => setFormData(p => ({ ...p, status: 'buka' }))}
                        >
                          <div className={`${styles.radioCircle} ${formData.status === 'buka' ? styles.radioCircleActive : ''}`}>
                            {formData.status === 'buka' && <div className={styles.radioInner}></div>}
                          </div>
                          <span>Buka</span>
                        </div>
                        <div
                          className={`${styles.radioOption} ${formData.status === 'tutup' ? styles.radioOptionActive : ''}`}
                          onClick={() => setFormData(p => ({ ...p, status: 'tutup' }))}
                        >
                          <div className={`${styles.radioCircle} ${formData.status === 'tutup' ? styles.radioCircleActive : ''}`}>
                            {formData.status === 'tutup' && <div className={styles.radioInner}></div>}
                          </div>
                          <span>Tutup</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <label>Layanan Langganan</label>
                      <input type="text" className={`${styles.input} ${styles.inputReadonly}`} value={formData.subscription_plan || 'TRIAL'} readOnly />
                    </div>

                    <div className={styles.formRow}>
                      <label>Masa Berlaku</label>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                          type="text"
                          className={`${styles.input} ${styles.inputReadonly}`}
                          value={formData.expiry_date ? new Date(formData.expiry_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                          readOnly
                        />
                        <button className={styles.extendBtn}>Perpanjang</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jadwal Operasional Section */}
                <div className={styles.scheduleContainer}>
                  <h3 className={styles.subSectionHeader}>
                    Jadwal Operasional Outlet
                    <div className={styles.tooltipWrapper}>
                      <FiInfo size={14} className={styles.labelInfo} />
                      <div className={styles.tooltipText}>Jadwal Operasional Outlet akan diterapkan di berbagai fitur dan produk skala yang terintegrasi</div>
                    </div>
                  </h3>
                  <p className={styles.labelSubtext} style={{ marginBottom: '2rem' }}>
                    Tentukan hari dan jam operasional outlet serta atur buka dan tutup outlet
                  </p>

                  <div className={styles.scheduleHeaderGrid}>
                    <span>Hari</span>
                    <span></span>
                    <span>Jam Buka</span>
                    <span>Jam Tutup</span>
                    <span>24 Jam</span>
                    <span>Shift</span>
                  </div>

                  {/* Setiap Hari Toggle */}
                  <div className={styles.scheduleRow}>
                    <span className={styles.dayLabel}>Setiap hari</span>
                    <div
                      className={`${styles.switch} ${['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].every(d => (formData.schedule as any)?.[d]?.enabled) ? styles.switchActive : ''}`}
                      onClick={toggleAllDays}
                    >
                      <span className={`${styles.switchLabel} ${['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].every(d => (formData.schedule as any)?.[d]?.enabled) ? styles.switchLabelOn : styles.switchLabelOff}`}>
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].every(d => (formData.schedule as any)?.[d]?.enabled) ? 'ON' : 'OFF'}
                      </span>
                      <div className={`${styles.switchHandle} ${['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].every(d => (formData.schedule as any)?.[d]?.enabled) ? styles.switchHandleActive : ''}`}></div>
                    </div>
                  </div>

                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => {
                    const dayData = (formData.schedule as any)?.[day] || {
                      enabled: false,
                      shifts: [{ open: '00:00', close: '23:59', is24h: true }]
                    };

                    const shifts = dayData.shifts || [{
                      open: dayData.open || '00:00',
                      close: dayData.close || '23:59',
                      is24h: dayData.is24h !== undefined ? dayData.is24h : true
                    }];

                    return (
                      <React.Fragment key={day}>
                        {shifts.map((shift: any, index: number) => (
                          <div className={styles.scheduleRow} key={`${day}-${index}`}>
                            <span className={styles.dayLabel}>
                              {index === 0 ? day : ''}
                            </span>
                            <div>
                              {index === 0 && (
                                <div
                                  className={`${styles.switch} ${dayData.enabled ? styles.switchActive : ''}`}
                                  onClick={() => handleScheduleUpdate(day, 'enabled', !dayData.enabled)}
                                >
                                  <span className={`${styles.switchLabel} ${dayData.enabled ? styles.switchLabelOn : styles.switchLabelOff}`}>
                                    {dayData.enabled ? 'ON' : 'OFF'}
                                  </span>
                                  <div className={`${styles.switchHandle} ${dayData.enabled ? styles.switchHandleActive : ''}`}></div>
                                </div>
                              )}
                            </div>
                            <CustomTimePicker
                              value={shift.open}
                              disabled={!dayData.enabled || shift.is24h}
                              isDayOff={!dayData.enabled}
                              onChange={(val) => handleScheduleUpdate(day, 'open', val, index)}
                            />
                            <CustomTimePicker
                              value={shift.close}
                              disabled={!dayData.enabled || shift.is24h}
                              isDayOff={!dayData.enabled}
                              onChange={(val) => handleScheduleUpdate(day, 'close', val, index)}
                            />
                            <div
                              className={`${styles.checkboxContainer} ${!dayData.enabled ? styles.checkboxContainerDisabled : ''}`}
                              onClick={() => dayData.enabled && handleScheduleUpdate(day, 'is24h', !shift.is24h, index)}
                            >
                              <div className={`${styles.checkbox} ${shift.is24h ? styles.checkboxActive : ''}`}>
                                {shift.is24h && <FiCheck size={14} />}
                              </div>
                              <span>24 Jam</span>
                            </div>
                            {index === 0 ? (
                              <button
                                className={`${styles.plusBtn} ${(dayData.enabled && !shift.is24h) ? styles.plusBtnActive : ''}`}
                                disabled={!dayData.enabled || shift.is24h}
                                onClick={() => dayData.enabled && !shift.is24h && addShift(day)}
                              >
                                <FiPlus size={20} />
                              </button>
                            ) : (
                              <button
                                className={styles.deleteShiftBtn}
                                disabled={!dayData.enabled}
                                onClick={() => dayData.enabled && removeShift(day, index)}
                                style={{ opacity: dayData.enabled ? 1 : 0.5, cursor: dayData.enabled ? 'pointer' : 'not-allowed' }}
                              >
                                <FiTrash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tutup Toko Card */}
            <div className={styles.formCard}>
              <h2 className={styles.sectionHeader}>Tutup Toko</h2>
              <div className={styles.formRow}>
                <label>Tutup Toko</label>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      className={`${styles.switch} ${formData.close_store_enabled ? styles.switchActive : ''}`}
                      onClick={() => setFormData(p => ({ ...p, close_store_enabled: !p.close_store_enabled }))}
                    >
                      <span className={`${styles.switchLabel} ${formData.close_store_enabled ? styles.switchLabelOn : styles.switchLabelOff}`}>
                        {formData.close_store_enabled ? 'ON' : 'OFF'}
                      </span>
                      <div className={`${styles.switchHandle} ${formData.close_store_enabled ? styles.switchHandleActive : ''}`}></div>
                    </div>
                    <span className={styles.labelSubtext} style={{ color: '#64748b', fontWeight: 600 }}>
                      Tutup Toko {formData.close_store_enabled ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                  <p className={styles.labelSubtext} style={{ marginTop: '1rem', maxWidth: '500px' }}>
                    Fitur Tutup Toko berfungsi untuk mengakhiri operasional harian di POS sekaligus menghasilkan laporan tutup toko
                  </p>

                  {formData.close_store_enabled && (
                    <>
                      <div className={styles.formRow} style={{ marginTop: '2rem', padding: 0, border: 'none' }}>
                        <label style={{ width: '180px' }}>Atur Tampilan Cetak Laporan Tutup Toko</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button type="button" className={styles.outlineBtn} onClick={() => setIsTutupTokoModalOpen(true)}>
                            Atur Tampilan
                          </button>
                          <p className={styles.labelSubtext}>
                            Atur data apa saja yang akan tampil pada hasil cetak tutup toko
                          </p>
                        </div>
                      </div>

                      <div className={styles.termsContainer}>
                        <h3 className={styles.termsHeader}>Syarat dan Ketentuan:</h3>
                        <ol className={styles.termsList}>
                          <li>Saat mengaktifkan fitur Tutup Toko, maka proses buka/tutup toko dan buka/tutup kasir harus dalam kondisi online.</li>
                          <li>Pastikan tidak ada shift kasir yang sedang berjalan sebelum mengatur fitur Tutup Toko. (Fitur tutup toko tidak dapat diatur jika masih terdapat shift kasir yang aktif)</li>
                          <li>Tutup toko tidak akan mempengaruhi proses aktivitas yang terjadi di Toko Online dan Marketplace. Transaksi masih dapat terbuat dan masuk pada masa tutup toko.</li>
                        </ol>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Kontak Outlet Card */}
            <div className={styles.formCard}>
              <h2 className={styles.sectionHeader}>Kontak Outlet</h2>
              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <label>Telepon<span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="phone"
                    className={styles.input}
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nomor Telepon"
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Whatsapp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    className={styles.input}
                    value={formData.whatsapp || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081 231600681"
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    className={styles.input}
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    placeholder="Masukkan Alamat Email"
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.labelWrapper}>
                    <label>
                      Alamat
                      <div className={styles.tooltipWrapper}>
                        <FiInfo size={14} className={styles.labelInfo} />
                        <div className={styles.tooltipText}>Alamat digunakan untuk kebutuhan transaksi dengan metode pengiriman di berbagai fitur dan produk skala yang terintegrasi</div>
                      </div>
                    </label>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* 3. Negara + Provinsi */}
                    <div className={styles.addressGrid}>
                      <div>
                        <label className={styles.innerLabel}>Negara<span className={styles.required}>*</span></label>
                        <input
                          type="text"
                          className={`${styles.input} ${styles.inputReadonly} ${styles.readonlyValue}`}
                          defaultValue="Indonesia"
                          readOnly
                        />
                      </div>
                      <RegionSelect
                        label="Provinsi"
                        value={toTitleCase(formData.province)}
                        options={provinces.map(toTitleCase)}
                        onChange={handleProvinceChange}
                        required
                      />
                    </div>

                    {/* 4. Kota + Kecamatan */}
                    <div className={styles.addressGrid}>
                      <RegionSelect
                        label="Kota"
                        value={toTitleCase(formData.city)}
                        options={cities.map(toTitleCase)}
                        onChange={handleCityChange}
                        disabled={formData.province === 'Pilih'}
                        loading={isLoadingRegions && formData.province !== 'Pilih' && cities.length === 0}
                        required
                      />
                      <RegionSelect
                        label="Kecamatan"
                        value={toTitleCase(formData.district)}
                        options={districts.map(toTitleCase)}
                        onChange={district => setFormData(p => ({ ...p, district }))}
                        disabled={formData.city === 'Pilih'}
                        loading={isLoadingRegions && formData.city !== 'Pilih' && districts.length === 0}
                        required
                      />
                    </div>

                    {/* Alamat Lengkap Section */}
                    <div style={{ marginTop: '0rem' }}>
                      <label className={styles.innerLabel}>Alamat Lengkap<span className={styles.required}>*</span></label>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className={styles.input}
                          value={formData.address || ''}
                          onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                          placeholder="Contoh: Jalan Mangga No.12"
                        />
                        <button
                          className={styles.btnOrangeBorderSmall}
                          onClick={(e) => { e.preventDefault(); setShowMap(true); }}
                        >
                          Ubah
                        </button>
                      </div>
                      <p className={styles.labelSubtext} style={{ marginTop: '0.5rem' }}>
                        Pilih lokasi melalui Maps
                      </p>
                      <div style={{ marginTop: '1rem' }}>
                        <div className={styles.labelWrapper} style={{ marginBottom: '0.5rem' }}>
                          <label className={styles.innerLabel}>Catatan/Patokan <span className={styles.optionalBadge}>opsional</span></label>
                        </div>
                        <textarea
                          className={styles.textarea}
                          style={{ minHeight: '80px' }}
                          placeholder="Contoh: Depan Kantor Cabang Mandiri Sudirman"
                          value={formData.address_note || ''}
                          onChange={(e) => setFormData(p => ({ ...p, address_note: e.target.value }))}
                          maxLength={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informasi Sosial Media Section */}
                <div className={styles.formRow} style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                  <div className={styles.labelWrapper}>
                    <label>Informasi Sosial Media</label>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className={styles.infoBadgeOrange}>
                      <FiInfo size={20} style={{ color: '#f97316', minWidth: '20px' }} />
                      <span>
                        Silakan isi Media Sosial terlebih dahulu lalu tekan Enter untuk menambah Media Sosial lainnya! (Max 4)
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {((formData as any).social_media || []).map((sm: any, index: number) => {
                        const allPlatforms = ['Facebook', 'Instagram', 'Twitter', 'TikTok'];
                        const usedPlatforms = ((formData as any).social_media || []).map((s: any) => s.platform);

                        return (
                          <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 46px', gap: '1.5rem', alignItems: 'flex-end', width: '100%' }}>
                            <div className={styles.labelWrapper}>
                              <label className={styles.innerLabel} style={{ marginBottom: '0.75rem', display: 'block' }}>Nama Media Sosial</label>
                              <div className={styles.inputWrapper}>
                                <select
                                  className={styles.input}
                                  style={{ appearance: 'none', background: 'white' }}
                                  value={sm.platform}
                                  onChange={(e) => handleSocialMediaUpdate(index, 'platform', e.target.value)}
                                >
                                  {allPlatforms.map(platform => {
                                    if (platform === sm.platform || !usedPlatforms.includes(platform)) {
                                      return <option key={platform} value={platform}>{platform}</option>;
                                    }
                                    return null;
                                  })}
                                </select>
                                <FiChevronDown className={styles.inputIcon} />
                              </div>
                            </div>
                            <div className={styles.labelWrapper}>
                              <label className={styles.innerLabel} style={{ marginBottom: '0.75rem', display: 'block' }}>Akun Media Sosial</label>
                              <input
                                type="text"
                                className={styles.input}
                                style={{ background: 'white' }}
                                placeholder="rupa"
                                value={sm.username}
                                onChange={(e) => handleSocialMediaUpdate(index, 'username', e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSocialMedia();
                                  }
                                }}
                              />
                            </div>
                            {index > 0 ? (
                              <button
                                type="button"
                                onClick={() => removeSocialMedia(index)}
                                className={styles.deleteBtn}
                                style={{ height: '46px', width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <FiTrash2 size={18} color="#ef4444" />
                              </button>
                            ) : (
                              <div style={{ height: '46px', width: '46px' }} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className={styles.fullPageFooter}>
            <button className={styles.deleteBtn}>
              <FiTrash2 size={20} />
            </button>
            <div className={styles.footerRight}>
              <button className={styles.batalBtn} onClick={() => setShowCancelConfirm(true)}>Batal</button>
              <button
                className={styles.simpanBtn}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
      <LocationPicker
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        initialAddress={formData.address}
        initialLat={formData.latitude}
        initialLng={formData.longitude}
        initialNote={formData.address_note}
        onSelectLocation={(address, lat, lng, note) => {
          setFormData(p => ({ ...p, address, latitude: lat, longitude: lng, address_note: note }));
        }}
      />

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className={styles.confirmModalOverlay}>
          <div className={styles.confirmModalContent}>
            <div className={styles.confirmModalHeader}>
              <h2>Batal Simpan Pengaturan</h2>
              <button className={styles.closeModalBtn} onClick={() => setShowCancelConfirm(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className={styles.confirmModalBody}>
              <p>Membatalkan pengaturan outlet akan menghapus seluruh perubahan data yang telah diinput dan tidak dapat dibatalkan. Lanjutkan?</p>
            </div>
            <div className={styles.confirmModalFooter}>
              <button className={styles.cancelBatalBtn} onClick={() => setShowCancelConfirm(false)}>Batal</button>
              <button className={styles.cancelLanjutkanBtn} onClick={handleCloseModal}>Ya, Lanjutkan</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showSaveConfirm && (
        <div className={styles.confirmModalOverlay}>
          <div className={styles.confirmModalContent}>
            <div className={styles.confirmModalHeader}>
              <h2>Simpan Pengaturan Outlet</h2>
              <button className={styles.closeModalBtn} onClick={() => setShowSaveConfirm(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className={styles.confirmModalBody}>
              <p>Pengaturan Outlet <strong>{formData.name || 'Kenes'}</strong> akan disimpan dan tampil di daftar Outlet. Lanjutkan?</p>
            </div>
            <div className={styles.confirmModalFooter}>
              <button className={styles.confirmBatalBtn} onClick={() => setShowSaveConfirm(false)}>Batal</button>
              <button className={styles.confirmLanjutkanBtn} onClick={finalizeSave}>Ya, Lanjutkan</button>
            </div>
          </div>
        </div>
      )}
      <ImageEditor
        isOpen={showImageEditor}
        onClose={() => setShowImageEditor(false)}
        image={editorImage}
        onSave={handleEditorSave}
      />

      {/* Manager Picker Modal */}
      {showManagerPicker && (
        <div className={styles.managerPickerOverlay}>
          <div className={styles.managerPickerContainer}>
            <div className={styles.managerPickerHeader}>
              <h3>Pilih Manager Outlet</h3>
              <button className={styles.managerPickerClose} onClick={() => setShowManagerPicker(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div className={styles.managerPickerSearch}>
              <FiSearch className={styles.managerPickerSearchIcon} size={18} />
              <input type="text" placeholder="Cari ..." />
            </div>

            <table className={styles.managerPickerTable}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>NAMA</th>
                  <th>OUTLET</th>
                  <th>SUPERVISOR</th>
                </tr>
              </thead>
              <tbody>
                {managerList.map((manager) => (
                  <tr key={manager.id}>
                    <td>
                      <div
                        className={`${styles.managerPickerRadio} ${selectedManagerId === manager.id ? styles.managerPickerRadioActive : ''}`}
                        onClick={() => setSelectedManagerId(manager.id)}
                      >
                        {selectedManagerId === manager.id && <div className={styles.managerPickerRadioInner}></div>}
                      </div>
                    </td>
                    <td>{manager.name}</td>
                    <td>{manager.outlet}</td>
                    <td>{selectedManagerId === manager.id ? 'Ya' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.managerPickerFooter}>
              <button className={styles.managerPickerBatal} onClick={() => setShowManagerPicker(false)}>Batal</button>
              <button className={styles.managerPickerPilih} onClick={() => {
                const selected = managerList.find(m => m.id === selectedManagerId);
                if (selected) {
                  setManagerFormData({
                    name: selected.name,
                    nip: (selected as any).nip || 'KC260001',
                    phone: (selected as any).phone || '',
                    position: (selected as any).position || '',
                    outlet: selected.outlet || '',
                    pin: (selected as any).pin || '123456',
                    access_level: (selected as any).access_level || 'Manager',
                    email: (selected as any).email || ''
                  });
                  setShowManagerPicker(false);
                  setShowManagerConfirm(true);
                }
              }}>Pilih</button>
            </div>
          </div>
        </div>
      )}

      {/* Manager Confirmation Modal */}
      {showManagerConfirm && (
        <div className={styles.managerPickerOverlay}>
          <div className={styles.managerConfirmContainer}>
            <div className={styles.managerPickerHeader}>
              <h3>Konfirmasi Manager Outlet</h3>
              <button className={styles.managerPickerClose} onClick={() => setShowManagerConfirm(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div className={styles.managerConfirmInfo}>
              Karyawan <strong>{managerFormData.name || formData.manager_name || 'Edho'}</strong> akan menjadi Manager Outlet <strong>{managerFormData.outlet || formData.name || 'Rupa Leather'}</strong>. Simpan untuk melanjutkan.
            </div>

            <div className={styles.managerConfirmGrid}>
              <div className={styles.managerConfirmField}>
                <label>Nama</label>
                <input type="text" className={styles.managerConfirmInput} value={managerFormData.name || formData.manager_name || 'Edho'} readOnly />
              </div>
              <div className={styles.managerConfirmField}>
                <label>Nomor Induk Pegawai</label>
                <input type="text" className={styles.managerConfirmInput} value={managerFormData.nip || generatedNIP} readOnly />
              </div>
              <div className={styles.managerConfirmField}>
                <label>No Telepon</label>
                <input type="text" className={styles.managerConfirmInput} value={managerFormData.phone || formData.phone || '082264186693'} readOnly />
              </div>
              <div className={styles.managerConfirmField}>
                <label>Posisi</label>
                <input type="text" className={styles.managerConfirmInput} value={managerFormData.position} placeholder="Contoh: Kasir" readOnly />
              </div>
              <div className={styles.managerConfirmField}>
                <label>Outlet</label>
                <input type="text" className={styles.managerConfirmInput} value={managerFormData.outlet || formData.name || 'Rupa Leather'} readOnly />
              </div>
              <div className={styles.managerConfirmField}>
                <label>PIN</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPin ? 'text' : 'password'}
                    className={styles.input}
                    value={managerFormData.pin || "123456"}
                    placeholder="Contoh: 123456"
                    readOnly
                  />
                  <div
                    onClick={() => setShowPin(!showPin)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {showPin ? (
                      <FiEyeOff className={styles.inputIcon} size={20} style={{ color: '#64748b' }} />
                    ) : (
                      <FiEye className={styles.inputIcon} size={20} style={{ color: '#64748b' }} />
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Default PIN: 123456</span>
              </div>
              <div className={styles.managerConfirmField}>
                <label>Hak Akses</label>
                <input type="text" className={styles.managerConfirmInput} value={managerFormData.access_level || 'Admin'} readOnly />
              </div>
              <div className={styles.managerConfirmField}>
                <label>Email</label>
                <input type="text" className={styles.managerConfirmInput} value={managerFormData.email || formData.email || 'rupaleather@gmail.com'} readOnly />
              </div>
            </div>

            <div className={styles.managerConfirmFooter}>
              <button className={styles.managerConfirmBatal} onClick={() => setShowManagerConfirm(false)}>Batal</button>
              <button className={styles.managerConfirmSimpan} onClick={async () => {
                const newManagerData = {
                  name: managerFormData.name || 'Edho',
                  outlet: managerFormData.outlet || formData.name || 'Rupa Leather',
                  supervisor: managerFormData.access_level === 'Admin' ? 'Ya' : '-',
                  phone: managerFormData.phone,
                  nip: managerFormData.nip,
                  position: managerFormData.position,
                  pin: managerFormData.pin,
                  access_level: managerFormData.access_level,
                  email: managerFormData.email
                };

                setIsLoading(true);
                try {
                  const response = await fetch('/api/dashboard/staff', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newManagerData)
                  });

                  const result = await response.json();

                  if (result.success) {
                    const savedManager = result.data;
                    setManagerList(prev => [savedManager, ...prev]);
                    setSelectedManagerId(savedManager.id);
                    setFormData(prev => ({ ...prev, manager_name: savedManager.name }));
                    setShowManagerConfirm(false);
                  } else {
                    alert('Gagal menyimpan manager: ' + result.error);
                  }
                } catch (err: any) {
                  alert('Terjadi kesalahan network: ' + err.message);
                } finally {
                  setIsLoading(false);
                }
              }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Tambah Manager Modal */}
      {showAddManagerModal && (
        <div className={styles.managerPickerOverlay}>
          <div className={styles.addManagerContainer}>
            <div className={styles.addManagerHeader}>
              <h2>Tambah Manager Outlet</h2>
              <button className={styles.addManagerClose} onClick={() => setShowAddManagerModal(false)}>
                <FiX size={24} />
              </button>
            </div>

            <div className={styles.addManagerBody}>
              <div className={styles.addManagerField}>
                <label>Nama<span className={styles.requiredAsterisk}>*</span></label>
                <input
                  type="text"
                  name="name"
                  className={styles.addManagerInput}
                  placeholder="Contoh: Adi"
                  value={managerFormData.name}
                  onChange={handleManagerInputChange}
                />
              </div>
              <div className={styles.addManagerField}>
                <label>Nomor Induk Pegawai</label>
                <input
                  type="text"
                  name="nip"
                  className={styles.addManagerInput}
                  value={managerFormData.nip}
                  onChange={handleManagerInputChange}
                />
              </div>
              <div className={styles.addManagerField}>
                <label>No Telepon</label>
                <input
                  type="text"
                  name="phone"
                  className={styles.addManagerInput}
                  placeholder="Contoh: 081222333444"
                  value={managerFormData.phone}
                  onChange={handleManagerInputChange}
                />
              </div>
              <div className={styles.addManagerField}>
                <label>Posisi</label>
                <input
                  type="text"
                  name="position"
                  className={styles.addManagerInput}
                  placeholder="Contoh: Kasir"
                  value={managerFormData.position}
                  onChange={handleManagerInputChange}
                />
              </div>
              <div className={styles.addManagerField}>
                <label>Outlet</label>
                <input
                  type="text"
                  name="outlet"
                  className={styles.addManagerInput}
                  value={managerFormData.outlet}
                  onChange={handleManagerInputChange}
                />
              </div>
              <div className={styles.addManagerField}>
                <label>PIN</label>
                <div className={styles.pinInputWrapper}>
                  <input
                    type={showManagerPin ? 'text' : 'password'}
                    name="pin"
                    className={`${styles.addManagerInput} ${styles.pinInput}`}
                    placeholder="......"
                    value={managerFormData.pin}
                    onChange={handleManagerInputChange}
                  />
                  <div
                    className={styles.pinToggle}
                    onClick={() => setShowManagerPin(!showManagerPin)}
                  >
                    {showManagerPin ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Default PIN: 123456</span>
              </div>
              <div className={styles.addManagerField}>
                <label>Hak Akses<span className={styles.requiredAsterisk}>*</span></label>
                <div className={styles.accessDropdownWrapper} ref={accessDropdownRef}>
                  <div
                    className={`${styles.accessDropdownHeader} ${showAccessDropdown ? styles.accessDropdownHeaderActive : ''}`}
                    onClick={() => setShowAccessDropdown(!showAccessDropdown)}
                  >
                    <span className={`${styles.accessDropdownHeaderText} ${!managerFormData.access_level ? styles.accessDropdownHeaderTextEmpty : ''}`}>
                      {managerFormData.access_level || 'Pilih'}
                    </span>
                    <FiChevronDown size={20} style={{ color: '#1e293b', transform: showAccessDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>

                  {showAccessDropdown && (
                    <div className={styles.accessDropdownList}>
                      {['Admin', 'Manager', 'Warehouse'].map((role) => (
                        <div
                          key={role}
                          className={styles.accessDropdownItem}
                          onClick={() => {
                            setManagerFormData(prev => ({ ...prev, access_level: role }));
                            setShowAccessDropdown(false);
                          }}
                        >
                          {role}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.addManagerField}>
                <label>Email<span className={styles.requiredAsterisk}>*</span></label>
                <input
                  type="email"
                  name="email"
                  className={styles.addManagerInput}
                  placeholder="Contoh: adi@gmail.com"
                  value={managerFormData.email}
                  onChange={(e) => {
                    handleManagerInputChange(e);
                    setEmailError('');
                  }}
                />
                {emailError && <span className={styles.errorText}>{emailError}</span>}
              </div>
            </div>

            <div className={styles.addManagerFooter}>
              <button className={styles.addManagerBatal} onClick={() => setShowAddManagerModal(false)}>Batal</button>
              <button className={styles.addManagerSimpan} onClick={() => {
                // Validasi email tidak boleh sama dengan email akun
                if (managerFormData.email.toLowerCase() === accountEmail.toLowerCase()) {
                  setEmailError('Email ini sudah terdaftar sebagai email akun utama. Silakan gunakan email lain untuk manager.');
                  return;
                }

                // Validasi field wajib
                if (!managerFormData.name || !managerFormData.email || !managerFormData.access_level) {
                  alert('Harap lengkapi semua bidang yang wajib diisi (*)');
                  return;
                }

                setShowAddManagerModal(false);
                setShowVerificationModal(true);
              }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className={styles.managerPickerOverlay}>
          <div className={styles.verificationContainer}>
            <div className={styles.addManagerHeader}>
              <h2>Verifikasi</h2>
              <button className={styles.addManagerClose} onClick={() => setShowVerificationModal(false)}>
                <FiX size={24} />
              </button>
            </div>

            <div className={styles.verificationBody}>
              <p className={styles.verificationText}>
                Kode verifikasi sudah dikirimkan melalui email ke akun <b>{managerFormData.email}</b>
              </p>

              <div className={styles.addManagerField}>
                <label>Kode Verifikasi</label>
                <div className={styles.pinInputWrapper}>
                  <input
                    type="text"
                    className={`${styles.addManagerInput} ${styles.pinInput}`}
                    placeholder="Contoh: 12345 (5 digit kode)"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <div className={styles.pinToggle}>
                    <FiEye size={20} />
                  </div>
                </div>
              </div>

              <div>
                <p className={styles.resendText}>Belum menerima kode?</p>
                <span className={styles.resendLink}>Kirim Ulang</span>
              </div>
            </div>

            <div className={styles.addManagerFooter}>
              <button className={styles.addManagerBatal} onClick={() => setShowVerificationModal(false)}>Batal</button>
              <button
                className={`${styles.btnVerifikasi} ${verificationCode ? styles.btnVerifikasiActive : ''}`}
                disabled={!verificationCode}
                onClick={() => {
                  setShowVerificationModal(false);
                  setShowManagerConfirm(true);
                  setVerificationCode('');
                }}
              >
                Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {isTutupTokoModalOpen && (
        <TutupTokoModal
          onClose={() => setIsTutupTokoModalOpen(false)}
          initialSettings={formData.tutup_toko_settings}
          onSave={(settings) => setFormData(prev => ({ ...prev, tutup_toko_settings: settings }))}
        />
      )}
      {/* Toast Notification */}
      {showToast && (
        <div className={styles.toastContainer}>
          <div className={styles.toastLeftBar}></div>
          <div className={styles.toastContent}>
            <div className={styles.toastTitle}>Berhasil!</div>
            <div className={styles.toastText}>
              Outlet <strong>{formData.name}</strong> {toastMessage.includes('diubah') ? 'berhasil diubah' : 'berhasil ditambah'}
            </div>
          </div>
          <button className={styles.toastClose} onClick={() => setShowToast(false)}>
            <FiX size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
