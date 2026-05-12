'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './business-info.module.css';
import { 
  FiHeart, 
  FiCheckCircle, 
  FiChevronDown, 
  FiUpload, 
  FiLoader,
  FiX,
  FiMail,
  FiEye,
  FiEyeOff,
  FiInfo,
  FiTrash2,
  FiRotateCcw,
  FiRotateCw,
  FiMaximize,
  FiRepeat
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import RegionSelect from '@/components/RegionSelect/RegionSelect';
import ImageEditor from '@/components/ImageEditor/ImageEditor';
import LocationPicker from '@/components/LocationPicker/LocationPicker';

export default function BusinessInfoPage() {
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [businessData, setBusinessData] = useState({
    id: '',
    business_name: '',
    business_type: 'Cafe',
    business_form: 'Pribadi',
    business_email: '',
    business_phone: '',
    business_phone2: '',
    business_phone3: '',
    business_address: '',
    business_description: '',
    business_website: '',
    province: 'Pilih',
    city: 'Pilih',
    business_district: 'Pilih',
    business_country: 'Indonesia',
    logo_url: '',
  });

  const [socialMedia, setSocialMedia] = useState<{ platform: string, account: string }[]>([
    { platform: 'Facebook', account: '' }
  ]);

  // Modal Verification States
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [modalStep, setModalStep] = useState<'method' | 'otp'>('method');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Editor Image States
  const [showEditor, setShowEditor] = useState(false);
  const [editorImage, setEditorImage] = useState<string | null>(null);

  // Preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Map state
  const [showMap, setShowMap] = useState(false);

  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);

  const loadBusinessInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/dashboard/profile?type=business');
      if (!res.ok) throw new Error('Gagal memuat informasi bisnis');
      const { data: d } = await res.json();
      
      if (d) {
        setBusinessData({
          id: d.id || '',
          business_name: d.business_name || '',
          business_type: d.business_type || 'Cafe',
          business_form: d.business_form || 'Pribadi',
          business_email: d.business_email || '',
          business_phone: d.business_phone1 || '',
          business_phone2: d.business_phone2 || '',
          business_phone3: d.business_phone3 || '',
          business_address: d.business_address || '',
          business_description: d.business_description || '',
          business_website: d.business_website || '',
          province: d.business_province || 'Pilih',
          city: d.business_city || 'Pilih',
          business_district: d.business_district || 'Pilih',
          business_country: d.business_country || 'Indonesia',
          logo_url: d.business_logo_url || '',
        });

        if (d.business_social_media && Array.isArray(d.business_social_media)) {
          setSocialMedia(d.business_social_media.length > 0 ? d.business_social_media : [{ platform: 'Facebook', account: '' }]);
        }

        if (d.business_province && d.business_province !== 'Pilih') {
          const r1 = await fetch(`/api/regions?level=kota&provinsi=${encodeURIComponent(d.business_province.toUpperCase())}`);
          const j1 = await r1.json();
          if (j1.data) setCities(j1.data);
          
          if (d.business_city && d.business_city !== 'Pilih') {
            const r2 = await fetch(`/api/regions?level=kecamatan&provinsi=${encodeURIComponent(d.business_province.toUpperCase())}&kota=${encodeURIComponent(d.business_city.toUpperCase())}`);
            const j2 = await r2.json();
            if (j2.data) setDistricts(j2.data);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadBusinessInfo(); }, [loadBusinessInfo]);

  useEffect(() => {
    fetch('/api/regions?level=provinsi')
      .then(res => res.json())
      .then(res => { if (res.data) setProvinces(res.data); })
      .catch(err => console.error('Error fetching provinces:', err));

    // Fetch Business Types from Supabase
    fetch('/api/dashboard/business-types')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBusinessTypes(data.map(item => item.name));
        }
      })
      .catch(err => console.error('Error fetching business types:', err));
  }, []);

  const handleProvinceChange = (province: string) => {
    setBusinessData(prev => ({ ...prev, province, city: 'Pilih', business_district: 'Pilih' }));
    setCities([]); setDistricts([]);
    if (province !== 'Pilih') {
      fetch(`/api/regions?level=kota&provinsi=${encodeURIComponent(province.toUpperCase())}`)
        .then(res => res.json())
        .then(res => { if (res.data) setCities(res.data); });
    }
  };

  const handleCityChange = (city: string) => {
    setBusinessData(prev => ({ ...prev, city, business_district: 'Pilih' }));
    setDistricts([]);
    if (city !== 'Pilih') {
      fetch(`/api/regions?level=kecamatan&provinsi=${encodeURIComponent(businessData.province.toUpperCase())}&kota=${encodeURIComponent(city.toUpperCase())}`)
        .then(res => res.json())
        .then(res => { if (res.data) setDistricts(res.data); });
    }
  };

  const handleDistrictChange = (district: string) => {
    setBusinessData(prev => ({ ...prev, business_district: district }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Safety Check: Prevent sending huge stale base64 strings (> 2MB)
      if (businessData.logo_url && businessData.logo_url.length > 2 * 1024 * 1024) {
        throw new Error('Ukuran data logo terlalu besar. Silakan unggah ulang logo Anda untuk optimasi otomatis.');
      }

      const payload = {
        ...businessData,
        id: businessData.id || null, // Ensure ID is valid or null
        business_province: businessData.province,
        business_city: businessData.city,
        business_district: businessData.business_district,
        business_phone1: businessData.business_phone,
        business_logo_url: businessData.logo_url,
        business_social_media: socialMedia.filter(s => s && s.account && s.account.trim() !== ''),
        type: 'business'
      };
      const res = await fetch('/api/dashboard/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menyimpan informasi bisnis');

      setSaveStatus('success');
      setSaveMessage('Informasi bisnis berhasil diperbarui!');
      setIsEditable(false);
      
      // Update ID in state if returned (to avoid creating new records on next save)
      if (result.data && result.data.id) {
        setBusinessData(prev => ({ ...prev, id: result.data.id }));
      }
    } catch (error: any) {
      console.error('Save error:', error);
      setSaveStatus('error');
      setSaveMessage(error.message || 'Gagal menyimpan informasi bisnis');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  const handleOpenAccess = () => {
    setOtp(['', '', '', '', '', '']);
    setShowVerifyModal(true);
    setModalStep('method');
  };

  const handleMethodSelect = () => {
    setModalStep('otp');
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

    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const toTitleCase = (str: any) => {
    if (!str || typeof str !== 'string' || str === 'Pilih') return str;
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    return name.substring(0, 3) + '***@' + domain;
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{4})\d+(\d{3})/, '$1*****$2');
  };

  const handleSocialChange = (index: number, field: 'platform' | 'account', value: string) => {
    const newSocial = [...socialMedia];
    newSocial[index][field] = value;
    setSocialMedia(newSocial);
  };

  const handleSocialKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && socialMedia.length < 4 && socialMedia[index].account && socialMedia[index].account.trim() !== '') {
      const allPlatforms = ['Facebook', 'Instagram', 'Twitter', 'TikTok'];
      const usedPlatforms = socialMedia.map(s => s.platform);
      const available = allPlatforms.filter(p => !usedPlatforms.includes(p));
      const nextPlatform = available.length > 0 ? available[0] : 'Facebook';
      setSocialMedia([...socialMedia, { platform: nextPlatform, account: '' }]);
    }
  };

  const removeSocial = (index: number) => {
    if (socialMedia.length > 1) {
      setSocialMedia(socialMedia.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditorImage(reader.result as string);
        setShowEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditorSave = (editedImage: string) => {
    setBusinessData(p => ({ ...p, logo_url: editedImage }));
    setShowEditor(false);
    setEditorImage(null);
  };

  const isOtpComplete = otp.every(d => d !== '');

  if (isLoading) return <div className={styles.loadingState}><div className={styles.loadingSpinner}></div><span>Memuat...</span></div>;

  return (
    <div className={styles.container}>
      <input type="file" ref={logoInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
      
      

      {showVerifyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontFamily: 'serif', fontSize: '1.5rem' }}>
                {modalStep === 'method' ? 'Verifikasi Buka Akses Ubah Data' : 'Verifikasi OTP'}
              </h2>
              <button className={styles.closeModal} onClick={() => setShowVerifyModal(false)}><FiX size={24} /></button>
            </div>
            
            <div className={styles.modalBody} style={{ padding: '2rem' }}>
              {modalStep === 'method' ? (
                <>
                  <p style={{ color: '#64748b', marginBottom: '2rem', textAlign: 'center' }}>Pilih salah satu metode di bawah ini untuk mendapatkan kode verifikasi</p>
                  
                  <button className={styles.verifyOptionBtn} onClick={handleMethodSelect}>
                    <FaWhatsapp className={styles.verifyIcon} style={{ color: '#25D366' }} />
                    <span>Verifikasi WhatsApp</span>
                  </button>

                  <button className={styles.verifyOptionBtn} onClick={handleMethodSelect}>
                    <FiMail className={styles.verifyIcon} style={{ color: '#f97316' }} />
                    <span>Email ke {maskEmail(businessData.business_email)}</span>
                  </button>
                </>
              ) : (
                <>
                  <p style={{ color: '#64748b', marginBottom: '2rem', textAlign: 'center' }}>Masukkan 6 digit kode verifikasi yang telah dikirimkan.</p>
                  
                  <div className={styles.otpGroup}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        className={styles.otpInput}
                        maxLength={1}
                      />
                    ))}
                  </div>

                  <div className={styles.modalFooter}>
                    <button className={styles.backBtn} onClick={() => setModalStep('method')}>Kembali</button>
                    <button 
                      className={`${styles.verifyConfirmBtn} ${isOtpComplete ? styles.verifyConfirmBtnActive : ''}`}
                      disabled={!isOtpComplete}
                      onClick={handleVerifyOTP}
                    >
                      Verifikasi
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ImageEditor 
        isOpen={showEditor} 
        onClose={() => { setShowEditor(false); setEditorImage(null); }} 
        image={editorImage} 
        onSave={handleEditorSave} 
      />

      {previewImage && (
        <div className={styles.modalOverlay} onClick={() => setPreviewImage(null)}>
          <div className={styles.previewModalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closePreviewBtn} onClick={() => setPreviewImage(null)}><FiX size={24} /></button>
            <img src={previewImage} alt="Preview Logo" className={styles.fullPreviewImg} />
          </div>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.headerLeft}><h1 className={styles.pageTitle}>Informasi Bisnis <FiHeart className={styles.loveIcon} /></h1></div>
        {!isEditable && <button className={styles.unlockButton} onClick={handleOpenAccess}>Buka Akses Ubah Data</button>}
      </div>

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

      <div className={styles.formContainer}>
        {/* SECTION 1: INFORMASI KONTAK BISNIS */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Informasi Kontak Bisnis</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label>Nama Bisnis<span className={styles.required}>*</span></label>
                <input type="text" value={businessData.business_name} onChange={(e) => setBusinessData(p => ({ ...p, business_name: e.target.value }))} disabled={!isEditable} className={styles.input} placeholder="Nama Bisnis" />
              </div>
              <div className={styles.fieldGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Email<span className={styles.required}>*</span>{!isEditable && <FiCheckCircle style={{ color: '#f97316' }} />}</label>
                <input type="text" value={isEditable ? businessData.business_email : maskEmail(businessData.business_email)} onChange={(e) => setBusinessData(p => ({ ...p, business_email: e.target.value }))} disabled={!isEditable} className={styles.input} placeholder="Email Bisnis" />
              </div>
            </div>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Telepon ke-1<span className={styles.required}>*</span>{!isEditable && <FiCheckCircle style={{ color: '#f97316' }} />}</label>
                <input type="text" value={isEditable ? businessData.business_phone : maskPhone(businessData.business_phone)} onChange={(e) => setBusinessData(p => ({ ...p, business_phone: e.target.value }))} disabled={!isEditable} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Telepon ke-2</label>
                <input type="text" value={isEditable ? businessData.business_phone2 : maskPhone(businessData.business_phone2)} onChange={(e) => setBusinessData(p => ({ ...p, business_phone2: e.target.value }))} disabled={!isEditable} className={styles.input} />
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider}></div>

        {/* SECTION 2: INFORMASI ALAMAT */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Informasi Alamat</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={styles.mapContainer}>
              <label>Lokasi di Map<span className={styles.required}>*</span></label>
              <div className={styles.mapPlaceholder}>
                <span>Tandai lokasi dalam peta</span>
                <button 
                  className={styles.mapEditBtn} 
                  disabled={!isEditable}
                  onClick={(e) => { e.preventDefault(); setShowMap(true); }}
                >
                  Ubah Lokasi
                </button>
              </div>
            </div>
            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label>Alamat<span className={styles.required}>*</span></label>
              <input type="text" value={businessData.business_address} onChange={(e) => setBusinessData(p => ({ ...p, business_address: e.target.value }))} disabled={!isEditable} className={styles.input} placeholder="Alamat Lengkap" />
            </div>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}><label>Negara<span className={styles.required}>*</span></label><input type="text" value={businessData.business_country} disabled className={styles.input} /></div>
              <div className={styles.fieldGroup}><RegionSelect label="Provinsi" value={toTitleCase(businessData.province)} options={provinces.map(toTitleCase)} onChange={handleProvinceChange} disabled={!isEditable} required /></div>
            </div>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}><RegionSelect label="Kota" value={toTitleCase(businessData.city)} options={cities.map(toTitleCase)} onChange={handleCityChange} disabled={!isEditable || businessData.province === 'Pilih'} required /></div>
              <div className={styles.fieldGroup}><RegionSelect label="Kecamatan" value={toTitleCase(businessData.business_district)} options={districts.map(toTitleCase)} onChange={handleDistrictChange} disabled={!isEditable || businessData.city === 'Pilih'} required /></div>
            </div>
          </div>
        </section>

        <div className={styles.divider}></div>

        {/* SECTION 3: INFORMASI PROFIL BISNIS */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Informasi Profil Bisnis</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={styles.logoUploadSection}>
              <label>Unggah Logo</label>
              <div className={styles.logoFlex}>
                <div className={styles.logoPreviewWrapper}>
                  <div 
                    className={styles.logoPreview} 
                    style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: isEditable && !businessData.logo_url ? 'pointer' : 'default' }}
                    onClick={() => isEditable && !businessData.logo_url && logoInputRef.current?.click()}
                  >
                    {businessData.logo_url ? (
                      <>
                        <img src={businessData.logo_url} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
                        <div className={styles.eyeOverlay} onClick={(e) => { e.stopPropagation(); setPreviewImage(businessData.logo_url); }}>
                          <FiEye size={32} />
                        </div>
                      </>
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <FiUpload size={32} color="#94a3b8" />
                        <span>pilih atau letakkan berkas disini</span>
                      </div>
                    )}
                  </div>
                  {isEditable && businessData.logo_url && (
                    <div className={styles.changeLogoText} onClick={() => logoInputRef.current?.click()}>Ubah Gambar</div>
                  )}
                </div>
              </div>
            </div>

            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label>Deskripsi</label>
              <input type="text" value={businessData.business_description} onChange={(e) => setBusinessData(p => ({ ...p, business_description: e.target.value }))} disabled={!isEditable} className={styles.input} placeholder="Contoh: Deskripsi Usaha" />
            </div>

            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label>Website</label>
              <input type="text" value={businessData.business_website} onChange={(e) => setBusinessData(p => ({ ...p, business_website: e.target.value }))} disabled={!isEditable} className={styles.input} placeholder="Contoh: www.kie.com" />
            </div>

            <div className={styles.grid2}>
              <RegionSelect 
                label="Jenis Usaha" 
                value={businessData.business_type} 
                options={businessTypes} 
                onChange={(val) => setBusinessData(p => ({ ...p, business_type: val }))} 
                disabled={!isEditable} 
                required 
              />
              <div className={styles.fieldGroup}>
                <label>Bentuk Usaha<span className={styles.required}>*</span></label>
                <div className={styles.radioGroup}>
                  <div className={`${styles.radioBox} ${businessData.business_form === 'Pribadi' ? styles.radioBoxActive : ''} ${!isEditable ? styles.radioBoxDisabled : ''}`} onClick={() => isEditable && setBusinessData(p => ({ ...p, business_form: 'Pribadi' }))}>
                    <input type="radio" checked={businessData.business_form === 'Pribadi'} onChange={() => {}} />
                    <span>Pribadi</span>
                  </div>
                  <div className={`${styles.radioBox} ${businessData.business_form === 'Badan Hukum' ? styles.radioBoxActive : ''} ${!isEditable ? styles.radioBoxDisabled : ''}`} onClick={() => isEditable && setBusinessData(p => ({ ...p, business_form: 'Badan Hukum' }))}>
                    <input type="radio" checked={businessData.business_form === 'Badan Hukum'} onChange={() => {}} />
                    <span>Badan Hukum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider}></div>

        {/* SECTION 4: INFORMASI SOSIAL MEDIA */}
        <section className={styles.formSection}>
          <div className={styles.sectionTitleCol}><h2>Informasi Sosial Media</h2></div>
          <div className={styles.sectionFieldsCol}>
            <div className={styles.infoBox}>
              <FiInfo className={styles.infoIcon} size={18} />
              <span>Silakan isi Media Sosial terlebih dahulu lalu tekan Enter untuk menambah Media Sosial lainnya! (Max 4)</span>
            </div>

            {socialMedia.map((item, index) => {
              const allPlatforms = ['Facebook', 'Instagram', 'Twitter', 'TikTok'];
              const usedPlatforms = socialMedia.map((s: any) => s.platform);
              const availableOptions = allPlatforms.filter(p => p === item.platform || !usedPlatforms.includes(p));
              
              return (
              <div key={index} className={styles.socialRow}>
                <RegionSelect 
                  label="Nama Media Sosial" 
                  value={item.platform} 
                  options={availableOptions} 
                  onChange={(val) => handleSocialChange(index, 'platform', val)} 
                  disabled={!isEditable}
                  showSearch={false}
                />
                <div className={styles.fieldGroup}>
                  <label>Akun Media Sosial</label>
                  <input 
                    type="text" 
                    value={item.account} 
                    onChange={(e) => handleSocialChange(index, 'account', e.target.value)}
                    onKeyDown={(e) => handleSocialKeyDown(e, index)}
                    disabled={!isEditable} 
                    className={styles.input} 
                    placeholder="Contoh: facebook.com/namauser" 
                  />
                </div>
                {isEditable && index > 0 ? (
                  <button className={styles.removeSocialBtn} onClick={() => removeSocial(index)}>
                    <FiTrash2 size={18} />
                  </button>
                ) : (
                  <div style={{ width: '46px', height: '46px' }} />
                )}
              </div>
            )})}
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        {isEditable ? (
          <>
            <button className={styles.cancelButton} onClick={() => { setIsEditable(false); loadBusinessInfo(); }}>Batal</button>
            <button className={styles.saveButton} disabled={isSaving} onClick={handleSave}>{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
          </>
        ) : (
          <button className={styles.saveButton} disabled>Simpan</button>
        )}
      </div>
      <LocationPicker 
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        initialAddress={businessData.business_address}
        onSelectLocation={(address, lat, lng) => {
          setBusinessData(p => ({ ...p, business_address: address }));
        }}
      />
    </div>
  );
}
