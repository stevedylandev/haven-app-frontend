import { useEffect, useState } from 'react';

export function useShakeDetection() {
  const [shaken, setShaken] = useState(false);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    const threshold = 15;

    function handleMotion(event: DeviceMotionEvent) {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration?.x || !acceleration?.y || !acceleration?.z) return;

      const deltaX = Math.abs(acceleration.x - lastX);
      const deltaY = Math.abs(acceleration.y - lastY);
      const deltaZ = Math.abs(acceleration.z - lastZ);

      if (deltaX > threshold && deltaY > threshold && deltaZ > threshold) {
        setShaken(true);
      }

      lastX = acceleration.x;
      lastY = acceleration.y;
      lastZ = acceleration.z;
    }

    if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (typeof DeviceMotionEvent !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  return { shaken, resetShake: () => setShaken(false) };
}