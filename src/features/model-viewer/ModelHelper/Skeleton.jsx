import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

function Skeleton({ scale, isMobile, isLyingDown = false, baseRotation = 'front', onLoad }) {
  const { scene } = useGLTF('/Model/skeleton.glb');

  useEffect(() => {
    if (onLoad && scene) {
      onLoad();
    }
  }, [onLoad, scene]);

  const getRotation = () => {
    if (isLyingDown) {
      return [-1.5, 0, 1.56];
    }

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
          ? (isLyingDown ? [0, 1.9, 0] : [0, -0.5, 0])
          : (isLyingDown ? [2, 0.5, 0] : [0, -0.1, 0])
      }
      rotation={getRotation()}
    />
  );
}

export default Skeleton;
useGLTF.preload('/Model/skeleton.glb');
