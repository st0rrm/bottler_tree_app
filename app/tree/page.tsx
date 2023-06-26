//@ts-nocheck
'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import Tree from '@/components/tree/Tree'
import { LSystemInstanced } from '@/components/tree/LSystemInstanced'
import Cover from '@/components/tree/Cover'
import { Leva } from 'leva'
import useTreeStore from '@/stores/useTreeStore'
import Background from '@/components/tree/Background'
import Score from '@/components/tree/Score'
import { SendToMobile, useMobileStatus } from '@/helpers/SendToMobile'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), { ssr: false })
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

type Data = {
  type: string,
  uid: string,
  score: number,
  total: number,
  count: number,
}

export default function Page() {
  const { uid, total, count, setUid, setCount, setTotal, setInitThree } = useTreeStore()
  const scoreRef = useRef()
  const treeRef = useRef()
  const [treeView, setTreeView] = useState(null) // useState 추가
  const isMobile = useMobileStatus();

  useEffect(() => {
    document.addEventListener("message", receiveMessage);
    window.addEventListener("message", receiveMessage);
    return () => {
      document.removeEventListener("message", receiveMessage);
      window.removeEventListener("message", receiveMessage);
    }
  }, [])

  useEffect(() => {
    if (isMobile) {
      SendToMobile("COMMAND", "hello");
    }
  }, [isMobile])

  const receiveMessage = (e:any)=>{
    try{
      const data = JSON.parse(e.data)
      if(data.type === 'grow'){

      }else if(data.type === 'init'){
        setUid(data.uid)
        setCount(data.count)
        setTotal(data.total)
      }
    } catch (e) {
      //
    }
  }

  const handleGrow = (o) => {
    const { score, total, count } = o
    scoreRef.current.score(score)
    treeRef.current.generating(total, count, 1)
    setCount(count)
    setTotal(total)
  }

  const handleInit = (o) => {
    const { uid, total, count } = o
    treeRef.current.init(total, count)
    setUid(uid)
    setCount(count)
    setTotal(total)
    setInitThree(true)
  }

  const handleSave = () => {
    treeRef.current.save(uid)
  }

  const handleLoad = () => {
    treeRef.current.load(uid)
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
        <button onClick={() => handleGrow({ uid: "a", score: 5, total: total+5, count: count+1 })} className={'w-full h-full'}>
          GROW + 5
        </button>
      </div>

      <div className={'fixed w-24 h-16 bottom-16 right-0 bg-amber-300 z-40'}>
        <button onClick={() => handleInit({ uid: "d", total: 0, count: 1, score: 0 })} className={'w-full h-full'}>
          INIT + 0
        </button>
      </div>

      <div className={'fixed w-24 h-16 bottom-16 left-0 bg-amber-300 z-40'}>
        <button onClick={() => handleInit({ uid: "h", total: 800, count: 100, score: 0 })} className={'w-full h-full'}>
          INIT + 800
        </button>
      </div>

      <div className={'fixed w-24 h-16 bottom-40 left-0 bg-amber-300 z-40'}>
        <button onClick={() => handleSave()} className={'w-full h-full'}>
          SAVE
        </button>
      </div>

      <div className={'fixed w-24 h-16 bottom-64 left-0 bg-amber-300 z-40'}>
        <button onClick={() => handleLoad()} className={'w-full h-full'}>
          LOAD
        </button>
      </div>

      <Cover />
      <Score ref={scoreRef} />
      {treeView}
    </>
  )
}
