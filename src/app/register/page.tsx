"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FiCheck,
  FiX,
  FiMail,
  FiEye,
  FiEyeOff,
  FiLoader
} from 'react-icons/fi';
import styles from '@/styles/dashboard/Register.module.css';
import { supabaseBrowser } from '@/lib/supabase';

const dict = {
  id: {
    bannerSub: "aplikasi wirausaha",
    bannerTitle: "Langganan Lebih Hemat\ndengan Autodebit",
    term: "*) Syarat dan Ketentuan Berlaku",
    daftarAkun: "Daftar Akun",
    emailLabel: "Email",
    emailPlaceholder: "Contoh: skala@gmail.com",
    verifikasiBtn: "Verifikasi",
    waLabel: "Nomor WhatsApp",
    waPlaceholder: "Contoh: 08123456789",
    punyaRef: "Punya kode referral?",
    gunakan: "Gunakan",
    denganDaftar: "Dengan mendaftar, saya menyatakan telah membaca dan menyetujui",
    ketentuanLayanan: "Ketentuan Layanan",
    dan: "&",
    kebijakanSkala: "Kebijakan Skala",
    daftarBtn: "Daftar",
    daftarLoading: "Mendaftarkan...",
    sudahAkun: "Sudah punya akun?",
    masukBtn: "Masuk",
    pilihBahasa: "Pilih bahasa",
    emailInvalid: "Format email tidak sesuai",
    passLabel: "Kata Sandi",
    passPlaceholder: "Contoh: Rahasia123!",
    confirmPassLabel: "Konfirmasi Kata Sandi",
    confirmPassPlaceholder: "Contoh: Rahasia123!",
    passMismatch: "Konfirmasi kata sandi tidak sama",
    privacyPolicy: "Kebijakan Privasi",
    termsCondition: "Syarat dan Ketentuan",
    minCharReq: "Minimal 8 karakter",
    upperLowerReq: "Huruf besar & kecil",
    numberSymbolReq: "Angka & simbol"
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [wa, setWa] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailValid = validateEmail(email);
  const isWaValid = wa.length >= 8;

  const passwordRequirements = {
    minChar: password.length >= 8,
    upperLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
    numberSymbol: /\d/.test(password) && /[^A-Za-z0-9]/.test(password)
  };
  const strengthScore = Object.values(passwordRequirements).filter(Boolean).length;

  const isFormReadyToSubmit = isEmailVerified && isEmailValid && isWaValid && termsAgreed && password.length >= 8 && password === confirmPassword && strengthScore === 3;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpModalOpen && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, timer]);

  const t = dict.id;

  const [modalKey, setModalKey] = useState(0);

  const handleVerifyEmail = async () => {
    if (!isEmailValid) return;
    setIsSendingOtp(true);
    setOtpError(null);

    // Bypass OTP for testing/QA mode
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSendingOtp(false);
    setOtp(["", "", "", "", "", ""]);
    setIsOtpModalOpen(true);
    setTimer(60);
    setModalKey(prev => prev + 1);
  };

  const handleOtpChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);
    setOtpError(null);

    if (numericValue && index < 5) {
      document.getElementById(`reg-otp-${index + 1}`)?.focus();
    }
  };

  const handleConfirmOtp = async () => {
    const token = otp.join("");
    if (token.length !== 6) return;
    setIsVerifyingOtp(true);
    setOtpError(null);

    // Bypass OTP for testing/QA mode
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsEmailVerified(true);
    setIsOtpModalOpen(false);
    setIsVerifyingOtp(false);
  };

  const handleRegister = async () => {
    if (!isFormReadyToSubmit || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      // Import di atas jika belum: import { supabaseBrowser } from '@/lib/supabase';
      // Cek sesi aktif dari verifikasi OTP
      const { data: { user: existingUser } } = await supabaseBrowser.auth.getUser();

      let authError = null;
      let authUser = null;

      if (existingUser && existingUser.email === email) {
        // SKENARIO A: Sesi OTP aktif
        const { data, error } = await supabaseBrowser.auth.updateUser({
          password,
          data: {
            phone1: wa,
            role: 'user',
            is_active: true
          },
        });

        authError = error;
        authUser = data.user;
      } else {
        // SKENARIO B: Pendaftaran Standar
        const { data, error } = await supabaseBrowser.auth.signUp({
          email,
          password,
          options: {
            data: {
              phone1: wa,
              role: 'user',
              is_active: true
            },
          },
        });

        authError = error;
        authUser = data.user;
      }

      if (authError) {
        const friendlyError =
          authError.message === 'User already registered'
            ? 'Email sudah terdaftar. Gunakan email lain atau masuk.'
            : authError.message;
        setError(friendlyError);
        setIsLoading(false);
        return;
      }

      // Sinkronisasi Profil (fetchProfile / create profile)
      if (authUser) {
        // Memastikan ada data di tabel profiles
        await fetch('/api/auth/register', { // Memanggil API hanya untuk insert ke tabel profiles dengan aman (Service Role)
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, whatsapp: wa }),
        });
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Terjadi kesalahan jaringan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <style dangerouslySetInnerHTML={{
        __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px white inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}} />

      {/* ================= BAGIAN KIRI: BANNER ================= */}
      <div className={styles.leftSide}>
        <Image
          src="/images/halaman/dashboard.png"
          alt="Auth Banner"
          fill
          className={styles.bannerImage}
          priority
        />
        <div className={styles.bannerGradient}></div>
      </div>

      {/* ================= KANAN: FORM AREA ================= */}
      <div className={styles.rightSide}>
        <div className={`${styles.formArea} ${isEmailVerified ? styles.formAreaExpanded : ''}`}>
          <div className={styles.card}>
            <div className={styles.logoContainer}>
              <img
                src="/images/logo/skala-orange.png"
                alt="Skala"
                className={styles.logo}
              />
            </div>

            <h1 className={styles.title}>
              {t.daftarAkun}
            </h1>

            {error && (
              <div className={styles.errorBanner}>
                <p className={styles.errorText}>{error}</p>
              </div>
            )}

            <div>
              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>{t.emailLabel}</label>
                <div className={styles.inputRow}>
                  <div className={styles.inputWrapper}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isEmailVerified || isLoading}
                      placeholder={t.emailPlaceholder}
                      className={`${styles.input} ${isEmailVerified ? styles.verified : ''} ${!isEmailValid && email ? styles.error : ''}`}
                    />
                    {isEmailVerified && (
                      <div className={styles.iconRight}>
                        <div className={styles.iconCheck}>
                          <FiCheck size={14} strokeWidth={4} />
                        </div>
                      </div>
                    )}
                  </div>
                  {!isEmailVerified && (
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={!isEmailValid || isSendingOtp || isLoading}
                      className={`${styles.verifyBtn} ${isEmailValid && !isSendingOtp ? styles.active : styles.disabled}`}
                    >
                      {isSendingOtp && <FiLoader className={styles.spinner} />}
                      {t.verifikasiBtn}
                    </button>
                  )}
                </div>
                {email && !isEmailValid && (
                  <p className={styles.helperError}>{t.emailInvalid}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div className={styles.formGroup}>
                <label className={styles.label}>{t.waLabel}</label>
                <div className={`${styles.waWrapper} ${wa && !isWaValid ? styles.error : ''}`}>
                  <div className={styles.waPrefix}>
                    <span className={styles.waFlag}>🇮🇩</span>
                    <span className={styles.waCode}>+62</span>
                  </div>
                  <input
                    type="tel"
                    value={wa}
                    onChange={(e) => setWa(e.target.value.replace(/\D/g, ''))}
                    placeholder="8131800855"
                    disabled={isLoading}
                    className={styles.waInput}
                  />
                  {isWaValid && (
                    <div className={styles.iconRight}>
                      <div className={styles.iconCheck}>
                        <FiCheck size={14} strokeWidth={4} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Password fields appear after email verification */}
              {isEmailVerified && (
                <>
                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                    <label className={styles.label}>{t.passLabel}</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.passPlaceholder}
                        disabled={isLoading}
                        className={styles.input}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.iconRight}
                      >
                        {showPassword ? <FiEye /> : <FiEyeOff />}
                      </button>
                    </div>

                    {/* Password Strength & Checklist */}
                    <div>
                      <div className={styles.strengthBarContainer}>
                        <div className={`${styles.strengthBar} ${strengthScore >= 1 ? styles.red : ''}`}></div>
                        <div className={`${styles.strengthBar} ${strengthScore >= 2 ? styles.yellow : ''}`}></div>
                        <div className={`${styles.strengthBar} ${strengthScore >= 3 ? styles.green : ''}`}></div>
                      </div>
                      <div className={styles.requirementsGrid}>
                        <div className={styles.reqItem}>
                          <div className={`${styles.reqIcon} ${passwordRequirements.minChar ? styles.active : ''}`}>
                            <FiCheck size={10} strokeWidth={4} />
                          </div>
                          <span className={`${styles.reqText} ${passwordRequirements.minChar ? styles.active : ''}`}>{t.minCharReq}</span>
                        </div>
                        <div className={styles.reqItem}>
                          <div className={`${styles.reqIcon} ${passwordRequirements.upperLower ? styles.active : ''}`}>
                            <FiCheck size={10} strokeWidth={4} />
                          </div>
                          <span className={`${styles.reqText} ${passwordRequirements.upperLower ? styles.active : ''}`}>{t.upperLowerReq}</span>
                        </div>
                        <div className={styles.reqItem}>
                          <div className={`${styles.reqIcon} ${passwordRequirements.numberSymbol ? styles.active : ''}`}>
                            <FiCheck size={10} strokeWidth={4} />
                          </div>
                          <span className={`${styles.reqText} ${passwordRequirements.numberSymbol ? styles.active : ''}`}>{t.numberSymbolReq}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.confirmPassLabel}</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.confirmPassPlaceholder}
                        disabled={isLoading}
                        className={`${styles.input} ${confirmPassword && password !== confirmPassword ? styles.error : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={styles.iconRight}
                      >
                        {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className={styles.helperError}>{t.passMismatch}</p>
                    )}
                  </div>
                </>
              )}

              {/* Referral */}
              <p className={styles.referral}>
                {t.punyaRef}{" "}
                <button type="button" className={styles.referralBtn}>
                  {t.gunakan}
                </button>
              </p>

              {/* Syarat & Ketentuan */}
              <div className={styles.termsContainer}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <div className={`${styles.checkboxCustom} ${termsAgreed ? styles.checked : ''}`}>
                    {termsAgreed && <FiCheck size={10} strokeWidth={4} />}
                  </div>
                </div>
                <label htmlFor="terms" className={styles.termsLabel}>
                  {t.denganDaftar}{" "}
                  <a href="#" className={styles.termsLink}>{t.ketentuanLayanan}</a>
                  {" "}{t.dan}{" "}
                  <a href="#" className={styles.termsLink}>{t.kebijakanSkala}</a>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              disabled={!isFormReadyToSubmit || isLoading}
              className={`${styles.submitBtnBig} ${isFormReadyToSubmit && !isLoading ? styles.active : styles.disabled}`}
            >
              {isLoading && <FiLoader className={styles.spinner} />}
              {isLoading ? t.daftarLoading : t.daftarBtn}
            </button>

            <p className={styles.loginPrompt}>
              {t.sudahAkun}{" "}
              <Link href="/login" className={styles.loginLink}>
                {t.masukBtn}
              </Link>
            </p>
          </div>
        </div>

        {/* ================= FOOTER LUAR KOTAK ================= */}
        <div className={styles.footer}>
          <div className={styles.langSelector}>
            <span className={styles.langLabel}>{t.pilihBahasa}</span>
            <div className={styles.langValue}>
              <span style={{ fontSize: '1rem' }}>🇮🇩</span>
              <span>IDN</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <Link href="#" className={styles.footerLink}>{t.privacyPolicy}</Link>
            <span style={{ opacity: 0.5, fontWeight: 'normal' }}>-</span>
            <Link href="#" className={styles.footerLink}>{t.termsCondition}</Link>
          </div>

          <p style={{ fontWeight: 500 }}>
            © 2026. PT Casir Teknologi Indonesia
          </p>
        </div>
      </div>

      {/* ================= OTP MODAL ================= */}
      {isOtpModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOtpModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className={styles.modalCloseBtn}
            >
              <FiX size={20} />
            </button>
            <div className={styles.modalIconBox}>
              <FiMail size={28} />
            </div>
            <h3 className={styles.modalTitle}>Verifikasi Email</h3>
            <p className={styles.modalDesc}>
              Masukkan 6 digit kode OTP yang dikirimkan ke:
            </p>
            <p className={styles.modalEmail}>{email}</p>

            <input type="text" style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }} tabIndex={-1} aria-hidden="true" />

            <div className={styles.otpGrid}>
              {otp.map((digit, index) => (
                <input
                  key={`otp-${index}-${modalKey}`}
                  id={`reg-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="-"
                  readOnly
                  onFocus={(e) => e.target.readOnly = false}
                  maxLength={1}
                  value={digit}
                  autoComplete="one-time-code"
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className={`${styles.otpInput} ${otpError ? styles.error : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && index > 0)
                      document.getElementById(`reg-otp-${index - 1}`)?.focus();
                  }}
                />
              ))}
            </div>
            {otpError && (
              <p className={styles.helperError} style={{ marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>{otpError}</p>
            )}
            <button
              onClick={handleConfirmOtp}
              disabled={otp.join("").length < 6 || isVerifyingOtp}
              className={`${styles.otpConfirmBtn} ${otp.join("").length === 6 && !isVerifyingOtp ? styles.active : styles.disabled}`}
            >
              {isVerifyingOtp && <FiLoader className={styles.spinner} />}
              Konfirmasi
            </button>
            <div className={styles.resendText}>
              <p>Belum menerima kode?</p>
              {timer > 0 ? (
                <p className={styles.resendTimer}>
                  Kirim Ulang (00:{timer < 10 ? `0${timer}` : timer})
                </p>
              ) : (
                <button className={styles.resendBtn} onClick={() => { setTimer(60); handleVerifyEmail(); }}>
                  Kirim Ulang
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
