

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Utils } from '@/components/tree/ThreeHelper'
import { Euler, MathUtils, Object3D, Quaternion, Vector3 } from 'three'
import TreeInstancesPool from '@/components/tree/TreeInstancesPool'
import { branchImages, flowerImages, fruitImages, leafImages } from '@/components/tree/resources'

type meta = {
  type: string | null
  index: number | null
  position: null
  rotation: null
  scale: null
  created: false
}

const createPath = (axiom, rules, iterations) => {
  let path = axiom
  for (let i = 0; i < iterations; i++) {
    path = [...path].map((char) => rules[char] || char).join('')
  }
  return path
}

const randomArea = (count) => {
  let random = new Array(count)
  for (let i = 0; i < random.length; i++) {
    random[i] = Math.random() * 2 - 1
  }
  return random
}

const LSystemInstanced = forwardRef( (props, ref) => {
  //
  //constants
  //
  const rules = {
    X: 'F[-FX][+FX]',
    F: 'F',
  }
  const axiom = 'X'
  const iterations = 3
  const angle = 15
  const resetCount = 3 // 홀수만 설정 가능
  const delayTime = 0.1
  const lengthScale = 0.5
  const widthScale = 0.95
  const randomRotations = randomArea(1000)
  const conditionPoints = [30, 50, 70, 90, 100, 120, 140, 160, 180, 200, 220]
  const variance = 25
  const setInitPositionNum = 11
  const branchRef = useRef()
  const leafRef = useRef()
  const flowerRef = useRef()
  const fruitRef = useRef()
  //
  //variables
  //
  let totalPoint = 0
  let totalCount = 0
  let currentPath = createPath(axiom, rules, iterations)
  let count = 0
  let delay = 0
  let selectedBlossoms = -1
  let transform = new Object3D()
  let initPositions = []
  let savedTransforms = []
  let width = Utils.getPos(1)
  let minPetalLength = Utils.getPos(5)
  let maxPetalLength = Utils.getPos(10)
  let minBranchLength = Utils.getPos(3)
  let maxBranchLength = Utils.getPos(5)
  //
  //hooks
  //
  useEffect(() => {}, [])
  useImperativeHandle(ref, () => ({
    generating: (total, count, generate = 2) => {
      totalPoint = total
      totalCount = count
      for (let i = 0; i < generate; i++) {
        build()
      }
    }
  }))
  //
  //functions
  //
  const getCurrentCount = () => {
    switch (count % 2) {
      case 0:
        if (count % resetCount === resetCount - 1) {
          currentPath += 'G'
        } else {
          currentPath += '+'
        }
        break
      case 1:
        currentPath += '-'
        break
    }
    count++
  }
  const setConditionPoint = () => {
    for (let i = 0; i < conditionPoints.length; i++) {
      if (totalPoint <= conditionPoints[i]) {
        selectedBlossoms = i
        return
      }
      selectedBlossoms = conditionPoints.length
    }
  }

  const build = () => {
    delay = 0
    getCurrentCount()
    setConditionPoint()

    for (let i = 0; i < currentPath.length; i++) {
      switch (currentPath[i]) {
        case 'F':
          buildForward(i)
          break
        case 'X':
          break
        case 'G':
          buildMove()
          break
        case '-':
          buildRotate(i)
          break
        case '+':
          buildRotate(i)
          break
        case '*':
          buildRotate(i)
          break
        case '/':
          buildRotate(i)
          break
        case '[':
          buildSave()
          break
        case ']':
          buildReset()
          break
        default:
          console.log('Not a Valid Key: ' + currentPath[i])
          break
      }
    }
  }

  const buildForward = (i) => {
    let order_pz = 0
    let branchLength = Utils.randomRange(-maxBranchLength, 0)

    //sets current object as branch or blossom
    let currentObject = {} as meta
    if (
      currentPath[(i + 1) % currentPath.length] === 'X' ||
      (currentPath[(i + 3) % currentPath.length] === 'F' && currentPath[(i + 4) % currentPath.length] === 'X')
    ) {
      // 🎈 blossoms 와 fruits 분리해야 함
      //
      // if (branchLength / maxBranchLength > -0.2 && selectedBlossoms > 0) {
      //   order_pz = 0.01
      //   currentObject.meta = meta
      //   currentObject.meta.type = 'blossoms'
      //   currentObject.meta.index = Utils.randomRangeInt(0, selectedBlossoms)
      // } else {
      //   order_pz = 0.0
      //   currentObject.meta = meta
      //   currentObject.meta.type = 'leaves'
      //   currentObject.meta.index = Utils.randomRangeInt(0, leafImages.length - 1)
      // }
      order_pz = 0.0
      currentObject.type = 'leaf'
      currentObject.index = Utils.randomRangeInt(0, leafImages.length - 1)
    } else {
      currentObject.type = 'branche'
      currentObject.index = Utils.randomRangeInt(0, branchImages.length - 1)
    }
    //
    //set shape
    //
    let length
    if (currentObject.type === 'blossoms') {
      // blossom
      length = Utils.randomRange(minPetalLength, maxPetalLength) * 0.1
      const scale = new Vector3(length, length, length)
      //
      const pos = new Vector3(
        transform.position.x + 0,
        transform.position.y + branchLength,
        transform.position.z + order_pz,
      )
      const quat = new Quaternion()
      quat.setFromEuler(new Euler(0, 0, MathUtils.degToRad(Utils.randomRange(0, 360)), 'XYZ'))
      // 🎈
      if(flowerRef.current) flowerRef.current.setNextMesh(pos, quat, scale, delay)
    } else if (currentObject.type === 'leaf') {
      // leaves
      length = Utils.randomRange(minPetalLength, maxPetalLength) * 0.1
      const scale = new Vector3(length, length, length)
      //
      const pos = new Vector3(
        transform.position.x + 0,
        transform.position.y + branchLength,
        transform.position.z + order_pz,
      )
      const quat = new Quaternion()
      quat.setFromEuler(new Euler(0, 0, MathUtils.degToRad(Utils.randomRange(0, 360)), 'XYZ'))
      leafRef.current.setNextMesh(pos, quat, scale, delay)
    } else {
      // branch
      length = Utils.randomRange(minBranchLength, maxBranchLength)

      const scale = new Vector3(width, length, width)
      const pos = new Vector3(transform.position.x, transform.position.y, transform.position.z)
      const quat = new Quaternion()
      quat.setFromEuler(new Euler(transform.rotation.x, transform.rotation.y, transform.rotation.z, 'XYZ'))
      branchRef.current.setNextMesh(pos, quat, scale, delay)
      //
      transform.translateY(length * Utils.getPos(200))
      if (count < setInitPositionNum) initPositions.push(transform.position.clone())
    }

    delay += delayTime
  }
  const buildRotate = (i) => {
    let p = Utils.randomDirection() * angle * (1 + (variance / 100) * randomRotations[i % randomRotations.length])
    transform.rotateZ(MathUtils.degToRad(p))
  }
  const buildMove = () => {
    const g = Utils.randomRangeInt(0, initPositions.length - 1)
    const pos = initPositions[g]
    transform.position.set(pos.x, pos.y, pos.z)
    transform.rotation.set(0, 0, 0)
  }

  const buildSave = () => {
    savedTransforms.push({
      position: transform.position.clone(),
      quaternion: transform.quaternion.clone(),
    })
    width *= widthScale
    minBranchLength *= lengthScale
    maxBranchLength *= lengthScale
  }

  const buildReset = () => {
    let saved = savedTransforms.pop()
    width /= widthScale
    minBranchLength /= lengthScale
    maxBranchLength /= lengthScale
    transform.position.set(saved.position.x, saved.position.y, saved.position.z)
    transform.quaternion.set(saved.quaternion.x, saved.quaternion.y, saved.quaternion.z, saved.quaternion.w)
  }

  return (
    <group>
      <TreeInstancesPool ref={branchRef} datas={branchImages} count={1000} />
      <TreeInstancesPool ref={leafRef} datas={leafImages} count={1000} />
      <TreeInstancesPool ref={flowerRef} datas={flowerImages} count={100} />
      <TreeInstancesPool ref={fruitRef} datas={fruitImages} count={100} />
    </group>
  )
})

export default LSystemInstanced
