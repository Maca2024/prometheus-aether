'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const ATOM_COLORS = ['#00f0ff', '#ff00ff', '#ffd700', '#7000ff', '#00ff88']
const ATOM_LABELS = ['ROLE', 'CONTEXT', 'GOAL', 'PROCESS', 'FORMAT']

function PentagonMesh({ onVertexClick }: { onVertexClick: (index: number) => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const lineRef = useRef<THREE.LineSegments>(null)

  const vertices = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
      pts.push(new THREE.Vector3(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0))
    }
    return pts
  }, [])

  const edgeGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions: number[] = []
    const center = new THREE.Vector3(0, 0, 0)

    for (let i = 0; i < 5; i++) {
      const next = (i + 1) % 5
      // Pentagon edges
      positions.push(vertices[i].x, vertices[i].y, vertices[i].z)
      positions.push(vertices[next].x, vertices[next].y, vertices[next].z)
      // Lines to center
      positions.push(vertices[i].x, vertices[i].y, vertices[i].z)
      positions.push(center.x, center.y, center.z)
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [vertices])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Pentagon wireframe */}
      <lineSegments ref={lineRef} geometry={edgeGeometry}>
        <lineBasicMaterial color="#00f0ff" opacity={0.3} transparent />
      </lineSegments>

      {/* Center sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Vertex spheres */}
      {vertices.map((v, i) => (
        <mesh
          key={i}
          position={[v.x, v.y, v.z]}
          onClick={() => onVertexClick(i)}
          onPointerEnter={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerLeave={() => {
            document.body.style.cursor = 'default'
          }}
        >
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={ATOM_COLORS[i]}
            emissive={ATOM_COLORS[i]}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      {/* Orbiting particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <OrbitParticle key={i} index={i} radius={3.2} />
      ))}
    </group>
  )
}

function OrbitParticle({ index, radius }: { index: number; radius: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const speed = 0.2 + Math.random() * 0.3
  const offset = (index / 30) * Math.PI * 2
  const yOffset = (Math.random() - 0.5) * 1.5

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + offset
      ref.current.position.x = Math.cos(t) * radius
      ref.current.position.y = Math.sin(t) * radius + yOffset
      ref.current.position.z = Math.sin(t * 0.5) * 0.5
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#00f0ff" opacity={0.4} transparent />
    </mesh>
  )
}

interface PentagonSceneProps {
  onVertexClick: (index: number) => void
}

export default function PentagonScene({ onVertexClick }: PentagonSceneProps) {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} color="#7000ff" intensity={0.3} />
        <PentagonMesh onVertexClick={onVertexClick} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Labels overlay */}
      <div className="flex justify-center gap-3 mt-4 flex-wrap">
        {ATOM_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => onVertexClick(i)}
            className="px-3 py-1 text-xs font-display tracking-wider rounded-sm transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              color: ATOM_COLORS[i],
              border: `1px solid ${ATOM_COLORS[i]}40`,
              background: `${ATOM_COLORS[i]}10`,
              textShadow: `0 0 8px ${ATOM_COLORS[i]}50`,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
