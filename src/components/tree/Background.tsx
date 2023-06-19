import React, { useEffect, useRef, useState } from 'react'
import { Plane, useTexture } from '@react-three/drei'
import useTreeStore from '@/stores/useTreeStore'
import { useFrame, useThree } from '@react-three/fiber'

const Background = () => {
  const { total } = useTreeStore()
  const [id, setId] = useState(0)
  const meshRef1 = useRef()
  const meshRef2 = useRef()
  const objRef = useRef()
  const [fadeIn, setFadeIn] = useState(true)
  const backgrounds = useTexture([
    '/assets/backgrounds/000.png',
    '/assets/backgrounds/200.jpg',
    '/assets/backgrounds/300.jpg',
    '/assets/backgrounds/400.jpg',
    '/assets/backgrounds/500.jpg',
    '/assets/backgrounds/600.jpg',
    '/assets/backgrounds/700.jpg',
    '/assets/backgrounds/800.jpg',
  ])
  const object = useTexture('/assets/backgrounds/bg_objects.png')
  const { width, height } = useThree((state) => state.viewport)

  useFrame(() => {
    if (meshRef1.current && meshRef2.current) {
      const speed = 0.01
      if (fadeIn) {
        meshRef1.current.material.opacity = Math.min(1, meshRef1.current.material.opacity + speed)
        meshRef2.current.material.opacity = Math.max(0, meshRef2.current.material.opacity - speed)
      } else {
        meshRef1.current.material.opacity = Math.max(0, meshRef1.current.material.opacity - speed)
        meshRef2.current.material.opacity = Math.min(1, meshRef2.current.material.opacity + speed)
      }
    }
  })

  useEffect(() => {
    let newId = parseInt((total / 100 - 1).toString())
    newId = newId < 0 ? 0 : newId

    if (newId !== id) {
      setId(newId)
      setFadeIn(!fadeIn)
    }
  }, [total])

  return (
    <group>
      <Plane ref={objRef}  args={[width, width*(1086/1255)]} position={[0, height/2-15, -0.9]} >
        <meshBasicMaterial attach='material' map={object} transparent />
      </Plane>
      <Plane ref={fadeIn ? meshRef1 : meshRef2} args={[height, height]} position={[0, 0, -1]}>
        <meshBasicMaterial attach='material' map={backgrounds[id]} transparent />
      </Plane>
      <Plane ref={fadeIn ? meshRef2 : meshRef1} args={[height, height]} position={[0, 0, -1.1]}>
        <meshBasicMaterial attach='material' map={backgrounds[(id + 1) % backgrounds.length]} transparent />
      </Plane>
    </group>
  )
}

export default Background
