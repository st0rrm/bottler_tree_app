import React, { useEffect } from 'react'
import { Utils } from '@/components/tree/ThreeHelper'

const LSystemInstanced = () => {
  const rules = {
    "X": "F[-FX][+FX]",
    "F": "F"
  };
  const axiom = "X";
  const iterations = 2;
  const angle = 15;
  const minPetalLength = Utils.getPos(5 * 100);
  const maxPetalLength = Utils.getPos(10 * 100);
  const minBranchLength = Utils.getPos(0.3 * 100);
  const maxBranchLength = Utils.getPos(0.5 * 100);
  const lengthScale = 0.5;
  const widthScale = 0.95;

  const Generate = () => {
    let currentPath = axiom;
    let sb = "";
    for (let i = 0; i < iterations; i++) {
      let currentPathChars = currentPath.split("");
      for (let j = 0; j < currentPathChars.length; j++) {
        sb +=
          currentPathChars[j] in rules
            ? rules[currentPathChars[j]]
            : currentPathChars[j];
      }
      currentPath = sb;
      sb = "";
    }
    return currentPath;
  };

  useEffect(() => {
    const path = Generate();
    console.log(path);
  }, [])

  return (
    <group>

    </group>
  )
}

export default LSystemInstanced
