/* ============================================
   PRODUCT DATA — KULIT NUSANTARA
   Static product database (replace with API/DB)
   ============================================ */

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  salePrice?: number;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  tags: string[];
  material: string;
  dimensions: string;
  weight: string;
  colors: string[];
  inStock: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  sku: string;
}

export const products: Product[] = [
  {
    id: 'p013',
    name: 'Atlas Pouch Tan',
    slug: 'atlas-pouch-tan',
    category: 'Clutch & Pouch',
    categorySlug: 'clutch-pouch',
    price: 1350000,
    salePrice: 1215000,
    description: 'Pouch serbaguna dari kulit sapi pull-up warna Tan yang maskulin. Kompartemen luas dengan zipper YKK kualitas terbaik. Ideal untuk menyimpan kebutuhan esensial harian seperti smartphone, kunci mobil, dan dompet.',
    shortDescription: 'Pouch kulit sapi pull-up Tan yang maskulin dan praktis',
    images: [
      { src: '/images/products/atlas-pouch-tan.png', alt: 'Atlas Pouch Tan tampak depan' },
    ],
    rating: 4.9,
    reviewCount: 42,
    tags: ['pouch', 'pria', 'tan', 'clutch'],
    material: 'Kulit Sapi Pull-Up',
    dimensions: '26 x 16 x 5 cm',
    weight: '0.3 kg',
    colors: ['Tan'],
    inStock: true,
    isBestSeller: true,
    isNew: true,
    sku: 'KN-CP-013',
  },
  {
    id: 'p001',
    name: 'Zeus Briefcase',
    slug: 'zeus-briefcase',
    category: 'Tas Kulit Pria',
    categorySlug: 'tas-kulit-pria',
    price: 2850000,
    salePrice: 2565000,
    description: '• Material utama : High quality premium leather Crazy Horse dan Pull Up.\n• Material lapisan dalam : Kain suede.\n• Dimensi panjang 22.5cm x lebar : 5.5cm x tinggi : 26cm.\n• Panjang tali 120cm.\n• Bagian depan terdapat 1 slot menggunakan zipper.\n• Bagian belakang terdapat 1 slot menggunakan zipper.\n• Bagian dalam tas terdapat 1 slot menggunakan zipper dan 1 slot tanpa zipper.',
    shortDescription: 'Briefcase kulit sapi full-grain untuk profesional modern',
    images: [
      { src: '/images/products/zeus-1.jpg', alt: 'Zeus Briefcase tampak depan' },
      { src: '/images/products/zeus-2.jpg', alt: 'Zeus Briefcase tampak samping' },
      { src: '/images/products/zeus-3.jpg', alt: 'Zeus Briefcase tampak dalam' },
    ],
    rating: 4.9,
    reviewCount: 127,
    tags: ['briefcase', 'pria', 'professional', 'laptop'],
    material: 'Kulit Sapi Full-Grain',
    dimensions: '40 x 30 x 10 cm',
    weight: '1.2 kg',
    colors: ['Cokelat Tua', 'Hitam', 'Tan'],
    inStock: true,
    isBestSeller: true,
    isNew: false,
    sku: 'KN-TKP-001',
  },
  {
    id: 'p002',
    name: 'Athena Sling Bag',
    slug: 'athena-sling-bag',
    category: 'Tas Selempang',
    categorySlug: 'tas-selempang',
    price: 1650000,
    salePrice: 1485000,
    description: 'Sling bag elegan untuk wanita modern. Desain minimalis dengan sentuhan klasik yang timeless. Tali selempang yang bisa disesuaikan, dilengkapi interior suede lembut dan hardware emas rose. Cocok untuk acara formal maupun casual.',
    shortDescription: 'Sling bag kulit elegan untuk wanita modern',
    images: [
      { src: '/images/products/athena-1.jpg', alt: 'Athena Sling Bag tampak depan' },
      { src: '/images/products/athena-2.jpg', alt: 'Athena Sling Bag detail' },
      { src: '/images/products/athena-3.jpg', alt: 'Athena Sling Bag saat dipakai' },
    ],
    rating: 4.8,
    reviewCount: 89,
    tags: ['sling-bag', 'wanita', 'casual', 'elegant'],
    material: 'Kulit Domba Premium',
    dimensions: '22 x 16 x 8 cm',
    weight: '0.4 kg',
    colors: ['Cognac', 'Burgundy', 'Olive'],
    inStock: true,
    isBestSeller: true,
    isNew: true,
    sku: 'KN-TS-002',
  },
  {
    id: 'p003',
    name: 'Maximus Wallet',
    slug: 'maximus-wallet',
    category: 'Dompet Kulit Pria',
    categorySlug: 'dompet-kulit-pria',
    price: 850000,
    salePrice: 765000,
    description: 'Dompet bifold premium yang menggabungkan fungsi dan estetika. 8 slot kartu, 2 kompartemen uang kertas, dan satu kantong koin tersembunyi. Kulit vegetable-tanned yang akan semakin indah seiring waktu dengan patina alami.',
    shortDescription: 'Dompet bifold kulit vegetable-tanned premium',
    images: [
      { src: '/images/products/maximus-1.jpg', alt: 'Maximus Wallet tampak depan' },
      { src: '/images/products/maximus-2.jpg', alt: 'Maximus Wallet tampak dalam' },
      { src: '/images/products/maximus-3.jpg', alt: 'Maximus Wallet detail jahitan' },
    ],
    rating: 4.9,
    reviewCount: 213,
    tags: ['dompet', 'pria', 'bifold', 'everyday'],
    material: 'Kulit Sapi Vegetable-Tanned',
    dimensions: '12 x 9.5 x 2 cm',
    weight: '0.1 kg',
    colors: ['Natural Tan', 'Dark Brown', 'Black'],
    inStock: true,
    isBestSeller: true,
    isNew: false,
    sku: 'KN-DKP-003',
  },
  {
    id: 'p004',
    name: 'Venus Clutch',
    slug: 'venus-clutch',
    category: 'Clutch & Pouch',
    categorySlug: 'clutch-pouch',
    price: 1250000,
    salePrice: 1125000,
    description: 'Clutch mewah dari kulit kambing Italian-style. Detail tekstur buaya embossed memberikan kesan high-fashion. Clasp magnetik berlapis emas 18k. Interior suede dengan cermin kecil built-in.',
    shortDescription: 'Clutch kulit mewah dengan detail embossed premium',
    images: [
      { src: '/images/products/venus-1.jpg', alt: 'Venus Clutch tampak depan' },
      { src: '/images/products/venus-2.jpg', alt: 'Venus Clutch tampak samping' },
      { src: '/images/products/venus-3.jpg', alt: 'Venus Clutch saat dipegang' },
    ],
    rating: 4.7,
    reviewCount: 64,
    tags: ['clutch', 'wanita', 'mewah', 'pesta'],
    material: 'Kulit Kambing Embossed',
    dimensions: '28 x 14 x 4 cm',
    weight: '0.3 kg',
    colors: ['Black Croc', 'Navy Croc', 'Burgundy Croc'],
    inStock: true,
    isBestSeller: false,
    isNew: true,
    sku: 'KN-CP-004',
  },
  {
    id: 'p005',
    name: 'Hercules Backpack',
    slug: 'hercules-backpack',
    category: 'Backpack Kulit',
    categorySlug: 'backpack-kulit',
    price: 3250000,
    salePrice: 2925000,
    description: 'Backpack kulit full-grain dengan desain urban yang sophisticated. Kompartemen laptop 15.6 inch dengan padding, water-resistant lining, dan akses cepat pocket di bagian atas. Roll-top closure untuk kesan vintage modern.',
    shortDescription: 'Backpack kulit urban dengan kompartemen laptop',
    images: [
      { src: '/images/products/hercules-1.jpg', alt: 'Hercules Backpack tampak depan' },
      { src: '/images/products/hercules-2.jpg', alt: 'Hercules Backpack tampak belakang' },
      { src: '/images/products/hercules-3.jpg', alt: 'Hercules Backpack tampak dalam' },
    ],
    rating: 4.8,
    reviewCount: 76,
    tags: ['backpack', 'pria', 'laptop', 'urban'],
    material: 'Kulit Sapi Full-Grain',
    dimensions: '45 x 30 x 15 cm',
    weight: '1.5 kg',
    colors: ['Saddle Brown', 'Charcoal', 'Olive'],
    inStock: true,
    isBestSeller: true,
    isNew: false,
    sku: 'KN-BK-005',
  },
  {
    id: 'p006',
    name: 'Diana Tote',
    slug: 'diana-tote',
    category: 'Tas Kulit Wanita',
    categorySlug: 'tas-kulit-wanita',
    price: 2450000,
    salePrice: 2205000,
    description: 'Tote bag kulit yang memadukan kapasitas besar dengan gaya premium. Dua handle yang kokoh, snap closure, interior organizer, dan detachable pouch. Ideal untuk kerja maupun weekend getaway.',
    shortDescription: 'Tote bag kulit premium kapasitas besar untuk wanita aktif',
    images: [
      { src: '/images/products/diana-1.jpg', alt: 'Diana Tote tampak depan' },
      { src: '/images/products/diana-2.jpg', alt: 'Diana Tote tampak samping' },
      { src: '/images/products/diana-3.jpg', alt: 'Diana Tote saat dipakai' },
    ],
    rating: 4.9,
    reviewCount: 98,
    tags: ['tote', 'wanita', 'kerja', 'spacious'],
    material: 'Kulit Sapi Top-Grain',
    dimensions: '38 x 28 x 14 cm',
    weight: '0.9 kg',
    colors: ['Caramel', 'Wine Red', 'Forest Green'],
    inStock: true,
    isBestSeller: true,
    isNew: true,
    sku: 'KN-TKW-006',
  },
  {
    id: 'p007',
    name: 'Apollo Belt',
    slug: 'apollo-belt',
    category: 'Ikat Pinggang',
    categorySlug: 'ikat-pinggang',
    price: 650000,
    salePrice: 585000,
    description: 'Ikat pinggang kulit sapi full-grain dengan buckle kuningan antik yang dibuat secara handmade. Lebar 3.5cm, cocok untuk formal dan casual. Ketebalan optimal untuk durabilitas tanpa mengorbankan kenyamanan.',
    shortDescription: 'Ikat pinggang kulit full-grain dengan buckle kuningan handmade',
    images: [
      { src: '/images/products/apollo-1.jpg', alt: 'Apollo Belt tampak depan' },
      { src: '/images/products/apollo-2.jpg', alt: 'Apollo Belt detail buckle' },
      { src: '/images/products/apollo-3.jpg', alt: 'Apollo Belt saat dipakai' },
    ],
    rating: 4.8,
    reviewCount: 156,
    tags: ['belt', 'pria', 'formal', 'casual'],
    material: 'Kulit Sapi Full-Grain',
    dimensions: '110 x 3.5 cm',
    weight: '0.2 kg',
    colors: ['Dark Brown', 'Black', 'Cognac'],
    inStock: true,
    isBestSeller: false,
    isNew: false,
    sku: 'KN-IP-007',
  },
  {
    id: 'p008',
    name: 'Minerva Card Holder',
    slug: 'minerva-card-holder',
    category: 'Card Holder & ID',
    categorySlug: 'card-holder',
    price: 450000,
    salePrice: 405000,
    description: 'Card holder minimalis dengan 6 slot kartu dan center pocket untuk uang kertas. Desain ultra-slim yang pas di saku depan. Kulit pull-up yang akan membentuk patina cantik seiring waktu.',
    shortDescription: 'Card holder kulit pull-up ultra-slim dan minimalis',
    images: [
      { src: '/images/products/minerva-1.jpg', alt: 'Minerva Card Holder tampak depan' },
      { src: '/images/products/minerva-2.jpg', alt: 'Minerva Card Holder tampak dalam' },
      { src: '/images/products/minerva-3.jpg', alt: 'Minerva Card Holder di tangan' },
    ],
    rating: 4.7,
    reviewCount: 182,
    tags: ['card-holder', 'unisex', 'minimalis', 'slim'],
    material: 'Kulit Sapi Pull-Up',
    dimensions: '10 x 7 x 0.8 cm',
    weight: '0.05 kg',
    colors: ['Whiskey', 'Navy', 'British Tan'],
    inStock: true,
    isBestSeller: false,
    isNew: false,
    sku: 'KN-CH-008',
  },
  {
    id: 'p009',
    name: 'Hera Crossbody',
    slug: 'hera-crossbody',
    category: 'Tas Selempang',
    categorySlug: 'tas-selempang',
    price: 1850000,
    salePrice: 1665000,
    description: 'Crossbody bag kulit domba premium dengan tali rantai yang bisa dilepas. Desain flap klasik dengan turn-lock hardware berlapis emas. Kompartemen utama dan kantong zip tersembunyi di belakang.',
    shortDescription: 'Crossbody kulit domba premium dengan tali rantai elegan',
    images: [
      { src: '/images/products/hera-1.jpg', alt: 'Hera Crossbody tampak depan' },
      { src: '/images/products/hera-2.jpg', alt: 'Hera Crossbody detail rantai' },
      { src: '/images/products/hera-3.jpg', alt: 'Hera Crossbody saat dipakai' },
    ],
    rating: 4.9,
    reviewCount: 112,
    tags: ['crossbody', 'wanita', 'rantai', 'elegant'],
    material: 'Kulit Domba Nappa',
    dimensions: '24 x 17 x 8 cm',
    weight: '0.5 kg',
    colors: ['Nude Pink', 'Classic Black', 'Pearl White'],
    inStock: true,
    isBestSeller: true,
    isNew: true,
    sku: 'KN-TS-009',
  },
  {
    id: 'p010',
    name: 'Ares Waist Bag',
    slug: 'ares-waist-bag',
    category: 'Waist Bag',
    categorySlug: 'waist-bag',
    price: 950000,
    salePrice: 855000,
    description: 'Waist bag kulit yang versatile — bisa dipakai di pinggang atau sebagai sling bag. Desain sleek dengan banyak kompartemen. Cocok untuk traveling atau kegiatan outdoor yang butuh akses cepat ke barang-barang penting.',
    shortDescription: 'Waist bag kulit versatile untuk gaya aktif dan urban',
    images: [
      { src: '/images/products/ares-1.jpg', alt: 'Ares Waist Bag tampak depan' },
      { src: '/images/products/ares-2.jpg', alt: 'Ares Waist Bag detail' },
      { src: '/images/products/ares-3.jpg', alt: 'Ares Waist Bag saat dipakai' },
    ],
    rating: 4.6,
    reviewCount: 93,
    tags: ['waist-bag', 'pria', 'travel', 'urban'],
    material: 'Kulit Sapi Oil-Pull-Up',
    dimensions: '25 x 15 x 6 cm',
    weight: '0.35 kg',
    colors: ['Tobacco', 'Black', 'Dark Green'],
    inStock: true,
    isBestSeller: false,
    isNew: false,
    sku: 'KN-WB-010',
  },
  {
    id: 'p011',
    name: 'Sophia Long Wallet',
    slug: 'sophia-long-wallet',
    category: 'Dompet Kulit Wanita',
    categorySlug: 'dompet-kulit-wanita',
    price: 1150000,
    salePrice: 1035000,
    description: 'Dompet panjang wanita dari kulit sapi premium. 12 slot kartu, 3 kompartemen uang kertas, kantong koin zip, dan phone pocket. Snap closure dengan detail quilted diamond pattern pada permukaan.',
    shortDescription: 'Dompet panjang kulit wanita quilted dengan banyak slot',
    images: [
      { src: '/images/products/sophia-1.jpg', alt: 'Sophia Long Wallet tampak depan' },
      { src: '/images/products/sophia-2.jpg', alt: 'Sophia Long Wallet tampak dalam' },
      { src: '/images/products/sophia-3.jpg', alt: 'Sophia Long Wallet detail quilted' },
    ],
    rating: 4.8,
    reviewCount: 145,
    tags: ['dompet', 'wanita', 'panjang', 'quilted'],
    material: 'Kulit Sapi Premium Quilted',
    dimensions: '19 x 10 x 2.5 cm',
    weight: '0.2 kg',
    colors: ['Rose Gold', 'Midnight Black', 'Dusty Mauve'],
    inStock: true,
    isBestSeller: true,
    isNew: false,
    sku: 'KN-DKW-011',
  },
  {
    id: 'p012',
    name: 'Titan Messenger',
    slug: 'titan-messenger',
    category: 'Tas Kulit Pria',
    categorySlug: 'tas-kulit-pria',
    price: 2650000,
    salePrice: 2385000,
    description: 'Messenger bag kulit full-grain dengan desain vintage modern. Flap closure dengan buckle kuningan tua, tali selempang padded yang nyaman, kompartemen laptop 14 inch. Ideal untuk profesional muda yang menghargai karakter dan kualitas.',
    shortDescription: 'Messenger bag kulit vintage-modern dengan kompartemen laptop',
    images: [
      { src: '/images/products/titan-1.jpg', alt: 'Titan Messenger tampak depan' },
      { src: '/images/products/titan-2.jpg', alt: 'Titan Messenger tampak samping' },
      { src: '/images/products/titan-3.jpg', alt: 'Titan Messenger saat dipakai' },
    ],
    rating: 4.7,
    reviewCount: 68,
    tags: ['messenger', 'pria', 'laptop', 'vintage'],
    material: 'Kulit Sapi Full-Grain Waxed',
    dimensions: '38 x 28 x 10 cm',
    weight: '1.1 kg',
    colors: ['Rustic Brown', 'Weathered Black', 'Vintage Tan'],
    inStock: true,
    isBestSeller: false,
    isNew: true,
    sku: 'KN-TKP-012',
  },
];

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Get products by category
 */
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

/**
 * Get best sellers
 */
export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

/**
 * Get new arrivals
 */
export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

/**
 * Search products
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.includes(lowerQuery))
  );
}

/**
 * Sort products
 */
export function sortProducts(items: Product[], sortBy: string): Product[] {
  const sorted = [...items];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    case 'price-desc':
      return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    case 'popular':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
    default:
      return sorted;
  }
}

/**
 * Get related products
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}
