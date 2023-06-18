'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import {
  Environment,
  Grid,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  View as ViewImpl,
  GizmoHelper,
  GizmoViewport,
  Box,
} from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import { useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

const gridSize = [10.5, 10.5]
const gridConfig = {
  cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
  cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
  cellColor: '#6f6f6f',
  sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
  sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
  sectionColor: '#9d4b4b',
  fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
  fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
  followCamera: false,
  infiniteGrid: true,
}
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
      <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={20}/>

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
