'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Environment } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSpheres() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(50)].map((_, i) => (
        <Sphere key={i} args={[0.1, 16, 16]} position={[
          Math.random() * 10 - 5,
          Math.random() * 10 - 5,
          Math.random() * 10 - 5
        ]}>
          <meshStandardMaterial color={`hsl(${Math.random() * 360}, 50%, 75%)`} />
        </Sphere>
      ))}
    </group>
  )
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedSpheres />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}

