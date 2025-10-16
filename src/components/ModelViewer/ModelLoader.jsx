// src/components/ModelLoader.jsx
import React, { useEffect, useState, Suspense, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BodyMap from './ModelHelper/Body';
import ModelToolTip from './ModelHelper/ModelToolTip';
import LessonDashboard from './LessonHandler/LessonDashboard';

function ModelLoader() {
  const [isMobile, setIsMobile] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipTimerRef = useRef(null); // Ref to hold the timer ID

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
          top: '50%',
          left: '2rem',
          transform: 'translateY(-50%)',
          width: '20%',
          minWidth: '250px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }),
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* 🧍 3D Human Model Canvas */}
      <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <BodyMap
            scale={isMobile ? 1.7 : 2.5}
            isMobile={isMobile}
            onPartClick={handlePartClick}
          />
          <OrbitControls />
        </Suspense>
      </Canvas>

      {/* 🧠 Lesson Dashboard */}
      <div style={dashboardStyle}>
        <LessonDashboard />
      </div>

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
  );
}

export default ModelLoader;