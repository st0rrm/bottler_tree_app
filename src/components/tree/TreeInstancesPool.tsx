//ts-nocheck

import TreeInstances from '@/components/tree/TreeInstances'
import { nanoid } from 'nanoid'
import { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const TreeInstancesPool = forwardRef((props, ref) => {
  const { datas, count, onLoaded } = props
  const [pool, setPool] = useState([])
  const refs = useRef(datas.map(() => createRef()))

  // useEffect(() => {
  //   const temp = datas.map((data, index) => (
  //     <TreeInstances
  //       ref={refs.current[index]}
  //       count={count}
  //       path={data.path}
  //       width={data.width}
  //       height={data.height}
  //       type={data.type}
  //       key={nanoid()}
  //       onLoaded={onLoaded}
  //     />
  //   ))
  //   setPool(temp)
  // }, [datas, count, onLoaded])

  useImperativeHandle(ref, () => ({
    setNextMesh: (index, position, quaternion, scale, delay) => {
      if(refs.current[index].current) refs.current[index].current.setNextMesh(position, quaternion, scale, delay)
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

export default TreeInstancesPool
