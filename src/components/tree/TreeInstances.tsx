import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Matrix4, Object3D, Quaternion, Vector3 } from 'three'
import { useThreeHelper } from '@/components/tree/ThreeHelper'
import { useTexture } from '@react-three/drei'

const TreeInstances = forwardRef((props, ref) => {
  const { count, path, width, height, type, onLoaded } = props
  const texture = useTexture(path, onLoaded)
  const { ratio } = useThreeHelper()
  const meshRef = useRef()
  const geometryRef = useRef()
  const temp = new Object3D()
  const pool = []
  const tween = []

  useImperativeHandle(ref, () => ({
    setNextMesh: (position: Vector3, quaternion: Quaternion, scale: Vector3, delay: number) => {
      const id = pool.length
      const dummy = new Object3D()
      dummy.position.copy(position)
      dummy.quaternion.copy(quaternion)
      dummy.scale.copy(scale)
      dummy.updateMatrix()
      pool[id] = dummy

      // console.log('%cinstance.position: %o', 'color:blue', dummy.position)

      meshRef.current.setMatrixAt(id, dummy.matrix)
      meshRef.current.instanceMatrix.needsUpdate = true
    },
  }))

  useEffect(() => {
    if (meshRef.current) {
      // Set positions
      for (let i = 0; i < count; i++) {
        temp.position.set(0, -1, 0)
        temp.scale.set(ratio, ratio, ratio)
        temp.updateMatrix()
        meshRef.current.setMatrixAt(i, temp.matrix)
      }
      // Update the instance
      meshRef.current.instanceMatrix.needsUpdate = true
    }

    if (geometryRef.current) {
      let move
      if (type === 'branch') {
        move = new Vector3(0, height * 0.5, 0)
      } else if (type === 'leaf') {
        move = new Vector3(0, height * 0.5, 10)
      } else if (type === 'flower') {
        move = new Vector3(0, 0, 20)
      } else if (type === 'fruit') {
        move = new Vector3(0, 0, 30)
      }
      if (type && move) geometryRef.current.applyMatrix4(new Matrix4().makeTranslation(move.x, move.y, move.z))
    }
  }, [ref])

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <planeBufferGeometry attach='geometry' args={[width, height]} ref={geometryRef} />
      {!texture && <meshBasicMaterial attach='material' wireframe />}
      {texture && <meshBasicMaterial attach='material' map={texture} transparent alphaTest={0.3} />}
    </instancedMesh>
  )
})

export default TreeInstances
