import React from 'react';
import HeroSection from './components/HeroSection';
import FeatureShowcase from './components/FeatureShowcase';
import CTASection from './components/CTASection';

function HomeContent() {
  return (
    <div className="bg-slate-900 text-white overflow-x-hidden">
      <HeroSection />
      <FeatureShowcase />
      <CTASection />
    </div>
  );
}

export default HomeContent;

