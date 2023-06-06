import TreeInstances from '@/components/tree/TreeInstances'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

const TreeInstancesPool = ({datas, count=1000}) => {

  const [pool, setPool] = useState([])

  useEffect(() => {
    const temp = []
    datas.forEach((data) => {
      temp.push(<TreeInstances
        count={count}
        path={data.path}
        width={data.width}
        height={data.height}
        key={nanoid()}
      />)
    })
    setPool(temp)
  }, [])

  return (
    <>
      {pool}
    </>
  )
}

export default TreeInstancesPool
