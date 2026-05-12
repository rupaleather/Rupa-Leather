'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/dashboard/Login.module.css';
import { useRouter } from 'next/navigation';

export default function DashboardLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Auto-dismiss error toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Button becomes active if both fields have values
  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Email atau kata sandi salah');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Toast Error - Top Right */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          backgroundColor: '#fff',
          color: '#ef4444',
          padding: '0.875rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          fontSize: '0.875rem',
          fontWeight: 500,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderLeft: '4px solid #ef4444',
          animation: 'slideInRight 0.3s ease-out',
          maxWidth: '360px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {error}
        </div>
      )}

      {/* Left Side - Image Background */}
      <div className={styles.leftSide}>
        <Image
          src="/images/halaman/dashboard.png"
          alt="Dashboard Background"
          fill
          priority
          className={styles.leftSideImage}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className={styles.rightSide}>
        <div className={styles.card}>
          <div className={styles.logo}>
            <Image
              src="/images/logo/skala-orange.png"
              alt="Skala Logo"
              width={85}
              height={28}
              style={{ objectFit: 'contain' }}
            />
          </div>

          <h2 className={styles.title}>Masuk ke Backoffice</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  className={styles.input}
                  placeholder="Contoh: admin@rupa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">Kata Sandi</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  className={styles.input}
                  placeholder="Contoh: Rahasia123!"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Link href="#" className={styles.forgotPassword}>
              Lupa Kata Sandi?
            </Link>

            <button
              type="submit"
              className={`${styles.submitBtn} ${isFormValid ? styles.active : ''}`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className={styles.signupText}>
            Belum punya akun?
            <Link href="/register" className={styles.signupLink}>
              Daftar
            </Link>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.langSelector}>
            <span className={styles.langLabel}>Pilih bahasa</span>
            <div className={styles.langValue}>
              <span style={{ fontSize: '1rem' }}>🇮🇩</span>
              <span>IDN</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <Link href="#" className={styles.footerLink}>Kebijakan Privasi</Link>
            <span style={{ opacity: 0.5, fontWeight: 'normal' }}>-</span>
            <Link href="#" className={styles.footerLink}>Syarat dan Ketentuan</Link>
          </div>

          <p style={{ fontWeight: 500 }}>
            © 2026. PT Casir Teknologi Indonesia
          </p>
        </div>
      </div>
    </div>
  );
}
