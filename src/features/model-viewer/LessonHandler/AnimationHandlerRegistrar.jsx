import React, { useEffect } from 'react';
import { useLessonAnimations } from './LessonAnimationContext';

const AnimationHandlerRegistrar = ({ handlers }) => {
  const { registerHandlers } = useLessonAnimations();

  useEffect(() => {
    registerHandlers(handlers);
  }, [registerHandlers, handlers]);

  return null;
};

export default AnimationHandlerRegistrar;
