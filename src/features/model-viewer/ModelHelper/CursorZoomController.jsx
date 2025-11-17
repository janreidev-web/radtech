import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

// Controller that makes zoom focus on cursor position
const CursorZoomController = ({ controlsRef }) => {
  const { camera, scene, gl } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    const controls = controlsRef?.current;
    if (!controls) return;

    // Set up mouse buttons: LEFT = rotate, MIDDLE = dolly, RIGHT = pan
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };

    const el = gl.domElement;

    const onWheel = (e) => {
      if (!controls) return;

      // Compute normalized device coordinates
      const rect = el.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = raycasterRef.current;
      raycaster.setFromCamera(mouseRef.current, camera);

      // Find all meshes in the scene
      const validMeshes = [];
      scene.traverse((obj) => {
        if (obj.isMesh) {
          validMeshes.push(obj);
        }
      });

      const intersects = raycaster.intersectObjects(validMeshes, false);

      // If hovering over the model, update target to zoom toward that point
      if (intersects && intersects.length > 0) {
        const hit = intersects[0];
        const point = hit.point;
        
        // Only update target when zooming IN (deltaY < 0)
        // This prevents unwanted rotation when zooming out
        if (e.deltaY < 0) {
          // Smoothly move target toward cursor point (gentle blend)
          const currentTarget = controls.target.clone();
          const newTarget = point.clone();
          const blendedTarget = currentTarget.lerp(newTarget, 0.15);
          controls.target.copy(blendedTarget);
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [camera, gl, scene, controlsRef]);

  return null;
};

export default CursorZoomController;
