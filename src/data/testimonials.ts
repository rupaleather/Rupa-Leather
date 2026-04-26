/* ============================================
   TESTIMONIAL DATA — KULIT NUSANTARA
   ============================================ */

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  productBought: string;
  date: string;
  isVideo: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export const testimonials: Testimonial[] = [
  { id: 't001', name: 'Budi Setiawan', location: 'Jakarta', avatar: '/images/testimonials/avatar-1.jpg', rating: 5, text: 'Kualitas luar biasa! Zeus Briefcase terbaik.', productBought: 'Zeus Briefcase', date: '2026-03-15', isVideo: false },
  { id: 't002', name: 'Ratna Dewi', location: 'Surabaya', avatar: '/images/testimonials/avatar-2.jpg', rating: 5, text: 'Athena Sling Bag cantik banget!', productBought: 'Athena Sling Bag', date: '2026-02-28', isVideo: true, videoUrl: '/videos/testimonial-1.mp4', thumbnailUrl: '/images/testimonials/video-thumb-1.jpg' },
  { id: 't003', name: 'Ahmad Fauzi', location: 'Bandung', avatar: '/images/testimonials/avatar-3.jpg', rating: 5, text: 'Maximus Wallet hadiah pernikahan terbaik!', productBought: 'Maximus Wallet', date: '2026-03-10', isVideo: false },
  { id: 't004', name: 'Siti Nurhaliza', location: 'Yogyakarta', avatar: '/images/testimonials/avatar-4.jpg', rating: 5, text: 'Sudah 3x order, konsisten kualitasnya!', productBought: 'Diana Tote', date: '2026-01-20', isVideo: true, videoUrl: '/videos/testimonial-2.mp4', thumbnailUrl: '/images/testimonials/video-thumb-2.jpg' },
  { id: 't005', name: 'Reza Pratama', location: 'Medan', avatar: '/images/testimonials/avatar-5.jpg', rating: 4, text: 'Hercules Backpack super mantap!', productBought: 'Hercules Backpack', date: '2026-02-14', isVideo: false },
  { id: 't006', name: 'Maya Anggraini', location: 'Bali', avatar: '/images/testimonials/avatar-6.jpg', rating: 5, text: 'Venus Clutch andalan ke acara penting!', productBought: 'Venus Clutch', date: '2026-03-05', isVideo: true, videoUrl: '/videos/testimonial-3.mp4', thumbnailUrl: '/images/testimonials/video-thumb-3.jpg' },
  { id: 't007', name: 'Dian Purnama', location: 'Semarang', avatar: '/images/testimonials/avatar-7.jpg', rating: 5, text: 'Corporate gift 50 pcs, klien puas!', productBought: 'Minerva Card Holder', date: '2026-01-30', isVideo: false },
  { id: 't008', name: 'Eko Saputro', location: 'Makassar', avatar: '/images/testimonials/avatar-8.jpg', rating: 5, text: 'Apollo Belt terbaik, setahun masih bagus!', productBought: 'Apollo Belt', date: '2026-02-20', isVideo: true, videoUrl: '/videos/testimonial-4.mp4', thumbnailUrl: '/images/testimonials/video-thumb-4.jpg' },
  { id: 't009', name: 'Anissa Rahman', location: 'Palembang', avatar: '/images/testimonials/avatar-9.jpg', rating: 5, text: 'Sophia Long Wallet Rose Gold cantik!', productBought: 'Sophia Long Wallet', date: '2026-03-01', isVideo: false },
];

export function getAllTestimonials(): Testimonial[] { return testimonials; }
export function getVideoTestimonials(): Testimonial[] { return testimonials.filter(t => t.isVideo); }
export function getTextTestimonials(): Testimonial[] { return testimonials.filter(t => !t.isVideo); }
