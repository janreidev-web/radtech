import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function XRayTable3D({ position = [3, 0, 0], scale = 1 }) {
  const tableRef = useRef();
  const cassetteRef = useRef();

  // Optional: Add subtle animation
  useFrame((state) => {
    if (tableRef.current) {
      // Subtle floating animation
      tableRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={tableRef} position={position} scale={scale}>
      {/* Main Table Surface - Larger size */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4.0, 0.12, 1.6]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>

      {/* Raised Edges - All four sides */}
      <mesh position={[0, 1.26, 0.76]}>
        <boxGeometry args={[4.0, 0.06, 0.06]} />
        <meshLambertMaterial color="#d8d8d8" />
      </mesh>
      <mesh position={[0, 1.26, -0.76]}>
        <boxGeometry args={[4.0, 0.06, 0.06]} />
        <meshLambertMaterial color="#d8d8d8" />
      </mesh>
      <mesh position={[1.97, 1.26, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.6]} />
        <meshLambertMaterial color="#d8d8d8" />
      </mesh>
      <mesh position={[-1.97, 1.26, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.6]} />
        <meshLambertMaterial color="#d8d8d8" />
      </mesh>

      {/* Central Support Column - Larger */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.2]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>

      {/* Base Platform - Larger */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.0, 0.2, 1.0]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>

      {/* X-ray Cassette/Digital Detector - Embedded in table */}
      <mesh ref={cassetteRef} position={[-1.5, 1.26, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.8]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

export default XRayTable3D;
