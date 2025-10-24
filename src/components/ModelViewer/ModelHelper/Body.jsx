import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { identifyBodyPart } from './bodyPartBounds.jsx';

function Body({ scale, isMobile, onPartClick, armsClosed = false, isLyingDown = false }) {
  const { scene } = useGLTF('/Model/base.glb');
  const { camera, gl } = useThree();
  const raycaster = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    raycaster.current = new THREE.Raycaster();
  }, []);

  // Log all mesh nodes in the scene
  useEffect(() => {
    const logAllMeshNodes = (object, depth = 0) => {
      const indent = '  '.repeat(depth);
      
      if (object.isMesh) {
        console.log(`${indent}MESH: ${object.name || 'unnamed'}`, {
          name: object.name,
          type: object.type,
          position: object.position,
          rotation: object.rotation,
          scale: object.scale,
          geometry: object.geometry?.type,
          material: object.material?.type,
          visible: object.visible,
          userData: object.userData
        });
      } else if (object.name) {
        console.log(`${indent}GROUP: ${object.name}`, {
          name: object.name,
          type: object.type,
          children: object.children.length,
          position: object.position,
          rotation: object.rotation,
          scale: object.scale
        });
      }
      
      object.children.forEach(child => logAllMeshNodes(child, depth + 1));
    };
    
    console.log('=== ALL MESH NODES IN SCENE ===');
    logAllMeshNodes(scene);
    console.log('=== END MESH NODES ===');
  }, [scene]);

  // Position the arms based on armsClosed state
  useEffect(() => {
    const positionArms = (object) => {
      if (object.name === 'CC_Base_Body_3') {
        console.log('Found arms object:', object.name, 'Arms closed:', armsClosed);
        
        if (armsClosed) {
          // Lesson mode: Arms very close to body (anatomical pose)
          object.position.set(0, -0.05, 0.1); // Much closer to body center
          object.rotation.set(Math.PI / 4, 0, Math.PI / 12); // 22.5 degrees X, 15 degrees Z (very closed)
          object.scale.set(0.9, 0.9, 0.9); // Slightly larger but close
          console.log('Applied closed arm positioning for lesson');
        } else {
          // Default mode: Arms in original T-pose (same as reset)
          object.position.set(0, -0.2, 0.3); // Default position
          object.rotation.set(0, 0, Math.PI / 6); // 45 degrees X, 30 degrees Z
          object.scale.set(0.8, 0.5, 0.8); // Default scale (same as reset)
          console.log('Applied default arm positioning');
        }
        
        console.log('Applied arm positioning - Position:', object.position, 'Rotation:', object.rotation, 'Scale:', object.scale);
      }
      
      // Also try to control individual arm bones for more dramatic effect
      if (armsClosed) {
        // Left arm controls
        if (object.name === 'CC_Base_L_Upperarm') {
          // Rotate left upper arm inward
          object.rotation.set(0, 0, Math.PI / -2.7); // Left arm inward
          console.log('Rotated left upper arm inward:', object.name);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          // Rotate left forearm to bring it closer to body
          object.rotation.set(0, 0, Math.PI / -150); // Left forearm inward
          console.log('Rotated left forearm inward:', object.name);
        }
        
        // Right arm controls
        if (object.name === 'CC_Base_R_Upperarm') {
          // Rotate right upper arm inward (opposite direction)
          object.rotation.set(0, 0, -Math.PI / -2.7); // Right arm inward (negative for opposite direction)
          console.log('Rotated right upper arm inward:', object.name);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          // Rotate right forearm to bring it closer to body
          object.rotation.set(0, 0, -Math.PI / -150); // Right forearm inward (negative for opposite direction)
          console.log('Rotated right forearm inward:', object.name);
        }
      } else {
        // Reset individual arm bones to original position (same as initial state)
        if (object.name === 'CC_Base_L_Upperarm') {
          // Reset left upper arm to original position
          object.rotation.set(0, 0, 0); // Reset to original rotation
          console.log('Reset left upper arm to original:', object.name);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          // Reset left forearm to original position
          object.rotation.set(0, 0, 0); // Reset to original rotation
          console.log('Reset left forearm to original:', object.name);
        }
        if (object.name === 'CC_Base_R_Upperarm') {
          // Reset right upper arm to original position
          object.rotation.set(0, 0, 0); // Reset to original rotation
          console.log('Reset right upper arm to original:', object.name);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          // Reset right forearm to original position
          object.rotation.set(0, 0, 0); // Reset to original rotation
          console.log('Reset right forearm to original:', object.name);
        }
      }
      
      object.children.forEach(child => positionArms(child));
    };
    
    positionArms(scene);
  }, [scene, armsClosed]);

  useEffect(() => {
    const handleClick = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        
        // Check if the click is on the X-ray table area (rough bounds)
        const isOnTable = intersectionPoint.x > 1.5 && intersectionPoint.x < 4.5 && 
                         intersectionPoint.y > -0.5 && intersectionPoint.y < 1.5 &&
                         intersectionPoint.z > -1.0 && intersectionPoint.z < 1.0;
        
        if (isOnTable) {
          // Click is on the X-ray table, don't process as body part
          console.log('Clicked on X-ray table, ignoring body part detection');
          return;
        }
        
        // Use coordinate-based detection for body parts only
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
      position={isMobile ? 
        (isLyingDown ? [0, 1.9, 0] : [0, -2.1, 0]) : 
        (isLyingDown ? [2, 1.8, 0] : [0, -2.1, 0])
      } // Position above table when lying down, original position when standing
      rotation={isLyingDown ? [1.5, 0, 1.56] : [0, 0, 0]} // Lie down when lesson active, flip 180° so head is at detector, standing straight when not
    />
  );
}

export default Body;
useGLTF.preload('/Model/base.glb');
