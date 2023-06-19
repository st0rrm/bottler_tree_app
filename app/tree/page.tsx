'use client'

import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Tree from '@/components/tree/Tree'
import Guide from '@/components/tree/Guide'
import { LSystemInstanced } from '@/components/tree/LSystemInstanced'
import Cover from '@/components/tree/Cover'
import useTreeStore from '@/stores/useTreeStore'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), { ssr: false })
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const treeRef = useRef()
  const [count, setCount] = useState(0)
  const [treeView, setTreeView] = useState(null) // useState 추가

  const handleGrow = () => {
    const next = count + 1
    const total = next * 10
    console.log('treeRef.current: ', treeRef.current)
    treeRef.current.generating(total, next, 2)
    setCount(next)
  }

  useEffect(() => {
    setTreeView(
      <View debug={false} className='absolute top-0 flex h-screen w-full flex-col items-center justify-center' orbit>
        <Tree>
          <LSystemInstanced ref={treeRef} />
        </Tree>
        <Guide />
        <Common color={'darkgray'} />
      </View>
    )
  }, []) // useEffect에서 treeView 상태를 설정

  return (
    <>
      <div className={'fixed w-32 h-16 bottom-16 right-0 bg-amber-300 z-40'}>
        <button onClick={handleGrow} className={'w-full h-full'}>
          GROW
        </button>
      </div>
      {treeView}
    </>
  )
}
