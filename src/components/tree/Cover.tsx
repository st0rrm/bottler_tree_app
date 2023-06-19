import React, { useState, useEffect } from 'react'
import useTreeStore from '@/stores/useTreeStore'

const Cover = () => {
  const [close, setClose] = useState(false);
  const [hide, setHide] = useState(false);
  const { allTexturesLoaded, initThree } = useTreeStore()

  useEffect(() => {
    if(allTexturesLoaded && initThree) {
      setTimeout(() => setClose(true), 100);
    }
  }, [allTexturesLoaded, initThree])

  useEffect(() => {
    if(close) {
      // If close is true, start the CSS transition and remove the div after 2 seconds
      setTimeout(() => setHide(true), 1000);
    }
  }, [close]);

  // CSS transitions
  const styles = {
    transition: 'opacity 1s',
    opacity: close ? 0 : 1
  };

  return !hide ? (
    <div style={styles} className="absolute w-full h-full bg-gray-200 z-40" />
  ) : null;
}

export default Cover;
