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

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), { ssr: false })
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const { total, count, setCount, setTotal } = useTreeStore()
  const treeRef = useRef()
  const [treeView, setTreeView] = useState(null) // useState 추가

  const handleGrow = () => {
    const next = count + 1
    const total = next * 10
    treeRef.current.generating(total, next, 1)
    setCount(next)
    setTotal(total)
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
      <div className={'fixed w-32 h-16 bottom-16 right-0 bg-amber-300 z-40'}>
        <button onClick={handleGrow} className={'w-full h-full'}>
          GROW
        </button>
      </div>
      <Cover />
      {treeView}
    </>
  )
}
