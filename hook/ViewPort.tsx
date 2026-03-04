// hooks/useViewport.ts
'use client';
import { useState, useEffect } from 'react';

/**
 * Hook para obter as dimensões da viewport, ecrã e DPR
 */
export function useViewport() {
  const isClient = typeof window !== 'undefined';
  const [viewport, setViewport] = useState({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
    screenWidth: isClient ? window.screen.width : 0,
    screenHeight: isClient ? window.screen.height : 0,
    dpr: isClient ? window.devicePixelRatio : 1,
  });

  useEffect(() => {
    if (!isClient) return;
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        dpr: window.devicePixelRatio,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  return viewport;
}