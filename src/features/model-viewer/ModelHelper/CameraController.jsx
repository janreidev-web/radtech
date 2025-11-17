import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraController = ({ 
  targetPosition, 
  targetLookAt, 
  duration = 2000, 
  isActive = false,
  onComplete 
}) => {
  const { camera } = useThree();
  const animationRef = useRef(null);
  const startPositionRef = useRef(null);
  const startLookAtRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isActive || !targetPosition || !targetLookAt) return;

    // Store initial values
    startPositionRef.current = camera.position.clone();
    startLookAtRef.current = new THREE.Vector3();
    camera.getWorldDirection(startLookAtRef.current);
    startLookAtRef.current.multiplyScalar(10).add(camera.position);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Interpolate position
      const currentPosition = startPositionRef.current.clone().lerp(
        new THREE.Vector3(...targetPosition), 
        easeProgress
      );
      
      // Interpolate look-at point
      const currentLookAt = startLookAtRef.current.clone().lerp(
        new THREE.Vector3(...targetLookAt), 
        easeProgress
      );

      camera.position.copy(currentPosition);
      camera.lookAt(currentLookAt);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, targetPosition, targetLookAt, duration, camera, onComplete]);

  return null;
};

export default CameraController;
