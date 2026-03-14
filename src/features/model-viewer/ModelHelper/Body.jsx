import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

function Body({ scale, isMobile, armsClosed = false, armPosition = 'default', isLyingDown = false, baseRotation = 'front', onLoad }) {
  const { scene } = useGLTF('/Model/base.glb');

  useEffect(() => {
    if (onLoad && scene) {
      onLoad();
    }
  }, [onLoad, scene]);

  useEffect(() => {
    const positionArms = (object) => {
      const position = armPosition !== 'default' ? armPosition : (armsClosed ? 'closed' : 'default');
      
      if (position === 'closed') {
        if (object.name === 'CC_Base_L_Upperarm') {
          object.rotation.set(0.5, 0.2, -1.3);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          object.rotation.set(0, 1, 0);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          object.rotation.set(1.5, -0.3, 1.5);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          object.rotation.set(0, 0, 0);
        }
        
      } else if (position === 'twinning') {
        if (object.name === 'CC_Base_L_Upperarm') {
          object.rotation.set(0.32, 0.12, -1.25);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          object.rotation.set(0, -0.5, -0.05);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          object.rotation.set(0.64, -0.12, 1.25);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          object.rotation.set(0, 0.5, 0.05);
        }
      } 
      
      else {
        if (object.name === 'CC_Base_L_Upperarm') {
          object.rotation.set(0, 0, 0);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          object.rotation.set(0, 0, 0);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          object.rotation.set(0, 0, 0);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          object.rotation.set(0, 0, 0);
        }
      }
      
      object.children.forEach(child => positionArms(child));
    };
    
    positionArms(scene);
  }, [scene, armsClosed, armPosition]);

  // Calculate rotation based on baseRotation and isLyingDown
  const getRotation = () => {
    if (isLyingDown) {
      // Original lying down position: [-1.5, 0, 1.56]
      return [-1.5, 0, 1.56];
    }
    
    // Standing positions: only Twinning method gets rotation
    const rotations = {
      'front': [0, 0, 0],
      'side-right': [0, Math.PI / 2, 0],
      'side-left': [0, -Math.PI / 2, 0],
      'back': [0, Math.PI, 0]
    };
    
    return rotations[baseRotation] || rotations['front'];
  };

  return (
    <primitive
      object={scene}
      scale={scale}
      position={
        isMobile 
          ? (isLyingDown ? [0, 1.9, 0] : [0, -2.1, 0])
          : (isLyingDown ? [2, 0.6, 0] : [0, -2.1, 0])
      }
      rotation={getRotation()}
    />
  );
}

export default Body;
useGLTF.preload('/Model/base.glb');
