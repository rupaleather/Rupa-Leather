'use client';
/* ============================================
   FOOTER COMPONENT — UI Only
   ============================================ */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { whatsappUrl } from '@/lib/formatters';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2';
import styles from '@/styles/components/Footer.module.css';

const FOOTER_NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Semua Produk', href: '/products' },
  { label: 'Testimoni', href: '/testimonials' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Kontak', href: '/contact' },
  { label: 'Blog', href: '/blog' },
];

const CATEGORIES = [
  { label: 'Tas Kulit Pria', href: '/categories/tas-kulit-pria' },
  { label: 'Tas Kulit Wanita', href: '/categories/tas-kulit-wanita' },
  { label: 'Dompet Pria', href: '/categories/dompet-kulit-pria' },
  { label: 'Dompet Wanita', href: '/categories/dompet-kulit-wanita' },
  { label: 'Aksesori', href: '/categories/aksesori-kulit' },
];

export default function Footer() {
  const pathname = usePathname();
  const [showBubble, setShowBubble] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  // Reset state on page change
  useEffect(() => {
    setShowBubble(false);
    setHasClosed(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600 && !showBubble && !hasClosed) {
        setShowBubble(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showBubble, hasClosed]);

  const handleClose = () => {
    setShowBubble(false);
    setHasClosed(true);
  };

  return (
    <>
      <footer className={styles.footer} id="main-footer" role="contentinfo">
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerCol} style={{ transform: 'none', paddingLeft: '320px' }}>
                <h4>INFORMASI</h4>
                <div className={styles.footerLinks}>
                  <Link href="/faq" className={styles.footerLink}>FAQ</Link>
                  <Link href="/blog" className={styles.footerLink}>Blog</Link>
                  <Link href="/karir" className={styles.footerLink}>Karir</Link>
                </div>
              </div>

              <div className={styles.brandCol} style={{ marginTop: '150px' }}>
                <Image
                  src="/images/logo/logo.png"
                  alt="Rupa Leather Logo"
                  width={90}
                  height={45}
                  style={{ objectFit: 'contain', marginBottom: '16px' }}
                />
                <h3>Rupa Leather</h3>
                <p>{SITE_CONFIG.description}</p>
              </div>
            </div>

            <div className={styles.footerCol}>
              <h4>Workshop</h4>
              <div className={styles.footerLinks} style={{ gap: 'var(--space-4)' }}>
                <div className={styles.contactItem}>
                  <HiOutlineMapPin className={styles.contactIcon} />
                  <span>Bhayangkara Residence No. B6, Jogotirto, Berbah, Sleman - Yogyakarta 55511</span>
                </div>
                <div className={styles.contactItem}>
                  <FaWhatsapp className={styles.contactIcon} />
                  <span>+62813 1800 855</span>
                </div>
                <div className={styles.contactItem}>
                  <HiOutlinePhone className={styles.contactIcon} />
                  <span>+62813 1800 855</span>
                </div>
                <div className={styles.contactItem}>
                  <HiOutlineEnvelope className={styles.contactIcon} />
                  <span>halo@rupaleather.com</span>
                </div>

                <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)', textAlign: 'center' }}>ikuti kami</h4>
                  <div className={styles.socials} style={{ justifyContent: 'center' }}>
                    <a href="#" className={styles.socialLink}><FaFacebookF /></a>
                    <a href="#" className={styles.socialLink}><FaTiktok /></a>
                    <a href="#" className={styles.socialLink}><FaInstagram /></a>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.footerCol}>
              <h4>Kategori Produk</h4>
              <div className={styles.productGrid}>
                <div className={styles.productCol}>
                  <Link href="/categories/tas" className={styles.footerLink}>Tas</Link>
                  <Link href="/categories/dompet" className={styles.footerLink}>Dompet</Link>
                  <Link href="/categories/handbag" className={styles.footerLink}>Handbag</Link>
                  <Link href="/categories/pouch-bag" className={styles.footerLink}>Pouch Bag</Link>
                  <Link href="/categories/tote-bag" className={styles.footerLink}>Tote Bag</Link>
                  <Link href="/categories/waist-bag" className={styles.footerLink}>Waist Bag</Link>
                </div>
                <div className={styles.productCol}>
                  <Link href="/categories/clutch" className={styles.footerLink}>Clutch</Link>
                  <Link href="/categories/id-card" className={styles.footerLink}>ID Card</Link>
                  <Link href="/categories/ikat-pinggang" className={styles.footerLink}>Ikat Pinggang</Link>
                  <Link href="/categories/tas-selempang" className={styles.footerLink}>Tas Selempang</Link>
                  <Link href="/categories/backpack-leather" className={styles.footerLink}>Backpack Leather</Link>
                  <Link href="/categories/kerajinan-kulit" className={styles.footerLink}>Kerajinan Kulit</Link>
                </div>
              </div>
            </div>
            <div className={styles.footerCol}>
              <h4>Marketplace</h4>
              <div style={{ marginTop: '0' }}>
                <Image
                  src="/images/logo/tokopedia.png"
                  alt="Tokopedia"
                  width={130}
                  height={38}
                  style={{ objectFit: 'contain' }}
                />
                <Image
                  src="/images/logo/tiktok.png"
                  alt="TikTok"
                  width={130}
                  height={38}
                  style={{ objectFit: 'contain', marginTop: '-4px' }}
                />
                <Image
                  src="/images/logo/shopee.png"
                  alt="Shopee"
                  width={90}
                  height={26}
                  style={{ objectFit: 'contain', marginTop: '-4px', marginLeft: '12px' }}
                />
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <Link href="/products" className={styles.bottomLink}>Semua Produk</Link>
            <div className={styles.copyrightGroup}>
              <span className={styles.copyright}>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</span>
              <span className={styles.copyright}>Crafted with ❤️ in Indonesia</span>
            </div>
            <Link href="/#new-arrivals" className={styles.bottomLink}>Produk Terbaru</Link>
          </div>
        </div>
      </footer>

      <div className={styles.whatsappWrapper}>
        {showBubble && (
          <div className={styles.whatsappBubble}>
            <button
              className={styles.closeBubble}
              onClick={handleClose}
              aria-label="Close greeting"
            >
              ✕
            </button>
            Selamat datang di Rupa Leather<br />
            kami siap melayani orderan! 👋
            <span className={styles.bubbleTail}></span>
          </div>
        )}
        <a href={whatsappUrl(SITE_CONFIG.whatsapp, 'Halo Rupa Leather!')} target="_blank" rel="noopener noreferrer" className={styles.whatsappFloat} aria-label="Chat via WhatsApp" id="whatsapp-float">
          <FaWhatsapp />
        </a>
      </div>
    </>
  );
}
