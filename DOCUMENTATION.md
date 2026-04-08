# RadTech3D — Project Documentation

> **Thesis Title:** *Challenges and Positioning Techniques in Performing Lateral Cervicothoracic Spine Among Bachelor of Science in Radiologic Technology-IV Interns*
>
> **Institution:** Southern Luzon State University (SLSU), Lucban, Quezon, Philippines
>
> **College:** College of Allied Medicine — BS Radiologic Technology
>
> **Proponents:** Patricia Nicole J. Oabel, Crizha Jane P. de Veluz
>
> **Adviser:** Dr. Manuel P. Delos Santos

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Input–Process–Output (IPO) Model](#2-inputprocessoutput-ipo-model)
3. [Use Case Diagrams & Descriptions](#3-use-case-diagrams--descriptions)
4. [Feature Analysis](#4-feature-analysis)
5. [System Architecture](#5-system-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Project Structure](#7-project-structure)
8. [Component Hierarchy](#8-component-hierarchy)
9. [Data Flow](#9-data-flow)
10. [State Management](#10-state-management)
11. [3D Model & Animation System](#11-3d-model--animation-system)
12. [Simulation Workflow](#12-simulation-workflow)
13. [Assessment Module](#13-assessment-module)
14. [Responsive Design Strategy](#14-responsive-design-strategy)
15. [Deployment & Build](#15-deployment--build)
16. [Future Enhancements](#16-future-enhancements)

---

## 1. Project Overview

**RadTech3D** is an interactive web-based 3D learning platform designed to teach radiologic technology Radiologic Technologists the principles and techniques of lateral cervicothoracic spine positioning. It replaces static textbook diagrams with a hands-on virtual lab where Radiologic Technologists can manipulate a realistic 3D human model, position radiographic equipment, compute exposure factors, and view simulated radiographic results.

### 1.1 Problem Statement

Radiologic technologist face significant challenges mastering lateral cervicothoracic spine imaging due to:

- The cervicothoracic junction (C7–T1) is obscured by dense shoulder anatomy.
- Positioning techniques (Swimmer's View / Twinning Method and Pawlow Method) require precise spatial understanding that is difficult to convey through 2D diagrams.
- Limited hands-on lab time before clinical rotations.

### 1.2 Proposed Solution

RadTech3D provides an immersive, risk-free virtual environment where Radiologic Technologist can:

- Interact with a photorealistic 3D human body model.
- Practice both the **Twinning Method** (standing/upright) and **Pawlow Method** (recumbent/lying down).
- Position virtual radiographic equipment (cassette, vertical bucky stands, X-ray table).
- Control head tilt/turn and arm positioning.
- Compute exposure factors (kVp, mAs) based on patient body thickness.
- View simulated radiographic result images.
- Study anatomy through interactive flashcard lessons.
- Test knowledge through a comprehensive assessment module.

### 1.3 Objectives

| # | Objective |
|---|-----------|
| 1 | Develop a 3D interactive model viewer for cervicothoracic spine positioning |
| 2 | Implement two positioning methods: Twinning (standing) and Pawlow (recumbent) |
| 3 | Create an equipment positioning system with cassette and vertical bucky stands |
| 4 | Build an exposure calculation engine using the 15% rule |
| 5 | Provide anatomy flashcard lessons with animated camera navigation |
| 6 | Develop an assessment module for kVp/mAs computation practice |
| 7 | Ensure mobile-responsive design for accessibility |

---

## 2. Input–Process–Output (IPO) Model

### 2.1 High-Level IPO

```
┌─────────────────────┐     ┌──────────────────────────────┐     ┌─────────────────────────┐
│       INPUT          │     │          PROCESS             │     │        OUTPUT            │
│                      │     │                              │     │                          │
│ • Lesson selection   │────▶│ • Load 3D model & equipment  │────▶│ • 3D scene rendering     │
│ • Model rotation     │     │ • Compute body rotation      │     │ • Equipment visualization │
│ • Equipment offsets  │     │ • Apply equipment offsets     │     │ • Positioning feedback    │
│ • Head tilt/turn     │     │ • Animate head/camera        │     │ • Animated camera views   │
│ • Body thickness     │     │ • Calculate kVp & mAs        │     │ • Exposure factor results │
│ • Navigation clicks  │     │ • Validate positioning       │     │ • Radiographic images     │
│ • Assessment answers │     │ • Evaluate answers           │     │ • Solutions & feedback    │
└─────────────────────┘     └──────────────────────────────┘     └─────────────────────────┘
```

### 2.2 Detailed IPO per Module

#### 2.2.1 Model Viewer Module

| Input | Process | Output |
|-------|---------|--------|
| User selects lesson (Twinning or Pawlow) | Load appropriate equipment, set arm position, toggle lying/standing | 3D scene with model + equipment |
| User rotates model (Front/Side-Right/Side-Left/Back) | Apply Y-axis rotation to 3D body mesh | Rotated model view |
| User adjusts equipment height (Up/Down buttons) | Increment/decrement Z-offset on cassette or vertical bucky | Equipment repositioned in 3D scene |
| User adjusts head (Tilt Up/Down, Turn Left/Right) | Apply weighted rotation to head and neck bones | Anatomically correct head movement |
| User clicks "Done Positioning" | Transition to thickness-input step | Body thickness input panel |
| User enters body thickness (15–35 cm) | Validate range → validate equipment coordinates → calculate kVp/mAs using 15% rule | Exposure results + radiographic image |
| User clicks "Start New Positioning" | Full state reset (equipment, camera, model, calculations) | Clean initial state |

#### 2.2.2 Assessment Module

| Input | Process | Output |
|-------|---------|--------|
| User enters name in NameGate | Validate, save to sessionStorage | Assessment sections unlocked |
| User selects section tab | Start independent 10-min timer if not yet started | Timer countdown + question UI rendered |
| User selects MC / T/F / Matching answer | Store answer in state | Answer highlighted |
| User drags label onto diagram zone | Update dragAnswers map | Label placed on zone |
| User submits section | Record time used, calculate weighted section score | Score feedback displayed |
| User opens Results tab | Auto-POST score to `/api/scores`, GET leaderboard | Score breakdown + live leaderboard |
| User clicks Exit & Play Again | Remove all session keys, navigate to Home | NameGate shown on next assessment visit |

#### 2.2.3 Flashcard Module

| Input | Process | Output |
|-------|---------|--------|
| User selects Introduction lesson | Load flashcard data, trigger camera animation | Flashcard panel + anatomy pointer overlay |
| User navigates cards (Next/Previous/dots) | Update card index, animate camera to preset position | New card content + camera reposition |
| User completes all cards | Reset model and close flashcard viewer | Return to lesson dashboard |

---

## 3. Use Case Diagrams & Descriptions

### 3.1 Actors

| Actor | Description |
|-------|-------------|
| **Radiologic Technologist** | Primary user — a radiologic technology intern learning positioning techniques |
| **System** | The RadTech3D web application |

### 3.2 Use Case List

| UC# | Use Case | Actor | Priority |
|-----|----------|-------|----------|
| UC-01 | Navigate between pages | Radiologic Technologist | High |
| UC-02 | Select a lesson | Radiologic Technologist | High |
| UC-03 | View anatomy flashcards | Radiologic Technologist | Medium |
| UC-04 | Rotate 3D model | Radiologic Technologist | High |
| UC-05 | Position radiographic equipment | Radiologic Technologist | High |
| UC-06 | Control head tilt and turn | Radiologic Technologist | Medium |
| UC-07 | Complete positioning simulation | Radiologic Technologist | High |
| UC-08 | Enter body thickness | Radiologic Technologist | High |
| UC-09 | View radiographic result | Radiologic Technologist | High |
| UC-10 | Reset simulation | Radiologic Technologist | Medium |
| UC-11 | Study theory content | Radiologic Technologist | Medium |
| UC-12 | Complete assessment sections | Radiologic Technologist | High |
| UC-13 | View leaderboard results | Radiologic Technologist | Medium |
| UC-14 | View About/project info | Radiologic Technologist | Low |

### 3.3 Detailed Use Case Descriptions

#### UC-01: Navigate Between Pages

| Field | Description |
|-------|-------------|
| **Primary Actor** | Radiologic Technologist |
| **Precondition** | Application is loaded |
| **Main Flow** | 1. Radiologic Technologist clicks a navigation link (Home, Model Viewer, Assessment, About) in the header. 2. System stores current page in sessionStorage. 3. System renders the corresponding page content. |
| **Postcondition** | Selected page is displayed; state persists on refresh. |
| **Alternative Flow** | On page refresh, the system restores the last visited page from sessionStorage. On tab close, sessionStorage is cleared (returns to Home on next visit). |

#### UC-02: Select a Lesson

| Field | Description |
|-------|-------------|
| **Primary Actor** | Radiologic Technologist |
| **Precondition** | Radiologic Technologist is on the Model Viewer page |
| **Main Flow** | 1. Radiologic Technologist clicks a lesson category from the Lesson Dashboard. 2. System resets any previous lesson state. 3. System determines lesson type (Twinning or Pawlow). 4. System loads appropriate equipment and configures model posture. 5. Camera animates to an overview position. |
| **Postcondition** | 3D scene displays model with correct posture and equipment. Control tray appears. |

#### UC-05: Position Radiographic Equipment

| Field | Description |
|-------|-------------|
| **Primary Actor** | Radiologic Technologist |
| **Precondition** | A lesson is selected and equipment is visible |
| **Main Flow** | 1. Radiologic Technologist opens the Equipment panel from the Control Tray. 2. Radiologic Technologist presses Up/Down buttons to adjust cassette or vertical bucky height. 3. System applies Z-offset to the selected equipment's 3D position. 4. For Pawlow Method, Radiologic Technologist can also adjust Vertical B's horizontal (Left/Right) offset. |
| **Postcondition** | Equipment is repositioned in the 3D scene at the Radiologic Technologist's chosen coordinates. |
| **Extension** | Long-press on buttons triggers continuous adjustment (300ms delay, then 100ms intervals). |

#### UC-07: Complete Positioning Simulation

| Field | Description |
|-------|-------------|
| **Primary Actor** | Radiologic Technologist |
| **Precondition** | Equipment is positioned, lesson is active |
| **Main Flow** | 1. Radiologic Technologist clicks "Done Positioning". 2. System shows body thickness input panel. 3. Radiologic Technologist enters thickness (15–35 cm). 4. Radiologic Technologist clicks "Calculate & Show Results". 5. System validates equipment coordinates are within cervicothoracic range. 6. System calculates optimal kVp and mAs. 7. System selects radiographic result image based on model rotation. 8. System displays post-exposure results panel. |
| **Alternative Flow** | If positioning is invalid, system shows an alert with required coordinate ranges and current values. Radiologic Technologist must readjust and retry. |
| **Postcondition** | Radiographic result image and calculated exposure factors are displayed. |

---

## 4. Feature Analysis

### 4.1 Feature Matrix

| Feature | Description | Status | Module |
|---------|-------------|--------|--------|
| **3D Body Model** | GLB-based photorealistic human model with bone hierarchy | Implemented | ModelViewer |
| **Arm Positioning** | Three arm modes: default, twinning (slightly closer), closed (crossed) | Implemented | Body.jsx |
| **Model Rotation** | Four rotations: Front, Side-Right, Side-Left, Back | Implemented | ModelRotationControls |
| **Lying Down Mode** | Model transitions from standing to recumbent for Pawlow method | Implemented | Body.jsx |
| **X-Ray Table** | Procedurally generated 3D table with floating animation | Implemented | XRayTable3D |
| **Cassette Model** | GLB cassette with adjustable Z-axis height | Implemented | Cassette.jsx |
| **Vertical Bucky A** | GLB vertical stand for Twinning method with height adjustment | Implemented | Vertical.jsx |
| **Vertical Bucky B** | GLB vertical stand for Pawlow method with height + horizontal adjustment | Implemented | Vertical.jsx |
| **Head Tilt/Turn** | Degree-by-degree head rotation with weighted neck chain IK | Implemented | HeadController + HeadAnimationController |
| **Camera Animation** | Smooth ease-in-out camera transitions between preset viewpoints | Implemented | CameraController |
| **Orbit Controls** | Free camera rotation, pan, zoom with damping | Implemented | OrbitControls (drei) |
| **Lesson Dashboard** | Accordion-style lesson selector with one-click activation | Implemented | LessonDashboard |
| **Flashcard Viewer** | Side-panel flashcard system with progress bar and keyboard navigation | Implemented | FlashcardViewer |
| **Anatomy Pointer** | SVG overlay with animated arrows pointing from flashcard to 3D anatomy | Implemented | AnatomyPointer |
| **Equipment Controls** | Up/Down/Left/Right buttons with long-press continuous adjustment | Implemented | EquipmentControls |
| **Control Tray** | Toolbar with toggle buttons for Model Rotation, Equipment, Head Control, Done Positioning | Implemented | ControlTray |
| **Positioning Validation** | Validates equipment Z-coordinates are within cervicothoracic range before showing results | Implemented | ModelLoader |
| **Exposure Calculation** | kVp and mAs calculation using the 15% rule based on body thickness | Implemented | ModelLoader |
| **Radiographic Results** | Displays actual radiographic images based on model rotation (50/50 random for laterals) | Implemented | ModelLoader |
| **Assessment - Multiple Choice** | MC questions on cervicothoracic spine radiography (×1 multiplier) | Implemented | AssessmentContent |
| **Assessment - True or False** | T/F statements with 10-min timer (×1.5 multiplier) | Implemented | AssessmentContent |
| **Assessment - Matching Set A** | Match descriptions to numbered options (×1.5 multiplier) | Implemented | AssessmentContent |
| **Assessment - Matching Set B** | Match descriptions to numbered options (×1.5 multiplier) | Implemented | AssessmentContent |
| **Assessment - Drag & Label** | Drag labels onto anatomy diagram zones (×2 multiplier) | Implemented | AssessmentContent |
| **Assessment - Results** | Auto-submit to MongoDB, leaderboard table, exit button | Implemented | AssessmentContent + scoreService |
| **Name Gate** | Modal requiring player name before assessment; close button returns to Home | Implemented | NameGate |
| **Score API** | Vercel serverless function (GET/POST) for score storage and retrieval | Implemented | api/scores.js |
| **Local Dev Server** | Express server mirroring API for local score development | Implemented | server.cjs |
| **High-Score Banner** | Slide-in champion banner with auto-dismiss and 30-second polling | Implemented | HighScoreBanner |
| **Leaderboard** | Real-time sorted leaderboard with medal icons and player highlight | Implemented | AssessmentContent (Results tab) |
| **Page Persistence** | SessionStorage page, name, and timer start times survive refresh; clears on tab close | Implemented | NavigationManager + App.jsx |
| **Scroll to Top** | Scrolls to page top on every navigation | Implemented | App.jsx |
| **Responsive Design** | Mobile-first responsive layout with breakpoint at 768px | Implemented | useResponsiveFlag |
| **Loading Indicator** | Spinner overlay while 3D model loads | Implemented | LoadingIndicator |

### 4.2 Positioning Methods Comparison

| Aspect | Twinning Method | Pawlow Method |
|--------|----------------|---------------|
| **Patient Position** | Standing (upright) | Recumbent (lying on table) |
| **Model State** | `isLyingDown: false` | `isLyingDown: true` |
| **Arm Position** | Twinning (slightly closer to torso) | Closed (arms crossed) |
| **Equipment** | Cassette + Vertical A | Vertical B only |
| **X-Ray Table** | Hidden | Visible |
| **Rotation Options** | Front, Side-Right, Side-Left, Back | Front, Back only |
| **Vertical Adjustment** | Height (Up/Down) only | Height (Up/Down) + Horizontal (Left/Right) |

### 4.3 Exposure Calculation Algorithm

```
Base Parameters:
  baseKvp = 70 (for average 25 cm patient)
  baseMas = 10

Calculation:
  thicknessDifference = bodyThickness - 25
  optimalKvp = baseKvp + (thicknessDifference × 2)
  optimalMas = baseMas + (thicknessDifference × 0.5)

Validation Tolerances:
  kVp: ±10% of optimal
  mAs: ±20% of optimal

Example (bodyThickness = 30 cm):
  thicknessDifference = 30 - 25 = 5
  optimalKvp = 70 + (5 × 2) = 80 kVp
  optimalMas = 10 + (5 × 0.5) = 12.5 → 13 mAs
```

### 4.4 Equipment Coordinate Validation Ranges

| Equipment | Method | Valid Z Range | Base Z Coordinate |
|-----------|--------|---------------|-------------------|
| Cassette | Twinning | 85–115 | Z = 4 |
| Vertical A | Twinning | 520–580 | Z = 531.57 |
| Vertical B | Pawlow | 470–500 | Z = 484.72 |

---

## 5. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────┐  │
│  │  Home    │  │ Model Viewer │  │ Assessment │  │   About   │  │
│  │  Page    │  │    Page      │  │    Page    │  │   Page    │  │
│  └──────────┘  └──────┬───────┘  └────────────┘  └───────────┘  │
│                       │                                          │
│         ┌─────────────┼──────────────────┐                       │
│         ▼             ▼                  ▼                        │
│  ┌─────────────┐ ┌──────────┐  ┌──────────────────┐             │
│  │   Lesson    │ │  3D      │  │  UI Control      │             │
│  │   Handler   │ │  Scene   │  │  Layer            │             │
│  │  (Context)  │ │ (Canvas) │  │ (Tray+Panels)    │             │
│  └─────────────┘ └──────────┘  └──────────────────┘             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                        3D ENGINE LAYER                            │
│                                                                  │
│  React Three Fiber (R3F) ← three.js ← WebGL                     │
│  ┌────────────┐ ┌──────────────┐ ┌────────────────────────────┐  │
│  │ Body.jsx   │ │ Cassette.jsx │ │ CameraController.jsx       │  │
│  │ (GLB model)│ │ Vertical.jsx │ │ HeadAnimationController.jsx│  │
│  │            │ │ XRayTable3D  │ │ OrbitControls (drei)       │  │
│  └────────────┘ └──────────────┘ └────────────────────────────┘  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                        STATE LAYER                                │
│                                                                  │
│  React useState / useCallback / useRef / Context API              │
│  ┌───────────────────┐  ┌──────────────────────────────────┐     │
│  │ NavigationManager │  │ LessonAnimationContext (Provider) │     │
│  │ (sessionStorage)  │  │ (Camera + Visual animation bus)  │     │
│  └───────────────────┘  └──────────────────────────────────┘     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 19.1.1 | UI component framework |
| **Build Tool** | Vite (rolldown-vite) | 7.1.14 | Fast development server & bundler |
| **3D Engine** | Three.js | 0.180.0 | WebGL 3D rendering |
| **3D React Bindings** | @react-three/fiber | 9.3.0 | React renderer for Three.js |
| **3D Helpers** | @react-three/drei | 10.7.6 | OrbitControls, useGLTF, etc. |
| **Routing** | React Router DOM | 6.30.1 | Client-side routing |
| **Styling** | Tailwind CSS | 4.1.14 | Utility-first CSS framework |
| **Icons** | Lucide React | 0.548.0 | SVG icon library |
| **Animation** | GSAP | 3.13.0 | Animation library (available) |
| **Lottie** | lottie-react | 2.4.1 | JSON animation player |
| **Linting** | ESLint | 9.36.0 | Code quality |
| **Deployment** | Vercel | — | Hosting platform |

---

## 7. Project Structure

```
radtech/
├── public/
│   ├── Images/
│   │   ├── Result/              # Radiographic result images
│   │   │   ├── Front1.jpg       # AP (front) cervicothoracic view
│   │   │   ├── Back1.png        # PA (back) view
│   │   │   ├── Right1.png       # Lateral view (variant B)
│   │   │   ├── Right2.png       # Lateral view (variant A)
│   │   │   ├── Left1.png        # Left lateral (unused in current logic)
│   │   │   └── Left2.png        # Left lateral (unused in current logic)
│   │   ├── chriza.jpg           # Proponent photo
│   │   └── pat.jpg              # Proponent photo
│   ├── Model/
│   │   ├── base.glb             # Human body 3D model
│   │   ├── cassette.glb         # X-ray cassette model
│   │   ├── verticalA.glb        # Vertical bucky A model
│   │   └── verticalB.glb        # Vertical bucky B model
│   └── logo.jpg
│
├── src/
│   ├── assets/
│   │   └── Animations/          # Lottie JSON animation files
│   │
│   ├── shared/
│   │   └── components/
│   │       ├── Icon.jsx          # Centralized SVG icon renderer
│   │       └── HighScoreBanner.jsx # Champion banner (slide-in, auto-dismiss, 30s poll)
│   │
│   ├── layout/
│   │   ├── Header.jsx            # Sticky navigation header
│   │   └── Footer.jsx            # Site footer with social links
│   │
│   ├── features/
│   │   ├── home/
│   │   │   ├── HomeContent.jsx        # Home page wrapper
│   │   │   ├── components/
│   │   │   │   ├── HeroSection.jsx    # Landing hero with Lottie animation
│   │   │   │   ├── FeatureShowcase.jsx # Feature listing section
│   │   │   │   ├── FeatureCard.jsx    # Individual feature card
│   │   │   │   └── CTASection.jsx     # Call-to-action section
│   │   │   └── config/
│   │   │       └── featureList.js     # Feature data (title, desc, animation)
│   │   │
│   │   ├── model-viewer/
│   │   │   ├── ModelLoader.jsx        # ★ Main orchestrator (900+ lines)
│   │   │   ├── hooks/
│   │   │   │   ├── useResponsiveFlag.js   # Mobile breakpoint hook
│   │   │   │   ├── useCameraAnimation.js  # Camera animation state hook
│   │   │   │   └── useHeadControls.js     # Head rotation state hook
│   │   │   ├── ModelHelper/
│   │   │   │   ├── Body.jsx               # 3D body model (GLB + arm/rotation logic)
│   │   │   │   ├── Cassette.jsx           # 3D cassette with Z-offset
│   │   │   │   ├── Vertical.jsx           # 3D vertical bucky (A or B variant)
│   │   │   │   ├── XRayTable3D.jsx        # Procedural X-ray table
│   │   │   │   ├── CameraController.jsx   # Smooth camera animation (lerp + easing)
│   │   │   │   ├── HeadAnimationController.jsx # Weighted head/neck bone IK
│   │   │   │   ├── HeadController.jsx     # Head control UI (tilt/turn buttons)
│   │   │   │   ├── EquipmentControls.jsx  # Equipment adjust UI (long-press)
│   │   │   │   ├── ModelRotationControls.jsx # Rotation selector UI
│   │   │   │   ├── ControlTray.jsx        # Top-right toolbar
│   │   │   │   ├── LoadingIndicator.jsx   # Spinner overlay
│   │   │   │   └── CursorZoomController.jsx # (Available for cursor-based zoom)
│   │   │   └── LessonHandler/
│   │   │       ├── LessonAnimationContext.jsx  # React Context for animation bus
│   │   │       ├── AnimationHandlerRegistrar.jsx # Connects handlers to context
│   │   │       ├── LessonDashboard.jsx    # Lesson category selector UI
│   │   │       ├── FlashcardViewer.jsx    # Side-panel flashcard system
│   │   │       ├── AnatomyPointer.jsx     # SVG arrow overlay to 3D model
│   │   │       └── cameraPresets.js       # Named camera position configs
│   │   │
│   │   ├── assessment/
│   │   │   ├── AssessmentContent.jsx  # MC, T/F, Matching A&B, Drag&Label, Results
│   │   │   ├── AssessmentContent.css  # Assessment-specific styles
│   │   │   └── NameGate.jsx           # Name-entry modal (dismissable)
│   │   │
│   │   └── about/
│   │       └── About.jsx             # University, thesis, proponents info
│   │
│   ├── services/
│   │   └── scoreService.js            # API client: submitScore, getChampion, getLeaderboard
│   │
│   ├── utils/
│   │   └── navigationManager.js       # SessionStorage page persistence
│   │
│   ├── App.jsx          # Root component (NameGate, HighScoreBanner, page routing)
│   ├── App.css          # Global styles (+ hsSlideIn keyframe)
│   └── main.jsx         # Entry point
│
├── api/
│   └── scores.js        # Vercel serverless function (GET/POST scores → MongoDB)
│
├── server.cjs           # Local Express API server (mirrors api/scores.js)
├── .env.example         # Environment variable template
├── index.html
├── package.json
├── vite.config.js       # Vite config with /api proxy + offline fallback
├── vercel.json
└── eslint.config.js
```

---

## 8. Component Hierarchy

```
<App>
├── <Header onNavClick currentPage />
├── <main>
│   ├── [home]       → <HomeContent onNavigate>
│   │                    ├── <HeroSection onNavigate />
│   │                    ├── <FeatureShowcase>
│   │                    │     └── <FeatureCard /> (×3)
│   │                    └── <CTASection onNavigate />
│   │
│   ├── [model]      → <ModelLoader>
│   │                    └── <LessonAnimationProvider>
│   │                         ├── <Canvas>
│   │                         │   ├── <BodyMap />
│   │                         │   ├── <XRayTable3D />        (conditional)
│   │                         │   ├── <Cassette />           (conditional)
│   │                         │   ├── <Vertical variant="A"/> (conditional)
│   │                         │   ├── <Vertical variant="B"/> (conditional)
│   │                         │   ├── <CameraController />
│   │                         │   ├── <HeadAnimationController />
│   │                         │   └── <OrbitControls />
│   │                         ├── <LessonDashboard />
│   │                         ├── <FlashcardViewer />        (conditional)
│   │                         │     └── <AnatomyPointer />
│   │                         ├── <ControlTray />            (conditional)
│   │                         ├── <EquipmentControls />      (conditional)
│   │                         ├── <HeadController />         (conditional)
│   │                         ├── <ModelRotationControls />  (conditional)
│   │                         ├── <AnimationHandlerRegistrar />
│   │                         ├── [Thickness Input Panel]    (conditional)
│   │                         └── [Post-Exposure Panel]      (conditional)
│   │
│   ├── [assessment] → <NameGate onConfirm onClose />         (if no name in sessionStorage)
│   │                   <AssessmentContent playerName onScoreSubmitted onExit />
│   │                    ├── [Multiple Choice tab]
│   │                    ├── [True or False tab]
│   │                    ├── [Matching Set A tab]
│   │                    ├── [Matching Set B tab]
│   │                    ├── [Drag & Label tab]
│   │                    └── [Results tab → auto-submit + leaderboard]
│   │
│   └── [about]      → <About />
│
└── <Footer />
```

---

## 9. Data Flow

### 9.1 Lesson Selection Flow

```
LessonDashboard
  │
  ├──[Introduction clicked]──▶ onLessonSelected({ mode: "flashcard", ... })
  │                             │
  │                             ├── setShowFlashcards(true)
  │                             ├── setBaseRotation('back')
  │                             └── triggerCameraAnimation(preset)
  │
  ├──[Twinning clicked]──────▶ onLessonSelected({ mode: "practical", categoryTitle: "...Twinning..." })
  │                             │
  │                             ├── setShowCassette(true) + setShowVerticalA(true)
  │                             ├── handleArmPositionChange('twinning')
  │                             └── setIsLyingDown(false)
  │
  └──[Pawlow clicked]────────▶ onLessonSelected({ mode: "practical", categoryTitle: "...Pawlow..." })
                                │
                                ├── setShowXRayTable(true) + setShowVerticalB(true)
                                ├── handleArmPositionChange('closed')
                                └── setIsLyingDown(true)
```

### 9.2 Animation Context Flow

```
ModelLoader
  │
  ├── defines: animationHandlers = { handleCameraAnimation: triggerCameraAnimation }
  │
  ├── <AnimationHandlerRegistrar handlers={animationHandlers} />
  │     │
  │     └── calls: registerHandlers(handlers) on LessonAnimationContext
  │
  └── LessonDashboard / FlashcardViewer
        │
        └── calls: triggerCameraAnimation(action)
              │
              └── context routes to: animationHandlers.handleCameraAnimation(action)
                    │
                    └── useCameraAnimation hook updates: cameraAnimation state
                          │
                          └── <CameraController isActive targetPosition targetLookAt />
                                │
                                └── Animates camera via requestAnimationFrame + lerp
```

---

## 10. State Management

### 10.1 ModelLoader State Variables

| State Variable | Type | Purpose |
|---------------|------|---------|
| `showXRayTable` | boolean | Toggle X-ray table visibility |
| `showCassette` | boolean | Toggle cassette visibility |
| `showVerticalA` | boolean | Toggle Vertical A visibility |
| `showVerticalB` | boolean | Toggle Vertical B visibility |
| `armsClosed` | boolean | Arms crossed state |
| `armPosition` | string | Arm mode: 'default', 'twinning', 'closed' |
| `cassetteOffset` | number | Cassette Z-axis offset |
| `verticalAOffset` | number | Vertical A Z-axis offset |
| `verticalBOffset` | number | Vertical B Z-axis offset |
| `verticalBHorizontalOffset` | number | Vertical B X-axis offset |
| `cassetteBaselineZ` | number\|null | Captured baseline Z for cassette |
| `verticalABaselineZ` | number\|null | Captured baseline Z for Vertical A |
| `verticalBBaselineZ` | number\|null | Captured baseline Z for Vertical B |
| `resetKey` | number | Increment to force equipment remount |
| `isLyingDown` | boolean | Standing vs recumbent posture |
| `isLoading` | boolean | 3D model loading state |
| `baseRotation` | string | Model rotation: 'front', 'side-right', 'side-left', 'back' |
| `hasLessonSelected` | boolean | Whether any lesson is active |
| `showModelRotationPanel` | boolean | Toggle rotation panel |
| `showEquipmentPanel` | boolean | Toggle equipment panel |
| `showHeadControlPanel` | boolean | Toggle head control panel |
| `showFlashcards` | boolean | Toggle flashcard viewer |
| `currentFlashcardData` | object\|null | Active flashcard lesson data |
| `simulationStep` | string | Workflow step: 'positioning', 'thickness-input', 'post-exposure' |
| `bodyThickness` | string\|null | User-entered body thickness |
| `userCalculations` | object | `{ kVp: string, mAs: string }` |

### 10.2 Custom Hooks

| Hook | File | Returns |
|------|------|---------|
| `useResponsiveFlag(768)` | `useResponsiveFlag.js` | `isMobile: boolean` |
| `useCameraAnimation()` | `useCameraAnimation.js` | `{ cameraAnimation, triggerCameraAnimation, handleCameraComplete, resetCameraAnimation }` |
| `useHeadControls()` | `useHeadControls.js` | `{ headControl, updateHeadControl, resetHeadControl }` |

### 10.3 Context: LessonAnimationContext

| Method | Purpose |
|--------|---------|
| `registerHandlers(handlers)` | Register animation handler functions from ModelLoader |
| `triggerCameraAnimation(action)` | Route camera animation requests to registered handler |
| `triggerVisualGuide(guide)` | Route visual guide requests (future use) |

### 10.4 App.jsx Root State

| State Variable | Type | Persisted | Purpose |
|---------------|------|-----------|---------|
| `currentPage` | string | sessionStorage | Active page |
| `assessmentName` | string\|null | sessionStorage | Player name (null = show NameGate) |
| `champion` | object\|null | no | Current top scorer for banner |
| `bannerVisible` | boolean | no | HighScoreBanner visibility |
| `hasRecords` | boolean | no | Whether any score records exist (gates polling) |

### 10.5 AssessmentContent State Variables

| State Variable | Type | Persisted | Purpose |
|---------------|------|-----------|---------|
| `activeSection` | string | no | Current tab: 'mc', 'fill', 'matchA', 'matchB', 'image', 'results' |
| `mcAnswers` | object | no | MC answer map (index → selected option) |
| `mcSubmitted` | boolean | no | Whether MC section is submitted |
| `fillAnswers` | object | no | T/F answer map |
| `fillSubmitted` | boolean | no | Whether T/F section is submitted |
| `matchAAnswers` | object | no | Matching A answer map |
| `matchASubmitted` | boolean | no | Whether Matching A is submitted |
| `matchBAnswers` | object | no | Matching B answer map |
| `matchBSubmitted` | boolean | no | Whether Matching B is submitted |
| `dragAnswers` | object | no | Drag zone answer map (zoneId → labelId) |
| `dragSubmitted` | boolean | no | Whether Drag & Label is submitted |
| `sectionStartTimes` | object | sessionStorage | Timestamp when each section timer started |
| `sectionTimeUsed` | object | sessionStorage | Seconds used per section (recorded on submit) |
| `scoreSubmitted` | boolean | no | Whether score POST has completed |
| `scoreResult` | object\|null | no | API response from score submission |
| `leaderboard` | array | no | Fetched leaderboard entries |

### 10.6 Session Storage Key Summary

| Key | Set by | Cleared by |
|-----|--------|------------|
| `currentPage` | `NavigationManager.savePage()` | Tab close (auto) |
| `assessmentName` | `NameGate` confirm handler | Exit & Play Again |
| `sectionStartTimes` | `AssessmentContent` useEffect | Exit & Play Again |
| `sectionTimeUsed` | `AssessmentContent` useEffect | Exit & Play Again |

---

## 11. 3D Model & Animation System

### 11.1 GLB Models

| Model | File | Key Object | Description |
|-------|------|------------|-------------|
| Human Body | `base.glb` | Scene root | Full human body with bone hierarchy (arms, head, neck) |
| Cassette | `cassette.glb` | `main` | X-ray cassette with adjustable internal Z-position |
| Vertical A | `verticalA.glb` | `main` | Standing vertical bucky for Twinning method |
| Vertical B | `verticalB.glb` | `main` | Recumbent vertical bucky for Pawlow method |

### 11.2 Body Bone Hierarchy (Key Bones)

```
Scene
└── CC_Base_Head          ← Head rotation target
    └── CC_Base_NeckTwist01  ← Primary neck bone (weight: 0.5)
        └── CC_Base_NeckTwist02  ← Secondary neck bone (weight: 0)
└── CC_Base_L_Upperarm    ← Left upper arm
    └── CC_Base_L_Forearm ← Left forearm
└── CC_Base_R_Upperarm    ← Right upper arm
    └── CC_Base_R_Forearm ← Right forearm
```

### 11.3 Head Animation Weighting

The `HeadAnimationController` applies weighted rotation to create natural head movement:

```
Head bone (CC_Base_Head): weight = 0.10
Neck bone 1 (CC_Base_NeckTwist01): weight = 0.50
Neck bone 2 (CC_Base_NeckTwist02): weight = 0.00

Rotation formula per bone:
  rotation.x = initial.x + clampedTilt × weight
  rotation.y = initial.y + clampedTurn × weight

Limits: Tilt ±1.5 rad (~86°), Turn ±1.8 rad (~103°)
```

### 11.4 Camera Animation

The `CameraController` uses `requestAnimationFrame` with an ease-in-out interpolation:

```
Easing function:
  progress < 0.5
    → 2 × progress²
  progress ≥ 0.5
    → 1 - (-2 × progress + 2)² / 2

Position interpolation: THREE.Vector3.lerp(start, target, easedProgress)
LookAt interpolation: THREE.Vector3.lerp(startLookAt, targetLookAt, easedProgress)
```

---

## 12. Simulation Workflow

### 12.1 State Machine

```
                 ┌───────────────────┐
                 │                   │
    ┌───────────▶│   POSITIONING     │◀──────────────────────┐
    │            │                   │                        │
    │            └────────┬──────────┘                        │
    │                     │                                   │
    │          [Done Positioning]                              │
    │                     │                                   │
    │                     ▼                                   │
    │            ┌───────────────────┐                        │
    │            │                   │                        │
    │  [Cancel]  │ THICKNESS-INPUT   │                        │
    │◀───────────│                   │                        │
    │            └────────┬──────────┘                        │
    │                     │                                   │
    │      [Calculate & Show Results]                         │
    │                     │                                   │
    │          ┌──────────┼──────────┐                        │
    │          │ Validate Positioning│                        │
    │          └──────────┼──────────┘                        │
    │                     │                                   │
    │              ┌──────┴──────┐                             │
    │              │  VALID?     │                             │
    │              └──┬──────┬──┘                              │
    │            Yes  │      │ No                              │
    │                 │      └──▶ Alert with required ranges   │
    │                 ▼                                        │
    │        ┌───────────────────┐                             │
    │        │                   │     [Start New Positioning] │
    │        │  POST-EXPOSURE    │─────────────────────────────┘
    │        │                   │
    │        └───────────────────┘
    │
    └── (handleReset from any state)
```

### 12.2 Result Image Selection

| Model Rotation | Image Pool | Selection |
|----------------|------------|-----------|
| `front` | `Front1.jpg` | Deterministic |
| `back` | `Back1.png` | Deterministic |
| `side-right` | `Right1.png`, `Right2.png` | 50/50 random |
| `side-left` | `Right1.png`, `Right2.png` | 50/50 random (same lateral views) |

---

## 13. Assessment Module

### 13.1 Overview

The Assessment page (`AssessmentContent.jsx`) is a scored, timed, multi-section quiz. Before any section is accessible a **Name Gate** (`NameGate.jsx`) modal requires a player name. The name is stored in `sessionStorage` and survives page refresh.

### 13.2 Section Structure

| # | Section ID | Question Type | Score Multiplier | Timer |
|---|-----------|--------------|-----------------|-------|
| 1 | `mc` | Multiple Choice (select one) | ×1 | 10 min |
| 2 | `fill` | True or False | ×1.5 | 10 min |
| 3 | `matchA` | Matching Set A (description → number) | ×1.5 | 10 min |
| 4 | `matchB` | Matching Set B (description → number) | ×1.5 | 10 min |
| 5 | `image` | Drag & Label (drag onto anatomy diagram) | ×2 | 10 min |
| 6 | `results` | Results, leaderboard, exit | — | — |

### 13.3 Timer System

Each section has an independent 10-minute timer (`SECTION_TIME = 600` seconds). Timers start on first visit to that section tab and are stored in `sessionStorage` (`sectionStartTimes`) so they survive page refresh. When a section is submitted, `sectionTimeUsed` records the elapsed time.

```javascript
sectionStartTimes[sectionId] = Date.now()  // set on first tab visit
sectionTimeUsed[sectionId]   = Math.min(600, (Date.now() - start) / 1000)  // on submit
remainingSeconds = Math.max(0, 600 - ((Date.now() - start) / 1000))
```

A `ticker` state increments every second to force timer re-renders.

### 13.4 Scoring Algorithm

```
Constants:
  MC_MULT   = 1
  FILL_MULT = 1.5
  MATC_MULT = 1.5   (both Matching A and B)
  DRAG_MULT = 2
  SECTION_TIME   = 600   (seconds)
  MAX_TIME_BONUS = 40    (points total across all sections)

Weighted raw score:
  rawScore = getMCScore()     × MC_MULT
           + getFillScore()   × FILL_MULT
           + getMatchAScore() × MATC_MULT
           + getMatchBScore() × MATC_MULT
           + getDragScore()   × DRAG_MULT

Time bonus (per section, summed):
  sectionBonus = Math.round((timeRemaining / SECTION_TIME) × (MAX_TIME_BONUS / numSections))
  timeBonus = sum of all section bonuses

Final score:
  finalScore    = rawScore + timeBonus
  totalPossible = (all question maximums × multipliers) + MAX_TIME_BONUS
```

### 13.5 Results & Leaderboard

When `activeSection === 'results'`:

1. `handleSubmitScore()` fires automatically via `useEffect` (once only).
2. POSTs `{ name, rawScore, timeBonus, finalScore, totalPossible, sections }` to `/api/scores`.
3. Fetches leaderboard from `/api/scores` (GET) and stores in `leaderboard` state.
4. Displays section breakdown with weighted pts (e.g. `4.5 / 6`) and colour-coded progress bars.
5. Shows leaderboard table sorted by `finalScore` descending; top 3 get medal icons; current player row highlighted.
6. **Exit & Play Again** button clears `assessmentName`, `sectionStartTimes`, `sectionTimeUsed` from sessionStorage and calls `onExit()` → `App.jsx` navigates to Home.

### 13.6 MongoDB Score Schema

```js
const ScoreSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  rawScore:      Number,
  timeBonus:     Number,
  finalScore:    Number,
  totalPossible: Number,
  sections:      mongoose.Schema.Types.Mixed,
  createdAt:     { type: Date, default: Date.now },
});
```

### 13.7 API Endpoints (`api/scores.js` / `server.cjs`)

| Method | Path | Body / Query | Response |
|--------|------|-------------|----------|
| `POST` | `/api/scores` | `{ name, rawScore, timeBonus, finalScore, totalPossible, sections }` | `{ ok: true, id }` or error |
| `GET` | `/api/scores` | `?top=N` (default 20) | Array of score objects sorted by finalScore desc |

### 13.8 High-Score Banner

`HighScoreBanner.jsx` is rendered in `App.jsx` above the page content:

- Fetched on app mount via `getChampion()` (calls `GET /api/scores?top=1`).
- Polls every **30 seconds** for updates — only starts polling after `hasRecords` is set (i.e., at least one score exists).
- Slides in with `hsSlideIn` CSS animation defined in `App.css`.
- Auto-dismisses after ~4 seconds; has a manual dismiss button.
- Displays: champion name, final score / total possible, and percentage of players beaten.

---

## 14. Responsive Design Strategy

### 14.1 Breakpoint

```
Mobile: window.innerWidth ≤ 768px
Desktop: window.innerWidth > 768px
```

### 14.2 Responsive Adaptations

| Component | Mobile | Desktop |
|-----------|--------|---------|
| **Body scale** | 1.7 | 2.4 |
| **Lesson Dashboard** | Top-center, full width, max 400px, max 40vh | Left-center, 20% width, min 250px |
| **Control Tray** | Wraps buttons | No-wrap row |
| **Equipment positions** | Compact coordinates | Full-spread coordinates |
| **Header nav** | Hamburger menu (slide-down) | Horizontal link bar |
| **Model Rotation** | 2-column grid | 4-column grid |

---

## 15. Deployment & Build

### 15.1 NPM Scripts

```bash
npm run dev        # Vite dev server with HMR (http://localhost:5173)
npm run server     # Local Express API server (http://localhost:5000)
npm run build      # Production build → dist/
npm run preview    # Serve production build locally
npm run lint       # ESLint code quality check
```

### 15.2 Environment Variables

Create a `.env` file (copy from `.env.example`) for local development:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?appName=<app>
```

For production, add `MONGODB_URI` under **Vercel → Project Settings → Environment Variables**.

> **Security:** `.env` is listed in `.gitignore` and must never be committed.

### 15.3 Vite Proxy

`vite.config.js` proxies `/api/*` to `http://localhost:5000` during local development:

```js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    configure: (proxy) => {
      proxy.on('error', (err, req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(null));
      });
    },
  },
}
```

The error handler returns `null` (instead of a 500) when the local server is offline, keeping the frontend functional.

### 15.4 Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

The rewrite rule excludes `/api/` paths so Vercel routes them to `api/scores.js` (serverless function) instead of the SPA.

### 15.5 Repository

- **GitHub:** `github.com/janreidev-web/radtech`
- **Branch:** `main`
- **Auto-deploy:** Push to `main` triggers Vercel deployment.

---

## 16. Future Enhancements

| # | Enhancement | Description |
|---|-------------|-------------|
| 1 | **Additional Positioning Views** | Add AP, oblique, and odontoid views beyond lateral cervicothoracic |
| 2 | **Auto-Exposure Control (AEC)** | Simulate automatic exposure control for advanced scenarios |
| 3 | **Progress Saving** | Save partially completed assessment answers across sessions |
| 4 | **More Flashcard Lessons** | Expand anatomy coverage to full spine, extremities, and chest |
| 5 | **Visual Guide System** | Implement `triggerVisualGuide` in LessonAnimationContext for on-model annotations |
| 6 | **Central Ray Visualization** | Render the X-ray beam path in 3D to show angulation and centering |
| 7 | **Multi-Language Support** | Add Filipino/Tagalog translations for wider accessibility |
| 8 | **Code Splitting** | Use dynamic `import()` to split the 3.6 MB bundle into smaller chunks |
| 9 | **User Accounts** | Add authentication for progress tracking and instructor dashboards |
| 10 | **Haptic Feedback** | Add vibration feedback for mobile equipment positioning |

---

*Document generated for RadTech3D v0.0.0 — April 2026*
