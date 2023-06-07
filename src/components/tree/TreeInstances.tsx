import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { Object3D, Quaternion, TextureLoader, Matrix4, Vector3 } from 'three'
import { Utils } from '@/components/tree/ThreeHelper'

const TreeInstances = forwardRef( (props, ref) => {
  const { count, path, width, height } = props
  const meshRef = useRef()
  const temp = new Object3D()
  const texture = useLoader(TextureLoader, path)
  const pool = []
  const tween = []

  useEffect(() => {
    if (meshRef.current) {
      const ratio = Utils.getRatio()
      // Set positions
      for (let i = 0; i < count; i++) {
        temp.position.set(0, -3, 0)
        temp.scale.set(ratio, ratio, ratio)
        temp.updateMatrix()

        console.log("temp---", temp)

        meshRef.current.setMatrixAt(i, temp.matrix)
      }
      // Update the instance
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  }, [ref])

  useImperativeHandle(ref, () => ({
    setNextMesh: (position, quaternion, scale, delay) => {
      const id = pool.length
      const dummy = new Object3D()
      dummy.position.copy(position)
      dummy.quaternion.copy(quaternion)
      dummy.scale.copy(scale)
      dummy.updateMatrix()
      pool[id] = dummy

      console.log("dummy---", dummy)

      meshRef.current.setMatrixAt(id, dummy.matrix);
      meshRef.current.instanceMatrix.needsUpdate = true;
    },
  }))


  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <planeBufferGeometry attach='geometry' args={[width, height]} />
      <meshBasicMaterial attach='material' map={texture} transparent alphaTest={0.1} />
    </instancedMesh>
  )
})

export default TreeInstances
