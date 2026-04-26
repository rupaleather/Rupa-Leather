'use client';
import { useState } from 'react';
import { SITE_CONFIG } from '@/lib/constants';
import { whatsappUrl } from '@/lib/formatters';
import { validateEmail, validateRequired, sanitizeInput } from '@/lib/validators';
import styles from '@/styles/components/Products.module.css';

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--color-text-primary)', fontSize: '0.875rem' };

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateRequired(form.name, 'Nama');
    const emailErr = validateEmail(form.email);
    if (!nameErr.valid || !emailErr.valid) return;

    const msg = `📩 *PESAN DARI WEBSITE*\n\n*Nama:* ${form.name}\n*Email:* ${form.email}\n*Subjek:* ${form.subject}\n*Pesan:*\n${form.message}`;
    window.open(whatsappUrl(SITE_CONFIG.whatsapp, msg), '_blank');
    setSent(true);
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Hubungi Kami</h1>
          <p className={styles.pageDesc}>Kami siap melayani pertanyaan, pesanan khusus, dan corporate gift</p>
        </div>
      </header>

      <div className="container section" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Informasi Kontak</h3>
              {[
                { icon: '📞', label: 'Telepon', value: SITE_CONFIG.phone },
                { icon: '✉️', label: 'Email', value: SITE_CONFIG.email },
                { icon: '📍', label: 'Alamat', value: SITE_CONFIG.address },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
                    <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Marketplace Kami</h3>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {Object.entries(SITE_CONFIG.marketplace).map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </a>
                ))}
              </div>
            </div>

            <a href={whatsappUrl(SITE_CONFIG.whatsapp, 'Halo Rupa Leather!')} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              💬 Chat WhatsApp Langsung
            </a>
          </div>

          <div style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-4)' }}>✅</span>
                <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Pesan Terkirim!</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Tim kami akan segera merespons</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>Kirim Pesan</h3>
                <input name="name" placeholder="Nama Anda" value={form.name} onChange={e => setForm(p => ({ ...p, name: sanitizeInput(e.target.value) }))} style={inputStyle} required id="contact-name" />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: sanitizeInput(e.target.value) }))} style={inputStyle} required id="contact-email" />
                <input name="subject" placeholder="Subjek" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: sanitizeInput(e.target.value) }))} style={inputStyle} id="contact-subject" />
                <textarea name="message" placeholder="Pesan Anda..." value={form.message} onChange={e => setForm(p => ({ ...p, message: sanitizeInput(e.target.value) }))} rows={5} style={{ ...inputStyle, resize: 'vertical' }} required id="contact-message" />
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="contact-submit-btn">Kirim Pesan</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
