import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

function Body({ scale, isMobile, armsClosed = false, isLyingDown = false, onLoad }) {
  const { scene } = useGLTF('/Model/base.glb');

  // (debug logging removed) previously listed mesh nodes here

  // Call onLoad when model is ready
  useEffect(() => {
    if (onLoad && scene) {
      onLoad();
    }
  }, [scene, onLoad]);

  // Position the arms based on armsClosed state
  useEffect(() => {
    const positionArms = (object) => {
      
      // Also try to control individual arm bones for more dramatic effect
      if (armsClosed) {
        // Left arm controls
        if (object.name === 'CC_Base_L_Upperarm') {
          // Rotate left upper arm inward
          object.rotation.set(0.5, 0.2, -1.3); // Left arm inward
          // console removed
        }
        if (object.name === 'CC_Base_L_Forearm') {
          // Rotate left forearm to bring it closer to body
          object.rotation.set(0, 1, 0); // Left forearm inward
          // console removed
        }
        
        // Right arm controls
        if (object.name === 'CC_Base_R_Upperarm') {
          // Rotate right upper arm inward (opposite direction)
          object.rotation.set(1.5, -0.3, 1.5); // Right arm inward (negative for opposite direction)
          // console removed
        }
        if (object.name === 'CC_Base_R_Forearm') {
          // Rotate right forearm to bring it closer to body
          object.rotation.set(0, 0, 0); // Right forearm inward (negative for opposite direction)
          // console removed
        }
      } else {
        // Reset individual arm bones to original position (same as initial state)
        if (object.name === 'CC_Base_L_Upperarm') {
          // Reset left upper arm to original position
          object.rotation.set(0, 0, 0); // Reset to original rotation
          // console removed
        }
        if (object.name === 'CC_Base_L_Forearm') {
          // Reset left forearm to original position
          object.rotation.set(0, 0, 0); // Reset to original rotation
          // console removed
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          // Reset right upper arm to original position
          object.rotation.set(0, 0, 0); // Reset to original rotation
          // console removed
        }
        if (object.name === 'CC_Base_R_Forearm') {
          // Reset right forearm to original position
          object.rotation.set(0, 0, 0); // Reset to original rotation
          // console removed
        }
      }
      
      object.children.forEach(child => positionArms(child));
    };
    
    positionArms(scene);
  }, [scene, armsClosed]);


  return (
    <primitive
      object={scene}
      scale={scale}
      position={isMobile ? 
        (isLyingDown ? [0, 1.9 , 0] : [0, -2.1, 0]) : 
        (isLyingDown ? [2, 1.60, 0] : [0, -2.1, 0])
      } // Position above table when lying down, original position when standing; add bodyLift for subtle raise
      rotation={isLyingDown ? [-1.5, 0, 1.56] : [0, 0, 0]} // Lie down when lesson active, flip 180° so head is at detector, standing straight when not
    />
  );
}

export default Body;
useGLTF.preload('/Model/base.glb');
