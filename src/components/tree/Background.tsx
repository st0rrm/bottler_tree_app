//@ts-nocheck

import React, { createRef, useEffect, useRef, useState } from 'react'
import { Plane, useTexture } from '@react-three/drei'
import useTreeStore from '@/stores/useTreeStore'
import { useFrame, useThree } from '@react-three/fiber'

const Background = () => {
  const { total } = useTreeStore()
  const [id, setId] = useState(0)

  const objRef = useRef()
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
  const meshesRef = backgrounds.map(() => createRef()); // create array of refs here instead of within map function\

  //const meshRefs = Array(backgrounds.length).fill(0).map(() => useRef(null)); // Moved useRef calls out of map function

  // const [meshRefs, setMeshRefs] = useState([]); // use state to keep track of refs
  // useEffect(() => {
  //   setMeshRefs((meshRefs) => Array(backgrounds.length).fill().map((_, i) => meshRefs[i] || createRef())); // initialize refs in useEffect
  // }, [backgrounds]);




  const object = useTexture('/assets/backgrounds/bg_objects.png')
  const { width, height } = useThree((state) => state.viewport)

  useFrame(() => {
    const speed = 0.01
    meshesRef.forEach((ref, index) => {
      if (ref.current) {
        if (index === id) {
          ref.current.material.opacity = Math.min(1, ref.current.material.opacity + speed)
        } else {
          ref.current.material.opacity = Math.max(0, ref.current.material.opacity - speed)
        }
      }
    })

    if (objRef.current) {
      if (id > 0) objRef.current.material.opacity = Math.min(1, objRef.current.material.opacity + speed)
      else objRef.current.material.opacity = Math.max(0, objRef.current.material.opacity - speed)
    }
  })

  useEffect(() => {
    let newId = parseInt((total / 100 - 1).toString())
    newId = newId < 0 ? 0 : newId
    newId = newId > 7 ? 7 : newId
    if (newId !== id) {
      setId(newId)
    }
  }, [total])

  return (
    <group>
      <Plane ref={objRef} args={[width, width * (1086 / 1255)]} position={[0, height / 2 - 12, -0.9]}>
        <meshBasicMaterial attach='material' map={object} transparent opacity={0} />
      </Plane>
      {meshesRef && backgrounds.map((background, index) => (
        <Plane key={index} ref={meshesRef[index]} args={[height, height]} position={[0, 0, -1.1 - index * 0.1]}>
          <meshBasicMaterial attach='material' map={background} transparent opacity={0} />
        </Plane>
      ))}
    </group>
  )
}

export default Background
