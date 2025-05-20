"use client";

import { useEffect, useRef } from "react";

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen once
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create a simple static background with just a few dots
    const createStaticBackground = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a minimal number of static stars
      const starCount = Math.min(Math.floor(canvas.width * canvas.height / 30000), 40);
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5 + 0.5;
        const opacity = Math.random() * 0.6 + 0.2;
        
        // Simple dot with minimal gradient
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 200, 150, ${opacity})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Create the static background once
    createStaticBackground();
    
    // Only handle window resize - no animation
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStaticBackground();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 opacity-40"
    />
  );
} 