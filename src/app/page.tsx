import HeroSection from '@/components/home/HeroSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import MarqueeBar from '@/components/home/MarqueeBar';
import CategoryGrid from '@/components/home/CategoryGrid';
import ClientLogos from '@/components/home/ClientLogos';
import FeaturedProducts from '@/components/home/FeaturedProducts';

import NewArrivals from '@/components/home/NewArrivals';
import CTABanner from '@/components/home/CTABanner';
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection';
import QualitySection from '@/components/home/QualitySection';
import LifestyleShowcase from '@/components/home/LifestyleShowcase';
import BlogPreview from '@/components/home/BlogPreview';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <CategoryGrid />
      <ClientLogos />
      <LifestyleShowcase />
      <QualitySection />
      <CraftsmanshipSection />
      <NewArrivals />
      <FeaturedProducts />
      <TestimonialSection />
      <BlogPreview />
      <CTABanner />
    </>
  );
}
