/// sourced from https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: winWidth, innerHeight: winHeight } = window;
  return {
    winWidth,
    winHeight
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
