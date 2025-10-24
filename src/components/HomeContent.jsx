import React from 'react';
import Lottie from "lottie-react";
import radiologyAnimation from '../assets/Animations/radiology.json';
import positioningAnimation from '../assets/Animations/positioningAnimation.json';
import rayAnimation from '../assets/Animations/rayAnimation.json';
import procedureAnimation from '../assets/Animations/procedureAnimation.json';


const Icon = ({ name, className }) => {
  const icons = {
    position: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />,
    procedure: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
    ray: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      {icons[name]}
    </svg>
  );
};


function HomeContent() {
  return (
    <div className="bg-slate-900 text-white overflow-x-hidden">

      {/* ===== Hero Section (FIXED FOR MOBILE) ===== */}
      <div className="relative isolate">
         <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
          <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#36d7b7] to-[#1a2a6c] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Master Radiography with <span className="bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">Intuitive 3D Learning</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Stop memorizing. Start visualizing. Our interactive platform brings radiographic positioning to life, helping you build a deep, intuitive understanding of anatomy, procedures, and beam alignment.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a href="#" className="rounded-md bg-teal-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-500 transition-colors duration-300">
                Start Learning Now
              </a>
              <a href="#" className="text-base font-semibold leading-6 text-slate-300 hover:text-white transition-colors duration-300">
                Explore Features <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          {/* FIX: Removed 'hidden lg:block' and added margin for mobile.
            This div is now visible on all screen sizes.
          */}
          <div className="mt-16 lg:mt-0">
            <div className="w-full h-96 rounded-2xl bg-slate-800/50 p-4 border border-slate-700 shadow-2xl shadow-teal-500/10">
              <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden">
                <Lottie animationData={radiologyAnimation} loop={true} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Core Features Section (Unchanged) ===== */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl lg:text-center">
             <h2 className="text-base font-semibold leading-7 text-teal-400">Go Beyond the Textbook</h2>
             <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See Every Angle. Master Every Procedure.
             </p>
             <p className="mt-6 text-lg leading-8 text-slate-400">
                RadTech3D isn't just about looking at diagrams. It's a hands-on virtual lab that bridges the gap between theory and clinical practice.
             </p>
           </div>
           
           {/* Feature 1: Interactive 3D Positioning */}
           <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                <div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                            <Icon name="position" className="h-7 w-7 text-teal-400"/>
                        </div>
                        <h3 className="text-2xl font-semibold text-white">Interactive 3D Positioning</h3>
                    </div>
                    <p className="mt-5 text-lg text-slate-400">
                        Rotate, pan, and zoom a true-to-life 3D anatomical model. Understand the complex relationship between patient posture, anatomy, and radiographic outcomes like never before.
                    </p>
                    <ul className="mt-6 space-y-3 text-slate-300">
                        <li className="flex items-center gap-3">
                            <Icon name="check" className="h-6 w-6 text-cyan-400" />
                            <span>Eliminate guesswork with hands-on practice.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Icon name="check" className="h-6 w-6 text-cyan-400" />
                            <span>Visualize anatomical superimposition in real-time.</span>
                        </li>
                    </ul>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-slate-800/50 p-2 border border-slate-700 shadow-2xl shadow-cyan-500/10 flex items-center justify-center overflow-hidden">
                    <Lottie animationData={positioningAnimation} loop={true} className="w-full h-full" />
                </div>
           </div>

           {/* Feature 2: Central Ray Visualization */}
           <div className="mt-24 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                <div className="lg:order-last">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                            <Icon name="ray" className="h-7 w-7 text-teal-400"/>
                        </div>
                        <h3 className="text-2xl font-semibold text-white">Demystify the Central Ray</h3>
                    </div>
                    <p className="mt-5 text-lg text-slate-400">
                        Visualize the precise path of the x-ray beam. Adjust angulation and centering in real-time to see its impact on part distortion, magnification, and anatomical alignment.
                    </p>
                    <ul className="mt-6 space-y-3 text-slate-300">
                        <li className="flex items-center gap-3">
                            <Icon name="check" className="h-6 w-6 text-cyan-400" />
                            <span>Perfect your technique before entering the lab.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Icon name="check" className="h-6 w-6 text-cyan-400" />
                            <span>Understand the 'why' behind every CR angle.</span>
                        </li>
                    </ul>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-slate-800/50 p-2 border border-slate-700 shadow-2xl shadow-cyan-500/10 flex items-center justify-center overflow-hidden">
                    <Lottie animationData={rayAnimation} loop={true} className="w-full h-full" />
                </div>
           </div>
           
           {/* Feature 3: Guided Procedures */}
           <div className="mt-24 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                <div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                            <Icon name="procedure" className="h-7 w-7 text-teal-400"/>
                        </div>
                        <h3 className="text-2xl font-semibold text-white">Step-by-Step Procedural Guides</h3>
                    </div>
                    <p className="mt-5 text-lg text-slate-400">
                        Follow clear, concise instructions integrated directly with the 3D model. From patient prep to evaluation criteria, our guides are aligned with Merrill's Atlas to ensure you're ready for the clinic.
                    </p>
                    <ul className="mt-6 space-y-3 text-slate-300">
                        <li className="flex items-center gap-3">
                            <Icon name="check" className="h-6 w-6 text-cyan-400" />
                            <span>Study smarter with integrated learning.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Icon name="check" className="h-6 w-6 text-cyan-400" />
                            <span>Build confidence for your practical exams.</span>
                        </li>
                    </ul>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-slate-800/50 p-2 border border-slate-700 shadow-2xl shadow-cyan-500/10 flex items-center justify-center overflow-hidden">
                    <Lottie animationData={procedureAnimation} loop={true} className="w-full h-full" />
                </div>
           </div>
        </div>
      </div>


      {/* ===== Final CTA Section (Unchanged) ===== */}
      <div className="relative isolate">
        <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
            <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[60rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1a2a6c] to-[#36d7b7] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Elevate Your Learning?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Join the next generation of radiologic technologists. Gain the confidence and competence to excel in your clinical practice.
          </p>
          <div className="mt-10">
            <a href="#" className="rounded-md bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-500 transition-opacity duration-300">
              Get Started for Free
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HomeContent;