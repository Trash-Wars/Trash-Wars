
import { useState, useEffect } from 'react';

type MousePositionValues = [
  {
    clientX: number,
    clientY: number,
  }?
  // add more or ask me, hugo how to add more here
]

export default function useMousePosition() {
  const [coords, setCoords] = useState<MousePositionValues>([]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setCoords([
        {clientX: e.clientX, clientY: e.clientY},
      ]);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return {...coords![0]};
}
