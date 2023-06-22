//@ts-nocheck

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { gsap } from 'gsap'

const Score = forwardRef((props, ref) => {
  const [point, setPoint] = useState(0);
  const pointBoxRef = useRef(null);
  //
  //hooks
  //
  useImperativeHandle(ref, () => ({
    score: (score) => {
      setPoint(score);
    }
  }))

  useEffect(() => {
    if (pointBoxRef.current && point > 0) {
      const tl = gsap.timeline();
      tl.to(pointBoxRef.current, {opacity: 0, duration: 0})
        .to(pointBoxRef.current, {opacity: 1, duration: 1, ease: "power1.in"}) // Fade In for 1s
        .to(pointBoxRef.current, {y: '-200px', duration: 3, ease: "none"}, "-=1") // Move Up for 3s
        .to(pointBoxRef.current, {opacity: 0, duration: 1, ease: "power1.out"}, "-=1"); // Fade Out for 1s (starts 1s before the end)
      tl.eventCallback("onComplete", () => {
        setPoint(0);
      });
    }
  }, [point]);

  return (
    <div className={"absolute z-20 top-0 w-full h-full flex items-center justify-center"}>
      {(point>0) &&
      <div
        id={"pointBox"}
        ref={pointBoxRef}
        className={"w-32 h-64 font-score text-score text-center opacity-0 "}
        style={{fontSize: "64px"}}
      >
        +{point}
      </div>
      }
    </div>
  );
})

Score.displayName = 'Score'
export default Score;
