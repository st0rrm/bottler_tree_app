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
      {/*{color && <color attach='background' args={[color]} />}*/}
      {/*<ambientLight intensity={0.5} />*/}
      {/*<pointLight position={[20, 30, 10]} intensity={1} />*/}
      {/*<pointLight position={[-10, -10, -10]} color='blue' />*/}

      {/*<Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />*/}

      <Grid cellColor='white' args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]} infiniteGrid />

      <directionalLight position={[10, 10, 5]} />

      {/*<PerspectiveCamera makeDefault position={[0, 0, 10]} zoom={1} />*/}
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={20} />

      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor='white' />
      </GizmoHelper>
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
