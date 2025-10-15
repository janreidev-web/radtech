import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { identifyBodyPart } from './bodyPartBounds.jsx';

function Body({ scale, isMobile, onPartClick }) {
  const { scene } = useGLTF('/Model/base.glb');
  const { camera, gl } = useThree();
  const raycaster = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    raycaster.current = new THREE.Raycaster();
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        
        // Use coordinate-based detection
        const bodyPart = identifyBodyPart({
          x: intersectionPoint.x,
          y: intersectionPoint.y,
          z: intersectionPoint.z
        }, isMobile);

        // Pass both 3D coordinates and screen position
        onPartClick?.({
          name: bodyPart,
          x: intersectionPoint.x.toFixed(2),
          y: intersectionPoint.y.toFixed(2),
          z: intersectionPoint.z.toFixed(2),
        }, {
          x: event.clientX,
          y: event.clientY
        });
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl.domElement, scene, onPartClick, isMobile]);

  return (
    <primitive
      object={scene}
      scale={scale}
      position={isMobile ? [0, -2.1, 0] : [0, -2.1, 0]}
      rotation={[0, Math.PI / 6.7, 0]}
    />
  );
}

export default Body;
useGLTF.preload('/Model/base.glb');
