import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

function Body({ scale, isMobile, armsClosed = false, isLyingDown = false, bodyLift = -0.1 }) {
  const { scene } = useGLTF('/Model/base.glb');

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
          object.rotation.set(0, -1, Math.PI / -2.7); // Left arm inward
          console.log('Rotated left upper arm inward:', object.name);
        }
        if (object.name === 'CC_Base_L_Forearm') {
          // Rotate left forearm to bring it closer to body
          object.rotation.set(2.2, 1, Math.PI / -150); // Left forearm inward
          console.log('Rotated left forearm inward:', object.name);
        }
        
        // Right arm controls
        if (object.name === 'CC_Base_R_Upperarm') {
          // Rotate right upper arm inward (opposite direction)
          object.rotation.set(-0.02, 0.4, -Math.PI / -2.8); // Right arm inward (negative for opposite direction)
          console.log('Rotated right upper arm inward:', object.name);
        }
        if (object.name === 'CC_Base_R_Forearm') {
          // Rotate right forearm to bring it closer to body
          object.rotation.set(-0.3, 1.3, -Math.PI / -150); // Right forearm inward (negative for opposite direction)
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


  return (
    <primitive
      object={scene}
      scale={scale}
      position={isMobile ? 
        (isLyingDown ? [0, 1.9 + bodyLift, 0] : [0, -2.1 + bodyLift, 0]) : 
        (isLyingDown ? [2, 1.65 + bodyLift, 0] : [0, -2.1 + bodyLift, 0])
      } // Position above table when lying down, original position when standing; add bodyLift for subtle raise
      rotation={isLyingDown ? [1.5, 0, 1.56] : [0, 0, 0]} // Lie down when lesson active, flip 180° so head is at detector, standing straight when not
    />
  );
}

export default Body;
useGLTF.preload('/Model/base.glb');
