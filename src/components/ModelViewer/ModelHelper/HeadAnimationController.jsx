import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const HeadAnimationController = ({ 
  headRotation = { tilt: 0, turn: 0 }, 
  headPosition = { y: 0 },
  meshName = 'CC_Base_Head' // Default to CC_Base_Head (the head bone)
}) => {
  const { scene } = useThree();
  const initialRotationRef = useRef(null);

  useEffect(() => {
    // Recursive function to find and manipulate the head bone
    const manipulateHead = (object) => {
      if (object.name === meshName) {
        // Store initial rotation if not stored
        if (!initialRotationRef.current) {
          initialRotationRef.current = {
            x: object.rotation.x,
            y: object.rotation.y,
            z: object.rotation.z
          };
          console.log(`Head controller initialized for ${meshName}`);
        }
        
        // Apply rotation (tilt and turn) - add to initial rotation
        object.rotation.x = initialRotationRef.current.x + headRotation.tilt;
        object.rotation.y = initialRotationRef.current.y + headRotation.turn;
        object.rotation.z = initialRotationRef.current.z; // Keep Z unchanged
      }
      
      // Continue traversing children
      object.children.forEach(child => manipulateHead(child));
    };

    manipulateHead(scene);
  }, [scene, headRotation, headPosition, meshName]);

  return null;
};

export default HeadAnimationController;
