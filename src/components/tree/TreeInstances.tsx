import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Matrix4, Object3D, Quaternion, Vector3 } from 'three'
import { useThreeHelper } from '@/components/tree/ThreeHelper'
import { useTexture } from '@react-three/drei'
import { gsap } from 'gsap'

type Item = {
  id: string
  object: Object3D
  complete: boolean
}

const TreeInstances = forwardRef((props, ref) => {
  const { count, path, width, height, type, onLoaded } = props
  const texture = useTexture(path, onLoaded)
  const { ratio } = useThreeHelper()
  const meshRef = useRef()
  const geometryRef = useRef()
  const temp = new Object3D()
  const pool = []

  const testCollision = (obj) => {
    //
    // Check if there is a mesh close to the new mesh
    //
    const distanceThreshold = 0.2
    for (const existingDummy of pool) {
      if (!existingDummy.complete || type === 'branch') continue
      const existingObject = existingDummy.object
      const dist = existingObject.position.distanceTo(obj.position)

      if (dist < distanceThreshold) {
        // console.log('%cdist: %o', 'color:blue', dist)
        // console.log('%cexistingObject.position: %o', 'color:red', existingObject.position)
        // Animate the existing mesh away and then remove it
        gsap.to(existingObject.position, {
          x: existingObject.position.x,
          y: existingObject.position.y * -3,
          z: existingObject.position.z,
          duration: 4,
          ease: 'power1.in',
          onUpdate: () => {
            existingObject.updateMatrix()
            meshRef.current.setMatrixAt(pool.indexOf(existingDummy), existingObject.matrix)
            meshRef.current.instanceMatrix.needsUpdate = true
          },
          onComplete: () => {
            // Remove the mesh after the animation is done
            // pool.splice(pool.indexOf(existingDummy), 1)
          },
        })

        // Stop processing as we've found a close mesh
        break
      }
    }
  }

  useImperativeHandle(ref, () => ({
    setNextMesh: (position: Vector3, quaternion: Quaternion, scale: Vector3, delay: number) => {
      const id = pool.length
      const obj = new Object3D()
      obj.position.copy(position)
      obj.quaternion.copy(quaternion)
      obj.scale.copy(scale)
      obj.updateMatrix()

      const item = {
        id: id,
        object: obj,
        complete: false,
      }

      pool[id] = item

      // console.log('%cinstance.position: %o', 'color:blue', dummy.position)

      gsap.fromTo(
        pool[id].object.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: scale.x,
          y: scale.y,
          z: scale.z,
          delay: delay,
          duration: 1,
          ease: 'power1.out',
          onUpdate: () => {
            if (pool[id]) {
              pool[id].object.updateMatrix()
              meshRef.current.setMatrixAt(id, pool[id].object.matrix)
              meshRef.current.instanceMatrix.needsUpdate = true
            }
          },
          onComplete: () => {
            if (pool[id]) {
              testCollision(pool[id].object)
              pool[id].complete = true
            }
          },
        },
      )

      // meshRef.current.setMatrixAt(id, obj.matrix)
      // meshRef.current.instanceMatrix.needsUpdate = true

      // console.log('%csetNextMesh: %o', 'color:blue', pool)
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
