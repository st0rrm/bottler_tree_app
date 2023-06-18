import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { Object3D, Quaternion, TextureLoader, Matrix4, Vector3 } from 'three'
import { Utils } from '@/components/tree/ThreeHelper'

const TreeInstances = forwardRef((props, ref) => {
  const { count, path, width, height, type } = props
  const meshRef = useRef()
  const geometryRef = useRef()
  const temp = new Object3D()
  const texture = useLoader(TextureLoader, path)
  const pool = []
  const tween = []

  useEffect(() => {
    if (meshRef.current) {
      const ratio = Utils.getRatio()
      // Set positions
      for (let i = 0; i < count; i++) {
        temp.position.set(0, -1000, 0)
        temp.scale.set(ratio, ratio, ratio)
        temp.updateMatrix()
        meshRef.current.setMatrixAt(i, temp.matrix)
      }
      // Update the instance
      meshRef.current.instanceMatrix.needsUpdate = true
    }

    if (geometryRef.current) {
      let move;
      if(type==="branch" ) {
        move = new Vector3(0, height * 0.5, 0)
      } else if (type==="leaf") {
        move = new Vector3(0, height * 0.5, 10)
      } else if (type==="flower") {
        move = new Vector3(0, 0, 20)
      } else if (type==="fruit") {
        move = new Vector3(0, 0, 30)
      }
      if(type && move) geometryRef.current.applyMatrix4(new Matrix4().makeTranslation(move.x, move.y, move.z))
    }

  }, [ref])

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

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <planeBufferGeometry attach='geometry' args={[width, height]} ref={geometryRef} />
      {/*<meshBasicMaterial attach='material'  wireframe />*/}
      <meshBasicMaterial attach='material' map={texture} transparent alphaTest={0.3}   />
    </instancedMesh>
  )
})

export default TreeInstances
