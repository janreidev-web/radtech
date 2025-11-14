import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

function Body({ scale, isMobile, armsClosed = false, armPosition = 'default', isLyingDown = false, onLoad }) {
  const { scene } = useGLTF('/Model/base.glb');

  useEffect(() => {
    if (onLoad && scene) {
      onLoad();
    }
  }, [scene, onLoad]);

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
          //object.rotation.set(0.32, 0.12, -1.25);
          object.rotation.set(0.32, 0.12, -1.25);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          //object.rotation.set(0, 0.55, 0);
          object.rotation.set(0, -0.5, -0.05);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          //object.rotation.set(1.05, -0.18, 1.25);
          object.rotation.set(0.64, -0.12, 1.25);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          //object.rotation.set(0, -0.55, 0);
          object.rotation.set(0, 0.5, 0.05);
        }
      } else {
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

  return (
    <primitive
      object={scene}
      scale={scale}
      position={
        isMobile 
          ? (isLyingDown ? [0, 1.9, 0] : [0, -2.1, 0])
          : (isLyingDown ? [2, 1.6, 0] : [0, -2.1, 0])
      }
      rotation={isLyingDown ? [-1.5, 0, 1.56] : [0, 0, 0]}
    />
  );
}

export default Body;
useGLTF.preload('/Model/base.glb');
