import React from 'react'
import { Box, Plane, Sphere, useTexture } from '@react-three/drei'
import { useThreeHelper } from '@/components/tree/ThreeHelper'
import { useControls } from 'leva'
const Guide = () => {
  const { guideShow } = useControls({guideShow:false})
  const guide = {
    path: "./assets/guide.png",
    width: 390,
    height: 844,
  }
  const texture = useTexture(guide.path)
  const { ratio } = useThreeHelper()
  return (
    <group>
      <Sphere scale={[0.3, 0.3, 0.3]}>
        <meshBasicMaterial attach='material' color={"red"} wireframe />
      </Sphere>
      {guideShow &&
      <Plane args={[guide.width, guide.height]} scale={ratio*6.1} position={[0, 0, -1]} >
        <meshBasicMaterial attach='material' map={texture} />
      </Plane>
      }
    </group>
  )
}

export default Guide
