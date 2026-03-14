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

**RadTech3D** is an interactive web-based 3D learning platform designed to teach radiologic technology students the principles and techniques of lateral cervicothoracic spine positioning. It replaces static textbook diagrams with a hands-on virtual lab where students can manipulate a realistic 3D human model, position radiographic equipment, compute exposure factors, and view simulated radiographic results.

### 1.1 Problem Statement

Radiologic technology interns face significant challenges mastering lateral cervicothoracic spine imaging due to:

- The cervicothoracic junction (C7–T1) is obscured by dense shoulder anatomy.
- Positioning techniques (Swimmer's View / Twinning Method and Pawlow Method) require precise spatial understanding that is difficult to convey through 2D diagrams.
- Limited hands-on lab time before clinical rotations.

### 1.2 Proposed Solution

RadTech3D provides an immersive, risk-free virtual environment where students can:

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
| User selects Theory tab | Load technical factors content (kVp, mAs, distance formulas) | Formatted theory cards |
| User selects Practice tab | Load question set (15 problems) | Question card with input area |
| User writes answer and clicks "Show Solution" | Display step-by-step solution | Solution steps + correct answer |
| User navigates questions (Next/Previous) | Cycle through question bank, reset solution visibility | New question displayed |
| User selects Recap tab | Load assessment & technical recap points | Summary cards + formula reference |

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
| **Student** | Primary user — a radiologic technology intern learning positioning techniques |
| **System** | The RadTech3D web application |

### 3.2 Use Case List

| UC# | Use Case | Actor | Priority |
|-----|----------|-------|----------|
| UC-01 | Navigate between pages | Student | High |
| UC-02 | Select a lesson | Student | High |
| UC-03 | View anatomy flashcards | Student | Medium |
| UC-04 | Rotate 3D model | Student | High |
| UC-05 | Position radiographic equipment | Student | High |
| UC-06 | Control head tilt and turn | Student | Medium |
| UC-07 | Complete positioning simulation | Student | High |
| UC-08 | Enter body thickness | Student | High |
| UC-09 | View radiographic result | Student | High |
| UC-10 | Reset simulation | Student | Medium |
| UC-11 | Study theory content | Student | Medium |
| UC-12 | Practice calculation problems | Student | Medium |
| UC-13 | View assessment recap | Student | Low |
| UC-14 | View About/project info | Student | Low |

### 3.3 Detailed Use Case Descriptions

#### UC-01: Navigate Between Pages

| Field | Description |
|-------|-------------|
| **Primary Actor** | Student |
| **Precondition** | Application is loaded |
| **Main Flow** | 1. Student clicks a navigation link (Home, Model Viewer, Assessment, About) in the header. 2. System stores current page in sessionStorage. 3. System renders the corresponding page content. |
| **Postcondition** | Selected page is displayed; state persists on refresh. |
| **Alternative Flow** | On page refresh, the system restores the last visited page from sessionStorage. On tab close, sessionStorage is cleared (returns to Home on next visit). |

#### UC-02: Select a Lesson

| Field | Description |
|-------|-------------|
| **Primary Actor** | Student |
| **Precondition** | Student is on the Model Viewer page |
| **Main Flow** | 1. Student clicks a lesson category from the Lesson Dashboard. 2. System resets any previous lesson state. 3. System determines lesson type (Twinning or Pawlow). 4. System loads appropriate equipment and configures model posture. 5. Camera animates to an overview position. |
| **Postcondition** | 3D scene displays model with correct posture and equipment. Control tray appears. |

#### UC-05: Position Radiographic Equipment

| Field | Description |
|-------|-------------|
| **Primary Actor** | Student |
| **Precondition** | A lesson is selected and equipment is visible |
| **Main Flow** | 1. Student opens the Equipment panel from the Control Tray. 2. Student presses Up/Down buttons to adjust cassette or vertical bucky height. 3. System applies Z-offset to the selected equipment's 3D position. 4. For Pawlow Method, student can also adjust Vertical B's horizontal (Left/Right) offset. |
| **Postcondition** | Equipment is repositioned in the 3D scene at the student's chosen coordinates. |
| **Extension** | Long-press on buttons triggers continuous adjustment (300ms delay, then 100ms intervals). |

#### UC-07: Complete Positioning Simulation

| Field | Description |
|-------|-------------|
| **Primary Actor** | Student |
| **Precondition** | Equipment is positioned, lesson is active |
| **Main Flow** | 1. Student clicks "Done Positioning". 2. System shows body thickness input panel. 3. Student enters thickness (15–35 cm). 4. Student clicks "Calculate & Show Results". 5. System validates equipment coordinates are within cervicothoracic range. 6. System calculates optimal kVp and mAs. 7. System selects radiographic result image based on model rotation. 8. System displays post-exposure results panel. |
| **Alternative Flow** | If positioning is invalid, system shows an alert with required coordinate ranges and current values. Student must readjust and retry. |
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
| **Assessment - Theory** | Educational content on kVp, mAs, and distance formulas | Implemented | AssessmentContent |
| **Assessment - Practice** | 15 calculation problems with step-by-step solutions | Implemented | AssessmentContent |
| **Assessment - Recap** | Summary cards and quick-reference formula grid | Implemented | AssessmentContent |
| **Page Persistence** | SessionStorage-based page state that survives refresh but clears on tab close | Implemented | NavigationManager |
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
│   │       └── Icon.jsx          # Centralized SVG icon renderer
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
│   │   │   ├── AssessmentContent.jsx  # Theory, Practice (15 problems), Recap
│   │   │   └── AssessmentContent.css  # Assessment-specific styles
│   │   │
│   │   └── about/
│   │       └── About.jsx             # University, thesis, proponents info
│   │
│   ├── utils/
│   │   └── navigationManager.js       # SessionStorage page persistence
│   │
│   ├── App.jsx          # Root component with page routing
│   ├── App.css          # Global styles
│   └── main.jsx         # Entry point (React Router setup)
│
├── index.html
├── package.json
├── vite.config.js
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
│   ├── [assessment] → <AssessmentContent>
│   │                    ├── [Theory Tab]
│   │                    ├── [Practice Tab] (15 questions)
│   │                    └── [Recap Tab]
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

### 13.1 Structure

The Assessment module (`AssessmentContent.jsx`) is organized into three tabs:

| Tab | Content | Item Count |
|-----|---------|------------|
| **Theory** | Technical factors: kVp, mAs, Distance & Density | 3 topic cards |
| **Practice** | Calculation and word problems | 15 questions |
| **Recap** | Key points summary + formula quick reference | 2 recap cards + 4 formulas |

### 13.2 Question Categories

| Set | Questions | Type | Topic |
|-----|-----------|------|-------|
| Set 1 | Q1–Q3 | Calculation | Basic kVp calculations |
| Set 2 | Q4–Q6 | Calculation | mAs calculations |
| Set 3 | Q7–Q9 | Calculation | Distance and grid calculations |
| Set 4 | Q10–Q12 | Word Problem | Complex clinical scenarios |
| Set 5 | Q13–Q15 | Word Problem | Advanced clinical scenarios |

### 13.3 Key Formulas Covered

| Formula | Expression |
|---------|-----------|
| **kVp** | body thickness (cm) × 2 + 40 |
| **mAs** | base mAs × 2^(segments of 5 cm) |
| **Distance** | mAs ∝ distance² |
| **15% Rule** | 15% kVp increase ≈ 2× mAs |

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

### 15.1 Build Command

```bash
npm run build      # Vite production build → dist/
npm run dev        # Development server with HMR
npm run preview    # Preview production build locally
```

### 15.2 Deployment Target

The project is configured for **Vercel** deployment via `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 15.3 Repository

- **GitHub:** `github.com/janreidev-web/radtech`
- **Branch:** `main`

---

## 16. Future Enhancements

| # | Enhancement | Description |
|---|-------------|-------------|
| 1 | **Additional Positioning Views** | Add AP, oblique, and odontoid views beyond lateral cervicothoracic |
| 2 | **Auto-Exposure Control (AEC)** | Simulate automatic exposure control for advanced scenarios |
| 3 | **Scoring System** | Track student performance across assessment attempts |
| 4 | **More Flashcard Lessons** | Expand anatomy coverage to full spine, extremities, and chest |
| 5 | **Visual Guide System** | Implement `triggerVisualGuide` in LessonAnimationContext for on-model annotations |
| 6 | **Central Ray Visualization** | Render the X-ray beam path in 3D to show angulation and centering |
| 7 | **Multi-Language Support** | Add Filipino/Tagalog translations for wider accessibility |
| 8 | **Code Splitting** | Use dynamic `import()` to split the 3.6 MB bundle into smaller chunks |
| 9 | **User Accounts** | Add authentication for progress tracking and instructor dashboards |
| 10 | **Haptic Feedback** | Add vibration feedback for mobile equipment positioning |

---

*Document generated for RadTech3D v0.0.0 — March 2026*
