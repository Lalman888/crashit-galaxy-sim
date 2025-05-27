
import React, { useEffect, useRef, useState } from 'react';

interface CrashGameCanvasProps {
  multiplier: number;
  isRunning: boolean;
  crashed: boolean;
}

const CrashGameCanvas: React.FC<CrashGameCanvasProps> = ({ multiplier, isRunning, crashed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw curve if running
    if (isRunning || crashed) {
      drawCurve(ctx, canvas.width, canvas.height, multiplier, crashed);
    }
  }, [multiplier, isRunning, crashed]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCurve = (ctx: CanvasRenderingContext2D, width: number, height: number, mult: number, hasCrashed: boolean) => {
    ctx.strokeStyle = hasCrashed ? '#ef4444' : '#10b981';
    ctx.lineWidth = 3;
    ctx.shadowColor = hasCrashed ? '#ef4444' : '#10b981';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    
    // Calculate curve points
    const maxX = Math.min(width * 0.8, (mult - 1) * 100);
    const maxY = height - ((mult - 1) * 20);
    
    ctx.moveTo(50, height - 50);
    
    // Draw exponential curve
    for (let x = 50; x <= maxX + 50; x += 2) {
      const progress = (x - 50) / maxX;
      const y = height - 50 - (progress * progress * (height - 100));
      ctx.lineTo(x, Math.max(y, 50));
    }
    
    ctx.stroke();
    
    // Draw crash effect
    if (hasCrashed) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CRASHED!', width / 2, height / 2);
    }
    
    ctx.shadowBlur = 0;
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
