import React, { useState, useRef, useEffect } from 'react';
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
  // refs to hold latest values for use inside intervals
  const tiltRef = useRef(tilt);
  const turnRef = useRef(turn);
  const posYRef = useRef(posY);
  const repeatIntervalRef = useRef(null);
  const repeatTimeoutRef = useRef(null);

  const degreeToRadian = Math.PI / 180; // 1 degree in radians

  const handleTiltUp = () => {
    setTilt(prev => {
      const newTilt = prev - degreeToRadian;
      tiltRef.current = newTilt;
      onHeadControl({ tilt: newTilt, turn: turnRef.current, posY: posYRef.current });
      return newTilt;
    });
  };

  const handleTiltDown = () => {
    setTilt(prev => {
      const newTilt = prev + degreeToRadian;
      tiltRef.current = newTilt;
      onHeadControl({ tilt: newTilt, turn: turnRef.current, posY: posYRef.current });
      return newTilt;
    });
  };

  const handleTurnLeft = () => {
    setTurn(prev => {
      const newTurn = prev - degreeToRadian;
      turnRef.current = newTurn;
      onHeadControl({ tilt: tiltRef.current, turn: newTurn, posY: posYRef.current });
      return newTurn;
    });
  };

  const handleTurnRight = () => {
    setTurn(prev => {
      const newTurn = prev + degreeToRadian;
      turnRef.current = newTurn;
      onHeadControl({ tilt: tiltRef.current, turn: newTurn, posY: posYRef.current });
      return newTurn;
    });
  };

  const handleReset = () => {
    setTilt(0);
    tiltRef.current = 0;
    setTurn(0);
    turnRef.current = 0;
    setPosY(0);
    posYRef.current = 0;
    onResetHead();
  };

  // Keep refs in sync if state changes externally
  useEffect(() => { tiltRef.current = tilt; }, [tilt]);
  useEffect(() => { turnRef.current = turn; }, [turn]);
  useEffect(() => { posYRef.current = posY; }, [posY]);

  // Start a repeating action: call immediately, then after a short delay start interval
  const startContinuous = (action, { initialDelay = 300, interval = 80 } = {}) => {
    // clear existing
    stopContinuous();
    // call once immediately
    action();
    // after initialDelay, start interval repeats
    repeatTimeoutRef.current = setTimeout(() => {
      repeatIntervalRef.current = setInterval(action, interval);
    }, initialDelay);
  };

  const stopContinuous = () => {
    if (repeatTimeoutRef.current) {
      clearTimeout(repeatTimeoutRef.current);
      repeatTimeoutRef.current = null;
    }
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  };

  // Return pointer/touch/keyboard handlers for a button action
  const longPressProps = (action) => ({
    onMouseDown: (e) => { e.preventDefault(); startContinuous(action); },
    onMouseUp: stopContinuous,
    onMouseLeave: stopContinuous,
    onTouchStart: (e) => { e.preventDefault(); startContinuous(action); },
    onTouchEnd: stopContinuous,
    onTouchCancel: stopContinuous,
    onKeyDown: (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        startContinuous(action);
      }
    },
    onKeyUp: (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        stopContinuous();
      }
    }
  });

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
            title="Tilt Up"
            {...longPressProps(handleTiltUp)}
          >
            <ArrowUp size={28} />
          </button>
          <div style={styles.emptyCell}></div>
        </div>
        
        {/* Middle Row - Turn Left/Right */}
        <div style={styles.buttonRow}>
          <button 
            style={styles.button} 
            title="Turn Left"
            {...longPressProps(handleTurnLeft)}
          >
            <ArrowLeft size={28} />
          </button>
          <div style={styles.emptyCell}></div>
          <button 
            style={styles.button} 
            title="Turn Right"
            {...longPressProps(handleTurnRight)}
          >
            <ArrowRight size={28} />
          </button>
        </div>
        
        {/* Bottom Row - Tilt Down */}
        <div style={styles.buttonRow}>
          <div style={styles.emptyCell}></div>
          <button 
            style={styles.button} 
            title="Tilt Down"
            {...longPressProps(handleTiltDown)}
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
    zIndex: 10,
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
