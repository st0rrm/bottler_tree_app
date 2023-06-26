//@ts-nocheck

import TreeInstances from '@/components/tree/TreeInstances'
import { nanoid } from 'nanoid'
import { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const TreeInstancesPool = forwardRef((props, ref) => {
  const { datas, count, onLoaded, onGrow } = props
  const refs = useRef(datas.map(() => createRef()))
  const [instances, setInstances] = useState(null)

  useImperativeHandle(ref, () => ({
    save: (uid) => {
      datas.map((data, index) => refs.current[index].current.save(uid))
    },
    load: (uid) => {
      datas.map((data, index) => refs.current[index].current.load(uid))
    },
    setNextMesh: (index, position, quaternion, scale, delay, animation) => {
      if (refs.current[index].current)
        refs.current[index].current.setNextMesh(position, quaternion, scale, delay, animation)
    },
  }))

  useEffect(() => {
    setInstances(
      datas.map((data, index) => (
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
          onGrow={onGrow}
        />
      )),
    )
  }, [])

  return <>{instances}</>
})
TreeInstancesPool.displayName = 'TreeInstancesPool'

export default TreeInstancesPool
