import React from 'react';
import HeroSection from './components/HeroSection';
import FeatureShowcase from './components/FeatureShowcase';
import CTASection from './components/CTASection';

function HomeContent({ onNavigate }) {
  return (
    <div className="bg-slate-900 text-white overflow-x-hidden">
      <HeroSection onNavigate={onNavigate} />
      <FeatureShowcase />
      <CTASection onNavigate={onNavigate} />
    </div>
  );
}

export default HomeContent;

