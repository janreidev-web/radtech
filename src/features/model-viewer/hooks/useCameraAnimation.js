import { useState, useCallback } from 'react';

const defaultCameraAnimationState = {
  isActive: false,
  targetPosition: null,
  targetLookAt: null,
  duration: 2000,
};

export function useCameraAnimation() {
  const [cameraAnimation, setCameraAnimation] = useState(defaultCameraAnimationState);

  const triggerCameraAnimation = useCallback((action) => {
    if (!action) return;

    setCameraAnimation({
      isActive: true,
      targetPosition: action.position ?? null,
      targetLookAt: action.lookAt ?? null,
      duration: action.duration || defaultCameraAnimationState.duration,
    });
  }, []);

  const handleCameraComplete = useCallback(() => {
    setCameraAnimation((prev) => ({ ...prev, isActive: false }));
  }, []);

  const resetCameraAnimation = useCallback(() => {
    setCameraAnimation(defaultCameraAnimationState);
  }, []);

  return {
    cameraAnimation,
    triggerCameraAnimation,
    handleCameraComplete,
    resetCameraAnimation,
  };
}

