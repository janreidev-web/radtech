import React from 'react';

function ControlTray({ 
  onToggleModelRotation, 
  onToggleEquipment, 
  onToggleHeadControl,
  onDonePositioning,
  showModelRotation,
  showEquipment,
  showHeadControl,
  hasLessonSelected,
  simulationStep,
  isPawlowMethod = false
}) {
  if (!hasLessonSelected) {
    return null;
  }

  const isMobile = window.innerWidth <= 768;

  const trayStyle = {
    position: 'absolute',
    top: isMobile ? '20px' : '30px',
    right: isMobile ? '20px' : '30px',
    display: 'flex',
    gap: '12px',
    backgroundColor: 'rgba(50, 50, 50, 0.95)',
    borderRadius: '12px',
    padding: '12px 16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    zIndex: 1000,
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)'
  };
  

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: isMobile ? '100px' : '140px',
    backgroundColor: 'rgba(255,255,255,0.1)'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2196F3',
    border: '2px solid #1976D2',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
    transform: 'scale(1.05)'
  };

  return (
    <div style={trayStyle}>
      {!isPawlowMethod && (
        <button
          style={showModelRotation ? activeButtonStyle : buttonStyle}
          onClick={onToggleModelRotation}
          onMouseEnter={(e) => {
            if (!showModelRotation) {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showModelRotation) {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
          }}
        >
          Model Rotation
        </button>
      )}
      
      <button
        style={showEquipment ? activeButtonStyle : buttonStyle}
        onClick={onToggleEquipment}
        onMouseEnter={(e) => {
          if (!showEquipment) {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (!showEquipment) {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }
        }}
      >
        Equipment
      </button>
      
      <button
        style={showHeadControl ? activeButtonStyle : buttonStyle}
        onClick={onToggleHeadControl}
        onMouseEnter={(e) => {
          if (!showHeadControl) {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (!showHeadControl) {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }
        }}
      >
        Head Control
      </button>

      {simulationStep === 'positioning' && (
        <button
          style={{
            ...buttonStyle,
            backgroundColor: '#4CAF50',
            border: '2px solid #45a049',
            minWidth: isMobile ? '120px' : '160px'
          }}
          onClick={onDonePositioning}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#45a049';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#4CAF50';
          }}
        >
          Done Positioning
        </button>
      )}
    </div>
  );
}

export default ControlTray;

