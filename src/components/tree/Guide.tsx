import React from 'react'
import { Box, Plane, useTexture } from '@react-three/drei'
import { Utils } from '@/components/tree/ThreeHelper'
import { useControls } from 'leva'
const Guide = () => {
  const { guideShow } = useControls({guideShow:true})
  const guide = {
    path: "./assets/guide.png",
    width: 390,
    height: 844,
  }
  const ratio = Utils.getRatio()
  const texture = useTexture(guide.path)
  return (
    <group>
      <Box scale={[1, 1, 1]}>
        <meshStandardMaterial color={'red'} />
      </Box>
      {guideShow &&
      <Plane args={[guide.width, guide.height]} scale={ratio*6.1} position={[0, 0, -1]} >
        <meshBasicMaterial attach='material' map={texture} />
      </Plane>
      }
    </group>
  )
}

export default Guide
