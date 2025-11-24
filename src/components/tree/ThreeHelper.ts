import {Mesh, MeshStandardMaterial, PlaneGeometry} from "three";
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
const gen = require("random-seed");

export const useThreeHelper = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    ratio: undefined,
  });
  const [ratio, setRatio] = useState(null)

  //
  // const
  //
  const standardHeight = 1334
  const ratioScale = 0.013
  const rand = new gen(nanoid());
  //
  // hooks
  //
  useEffect(() => {
    function handleResize() {
      // const ratio = ratioScale * (window.innerHeight / standardHeight)
      // const ratio = ratioScale * (window.innerWidth / window.innerHeight)

      const baseRatio = ratioScale * (window.innerWidth / window.innerHeight)
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
      const ratio = baseRatio / dpr;
      setRatio(ratio)
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  //
  // functions
  //
  const getSize = (width, height) => {
    return {
      width: width * ratio,
      height: height * ratio,
    };
  }
  const getPos = (x) => {
    return x * ratio;
  }
  const randomRange = (min, max) => {
    rand.seed(nanoid());
    return rand.floatBetween(min, max)
  }
  const randomRangeInt = (min, max) => {
    rand.seed(nanoid());
    return rand.intBetween(min, max);
  }
  const randomDirection = () => {
    const r = randomRange(-1, 1);
    return r >= 0 ? 1 : -1;
  }

  return { ratio, getSize, getPos, randomRange, randomRangeInt, randomDirection }
}
