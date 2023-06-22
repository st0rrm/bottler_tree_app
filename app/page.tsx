'use client'

import dynamic from 'next/dynamic'

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  return (
    <>
      .
    </>
  )
}
