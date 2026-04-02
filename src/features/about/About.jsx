import React from 'react';

const universityLogo =
  'https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Southern_Luzon_State_University_Logo.png/250px-Southern_Luzon_State_University_Logo.png';
const universityName = 'Southern Luzon State University';
const universityAddress = 'SLSU Main Campus, Lucban, Quezon, Philippines';

const thesisTitle =
  'Challenges of Radiologic Technologists in Performing Spine Radiography: Basis for an Interactive Digital Learning Aid';

const proponents = [
  { name: 'Patricia Nicole J. Oabel', imageUrl: '/Images/pat.jpg' },
  { name: 'Crizha Jane P. de Veluz', imageUrl: '/Images/chriza.jpg' },
];

const adviserName = 'Dr. Manuel P. Delos Santos';
const collegeName = 'College of Allied Medicine';
const courseName = 'Bachelor of Science in Radiologic Technology';

function About() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
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

        <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24 lg:px-8">
          {/* University header */}
          <section className="flex flex-col items-center gap-6 rounded-3xl bg-slate-900/60 p-8 shadow-2xl ring-1 ring-slate-800/80 backdrop-blur">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 ring-2 ring-teal-500/60 shadow-lg shadow-teal-500/20 overflow-hidden">
                <img
                  src={universityLogo}
                  alt={`${universityName} Logo`}
                  className="h-20 w-20 object-contain"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {universityName}
                </h1>
                <p className="mt-1 text-sm text-slate-300">{universityAddress}</p>
              </div>
            </div>
          </section>

          {/* Thesis title */}
          <section className="mt-12 rounded-2xl bg-slate-900/80 p-8 ring-1 ring-slate-800/80 shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-400 text-center">
              Thesis Title
            </h2>
            <p className="mt-4 text-xl sm:text-2xl font-semibold leading-relaxed text-slate-100 italic text-center">
              “{thesisTitle}”
            </p>
          </section>

          {/* Proponents */}
          <section className="mt-12">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-400">
                Proponents
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-teal-500/60 to-transparent" />
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {proponents.map((proponent) => (
                <div
                  key={proponent.name}
                  className="flex flex-col items-center rounded-2xl bg-slate-900/80 p-6 ring-1 ring-slate-800/80 shadow-lg hover:shadow-teal-500/20 transition-shadow duration-300"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 opacity-40 blur-lg" />
                    <img
                      src={proponent.imageUrl}
                      alt={proponent.name}
                      className="relative h-32 w-32 rounded-full border-4 border-slate-900 object-cover shadow-xl"
                    />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-white">{proponent.name}</p>
                  <p className="mt-1 text-sm text-slate-400">BS Radiologic Technology</p>
                </div>
              ))}
            </div>
          </section>

          {/* Adviser & program info */}
          <section className="mt-12 grid gap-8 lg:grid-cols-[2fr,3fr]">
            <div className="rounded-2xl bg-slate-900/80 p-6 ring-1 ring-slate-800/80 shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-400">
                Adviser
              </h2>
              <p className="mt-4 text-lg font-semibold text-slate-100">{adviserName}</p>
              <p className="mt-1 text-sm text-slate-400">Research Adviser</p>
            </div>

            <div className="rounded-2xl bg-slate-900/80 p-6 ring-1 ring-slate-800/80 shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-400">
                Program
              </h2>
              <p className="mt-4 text-base font-semibold text-slate-100">{collegeName}</p>
              <p className="mt-1 text-sm text-slate-300">{courseName}</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default About;

