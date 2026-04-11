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
  showVerticalB = false,
  showVerticalA = false,
  verticalLabel = 'Vertical',
  verticalATilt = 0,
  verticalBTilt = 0,
  onAdjustCassette,
  onAdjustVertical,
  onAdjustVerticalBHorizontal,
  onAdjustVerticalATilt,
  onAdjustVerticalBTilt
}) {
  // Only show controls if at least one equipment is visible
  if (!showCassette && !showVertical) {
    return null;
  }

  const step = 0.1;

  const cassetteIncrease = useCallback(() => onAdjustCassette(step + 0.9), [onAdjustCassette]);
  const cassetteDecrease = useCallback(() => onAdjustCassette(-step - 0.9), [onAdjustCassette]);
  const verticalIncrease = useCallback(() => onAdjustVertical(step + 0.9), [onAdjustVertical]);
  const verticalDecrease = useCallback(() => onAdjustVertical(-step - 0.9), [onAdjustVertical]);
  const verticalBLeft = useCallback(() => onAdjustVerticalBHorizontal && onAdjustVerticalBHorizontal(-step), [onAdjustVerticalBHorizontal]);
  const verticalBRight = useCallback(() => onAdjustVerticalBHorizontal && onAdjustVerticalBHorizontal(step), [onAdjustVerticalBHorizontal]);
  
  // Tilt step: 1 degree per click
  const tiltStep = 1;
  const tiltUp = useCallback(() => onAdjustVerticalATilt && onAdjustVerticalATilt(-tiltStep), [onAdjustVerticalATilt]);
  const tiltDown = useCallback(() => onAdjustVerticalATilt && onAdjustVerticalATilt(tiltStep), [onAdjustVerticalATilt]);
  
  // Table Top tilt handlers
  const tableTopTiltUp = useCallback(() => onAdjustVerticalBTilt && onAdjustVerticalBTilt(-tiltStep), [onAdjustVerticalBTilt]);
  const tableTopTiltDown = useCallback(() => onAdjustVerticalBTilt && onAdjustVerticalBTilt(tiltStep), [onAdjustVerticalBTilt]);

  const cassetteUpHandlers = useLongPressHandlers(cassetteIncrease);
  const cassetteDownHandlers = useLongPressHandlers(cassetteDecrease);
  const verticalUpHandlers = useLongPressHandlers(verticalIncrease);
  const verticalDownHandlers = useLongPressHandlers(verticalDecrease);
  const verticalBLeftHandlers = useLongPressHandlers(verticalBLeft);
  const verticalBRightHandlers = useLongPressHandlers(verticalBRight);
  const tiltUpHandlers = useLongPressHandlers(tiltUp);
  const tiltDownHandlers = useLongPressHandlers(tiltDown);
  const tableTopTiltUpHandlers = useLongPressHandlers(tableTopTiltUp);
  const tableTopTiltDownHandlers = useLongPressHandlers(tableTopTiltDown);

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

  const isMobile = window.innerWidth <= 768;

  // Calculate top position to be below rotation controls
  // Rotation controls panel is approximately 100px tall including padding
  const rotationControlsHeight = 100;
  const topOffset = isMobile ? '60%' : `${20 + rotationControlsHeight + 12}px`; // 12px gap

  const panelStyle = {
    position: 'absolute',
    top: '120px',
    right: '170px',
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
              onMouseDown={cassetteUpHandlers.onMouseDown}
              onMouseUp={cassetteUpHandlers.onMouseUp}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4CAF50';
                cassetteUpHandlers.onMouseLeave?.(e);
              }}
              onTouchStart={cassetteUpHandlers.onTouchStart}
              onTouchEnd={cassetteUpHandlers.onTouchEnd}
              onTouchCancel={cassetteUpHandlers.onTouchCancel}
              onBlur={cassetteUpHandlers.onBlur}
              onClick={cassetteUpHandlers.onClick}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
            >
              ↑ Up
            </button>
            <button
              style={downButtonStyle}
              onMouseDown={cassetteDownHandlers.onMouseDown}
              onMouseUp={cassetteDownHandlers.onMouseUp}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f44336';
                cassetteDownHandlers.onMouseLeave?.(e);
              }}
              onTouchStart={cassetteDownHandlers.onTouchStart}
              onTouchEnd={cassetteDownHandlers.onTouchEnd}
              onTouchCancel={cassetteDownHandlers.onTouchCancel}
              onBlur={cassetteDownHandlers.onBlur}
              onClick={cassetteDownHandlers.onClick}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#da190b'}
            >
              ↓ Down
            </button>
          </div>
        </div>
      )}

      {showVertical && (
        <div style={sectionStyle}>
          <div style={titleStyle}>{verticalLabel}</div>
          <div style={controlsRowStyle}>
            <button
              style={buttonStyle}
              onMouseDown={verticalUpHandlers.onMouseDown}
              onMouseUp={verticalUpHandlers.onMouseUp}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4CAF50';
                verticalUpHandlers.onMouseLeave?.(e);
              }}
              onTouchStart={verticalUpHandlers.onTouchStart}
              onTouchEnd={verticalUpHandlers.onTouchEnd}
              onTouchCancel={verticalUpHandlers.onTouchCancel}
              onBlur={verticalUpHandlers.onBlur}
              onClick={verticalUpHandlers.onClick}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
            >
              ↑ Up
            </button>
            <button
              style={downButtonStyle}
              onMouseDown={verticalDownHandlers.onMouseDown}
              onMouseUp={verticalDownHandlers.onMouseUp}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f44336';
                verticalDownHandlers.onMouseLeave?.(e);
              }}
              onTouchStart={verticalDownHandlers.onTouchStart}
              onTouchEnd={verticalDownHandlers.onTouchEnd}
              onTouchCancel={verticalDownHandlers.onTouchCancel}
              onBlur={verticalDownHandlers.onBlur}
              onClick={verticalDownHandlers.onClick}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#da190b'}
            >
              ↓ Down
            </button>
          </div>
          {showVerticalB && onAdjustVerticalBHorizontal && (
            <div style={{ ...controlsRowStyle, marginTop: '8px' }}>
              <button
                style={buttonStyle}
                onMouseDown={verticalBLeftHandlers.onMouseDown}
                onMouseUp={verticalBLeftHandlers.onMouseUp}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#4CAF50';
                  verticalBLeftHandlers.onMouseLeave?.(e);
                }}
                onTouchStart={verticalBLeftHandlers.onTouchStart}
                onTouchEnd={verticalBLeftHandlers.onTouchEnd}
                onTouchCancel={verticalBLeftHandlers.onTouchCancel}
                onBlur={verticalBLeftHandlers.onBlur}
                onClick={verticalBLeftHandlers.onClick}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
              >
                ← Left
              </button>
              <button
                style={buttonStyle}
                onMouseDown={verticalBRightHandlers.onMouseDown}
                onMouseUp={verticalBRightHandlers.onMouseUp}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#4CAF50';
                  verticalBRightHandlers.onMouseLeave?.(e);
                }}
                onTouchStart={verticalBRightHandlers.onTouchStart}
                onTouchEnd={verticalBRightHandlers.onTouchEnd}
                onTouchCancel={verticalBRightHandlers.onTouchCancel}
                onBlur={verticalBRightHandlers.onBlur}
                onClick={verticalBRightHandlers.onClick}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
              >
                Right →
              </button>
            </div>
          )}
          {showVerticalA && onAdjustVerticalATilt && (
            <>
              <div style={{ ...titleStyle, marginTop: '12px', fontSize: '11px', color: '#aaa' }}>Tilt Angle</div>
              <div style={{ ...controlsRowStyle, marginTop: '4px' }}>
                <button
                  style={buttonStyle}
                  onMouseDown={tiltUpHandlers.onMouseDown}
                  onMouseUp={tiltUpHandlers.onMouseUp}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#4CAF50';
                    tiltUpHandlers.onMouseLeave?.(e);
                  }}
                  onTouchStart={tiltUpHandlers.onTouchStart}
                  onTouchEnd={tiltUpHandlers.onTouchEnd}
                  onTouchCancel={tiltUpHandlers.onTouchCancel}
                  onBlur={tiltUpHandlers.onBlur}
                  onClick={tiltUpHandlers.onClick}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                >
                  ⟳ Up ({Math.abs(verticalATilt * 5).toFixed(0)}°)
                </button>
                <button
                  style={downButtonStyle}
                  onMouseDown={tiltDownHandlers.onMouseDown}
                  onMouseUp={tiltDownHandlers.onMouseUp}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f44336';
                    tiltDownHandlers.onMouseLeave?.(e);
                  }}
                  onTouchStart={tiltDownHandlers.onTouchStart}
                  onTouchEnd={tiltDownHandlers.onTouchEnd}
                  onTouchCancel={tiltDownHandlers.onTouchCancel}
                  onBlur={tiltDownHandlers.onBlur}
                  onClick={tiltDownHandlers.onClick}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#da190b'}
                >
                  ⟲ Down
                </button>
              </div>
            </>
          )}
          {showVerticalB && onAdjustVerticalBTilt && (
            <>
              <div style={{ ...titleStyle, marginTop: '12px', fontSize: '11px', color: '#aaa' }}>Tilt Angle</div>
              <div style={{ ...controlsRowStyle, marginTop: '4px' }}>
                <button
                  style={buttonStyle}
                  onMouseDown={tableTopTiltDownHandlers.onMouseDown}
                  onMouseUp={tableTopTiltDownHandlers.onMouseUp}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#4CAF50';
                    tableTopTiltDownHandlers.onMouseLeave?.(e);
                  }}
                  onTouchStart={tableTopTiltDownHandlers.onTouchStart}
                  onTouchEnd={tableTopTiltDownHandlers.onTouchEnd}
                  onTouchCancel={tableTopTiltDownHandlers.onTouchCancel}
                  onBlur={tableTopTiltDownHandlers.onBlur}
                  onClick={tableTopTiltDownHandlers.onClick}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                >
                  ⟳ Up ({Math.abs(verticalBTilt * 5).toFixed(0)}°)
                </button>
                <button
                  style={downButtonStyle}
                  onMouseDown={tableTopTiltUpHandlers.onMouseDown}
                  onMouseUp={tableTopTiltUpHandlers.onMouseUp}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f44336';
                    tableTopTiltUpHandlers.onMouseLeave?.(e);
                  }}
                  onTouchStart={tableTopTiltUpHandlers.onTouchStart}
                  onTouchEnd={tableTopTiltUpHandlers.onTouchEnd}
                  onTouchCancel={tableTopTiltUpHandlers.onTouchCancel}
                  onBlur={tableTopTiltUpHandlers.onBlur}
                  onClick={tableTopTiltUpHandlers.onClick}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#da190b'}
                >
                  ⟲ Down
                </button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default EquipmentControls;

