# RadTech3D — Visual & Design Code Summary

> Page-by-page breakdown of the UI design system: layout, colors, components, and visual effects.

---

## Design System at a Glance

| Token | Value | Used for |
|-------|-------|---------|
| Primary accent | `teal-400` / `#14b8a6` | Links, active states, headings, borders |
| Secondary accent | `cyan-500` / `#0891b2` | Gradients, button fills |
| Page background (dark) | `gray-900` / `#111827` | Home, Assessment, About |
| Page background (light) | `white` | Model Viewer (3D canvas) |
| Card surface | `#1f2937` (`slate-800`) | Question cards, theory cards |
| Border | `#374151` (`gray-700`) | All card outlines |
| Body text | `#9ca3af` (`gray-400`) | Secondary / subheadings |
| Success | `#10b981` / `#16a34a` | Correct answers, score bars |
| Error | `#ef4444` / `#dc2626` | Wrong answers, alarm timer |
| Warning | `#d97706` / `#fbbf24` | Mid-range scores, time bonus |

---

## 1. Global Layout & Animations — `App.jsx` + `App.css`

### How it works operationally
The root `<App>` switches the page background between `bg-gray-900` (dark, for Home / Assessment / About) and `bg-white` (for the Model Viewer so the 3D scene renders cleanly). The `HighScoreBanner` slides in from above using a CSS keyframe. Both animations are defined in `App.css`.

### `src/App.css`
```css
@import 'tailwindcss';

/* Loading spinner in LoadingIndicator */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* High-score banner slide-in (fixed, centered) */
@keyframes hsSlideIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

### `src/App.jsx` — background switch
```jsx
// White background for the 3D viewer; dark for all other pages
const bg = currentPage === 'model' ? 'bg-white' : 'bg-gray-900';

return (
  <div className={`${bg} min-h-screen flex flex-col transition-colors duration-100`}>
    <Header ... />
    {bannerVisible && <HighScoreBanner ... />}
    <main className="flex-grow">{renderContent()}</main>
    <Footer />
  </div>
);
```

---

## 2. Header — `src/layout/Header.jsx`

### How it works operationally
The header is `sticky top-0 z-50`. As the user scrolls past 10 px, a `backdrop-blur` + heavier shadow fires to distinguish it from page content. The active nav link receives a teal underline via `underline-offset-2 decoration-teal-400`. Non-active links show a width-expanding teal underline on hover using an `::after`-style `<span>` animated with `w-0 → group-hover:w-full`. On mobile, the nav collapses behind a hamburger icon; the menu slides open with `max-h-96` / `max-h-0` transition.

### `src/layout/Header.jsx`
```jsx
// Sticky with scroll-triggered blur
<header className={`sticky top-0 z-50 transition-all duration-300 ${
  isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-xl' : 'bg-gray-900'
}`}>

  {/* Logo */}
  <span className="text-2xl font-bold text-white tracking-wider">
    RadTech<span className="text-teal-400">3D</span>
  </span>

  {/* Desktop nav link — active vs hover underline */}
  <button className={`text-sm font-medium relative group ${
    isActive
      ? 'text-teal-400 underline underline-offset-2 decoration-2 decoration-teal-400'
      : 'text-gray-300 hover:text-teal-400'
  }`}>
    {link.name}
    {/* Hover underline grows from 0 → full width */}
    {!isActive && (
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-400
                       transition-all duration-300 group-hover:w-full" />
    )}
  </button>

  {/* Mobile slide-down menu */}
  <div className={`md:hidden transition-all duration-500 ease-in-out ${
    isMenuOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
  } overflow-hidden`}>
    {/* Active mobile item */}
    <button className={`w-full text-left px-3 py-3 rounded-md text-base font-medium ${
      isActive ? 'text-teal-400 bg-gray-700 border' : 'text-gray-300 hover:bg-gray-700'
    }`}>
```

---

## 3. Footer — `src/layout/Footer.jsx`

### How it works operationally
Minimal dark footer separated from page content by a subtle border. The logo is repeated for brand consistency. Social icon links use the same `text-gray-400 hover:text-teal-400 transition-colors` pattern as the header.

### `src/layout/Footer.jsx`
```jsx
<footer className="bg-gray-900 border-t border-gray-700/50">
  {/* Logo column */}
  <Icon name="logo" className="h-10 w-10 text-teal-400" />
  <span className="text-2xl font-bold text-white tracking-wider">
    RadTech<span className="text-teal-400">3D</span>
  </span>
  <p className="text-gray-400 text-base">
    Revolutionizing radiological positioning with immersive 3D models.
  </p>

  {/* Social icons */}
  <a className="text-gray-400 hover:text-teal-400 transition-colors">
    <Icon name={item.icon} className="h-6 w-6" />
  </a>
</footer>
```

---

## 4. Home Page

### 4a. Hero Section — `src/features/home/components/HeroSection.jsx`

**Design:** Two-column grid (stacks on mobile). Left: large headline with a teal-to-cyan gradient text clip on the key phrase. Right: a frosted dark card (`bg-slate-800/50`, `border-slate-700`, `shadow-teal-500/10`) housing the Lottie radiology animation. A GPU-accelerated blurred gradient blob floats behind the headline as an ambient glow effect.

```jsx
{/* Ambient blob — blurred polygon gradient behind the hero */}
<div className="absolute inset-x-0 top-[-10rem] -z-10 blur-3xl">
  <div
    className="bg-gradient-to-tr from-[#36d7b7] to-[#1a2a6c] opacity-30
               rotate-[30deg] w-[36.125rem]"
    style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, ...)' }}
  />
</div>

{/* Headline with gradient text clip */}
<h1 className="text-4xl font-extrabold sm:text-6xl">
  Master Radiography with{' '}
  <span className="bg-gradient-to-r from-teal-400 to-cyan-500
                   text-transparent bg-clip-text">
    Intuitive 3D Learning
  </span>
</h1>

{/* CTA buttons */}
<button className="rounded-md bg-teal-500 px-6 py-3 font-semibold text-white
                   hover:bg-teal-400 transition-colors duration-300">
  Start Learning Now
</button>

{/* Lottie animation card */}
<div className="rounded-2xl bg-slate-800/50 border border-slate-700
                shadow-2xl shadow-teal-500/10 p-4">
  <Lottie animationData={radiologyAnimation} loop className="w-full h-full" />
</div>
```

### 4b. Feature Cards — `src/features/home/components/FeatureCard.jsx`

**Design:** Alternating two-column layout (`isReversed` flips column order). Icon sits inside a `rounded-xl bg-slate-800 border-slate-700` container. The animation visual panel uses `shadow-cyan-500/10` for a subtle cyan glow. Bullet points use cyan checkmarks.

```jsx
{/* Icon badge */}
<div className="flex h-12 w-12 items-center justify-center
                rounded-xl bg-slate-800 border border-slate-700">
  <Icon name={feature.icon} className="h-7 w-7 text-teal-400" />
</div>

{/* Bullet points */}
<li className="flex items-center gap-3">
  <Icon name="check" className="h-6 w-6 text-cyan-400" />
  <span>{point}</span>
</li>

{/* Animation visual panel */}
<div className="aspect-[4/3] rounded-2xl bg-slate-800/50 border border-slate-700
                shadow-2xl shadow-cyan-500/10">
  <Lottie animationData={feature.animation} loop />
</div>

{/* Column reversal for alternating layout */}
<div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
  <div className={isReversed ? 'lg:order-last' : ''}>{content}</div>
  <div>{visual}</div>
</div>
```

### 4c. CTA Section — `src/features/home/components/CTASection.jsx`

**Design:** Centered text block over a second ambient blob (same polygon clip-path, reversed gradient direction). The button uses a `bg-gradient-to-r from-teal-500 to-cyan-600` fill with a `hover:opacity-90` fade.

```jsx
{/* Reversed ambient blob */}
<div className="absolute inset-x-0 bottom-0 -z-10 blur-3xl">
  <div className="bg-gradient-to-tr from-[#1a2a6c] to-[#36d7b7] opacity-20 rotate-[30deg]"
       style={{ clipPath: 'polygon(74.1% 44.1%, ...)' }} />
</div>

{/* Gradient CTA button */}
<button className="rounded-md bg-gradient-to-r from-teal-500 to-cyan-600
                   px-10 py-4 font-semibold text-white shadow-lg
                   hover:opacity-90 transition-opacity duration-300">
  Get Started for Free
</button>
```

---

## 5. Model Viewer Page

### 5a. Canvas & Scene — `ModelLoader.jsx`

**Design:** Full `100vh` dark-white container. The `<Canvas>` fills the entire viewport with a `fov: 50` camera. While the GLB is loading, a `<LoadingIndicator>` overlay covers the scene. The background switches to `bg-white` globally so the 3D scene doesn't have a dark halo.

```jsx
<div style={{ position: 'relative', height: '100vh', width: '100%' }}>
  {isLoading && <LoadingIndicator />}   {/* spinner overlay */}

  <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 5]} intensity={1} />
    <BodyMap scale={isMobile ? 1.7 : 2.4} ... />
    {showCassette && <Cassette ... />}
    {showVerticalA && <Vertical variant="A" ... />}
    ...
    <OrbitControls ref={orbitControlsRef} />
  </Canvas>
```

### 5b. Lesson Dashboard Panel — `LessonDashboard.jsx`

**Design:** White card (`bg: rgba(255,255,255,0.9)`) with rounded corners and a drop shadow, absolutely positioned. On **mobile** it anchors to the top-center; on **desktop** it anchors to the left-center. Wheel events are stopped at this panel to prevent them from rotating the 3D scene behind it.

```jsx
// Responsive panel position (from ModelLoader)
const dashboardStyle = {
  position: 'absolute', zIndex: 10,
  background: 'rgba(255,255,255,0.9)',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  ...(isMobile
    ? { top: '1rem', left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)', maxWidth: '400px', maxHeight: '40vh' }
    : { top: '30%', left: '2rem', transform: 'translateY(-50%)',
        width: '20%', minWidth: '250px' })
};

// Category rows
<button className="flex items-center justify-between w-full p-3 rounded-lg
                   hover:bg-blue-100 transition-colors">
  <span className="text-sm font-semibold text-gray-800">{category.title}</span>
  <span className="text-xs text-blue-600 font-medium">Click to Start</span>
</button>
```

### 5c. Control Tray — `ControlTray.jsx`

**Design:** Glassmorphism toolbar anchored top-right. Dark semi-transparent background with `backdrop-filter: blur(10px)` and a 1 px white/10% border. Toggle buttons show a **blue active state** (`#2196F3` bg + glow + scale(1.05)) and a neutral hover (`rgba(255,255,255,0.2)`). The "Done Positioning" button is always green (`#4CAF50`).

```jsx
// Tray container
const trayStyle = {
  position: 'absolute', top: '30px', right: '30px',
  display: 'flex', gap: '12px',
  backgroundColor: 'rgba(50,50,50,0.95)',
  borderRadius: '12px', padding: '12px 16px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
};

// Active toggle button (e.g. Equipment panel is open)
const activeButtonStyle = {
  backgroundColor: '#2196F3',
  border: '2px solid #1976D2',
  boxShadow: '0 4px 12px rgba(33,150,243,0.4)',
  transform: 'scale(1.05)',         // subtle pop
  color: '#fff', borderRadius: '8px',
};

// "Done Positioning" — always green
{ backgroundColor: '#4CAF50', border: '2px solid #45a049' }
```

### 5d. Post-Exposure Panel — thickness input & result image

**Design:** The thickness input is an inline panel that appears in the scene overlay. After validation, the result image fills a styled `<img>` block. Both are rendered as absolutely positioned `<div>` overlays on top of the Canvas.

```jsx
{/* Thickness input step */}
{simulationStep === 'thickness-input' && (
  <div style={{ position:'absolute', top:'50%', left:'50%',
    transform:'translate(-50%,-50%)',
    background:'rgba(20,20,30,0.96)', borderRadius:'16px',
    padding:'32px', zIndex:200, minWidth:'320px',
    border:'1px solid #374151', boxShadow:'0 20px 60px rgba(0,0,0,0.6)' }}>
    <h3 style={{ color:'#14b8a6', marginBottom:'12px' }}>Enter Body Thickness</h3>
    <input type="number" min={15} max={35} placeholder="15–35 cm"
      style={{ width:'100%', padding:'10px', borderRadius:'8px',
        background:'#1f2937', border:'2px solid #374151', color:'#fff' }} />
    <button style={{ background:'#14b8a6', color:'#fff',
      width:'100%', marginTop:'12px', padding:'11px',
      borderRadius:'8px', fontWeight:'700' }}>
      Calculate & Show Results
    </button>
  </div>
)}

{/* Post-exposure result image */}
{simulationStep === 'post-exposure' && (
  <img src={getResultImage()} alt="Radiographic Result"
    style={{ maxWidth:'420px', borderRadius:'12px',
      border:'2px solid #374151', boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }} />
)}
```

---

## 6. Assessment Page

### 6a. Global Styles — `AssessmentContent.css`

**Design:** Dark theme (`#111827` canvas, `#1f2937` cards, `#374151` borders) with teal (`#14b8a6`) as the primary accent. All interactive elements have `transition: all 0.3s ease`. The tab bar uses a bottom border as the section indicator.

```css
.assessment-container  { max-width: 1200px; margin: 0 auto; padding: 2rem; color: #fff; }

/* Header */
.assessment-header h1  { font-size: 2.5rem; color: #14b8a6; }
.assessment-header p   { font-size: 1.1rem; color: #9ca3af; }

/* Tab bar — underline-indicator style */
.section-tabs          { border-bottom: 2px solid #374151; padding-bottom: 1rem; }
.tab-button            { color: #9ca3af; border-bottom: 3px solid transparent;
                         padding: 0.75rem 2rem; transition: all 0.3s ease; }
.tab-button:hover      { color: #14b8a6; }
.tab-button.active     { color: #14b8a6; border-bottom-color: #14b8a6; }

/* Question cards */
.question-card         { background: #1f2937; border-radius: 12px;
                         padding: 2rem; border: 1px solid #374151; }

/* Submit / nav buttons */
.submit-btn            { background: #14b8a6; color: #fff; border-radius: 8px;
                         padding: 0.75rem 1.5rem; transition: background 0.3s ease; }
.submit-btn:hover      { background: #0d9488; }
.nav-btn               { background: #374151; transition: background 0.3s ease; }
.nav-btn:hover         { background: #4b5563; }

/* Mobile: tabs stack vertically */
@media (max-width: 768px) {
  .section-tabs        { flex-direction: column; align-items: center; }
  .tab-button          { width: 200px; margin: 0.25rem 0; }
}
```

### 6b. Timer Badge

**Design:** Pill badge right-aligned in the section header. Turns deep-red with a red border when under 60 seconds, creating a visible alarm state without disrupting the layout.

```jsx
const timerBadge = (sid, submitted) => {
  if (submitted) return null;
  const sec     = getRemainingSeconds(sid);
  const isAlarm = sec < 60;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '99px',
      fontSize: '12px', fontWeight: '700',
      background: isAlarm ? '#7f1d1d' : '#1f2937',      // deep red vs dark card
      color:      isAlarm ? '#fca5a5' : '#9ca3af',      // light red vs gray
      border:    `1px solid ${isAlarm ? '#ef4444' : '#374151'}`,
    }}>
      ⏱ {sec > 0 ? formatTime(sec) : "Time's Up!"}
    </span>
  );
};
```

### 6c. Multiple Choice — option state colours

**Design:** Option rows are `border: 2px solid` containers. Before submission they highlight blue on selection. After submission they turn green (correct) or red (selected-wrong), and all non-selected correct options reveal a green tint.

```jsx
const optionStyle = (selected, correct, submitted, idx, answer) => {
  if (!submitted)
    return selected === idx
      ? { background: '#1e3a5f', borderColor: '#3b82f6', color: '#bfdbfe' }  // selected
      : {};                                                                    // neutral
  if (idx === answer)
    return { background: '#064e3b', borderColor: '#10b981', color: '#a7f3d0' }; // correct
  if (selected === idx)
    return { background: '#7f1d1d', borderColor: '#ef4444', color: '#fecaca' }; // wrong
  return {};  // other options after submit
};
```

### 6d. True / False — toggle button state colours

**Design:** Two side-by-side pill buttons per statement. Button colors encode state: neutral gray → selected blue → post-submit green (correct) / red (wrong). If an answer was wrong, the correct answer label is shown inline in teal.

```jsx
<button style={{
  padding: '7px 22px', borderRadius: '7px', fontWeight: '700',
  border: `2px solid ${
    btnCorrect ? '#10b981' : btnWrong ? '#ef4444' : isSelected ? '#3b82f6' : '#374151'
  }`,
  background: btnCorrect ? '#064e3b' : btnWrong ? '#7f1d1d' : isSelected ? '#1e3a5f' : '#1f2937',
  color:      btnCorrect ? '#a7f3d0' : btnWrong ? '#fecaca' : isSelected ? '#bfdbfe' : '#9ca3af',
}}>
  {val ? 'True' : 'False'}
</button>
{isWrong && <span style={{ color:'#10b981', fontWeight:'600' }}>✓ {q.answer ? 'True' : 'False'}</span>}
```

### 6e. Drag & Label — pool and drop zones

**Design:** The label pool is a dashed dark container (`border: 2px dashed #374151`). Labels are blue pill chips (`bg: #3b82f6`) with `cursor: grab`. Drop zones turn transparent while dragging and show feedback colours after submission.

```jsx
{/* Label pool — dashed drop target */}
<div style={{
  display: 'flex', flexWrap: 'wrap', gap: '8px',
  background: '#111827', borderRadius: '10px',
  border: '2px dashed #374151', minHeight: '52px',
}}>
  {poolLabels.map(label => (
    <div draggable style={{
      padding: '11px 20px',
      background: '#3b82f6',           // blue pill
      color: 'white', borderRadius: '20px',
      cursor: 'grab', fontWeight: '600',
      opacity: dragging?.label === label ? 0.4 : 1,  // ghost while dragging
    }}>
      {label}
    </div>
  ))}
</div>
```

### 6f. Results Panel

**Design:** Large centered score number coloured by rating threshold. A breakdown row per section uses an 8 px progress bar colour-coded green (≥75%) / amber (≥50%) / red (<50%), with weighted points shown right-aligned. The leaderboard table highlights the current player's row and adds medal emoji to the top 3.

```jsx
{/* Big score display */}
<div style={{ textAlign:'center', background:'#111827', borderRadius:'16px',
              border:'2px solid #374151', padding:'28px' }}>
  <div style={{ fontSize:'56px', fontWeight:'800', color: rating.color }}>{totalScore}</div>
  <div style={{ color:'#9ca3af' }}>out of {totalPossible} points</div>
  {/* Raw + time bonus breakdown */}
  Raw <strong style={{ color:'#94a3b8' }}>{rawScore}</strong>
  + Time Bonus <strong style={{ color:'#fbbf24' }}>+{timeBonus}</strong>
  <div style={{ fontSize:'20px', fontWeight:'700', color: rating.color }}>{rating.label}</div>
</div>

{/* Section breakdown row */}
<div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'12px 16px', background:'#1f2937', borderRadius:'10px' }}>
  <span>{s.label}</span>
  {/* Colour-coded progress bar */}
  <div style={{ width:'120px', height:'8px', background:'#e2e8f0', borderRadius:'99px' }}>
    <div style={{ width:`${pct * 100}%`, height:'100%',
      background: pct >= 0.75 ? '#16a34a' : pct >= 0.5 ? '#d97706' : '#dc2626',
      transition: 'width 0.4s' }} />
  </div>
  <span style={{ color: pct >= 0.75 ? '#10b981' : '#f87171' }}>{pts} / {max}</span>
</div>
```

---

## 7. About Page — `src/features/about/About.jsx`

**Design:** Same ambient blob as the Hero section. Content is divided into four glassmorphism cards on a `slate-900` base. Cards use `ring-1 ring-slate-800/80 backdrop-blur shadow-xl`. The proponent photos have an absolute blurred gradient glow ring behind the `<img>` (`-inset-1` positioned, `blur-lg`).

```jsx
{/* Ambient blob — reuses same clip-path as HeroSection */}
<div className="absolute inset-x-0 top-[-10rem] -z-10 blur-3xl">
  <div className="bg-gradient-to-tr from-[#36d7b7] to-[#1a2a6c] opacity-30 rotate-[30deg]"
       style={{ clipPath: 'polygon(74.1% 44.1%, ...)' }} />
</div>

{/* University header card — glassmorphism */}
<section className="rounded-3xl bg-slate-900/60 p-8 ring-1 ring-slate-800/80
                    backdrop-blur shadow-2xl">
  {/* Logo in teal-ring circle */}
  <div className="h-24 w-24 rounded-full bg-slate-800
                  ring-2 ring-teal-500/60 shadow-lg shadow-teal-500/20 overflow-hidden">
    <img src={universityLogo} className="h-20 w-20 object-contain" />
  </div>
</section>

{/* Proponent avatar glow */}
<div className="relative">
  {/* Blurred gradient ring behind photo */}
  <div className="absolute -inset-1 rounded-full
                  bg-gradient-to-tr from-teal-500 to-cyan-500 opacity-40 blur-lg" />
  <img className="relative h-32 w-32 rounded-full border-4 border-slate-900 object-cover shadow-xl" />
</div>

{/* Section divider — gradient fade line */}
<span className="h-px flex-1 bg-gradient-to-r from-teal-500/60 to-transparent" />

{/* Thesis title card */}
<section className="rounded-2xl bg-slate-900/80 p-8 ring-1 ring-slate-800/80 shadow-xl">
  <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-400">
    Thesis Title
  </h2>
  <p className="text-xl font-semibold italic text-slate-100">"{thesisTitle}"</p>
</section>
```

---

## 8. High-Score Banner — `src/shared/components/HighScoreBanner.jsx`

**Design:** Fixed banner centered at `top: 76px` (just below the 80 px header). Uses an emerald gradient (`#064e3b → #065f46`) with a `1px solid #10b981` border and a `rgba(16,185,129,0.3)` box shadow for a green glow. Slides in via the `hsSlideIn` keyframe and auto-dismisses after 5 seconds.

```jsx
<div style={{
  position: 'fixed', top: '76px', left: '50%',
  transform: 'translateX(-50%)',          // centered
  background: 'linear-gradient(90deg, #064e3b 0%, #065f46 100%)',
  border: '1px solid #10b981',
  borderRadius: '10px', padding: '9px 20px',
  boxShadow: '0 6px 24px rgba(16,185,129,0.3)',  // green glow
  animation: 'hsSlideIn 0.35s ease',             // defined in App.css
  zIndex: 9999, whiteSpace: 'nowrap',
}}>
  🏆
  <strong style={{ color: '#34d399' }}>{champion.name}</strong> scored{' '}
  <strong style={{ color: '#fbbf24' }}>{champion.finalScore}/{champion.totalPossible}</strong>
  {champion.pct > 0 && <>, beating <strong style={{ color:'#34d399' }}>{champion.pct}%</strong></>}
  <button style={{ color: '#6ee7b7', fontSize: '18px' }}>×</button>
</div>
```

---

## 9. Name Gate Modal — `src/features/assessment/NameGate.jsx`

**Design:** Full-screen fixed overlay with `background: rgba(0,0,0,0.72)` and `backdropFilter: blur(4px)`. The modal card is dark (`#111827`) with a `border-radius: 18px` and a heavy `box-shadow`. The close button is positioned absolutely top-right as a bare `✕` icon. The submit button uses a `linear-gradient(90deg, #0d9488, #0891b2)` teal-to-cyan fill matching the site's primary palette.

```jsx
{/* Overlay — blurred backdrop */}
<div style={{
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.72)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
}}>
  {/* Modal card */}
  <div style={{
    background: '#111827',
    border: '1px solid #374151',
    borderRadius: '18px',
    padding: '40px 36px',
    maxWidth: '400px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
    position: 'relative',
  }}>
    {/* Close button — top-right absolute */}
    <button style={{
      position: 'absolute', top: '14px', right: '16px',
      background: 'none', border: 'none',
      color: '#6b7280', fontSize: '20px', cursor: 'pointer',
    }}>✕</button>

    {/* Teal-to-cyan submit button */}
    <button style={{
      background: 'linear-gradient(90deg, #0d9488, #0891b2)',
      color: '#fff', width: '100%',
      borderRadius: '9px', fontWeight: '700',
      padding: '13px',
    }}>
      Start Assessment →
    </button>
  </div>
</div>
```

---

*RadTech3D — Visual & Design Summary generated April 2026*
