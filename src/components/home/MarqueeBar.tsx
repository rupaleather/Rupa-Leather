import { HiOutlineCheckBadge, HiOutlineShieldCheck, HiOutlineTruck, HiOutlinePencilSquare, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import styles from '@/styles/components/Marquee.module.css';

const USP_WITH_ICONS = [
  { icon: <HiOutlineCheckBadge />, title: '100% Kulit Asli' },
  { icon: <HiOutlineShieldCheck />, title: 'Garansi Seumur Hidup' },
  { icon: <HiOutlineTruck />, title: 'Gratis Ongkir' },
  { icon: <HiOutlinePencilSquare />, title: 'Gratis Kustom Nama' },
  { icon: <HiOutlineBuildingOffice2 />, title: 'Melayani Grosir & Eceran' },
];

export default function MarqueeBar() {
  const items = [...USP_WITH_ICONS, ...USP_WITH_ICONS, ...USP_WITH_ICONS];
  return (
    <div className={styles.marquee} id="usp-marquee" aria-label="Keunggulan kami">
      <div className={styles.marqueeTrack}>
        {items.map((item, i) => (
          <div key={i} className={styles.marqueeItem}>
            <span>{item.icon}</span>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
