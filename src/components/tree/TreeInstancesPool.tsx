//ts-nocheck

import TreeInstances from '@/components/tree/TreeInstances'
import { nanoid } from 'nanoid'
import { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const TreeInstancesPool = forwardRef((props, ref) => {
  const { datas, count } = props
  const [pool, setPool] = useState([])
  const refs = useRef(datas.map(() => createRef()))

  useEffect(() => {
    const temp = datas.map((data, index) => (
      <TreeInstances
        ref={refs.current[index]}
        count={count}
        path={data.path}
        width={data.width}
        height={data.height}
        type={data.type}
        key={nanoid()}
      />
    ))
    setPool(temp)
  }, [])

  useImperativeHandle(ref, () => ({
    setNextMesh: (position, quaternion, scale, delay) => {
      const index = Math.floor(Math.random() * datas.length)
      refs.current[index].current.setNextMesh(position, quaternion, scale, delay)
    },
  }))

  return (
    <>
      {pool}
    </>
  )
})

export default TreeInstancesPool
