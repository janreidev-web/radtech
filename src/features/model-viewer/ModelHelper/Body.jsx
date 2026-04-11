import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

function Body({ modelPath = '/Model/base.glb', scale, isMobile, armsClosed = false, armPosition = 'default', isLyingDown = false, baseRotation = 'front', onLoad }) {
  const { scene } = useGLTF(modelPath);
  const isSkeleton = modelPath.includes('skeleton');

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
      } else if (position === 'raised') {
        if (object.name === 'CC_Base_L_Upperarm') {
          object.rotation.set(-1.5, 0, -0.3);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          object.rotation.set(0, 0, 0);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          object.rotation.set(-1.5, 0, 0.3);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          object.rotation.set(0, 0, 0);
        }
      } else if (position === 'sides') {
        if (object.name === 'CC_Base_L_Upperarm') {
          object.rotation.set(0, 0, -0.5);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          object.rotation.set(0, 0, 0);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          object.rotation.set(0, 0, 0.5);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          object.rotation.set(0, 0, 0);
        }
      } else if (position === 'crossed') {
        if (object.name === 'CC_Base_L_Upperarm') {
          object.rotation.set(0.8, 0.3, -1.5);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          object.rotation.set(0, 1.2, 0);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          object.rotation.set(0.8, -0.3, 1.5);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          object.rotation.set(0, -1.2, 0);
        }
      } else if (position === 'left-arm-raised') {
        if (object.name === 'CC_Base_L_Upperarm') {
          object.rotation.set(1.5, 0, 1.5);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          object.rotation.set(1, -0.1, 0);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          object.rotation.set(0.64, -0.12, 1.25);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          object.rotation.set(0, 0.5, 0.05);
        }
      } else if (position === 'right-arm-raised') {
        if (object.name === 'CC_Base_L_Upperarm') {
          object.rotation.set(0.32, 0.12, -1.25);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          object.rotation.set(0, -0.5, -0.05);
        }

      // Mirror of left arm
      if (object.name === 'CC_Base_R_Upperarm') {
        object.rotation.set(1.5, 0, -1.5); // Z flipped
      }
      if (object.name === 'CC_Base_R_Forearm') {
        object.rotation.set(1, 0.1, 0); // Y flipped
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
      // Lying down base rotation: [-1.5, 0, 1.56]
      // Apply Y rotation based on baseRotation for different views
      const lyingDownRotations = {
        'front':      [-1.5, 0, 1.56],           // supine (on back)
        'back':       [-1.5, Math.PI, 4.7],     // prone (face down)
        'side-right': [0.1, 0, 1.56], // lying on left side
        'side-left':  [Math.PI, 0, 1.56]  // lying on right side
      };
      return lyingDownRotations[baseRotation] || lyingDownRotations['front'];
    }

    const rotations = {
      'front':      [0, 0, 0],
      'side-right': [0, Math.PI / 2, 0],
      'side-left':  [0, -Math.PI / 2, 0],
      'back':       [0, Math.PI, 0],
    };
    return rotations[baseRotation] || rotations['front'];
  };

  return (
    <primitive
      object={scene}
      scale={scale}
      position={
        isSkeleton
          ? (isMobile
              ? (isLyingDown ? [0, 1.9, 0]  : [0, -0.5, 0])
              : (isLyingDown ? [-0.3, 0.6, 0]  : [0, -0.05, 0]))
          : (isMobile
              ? (isLyingDown ? [0, 1.9, 0]  : [0, -2.1, 0])
              : (isLyingDown ? [2, 0.6, 0]  : [0, -2.1, 0]))
      }
      rotation={getRotation()}
    />
  );
}

export default Body;
useGLTF.preload('/Model/base.glb');
useGLTF.preload('/Model/skeleton.glb');
