//@ts-nocheck

import React from 'react'
import { Plane, useTexture } from '@react-three/drei'
import { branchImages } from '@/components/tree/resources'
import { useThreeHelper } from '@/components/tree/ThreeHelper'

const Root = () => {
  const { rootShow, hillShow } = { rootShow: true, hillShow: false }
  const branch = branchImages[0]
  const textureRoot = useTexture(branch.path)
  const hill = {
    path: '././assets/front_hills_new.png',
    width: 1100,
    height: 204,
  }
  const textureHill = useTexture(hill.path)
  const { ratio } = useThreeHelper()
  const rootScale = 1.2
  const hillScale = 4

  return (
    <group>
      {rootShow && (
        <Plane args={[branch.width, branch.height]} scale={ratio * rootScale} position={[0, 0.44, 0]}>
          <meshBasicMaterial attach='material' map={textureRoot} transparent alphaTest={0.3} />
        </Plane>
      )}
      {hillShow && (
        <Plane args={[hill.width, hill.height]} scale={ratio * hillScale} position={[0, -2.4, -0.1]}>
          <meshBasicMaterial attach='material' map={textureHill} transparent alphaTest={0.3} />
        </Plane>
      )}
    </group>
  )
}

export default Root
