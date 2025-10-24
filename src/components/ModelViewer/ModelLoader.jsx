// src/components/ModelLoader.jsx
import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BodyMap from './ModelHelper/Body';
import ModelToolTip from './ModelHelper/ModelToolTip';
import XRayTable3D from './ModelHelper/XRayTable3D';
import LessonDashboard from './LessonHandler/LessonDashboard';
import CameraController from './ModelHelper/CameraController';
import VisualGuideController from './ModelHelper/VisualGuideController';
import { LessonAnimationProvider } from './LessonHandler/LessonAnimationContext';
import AnimationHandlerRegistrar from './LessonHandler/AnimationHandlerRegistrar';

function ModelLoader() {
  const [isMobile, setIsMobile] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipTimerRef = useRef(null); // Ref to hold the timer ID
  const [showXRayTable, setShowXRayTable] = useState(false);
  const [armsClosed, setArmsClosed] = useState(false);
  const [isLyingDown, setIsLyingDown] = useState(false);
  
  // Lesson animation states
  const [cameraAnimation, setCameraAnimation] = useState({
    isActive: false,
    targetPosition: null,
    targetLookAt: null,
    duration: 2000
  });
  
  const [visualGuide, setVisualGuide] = useState({
    isActive: false,
    guideType: null,
    guideData: null,
    duration: 2000
  });

  // ✅ Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Manage tooltip auto-hide timer
  useEffect(() => {
    // Clear any existing timer when the component unmounts or lastClicked changes
    clearTimeout(tooltipTimerRef.current);

    // If a part is clicked, set a new timer to hide the tooltip
    if (lastClicked) {
      tooltipTimerRef.current = setTimeout(() => {
        setLastClicked(null);
      }, 3000);
    }

    // Cleanup function to clear the timer
    return () => clearTimeout(tooltipTimerRef.current);
  }, [lastClicked]); // This effect runs whenever 'lastClicked' changes

  // ✅ Handle body part click (memoized with useCallback)
  const handlePartClick = useCallback((data, screenPosition) => {
    setLastClicked(data);
    setTooltipPosition(screenPosition);
  }, []); // Empty dependency array means this function is created only once

  // ✅ Close tooltip manually (memoized with useCallback)
  const handleCloseTooltip = useCallback(() => {
    setLastClicked(null);
  }, []);

  // ✅ Lesson animation handlers
  const handleCameraAnimation = useCallback((action) => {
    setCameraAnimation({
      isActive: true,
      targetPosition: action.position,
      targetLookAt: action.lookAt,
      duration: action.duration || 2000
    });
  }, []);

  const handleVisualGuide = useCallback((guide) => {
    setVisualGuide({
      isActive: true,
      guideType: guide.type,
      guideData: guide,
      duration: guide.duration || 2000
    });
  }, []);

  // ✅ Animation completion handlers
  const handleCameraComplete = useCallback(() => {
    setCameraAnimation(prev => ({ ...prev, isActive: false }));
  }, []);

  const handleVisualComplete = useCallback(() => {
    setVisualGuide(prev => ({ ...prev, isActive: false }));
  }, []);

  // ✅ Handle reset functionality
  const handleReset = useCallback(() => {
    setShowXRayTable(false); // Hide X-ray table on reset
    setLastClicked(null); // Clear any tooltips
    setArmsClosed(false); // Reset arms to original position
    setIsLyingDown(false); // Return to standing position
  }, []);

  // ✅ Register animation handlers with context
  const animationHandlers = {
    handleCameraAnimation,
    handleVisualGuide
  };

  // ✅ Dashboard position styles (responsive and centered on desktop)
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
        {/* 🧍 3D Human Model Canvas */}
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <BodyMap
              scale={isMobile ? 1.7 : 2.4}
              isMobile={isMobile}
              onPartClick={handlePartClick}
              armsClosed={armsClosed}
              isLyingDown={isLyingDown}
            />
            
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
            
            <VisualGuideController
              guideType={visualGuide.guideType}
              guideData={visualGuide.guideData}
              duration={visualGuide.duration}
              isActive={visualGuide.isActive}
              onComplete={handleVisualComplete}
            />
            
            <OrbitControls />
          </Suspense>
        </Canvas>

        {/* 🧠 Lesson Dashboard */}
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

        {/* 💬 Floating Tooltip */}
        {lastClicked && (
          <ModelToolTip
            name={lastClicked.name}
            x={lastClicked.x}
            y={lastClicked.y}
            z={lastClicked.z}
            screenX={tooltipPosition.x}
            screenY={tooltipPosition.y}
            isMobile={isMobile}
            onClose={handleCloseTooltip}
          />
        )}
      </div>
    </LessonAnimationProvider>
  );
}

export default ModelLoader;