import React from 'react';
import Lottie from 'lottie-react';
import radiologyAnimation from '../../../assets/Animations/radiology.json';

function HeroSection() {
  return (
    <div className="relative isolate">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#36d7b7] to-[#1a2a6c] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Master Radiography with{' '}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
              Intuitive 3D Learning
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Stop memorizing. Start visualizing. Our interactive platform brings radiographic positioning to life,
            helping you build a deep, intuitive understanding of anatomy, procedures, and beam alignment.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-teal-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-500 transition-colors duration-300"
            >
              Start Learning Now
            </a>
            <a
              href="#"
              className="text-base font-semibold leading-6 text-slate-300 hover:text-white transition-colors duration-300"
            >
              Explore Features <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mt-16 lg:mt-0">
          <div className="w-full h-96 rounded-2xl bg-slate-800/50 p-4 border border-slate-700 shadow-2xl shadow-teal-500/10">
            <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden">
              <Lottie animationData={radiologyAnimation} loop className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

