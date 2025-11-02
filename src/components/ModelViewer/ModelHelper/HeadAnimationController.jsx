import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

const HeadAnimationController = ({ 
  headRotation = { tilt: 0, turn: 0 }, 
  headPosition = { y: 0 },
  meshName = 'CC_Base_Head',
  headWeight = 0.10,
  neckWeights = {
    CC_Base_NeckTwist01: 0.5,
    CC_Base_NeckTwist02: 0
  },
  neckNamePatterns = ['Neck'], // fallback matching if exact names differ
  // limits (radians) for tilt and turn. Increase to allow larger rotations.
  headLimitTilt = 1.5, // ~86°
  headLimitTurn = 1.8, // ~103°
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
        }

        const initial = initialRotationsByNameRef.current[name];

        const weight = name === meshName 
          ? headWeight 
          : (neckWeights[name] ?? (isPatternMatch ? 0.3 : 0));

  // Clamp inputs to avoid extreme bending; use configurable limits
  const clampedTilt = Math.max(-headLimitTilt, Math.min(headLimitTilt, headRotation.tilt));
  const clampedTurn = Math.max(-headLimitTurn, Math.min(headLimitTurn, headRotation.turn));

        // Apply weighted rotation (tilt -> x, turn -> y) relative to initial
        object.rotation.x = initial.x + clampedTilt * weight;
        object.rotation.y = initial.y + clampedTurn * weight;
        object.rotation.z = initial.z; // unchanged

        // debug logs removed
      }

      // Continue traversing children
      object.children.forEach(child => manipulateHeadAndNeck(child));
    };

    manipulateHeadAndNeck(scene);
    if (!discoveredTargetsRef.current.logged) {
      discoveredTargetsRef.current.logged = true;
    }
  }, [scene, headRotation, headPosition, meshName, neckWeights, headWeight, neckNamePatterns, headLimitTilt, headLimitTurn]);

  return null;
};

export default HeadAnimationController;
