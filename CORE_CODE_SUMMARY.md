# RadTech3D — Core Codebase Summary

> Vital code snippets from the 3D Model Viewer system with operational explanations of how each part works on the live website.

---

## 1. ModelLoader — Central State Orchestrator

### How it works operationally
`ModelLoader.jsx` is the root of the entire 3D experience. It holds every piece of state — which equipment is visible, arm positions, rotation, simulation step, head control values, camera animation — and passes the relevant slices down to each child. All user interactions (lesson selection, equipment adjustments, head control, done-positioning) are handled as callbacks here and flow outward. The component wraps everything in `<LessonAnimationProvider>` so sub-components can trigger camera animations without prop drilling.

### `src/features/model-viewer/ModelLoader.jsx` — state declaration
```js
const isMobile = useResponsiveFlag();                    // reactive 768px breakpoint

// Equipment visibility
const [showXRayTable,  setShowXRayTable]  = useState(false);
const [showCassette,   setShowCassette]   = useState(false);
const [showVerticalA,  setShowVerticalA]  = useState(false);
const [showVerticalB,  setShowVerticalB]  = useState(false);

// Arm & posture
const [armPosition,    setArmPosition]    = useState('twinning');
const [isLyingDown,    setIsLyingDown]    = useState(false);

// Equipment offsets (Z-axis height, X-axis horizontal for B)
const [cassetteOffset,            setCassetteOffset]            = useState(0);
const [verticalAOffset,           setVerticalAOffset]           = useState(0);
const [verticalBOffset,           setVerticalBOffset]           = useState(0);
const [verticalBHorizontalOffset, setVerticalBHorizontalOffset] = useState(0);

// Baseline Z captured on first mount — persists across offset resets
const [cassetteBaselineZ,  setCassetteBaselineZ]  = useState(null);
const [verticalABaselineZ, setVerticalABaselineZ] = useState(null);
const [verticalBBaselineZ, setVerticalBBaselineZ] = useState(null);

// Simulation state machine
const [simulationStep, setSimulationStep] = useState('positioning');
// values: 'positioning' | 'thickness-input' | 'post-exposure'
const [bodyThickness,    setBodyThickness]    = useState(null);
const [userCalculations, setUserCalculations] = useState({ kVp: '', mAs: '' });

// Custom hook-managed state
const { cameraAnimation, triggerCameraAnimation,
        handleCameraComplete, resetCameraAnimation } = useCameraAnimation();
const { headControl, updateHeadControl, resetHeadControl } = useHeadControls();
```

### Lesson selection handler — wires up equipment & posture per method
```js
// Called by LessonDashboard when a category is clicked
const onLessonSelected = useCallback(({ mode, categoryTitle }) => {
  handleReset();                         // clear all prior state first

  if (categoryTitle.includes('Twinning')) {
    setShowCassette(true);
    setShowVerticalA(true);
    handleArmPositionChange('twinning');
    setIsLyingDown(false);
    setBaseRotation('side-right');
  } else if (categoryTitle.includes('Pawlow')) {
    setShowXRayTable(true);
    setShowVerticalB(true);
    handleArmPositionChange('closed');
    setIsLyingDown(true);
    setBaseRotation('side-right');
  }

  if (mode === 'flashcard') {
    setShowFlashcards(true);
    setCurrentFlashcardData(lessonData);
  }

  setHasLessonSelected(true);
}, [handleReset, handleArmPositionChange]);
```

---

## 2. Body.jsx — 3D Model with Bone Manipulation

### How it works operationally
`Body.jsx` loads the GLB human body using `useGLTF` and renders it as a `<primitive>`. On every change to `armPosition` it recursively traverses the entire scene graph searching for the four arm bones by name (`CC_Base_L_Upperarm`, `CC_Base_L_Forearm`, etc.) and directly sets their `rotation` to pre-tuned Euler angles. Model orientation (front/side/back) is applied as a Y-axis rotation on the `<primitive>` itself. When `isLyingDown` is true the whole model is rotated to `[-1.5, 0, 1.56]` to simulate the Pawlow (recumbent) posture.

### `src/features/model-viewer/ModelHelper/Body.jsx`
```jsx
function Body({ modelPath, scale, isMobile, armPosition, isLyingDown, baseRotation, onLoad }) {
  const { scene } = useGLTF(modelPath);   // loads base.glb, cached after first use

  // Fire onLoad callback so ModelLoader hides the spinner
  useEffect(() => { if (onLoad && scene) onLoad(); }, [onLoad, scene]);

  // Directly mutate bone rotations on every armPosition change
  useEffect(() => {
    const positionArms = (object) => {
      if (armPosition === 'closed') {
        // Pawlow: arms crossed over chest
        if (object.name === 'CC_Base_L_Upperarm') object.rotation.set(0.5,  0.2, -1.3);
        if (object.name === 'CC_Base_L_Forearm')  object.rotation.set(0,    1,    0  );
        if (object.name === 'CC_Base_R_Upperarm') object.rotation.set(1.5, -0.3,  1.5);
        if (object.name === 'CC_Base_R_Forearm')  object.rotation.set(0,    0,    0  );
      } else if (armPosition === 'twinning') {
        // Twinning: arms slightly forward, asymmetric
        if (object.name === 'CC_Base_L_Upperarm') object.rotation.set( 0.32,  0.12, -1.25);
        if (object.name === 'CC_Base_L_Forearm')  object.rotation.set( 0,    -0.5,  -0.05);
        if (object.name === 'CC_Base_R_Upperarm') object.rotation.set( 0.64, -0.12,  1.25);
        if (object.name === 'CC_Base_R_Forearm')  object.rotation.set( 0,     0.5,   0.05);
      }
      object.children.forEach(child => positionArms(child));  // recursive traversal
    };
    positionArms(scene);
  }, [scene, armPosition]);

  // Orientation: lying-down overrides Y-rotation
  const getRotation = () => {
    if (isLyingDown) return [-1.5, 0, 1.56];   // Pawlow recumbent
    return { front: [0,0,0], 'side-right': [0, Math.PI/2, 0],
             'side-left': [0, -Math.PI/2, 0], back: [0, Math.PI, 0] }[baseRotation];
  };

  return <primitive object={scene} scale={scale} rotation={getRotation()} />;
}
useGLTF.preload('/Model/base.glb');   // prefetch before component mounts
```

---

## 3. HeadAnimationController — Weighted Bone IK

### How it works operationally
`HeadAnimationController` renders nothing — it is a pure side-effect component that runs inside the R3F `<Canvas>`. On every `headRotation` change it traverses the Three.js scene graph, finds the head and neck bones by exact name, and applies a weighted fraction of the total rotation to each bone. The head bone gets only 10% of the motion; the first neck bone gets 50%; the second neck bone gets 0%. This distributes movement naturally across the joint chain so the head doesn't rotate robotically from a single pivot point.

### `src/features/model-viewer/ModelHelper/HeadAnimationController.jsx`
```js
const HeadAnimationController = ({
  headRotation = { tilt: 0, turn: 0 },
  headWeight    = 0.10,
  neckWeights   = { CC_Base_NeckTwist01: 0.5, CC_Base_NeckTwist02: 0 },
  headLimitTilt = 1.5,   // ~86°
  headLimitTurn = 1.8,   // ~103°
}) => {
  const { scene } = useThree();
  const initialRotationsRef = useRef({});   // stores bone's rest rotation on first encounter

  useEffect(() => {
    const manipulate = (object) => {
      const name = object.name || '';
      const isTarget = name === 'CC_Base_Head' || neckWeights[name] != null;
      if (isTarget) {
        // Capture rest rotation once, so all subsequent deltas are relative
        if (!initialRotationsRef.current[name]) {
          initialRotationsRef.current[name] = {
            x: object.rotation.x, y: object.rotation.y, z: object.rotation.z
          };
        }
        const init   = initialRotationsRef.current[name];
        const weight = name === 'CC_Base_Head' ? headWeight : (neckWeights[name] ?? 0);

        // Clamp then scale input by this bone's weight
        const tilt = Math.max(-headLimitTilt, Math.min(headLimitTilt, headRotation.tilt));
        const turn = Math.max(-headLimitTurn, Math.min(headLimitTurn, headRotation.turn));

        object.rotation.x = init.x + tilt * weight;   // tilt  → X axis
        object.rotation.y = init.y + turn * weight;   // turn  → Y axis
        object.rotation.z = init.z;                   // roll  → unchanged
      }
      object.children.forEach(child => manipulate(child));
    };
    manipulate(scene);
  }, [scene, headRotation]);   // re-runs every time the user moves the D-pad

  return null;   // no DOM/JSX output — pure Three.js side effect
};
```

---

## 4. CameraController — Smooth Ease-In-Out Animation

### How it works operationally
`CameraController` also renders nothing and lives inside `<Canvas>`. When `isActive` becomes `true` it records the camera's current position and look-at direction as the start values, then drives a `requestAnimationFrame` loop that lerps both vectors toward the target using an ease-in-out quadratic curve. When `progress` reaches 1 it calls `onComplete` which sets `isActive` back to false in the `useCameraAnimation` hook, stopping the loop.

### `src/features/model-viewer/ModelHelper/CameraController.jsx`
```js
const CameraController = ({ targetPosition, targetLookAt, duration = 2000, isActive, onComplete }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (!isActive || !targetPosition || !targetLookAt) return;

    // Snapshot current state as animation start
    const startPos    = camera.position.clone();
    const startLookAt = new THREE.Vector3();
    camera.getWorldDirection(startLookAt);
    startLookAt.multiplyScalar(10).add(camera.position);
    const startTime = Date.now();

    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);

      // Quadratic ease-in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      camera.position.copy(startPos.clone().lerp(new THREE.Vector3(...targetPosition), eased));
      camera.lookAt(startLookAt.clone().lerp(new THREE.Vector3(...targetLookAt), eased));

      if (progress < 1) requestAnimationFrame(animate);
      else if (onComplete) onComplete();   // notifies hook → sets isActive = false
    };

    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, targetPosition, targetLookAt]);

  return null;
};
```

### `src/features/model-viewer/hooks/useCameraAnimation.js` — state wrapper
```js
export function useCameraAnimation() {
  const [cameraAnimation, setCameraAnimation] = useState({
    isActive: false, targetPosition: null, targetLookAt: null, duration: 2000,
  });

  // Called by LessonDashboard / FlashcardViewer through the Context
  const triggerCameraAnimation = useCallback((action) => {
    setCameraAnimation({ isActive: true, targetPosition: action.position,
                         targetLookAt: action.lookAt, duration: action.duration || 2000 });
  }, []);

  // Called by CameraController when animation finishes
  const handleCameraComplete = useCallback(() => {
    setCameraAnimation(prev => ({ ...prev, isActive: false }));
  }, []);

  return { cameraAnimation, triggerCameraAnimation, handleCameraComplete, resetCameraAnimation };
}
```

---

## 5. LessonAnimationContext — Decoupled Event Bus

### How it works operationally
Instead of threading `triggerCameraAnimation` through multiple layers of props, `LessonAnimationContext` acts as a message bus. `ModelLoader` registers its handler object once via `AnimationHandlerRegistrar`. Any descendant component (`LessonDashboard`, `FlashcardViewer`) then calls `triggerCameraAnimation(action)` through the context hook — which routes the call to whichever handler is currently registered. This keeps lesson-UI components completely independent of the camera system.

### `src/features/model-viewer/LessonHandler/LessonAnimationContext.jsx`
```js
export const LessonAnimationProvider = ({ children }) => {
  const [animationHandlers, setAnimationHandlers] = useState({});

  // ModelLoader calls this once to register its triggerCameraAnimation function
  const registerHandlers = useCallback((handlers) => {
    setAnimationHandlers(handlers);
  }, []);

  // LessonDashboard / FlashcardViewer call this; context routes it to the handler
  const triggerCameraAnimation = useCallback((action) => {
    animationHandlers.handleCameraAnimation?.(action);
  }, [animationHandlers]);

  return (
    <LessonAnimationContext.Provider value={{ registerHandlers, triggerCameraAnimation }}>
      {children}
    </LessonAnimationContext.Provider>
  );
};
```

### `src/features/model-viewer/LessonHandler/AnimationHandlerRegistrar.jsx`
```js
// Rendered inside <Canvas> — useEffect registers ModelLoader's handlers on mount
const AnimationHandlerRegistrar = ({ handlers }) => {
  const { registerHandlers } = useLessonAnimations();
  useEffect(() => { registerHandlers(handlers); }, [registerHandlers, handlers]);
  return null;
};
```

### Usage in `ModelLoader.jsx`
```js
// Connects ModelLoader's triggerCameraAnimation to the context
const animationHandlers = { handleCameraAnimation: triggerCameraAnimation };

// Inside the JSX:
<AnimationHandlerRegistrar handlers={animationHandlers} />
```

---

## 6. Equipment Z-Offset System

### How it works operationally
Each equipment GLB has its internal `main` mesh positioned wherever the artist placed it. Rather than hard-coding absolute Z values, `Cassette.jsx` and `Vertical.jsx` capture the `main` mesh's actual Z position 50ms after first mount (`originalZRef`) and report it back to `ModelLoader` as the `baseline`. From then on, every height adjustment applies `baseline + offset` — so the offset is always relative to the true initial position regardless of GLB content. The baseline is stored in `ModelLoader` state and **persists across resets**, so the equipment always returns to its true home position on reset.

### `src/features/model-viewer/ModelHelper/Cassette.jsx`
```js
useEffect(() => {
  const mainObj = findObjectByName(scene, 'main');   // locate the internal mesh
  if (!mainObj) return;

  setTimeout(() => {
    // First mount: capture real Z from GLB, report to ModelLoader
    if (originalZRef.current === null) {
      originalZRef.current = mainObj.position.z;
      onPositionUpdate(originalZRef.current, /* isBaseline */ true);
    }

    // Always: reset to baseline, then apply current offset
    mainObj.position.set(
      originalPositionRef.current.x,
      originalPositionRef.current.y,
      originalZRef.current + heightOffset   // ← offset drives the height
    );
    mainObj.updateMatrixWorld(true);
    onPositionUpdate(mainObj.position.z);   // report actual Z back to ModelLoader
  }, 50);
}, [scene, heightOffset]);
```

### `ModelLoader.jsx` — equipment coordinate tracking
```js
// Receives baseline on first mount; stores it permanently
const handleCassettePositionUpdate = useCallback((actualZ, isBaseline = false) => {
  if (isBaseline && cassetteBaselineZ === null) setCassetteBaselineZ(actualZ);
}, [cassetteBaselineZ]);

// Actual Z used for positioning validation:
actualZ = cassetteBaselineZ + cassetteOffset
```

---

## 7. Long-Press Handler — `useLongPressHandlers`

### How it works operationally
Equipment buttons need to move continuously while held down. `useLongPressHandlers` returns a set of event props (`onMouseDown`, `onTouchStart`, `onMouseUp`, etc.) that implement a 300 ms initial delay followed by a 100 ms repeat interval, matching a standard OS key-repeat feel. The `ignoreClick` flag prevents the native `onClick` from doubling the first press when `mouseDown` + `mouseUp` fires quickly.

### `src/features/model-viewer/ModelHelper/EquipmentControls.jsx`
```js
const LONG_PRESS_DELAY    = 300;   // ms before repeating starts
const LONG_PRESS_INTERVAL = 100;   // ms between repeats

function useLongPressHandlers(adjustFn) {
  const stateRef = useRef({ timeoutId: null, intervalId: null, ignoreClick: false });

  const startPress = useCallback((e) => {
    e.preventDefault();
    adjustFn();                                      // immediate first step
    stateRef.current.ignoreClick = true;
    stateRef.current.timeoutId = setTimeout(() => {
      stateRef.current.intervalId = setInterval(adjustFn, LONG_PRESS_INTERVAL);
    }, LONG_PRESS_DELAY);
  }, [adjustFn]);

  const stopPress = useCallback(() => {
    clearTimeout(stateRef.current.timeoutId);
    clearInterval(stateRef.current.intervalId);
  }, []);

  const handleClick = useCallback((e) => {
    if (stateRef.current.ignoreClick) {
      stateRef.current.ignoreClick = false;
      e.preventDefault(); return;          // suppress duplicate from mouseDown
    }
    adjustFn();
  }, [adjustFn]);

  return {
    onMouseDown: startPress, onTouchStart: startPress,
    onMouseUp: stopPress,    onMouseLeave: stopPress,
    onTouchEnd: stopPress,   onTouchCancel: stopPress,
    onClick: handleClick,
  };
}

// Spread onto a button:
const cassetteUpHandlers = useLongPressHandlers(() => onAdjustCassette(1));
<button {...cassetteUpHandlers}>↑ Up</button>
```

---

## 8. Simulation Workflow — Three-Step State Machine

### How it works operationally
The simulation runs through three states stored in `simulationStep`. The student positions equipment in `'positioning'`, then clicks "Done Positioning" which transitions to `'thickness-input'`. After entering a body thickness and clicking calculate, `handleThicknessSubmit` first **validates that equipment is in the cervicothoracic coordinate range**, then **calculates kVp/mAs** and advances to `'post-exposure'` where the radiographic result image is displayed.

### `ModelLoader.jsx` — state transitions
```js
// Step 1 → 2: student clicks "Done Positioning"
const handleDonePositioning = useCallback(() => {
  setSimulationStep('thickness-input');
}, []);

// Step 2 → 3: student submits body thickness
const handleThicknessSubmit = () => {
  const thickness = parseFloat(bodyThickness);
  if (thickness < 15 || thickness > 35) {
    alert('Please enter a valid body thickness between 15-35 cm');
    return;
  }

  // Gate: equipment must be in correct cervicothoracic Z range
  const validation = validateCervicothoracicPositioning();
  if (!validation.isValid) { alert(validation.message); return; }

  // Auto-compute exposure factors
  const { kVp, mAs } = calculateExposureFactors(bodyThickness);
  setUserCalculations({ kVp: kVp.toString(), mAs: mAs.toString() });
  setSimulationStep('post-exposure');
};
```

---

## 9. Positioning Validation

### How it works operationally
Before showing results the system checks whether the student placed each piece of equipment within the anatomically correct Z-coordinate range for the cervicothoracic junction. The method is detected automatically from which equipment flags are active. If validation fails, an alert shows the required ranges alongside the current values so the student knows exactly how far off they are.

### `ModelLoader.jsx`
```js
const validateCervicothoracicPositioning = () => {
  const coords = getEquipmentCoordinates();   // { cassette.actualZ, verticalA.actualZ, ... }

  if (showVerticalB) {
    // Pawlow method — only Vertical B matters
    const z = coords.verticalB.actualZ;
    if (z < 470 || z > 500)
      return { isValid: false, message: `Vertical B must be 470–500 (current: ${z.toFixed(1)})` };
    return { isValid: true };
  }

  // Twinning method — both cassette and Vertical A
  const cz = coords.cassette.actualZ;
  const vz = coords.verticalA.actualZ;
  if (cz < 85 || cz > 115 || vz < 520 || vz > 580)
    return {
      isValid: false,
      message: `Cassette Z: 85–115 (current: ${cz.toFixed(1)})\n`
             + `Vertical A Z: 520–580 (current: ${vz.toFixed(1)})`
    };
  return { isValid: true };
};

// Actual Z = baseline captured on mount + user's cumulative offset
const getEquipmentCoordinates = () => ({
  cassette:  { actualZ: cassetteBaselineZ  + cassetteOffset  },
  verticalA: { actualZ: verticalABaselineZ + verticalAOffset  },
  verticalB: { actualZ: verticalBBaselineZ + verticalBOffset  },
});
```

---

## 10. Exposure Calculation — 15% Rule

### How it works operationally
Once positioning is validated, `calculateExposureFactors` applies the radiography 15% rule: for every 1 cm increase in body thickness above the 25 cm baseline, kVp increases by 2 and mAs by 0.5. Results are stored in state and displayed in the post-exposure panel along with the radiographic result image.

### `ModelLoader.jsx`
```js
const calculateExposureFactors = (thickness) => {
  const diff = parseFloat(thickness) - 25;   // deviation from 25 cm average
  return {
    kVp: Math.round(70 + diff * 2),          // base 70 kVp
    mAs: Math.round(10 + diff * 0.5),        // base 10 mAs
  };
};

// Example: thickness = 30 cm
//   diff = 5
//   kVp  = 70 + 10 = 80 kVp
//   mAs  = 10 + 2.5 ≈ 13 mAs
```

---

## 11. Radiographic Result Image Selection

### How it works operationally
After successful validation the result image is chosen from the `/public/Images/Result/` folder based on the current model rotation. Lateral views (`side-right` / `side-left`) randomly pick one of two images with a 50/50 coin flip — both represent valid lateral cervicothoracic views — adding realistic variation between simulation runs.

### `ModelLoader.jsx`
```js
const getResultImage = () => {
  switch (baseRotation) {
    case 'front':      return '/Images/Result/Front1.jpg';
    case 'back':       return '/Images/Result/Back1.png';
    case 'side-right':
    case 'side-left':  return `/Images/Result/${Math.random() < 0.5 ? 'Right1.png' : 'Right2.png'}`;
    default:           return '/Images/Result/Front1.jpg';
  }
};
```

---

## 12. `useHeadControls` — Head Rotation State

### How it works operationally
`HeadController` (the D-pad UI) calls `updateHeadControl({ tilt, turn })` on every button press. `useHeadControls` stores this in a clean state object and exposes `resetHeadControl` so the full reset path in `ModelLoader` can snap the head back to centre without coupling directly to the `HeadController` component.

### `src/features/model-viewer/hooks/useHeadControls.js`
```js
export function useHeadControls() {
  const [headControl, setHeadControl] = useState({
    rotation: { tilt: 0, turn: 0 },
    position: { y: 0 },
  });

  const updateHeadControl = useCallback((control) => {
    setHeadControl({
      rotation: { tilt: control.tilt ?? 0, turn: control.turn ?? 0 },
      position: { y: control.posY ?? 0 },
    });
  }, []);

  const resetHeadControl = useCallback(() => {
    setHeadControl({ rotation: { tilt: 0, turn: 0 }, position: { y: 0 } });
  }, []);

  return { headControl, updateHeadControl, resetHeadControl };
}

// headControl is passed into <HeadAnimationController headRotation={headControl.rotation} />
// which applies the weighted bone rotation on every change
```

---

## 13. Full Reset — Clean State for a New Simulation

### How it works operationally
`handleReset` in `ModelLoader` is called at the start of every new lesson selection and also by the explicit "Reset" button. It clears all offsets, hides all equipment, resets posture, rotation, simulation step, flashcard state, and camera position. The `resetKey` integer increment forces each equipment component to fully remount, discarding any internal refs and capturing a fresh baseline Z on the next mount.

### `ModelLoader.jsx`
```js
const handleReset = useCallback(() => {
  setCassetteOffset(0); setVerticalAOffset(0);
  setVerticalBOffset(0); setVerticalBHorizontalOffset(0);

  setTimeout(() => setResetKey(prev => prev + 1), 10); // force equipment remount

  setShowXRayTable(false); setShowCassette(false);
  setShowVerticalA(false);  setShowVerticalB(false);
  setArmPosition('twinning'); setIsLyingDown(false);
  setBaseRotation('front');
  resetHeadControl();         // snap head to centre
  resetCameraAnimation();     // stop any in-progress camera tween

  // Reset camera position via OrbitControls ref
  if (orbitControlsRef.current) {
    orbitControlsRef.current.object.position.set(0, 2, 5);
    orbitControlsRef.current.target.set(0, 0, 0);
    orbitControlsRef.current.update();
  }

  setSimulationStep('positioning');
  setBodyThickness(null);
  setUserCalculations({ kVp: '', mAs: '' });
  setShowFlashcards(false);
  setHasLessonSelected(false);
}, [resetHeadControl, resetCameraAnimation]);
```

---


