/* ============================================
   SEO — KULIT NUSANTARA
   SEO metadata & structured data generators
   ============================================ */

import { SITE_CONFIG } from './constants';
import type { Metadata } from 'next';

interface SEOParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
}

/**
 * Generate page metadata for Next.js
 */
export function generateMetadata({
  title,
  description,
  path = '',
  image = '/images/og-default.jpg',
  type = 'website',
  keywords = [],
}: SEOParams): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  const defaultKeywords = [
    'tas kulit', 'dompet kulit', 'aksesori kulit', 'kulit asli',
    'leather bag', 'leather wallet', 'handmade leather',
    'kulit premium', 'tas kulit pria', 'tas kulit wanita',
    'dompet kulit pria', 'dompet kulit wanita', 'kulit nusantara',
    'kerajinan kulit', 'kulit sapi asli', 'leather goods indonesia',
  ];

  const ogType = type === 'product' ? 'website' : type;

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: url,
      languages: { 'id-ID': url },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: 'id_ID',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate Organization JSON-LD
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    description: SITE_CONFIG.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address,
      addressCountry: 'ID',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
    sameAs: Object.values(SITE_CONFIG.socials),
  };
}

/**
 * Generate Product JSON-LD
 */
export function getProductSchema(product: {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  slug: string;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${SITE_CONFIG.url}/products/${product.slug}`,
    sku: product.sku || product.slug,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
