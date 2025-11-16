import React, { useRef, useCallback, useEffect } from 'react';

const LONG_PRESS_DELAY = 300;
const LONG_PRESS_INTERVAL = 100;

function useLongPressHandlers(adjustFn) {
  const stateRef = useRef({
    timeoutId: null,
    intervalId: null,
    pointerActive: false,
    ignoreClick: false
  });

  const clearTimers = useCallback(() => {
    const state = stateRef.current;
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
    state.pointerActive = false;
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const startPress = useCallback((event) => {
    event.preventDefault();
    const state = stateRef.current;
    state.pointerActive = true;
    state.ignoreClick = true;
    adjustFn();
    state.timeoutId = setTimeout(() => {
      state.intervalId = setInterval(() => {
        adjustFn();
      }, LONG_PRESS_INTERVAL);
    }, LONG_PRESS_DELAY);
  }, [adjustFn]);

  const stopPress = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleClick = useCallback((event) => {
    const state = stateRef.current;
    if (state.ignoreClick) {
      state.ignoreClick = false;
      event.preventDefault();
      return;
    }
    adjustFn();
  }, [adjustFn]);

  return {
    onMouseDown: startPress,
    onTouchStart: startPress,
    onMouseUp: stopPress,
    onMouseLeave: stopPress,
    onTouchEnd: stopPress,
    onTouchCancel: stopPress,
    onBlur: stopPress,
    onClick: handleClick
  };
}

function EquipmentControls({
  showCassette,
  showVertical,
  cassetteOffset,
  verticalOffset,
  onAdjustCassette,
  onAdjustVertical
}) {
  // Only show controls if at least one equipment is visible
  if (!showCassette && !showVertical) {
    return null;
  }

  const step = 1;

  const cassetteIncrease = useCallback(() => onAdjustCassette(step), [onAdjustCassette]);
  const cassetteDecrease = useCallback(() => onAdjustCassette(-step), [onAdjustCassette]);
  const verticalIncrease = useCallback(() => onAdjustVertical(step), [onAdjustVertical]);
  const verticalDecrease = useCallback(() => onAdjustVertical(-step), [onAdjustVertical]);

  const cassetteUpHandlers = useLongPressHandlers(cassetteIncrease);
  const cassetteDownHandlers = useLongPressHandlers(cassetteDecrease);
  const verticalUpHandlers = useLongPressHandlers(verticalIncrease);
  const verticalDownHandlers = useLongPressHandlers(verticalDecrease);

  const buttonStyle = {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s',
    minWidth: '80px'
  };

  const downButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336'
  };

  const valueStyle = {
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    borderRadius: '5px',
    textAlign: 'center',
    minWidth: '80px'
  };

  const isMobile = window.innerWidth <= 768;

  // Calculate top position to be below rotation controls
  // Rotation controls panel is approximately 100px tall including padding
  const rotationControlsHeight = 100;
  const topOffset = isMobile ? '60%' : `${20 + rotationControlsHeight + 12}px`; // 12px gap

  const panelStyle = {
    position: 'absolute',
    top: topOffset,
    right: '20px',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    zIndex: 1000,
    minWidth: '200px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const titleStyle = {
    color: '#ccc',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '4px'
  };

  const controlsRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <div style={panelStyle}>
      <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
        EQUIPMENT
      </div>
      
      {showCassette && (
        <div style={sectionStyle}>
          <div style={titleStyle}>Cassette</div>
          <div style={controlsRowStyle}>
            <button 
              style={buttonStyle} 
              {...cassetteUpHandlers}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
            >
              ↑ Up
            </button>
            <button 
              style={downButtonStyle} 
              {...cassetteDownHandlers}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#da190b'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
            >
              ↓ Down
            </button>
            <div style={valueStyle}>
              Height: {Math.max(0, cassetteOffset).toFixed(2)} cm
            </div>
          </div>
        </div>
      )}

      {showVertical && (
        <div style={sectionStyle}>
          <div style={titleStyle}>Vertical</div>
          <div style={controlsRowStyle}>
            <button 
              style={buttonStyle} 
              {...verticalUpHandlers}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
            >
              ↑ Up
            </button>
            <button 
              style={downButtonStyle} 
              {...verticalDownHandlers}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#da190b'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
            >
              ↓ Down
            </button>
            <div style={valueStyle}>
              Height: {Math.max(0, verticalOffset).toFixed(2)} cm
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentControls;

