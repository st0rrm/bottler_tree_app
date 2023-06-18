import React from 'react'
import { useThree } from '@react-three/fiber'
import LSystemInstanced from '@/components/tree/LSystemInstanced'
import Root from '@/components/tree/Root'

const Tree = ({children}) => {
  const margin = 5
  const { height } = useThree((state) => state.viewport)

  return (
    <group position={[0, -height / 2 + margin , 0]}>
      {children}
      <Root />
    </group>
  )
}

export default Tree
