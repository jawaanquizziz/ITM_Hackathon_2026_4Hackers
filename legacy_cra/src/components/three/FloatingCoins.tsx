import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingCoinsProps {
  count?: number;
  scale?: number;
}

export function FloatingCoins({ count = 10, scale = 1 }: FloatingCoinsProps) {
  const coins = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10 - 5,
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: (Math.random() * 0.5 + 0.5) * scale,
        speed: Math.random() * 0.5 + 0.5,
        color: ['#6366F1', '#EC4899', '#22D3EE', '#10B981', '#F59E0B'][
          Math.floor(Math.random() * 5)
        ],
        type: Math.random() > 0.5 ? 'coin' : 'card',
      });
    }
    return temp;
  }, [count, scale]);

  return (
    <group>
      {coins.map((coin, i) => (
        <Float
          key={i}
          speed={coin.speed}
          rotationIntensity={0.5}
          floatIntensity={0.5}
          floatingRange={[-0.5, 0.5]}
        >
          <Coin
            position={coin.position}
            rotation={coin.rotation as [number, number, number]}
            scale={coin.scale}
            color={coin.color}
            type={coin.type as 'coin' | 'card'}
          />
        </Float>
      ))}
    </group>
  );
}

interface CoinProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  type: 'coin' | 'card';
}

function Coin({ position, rotation, scale, color, type }: CoinProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (type === 'card') {
    return (
      <RoundedBox
        ref={meshRef}
        args={[1.5 * scale, 1 * scale, 0.1 * scale]}
        radius={0.05}
        smoothness={4}
        position={position}
        rotation={rotation}
      >
        <MeshDistortMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          distort={0.2}
          speed={2}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
    );
  }

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
      <MeshDistortMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        distort={0.1}
        speed={3}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// Animated Logo Coin
export function AnimatedLogoCoin({ size = 2 }: { size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={size}>
        <cylinderGeometry args={[1, 1, 0.2, 64]} />
        <MeshDistortMaterial
          color="#6366F1"
          metalness={0.95}
          roughness={0.05}
          distort={0.15}
          speed={4}
          emissive="#6366F1"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}