import React, { createContext, useContext, useCallback, useState } from 'react';

// Create context for lesson animations
const LessonAnimationContext = createContext();

// Provider component
export const LessonAnimationProvider = ({ children }) => {
  const [animationHandlers, setAnimationHandlers] = useState({});

  const registerHandlers = useCallback((handlers) => {
    setAnimationHandlers(handlers);
  }, []);

  const triggerCameraAnimation = useCallback((action) => {
    if (animationHandlers.handleCameraAnimation) {
      animationHandlers.handleCameraAnimation(action);
    }
  }, [animationHandlers]);

  const triggerVisualGuide = useCallback((guide) => {
    if (animationHandlers.handleVisualGuide) {
      animationHandlers.handleVisualGuide(guide);
    }
  }, [animationHandlers]);

  const value = {
    registerHandlers,
    triggerCameraAnimation,
    triggerVisualGuide
  };

  return (
    <LessonAnimationContext.Provider value={value}>
      {children}
    </LessonAnimationContext.Provider>
  );
};

// Hook to use lesson animations
// eslint-disable-next-line react-refresh/only-export-components
export const useLessonAnimations = () => {
  const context = useContext(LessonAnimationContext);
  if (!context) {
    throw new Error('useLessonAnimations must be used within a LessonAnimationProvider');
  }
  return context;
};
