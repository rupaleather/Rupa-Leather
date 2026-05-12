'use client';
/* ============================================
   NAVBAR COMPONENT — UI Only
   ============================================ */

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { FiShoppingBag } from 'react-icons/fi';
import styles from '@/styles/components/Navbar.module.css';

const NAV_ITEMS = [
  { label: 'Profil', href: '/about' },
  {
    label: 'Produk',
    href: '/products',
    dropdown: [
      { label: 'Tas', href: '/categories/tas' },
      { label: 'Clutch', href: '/categories/clutch-pouch' },
      { label: 'Dompet', href: '/categories/dompet' },
      { label: 'ID Card', href: '/categories/card-holder' },
      { label: 'Handbag', href: '/categories/clutch-pouch' },
      { label: 'Ikat Pinggang', href: '/categories/ikat-pinggang' },
      { label: 'Pouch Bag', href: '/categories/clutch-pouch' },
      { label: 'Tas Selempang', href: '/categories/tas-selempang' },
      { label: 'Tote Bag', href: '/categories/totebag-kulit' },
      { label: 'Backpack Leather', href: '/categories/backpack-kulit' },
      { label: 'Waist Bag', href: '/categories/waist-bag' },
      { label: 'Kerajinan Kulit', href: '/products' },
      { label: 'Semua Produk', href: '/products' },
      { label: 'Produk Terbaru', href: '/products' }
    ]
  },
  {
    label: 'Promo',
    href: '#',
    dropdown: [
      { label: 'Daftar Member', href: '/register' },
      { label: 'Diskon Member', href: '/promo/member' },
      { label: 'Diskon Spesial', href: '/promo/diskon' }
    ]
  },
  { label: 'Testimoni', href: '/testimonials' },
  { label: 'Our Store', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (pathname.startsWith('/dashboard') || pathname === '/login' || pathname === '/register') return null;

  return (
    <>
      <nav 
        className={`${styles.navbar} ${
          scrolled 
            ? "shadow-lg !py-2" 
            : "bg-transparent !py-4"
        } fixed top-0 w-full z-[9999] transition-all duration-500 ease-in-out`} 
        style={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        }}
        id="main-navbar" 
        role="navigation" 
        aria-label="Main navigation"
      >
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} aria-label="Rupa Leather Home">
            <Image
              src="/images/logo/logo.png"
              alt="Rupa Leather"
              width={180}
              height={45}
              className={styles.logoImg}
              priority
            />
            <span className={styles.logoText}>Rupa Leather</span>
          </Link>

          <div className={styles.navMenuWrapper}>
            <ul className={styles.navLinks}>
              {NAV_ITEMS.map(item => (
                <li key={item.label} className={item.dropdown ? styles.hasDropdown : ''}>
                  {item.dropdown ? (
                    <>
                      <span className={styles.navLink} style={{ cursor: 'pointer' }}>
                        {item.label} <span className={styles.chevron}></span>
                      </span>
                      <div className={`${styles.dropdown} ${item.label === 'Produk' ? styles.twoColumns : ''}`}>
                        {item.dropdown.map((subItem, subIdx) => {
                          const isFooter = item.label === 'Produk' && subIdx >= item.dropdown.length - 2;
                          return (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className={`${styles.dropdownItem} ${isFooter ? styles.dropdownFooter : ''}`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <Link href={item.href} className={styles.navLink}>{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
            <div className={styles.navDivider}>
              <div className={styles.dividerLine} />
              <div className={styles.dividerDiamond}>✦</div>
              <div className={styles.dividerLine} />
            </div>
          </div>

          <div className={styles.navActions}>
            <Link href="/limited-edition" className={styles.limitedEditionLink}>
              Limited Edition 🔥
            </Link>

            <button className={styles.iconBtn} onClick={toggleCart} aria-label={`Cart (${totalItems} items)`} id="cart-toggle-btn">
              <FiShoppingBag />
              <span className={styles.cartBadge}>{totalItems}</span>
            </button>

            <button className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" id="mobile-menu-toggle">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`} id="mobile-menu">
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
