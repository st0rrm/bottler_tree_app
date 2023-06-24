//@ts-nocheck

import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import Root from '@/components/tree/Root'
import useTreeStore from '@/stores/useTreeStore'

const Tree = ({children}) => {
  const margin = 5
  const { height } = useThree((state) => state.viewport)
  //
  return (
    <group position={[0, -height / 2 + margin , 0]}>
      {children}
      <Root />
    </group>
  )
}

export default Tree
