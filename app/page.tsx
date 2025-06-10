'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { ServiceGrid } from '@/components/ServiceGrid';
import { FeatureSection } from '@/components/FeatureSection';
import { BlogPreview } from '@/components/BlogPreview';
import { Footer } from '@/components/Footer';
import { LocationProvider } from '@/components/LocationProvider';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <LocationProvider>
      <div className="">
        <main>
          <Hero />
          <ServiceGrid />
          <FeatureSection />
          <BlogPreview />
        </main>
      </div>
    </LocationProvider>
  );
}