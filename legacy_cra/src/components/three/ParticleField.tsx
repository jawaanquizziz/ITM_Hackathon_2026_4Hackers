import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
}

export function ParticleField({ count = 100 }: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      new THREE.Color('#6366F1'),
      new THREE.Color('#EC4899'),
      new THREE.Color('#22D3EE'),
      new THREE.Color('#10B981'),
      new THREE.Color('#F59E0B'),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Position
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 15 - 10;

      // Color
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Size
      sizes[i] = Math.random() * 3 + 1;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Glowing ring effect
export function GlowingRing({ color = '#6366F1', scale = 1 }: { color?: string; scale?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={ringRef} scale={scale}>
      <torusGeometry args={[1, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

// Animated grid plane
export function GridPlane() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[50, 50, '#1a1a2e', '#16162a']}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, -5, -10]}
    />
  );
}