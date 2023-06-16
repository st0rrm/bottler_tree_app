'use client'

import dynamic from 'next/dynamic'
import LSystemInstanced from '@/components/tree/LSystemInstanced'
import { useEffect, useRef, useState } from 'react'
import { Utils } from '@/components/tree/ThreeHelper'
import { Box } from '@react-three/drei'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const treeRef = useRef()
  const [count, setCount] = useState(0)

  const handleGrow = () => {
    const next = count + 1
    const total = next * 50
    treeRef.current.generating(total, next, 2)
    setCount(next)
  }

  useEffect(()=>{
    const sw = Utils.screenWidth
    const sh = Utils.screenHeight
    console.log("sw: ", sw, "sh: ", sh, " ratio: ", Utils.getRatio())
  }, [])

  return (
    <>
      <div className={"fixed w-32 h-16 top-0 right-0 bg-amber-300 z-40"}>
        <button onClick={handleGrow} className={"w-full h-full"}>GROW</button>
      </div>
      <View debug className='absolute top-0 flex h-screen w-full flex-col items-center justify-center' orbit>
        {/*<Box args={[1, 1, 1]} position={[0, 0, 0]} />*/}
        <group position={[0, -3, 0]}>
          <LSystemInstanced ref={treeRef} />

        </group>
        <group position={[0, -2, 0]}>
          <Box scale={[0.1, 0.1, 0.1]} >
            <meshStandardMaterial color={"red"}  />
          </Box>
        </group>

        <Box scale={[0.1, 0.1, 0.1]} >
          <meshStandardMaterial color={"yellow"}  />
        </Box>

        <Common color={"darkgray"} />
      </View>
    </>
  )
}
