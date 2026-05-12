'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './account-info.module.css';
import { 
  FiHeart, 
  FiCheckCircle, 
  FiUpload, 
  FiLoader,
  FiX,
  FiMail,
  FiEye,
  FiRotateCcw,
  FiRotateCw,
  FiRepeat,
  FiStar
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import RegionSelect from '@/components/RegionSelect/RegionSelect';
import ImageEditor from '@/components/ImageEditor/ImageEditor';

export default function AccountInfoPage() {
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const npwpInputRef = useRef<HTMLInputElement>(null);

  const [accountData, setAccountData] = useState({
    email: '',
    phone: '',
    phone2: '',
    phone3: '',
    identity_type: 'KTP',
    identity_number: '',
    identity_url: '',
    npwp_number: '',
    npwp_url: '',
    province: 'Pilih',
    city: 'Pilih',
    address: '',
    country: 'Indonesia',
    district: 'Pilih',
    role: 'Admin',
    pin: '',
    id: '',
  });

  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPin, setShowPin] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [modalStep, setModalStep] = useState<'method' | 'otp'>('method');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editorImage, setEditorImage] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'identity' | 'npwp' | null>(null);

  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const loadAccountInfo = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await fetch('/api/dashboard/profile?type=account');
      if (!res.ok) throw new Error('Gagal mengambil data terbaru');
      
      const { data: d } = await res.json();
      if (d) {
        setAccountData({
          email: d.email || '',
          phone: d.phone1 || d.phone || '',
          phone2: d.phone2 || '',
          phone3: d.phone3 || '',
          identity_type: d.identity_type || 'KTP',
          identity_number: d.ktp || d.identity_number || '',
          identity_url: d.ktp_file_url || d.identity_url || '',
          npwp_number: d.npwp || d.npwp_number || '',
          npwp_url: d.npwp_file_url || d.npwp_url || '',
          province: d.province || 'Pilih',
          city: d.city || 'Pilih',
          address: d.address || '',
          country: d.country || 'Indonesia',
          district: d.district || 'Pilih',
          role: d.role || 'Admin',
          pin: d.pin || '',
          id: d.id || '',
        });
        
        // Parallel fetching for region names
        const fetchRegions = async () => {
          if (d.province && d.province !== 'Pilih') {
            const [cityRes, districtRes] = await Promise.all([
              fetch(`/api/regions?level=kota&provinsi=${encodeURIComponent(d.province.toUpperCase())}`).then(r => r.json()),
              d.city && d.city !== 'Pilih' 
                ? fetch(`/api/regions?level=kecamatan&provinsi=${encodeURIComponent(d.province.toUpperCase())}&kota=${encodeURIComponent(d.city.toUpperCase())}`).then(r => r.json())
                : Promise.resolve({ data: [] })
            ]);
            
            if (cityRes.data) setCities(cityRes.data);
            if (districtRes.data) setDistricts(districtRes.data);
          }
        };
        fetchRegions();
      }
    } catch (error: any) { 
      console.error('Fetch error:', error);
      setSaveStatus('error');
      setSaveMessage('Gagal sinkronisasi dengan database. Periksa koneksi internet Anda.');
    } finally { 
      if (showLoading) setIsLoading(false); 
    }
  }, []);

  useEffect(() => { loadAccountInfo(); }, [loadAccountInfo]);

  // Pseudo-Realtime: Sync when window gets focus
  useEffect(() => {
    const handleFocus = () => loadAccountInfo(false);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadAccountInfo]);

  useEffect(() => {
    fetch('/api/regions?level=provinsi')
      .then(res => res.json())
      .then(res => { if (res.data) setProvinces(res.data); });
  }, []);

  const handleProvinceChange = (province: string) => {
    setAccountData(prev => ({ ...prev, province, city: 'Pilih', district: 'Pilih' }));
    setCities([]);
    setDistricts([]);
    if (province !== 'Pilih') {
      fetch(`/api/regions?level=kota&provinsi=${encodeURIComponent(province.toUpperCase())}`)
        .then(res => res.json())
        .then(res => { if (res.data) setCities(res.data); });
    }
  };

  const handleCityChange = (city: string) => {
    setAccountData(prev => ({ ...prev, city, district: 'Pilih' }));
    setDistricts([]);
    if (city !== 'Pilih') {
      fetch(`/api/regions?level=kecamatan&provinsi=${encodeURIComponent(accountData.province.toUpperCase())}&kota=${encodeURIComponent(city.toUpperCase())}`)
        .then(res => res.json())
        .then(res => { if (res.data) setDistricts(res.data); });
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveStatus('idle');
    setSaveMessage('');

    try {
      // Map state fields to DB columns
      const payload = {
        ...accountData,
        type: 'account',
        phone1: accountData.phone,
        ktp: accountData.identity_number,
        ktp_file_url: accountData.identity_url,
        npwp: accountData.npwp_number,
        npwp_file_url: accountData.npwp_url
      };

      const res = await fetch('/api/dashboard/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menyimpan data');

      setSaveStatus('success');
      setSaveMessage('Data berhasil disinkronkan dengan Supabase');
      setIsEditable(false);
      
      if (result.data) {
        setAccountData(prev => ({ ...prev, ...result.data }));
      }
    } catch (error: any) {
      console.error('Save error:', error);
      setSaveStatus('error');
      setSaveMessage(error.message || 'Terjadi kesalahan saat sinkronisasi');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleOpenAccess = () => {
    setOtp(['', '', '', '', '', '']);
    setShowVerifyModal(true);
    setModalStep('method');
  };

  const handleVerifyOTP = () => { 
    setIsEditable(true); 
    setShowVerifyModal(false); 
    setOtp(['', '', '', '', '', '']);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const toTitleCase = (str: any) => {
    if (!str || typeof str !== 'string' || str === 'Pilih') return str;
    return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const maskEmail = (e: string) => { if (!e) return ''; const [n, d] = e.split('@'); return n.substring(0, 3) + '***@' + d.substring(0, 2) + '*********'; };
  const maskPhone = (p: string) => { if (!p) return ''; return p.replace(/(\d{4})\d+(\d{3})/, '$1*****$2'); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'identity' | 'npwp') => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onloadend = () => { 
        setEditorImage(r.result as string); 
        setEditingField(field); 
        setShowImageEditor(true); 
      };
      r.readAsDataURL(file);
    }
  };

  const handleEditorSave = (editedImage: string) => {
    if (editingField === 'identity') {
      setAccountData(p => ({ ...p, identity_url: editedImage }));
    } else {
      setAccountData(p => ({ ...p, npwp_url: editedImage }));
    }
    setShowImageEditor(false);
  };

  if (isLoading) return <div className={styles.loadingState}><div className={styles.loadingSpinner}></div></div>;

  return (
    <div className={styles.container}>
      <input type="file" ref={ktpInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileChange(e, 'identity')} />
      <input type="file" ref={npwpInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileChange(e, 'npwp')} />

      {saveStatus !== 'idle' && (
        <div className={`${styles.toast} ${saveStatus === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {saveStatus === 'success' ? (
            <FiCheckCircle className={styles.toastIcon} style={{ color: '#f97316' }} size={24} />
          ) : (
            <FiX className={styles.toastIcon} style={{ color: '#ef4444' }} size={24} />
          )}
          <span className={styles.toastMessage}>{saveMessage}</span>
        </div>
      )}

      {showVerifyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader}><h2>{modalStep === 'method' ? 'Verifikasi Buka Akses Ubah Data' : 'Verifikasi OTP'}</h2><button className={styles.closeModal} onClick={() => setShowVerifyModal(false)}><FiX size={24} /></button></div>
            <div className={styles.modalBody} style={{ padding: '2rem' }}>
              {modalStep === 'method' ? (
                <><p style={{ color: '#64748b', marginBottom: '2rem', textAlign: 'center' }}>Pilih salah satu metode di bawah ini untuk mendapatkan kode verifikasi</p>
                <button className={styles.verifyOptionBtn} onClick={() => setModalStep('otp')}><FaWhatsapp className={styles.verifyIcon} style={{ color: '#25D366' }} /><span>Verifikasi WhatsApp</span></button>
                <button className={styles.verifyOptionBtn} onClick={() => setModalStep('otp')}><FiMail className={styles.verifyIcon} style={{ color: '#f97316' }} /><span>Email ke {maskEmail(accountData.email)}</span></button></>
              ) : (
                <><p style={{ color: '#64748b', marginBottom: '2rem', textAlign: 'center' }}>Masukkan 6 digit kode verifikasi yang telah dikirimkan.</p>
                <div className={styles.otpGroup}>{otp.map((digit, i) => (<input key={i} ref={el => { otpRefs.current[i] = el; }} type="text" value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => { if (e.key === 'Backspace' && otp[i] === '' && i > 0) otpRefs.current[i - 1]?.focus(); }} className={styles.otpInput} maxLength={1} />))}</div>
                <div className={styles.modalFooter}><button className={styles.backBtn} onClick={() => setModalStep('method')}>Kembali</button><button className={`${styles.verifyConfirmBtn} ${otp.every(d => d !== '') ? styles.verifyConfirmBtnActive : ''}`} disabled={!otp.every(d => d !== '')} onClick={handleVerifyOTP}>Verifikasi</button></div></>
              )}
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

      <div className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.pageTitle}>Informasi Akun <FiStar className={styles.loveIcon} /></h1></div>
        {!isEditable && <button className={styles.unlockButton} onClick={handleOpenAccess}>Buka Akses Ubah Data</button>}
      </div>

      <div className={styles.formContainer}>
        {/* SECTION 1: INFORMASI AKUN PROFIL */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Informasi Akun Profil</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Email<span className={styles.required}>*</span>{!isEditable && <FiCheckCircle style={{ color: '#f97316' }} />}</label>
                <input 
                  type="text" 
                  value={isEditable ? accountData.email : maskEmail(accountData.email)} 
                  onChange={e => setAccountData(p => ({ ...p, email: e.target.value }))}
                  disabled={!isEditable} 
                  className={styles.input} 
                />
              </div>
              <div className={styles.fieldGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Telepon ke-1<span className={styles.required}>*</span>{!isEditable && <FiCheckCircle style={{ color: '#f97316' }} />}</label>
                <input type="text" value={isEditable ? accountData.phone : maskPhone(accountData.phone)} onChange={e => setAccountData(p => ({ ...p, phone: e.target.value }))} disabled={!isEditable} className={styles.input} />
              </div>
            </div>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label>Telepon ke-2</label>
                <input type="text" value={isEditable ? accountData.phone2 : maskPhone(accountData.phone2)} onChange={e => setAccountData(p => ({ ...p, phone2: e.target.value }))} disabled={!isEditable} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Telepon ke-3</label>
                <input type="text" value={isEditable ? accountData.phone3 : maskPhone(accountData.phone3)} onChange={e => setAccountData(p => ({ ...p, phone3: e.target.value }))} disabled={!isEditable} className={styles.input} />
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider}></div>

        {/* SECTION 2: INFORMASI IDENTITAS (KTP KIRI, NPWP KANAN) */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Informasi Identitas</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={styles.grid2}>
              {/* KTP */}
              <div className={styles.fieldGroup}>
                <label>Nomor KTP<span className={styles.required}>*</span></label>
                <input type="text" value={accountData.identity_number} onChange={e => setAccountData(p => ({ ...p, identity_number: e.target.value }))} disabled={!isEditable} className={styles.input} placeholder="Masukkan No. KTP" />
                <label style={{ marginTop: '1rem' }}>Unggah KTP<span className={styles.required}>*</span></label>
                <div className={styles.logoPreview} style={{ cursor: isEditable && !accountData.identity_url ? 'pointer' : 'default' }} onClick={() => isEditable && !accountData.identity_url && ktpInputRef.current?.click()}>
                  {accountData.identity_url ? (
                    <><img src={accountData.identity_url} style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />{isEditable && <button className={styles.removeLogo} onClick={e => { e.stopPropagation(); setAccountData(p => ({ ...p, identity_url: '' })); }}><FiX /></button>}</>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <FiUpload size={32} color="#94a3b8" />
                      <span>pilih atau letakkan berkas disini</span>
                    </div>
                  )}
                </div>
                {isEditable && accountData.identity_url && <div className={styles.changeLogoText} onClick={() => ktpInputRef.current?.click()}>Ubah Gambar</div>}
              </div>
              {/* NPWP */}
              <div className={styles.fieldGroup}>
                <label>Nomor NPWP</label>
                <input type="text" value={accountData.npwp_number} onChange={e => setAccountData(p => ({ ...p, npwp_number: e.target.value }))} disabled={!isEditable} className={styles.input} placeholder="Masukkan No. NPWP" />
                <label style={{ marginTop: '1rem' }}>Unggah NPWP</label>
                <div className={styles.logoPreview} style={{ cursor: isEditable && !accountData.npwp_url ? 'pointer' : 'default' }} onClick={() => isEditable && !accountData.npwp_url && npwpInputRef.current?.click()}>
                  {accountData.npwp_url ? (
                    <><img src={accountData.npwp_url} style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />{isEditable && <button className={styles.removeLogo} onClick={e => { e.stopPropagation(); setAccountData(p => ({ ...p, npwp_url: '' })); }}><FiX /></button>}</>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <FiUpload size={32} color="#94a3b8" />
                      <span>pilih atau letakkan berkas disini</span>
                    </div>
                  )}
                </div>
                {isEditable && accountData.npwp_url && <div className={styles.changeLogoText} onClick={() => npwpInputRef.current?.click()}>Ubah Gambar</div>}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider}></div>

        {/* SECTION 3: INFORMASI HAK AKSES */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Informasi Hak Akses</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label>Hak Akses</label>
                <input type="text" value={accountData.role} disabled className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label>PIN</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showPin ? "text" : "password"} 
                    value={accountData.pin} 
                    onChange={e => setAccountData(p => ({ ...p, pin: e.target.value }))} 
                    disabled={!isEditable} 
                    className={styles.input} 
                    style={{ width: '100%', paddingRight: '2.5rem' }} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FiEye size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider}></div>

        {/* SECTION 4: INFORMASI ALAMAT */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Informasi Alamat</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label>Alamat<span className={styles.required}>*</span></label>
              <input type="text" value={accountData.address} onChange={e => setAccountData(p => ({ ...p, address: e.target.value }))} disabled={!isEditable} className={styles.input} placeholder="Contoh: Jalan Mangga No.12" />
            </div>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label>Negara<span className={styles.required}>*</span></label>
                <input type="text" value={accountData.country} disabled className={styles.input} />
              </div>
              <RegionSelect label="Provinsi" value={toTitleCase(accountData.province)} options={provinces.map(toTitleCase)} onChange={handleProvinceChange} disabled={!isEditable} required />
            </div>
            <div className={styles.grid2}>
              <RegionSelect label="Kota" value={toTitleCase(accountData.city)} options={cities.map(toTitleCase)} onChange={handleCityChange} disabled={!isEditable || accountData.province === 'Pilih'} required />
              <RegionSelect label="Kecamatan" value={toTitleCase(accountData.district)} options={districts.map(toTitleCase)} onChange={district => setAccountData(p => ({ ...p, district }))} disabled={!isEditable || accountData.city === 'Pilih'} required />
            </div>
          </div>
        </section>

        <div className={styles.divider}></div>

        {/* SECTION 5: UBAH KATA SANDI */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Ubah Kata Sandi</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label>Kata Sandi Lama</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showOldPassword ? "text" : "password"} 
                    value={passwords.old_password} 
                    onChange={e => setPasswords(p => ({ ...p, old_password: e.target.value }))} 
                    disabled={!isEditable} 
                    className={styles.input} 
                    placeholder="Kata Sandi Lama"
                    style={{ width: '100%', paddingRight: '2.5rem' }} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FiEye size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label>Kata Sandi Baru</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={passwords.new_password} 
                    onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))} 
                    disabled={!isEditable} 
                    className={styles.input} 
                    placeholder="Contoh: Sandi123!"
                    style={{ width: '100%', paddingRight: '2.5rem' }} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FiEye size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label>Konfirmasi Kata Sandi Baru</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={passwords.confirm_password} 
                    onChange={e => setPasswords(p => ({ ...p, confirm_password: e.target.value }))} 
                    disabled={!isEditable} 
                    className={styles.input} 
                    placeholder="Konfirmasi Kata Sandi Baru"
                    style={{ width: '100%', paddingRight: '2.5rem' }} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FiEye size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider}></div>

        {/* SECTION 6: DANGER ZONE */}
        <section className={styles.dangerZoneSection}>
          <div className={styles.dangerZoneRow}>
            <div className={styles.dangerZoneInfo}>
              <h3>Pengajuan Hapus Akun</h3>
              <p>Proses hapus akun akan memutus semua integrasi pada platform majoo</p>
            </div>
            <button type="button" className={styles.btnDangerSolid}>Hapus Akun</button>
          </div>
          <div className={styles.dividerFull}></div>
          <div className={styles.dangerZoneRow}>
            <div className={styles.dangerZoneInfo}>
              <h3>Pengajuan Hapus Transaksi</h3>
              <p>Proses hapus transaksi akan menghapus semua data transaksi pada outlet terpilih</p>
            </div>
            <button type="button" className={styles.btnDangerOutline}>Hapus Transaksi</button>
          </div>
        </section>

      </div>

      <div className={styles.footer}>
        {isEditable ? (
          <>
            <button className={styles.cancelButton} onClick={() => { setIsEditable(false); loadAccountInfo(); }}>Batal</button>
            <button className={styles.saveButton} disabled={isSaving} onClick={handleSave}>{isSaving ? '...' : 'Simpan'}</button>
          </>
        ) : (
          <button className={styles.saveButton} disabled>Simpan</button>
        )}
      </div>
    </div>
  );
}
