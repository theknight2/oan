"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  hue: number;
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initialize on load and resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    const stars: Star[] = [];
    const starCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 8000), 120);
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.3, // Increased minimum opacity
        speed: Math.random() * 0.05 + 0.01,
        // Use a range of hues focused on orange/amber tones (20-45 degrees)
        hue: Math.random() * 25 + 20
      });
    }
    
    // Create a few larger, brighter stars
    for (let i = 0; i < 8; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.6, // Brighter stars
        speed: Math.random() * 0.03 + 0.01,
        hue: Math.random() * 25 + 20
      });
    }
    
    // Animation function
    let animationFrameId: number;
    let time = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      
      // Draw stars
      stars.forEach(star => {
        // Make stars twinkle
        const flicker = Math.sin(time * 3 + star.x + star.y) * 0.15 + 0.85; // More pronounced twinkling
        
        ctx.beginPath();
        
        // Create sharper glow effect
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 4
        );
        
        const alpha = star.opacity * flicker;
        gradient.addColorStop(0, `hsla(${star.hue}, 100%, 80%, ${alpha})`); // Brighter center
        gradient.addColorStop(0.4, `hsla(${star.hue}, 100%, 60%, ${alpha * 0.6})`); // Sharper falloff
        gradient.addColorStop(1, `hsla(${star.hue}, 90%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw the star's core - sharper and brighter
        ctx.beginPath();
        ctx.fillStyle = `hsla(${star.hue}, 100%, 90%, ${alpha})`; // Brighter core
        ctx.arc(star.x, star.y, star.size * 1.2, 0, Math.PI * 2); // Slightly larger core
        ctx.fill();
        
        // Draw a tiny, bright center point for more definition
        ctx.beginPath();
        ctx.fillStyle = `hsla(${star.hue}, 50%, 100%, ${alpha})`; // Pure white with hue tint
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Move stars slightly
        star.y += Math.sin(time + star.x) * star.speed;
        star.x += Math.cos(time + star.y) * star.speed;
        
        // Wrap around edges
        if (star.x < -10) star.x = canvas.width + 10;
        if (star.x > canvas.width + 10) star.x = -10;
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.y > canvas.height + 10) star.y = -10;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 opacity-90"
    />
  );
} 