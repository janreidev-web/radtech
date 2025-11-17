import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Vertical({
  position = [0, 0, 0],
  scale = 0.3,
  rotation = [0, 0, 0],
  heightOffset = 0,
  baselineZ = null,
  onPositionUpdate,
  variant = 'A' // 'A' or 'B'
}) {
  const modelPath = variant === 'B' ? '/Model/verticalB.glb' : '/Model/verticalA.glb';
  const { scene } = useGLTF(modelPath);
  const mainRef = useRef(null);
  const originalPositionRef = useRef(null);
  const originalZRef = useRef(null); // Store original Z value as baseline

  useEffect(() => {
    if (!scene) return;

    const findObjectByName = (object, name) => {
      if (object.name === name) {
        return object;
      }
      for (const child of object.children) {
        const found = findObjectByName(child, name);
        if (found) return found;
      }
      return null;
    };

    const mainObj = findObjectByName(scene, 'main');
    if (mainObj) {
      mainRef.current = mainObj;
      
      // Use baselineZ from props if provided, otherwise capture from current position
      const captureBaseline = () => {
        // If baselineZ is provided from parent, use it
        // Otherwise, capture current position as baseline
        if (baselineZ !== null && originalZRef.current === null) {
          // Use provided baseline
          originalPositionRef.current = mainObj.position.clone();
          originalZRef.current = baselineZ;
          console.log(`Vertical ${variant}: Using provided baseline Z:`, originalZRef.current);
        } else if (originalZRef.current === null) {
          // First time - capture current Z as baseline
          originalPositionRef.current = mainObj.position.clone();
          originalZRef.current = mainObj.position.z;
          console.log(`Vertical ${variant}: Captured baseline Z:`, originalZRef.current);
          // Report baseline to parent
          if (onPositionUpdate) {
            onPositionUpdate(originalZRef.current, true);
          }
        }
        
        // Always reset to baseline first (in case scene was modified)
        if (originalZRef.current !== null) {
          mainObj.position.set(
            originalPositionRef.current.x,
            originalPositionRef.current.y,
            originalZRef.current
          );
          mainObj.updateMatrixWorld(true);
          
          let parent = mainObj.parent;
          while (parent) {
            parent.updateMatrixWorld(true);
            parent = parent.parent;
          }
        }
        
        // Now apply heightOffset
        if (originalZRef.current !== null) {
          mainObj.position.set(
            originalPositionRef.current.x,
            originalPositionRef.current.y,
            originalZRef.current + heightOffset
          );
          mainObj.updateMatrixWorld(true);
          
          let parent = mainObj.parent;
          while (parent) {
            parent.updateMatrixWorld(true);
            parent = parent.parent;
          }
          
          // Report position
          if (onPositionUpdate) {
            onPositionUpdate(mainObj.position.z);
          }
        }
      };
      
      // Small delay to ensure scene is stable
      setTimeout(captureBaseline, 50);
    } else {
      console.warn(`Vertical ${variant}: object named "main" not found in GLB scene.`);
    }
  }, [scene, baselineZ, heightOffset, onPositionUpdate, variant]);

  // Handle height offset adjustments - only run if original position is already captured
  useEffect(() => {
    const mainObj = mainRef.current;
    const originalPos = originalPositionRef.current;
    const originalZ = originalZRef.current;
    if (!mainObj || !originalPos || originalZ === null) return;

    // Use stored original Z as baseline, then add heightOffset
    mainObj.position.set(
      originalPos.x,
      originalPos.y,
      originalZ + heightOffset
    );
    mainObj.updateMatrixWorld(true);

    let parent = mainObj.parent;
    while (parent) {
      parent.updateMatrixWorld(true);
      parent = parent.parent;
    }
    
    // Report actual Z position to parent (local position of main mesh)
    if (onPositionUpdate) {
      onPositionUpdate(mainObj.position.z);
    }
    
    console.log(`Vertical ${variant}: Updated position - Original Z:`, originalZ, 'Height Offset:', heightOffset, 'Final Z:', mainObj.position.z);
  }, [heightOffset, onPositionUpdate, variant]);
  
  return (
    <primitive
      object={scene}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}

export default Vertical;
// Preload both vertical models
useGLTF.preload('/Model/verticalA.glb');
useGLTF.preload('/Model/verticalB.glb');
