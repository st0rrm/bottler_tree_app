//@ts-nocheck

import TreeInstances from '@/components/tree/TreeInstances'
import { nanoid } from 'nanoid'
import { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const TreeInstancesPool = forwardRef((props, ref) => {
  const { datas, count, onLoaded } = props
  const refs = useRef(datas.map(() => createRef()))

  useImperativeHandle(ref, () => ({
    setNextMesh: (index, position, quaternion, scale, delay, animation) => {
      if(refs.current[index].current) refs.current[index].current.setNextMesh(position, quaternion, scale, delay, animation)
    },
  }))

  return (
    <>
      {datas.map((data, index) => (
        <TreeInstances
          ref={refs.current[index]}
          count={count}
          path={data.path}
          width={data.width}
          height={data.height}
          type={data.type}
          file={data.file}
          key={nanoid()}
          onLoaded={onLoaded}
        />
      ))}
    </>
  )
})
TreeInstancesPool.displayName = 'TreeInstancesPool'

export default TreeInstancesPool
