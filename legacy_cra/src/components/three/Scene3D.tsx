import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { FloatingCoins } from './FloatingCoins';
import { ParticleField } from './ParticleField';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

export function Scene3D() {
  return (
    <div className="absolute inset-0 -z-5 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#6366F1" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#EC4899" />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#22D3EE" />

        {/* Environment for reflections */}
        <Environment preset="night" />

        <Suspense fallback={null}>
          <FloatingCoins count={15} />
          <ParticleField count={200} />
        </Suspense>

        {/* Subtle camera movement */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

// Minimal 3D background for cards
export function MiniScene3D({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 -z-5 pointer-events-none opacity-30">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 5]} intensity={1} color="#6366F1" />
        <Suspense fallback={null}>
          <FloatingCoins count={3} scale={0.3} />
        </Suspense>
      </Canvas>
      {children}
    </div>
  );
}