import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';

/**
 * A simple loader component to show while the model is loading.
 */
function Loader() {
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</div>
    </Html>
  );
}

// ✅ MODIFIED MODEL COMPONENT
function Model() {
  const { scene } = useGLTF('/Model/base.glb');
  
  // Apply position, scale, and rotation directly to the primitive object
  return (
    <primitive
      object={scene}
      // 👇 Change the size here
      scale={1.9} // This makes the model 50% of its original size
      // 👇 Change the location here [x, y, z]
      position={[0, -1.5, 0]} // This moves the model 1.5 units down
      // 👇 You can also change rotation [x, y, z] (in radians)
      rotation={[0, Math.PI/6.7, 0]} // Rotates 45 degrees on the Y axis
    />
  );
}

function ModelLoader() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ModelLoader;

useGLTF.preload('/Model/base.glb');