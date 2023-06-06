//@ts-nocheck

import { useState } from 'react'
import TreeInstancesPool from '@/components/tree/TreeInstancesPool'
import { branchImages, flowerImages, fruitImages, leafImages } from '@/components/tree/resources'
import LSystemInstanced from '@/components/tree/LSystemInstanced'

export const Test = () => {
  const [branch, setBranch] = useState(null)
  const [flower, setFlower] = useState(null)
  const [fruit, setFruit] = useState(null)
  const [leaf, setLeaf] = useState(null)

  return (
    <group>
      <LSystemInstanced/>
      <TreeInstancesPool datas={branchImages} count={100} />
      {/*<TreeInstancesPool datas={flowerImages} count={100} />*/}
      {/*<TreeInstancesPool datas={fruitImages} count={100} />*/}
      {/*<TreeInstancesPool datas={leafImages} count={1000} />*/}
    </group>
  )
}
