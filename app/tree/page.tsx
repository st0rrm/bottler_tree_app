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
  const { total, count, setCount, setTotal } = useTreeStore()
  const scoreRef = useRef()
  const treeRef = useRef()
  const [treeView, setTreeView] = useState(null) // useState 추가

  const handleGrow = (score) => {
    const c = count + 1
    const t = total + score
    scoreRef.current.score(score)
    treeRef.current.generating(t, c, 1)
    setCount(c)
    setTotal(t)
  }

  const handleInit = () => {
    const {t,c} = {t:50, c:10}
    treeRef.current.init(t, c)
    setCount(t)
    setTotal(c)
  }

  useEffect(() => {
    setTreeView(
      <View debug={true} className='absolute top-0 flex h-screen w-full flex-col items-center justify-center' orbit>
        <Tree>
          <LSystemInstanced ref={treeRef} />
        </Tree>
        <Background />
        <Guide />
        <Common color={'#EFEFED'} />
      </View>
    )
  }, []) // useEffect에서 treeView 상태를 설정

  return (
    <>
      <Leva hidden={true} />
      <div className={'fixed w-24 h-16 bottom-40 right-0 bg-amber-300 z-40'}>
        <button onClick={()=>handleGrow(5)} className={'w-full h-full'}>
          GROW + 5
        </button>
      </div>

      <div className={'fixed w-24 h-16 bottom-16 right-0 bg-amber-300 z-40'}>
        <button onClick={()=>handleGrow(100)} className={'w-full h-full'}>
          GROW + 100
        </button>
      </div>
      {/*<div className={'fixed w-24 h-16 bottom-16 left-0 bg-amber-300 z-40'}>*/}
      {/*  <button onClick={handleInit} className={'w-full h-full'}>*/}
      {/*    INIT*/}
      {/*  </button>*/}
      {/*</div>*/}
      <Cover />
      <Score ref={scoreRef} />
      {treeView}
    </>
  )
}
