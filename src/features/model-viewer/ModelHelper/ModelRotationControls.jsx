import React from 'react';

function ModelRotationControls({ currentRotation, onRotationChange, isPawlowMethod = false, armPosition, onArmPositionChange }) {
  const buttonStyle = {
    padding: '10px 16px',
    fontSize: '14px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'all 0.3s',
    minWidth: '100px',
    fontWeight: '500'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1976D2',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transform: 'scale(1.05)'
  };

  const isMobile = window.innerWidth <= 768;

  const panelStyle = {
    position: 'absolute',
    top: '120px',
    right: '50px',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    width: isMobile ? 'calc(100% - 40px)' : 'auto',
    maxWidth: isMobile ? '400px' : 'none'
  };

  const titleStyle = {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '4px',
    textAlign: 'center'
  };

  const buttonsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isPawlowMethod ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
    gap: '8px',
    width: '100%'
  };

  // Different rotation options based on method
  const rotations = isPawlowMethod 
    ? [
        { key: 'front', label: 'Front' },
        { key: 'back', label: 'Back' }
      ]
    : [
        { key: 'front', label: 'Front' },
        { key: 'side-right', label: 'Side Right' },
        { key: 'side-left', label: 'Side Left' },
        { key: 'back', label: 'Back' }
      ];

  return (
    <div style={panelStyle}>
      <div style={titleStyle}>Model Rotation</div>
      <div style={buttonsContainerStyle}>
        {rotations.map((rotation) => (
          <button
            key={rotation.key}
            style={currentRotation === rotation.key ? activeButtonStyle : buttonStyle}
            onClick={() => onRotationChange(rotation.key)}
            onMouseEnter={(e) => {
              if (currentRotation !== rotation.key) {
                e.target.style.backgroundColor = '#42A5F5';
              }
            }}
            onMouseLeave={(e) => {
              if (currentRotation !== rotation.key) {
                e.target.style.backgroundColor = '#2196F3';
              }
            }}
          >
            {rotation.label}
          </button>
        ))}
      </div>

      {onArmPositionChange && (
        <>
          <div style={{ ...titleStyle, marginTop: '8px' }}>Arm Position</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '8px',
            width: '100%'
          }}>
            {[
              { key: 'default', label: 'Default' },
              { key: 'twinning', label: 'Twinning' },
              { key: 'closed', label: 'Closed' },
              { key: 'left-arm-raised', label: 'Left Arm Raised' },
              { key: 'right-arm-raised', label: 'Right Arm Raised' },
              { key: 'crossed', label: 'Crossed' }
            ].map((position) => (
              <button
                key={position.key}
                style={armPosition === position.key ? activeButtonStyle : buttonStyle}
                onClick={() => onArmPositionChange(position.key)}
                onMouseEnter={(e) => {
                  if (armPosition !== position.key) {
                    e.target.style.backgroundColor = '#42A5F5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (armPosition !== position.key) {
                    e.target.style.backgroundColor = '#2196F3';
                  }
                }}
              >
                {position.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ModelRotationControls;

