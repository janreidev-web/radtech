import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BodyMap from './ModelHelper/Body';
import ModelToolTip from './ModelHelper/ModelToolTip';

function ModelLoader() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('');
  const [labeledPoints, setLabeledPoints] = useState({});
  const [lastClicked, setLastClicked] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false); // Collapse state

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto-collapse on mobile by default
      setIsCollapsed(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePartClick = (data) => {
    setLastClicked(data);
    if (!currentLabel.trim()) {
      alert('Please enter a label before clicking.');
      return;
    }

    const { x, y, z } = data;
    setLabeledPoints((prev) => ({
      ...prev,
      [currentLabel]: [...(prev[currentLabel] || []), { x, y, z }],
    }));
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
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

      {/* Toggle Button for Mobile */}
      {isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 20,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isCollapsed ? '☰' : '✕'}
        </button>
      )}

      {/* Sidebar UI - Collapsible on Mobile */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '0' : '40px',
          left: isMobile ? '0' : '40px',
          transform: isMobile && isCollapsed ? 'translateX(-100%)' : 'none',
          transition: 'transform 0.3s ease-in-out',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: isMobile ? '0' : '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          padding: isMobile ? '10px' : '20px',
          width: isMobile ? '100%' : '280px',
          maxHeight: isMobile ? '50vh' : 'auto',
          overflowY: 'auto',
          zIndex: 10,
        }}
      >
        <h2 
          className="text-xl font-bold mb-2" 
          style={{ 
            fontSize: isMobile ? '16px' : '20px',
            marginBottom: isMobile ? '8px' : '12px'
          }}
        >
          Label Body Points
        </h2>

        <input
          type="text"
          placeholder="Enter label"
          value={currentLabel}
          onChange={(e) => setCurrentLabel(e.target.value)}
          style={{
            width: '100%',
            padding: isMobile ? '6px' : '8px',
            marginBottom: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: isMobile ? '12px' : '14px',
          }}
        />

        {lastClicked && (
          <div style={{ 
            borderTop: '1px solid #ccc', 
            paddingTop: '8px',
            marginBottom: '8px'
          }}>
            <ModelToolTip
              name={lastClicked.name}
              x={lastClicked.x}
              y={lastClicked.y}
              z={lastClicked.z}
            />
          </div>
        )}

        {Object.keys(labeledPoints).length > 0 && (
          <div
            style={{
              textAlign: 'left',
              fontSize: isMobile ? '11px' : '14px',
              maxHeight: isMobile ? '150px' : '200px',
              overflowY: 'auto',
              marginTop: '8px',
              borderTop: '1px solid #ccc',
              paddingTop: '8px',
            }}
          >
            {Object.entries(labeledPoints).map(([label, points]) => (
              <div key={label} style={{ marginBottom: '8px' }}>
                <strong>{label}</strong>
                <ul style={{ marginLeft: '12px', marginTop: '4px' }}>
                  {points.slice(0, 3).map((p, i) => (
                    <li key={i} style={{ fontSize: isMobile ? '10px' : '12px' }}>
                      x: {p.x}, y: {p.y}, z: {p.z}
                    </li>
                  ))}
                  {points.length > 3 && (
                    <li style={{ color: '#666' }}>
                      +{points.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelLoader;
