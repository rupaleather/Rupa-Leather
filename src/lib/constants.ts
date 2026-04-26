/* ============================================
   CONSTANTS — KULIT NUSANTARA
   Application-wide constants & configuration
   ============================================ */

export const SITE_CONFIG = {
  name: 'Rupa Leather',
  tagline: 'Authentic Leather Craftsmanship',
  description: 'Koleksi tas, dompet, dan aksesori kulit asli premium buatan tangan pengrajin ahli Indonesia. Kualitas terjamin, desain otentik.',
  url: 'https://rupaleather.id',
  email: 'hello@rupaleather.id',
  phone: '+628131800855',
  whatsapp: '628131800855',
  address: 'Jl. Malioboro No. 123, Yogyakarta, Indonesia',
  socials: {
    instagram: 'https://instagram.com/rupaleather',
    facebook: 'https://facebook.com/rupaleather',
    tiktok: 'https://tiktok.com/@rupaleather',
  },
  marketplace: {
    tokopedia: 'https://tokopedia.com/rupaleather',
    shopee: 'https://shopee.co.id/rupaleather',
    bukalapak: 'https://bukalapak.com/rupaleather',
    blibli: 'https://blibli.com/merchant/rupaleather',
  },
} as const;

export const WHATSAPP_TEMPLATES = {
  general: `Halo Rupa Leather! Saya tertarik dengan produk Anda.`,
  product: (name: string) => `Halo Rupa Leather! Saya tertarik dengan produk "${name}". Apakah masih tersedia?`,
  order: (orderId: string) => `Halo Rupa Leather! Saya ingin konfirmasi pesanan #${orderId}.`,
  custom: `Halo Rupa Leather! Saya ingin custom order untuk...`,
} as const;

export const CURRENCY = {
  code: 'IDR',
  locale: 'id-ID',
  symbol: 'Rp',
} as const;

export const PAGINATION = {
  productsPerPage: 12,
  testimonialsPerPage: 9,
  blogPerPage: 6,
} as const;

export const CATEGORIES = [
  { id: 'tas-pria', name: 'Tas Kulit Pria', slug: 'tas-kulit-pria', icon: '👜' },
  { id: 'tas-wanita', name: 'Tas Kulit Wanita', slug: 'tas-kulit-wanita', icon: '👛' },
  { id: 'dompet-pria', name: 'Dompet Kulit Pria', slug: 'dompet-kulit-pria', icon: '💼' },
  { id: 'dompet-wanita', name: 'Dompet Kulit Wanita', slug: 'dompet-kulit-wanita', icon: '💰' },
  { id: 'sling-bag', name: 'Tas Selempang', slug: 'tas-selempang', icon: '🎒' },
  { id: 'clutch', name: 'Clutch & Pouch', slug: 'clutch-pouch', icon: '📦' },
  { id: 'belt', name: 'Ikat Pinggang', slug: 'ikat-pinggang', icon: '🔗' },
  { id: 'accessories', name: 'Aksesori Kulit', slug: 'aksesori-kulit', icon: '⌚' },
  { id: 'backpack', name: 'Backpack Kulit', slug: 'backpack-kulit', icon: '🎒' },
  { id: 'waist-bag', name: 'Waist Bag', slug: 'waist-bag', icon: '🏃' },
  { id: 'card-holder', name: 'Card Holder & ID', slug: 'card-holder', icon: '💳' },
  { id: 'totebag', name: 'Totebag Kulit', slug: 'totebag-kulit', icon: '🛍️' },
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price-asc', label: 'Harga: Rendah ke Tinggi' },
  { value: 'price-desc', label: 'Harga: Tinggi ke Rendah' },
  { value: 'popular', label: 'Paling Populer' },
  { value: 'rating', label: 'Rating Tertinggi' },
] as const;

export const USP_ITEMS = [
  { icon: '✨', title: 'Kulit Asli 100%', desc: 'Bahan premium pilihan' },
  { icon: '🛡️', title: 'Garansi Seumur Hidup', desc: 'Produk kami dijamin kualitasnya' },
  { icon: '🚚', title: 'Gratis Ongkir', desc: 'Ke seluruh Indonesia' },
  { icon: '📝', title: 'Gratis Kustom Nama', desc: 'Personalisasi gratis' },
  { icon: '🏢', title: 'Melayani Grosir & Eceran', desc: 'Corporate & Bulk Order' },
] as const;

export const RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
} as const;

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;
