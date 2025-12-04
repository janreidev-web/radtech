import React from 'react';
import featureList from '../config/featureList';
import FeatureCard from './FeatureCard';

function FeatureShowcase() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-teal-400">Go Beyond the Textbook</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See Every Angle. Master Every Procedure.
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            RadTech3D isn't just about looking at diagrams. It's a hands-on virtual lab that bridges the gap between
            theory and clinical practice.
          </p>
        </div>

        {featureList.map((feature, index) => (
          <FeatureCard key={feature.id} feature={feature} isReversed={index % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

export default FeatureShowcase;

