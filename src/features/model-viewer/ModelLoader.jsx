// src/components/ModelLoader.jsx
import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BodyMap from './ModelHelper/Body';
import XRayTable3D from './ModelHelper/XRayTable3D';
import Cassette from './ModelHelper/Cassette';
import Vertical from './ModelHelper/Vertical';
import LessonDashboard from './LessonHandler/LessonDashboard';
import CameraController from './ModelHelper/CameraController';
import HeadController from './ModelHelper/HeadController';
import HeadAnimationController from './ModelHelper/HeadAnimationController';
import CursorZoomController from './ModelHelper/CursorZoomController';
import LoadingIndicator from './ModelHelper/LoadingIndicator';
import { LessonAnimationProvider } from './LessonHandler/LessonAnimationContext';
import AnimationHandlerRegistrar from './LessonHandler/AnimationHandlerRegistrar';
import EquipmentControls from './ModelHelper/EquipmentControls';
import ModelRotationControls from './ModelHelper/ModelRotationControls';
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
  const [armPosition, setArmPosition] = useState('default');
  const [cassetteOffset, setCassetteOffset] = useState(0);
  const [verticalAOffset, setVerticalAOffset] = useState(0);
  const [verticalBOffset, setVerticalBOffset] = useState(0);
  const [verticalBHorizontalOffset, setVerticalBHorizontalOffset] = useState(0);
  const [cassetteBaselineZ, setCassetteBaselineZ] = useState(null);
  const [verticalABaselineZ, setVerticalABaselineZ] = useState(null);
  const [verticalBBaselineZ, setVerticalBBaselineZ] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [isLyingDown, setIsLyingDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [baseRotation, setBaseRotation] = useState('front');
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

  // Handle reset functionality
  const handleReset = useCallback(() => {
    // Reset offsets first
    setCassetteOffset(0); // Reset cassette offset to original position
    setVerticalAOffset(0);
    setVerticalBOffset(0);
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
    setArmsClosed(false); // Reset arms to original position
    setArmPosition('default'); // Reset arm position to default
    setIsLyingDown(false); // Return to standing position
    
    // Reset head control to default position
    resetHeadControl();

    // Reset base rotation to front
    setBaseRotation('front');
    
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
  const animationHandlers = {
    handleCameraAnimation: triggerCameraAnimation
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
          maxHeight: '80vh',
          overflowY: 'auto'
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
                  scale={isMobile ? 1.7 : 2.4}
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
                position={isMobile ? [-2, 1.5, 0] : [-1, -2.20, 1.1]} 
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
                position={isMobile ? [-2, 1.5, 0] : [1.5, -3.15, 3]} 
                scale={isMobile ? 0.3 : 0.3}
                rotation={[0, -Math.PI, 0]}
                heightOffset={verticalAOffset}
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
            
            {/* Cursor-based zoom controller */}
            <CursorZoomController controlsRef={orbitControlsRef} />
          </Suspense>
        </Canvas>

        {/* Lesson Dashboard */}
        <div style={dashboardStyle}>
          <LessonDashboard
            onLessonSelected={(lessonData) => {
              // Check if this is the Pawlow Method (recumbent setup)
              const isPawlowMethod = lessonData.categoryTitle && lessonData.categoryTitle.includes('Pawlow');
              
              if (isPawlowMethod) {
                // Pawlow Method: Show x-ray table and make model lie down
                setShowXRayTable(true);
                setShowCassette(false);
                setShowVerticalA(false);
                setShowVerticalB(true);
                handleArmPositionChange('closed');
                setCassetteOffset(0);
                setVerticalBOffset(0);
                setVerticalBHorizontalOffset(0);
                setIsLyingDown(true);
              } else {
                // Twinning Method: Keep standing, no x-ray table, no cassette, arms closer to torso
                setShowXRayTable(false);
                setShowCassette(true);
                setShowVerticalA(true);
                setShowVerticalB(false);
                handleArmPositionChange('twinning');
                setCassetteOffset(0);
                setVerticalAOffset(0);
                setIsLyingDown(false);
              }
            }}
            onReset={handleReset}
          />
        </div>
        {/* Equipment Controls - Only show when lesson is selected */}
        <EquipmentControls
          showCassette={showCassette}
          showVertical={showVerticalA || showVerticalB}
          showVerticalB={showVerticalB}
          verticalLabel={showVerticalA ? 'Vertical A' : showVerticalB ? 'Vertical B' : 'Vertical'}
          onAdjustCassette={handleAdjustCassette}
          onAdjustVertical={handleAdjustVertical}
          onAdjustVerticalBHorizontal={showVerticalB ? handleAdjustVerticalBHorizontal : undefined}
        />

        {/* Register animation handlers */}
        <AnimationHandlerRegistrar handlers={animationHandlers} />

        {/* 🎮 Head Controller (shown on desktop and mobile when X-ray table is active) */}
        {showXRayTable && (
          <HeadController
            onHeadControl={updateHeadControl}
            onResetHead={resetHeadControl}
          />
        )}

        {/* Model Rotation Controls */}
        <ModelRotationControls
          currentRotation={baseRotation}
          onRotationChange={setBaseRotation}
        />
      </div>
    </LessonAnimationProvider>
  );
}

export default ModelLoader;