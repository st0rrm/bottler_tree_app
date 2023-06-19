'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  OrthographicCamera,
  View as ViewImpl,
} from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import { Perf } from 'r3f-perf'

export const Common = ({ color }) => {
  return (
    <Suspense fallback={null}>
      <color attach='background' args={[color]} />
      {/*<Grid cellColor='white' args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]} infiniteGrid />*/}
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={20} />
    </Suspense>
  )
}

const View = forwardRef(({ children, orbit, debug = false, ...props }, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        {debug && <Perf position='top-left' />}
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
