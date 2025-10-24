import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VisualGuideController = ({ 
  guideType, 
  guideData, 
  duration = 2000, 
  isActive = false,
  onComplete 
}) => {
  const { scene } = useThree();
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const guideObjectsRef = useRef([]);

  useEffect(() => {
    if (!isActive || !guideType || !guideData) return;

    startTimeRef.current = Date.now();
    guideObjectsRef.current = [];

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Create visual guides based on type
      switch (guideType) {
        case 'central_ray':
          createCentralRay(guideData, easeProgress);
          break;
        case 'line':
          createAlignmentLine(guideData, easeProgress);
          break;
        case 'highlight':
          createHighlight(guideData, easeProgress);
          break;
        default:
          console.warn(`Unknown guide type: ${guideType}`);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up guide objects
      guideObjectsRef.current.forEach(obj => {
        scene.remove(obj);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, guideType, guideData, duration, scene, onComplete]);

  const createCentralRay = (data) => {
    // Remove existing central ray
    const existingRay = scene.getObjectByName('centralRay');
    if (existingRay) {
      scene.remove(existingRay);
    }

    const geometry = new THREE.CylinderGeometry(0.01, 0.01, 2.5, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color: data.color || '#e67e22',
      transparent: true,
      opacity: 0.8
    });
    
    const ray = new THREE.Mesh(geometry, material);
    ray.name = 'centralRay';
    
    // Position the ray
    const startPos = new THREE.Vector3(...data.from);
    const endPos = new THREE.Vector3(...data.to);
    const midPoint = startPos.clone().lerp(endPos, 0.5);
    
    ray.position.copy(midPoint);
    ray.lookAt(endPos);
    ray.rotateX(Math.PI / 2);
    
    // Add pulsing animation
    const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
    ray.scale.setScalar(scale);
    
    scene.add(ray);
    guideObjectsRef.current.push(ray);
  };

  const createAlignmentLine = (data) => {
    // Remove existing alignment line
    const existingLine = scene.getObjectByName('alignmentLine');
    if (existingLine) {
      scene.remove(existingLine);
    }

    const points = [
      new THREE.Vector3(...data.from),
      new THREE.Vector3(...data.to)
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: data.color || '#f39c12',
      linewidth: data.thickness || 3
    });
    
    const line = new THREE.Line(geometry, material);
    line.name = 'alignmentLine';
    
    // Add pulsing animation
    const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
    line.scale.setScalar(scale);
    
    scene.add(line);
    guideObjectsRef.current.push(line);
  };

  const createHighlight = (data) => {
    // Remove existing highlight
    const existingHighlight = scene.getObjectByName(`highlight_${data.part}`);
    if (existingHighlight) {
      scene.remove(existingHighlight);
    }

    // Create a sphere to highlight the body part
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: data.color || '#ff6b6b',
      transparent: true,
      opacity: 0.7
    });
    
    const highlight = new THREE.Mesh(geometry, material);
    highlight.name = `highlight_${data.part}`;
    
    // Position based on body part
    const positions = {
      chin: [0, 2.2, 0.1],
      mastoid: [-0.15, 1.9, 0.1],
      cervical_spine: [0, 1.5, 0],
      dens: [0, 1.8, 0],
      foramen_magnum: [0, 1.7, 0],
      mid_sagittal_plane: [0, 1.5, 0]
    };
    
    if (positions[data.part]) {
      highlight.position.set(...positions[data.part]);
    }
    
    // Add pulsing animation
    const scale = 1 + Math.sin(Date.now() * 0.004) * 0.3;
    highlight.scale.setScalar(scale);
    
    scene.add(highlight);
    guideObjectsRef.current.push(highlight);
  };

  return null;
};

export default VisualGuideController;
