import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const HeadAnimationController = ({ 
  headRotation = { tilt: 0, turn: 0 }, 
  headPosition = { y: 0 },
  meshName = 'CC_Base_Head',
  headWeight = 0.10,
  neckWeights = {
    CC_Base_NeckTwist01: 0.2,
    CC_Base_NeckTwist02: 0
  },
  neckNamePatterns = ['Neck'], // fallback matching if exact names differ
  debug = false
}) => {
  const { scene } = useThree();
  const initialRotationsByNameRef = useRef({});
  const discoveredTargetsRef = useRef({ logged: false });

  useEffect(() => {
    const targetNames = new Set([meshName, ...Object.keys(neckWeights)]);

    // Recursive function to find and manipulate the head and neck bones
    const manipulateHeadAndNeck = (object) => {
      const name = object.name || '';
      const isExactTarget = targetNames.has(name);
      const isPatternMatch = !isExactTarget && neckNamePatterns.some(p => {
        return typeof p === 'string' ? name.includes(p) : (p instanceof RegExp ? p.test(name) : false);
      });

      if (isExactTarget || isPatternMatch) {
        // Store initial rotation per bone if not stored
        if (!initialRotationsByNameRef.current[name]) {
          initialRotationsByNameRef.current[name] = {
            x: object.rotation.x,
            y: object.rotation.y,
            z: object.rotation.z
          };
          if (!discoveredTargetsRef.current.logged) {
            console.log(`Head/Neck controller initialized for ${name}`);
          }
        }

        const initial = initialRotationsByNameRef.current[name];

        const weight = name === meshName 
          ? headWeight 
          : (neckWeights[name] ?? (isPatternMatch ? 0.3 : 0));

        // Clamp inputs to avoid extreme bending
        const clampedTilt = Math.max(-0.7, Math.min(0.7, headRotation.tilt));
        const clampedTurn = Math.max(-0.9, Math.min(0.9, headRotation.turn));

        // Apply weighted rotation (tilt -> x, turn -> y) relative to initial
        object.rotation.x = initial.x + clampedTilt * weight;
        object.rotation.y = initial.y + clampedTurn * weight;
        object.rotation.z = initial.z; // unchanged

        if (debug && weight > 0) {
          console.log('[HeadAnimationController] Applied', name, {
            weight: Number(weight.toFixed(2)),
            tiltRad: Number(clampedTilt.toFixed(3)),
            turnRad: Number(clampedTurn.toFixed(3))
          });
        }
      }

      // Continue traversing children
      object.children.forEach(child => manipulateHeadAndNeck(child));
    };

    manipulateHeadAndNeck(scene);
    if (!discoveredTargetsRef.current.logged) {
      discoveredTargetsRef.current.logged = true;
    }
  }, [scene, headRotation, headPosition, meshName, neckWeights]);

  return null;
};

export default HeadAnimationController;
