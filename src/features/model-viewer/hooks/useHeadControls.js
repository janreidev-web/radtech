import { useState, useCallback } from 'react';

const defaultHeadControlState = {
  rotation: { tilt: 0, turn: 0 },
  position: { y: 0 },
};

export function useHeadControls() {
  const [headControl, setHeadControl] = useState(defaultHeadControlState);

  const updateHeadControl = useCallback((control) => {
    if (!control) {
      setHeadControl(defaultHeadControlState);
      return;
    }

    setHeadControl({
      rotation: { tilt: control.tilt ?? 0, turn: control.turn ?? 0 },
      position: { y: control.posY ?? 0 },
    });
  }, []);

  const resetHeadControl = useCallback(() => {
    setHeadControl(defaultHeadControlState);
  }, []);

  return {
    headControl,
    updateHeadControl,
    resetHeadControl,
  };
}

