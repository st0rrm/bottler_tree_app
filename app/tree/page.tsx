'use client'

import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'
import Tree from '@/components/tree/Tree'
import Guide from '@/components/tree/Guide'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), { ssr: false })
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })
const LSystemInstanced = dynamic(() => import('@/components/tree/LSystemInstanced').then((mod) => mod.LSystemInstanced), {
  ssr: false,
  // loading: () => (
  //   <div className='flex h-full w-full flex-col items-center justify-center'>
  //     <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
  //       <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
  //       <path
  //         className='opacity-75'
  //         fill='currentColor'
  //         d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
  //       />
  //     </svg>
  //   </div>
  // ),
})

export default function Page() {
  const treeRef = useRef()
  // const [count, setCount] = useState(0)
  const [grow, setGrow] = useState({ count: 0, total: 0 })

  // const handleGrow = () => {
  //   const next = count + 1
  //   const total = next * 10
  //   console.log("treeRef.current: ", treeRef.current)
  //   treeRef.current.generating(total, next, 2)
  //   setCount(next)
  // }


  const handleGrow = () => {
    const next = grow.count + 1
    const total = next * 10
    const temp = {
      count: next,
      total: total
    }
    setGrow(temp)
  }

  return (
    <>
      <div className={'fixed w-32 h-16 bottom-16 right-0 bg-amber-300 z-40'}>
        <button onClick={handleGrow} className={'w-full h-full'}>
          GROW
        </button>
      </div>
      <View debug={false} className='absolute top-0 flex h-screen w-full flex-col items-center justify-center' orbit>
        <Tree >
          <LSystemInstanced ref={treeRef} grow={grow}  />
        </Tree>
        <Guide />
        <Common color={'darkgray'} />
      </View>
    </>
  )
}
