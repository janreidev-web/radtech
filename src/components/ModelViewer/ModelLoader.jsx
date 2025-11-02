// src/components/ModelLoader.jsx
import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BodyMap from './ModelHelper/Body';
import XRayTable3D from './ModelHelper/XRayTable3D';
import LessonDashboard from './LessonHandler/LessonDashboard';
import CameraController from './ModelHelper/CameraController';
import HeadController from './ModelHelper/HeadController';
import HeadAnimationController from './ModelHelper/HeadAnimationController';
import CursorZoomController from './ModelHelper/CursorZoomController';
import { LessonAnimationProvider } from './LessonHandler/LessonAnimationContext';
import AnimationHandlerRegistrar from './LessonHandler/AnimationHandlerRegistrar';

function ModelLoader() {
  const [isMobile, setIsMobile] = useState(false);
  const [showXRayTable, setShowXRayTable] = useState(false);
  const [armsClosed, setArmsClosed] = useState(false);
  const [isLyingDown, setIsLyingDown] = useState(false);
  const orbitControlsRef = useRef();
  
  // Lesson animation states
  const [cameraAnimation, setCameraAnimation] = useState({
    isActive: false,
    targetPosition: null,
    targetLookAt: null,
    duration: 2000
  });
  
  
  
  // Head control states
  const [headControl, setHeadControl] = useState({
    rotation: { tilt: 0, turn: 0 },
    position: { y: 0 }
  });

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lesson animation handlers
  const handleCameraAnimation = useCallback((action) => {
    setCameraAnimation({
      isActive: true,
      targetPosition: action.position,
      targetLookAt: action.lookAt,
      duration: action.duration || 2000
    });
  }, []);

  

  // Animation completion handlers
  const handleCameraComplete = useCallback(() => {
    setCameraAnimation(prev => ({ ...prev, isActive: false }));
  }, []);

  

  // Head control handlers
  const handleHeadControl = useCallback((control) => {
    setHeadControl({
      rotation: { tilt: control.tilt, turn: control.turn },
      position: { y: control.posY }
    });
  }, []);

  const handleResetHead = useCallback(() => {
    setHeadControl({
      rotation: { tilt: 0, turn: 0 },
      position: { y: 0 }
    });
  }, []);

  // Handle reset functionality
  const handleReset = useCallback(() => {
    setShowXRayTable(false); // Hide X-ray table on reset
    setArmsClosed(false); // Reset arms to original position
    setIsLyingDown(false); // Return to standing position
    
    // Reset head control to default position
    setHeadControl({
      rotation: { tilt: 0, turn: 0 },
      position: { y: 0 }
    });
    
    // Reset camera animation state
    setCameraAnimation({
      isActive: false,
      targetPosition: null,
      targetLookAt: null,
      duration: 2000
    });
    
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
    handleCameraAnimation
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
                  isLyingDown={isLyingDown}
                  bodyLift={bodyLift}
                />
              );
            })()}
            
            {/* 3D X-ray Table - Only show when lesson is selected */}
            {showXRayTable && (
              <XRayTable3D 
                position={isMobile ? [0, -0.5, 0] : [0, -0.5, 0]} // Position directly under the sleeping model
                scale={isMobile ? 1.2 : 1.5} 
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
            onLessonSelected={() => {
              setShowXRayTable(true); // Show X-ray table when lesson is selected
              setArmsClosed(true); // Close arms when lesson is selected
              setIsLyingDown(true); // Make model lie down when lesson is selected
            }}
            onReset={handleReset}
          />
        </div>

        {/* Register animation handlers */}
        <AnimationHandlerRegistrar handlers={animationHandlers} />

        {/* 🎮 Head Controller (shown on desktop and mobile when X-ray table is active) */}
        {showXRayTable && (
          <HeadController
            onHeadControl={handleHeadControl}
            onResetHead={handleResetHead}
          />
        )}
      </div>
    </LessonAnimationProvider>
  );
}

export default ModelLoader;