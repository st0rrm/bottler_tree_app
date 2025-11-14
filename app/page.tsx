//@ts-nocheck
'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import Tree from '@/components/tree/Tree'
import { LSystemInstanced } from '@/components/tree/LSystemInstanced'
import Cover from '@/components/tree/Cover'
import useTreeStore from '@/stores/useTreeStore'
import Background from '@/components/tree/Background'
import { SendToMobile, useMobileStatus } from '@/helpers/SendToMobile'
import { db } from '@/components/tree/db'
import Loading from '@/components/tree/Loading'


const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), { ssr: false })
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

type Data = {
  type: string
  uid: string
  score: number
  total: number
  count: number
}

export default function Page() {
  const { initThree, setUid, setInitThree } = useTreeStore()
  // const scoreRef = useRef()
  const treeRef = useRef()
  const [treeView, setTreeView] = useState(null) // useState 추가
  const isMobile = useMobileStatus()
  const [message, setMessage] = useState("나무 심는 중")
  const [showBackground, setShowBackground] = useState(true) // 배경 표시 여부

  useEffect(() => {
    // URL 파라미터 체크 - noBackground=true이면 배경 제거
    const params = new URLSearchParams(window.location.search)
    const noBackground = params.get('noBackground') === 'true'
    setShowBackground(!noBackground)

    document.addEventListener('message', receiveMessage)
    window.addEventListener('message', receiveMessage)

    return () => {
      document.removeEventListener('message', receiveMessage)
      window.removeEventListener('message', receiveMessage)
    }
  }, [])

  useEffect(() => {
    // showBackground 상태에 따라 treeView 업데이트
    setTreeView(
      <View debug={false} className='absolute top-0 flex h-screen w-full flex-col items-center justify-center' orbit={false}>
        <Tree>
          <LSystemInstanced ref={treeRef} position={[0, 0, 0.1]} />
        </Tree>
        {showBackground && <Background />}
        <Common color={showBackground ? '#EFEFED' : 'transparent'} />
      </View>,
    )
  }, [showBackground])

  useEffect(() => {
    if (treeRef.current) {
      console.log("threejs inited.")
      setMessage("물 주는 중")
      SendToMobile('COMMAND', 'hello')
    }
  }, [treeRef.current])

  const init = async (uid, total, count, force=false) => {

    try{
      // alert("03. ------- ", db)
      const saveTotal = await db.option.where({ uid: uid, key: 'total' }).first()
      const saveCount = await db.option.where({ uid: uid, key: 'count' }).first()

      const shouldInitialize = force || (!saveTotal && !saveCount);
      if (shouldInitialize) {
        treeRef.current.init(total, count);
      } else {
        treeRef.current.load(uid);
      }

      setTimeout(() => {

        setUid(uid)
        setInitThree(true)
        if (isMobile) {
          SendToMobile('COMMAND', 'init')
        }
        treeRef.current.save(uid)
      }, 250)
    } catch (e) {
      // 만약 실패 시 강제 생성
      treeRef.current.init(total, count);
      setTimeout(() => {
        setUid(uid)
        setInitThree(true)
        if (isMobile) {
          SendToMobile('COMMAND', 'init')
        }
        treeRef.current.save(uid)
      }, 250)
    }
  }

  const grow = async (score, total, count) => {
    // scoreRef.current.score(score)
    treeRef.current.generating(total, count, 1)
  }

  const receiveMessage = (e: any) => {
    try {
      const data = JSON.parse(e.data)
      const { type, uid, total, count, score, force } = data
      if (type === 'grow') {
        if (treeRef.current && score && total > -1) grow(score, total, count)
      } else if (type === 'init') {
        if (treeRef.current && uid && total > -1 && count) init(uid, total, count, force)
      } else if (type === 'save') {
        if (treeRef.current && uid) treeRef.current.save(uid)
      } else if (type === 'load') {
        if (treeRef.current && uid) treeRef.current.load(uid)
      }
    } catch (e) {
      //
    }
  }

  const Buttons = () => {
    return (
      <>
        <div className={'fixed w-24 h-16 bottom-40 right-0 bg-amber-300 z-50'}>
          <button
            onClick={() => {
              // handleGrow({ uid: 'a', score: 5, total: total + 5, count: count + 1 })
              grow(5, 0, 0)
            }}
            className={'w-full h-full'}
          >
            GROW + 5
          </button>
        </div>

        <div className={'fixed w-24 h-16 bottom-16 right-0 bg-amber-300 z-50'}>
          <button onClick={() => {
            init('123123aaaaaaa', 0, 1)
          }} className={'w-full h-full'}>
            INIT + 0
          </button>
        </div>

        <div className={'fixed w-24 h-16 bottom-16 left-0 bg-amber-300 z-50'}>
          <button
            onClick={() => {
              // handleInit({ uid: 'bbbb', total: 800, count: 100, score: 0 })
              init('asdfasdf11', 800, 100)
            }}
            className={'w-full h-full'}
          >
            INIT + 800
          </button>
        </div>

        <div className={'fixed w-24 h-16 bottom-40 left-0 bg-amber-300 z-50'}>
          <button onClick={() => handleSave()} className={'w-full h-full'}>
            SAVE
          </button>
        </div>

        <div className={'fixed w-24 h-16 bottom-64 left-0 bg-amber-300 z-50'}>
          <button onClick={() => handleLoad()} className={'w-full h-full'}>
            LOAD
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      {/*<Buttons />*/}
      <Cover />
      {/*<Score ref={scoreRef} onComplete={handleSave} />*/}
      {treeView}
      {initThree===false && <Loading msg={message} />}
    </>
  )
}
