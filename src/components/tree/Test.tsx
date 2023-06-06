//@ts-nocheck

import {
  Euler,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  PlaneGeometry,
  BoxGeometry,
  Quaternion,
  TextureLoader,
  Vector3,
  Object3D,
} from 'three'
import { useEffect, useRef, useState } from 'react'
import TreeInstancedMesh from '@/components/tree/TreeInstancedMesh'
import { Utils } from '@/components/tree/ThreeHelper'

export const Test = () => {

  const [branch, setBranch] = useState(null)
  const [flower, setFlower] = useState(null)
  const [fruit, setFruit] = useState(null)
  const [leaf, setLeaf] = useState(null)

  const branchImages = [
    {
      path: './assets/branch_v1.png',
      width: 36,
      height: 251,
    },
    {
      path: './assets/branch_v2.png',
      width: 52,
      height: 230,
    },
    {
      path: './assets/branch_v3.png',
      width: 36,
      height: 218,
    },
  ]

  const flowerImages = [
    {
      path: './assets/flower_v1.png',
      width: 78,
      height: 78,
    },
    {
      path: './assets/flower_v2.png',
      width: 68,
      height: 68,
    },
    {
      path: './assets/flower_v3.png',
      width: 68,
      height: 57,
    },
    {
      path: './assets/flower_v4.png',
      width: 69,
      height: 67,
    },
    {
      path: './assets/flower_v5.png',
      width: 85,
      height: 85,
    },
  ]

  const fruitImages = [
    {
      path: './assets/fruit_v1.png',
      width: 59,
      height: 62,
    },
    {
      path: './assets/fruit_v2.png',
      width: 62,
      height: 64,
    },
    {
      path: './assets/fruit_v3.png',
      width: 58,
      height: 55,
    },
    {
      path: './assets/fruit_v4.png',
      width: 65,
      height: 63,
    },
    {
      path: './assets/fruit_v5.png',
      width: 75,
      height: 65,
    },
    {
      path: './assets/fruit_v6.png',
      width: 75,
      height: 65,
    },
  ]

  const leaf1Images = [
    {
      path: './assets/leaf1_v1.png',
      width: 45,
      height: 102,
    },
    {
      path: './assets/leaf1_v2.png',
      width: 39,
      height: 90,
    },
    {
      path: './assets/leaf1_v3.png',
      width: 39,
      height: 89,
    },
    {
      path: './assets/leaf1_v1.png',
      width: 45,
      height: 102,
    },
    {
      path: './assets/leaf1_v2.png',
      width: 39,
      height: 90,
    },
    {
      path: './assets/leaf1_v3.png',
      width: 39,
      height: 89,
    },
  ]

  const randomizeMatrix = (function () {
    const position = new Vector3()
    const rotation = new Euler()
    const quaternion = new Quaternion()
    const scale = new Vector3()

    return function (matrix) {
      position.x = 4 + Math.random() * 10
      position.y = -200
      position.z = 0

      rotation.x = Math.random() * 2 * Math.PI
      rotation.y = Math.random() * 2 * Math.PI
      rotation.z = Math.random() * 2 * Math.PI

      quaternion.setFromEuler(rotation)
      scale.x = scale.y = scale.z = 1.0
      matrix.compose(position, quaternion, scale)
    }
  })()

  const poolGenerate = (textures, datas, size = 1000) => {
    const temp = []
    const matrix = new Matrix4()
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i]
      const data = datas[i]
      const mesh = new InstancedMesh(
        new BoxGeometry(1, 1, 1),
        // new PlaneGeometry(Utils.getPos(data.width), Utils.getPos(data.height)),
        new MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.1,
        }),
        size,
        // Utils.getPos(data.height),
      )
      for (let j = 0; j < size; j++) {
        randomizeMatrix(matrix)
        mesh.setMatrixAt(j, matrix)
      }
      temp.push(mesh)
    }

    console.log(temp)

    return temp
  }

  useEffect(async () => {
    const textureLoader = new TextureLoader()

    const loadImages = async (imagePaths) => {
      const loaders = imagePaths.map((image) => {
        return new Promise((resolve, reject) => {
          textureLoader.load(image.path, resolve, undefined, reject)
        })
      })

      try {
        const loadedImages = await Promise.all(loaders)
        return loadedImages
      } catch (error) {
        console.error('Error loading images:', error)
        return []
      }
    }

    const loadedBranchImages = await loadImages(branchImages)
    const loadedFlowerImages = await loadImages(flowerImages)
    const loadedFruitImages = await loadImages(fruitImages)
    const loadedLeaf1Images = await loadImages(leaf1Images)

    const branchPool = poolGenerate(loadedBranchImages, branchImages)

    setBranch(branchPool)
  }, [])

  function Instances({ count = 100, temp = new Object3D() }) {
    const ref = useRef()
    useEffect(() => {
      // Set positions
      for (let i = 0; i < count; i++) {
        temp.position.set(Math.random(), Math.random(), Math.random())
        temp.updateMatrix()
        ref.current.setMatrixAt(i, temp.matrix)
      }
      // Update the instance
      ref.current.instanceMatrix.needsUpdate = true
    }, [])
    return (
      <instancedMesh ref={ref} args={[null, null, count]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshPhongMaterial />
      </instancedMesh>
    )
  }

  return(
    <group>
      { branch && branch.map((item, index) => {
        return <primitive key={index} object={item} />
      }) }

      <Instances/>
    </group>
    )

}

