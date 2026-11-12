import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import PageWrapper from './components/PageWrapper';

// Lazy load below-the-fold components
const AboutDrShoba = dynamic(() => import('./components/AboutDrShoba'), { ssr: true });
const UpcomingBatches = dynamic(() => import('./components/UpcomingBatches'), { ssr: true });
const Reviews = dynamic(() => import('./components/Reviews'), { ssr: true });
const Footer = dynamic(() => import('./components/Footer'), { ssr: true });
const WhatsAppButton = dynamic(() => import('./components/WhatsAppButton'));

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <HomeHero />
      <AboutDrShoba />
      <UpcomingBatches />
      <Reviews />
      <Footer />
      <WhatsAppButton />
    </PageWrapper>
  );
}
