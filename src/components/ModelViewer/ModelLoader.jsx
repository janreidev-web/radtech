// src/components/ModelLoader.jsx
import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BodyMap from './ModelHelper/Body';
import ModelToolTip from './ModelHelper/ModelToolTip';
import LessonDashboard from './LessonHandler/LessonDashboard';

function ModelLoader() {
  const [isMobile, setIsMobile] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // ✅ Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Handle body part click
  const handlePartClick = (data, screenPosition) => {
    setLastClicked(data);
    setTooltipPosition(screenPosition);

    // Auto-hide tooltip after 3 seconds
    setTimeout(() => setLastClicked(null), 3000);
  };

  // ✅ Close tooltip manually
  const handleCloseTooltip = () => setLastClicked(null);

  // ✅ Dashboard position styles (responsive)
  const dashboardStyle = {
    position: 'absolute',
    zIndex: 10,
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease-in-out',
    ...(isMobile
      ? {
          top: '0.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '400px',
        }
      : {
          top: '15%',
          left: '1rem',
          transform: 'translateY(-50%)',
          width: '20%',
          minWidth: '250px',
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

      {/* 🧠 Lesson Dashboard (Left on Desktop, Top-Center on Mobile) */}
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
