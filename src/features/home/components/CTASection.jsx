import React from 'react';

function CTASection({ onNavigate }) {
  return (
    <div className="relative isolate">
      <div
        className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[60rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1a2a6c] to-[#36d7b7] opacity-20"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Elevate Your Learning?</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Join the next generation of radiologic technologists. Gain the confidence and competence to excel in your
          clinical practice.
        </p>
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('model')}
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 px-10 py-4 text-base font-semibold text-white shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-500 transition-opacity duration-300"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
}

export default CTASection;

