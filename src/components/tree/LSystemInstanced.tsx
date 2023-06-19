import React, { forwardRef, Suspense, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useThreeHelper } from '@/components/tree/ThreeHelper'
import { Euler, MathUtils, Object3D, Quaternion, Vector3 } from 'three'
import TreeInstancesPool from '@/components/tree/TreeInstancesPool'
import { branchImages, flowerImages, fruitImages, leafImages } from '@/components/tree/resources'
import useTreeStore from '@/stores/useTreeStore'

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

//
//variables
//
let growCount = 0
let transform = new Object3D()
let initPositions = []
let savedTransforms = []
let totalPoint = 0
let totalCount = 0
let currentPath = ''
let delay = 0
let width = null
let minPetalLength = null
let maxPetalLength = null
let minBranchLength = null
let maxBranchLength = null

console.log('%c ---- LSYSTEM INSTANCED ----', 'color:red')

/* File : LSystem.cs
 * Author : Derek Nguyen
 * Description: Creates a procedurally generated tree using LSystem
 *              https://en.wikipedia.org/wiki/L-system
 *              F : Forward, X : Control Curve, + : turn right, - : turn left, [ : push stack, ] : pop stack
 *
 */
const LSystemInstanced = forwardRef((props, ref) => {
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
  const lengthScale = 0.75
  const widthScale = 0.95
  const randomRotations = randomArea(1000)
  const conditionPoints = [50, 150, 250, 350, 450, 500, 600, 700, 800, 900, 1000]
  const conditionRewards = [
    { type: 'flower', index: 0 },
    { type: 'flower', index: 1 },
    { type: 'flower', index: 2 },
    { type: 'flower', index: 3 },
    { type: 'flower', index: 4 },
    { type: 'fruit', index: 0 },
    { type: 'fruit', index: 1 },
    { type: 'fruit', index: 2 },
    { type: 'fruit', index: 3 },
    { type: 'fruit', index: 4 },
    { type: 'fruit', index: 5 },
  ]
  const variance = 25
  const setInitPositionNum = 5
  const branchRef = useRef()
  const leafRef = useRef()
  const flowerRef = useRef()
  const fruitRef = useRef()
  const { getPos, randomRangeInt, randomRange, randomDirection } = useThreeHelper()
  const { loadedTexture } = useTreeStore()
  const [pool, setPool] = useState(null)
  //
  //hooks
  //
  useImperativeHandle(ref, () => ({
    generating: (total, count, generate = 2) => {
      totalPoint = total
      totalCount = count
      console.log('%c total: %s, count: %s, generate: %s', 'color:yellow; background:black', total, count, generate)
      for (let i = 0; i < generate; i++) {
        currentPath = createPath(axiom, rules, iterations)
        build()
      }
    },
  }))
  useEffect(() => {
    width = getPos(1)
    minPetalLength = getPos(0.8)
    maxPetalLength = getPos(1.8)
    minBranchLength = getPos(0.5)
    maxBranchLength = getPos(1.5)
  }, [getPos])
  useEffect(() => {
    setPool(
      <group>
        <TreeInstancesPool ref={branchRef} datas={branchImages} count={1000} onLoaded={onLoaded} />
        <TreeInstancesPool ref={leafRef} datas={leafImages} count={1000} onLoaded={onLoaded} />
        <TreeInstancesPool ref={flowerRef} datas={flowerImages} count={100} onLoaded={onLoaded} />
        <TreeInstancesPool ref={fruitRef} datas={fruitImages} count={100} onLoaded={onLoaded} />
      </group>,
    )
  }, [])
  //
  //functions
  //
  const getCurrentCount = () => {
    switch (growCount % 2) {
      case 0:
        if (growCount % resetCount === resetCount - 1) {
          currentPath += 'G'
        } else {
          currentPath += '+'
        }
        break
      case 1:
        currentPath += '-'
        break
    }
    growCount++
  }

  const build = () => {
    delay = 0
    getCurrentCount()
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

  const checkPointLocation = (point, points) => {
    const length = points.length
    const oneThirdValue = points[Math.floor(length / 3)]
    const twoThirdsValue = points[Math.floor((length * 2) / 3)]

    if (point < oneThirdValue || point < points[0]) {
      return 'leaf'
    } else if (point >= oneThirdValue && point < twoThirdsValue) {
      return 'flower'
    } else {
      return 'fruit'
    }
  }

  const getTypeAndIndex = (type, images) => {
    return {
      type,
      index: randomRangeInt(0, images.length - 1),
    }
  }

  const getLeafAndIndex = () => {
    const types = ['leaf', 'flower', 'fruit']
    const images = { leaf: leafImages, flower: flowerImages, fruit: fruitImages }

    const locationType = checkPointLocation(totalPoint, conditionPoints)
    const randomInt = randomRangeInt(0, types.length)

    if (locationType === 'leaf' || types[randomInt] === 'leaf') {
      return getTypeAndIndex('leaf', images.leaf)
    } else if (locationType === 'flower' || types[randomInt] === 'flower') {
      return getTypeAndIndex('flower', images.flower)
    } else {
      return getTypeAndIndex('fruit', images.fruit)
    }
  }

  function getRewardIndex(point, points, rewards) {
    let rewardIndex = 0

    for (let i = 0; i < points.length; i++) {
      if (point < points[i]) {
        break
      }
      rewardIndex = i
    }

    return rewards[rewardIndex]
  }

  const buildForward = (i) => {
    let branchLength = randomRange(minBranchLength, maxBranchLength) // changed from negative value

    //sets current object as branch or leaf
    let currentObject = {} as meta
    if (
      currentPath[(i + 1) % currentPath.length] === 'X' ||
      (currentPath[(i + 3) % currentPath.length] === 'F' && currentPath[(i + 4) % currentPath.length] === 'X')
    ) {
      // leaf 선택
      // const {type, index} = getLeafAndIndex()
      // currentObject.type = type
      // currentObject.index = index
      currentObject.type = 'leaf'
      currentObject.index = randomRangeInt(0, leafImages.length - 1)
    } else {
      currentObject.type = 'branch'
      currentObject.index = randomRangeInt(0, branchImages.length - 1)
    }
    //
    //set shape
    //
    let length
    if (currentObject.type === 'leaf') {
      // 🍃🍃🍃 leaves 🍃🍃🍃
      length = randomRange(minPetalLength, maxPetalLength)
      const scale = new Vector3(length, length, length)
      //
      const pos = new Vector3(transform.position.x, transform.position.y + branchLength, transform.position.z)
      const quat = new Quaternion()
      quat.setFromEuler(new Euler(0, 0, MathUtils.degToRad(randomRange(0, 360)), 'XYZ'))
      leafRef.current.setNextMesh(randomRangeInt(0, leafImages.length - 1), pos, quat, scale, delay)
    } else {
      // 🌴🌴🌴 branch 🌴🌴🌴
      length = randomRange(minBranchLength, maxBranchLength)
      const scale = new Vector3(width, length, width)
      const pos = new Vector3(transform.position.x, transform.position.y, transform.position.z)
      const quat = new Quaternion()
      quat.setFromEuler(new Euler(transform.rotation.x, transform.rotation.y, transform.rotation.z, 'XYZ'))
      branchRef.current.setNextMesh(randomRangeInt(0, branchImages.length - 1), pos, quat, scale, delay)
      //
      transform.translateY(length * 180)
      if (growCount < setInitPositionNum) initPositions.push(transform.position.clone())
    }

    // Reward
    // console.log("%c branchLength / maxBranchLength: %s", "color:red;", branchLength / maxBranchLength)
    if (branchLength / maxBranchLength < 0.41 && totalPoint > conditionPoints[0]) {
      const reward = getRewardIndex(totalPoint, conditionPoints, conditionRewards)
      console.log('%c reward: %o', 'color:red;', reward)
      if (reward.type === 'fruit') {
        // 🍏🍏🍏 fruit 🍏🍏🍏
        length = randomRange(minPetalLength, maxPetalLength)
        const scale = new Vector3(length, length, length)
        const pos = new Vector3(transform.position.x, transform.position.y + branchLength, transform.position.z)
        const quat = new Quaternion()
        quat.setFromEuler(new Euler(0, 0, MathUtils.degToRad(randomRange(0, 360)), 'XYZ'))
        if (fruitRef.current) fruitRef.current.setNextMesh(reward.index, pos, quat, scale, delay)
      } else if (reward.type === 'flower') {
        // 🌸🌸🌸 flower 🌸🌸🌸
        length = randomRange(minPetalLength, maxPetalLength)
        const scale = new Vector3(length, length, length)
        const pos = new Vector3(transform.position.x, transform.position.y + branchLength, transform.position.z)
        const quat = new Quaternion()
        quat.setFromEuler(new Euler(0, 0, MathUtils.degToRad(randomRange(0, 360)), 'XYZ'))
        if (flowerRef.current) flowerRef.current.setNextMesh(reward.index, pos, quat, scale, delay)
      }
    }

    // console.log("%ctransform.position: %o", "color:red", transform.position)

    delay += delayTime
  }
  const buildRotate = (i) => {
    let p = randomDirection() * angle * (1 + (variance / 100) * randomRotations[i % randomRotations.length])
    transform.rotateZ(MathUtils.degToRad(p))
  }
  const buildMove = () => {
    const g = randomRangeInt(0, initPositions.length - 1)
    const pos = initPositions[g]
    transform.position.set(pos.x, pos.y, pos.z)
    transform.rotation.set(0, 0, 0)
    transform.updateMatrix()
    // console.log("%cbuildMove::transform.position: %o", "color:green", transform.position)
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
    transform.position.copy(saved.position)
    transform.quaternion.copy(saved.quaternion)
    transform.updateMatrix()
  }

  const onLoaded = (e) => {
    loadedTexture()
  }

  return <group {...props}>{pool}</group>
})

export { LSystemInstanced }
