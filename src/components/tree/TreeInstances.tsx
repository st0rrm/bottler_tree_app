//@ts-nocheck

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

  const typeConfigs = {
    'leaf': {
      distanceThreshold: 0.01,
      duration: 1,
      calculateY: (y) => y - 3,
    },
    'flower': {
      distanceThreshold: 0.8,
      duration: 4,
      calculateY: (y) => y * -3,
    }
  }

  const animateAndShrink = (existingDummy, duration, calculateY) => {
    const existingObject = existingDummy.object;

    gsap.to(existingObject.position, {
      x: existingObject.position.x,
      y: calculateY(existingObject.position.y),
      z: existingObject.position.z,
      duration,
      ease: 'power1.in',
      onUpdate: () => {
        existingObject.updateMatrix();
        meshRef.current.setMatrixAt(pool.indexOf(existingDummy), existingObject.matrix);
        meshRef.current.instanceMatrix.needsUpdate = true;
      },
    });

    gsap.to(existingObject.scale, {
      x: 0.00001, // new x scale
      y: 0.00001, // new y scale
      z: 0.00001, // new z scale
      duration,
      ease: 'power1.in',
      onUpdate: () => {
        existingObject.updateMatrix();
        meshRef.current.setMatrixAt(pool.indexOf(existingDummy), existingObject.matrix);
        meshRef.current.instanceMatrix.needsUpdate = true;
      }
    });
  }

  const testCollision = (obj) => {
    for (const existingDummy of pool) {
      if (existingDummy.complete && (type === "leaf" || type === "flower")) {
        const typeConfig = typeConfigs[type];
        const dist = existingDummy.object.position.distanceTo(obj.position);

        if (dist < typeConfig.distanceThreshold) {
          animateAndShrink(existingDummy, typeConfig.duration, typeConfig.calculateY);
          break;
        }
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

TreeInstances.displayName = 'TreeInstances'

export default TreeInstances
