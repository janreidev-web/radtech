import React from 'react';
import Lottie from 'lottie-react';
import Icon from '../../../shared/components/Icon';

function FeatureCard({ feature, isReversed }) {
  const content = (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
          <Icon name={feature.icon} className="h-7 w-7 text-teal-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
      </div>
      <p className="mt-5 text-lg text-slate-400">{feature.description}</p>
      <ul className="mt-6 space-y-3 text-slate-300">
        {feature.bulletPoints.map((point) => (
          <li key={point} className="flex items-center gap-3">
            <Icon name="check" className="h-6 w-6 text-cyan-400" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const visual = (
    <div className="aspect-[4/3] rounded-2xl bg-slate-800/50 p-2 border border-slate-700 shadow-2xl shadow-cyan-500/10 flex items-center justify-center overflow-hidden">
      <Lottie animationData={feature.animation} loop className="w-full h-full" />
    </div>
  );

  return (
    <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 items-center">
      <div className={isReversed ? 'lg:order-last' : ''}>{content}</div>
      <div>{visual}</div>
    </div>
  );
}

export default FeatureCard;

