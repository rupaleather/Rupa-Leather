import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { getOrganizationSchema } from '@/lib/seo';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import '@/styles/globals.css';

export const metadata: Metadata = generateMetadata({
  title: 'Dompet & Tas Kulit Asli Jogja',
  description: 'Koleksi tas, dompet, dan aksesori kulit asli premium buatan tangan pengrajin ahli Indonesia. Garansi seumur hidup, gratis ongkir, gratis grafir nama.',
  keywords: ['tas kulit premium', 'dompet kulit asli', 'leather goods indonesia', 'kerajinan kulit yogyakarta'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = getOrganizationSchema();

  return (
    <html lang="id" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="icon" href="/images/logo/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          <main id="main-content" role="main">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
