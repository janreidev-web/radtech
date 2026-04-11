// src/components/ModelLoader.jsx
import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BodyMap from './ModelHelper/Body';
import XRayTable3D from './ModelHelper/XRayTable3D';
import Cassette from './ModelHelper/Cassette';
import Vertical from './ModelHelper/Vertical';
import LessonDashboard from './LessonHandler/LessonDashboard';
import FlashcardViewer from './LessonHandler/FlashcardViewer';
import CameraController from './ModelHelper/CameraController';
import HeadController from './ModelHelper/HeadController';
import HeadAnimationController from './ModelHelper/HeadAnimationController';
import CursorZoomController from './ModelHelper/CursorZoomController';
import LoadingIndicator from './ModelHelper/LoadingIndicator';
import { LessonAnimationProvider } from './LessonHandler/LessonAnimationContext';
import AnimationHandlerRegistrar from './LessonHandler/AnimationHandlerRegistrar';
import EquipmentControls from './ModelHelper/EquipmentControls';
import ModelRotationControls from './ModelHelper/ModelRotationControls';
import ControlTray from './ModelHelper/ControlTray';
import { useResponsiveFlag } from './hooks/useResponsiveFlag';
import { useCameraAnimation } from './hooks/useCameraAnimation';
import { useHeadControls } from './hooks/useHeadControls';

function ModelLoader() {
  const isMobile = useResponsiveFlag();
  const [showXRayTable, setShowXRayTable] = useState(false);
  const [showCassette, setShowCassette] = useState(false);
  const [showVerticalA, setShowVerticalA] = useState(false);
  const [showVerticalB, setShowVerticalB] = useState(false);
  const [armsClosed, setArmsClosed] = useState(false);
  const [armPosition, setArmPosition] = useState('twinning');
  const [cassetteOffset, setCassetteOffset] = useState(0);
  const [verticalAOffset, setVerticalAOffset] = useState(0);
  const [verticalATilt, setVerticalATilt] = useState(0); // Tilt angle in degrees (-50 to +50)
  const [verticalBOffset, setVerticalBOffset] = useState(0);
  const [verticalBTilt, setVerticalBTilt] = useState(0); // Tilt angle in degrees (-50 to +50)
  const [verticalBHorizontalOffset, setVerticalBHorizontalOffset] = useState(0);
  const [cassetteBaselineZ, setCassetteBaselineZ] = useState(null);
  const [verticalABaselineZ, setVerticalABaselineZ] = useState(null);
  const [verticalBBaselineZ, setVerticalBBaselineZ] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [isLyingDown, setIsLyingDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modelType, setModelType] = useState('base');
  const [baseRotation, setBaseRotation] = useState('front');
  const [hasLessonSelected, setHasLessonSelected] = useState(false);
  const [showModelRotationPanel, setShowModelRotationPanel] = useState(false);
  const [showEquipmentPanel, setShowEquipmentPanel] = useState(false);
  const [showHeadControlPanel, setShowHeadControlPanel] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentFlashcardData, setCurrentFlashcardData] = useState(null);
  const [simulationStep, setSimulationStep] = useState('positioning'); // 'positioning', 'computation', 'post-exposure'
  const [bodyThickness, setBodyThickness] = useState(null);
  const [userCalculations, setUserCalculations] = useState({ kVp: '', mAs: '' });
  const orbitControlsRef = useRef();
  
  // Lesson animation states
  const {
    cameraAnimation,
    triggerCameraAnimation,
    handleCameraComplete,
    resetCameraAnimation,
  } = useCameraAnimation();

  const { headControl, updateHeadControl, resetHeadControl } = useHeadControls();

  const handleArmPositionChange = useCallback((position) => {
    setArmPosition(position);
    setArmsClosed(position === 'closed');
  }, []);

  // Handle rotation change with auto arm position for both methods
  const handleRotationChange = useCallback((rotation) => {
    setBaseRotation(rotation);
    
    // Auto-set arm position based on rotation
    if (showVerticalB || showVerticalA) {
      // Pawlow: side-right -> left-arm-raised, side-left -> right-arm-raised
      // Twinning: opposite (side-right -> right-arm-raised, side-left -> left-arm-raised)
      const isTwinning = showVerticalA;
      const armPositions = {
        'front': 'closed',
        'back': 'closed',
        'side-left': isTwinning ? 'right-arm-raised' : 'left-arm-raised',
        'side-right': isTwinning ? 'left-arm-raised' : 'right-arm-raised'
      };
      const newArmPosition = armPositions[rotation];
      if (newArmPosition) {
        setArmPosition(newArmPosition);
        setArmsClosed(newArmPosition === 'closed');
      }
    }
  }, [showVerticalB, showVerticalA]);

  const handleAdjustCassette = useCallback((delta) => {
    setCassetteOffset(prev => prev + delta);
  }, []);

  const handleAdjustVertical = useCallback((delta) => {
    if (showVerticalA) {
      setVerticalAOffset(prev => prev + delta);
    } else if (showVerticalB) {
      setVerticalBOffset(prev => prev + delta);
    }
  }, [showVerticalA, showVerticalB]);

  const handleAdjustVerticalBHorizontal = useCallback((delta) => {
    setVerticalBHorizontalOffset(prev => prev + delta);
  }, []);

  const handleAdjustVerticalATilt = useCallback((delta) => {
    setVerticalATilt(prev => {
      const newValue = prev + delta;
      // Clamp between -50 and +50 degrees
      return Math.max(-10, Math.min(10, newValue));
    });
  }, []);

  const handleAdjustVerticalBTilt = useCallback((delta) => {
    setVerticalBTilt(prev => {
      const newValue = prev + delta;
      // Clamp between -50 and +50 degrees
      return Math.max(-10, Math.min(10, newValue));
    });
  }, []);

  // Toggle handlers for control panels - only one panel open at a time
  const toggleModelRotation = useCallback(() => {
    setShowModelRotationPanel(prev => {
      const newValue = !prev;
      // Close other panels when opening this one
      if (newValue) {
        setShowEquipmentPanel(false);
        setShowHeadControlPanel(false);
      }
      return newValue;
    });
  }, []);

  const toggleEquipment = useCallback(() => {
    setShowEquipmentPanel(prev => {
      const newValue = !prev;
      // Close other panels when opening this one
      if (newValue) {
        setShowModelRotationPanel(false);
        setShowHeadControlPanel(false);
      }
      return newValue;
    });
  }, []);

  const toggleHeadControl = useCallback(() => {
    setShowHeadControlPanel(prev => {
      const newValue = !prev;
      // Close other panels when opening this one
      if (newValue) {
        setShowModelRotationPanel(false);
        setShowEquipmentPanel(false);
      }
      return newValue;
    });
  }, []);

  const handleCassettePositionUpdate = useCallback((actualZ, isBaseline = false) => {
    if (isBaseline && cassetteBaselineZ === null) {
      setCassetteBaselineZ(actualZ);
    }
  }, [cassetteBaselineZ]);

  const handleVerticalBaselineUpdate = useCallback((variant, actualZ, isBaseline = false) => {
    if (variant === 'A') {
      if (isBaseline && verticalABaselineZ === null) {
        setVerticalABaselineZ(actualZ);
      }
    } else if (variant === 'B') {
      if (isBaseline && verticalBBaselineZ === null) {
        setVerticalBBaselineZ(actualZ);
      }
    }
  }, [verticalABaselineZ, verticalBBaselineZ]);

  // Handle Done Positioning functionality
  const handleDonePositioning = useCallback(() => {
    // Move to body thickness input step instead of generating random thickness
    setSimulationStep('thickness-input');
  }, []);

  // Function to calculate optimal exposure factors based on body thickness
  const calculateExposureFactors = (thickness) => {
    const thicknessNum = parseFloat(thickness);
    
    // Calculate optimal kVp and mAs using the 15% rule
    const baseKvp = 70; // Base kVp for average patient (25cm)
    const baseMas = 10; // Base mAs for average patient
    
    const thicknessDifference = thicknessNum - 25; // Difference from average
    const optimalKvp = baseKvp + (thicknessDifference * 2);
    const optimalMas = baseMas + (thicknessDifference * 0.5);
    
    return {
      kVp: Math.round(optimalKvp),
      mAs: Math.round(optimalMas),
      thickness: thicknessNum
    };
  };

  // Function to validate cervicothoracic positioning before showing images
  const validateCervicothoracicPositioning = () => {
    const coords = getEquipmentCoordinates();
    
    // Check if we're in Pawlow method (showVerticalB is true)
    const isPawlowMethod = showVerticalB;
    
    if (isPawlowMethod) {
      // Pawlow Method: Only validate Vertical B coordinates, ignore cassette
      if (!showVerticalB) {
        return {
          isValid: false,
          message: "Vertical B equipment must be positioned for Pawlow method."
        };
      }
      
      const verticalBActualZ = coords.verticalB.actualZ || 0;
      
      // Validate Vertical B is in cervicothoracic range: 470-500
      const verticalBInRange = verticalBActualZ >= 470 && verticalBActualZ <= 500;
      
      if (!verticalBInRange) {
        return {
          isValid: false,
          message: `Vertical B not positioned for cervicothoracic imaging.\n\n` +
            `Required range for Pawlow method:\n` +
            `Vertical B Z: 470-500 (Current: ${verticalBActualZ.toFixed(1)})\n\n` +
            `Base coordinate:\n` +
            `Vertical B: Z=484.72 (need offset: -14.72 to 15.28)\n\n` +
            `Please adjust Vertical B positioning and try again.`
        };
      }
      
      return { isValid: true };
    }
    
    // Twinning Method: Validate both cassette and Vertical A
    if (!showCassette || !showVerticalA) {
      return {
        isValid: false,
        message: "Both cassette and Vertical A equipment must be positioned for Twinning method."
      };
    }
    
    const cassetteActualZ = coords.cassette.actualZ || 0;
    const verticalAActualZ = coords.verticalA.actualZ || 0;
    
    // Validate coordinates are within cervicothoracic ranges
    // Cassette base: Z=4, target range: 85-115 (offset of 81-111)
    // Vertical A base: Z=531.57, target range: 520-580 (offset of -11.57 to 48.43)
    const cassetteInRange = cassetteActualZ >= 85 && cassetteActualZ <= 115;
    const verticalAInRange = verticalAActualZ >= 520 && verticalAActualZ <= 580;
    
    if (!cassetteInRange || !verticalAInRange) {
      return {
        isValid: false,
        message: `Equipment not positioned for cervicothoracic imaging.\n\n` +
          `Required ranges for Twinning method:\n` +
          `Cassette Z: 85-115 (Current: ${cassetteActualZ.toFixed(1)})\n` +
          `Vertical A Z: 520-580 (Current: ${verticalAActualZ.toFixed(1)})\n\n` +
          `Base coordinates:\n` +
          `Cassette: Z=4 (need offset: +81 to +111)\n` +
          `Vertical A: Z=531.57 (need offset: -11.57 to 48.43)\n\n` +
          `Please adjust equipment positioning and try again.`
      };
    }
    
    return { isValid: true };
  };

  // Handle body thickness submission and auto-calculation
  const handleThicknessSubmit = () => {
    if (bodyThickness && parseFloat(bodyThickness) >= 15 && parseFloat(bodyThickness) <= 35) {
      // First validate positioning
      const positioningValidation = validateCervicothoracicPositioning();
      
      if (!positioningValidation.isValid) {
        alert(positioningValidation.message);
        return;
      }
      
      // Calculate optimal exposure factors
      const calculatedFactors = calculateExposureFactors(bodyThickness);
      
      // Set the calculated values
      setUserCalculations({
        kVp: calculatedFactors.kVp.toString(),
        mAs: calculatedFactors.mAs.toString()
      });
      
      // Move to post-exposure to show results
      setSimulationStep('post-exposure');
    } else {
      alert('Please enter a valid body thickness between 15-35 cm');
    }
  };

  // Function to validate user calculations based on body thickness
  const validateCalculations = (kVp, mAs, thickness) => {
    const kvpNum = parseFloat(kVp);
    const masNum = parseFloat(mAs);
    const thicknessNum = parseFloat(thickness);
    
    // Calculate expected exposure based on body thickness
    // Using the 15% rule: for every 1cm increase in thickness, increase kVp by 2kVp (approximately 15%)
    const baseKvp = 70; // Base kVp for average patient (25cm)
    const baseMas = 10; // Base mAs for average patient
    
    // Calculate optimal kVp based on thickness
    const thicknessDifference = thicknessNum - 25; // Difference from average
    const optimalKvp = baseKvp + (thicknessDifference * 2);
    const optimalMas = baseMas + (thicknessDifference * 0.5);
    
    // Acceptable range (±10% for kVp, ±20% for mAs)
    const kvpTolerance = optimalKvp * 0.1;
    const masTolerance = optimalMas * 0.2;
    
    const kvpCorrect = kvpNum >= (optimalKvp - kvpTolerance) && kvpNum <= (optimalKvp + kvpTolerance);
    const masCorrect = masNum >= (optimalMas - masTolerance) && masNum <= (optimalMas + masTolerance);
    
    return {
      isCorrect: kvpCorrect && masCorrect,
      optimalKvp: Math.round(optimalKvp),
      optimalMas: Math.round(optimalMas),
      userKvp: kvpNum,
      userMas: masNum,
      feedback: kvpCorrect && masCorrect ? 'Correct!' : 'Incorrect - please recalculate'
    };
  };

  // Handle calculation submission
  const handleCalculationSubmit = useCallback(() => {
    if (userCalculations.kVp && userCalculations.mAs) {
      const validation = validateCalculations(userCalculations.kVp, userCalculations.mAs, bodyThickness);
      
      if (validation.isCorrect) {
        setSimulationStep('post-exposure');
      } else {
        // Show detailed feedback and prompt to recompute
        const message = `Incorrect calculations!\n\n` +
          `For body thickness: ${bodyThickness} cm\n` +
          `Optimal range: kVp ${Math.round(validation.optimalKvp - validation.optimalKvp * 0.1)}-${Math.round(validation.optimalKvp + validation.optimalKvp * 0.1)}, ` +
          `mAs ${Math.round(validation.optimalMas - validation.optimalMas * 0.2)}-${Math.round(validation.optimalMas + validation.optimalMas * 0.2)}\n\n` +
          `Your values: kVp ${validation.userKvp}, mAs ${validation.userMas}\n\n` +
          `Please recalculate and try again.`;
        
        alert(message);
      }
    } else {
      alert('Please enter both kVp and mAs values');
    }
  }, [userCalculations, bodyThickness]);

  // Handle reset functionality
  const handleReset = useCallback(() => {
    // Reset offsets first
    setCassetteOffset(0); // Reset cassette offset to original position
    setVerticalAOffset(0);
    setVerticalATilt(0); // Reset tilt
    setVerticalBOffset(0);
    setVerticalBTilt(0); // Reset tilt
    setVerticalBHorizontalOffset(0);
    // Keep baseline Z values - they persist across resets
    
    // Increment resetKey to force remount - use setTimeout to ensure it happens
    // after offsets are set but before components are hidden
    setTimeout(() => {
      setResetKey(prev => prev + 1); // Force equipment components to reset
    }, 10);
    
    // Hide components and reset other states
    setShowXRayTable(false); // Hide X-ray table on reset
    setShowCassette(false); // Hide cassette on reset
    setShowVerticalA(false); // Hide verticals on reset
    setShowVerticalB(false);
    setArmsClosed(false); // Reset arms to default twinning position
    setArmPosition('twinning'); // Reset arm position to default
    setIsLyingDown(false); // Return to standing position
    
    // Reset head control to default position
    resetHeadControl();

    // Reset base rotation to front
    setBaseRotation('front');
    
    // Reset panel visibility
    setShowModelRotationPanel(false);
    setShowEquipmentPanel(false);
    setShowHeadControlPanel(false);
    setHasLessonSelected(false);
    
    // Reset flashcard viewer state
    setShowFlashcards(false);
    setCurrentFlashcardData(null);
    
    // Reset positioning workflow state
    setSimulationStep('positioning');
    setBodyThickness(null);
    setUserCalculations({ kVp: '', mAs: '' });
    
    // Reset camera animation state
    resetCameraAnimation();
    
    // Reset camera and orbit controls to initial state
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      const camera = controls.object;
      
      // Reset camera position to initial [0, 2, 5]
      camera.position.set(0, 2, 5);
      
      // Reset orbit controls target to origin
      controls.target.set(0, 0, 0);
      
      // Update controls
      controls.update();
    }
  }, []);

  // Register animation handlers with context
  // Function to get equipment coordinates for measurement mapping
  const getEquipmentCoordinates = () => {
    const coordinates = {
      cassette: {
        position: showCassette ? (isMobile ? [-2, 1.5, 0] : [-1, -2.20, 1.1]) : null,
        offset: cassetteOffset,
        baselineZ: cassetteBaselineZ,
        actualZ: cassetteBaselineZ !== null ? cassetteBaselineZ + cassetteOffset : null
      },
      verticalA: {
        position: showVerticalA ? (isMobile ? [-2, 1.5, 0] : [1.5, -3.15, 3]) : null,
        offset: verticalAOffset,
        baselineZ: verticalABaselineZ,
        actualZ: verticalABaselineZ !== null ? verticalABaselineZ + verticalAOffset : null
      },
      verticalB: {
        position: showVerticalB ? (isMobile ? [-2 + verticalBHorizontalOffset, 1.5, 0] : [1 + verticalBHorizontalOffset, -2.5, -2.2]) : null,
        offset: verticalBOffset,
        horizontalOffset: verticalBHorizontalOffset,
        baselineZ: verticalBBaselineZ,
        actualZ: verticalBBaselineZ !== null ? verticalBBaselineZ + verticalBOffset : null
      }
    };

    return coordinates;
  };

  // Function to determine result image based on model rotation
  const getResultImage = () => {
    switch (baseRotation) {
      case 'front':
        return '/Images/Result/Front1.jpg';
      case 'back':
        return '/Images/Result/Back1.png';
      case 'side-right':
      case 'side-left':
        return `/Images/Result/${Math.random() < 0.5 ? 'Right1.png' : 'Right2.png'}`;
      default:
        return '/Images/Result/Front1.jpg';
    }
  };

const animationHandlers = {
  handleCameraAnimation: triggerCameraAnimation,
};

// Dashboard position styles (responsive and centered on desktop)
const dashboardStyle = {
  position: 'absolute',
  zIndex: 10,
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '12px',
  padding: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease-in-out',
  ...(isMobile
    ? { // Mobile styles: Top-center
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '400px',
        maxHeight: '40vh',
        overflowY: 'auto'
      }
    : { // Desktop styles: Left-center
        top: '30%',
        left: '2rem',
        transform: 'translateY(-50%)',
        width: '20%',
        minWidth: '250px',
      }),
};

return (
    <LessonAnimationProvider>
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        {/* Loading Indicator */}
        {isLoading && <LoadingIndicator />}
        
        {/* 3D Human Model Canvas */}
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {(() => {
              // Very subtle body lift based on head tilt magnitude (negative radians = tilting up)
              const tilt = headControl.rotation.tilt || 0;
              const liftFromNegativeTilt = Math.max(0, -tilt) * 0.02; // gentler scale
              const bodyLift = Math.min(0.03, liftFromNegativeTilt); // cap at 0.02
              return (
                <BodyMap
                  modelPath={modelType === 'skeleton' ? '/Model/skeleton.glb' : '/Model/base.glb'}
                  scale={modelType === 'skeleton' ? (isMobile ? 0.3 : 0.6) : (isMobile ? 1.7 : 2.4)}
                  isMobile={isMobile}
                  armsClosed={armsClosed}
                  armPosition={armPosition}
                  isLyingDown={isLyingDown}
                  baseRotation={baseRotation}
                  bodyLift={bodyLift}
                  onLoad={() => setIsLoading(false)}
                />
              );
            })()}
            
            {/* 3D X-ray Table - Only show when lesson is selected */}
            {showXRayTable && (
              <XRayTable3D 
                position={isMobile ? [0, -0.5, 0] : [0, -1.5, 0]} // Position directly under the sleeping model
                scale={isMobile ? 1.2 : 1.5} 
              />
            )}
            
            {/* 3D Cassette Model - Show when lesson is selected */}
            {showCassette && (
              <Cassette 
                key={`cassette-${resetKey}`}
                position={isMobile ? [-2, 1.5, 0] : [-1, -2.20, 0.8]} 
                scale={isMobile ? 0.5 : 1.3}
                rotation={[0, 0, 0]}
                heightOffset={cassetteOffset}
                baselineZ={cassetteBaselineZ}
                onPositionUpdate={handleCassettePositionUpdate}
              />
            )}
            
            {/* 3D Vertical Model A - Show when Twinning method is selected */}
            {showVerticalA && (
              <Vertical 
                key={`vertical-a-${resetKey}`}
                variant="A"
                position={isMobile ? [-2.5, 1.5, 0] : [1.5, -3.15, 3]} 
                scale={isMobile ? 0.3 : 0.3}
                rotation={[0, -Math.PI, 0]}
                heightOffset={verticalAOffset}
                tilt={verticalATilt} // Tilt angle in degrees
                baselineZ={verticalABaselineZ}
                onPositionUpdate={(actualZ, isBaseline) =>
                  handleVerticalBaselineUpdate('A', actualZ, isBaseline)
                }
              />
            )}
            {/* 3D Vertical Model B - Show when Pawlow method is selected */}
            {showVerticalB && (
              <Vertical 
                key={`vertical-b-${resetKey}`}
                variant="B"
                position={isMobile ? [-2 + verticalBHorizontalOffset, 1.5, 0] : [1 + verticalBHorizontalOffset, -2.5, -2.2]} 
                scale={isMobile ? 0.3 : 0.3}
                rotation={[0, Math.PI, 0]}
                heightOffset={verticalBOffset}
                tilt={verticalBTilt} // Tilt angle in degrees
                baselineZ={verticalBBaselineZ}
                onPositionUpdate={(actualZ, isBaseline) =>
                  handleVerticalBaselineUpdate('B', actualZ, isBaseline)
                }
              />
            )}
            
            {/* Animation Controllers */}
            <CameraController
              targetPosition={cameraAnimation.targetPosition}
              targetLookAt={cameraAnimation.targetLookAt}
              duration={cameraAnimation.duration}
              isActive={cameraAnimation.isActive}
              onComplete={handleCameraComplete}
            />
            
            
            {/* Head Animation Controller */}
            <HeadAnimationController
              headRotation={headControl.rotation}
              headPosition={headControl.position}
              meshName="CC_Base_Head"
              debug={true}
            />

            {/* Camera and orbit controls */}
            <OrbitControls
              ref={orbitControlsRef}
              enablePan={true}
              enableRotate={true}
              minDistance={0.5}
              maxDistance={20}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.4}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>

        
        {/* Hide all control panels during post-exposure */}
        {simulationStep !== 'post-exposure' && (
          <>
            {/* Lesson Dashboard */}
            <div style={dashboardStyle}>
          <LessonDashboard
            onLessonSelected={(data) => {
              // Handle flashcard mode
              if (data.mode === "flashcard") {
                setShowFlashcards(true);
                setCurrentFlashcardData(data);
                setBaseRotation('back'); // Rotate model to show back
                return;
              }

              // Handle practical lessons
              const isTableTopMethod = data.categoryTitle && data.categoryTitle.includes('Table Top');

              // Mark that a lesson has been selected
              setHasLessonSelected(true);

              if (isTableTopMethod) {
                // Table Top Method: Show x-ray table and Vertical B only, make model lie down
                setShowXRayTable(true);
                setShowCassette(false);  // Remove cassette for Table Top method
                setShowVerticalA(false);
                setShowVerticalB(true);
                handleArmPositionChange('closed');
                setVerticalBOffset(0);
                setVerticalBTilt(0); // Reset tilt
                setVerticalBHorizontalOffset(0);
                setIsLyingDown(true);
              } else {
                // Upright Position Method: Keep standing, show cassette and Vertical A, arms closer to torso
                setShowXRayTable(false);
                setShowCassette(true);
                setShowVerticalA(true);
                setShowVerticalB(false);
                handleArmPositionChange('twinning');
                setCassetteOffset(0);
                setVerticalAOffset(0);
                setVerticalATilt(0); // Reset tilt
                setIsLyingDown(false);
              }
            }}
            onReset={handleReset}
          />
          {/* Model Type Toggle - inside dashboard card */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(0,0,0,0.08)'
          }}>
            <div style={{
              display: 'flex',
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              borderRadius: '32px',
              padding: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.1)',
              gap: '2px'
            }}>
              {['base', 'skeleton'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setIsLoading(true);
                    setModelType(type);
                  }}
                  style={{
                    padding: '6px 18px',
                    borderRadius: '28px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.03em',
                    transition: 'all 0.25s ease',
                    backgroundColor: modelType === type ? '#14b8a6' : 'transparent',
                    color: modelType === type ? '#fff' : 'rgba(255,255,255,0.5)',
                    boxShadow: modelType === type ? '0 2px 8px rgba(20,184,166,0.4)' : 'none',
                  }}
                >
                  {type === 'base' ? 'Body' : 'Skeleton'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flashcard Viewer - Shows when flashcard lesson is selected */}
        {showFlashcards && currentFlashcardData && (
          <FlashcardViewer
            flashcards={currentFlashcardData.lessonData.flashcards}
            categoryTitle={currentFlashcardData.categoryTitle}
            onClose={() => {
              setShowFlashcards(false);
              setCurrentFlashcardData(null);
            }}
            onReset={handleReset}
            onFocusChange={(focusTarget) => {
              // Future: Can trigger camera animation to focus on specific anatomy
              console.log('Focus on:', focusTarget);
            }}
          />
        )}

        {/* Control Tray - Shows when lesson is selected */}
        <ControlTray
          hasLessonSelected={hasLessonSelected}
          showModelRotation={showModelRotationPanel}
          showEquipment={showEquipmentPanel}
          showHeadControl={showHeadControlPanel}
          simulationStep={simulationStep}
          isPawlowMethod={showVerticalB}
          onToggleModelRotation={toggleModelRotation}
          onToggleEquipment={toggleEquipment}
          onToggleHeadControl={toggleHeadControl}
          onDonePositioning={handleDonePositioning}
        />

        {/* Equipment Controls - Only show when panel is toggled */}
        {showEquipmentPanel && (
          <EquipmentControls
            showCassette={showCassette}
            showVertical={showVerticalA || showVerticalB}
            showVerticalB={showVerticalB}
            showVerticalA={showVerticalA}
            verticalLabel={showVerticalA ? 'Collimator' : showVerticalB ? 'Collimator' : 'Vertical'}
            verticalATilt={verticalATilt}
            verticalBTilt={verticalBTilt}
            onAdjustCassette={handleAdjustCassette}
            onAdjustVertical={handleAdjustVertical}
            onAdjustVerticalBHorizontal={showVerticalB ? handleAdjustVerticalBHorizontal : undefined}
            onAdjustVerticalATilt={showVerticalA ? handleAdjustVerticalATilt : undefined}
            onAdjustVerticalBTilt={showVerticalB ? handleAdjustVerticalBTilt : undefined}
          />
        )}

        {/* Head Controller - Only show when panel is toggled */}
        {showHeadControlPanel && (
          <HeadController
            onHeadControl={updateHeadControl}
            onResetHead={resetHeadControl}
          />
        )}

        {/* Model Rotation Controls - Only show when panel is toggled */}
        {showModelRotationPanel && (
          <ModelRotationControls
            currentRotation={baseRotation}
            onRotationChange={handleRotationChange}
            isPawlowMethod={showVerticalB}
            isTwinningMethod={showVerticalA}
            armPosition={armPosition}
            onArmPositionChange={handleArmPositionChange}
          />
        )}
          </>
        )}

        {/* Register animation handlers */}
        <AnimationHandlerRegistrar handlers={animationHandlers} />

        {/* Body Thickness Input Panel - Shows after Done Positioning */}
        {simulationStep === 'thickness-input' && (
          <div style={{
            position: 'absolute',
            top: isMobile ? '80px' : '90px',
            right: isMobile ? '20px' : '30px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            zIndex: 1000,
            minWidth: isMobile ? '280px' : '350px',
            maxWidth: isMobile ? '90%' : '400px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#4CAF50' }}>Enter Body Thickness</h3>
            <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
              Please measure and enter the patient's body thickness:
            </p>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Body Thickness (cm):
              </label>
              <input
                type="number"
                value={bodyThickness || ''}
                onChange={(e) => setBodyThickness(e.target.value)}
                placeholder="Enter thickness (15-35 cm)"
                min="15"
                max="35"
                step="0.1"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
            </div>
            
            <div style={{ 
              marginBottom: '15px', 
              padding: '10px', 
              backgroundColor: 'rgba(33, 150, 243, 0.1)', 
              borderRadius: '6px',
              fontSize: '12px',
              border: '1px solid rgba(33, 150, 243, 0.3)'
            }}>
              <strong style={{ color: '#2196F3' }}>System will calculate:</strong><br/>
              • Optimal kVp based on 15% rule<br/>
              • Optimal mAs for body thickness<br/>
              • Display appropriate radiographic image
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleThicknessSubmit}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Calculate & Show Results
              </button>
              <button
                onClick={() => {
                  setSimulationStep('positioning');
                  setBodyThickness(null);
                }}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Post-Exposure Display */}
        {simulationStep === 'post-exposure' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            zIndex: 1000,
            minWidth: isMobile ? '350px' : '600px',
            maxWidth: isMobile ? '95%' : '800px',
            maxHeight: isMobile ? '90vh' : '85vh',
            overflowY: 'auto',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#4CAF50' }}> Exposure Complete</h2>
            
            <div style={{ marginBottom: '20px', fontSize: '16px' }}>
              <p><strong>Body Thickness:</strong> {bodyThickness} cm</p>
              <p><strong>Calculated kVp:</strong> {userCalculations.kVp}</p>
              <p><strong>Calculated mAs:</strong> {userCalculations.mAs}</p>
            </div>
            
            {/* Result Image Display */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2196F3', fontSize: '18px' }}>
                Radiographic Result
              </h3>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px'
              }}>
                <img
                  src={getResultImage()}
                  alt="Radiographic Result"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    width: 'auto',
                    height: 'auto',
                    borderRadius: '6px',
                    border: '2px solid #4CAF50',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.src = '/Images/Result/Front1.jpg';
                  }}
                />
              </div>
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#ccc' }}>
                Image selected based on model rotation: {baseRotation}
              </p>
            </div>
            
            {/* New div added here */}
            <div style={{ 
              padding: '15px', 
              backgroundColor: 'rgba(76, 175, 80, 0.2)', 
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #4CAF50'
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Simulation Complete!</strong><br/>
                The radiographic exposure has been successfully calculated and applied.<br/>
                The exposure factors have been optimized based on the body thickness and positioning.
              </p>
            </div>
            
            <button
              onClick={() => {
                // First reset to clean state, then start new positioning
                handleReset();
                setTimeout(() => {
                  setSimulationStep('positioning');
                  setBodyThickness(null);
                  setUserCalculations({ kVp: '', mAs: '' });
                }, 100);
              }}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Start New Positioning
            </button>
          </div>
        )}
      </div>
    </LessonAnimationProvider>
  );
}

export default ModelLoader;
