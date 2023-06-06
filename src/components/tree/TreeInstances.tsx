import React, { useEffect, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { Object3D, TextureLoader } from 'three'
import { Utils } from '@/components/tree/ThreeHelper'

const TreeInstances = ({ path, width, height, count = 1000 }) => {
  const ref = useRef()
  const temp = new Object3D()
  const texture = useLoader(TextureLoader, path)

  useEffect(() => {
    if (ref.current) {
      const ratio = Utils.getRatio()
      // Set positions
      for (let i = 0; i < count; i++) {
        temp.position.set(Math.random(), Math.random(), Math.random())
        temp.scale.set(ratio, ratio, ratio)
        temp.updateMatrix()
        ref.current.setMatrixAt(i, temp.matrix)
      }
      // Update the instance
      ref.current.instanceMatrix.needsUpdate = true
    }
  }, [ref])

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <planeBufferGeometry attach='geometry' args={[width, height]} />
      <meshBasicMaterial attach='material' map={texture} transparent alphaTest={0.1} />
    </instancedMesh>
  )
}

export default TreeInstances
