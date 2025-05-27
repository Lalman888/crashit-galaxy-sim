
import React, { useEffect, useRef, useState } from 'react';

interface CrashGameCanvasProps {
  multiplier: number;
  isRunning: boolean;
  crashed: boolean;
}

const CrashGameCanvas: React.FC<CrashGameCanvasProps> = ({ multiplier, isRunning, crashed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      const width = rect.width;
      const height = rect.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw enhanced grid
      drawGrid(ctx, width, height);

      // Draw curve if running or crashed
      if (isRunning || crashed) {
        drawCurve(ctx, width, height, multiplier, crashed);
      }
    };

    updateCanvas();
    
    const resizeObserver = new ResizeObserver(updateCanvas);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [multiplier, isRunning, crashed]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 1;

    // Vertical lines
    const verticalSpacing = width / 10;
    for (let x = 0; x <= width; x += verticalSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    const horizontalSpacing = height / 8;
    for (let y = 0; y <= height; y += horizontalSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes labels
    ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
    ctx.font = '12px Arial';
    ctx.fillText('1.0x', 10, height - 10);
    ctx.fillText('Time →', width - 60, height - 10);
    ctx.fillText('↑ Multiplier', 10, 20);
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, width: number, height: number, mult: number, hasCrashed: boolean) => {
    // Calculate curve points
    const progress = Math.min(mult - 1, 10) / 10; // Cap at 10x for visual purposes
    const curveWidth = progress * width * 0.8;
    
    // Create exponential curve
    ctx.strokeStyle = hasCrashed ? '#ef4444' : '#10b981';
    ctx.lineWidth = 4;
    ctx.shadowColor = hasCrashed ? '#ef4444' : '#10b981';
    ctx.shadowBlur = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    
    // Draw smooth exponential curve
    for (let x = 50; x <= curveWidth + 50; x += 3) {
      const t = (x - 50) / (width * 0.8);
      const exponential = Math.pow(t, 0.7); // Exponential growth
      const y = height - 50 - (exponential * (height - 100));
      ctx.lineTo(x, Math.max(y, 20));
    }
    
    ctx.stroke();
    
    // Draw rocket at the end of curve
    if (curveWidth > 0) {
      const rocketX = Math.min(curveWidth + 50, width - 30);
      const t = (rocketX - 50) / (width * 0.8);
      const exponential = Math.pow(t, 0.7);
      const rocketY = Math.max(height - 50 - (exponential * (height - 100)), 20);
      
      // Rocket trail
      if (!hasCrashed) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
        for (let i = 1; i <= 5; i++) {
          ctx.fillRect(rocketX - i * 4, rocketY + 5, i * 2, 2);
        }
      }
      
      // Rocket emoji
      ctx.font = '24px Arial';
      ctx.fillStyle = hasCrashed ? '#ef4444' : '#fbbf24';
      ctx.fillText('🚀', rocketX - 12, rocketY + 8);
    }
    
    // Draw crash effect
    if (hasCrashed) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      
      // Crash explosion effect
      const crashX = Math.min(curveWidth + 50, width - 30);
      const t = (crashX - 50) / (width * 0.8);
      const exponential = Math.pow(t, 0.7);
      const crashY = Math.max(height - 50 - (exponential * (height - 100)), 20);
      
      ctx.fillText('💥', crashX, crashY);
      ctx.fillText('CRASHED!', width / 2, height / 2);
      
      // Add explosion particles
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30;
        const particleX = crashX + Math.cos(angle) * distance;
        const particleY = crashY + Math.sin(angle) * distance;
        ctx.fillRect(particleX, particleY, 4, 4);
      }
    }
    
    ctx.shadowBlur = 0;
    ctx.textAlign = 'start';
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

export default CrashGameCanvas;
