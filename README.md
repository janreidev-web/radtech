<div id="top" align="center">

# RadTech3D

### Interactive 3D Learning Platform for Radiologic Technology

*Challenges and Positioning Techniques in Performing Lateral Cervicothoracic Spine*

<br>

<img alt="last-commit" src="https://img.shields.io/github/last-commit/janreidev-web/radtech?style=flat&logo=git&logoColor=white&color=0080ff">
<img alt="repo-top-language" src="https://img.shields.io/github/languages/top/janreidev-web/radtech?style=flat&color=0080ff">
<img alt="repo-language-count" src="https://img.shields.io/github/languages/count/janreidev-web/radtech?style=flat&color=0080ff">

<br>

<img alt="React" src="https://img.shields.io/badge/React_19-61DAFB.svg?style=flat&logo=React&logoColor=black">
<img alt="Three.js" src="https://img.shields.io/badge/Three.js-000000.svg?style=flat&logo=Three.js&logoColor=white">
<img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white">
<img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4.svg?style=flat&logo=TailwindCSS&logoColor=white">
<img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black">
<img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000.svg?style=flat&logo=Vercel&logoColor=white">
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white">

<br><br>

**Southern Luzon State University** -- College of Allied Medicine<br>
Bachelor of Science in Radiologic Technology<br>
Proponents: Patricia Nicole J. Oabel and Crizha Jane P. de Veluz<br>
Adviser: Dr. Manuel P. Delos Santos

</div>

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Production Build](#production-build)
- [Application Pages](#application-pages)
  - [Home](#home)
  - [3D Model Viewer](#3d-model-viewer)
  - [Assessment](#assessment)
  - [About](#about)
- [3D Model Viewer -- Detailed Breakdown](#3d-model-viewer----detailed-breakdown)
  - [Lesson System](#lesson-system)
  - [Positioning Methods](#positioning-methods)
  - [Equipment System](#equipment-system)
  - [Head Control System](#head-control-system)
  - [Simulation Workflow](#simulation-workflow)
  - [Exposure Calculation](#exposure-calculation)
  - [Radiographic Results](#radiographic-results)
- [Assessment Module -- Detailed Breakdown](#assessment-module----detailed-breakdown)
- [Input-Process-Output Model](#input-process-output-model)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Responsive Design](#responsive-design)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

**RadTech3D** is a web-based interactive 3D learning platform built for radiologic technology students. It replaces static textbook diagrams with an immersive virtual lab where students can manipulate a realistic 3D human body model, position radiographic equipment, compute exposure factors, and view simulated radiographic results -- all from a browser.

The platform focuses specifically on **lateral cervicothoracic spine positioning**, one of the most challenging radiographic procedures for student interns, covering both the **Twinning Method** (standing/upright lateral) and the **Pawlow Method** (recumbent/lying down lateral).

---

## Problem Statement

Radiologic technology interns face significant challenges when learning lateral cervicothoracic spine imaging:

- The **cervicothoracic junction (C7-T1)** is anatomically obscured by dense shoulder structures, making it one of the most difficult regions to image.
- Positioning techniques such as the **Swimmer's View** require precise spatial understanding that 2D diagrams cannot adequately convey.
- Students have **limited hands-on lab time** before entering clinical rotations, leaving a gap between theoretical knowledge and practical competence.

RadTech3D addresses these challenges by providing a risk-free, repeatable, interactive environment for mastering these techniques before stepping into a real clinical setting.

---

## Key Features

**Interactive 3D Model Viewer**
- Photorealistic human body model (GLB format) with a fully articulated bone hierarchy.
- Free orbit camera controls: rotate, pan, and zoom with mouse or touch gestures.
- Four model orientations: Front, Side-Right, Side-Left, and Back views.
- Smooth camera animations with ease-in-out interpolation between viewpoints.

**Two Positioning Methods**
- Twinning Method (standing upright) with cassette and vertical bucky stand A.
- Pawlow Method (recumbent/lying on table) with X-ray table and vertical bucky stand B.
- Accurate arm positioning per method (twinning stance vs. crossed arms).

**Equipment Positioning System**
- 3D cassette, vertical bucky stands (A and B), and X-ray table models.
- Height adjustment for all equipment via Up/Down controls.
- Horizontal adjustment for Vertical B (Pawlow method).
- Long-press support for continuous adjustment (300ms delay, then 100ms intervals).

**Head Control System**
- Degree-by-degree head tilt (up/down) and turn (left/right).
- Weighted inverse kinematics across head and neck bones for anatomically correct movement.
- Live angle readout display.
- Long-press and keyboard support for all controls.

**Positioning Validation and Exposure Calculation**
- Validates that equipment is within the correct cervicothoracic coordinate range before proceeding.
- Computes optimal kVp and mAs based on patient body thickness (15-35 cm range).
- Displays simulated radiographic result images based on model orientation.

**Anatomy Flashcard Lessons**
- Interactive flashcard system with animated camera navigation to anatomical regions.
- SVG anatomy pointer overlay that draws animated arrows from the flashcard panel to the 3D model.
- Keyboard navigation support (arrow keys, Escape).
- Progress bar and dot indicators.

**Assessment Module**
- Theory section covering kVp, mAs, and distance formulas.
- 15 practice calculation problems across 5 difficulty tiers with step-by-step solutions.
- Recap section with key points and a quick-reference formula grid.

**Responsive Design**
- Mobile-first layout with a breakpoint at 768px.
- Adaptive 3D model scaling, panel positioning, and grid layouts.
- Touch-friendly controls for equipment adjustment and head positioning.

**Page State Persistence**
- Current page is stored in sessionStorage and survives browser refresh.
- State is automatically cleared when the tab is closed, returning to Home on next visit.

---

## System Architecture

```
+------------------------------------------------------------------+
|                      PRESENTATION LAYER                          |
|                                                                  |
|  +----------+  +--------------+  +------------+  +-----------+  |
|  |   Home   |  | Model Viewer |  | Assessment |  |   About   |  |
|  +----------+  +------+-------+  +------------+  +-----------+  |
|                       |                                          |
|         +-------------+------------------+                       |
|         v             v                  v                       |
|  +-------------+ +----------+  +------------------+              |
|  |   Lesson    | |   3D     |  |   UI Control     |              |
|  |   Handler   | |  Scene   |  |   Layer           |              |
|  |  (Context)  | | (Canvas) |  | (Tray + Panels)  |              |
|  +-------------+ +----------+  +------------------+              |
|                                                                  |
+------------------------------------------------------------------+
|                      3D ENGINE LAYER                             |
|                                                                  |
|  React Three Fiber <- Three.js <- WebGL                          |
|  +------------+ +--------------+ +----------------------------+  |
|  | Body.jsx   | | Cassette.jsx | | CameraController.jsx       |  |
|  | (GLB model)| | Vertical.jsx | | HeadAnimationController.jsx|  |
|  |            | | XRayTable3D  | | OrbitControls (drei)       |  |
|  +------------+ +--------------+ +----------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
|                      STATE LAYER                                 |
|                                                                  |
|  React useState / useCallback / useRef / Context API             |
|  +-------------------+  +----------------------------------+    |
|  | NavigationManager |  | LessonAnimationContext (Provider) |    |
|  | (sessionStorage)  |  | (Camera + animation event bus)   |    |
|  +-------------------+  +----------------------------------+    |
|                                                                  |
+------------------------------------------------------------------+
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | React | 19.1.1 | UI component framework |
| Build Tool | Vite (rolldown-vite) | 7.1.14 | Development server and bundler |
| 3D Engine | Three.js | 0.180.0 | WebGL 3D rendering |
| 3D React Bindings | @react-three/fiber | 9.3.0 | React renderer for Three.js |
| 3D Helpers | @react-three/drei | 10.7.6 | OrbitControls, useGLTF, and other utilities |
| Routing | React Router DOM | 6.30.1 | Client-side page navigation |
| Styling | Tailwind CSS | 4.1.14 | Utility-first CSS framework |
| Icons | Lucide React | 0.548.0 | SVG icon library |
| Animation | GSAP | 3.13.0 | Animation engine |
| Lottie | lottie-react | 2.4.1 | JSON animation player for landing page |
| Linting | ESLint | 9.36.0 | Code quality enforcement |
| Deployment | Vercel | -- | Hosting and CI/CD |

---

## Project Structure

```
radtech/
|
|-- public/
|   |-- Images/
|   |   |-- Result/                  # Radiographic result images
|   |   |   |-- Front1.jpg          # AP cervicothoracic view
|   |   |   |-- Back1.png           # PA view
|   |   |   |-- Right1.png          # Lateral view (variant B)
|   |   |   |-- Right2.png          # Lateral view (variant A)
|   |   |   |-- Left1.png           # Left lateral reference
|   |   |   +-- Left2.png           # Left lateral reference
|   |   |-- chriza.jpg              # Proponent photo
|   |   +-- pat.jpg                 # Proponent photo
|   |-- Model/
|   |   |-- base.glb                # Human body 3D model
|   |   |-- cassette.glb            # X-ray cassette model
|   |   |-- verticalA.glb           # Vertical bucky A (Twinning)
|   |   +-- verticalB.glb           # Vertical bucky B (Pawlow)
|   +-- logo.jpg
|
|-- src/
|   |-- assets/
|   |   +-- Animations/             # Lottie JSON animation files
|   |
|   |-- shared/
|   |   +-- components/
|   |       +-- Icon.jsx            # Centralized SVG icon renderer
|   |
|   |-- layout/
|   |   |-- Header.jsx              # Navigation header with mobile menu
|   |   +-- Footer.jsx              # Site footer with social links
|   |
|   |-- features/
|   |   |-- home/
|   |   |   |-- HomeContent.jsx          # Home page composition
|   |   |   |-- components/
|   |   |   |   |-- HeroSection.jsx      # Landing hero with Lottie animation
|   |   |   |   |-- FeatureShowcase.jsx  # Feature listing section
|   |   |   |   |-- FeatureCard.jsx      # Individual feature card
|   |   |   |   +-- CTASection.jsx       # Call-to-action section
|   |   |   +-- config/
|   |   |       +-- featureList.js       # Feature metadata and animations
|   |   |
|   |   |-- model-viewer/
|   |   |   |-- ModelLoader.jsx          # [CORE] Main orchestrator component
|   |   |   |-- hooks/
|   |   |   |   |-- useResponsiveFlag.js     # Mobile breakpoint detection
|   |   |   |   |-- useCameraAnimation.js    # Camera animation state
|   |   |   |   +-- useHeadControls.js       # Head rotation state
|   |   |   |-- ModelHelper/
|   |   |   |   |-- Body.jsx                 # 3D body (GLB + arm + rotation)
|   |   |   |   |-- Cassette.jsx             # 3D cassette with Z-offset
|   |   |   |   |-- Vertical.jsx             # 3D vertical bucky (A or B)
|   |   |   |   |-- XRayTable3D.jsx          # Procedural X-ray table
|   |   |   |   |-- CameraController.jsx     # Smooth camera animation
|   |   |   |   |-- HeadAnimationController.jsx  # Weighted head/neck IK
|   |   |   |   |-- HeadController.jsx       # Head control UI panel
|   |   |   |   |-- EquipmentControls.jsx    # Equipment adjust UI
|   |   |   |   |-- ModelRotationControls.jsx # Rotation selector UI
|   |   |   |   |-- ControlTray.jsx          # Top-right floating toolbar
|   |   |   |   |-- LoadingIndicator.jsx     # Spinner overlay
|   |   |   |   +-- CursorZoomController.jsx # Cursor-based zoom
|   |   |   +-- LessonHandler/
|   |   |       |-- LessonAnimationContext.jsx    # Animation event bus (Context)
|   |   |       |-- AnimationHandlerRegistrar.jsx # Connects handlers to context
|   |   |       |-- LessonDashboard.jsx      # Lesson category selector
|   |   |       |-- FlashcardViewer.jsx      # Side-panel flashcard system
|   |   |       |-- AnatomyPointer.jsx       # SVG arrow overlay
|   |   |       +-- cameraPresets.js         # Named camera positions
|   |   |
|   |   |-- assessment/
|   |   |   |-- AssessmentContent.jsx    # Theory, Practice, Recap tabs
|   |   |   +-- AssessmentContent.css    # Assessment-specific styles
|   |   |
|   |   +-- about/
|   |       +-- About.jsx               # University and proponent info
|   |
|   |-- utils/
|   |   +-- navigationManager.js         # SessionStorage page persistence
|   |
|   |-- App.jsx              # Root component with page routing
|   |-- App.css              # Global application styles
|   +-- main.jsx             # Entry point (React Router setup)
|
|-- index.html
|-- package.json
|-- vite.config.js
|-- vercel.json               # Vercel deployment configuration
|-- eslint.config.js
+-- DOCUMENTATION.md          # Full technical documentation
```

---

## Getting Started

### Prerequisites

- **Node.js** version 18 or later
- **npm** version 9 or later

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/janreidev-web/radtech.git
    ```

2. **Navigate to the project directory:**

    ```sh
    cd radtech
    ```

3. **Install dependencies:**

    ```sh
    npm install
    ```

### Development

Start the Vite development server with hot module replacement:

```sh
npm run dev
```

### Production Build

Build the application for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Lint the codebase:

```sh
npm run lint
```

---

## Application Pages

The application consists of four main pages, navigable through the header.

### Home

The landing page introduces RadTech3D with three sections:

- **HeroSection** -- A headline, description, and Lottie animation with a call-to-action button ("Start Learning Now") that navigates directly to the Model Viewer.
- **FeatureShowcase** -- Three feature cards highlighting Interactive 3D Positioning, Central Ray Demystification, and Step-by-Step Procedural Guides. Each card includes a Lottie animation and descriptive bullet points.
- **CTASection** -- A closing call-to-action encouraging students to begin their learning journey.

### 3D Model Viewer

The core of the application. A full-screen 3D canvas where students interact with a human body model, position radiographic equipment, and run exposure simulations. Detailed breakdown provided in a later section.

### Assessment

A three-tab educational module for practicing radiographic exposure calculations. Contains theory content, 15 practice problems with solutions, and a recap with formula references. Detailed breakdown provided in a later section.

### About

Displays information about the thesis project, including the university (Southern Luzon State University), thesis title, proponent profiles with photos, adviser name, and program details.

---

## 3D Model Viewer -- Detailed Breakdown

The Model Viewer is orchestrated by `ModelLoader.jsx`, which manages over 25 state variables and coordinates all 3D scene elements, UI panels, and simulation logic.

### Lesson System

The **LessonDashboard** presents three lesson categories:

| Category | Type | Description |
|----------|------|-------------|
| Introduction | Flashcard | Anatomy overview of the cervical spine (C1-C7), thoracic spine (T1-T12), and cervicothoracic junction (C7-T1) |
| Swimmer's View (Twinning Method) | Practical | Standing/upright lateral positioning with cassette and Vertical A |
| Swimmer's View (Pawlow Method) | Practical | Recumbent lateral positioning with X-ray table and Vertical B |

Clicking a category triggers a one-click activation flow: the system resets any prior state, loads the appropriate equipment and model configuration, and animates the camera to an overview position.

The **LessonAnimationContext** acts as an event bus. `AnimationHandlerRegistrar` registers camera animation handlers from `ModelLoader`, and downstream components (`LessonDashboard`, `FlashcardViewer`) invoke them through the context without direct prop drilling.

### Positioning Methods

| Aspect | Twinning Method | Pawlow Method |
|--------|----------------|---------------|
| Patient Position | Standing (upright) | Recumbent (lying on table) |
| Arm Position | Twinning (slightly closer to torso) | Closed (arms crossed) |
| Equipment Shown | Cassette + Vertical Bucky A | Vertical Bucky B + X-Ray Table |
| Rotation Options | Front, Side-Right, Side-Left, Back | Front, Back only |
| Vertical Adjustment | Height only (Up/Down) | Height (Up/Down) + Horizontal (Left/Right) |

The `Body.jsx` component handles arm positioning by traversing the GLB bone hierarchy and applying rotation values to `CC_Base_L_Upperarm`, `CC_Base_L_Forearm`, `CC_Base_R_Upperarm`, and `CC_Base_R_Forearm` based on the selected arm position mode.

Model rotation is applied as Y-axis rotation:

| Rotation | Y-axis Value |
|----------|-------------|
| Front | 0 |
| Side-Right | PI / 2 |
| Side-Left | -PI / 2 |
| Back | PI |

When lying down (Pawlow), the model rotates to `[-1.5, 0, 1.56]` to simulate a recumbent posture on the X-ray table.

### Equipment System

Three types of 3D equipment models are loaded from GLB files:

- **Cassette** (`cassette.glb`) -- Used in the Twinning method. Its internal `main` mesh has its Z-position adjusted by `heightOffset`.
- **Vertical A** (`verticalA.glb`) -- Standing vertical bucky for the Twinning method. Height adjustable.
- **Vertical B** (`verticalB.glb`) -- Recumbent vertical bucky for the Pawlow method. Both height and horizontal position adjustable.
- **XRayTable3D** -- A procedurally generated table (not GLB) with a subtle floating animation, used only in the Pawlow method.

Each equipment component captures a baseline Z-coordinate on first mount, then applies incremental offsets. The `EquipmentControls` component provides Up/Down (and Left/Right for Vertical B) buttons with long-press support using a custom `useLongPressHandlers` hook (300ms initial delay, then 100ms repeat intervals).

### Head Control System

The `HeadController` provides a D-pad style interface for adjusting head tilt (X-axis) and turn (Y-axis) in 1-degree increments. It supports:

- Mouse click, touch, and keyboard (Space/Enter) input.
- Long-press for continuous adjustment.
- Live angle readout in degrees.
- A reset button to return to the default head position.

The `HeadAnimationController` applies the rotation values using weighted inverse kinematics across the bone chain:

| Bone | Weight |
|------|--------|
| CC_Base_Head | 0.10 |
| CC_Base_NeckTwist01 | 0.50 |
| CC_Base_NeckTwist02 | 0.00 |

This weighting distributes the rotation naturally between the head and neck, with clamping limits of 1.5 radians (~86 degrees) for tilt and 1.8 radians (~103 degrees) for turn.

### Simulation Workflow

The simulation follows a three-step state machine:

```
POSITIONING  -->  THICKNESS-INPUT  -->  POST-EXPOSURE
     ^                                       |
     +---------------------------------------+
                (Start New Positioning)
```

1. **Positioning** -- The student interacts with the 3D model, adjusts equipment, rotates the model, and controls head position. The Control Tray provides toggle buttons for each panel plus a "Done Positioning" button.

2. **Thickness Input** -- After clicking "Done Positioning", a panel appears requesting the patient's body thickness (valid range: 15-35 cm). The student enters a value and clicks "Calculate and Show Results".

3. **Post-Exposure** -- The system first validates equipment positioning by checking that cassette and vertical bucky Z-coordinates fall within predefined cervicothoracic ranges. If valid, it calculates exposure factors and displays the radiographic result image. If invalid, an alert shows the required ranges and current coordinates.

### Exposure Calculation

The exposure calculation uses a linear model based on body thickness:

```
Base thickness: 25 cm
Base kVp:       70
Base mAs:       10

Calculation:
  thicknessDifference = bodyThickness - 25
  optimalKvp = 70 + (thicknessDifference * 2)
  optimalMas = 10 + (thicknessDifference * 0.5)
```

Example for a 30 cm patient:
- kVp = 70 + (5 * 2) = 80
- mAs = 10 + (5 * 0.5) = 12.5, rounded to 13

### Radiographic Results

After successful validation, a radiographic result image is displayed based on the model's current rotation:

| Model Rotation | Image(s) | Selection Method |
|----------------|----------|-----------------|
| Front | Front1.jpg | Deterministic |
| Back | Back1.png | Deterministic |
| Side-Right | Right1.png, Right2.png | 50/50 random |
| Side-Left | Right1.png, Right2.png | 50/50 random (same lateral views) |

The lateral views share the same two images because both represent valid lateral cervicothoracic radiographs regardless of left or right patient orientation.

---

## Assessment Module -- Detailed Breakdown

The Assessment page (`AssessmentContent.jsx`) is organized into three tabs:

**Theory Tab**

Presents three educational cards covering the core technical factors:

| Topic | Formula | Example |
|-------|---------|---------|
| kVp (Kilovoltage Peak) | thickness (cm) x 2 + 40 | 20 cm: 20 x 2 + 40 = 80 kVp |
| mAs (Milliamperage-seconds) | For every 4-5 cm, double mAs | 20 cm: 2^4 = 16x multiplier |
| Distance and Density | mAs is proportional to distance squared | 100cm to 200cm: mAs x 4 |

**Practice Tab**

Contains 15 progressively difficult problems organized into 5 sets:

| Set | Questions | Type | Topic |
|-----|-----------|------|-------|
| 1 | Q1-Q3 | Basic Calculation | kVp computation |
| 2 | Q4-Q6 | Basic Calculation | mAs computation |
| 3 | Q7-Q9 | Calculation | Distance and grid factors |
| 4 | Q10-Q12 | Word Problem | Complex clinical scenarios |
| 5 | Q13-Q15 | Word Problem | Advanced clinical scenarios (grids, distance changes, pathology) |

Each question provides a text input area for the student's answer and a "Show Solution" button that reveals step-by-step workings and the correct answer.

**Recap Tab**

Two summary cards (Assessment Recap and Technical Recap) plus a quick-reference formula grid with four formulas:
- kVp: Thickness x 2 + 40
- mAs: Base x 2^(segments of 5cm)
- Distance: mAs is proportional to distance squared
- 15% Rule: 15% kVp increase is approximately equal to 2x mAs

---

## Input-Process-Output Model

### High-Level IPO

```
+---------------------+     +------------------------------+     +-------------------------+
|       INPUT          |     |          PROCESS             |     |        OUTPUT            |
|                      |     |                              |     |                          |
| - Lesson selection   |---->| - Load 3D model & equipment  |---->| - 3D scene rendering     |
| - Model rotation     |     | - Compute body rotation      |     | - Equipment visualization |
| - Equipment offsets  |     | - Apply equipment offsets     |     | - Positioning feedback    |
| - Head tilt/turn     |     | - Animate head/camera        |     | - Animated camera views   |
| - Body thickness     |     | - Calculate kVp & mAs        |     | - Exposure factor results |
| - Navigation clicks  |     | - Validate positioning       |     | - Radiographic images     |
| - Assessment answers |     | - Evaluate answers           |     | - Solutions & feedback    |
+---------------------+     +------------------------------+     +-------------------------+
```

### Per-Module IPO

**Model Viewer Module**

| Input | Process | Output |
|-------|---------|--------|
| Lesson selection | Load equipment, configure model posture | 3D scene with model and equipment |
| Model rotation command | Apply Y-axis rotation to body mesh | Rotated model view |
| Equipment height adjustment | Increment/decrement Z-offset | Repositioned equipment in 3D |
| Head tilt/turn values | Apply weighted rotation to bone chain | Anatomically correct head movement |
| "Done Positioning" click | Transition simulation state | Thickness input panel |
| Body thickness entry | Validate range, validate coordinates, calculate factors | Exposure results and radiographic image |

**Assessment Module**

| Input | Process | Output |
|-------|---------|--------|
| Tab selection (Theory/Practice/Recap) | Load corresponding content | Rendered content section |
| Answer text and "Show Solution" click | Display stored step-by-step solution | Solution steps with correct answer |
| Next/Previous navigation | Cycle question index, reset state | New question displayed |

---

## Component Hierarchy

```
<App>
|-- <Header />
|-- <main>
|   |-- [home]       -> <HomeContent>
|   |                      |-- <HeroSection />
|   |                      |-- <FeatureShowcase>
|   |                      |     +-- <FeatureCard /> (x3)
|   |                      +-- <CTASection />
|   |
|   |-- [model]      -> <ModelLoader>
|   |                      +-- <LessonAnimationProvider>
|   |                           |-- <Canvas>
|   |                           |   |-- <Body />
|   |                           |   |-- <XRayTable3D />        (conditional)
|   |                           |   |-- <Cassette />           (conditional)
|   |                           |   |-- <Vertical variant="A"/> (conditional)
|   |                           |   |-- <Vertical variant="B"/> (conditional)
|   |                           |   |-- <CameraController />
|   |                           |   |-- <HeadAnimationController />
|   |                           |   +-- <OrbitControls />
|   |                           |-- <LessonDashboard />
|   |                           |-- <FlashcardViewer />        (conditional)
|   |                           |     +-- <AnatomyPointer />
|   |                           |-- <ControlTray />            (conditional)
|   |                           |-- <EquipmentControls />      (conditional)
|   |                           |-- <HeadController />         (conditional)
|   |                           |-- <ModelRotationControls />  (conditional)
|   |                           |-- <AnimationHandlerRegistrar />
|   |                           |-- [Thickness Input Panel]    (conditional)
|   |                           +-- [Post-Exposure Panel]      (conditional)
|   |
|   |-- [assessment] -> <AssessmentContent />
|   |
|   +-- [about]      -> <About />
|
+-- <Footer />
```

---

## State Management

RadTech3D uses React's built-in state management with no external state libraries.

**Core State in ModelLoader**

| Variable | Type | Purpose |
|----------|------|---------|
| `showXRayTable` | boolean | X-ray table visibility |
| `showCassette` | boolean | Cassette visibility |
| `showVerticalA` | boolean | Vertical A visibility |
| `showVerticalB` | boolean | Vertical B visibility |
| `armPosition` | string | Arm mode: 'default', 'twinning', 'closed' |
| `cassetteOffset` | number | Cassette Z-axis offset |
| `verticalAOffset` | number | Vertical A Z-axis offset |
| `verticalBOffset` | number | Vertical B Z-axis offset |
| `verticalBHorizontalOffset` | number | Vertical B X-axis offset |
| `isLyingDown` | boolean | Standing vs recumbent posture |
| `isLoading` | boolean | 3D model loading state |
| `baseRotation` | string | Current model orientation |
| `hasLessonSelected` | boolean | Whether a lesson is active |
| `simulationStep` | string | Current workflow step |
| `bodyThickness` | string | User-entered body thickness |
| `userCalculations` | object | Calculated kVp and mAs |

**Custom Hooks**

| Hook | File | Purpose |
|------|------|---------|
| `useResponsiveFlag` | `useResponsiveFlag.js` | Returns `isMobile` boolean based on 768px breakpoint |
| `useCameraAnimation` | `useCameraAnimation.js` | Manages camera animation state (trigger, complete, reset) |
| `useHeadControls` | `useHeadControls.js` | Manages head rotation and position state |

**Context API**

`LessonAnimationContext` provides an animation event bus that decouples lesson components from the camera animation system. Components call `triggerCameraAnimation(action)` through the context, which routes to the registered handler in `ModelLoader`.

**Navigation Persistence**

`NavigationManager` stores the current page in `sessionStorage` with the key `'currentPage'`. Valid pages are `['home', 'model', 'assessment', 'about']`. The state survives page refresh but is cleared on tab close via a `beforeunload` event listener.

---

## Responsive Design

The application uses a single breakpoint at **768px** to distinguish mobile and desktop layouts.

| Component | Mobile (less than or equal to 768px) | Desktop (greater than 768px) |
|-----------|--------|---------|
| Body model scale | 1.7 | 2.4 |
| Lesson Dashboard | Top-center, full width, max 400px, max 40vh | Left-center, 20% width, min 250px |
| Control Tray | Wraps buttons, smaller min-width | No-wrap row, larger buttons |
| Equipment Controls | Compact positioning | Full-spread positioning |
| Header navigation | Hamburger menu with slide-down | Horizontal link bar |
| Model Rotation grid | 2-column | 4-column |
| Dashboard position | Centered at top | Fixed to left side |

The `useResponsiveFlag` hook listens to the `resize` event and returns a reactive `isMobile` flag consumed by `ModelLoader` to conditionally adjust positions, scales, and layout styles.

---

## Deployment

The project is deployed on **Vercel** with SPA routing configured in `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all routes are handled by the React client-side router. Push to the `main` branch on GitHub triggers an automatic deployment.

**Repository:** [github.com/janreidev-web/radtech](https://github.com/janreidev-web/radtech)

---

## License

This project was developed as a thesis requirement for the Bachelor of Science in Radiologic Technology program at Southern Luzon State University. All rights reserved by the proponents.

---

<div align="center">

*RadTech3D -- Bridging the gap between theory and clinical practice through interactive 3D visualization.*

<a href="#top">Back to Top</a>

</div>