//@ts-nocheck
'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import Tree from '@/components/tree/Tree'
import Guide from '@/components/tree/Guide'
import { LSystemInstanced } from '@/components/tree/LSystemInstanced'
import Cover from '@/components/tree/Cover'
import { Leva } from 'leva'
import useTreeStore from '@/stores/useTreeStore'
import Background from '@/components/tree/Background'
import Score from '@/components/tree/Score'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), { ssr: false })
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const { total, count, setCount, setTotal, setInitThree } = useTreeStore()
  const scoreRef = useRef()
  const treeRef = useRef()
  const [treeView, setTreeView] = useState(null) // useState 추가

  const handleGrow = (o) => {
    const { s, t, c } = o
    scoreRef.current.score(s)
    treeRef.current.generating(t, c, 1)
    setCount(c)
    setTotal(t)
  }

  const handleInit = (o) => {
    console.trace()
    const { t, c } = o
    treeRef.current.init(t, c)
    setCount(c)
    setTotal(t)
    setInitThree(true)
  }

  useEffect(() => {
    setTreeView(
      <View debug={true} className='absolute top-0 flex h-screen w-full flex-col items-center justify-center' orbit>
        <Tree>
          <LSystemInstanced ref={treeRef} />
        </Tree>
        <Background />
        <Common color={'#EFEFED'} />
      </View>,
    )
  }, []) // useEffect에서 treeView 상태를 설정

  return (
    <>
      <Leva hidden={true} />
      <div className={'fixed w-24 h-16 bottom-40 right-0 bg-amber-300 z-40'}>
        <button onClick={() => handleGrow({ s: 5, t: total+5, c: count+1 })} className={'w-full h-full'}>
          GROW + 5
        </button>
      </div>

      <div className={'fixed w-24 h-16 bottom-16 right-0 bg-amber-300 z-40'}>
        <button onClick={() => handleInit({ t: 0, c: 1 })} className={'w-full h-full'}>
          INIT + 0
        </button>
      </div>

      <div className={'fixed w-24 h-16 bottom-16 left-0 bg-amber-300 z-40'}>
        <button onClick={() => handleInit({ t: 800, c: 100 })} className={'w-full h-full'}>
          INIT + 800
        </button>
      </div>
      <Cover />
      <Score ref={scoreRef} />
      {treeView}
    </>
  )
}
