'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ------------------------------------
// Petal geometry factory
// ------------------------------------
function makePetalGeometry(w: number, h: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  // right edge — outward bulge then narrow tip
  shape.bezierCurveTo(w * 0.85, h * 0.18, w, h * 0.58, w * 0.48, h)
  // tip
  shape.bezierCurveTo(w * 0.22, h * 1.08, -w * 0.22, h * 1.08, -w * 0.48, h)
  // left edge — mirror
  shape.bezierCurveTo(-w, h * 0.58, -w * 0.85, h * 0.18, 0, 0)

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.008,
    bevelSegments: 3,
    curveSegments: 14,
  })
}

// ------------------------------------
// Single petal
// ------------------------------------
interface PetalProps {
  layerIndex: number
  petalIndex: number
  totalPetals: number
  bloomProgress: number
  color: THREE.Color
}

function Petal({ layerIndex, petalIndex, totalPetals, bloomProgress, color }: PetalProps) {
  const geometry = useMemo(() => {
    const base = 0.28 + layerIndex * 0.1
    return makePetalGeometry(base, base * 2.6)
  }, [layerIndex])

  const angle = (petalIndex / totalPetals) * Math.PI * 2
  // Tighten inner layers when closed, loosen outer layers
  const closedPitch = -(Math.PI / 2) + layerIndex * 0.06
  const openPitch = Math.PI / 5.5 + layerIndex * 0.13
  const pitch = THREE.MathUtils.lerp(closedPitch, openPitch, bloomProgress)

  // Radial spread from centre
  const closedRadius = 0.02 + layerIndex * 0.04
  const openRadius = 0.08 + layerIndex * 0.28
  const radius = THREE.MathUtils.lerp(closedRadius, openRadius, bloomProgress)

  // Vertical stacking collapses as bloom opens
  const closedY = layerIndex * 0.22
  const openY = layerIndex * 0.06
  const posY = THREE.MathUtils.lerp(closedY, openY, bloomProgress)

  // Slight yaw offset per layer so petals interleave
  const yawOffset = layerIndex * 0.35

  return (
    <group rotation={[0, angle + yawOffset, 0]}>
      <mesh geometry={geometry} rotation={[pitch, 0, 0]} position={[0, posY, radius]}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.22}
          metalness={0.04}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
        />
      </mesh>
    </group>
  )
}

// ------------------------------------
// Full rose
// ------------------------------------
const LAYERS = [
  { count: 5 },
  { count: 7 },
  { count: 9 },
  { count: 11 },
  { count: 13 },
]

// Deep purple → lavender across layers
const PETAL_COLORS = [
  new THREE.Color(0.42, 0.22, 0.70),
  new THREE.Color(0.46, 0.27, 0.73),
  new THREE.Color(0.50, 0.32, 0.76),
  new THREE.Color(0.54, 0.37, 0.79),
  new THREE.Color(0.58, 0.42, 0.83),
]

interface RoseProps {
  bloomProgress: number
  darkMode: boolean
}

function Rose({ bloomProgress, darkMode }: RoseProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.14
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.06
  })

  return (
    <group ref={groupRef}>
      {/* Stamen — glowing sphere at centre */}
      <mesh>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.62, 0.44, 0.92)}
          roughness={0.08}
          metalness={0.2}
          emissive={new THREE.Color(0.3, 0.08, 0.55)}
          emissiveIntensity={darkMode ? 1.2 : 0.35}
          clearcoat={1}
        />
      </mesh>

      {/* Petal layers */}
      {LAYERS.map((layer, li) =>
        Array.from({ length: layer.count }, (_, pi) => (
          <Petal
            key={`${li}-${pi}`}
            layerIndex={li}
            petalIndex={pi}
            totalPetals={layer.count}
            bloomProgress={bloomProgress}
            color={PETAL_COLORS[li]}
          />
        ))
      )}

      {/* Leaves at base — appear as bloom progresses */}
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
          <mesh
            position={[0.38 * bloomProgress, -0.32, 0.12]}
            rotation={[0.25, 0, -0.35]}
          >
            <planeGeometry args={[0.42, 0.78, 4, 8]} />
            <meshPhysicalMaterial
              color={new THREE.Color(0.22, 0.58, 0.28)}
              roughness={0.55}
              side={THREE.DoubleSide}
              transparent
              opacity={0.82 * bloomProgress}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ------------------------------------
// Scene wrapper (exported)
// ------------------------------------
interface FlowerSceneProps {
  bloomProgress: number
  darkMode?: boolean
  className?: string
}

export default function FlowerScene({
  bloomProgress,
  darkMode = false,
  className = '',
}: FlowerSceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 1.2, 4.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        {/* Ambient */}
        <ambientLight intensity={darkMode ? 0.25 : 0.7} />

        {/* Key light */}
        <directionalLight
          position={[4, 8, 4]}
          intensity={darkMode ? 1.2 : 1.8}
          color={darkMode ? '#c4a8ff' : '#ffffff'}
          castShadow={false}
        />

        {/* Fill */}
        <directionalLight
          position={[-3, 2, -2]}
          intensity={darkMode ? 0.4 : 0.6}
          color={darkMode ? '#6644aa' : '#e8d8ff'}
        />

        {/* Purple rim / glow for dark mode */}
        {darkMode && (
          <pointLight position={[0, 0.5, 1.5]} intensity={3} color="#9678c9" decay={2} />
        )}

        <Rose bloomProgress={bloomProgress} darkMode={darkMode} />
      </Canvas>
    </div>
  )
}
