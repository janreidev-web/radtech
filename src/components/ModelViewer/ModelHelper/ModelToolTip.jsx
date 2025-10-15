import React from 'react';

function ModelToolTip({ name, x, y, z, screenX, screenY, isMobile, onClose }) {
  // Calculate tooltip position to avoid going off-screen
  const tooltipStyle = {
    position: 'fixed',
    left: `${screenX}px`,
    top: `${screenY}px`,
    transform: 'translate(-50%, -120%)', // Center and position above cursor
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    padding: isMobile ? '10px 14px' : '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    fontSize: isMobile ? '12px' : '14px',
    zIndex: 1000,
    pointerEvents: 'auto',
    minWidth: isMobile ? '200px' : '250px',
    maxWidth: '90vw',
    animation: 'fadeIn 0.2s ease-in-out',
  };

  const headerStyle = {
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#4CAF50',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    paddingBottom: '6px',
  };

  const coordStyle = {
    fontSize: isMobile ? '11px' : '12px',
    color: '#ddd',
    marginTop: '4px',
    fontFamily: 'monospace',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '4px',
    right: '6px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '2px 6px',
    lineHeight: '1',
    opacity: 0.7,
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -120%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -120%) scale(1);
          }
        }
      `}</style>
      
      <div style={tooltipStyle}>
        <button 
          style={closeButtonStyle} 
          onClick={onClose}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
        >
          ✕
        </button>
        
        <div style={headerStyle}>
          {name}
        </div>
        
        <div style={coordStyle}>
          <div>Position:</div>
          <div>X: {x} | Y: {y} | Z: {z}</div>
        </div>
      </div>
    </>
  );
}

export default ModelToolTip;
