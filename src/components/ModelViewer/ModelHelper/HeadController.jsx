import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw 
} from 'lucide-react';

function HeadController({ onHeadControl, onResetHead }) {
  const [tilt, setTilt] = useState(0); // X rotation
  const [turn, setTurn] = useState(0); // Y rotation
  const [posY, setPosY] = useState(0); // Y position

  const degreeToRadian = Math.PI / 180; // 1 degree in radians

  const handleTiltUp = () => {
    const newTilt = tilt - degreeToRadian;
    setTilt(newTilt);
    onHeadControl({ tilt: newTilt, turn, posY });
  };

  const handleTiltDown = () => {
    const newTilt = tilt + degreeToRadian;
    setTilt(newTilt);
    onHeadControl({ tilt: newTilt, turn, posY });
  };

  const handleTurnLeft = () => {
    const newTurn = turn - degreeToRadian;
    setTurn(newTurn);
    onHeadControl({ tilt, turn: newTurn, posY });
  };

  const handleTurnRight = () => {
    const newTurn = turn + degreeToRadian;
    setTurn(newTurn);
    onHeadControl({ tilt, turn: newTurn, posY });
  };

  const handleReset = () => {
    setTilt(0);
    setTurn(0);
    setPosY(0);
    onResetHead();
  };

  const tiltDegrees = Math.round((tilt * -180) / Math.PI);
  const turnDegrees = Math.round((turn * -180) / Math.PI);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Controller</h3>
      
      {/* Angle Display */}
      <div style={styles.angleDisplay}>
        <div style={styles.angleItem}>
          <span style={styles.angleLabel}>Tilt:</span>
          <span style={styles.angleValue}>{tiltDegrees}°</span>
        </div>
        <div style={styles.angleItem}>
          <span style={styles.angleLabel}>Turn:</span>
          <span style={styles.angleValue}>{turnDegrees}°</span>
        </div>
      </div>
      
      {/* Tilt and Turn Controls */}
      <div style={styles.controlGrid}>
        {/* Top Row - Tilt Up */}
        <div style={styles.buttonRow}>
          <div style={styles.emptyCell}></div>
          <button 
            style={styles.button} 
            onClick={handleTiltUp}
            title="Tilt Up"
          >
            <ArrowUp size={28} />
          </button>
          <div style={styles.emptyCell}></div>
        </div>
        
        {/* Middle Row - Turn Left/Right */}
        <div style={styles.buttonRow}>
          <button 
            style={styles.button} 
            onClick={handleTurnLeft}
            title="Turn Left"
          >
            <ArrowLeft size={28} />
          </button>
          <div style={styles.emptyCell}></div>
          <button 
            style={styles.button} 
            onClick={handleTurnRight}
            title="Turn Right"
          >
            <ArrowRight size={28} />
          </button>
        </div>
        
        {/* Bottom Row - Tilt Down */}
        <div style={styles.buttonRow}>
          <div style={styles.emptyCell}></div>
          <button 
            style={styles.button} 
            onClick={handleTiltDown}
            title="Tilt Down"
          >
            <ArrowDown size={28} />
          </button>
          <div style={styles.emptyCell}></div>
        </div>
      </div>

      {/* Reset Button */}
      <button 
        style={styles.resetButton} 
        onClick={handleReset}
        title="Reset Head Position"
      >
        <RotateCcw size={16} style={{ marginRight: '8px' }} />
        Reset Head Position
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    right: '2rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '200px',
    zIndex: 100,
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  angleDisplay: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '1rem',
    gap: '1rem',
  },
  angleItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  controlGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  emptyCell: {
    width: '60px',
    height: '60px',
  },
  button: {
    width: '60px',
    height: '60px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  angleLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '500',
  },
  angleValue: {
    fontSize: '1.25rem',
    color: '#1a1a1a',
    fontWeight: '700',
  },
  resetButton: {
    width: '100%',
    padding: '0.75rem',
    background: '#64748b',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default HeadController;
