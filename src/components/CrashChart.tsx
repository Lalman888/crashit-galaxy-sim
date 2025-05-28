import React, { useEffect, useRef, useState } from 'react';

interface CrashChartProps {
  multiplier: number;
  isRunning: boolean;
  crashed: boolean;
  gamePhase: 'waiting' | 'running' | 'crashed';
}

const CrashChart: React.FC<CrashChartProps> = ({ multiplier, isRunning, crashed, gamePhase }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathData, setPathData] = useState('');
  const [points, setPoints] = useState<Array<{x: number, y: number}>>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (gamePhase === 'waiting') {
      setPathData('');
      setPoints([]);
      return;
    }

    const updatePath = () => {
      if (!svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const width = 400; // Fixed width for consistent calculations
      const height = 300; // Fixed height for consistent calculations
      
      // Calculate progress based on multiplier (exponential curve)
      const progress = Math.min((multiplier - 1) / 9, 1); // 1x to 10x range
      const x = progress * (width - 40) + 20;
      
      // Exponential curve calculation
      const exponentialFactor = Math.pow(progress, 0.6);
      const y = height - 20 - (exponentialFactor * (height - 40));
      
      setPoints(prev => {
        const newPoints = [...prev, { x, y }];
        // Keep only last 100 points for performance
        if (newPoints.length > 100) {
          newPoints.shift();
        }
        return newPoints;
      });

      if (isRunning && !crashed) {
        animationRef.current = requestAnimationFrame(updatePath);
      }
    };

    if (isRunning) {
      updatePath();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [multiplier, isRunning, crashed, gamePhase]);

  useEffect(() => {
    if (points.length < 2) {
      setPathData('');
      return;
    }

    // Create smooth curve using quadratic bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      
      if (i === 1) {
        path += ` L ${current.x} ${current.y}`;
      } else {
        // Create smooth curve
        const controlX = (previous.x + current.x) / 2;
        const controlY = (previous.y + current.y) / 2;
        path += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`;
      }
    }
    
    setPathData(path);
  }, [points]);

  const gridLines = [];
  // Vertical grid lines
  for (let i = 0; i <= 8; i++) {
    const x = (i / 8) * 360 + 20;
    gridLines.push(
      <line key={`v-${i}`} x1={x} y1={20} x2={x} y2={280} className="stroke-purple-500/20" strokeWidth="1" />
    );
  }
  // Horizontal grid lines
  for (let i = 0; i <= 6; i++) {
    const y = (i / 6) * 260 + 20;
    gridLines.push(
      <line key={`h-${i}`} x1={20} y1={y} x2={380} y2={y} className="stroke-purple-500/20" strokeWidth="1" />
    );
  }

  return (
    <div className="relative w-full h-full bg-black/30 dark:bg-black/30 light:bg-gray-100/50 rounded-xl border border-purple-500/20 dark:border-purple-500/20 light:border-purple-300/30 overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 400 300"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        <g opacity="0.6">
          {gridLines}
        </g>
        
        {/* Animated gradient definition */}
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={crashed ? "#ef4444" : "#10b981"} stopOpacity="0.8" />
            <stop offset="100%" stopColor={crashed ? "#dc2626" : "#059669"} stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Chart line */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className={`transition-all duration-300 ${crashed ? 'animate-pulse' : ''}`}
          />
        )}
        
        {/* Rocket at the end */}
        {points.length > 0 && (
          <g transform={`translate(${points[points.length - 1]?.x || 0}, ${points[points.length - 1]?.y || 0})`}>
            <circle
              r="8"
              fill={crashed ? "#ef4444" : "#fbbf24"}
              className={`${crashed ? 'animate-ping' : 'animate-pulse'}`}
              opacity="0.6"
            />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              className="text-xl"
              fill="white"
            >
              {crashed ? '💥' : '🚀'}
            </text>
          </g>
        )}
        
        {/* Axis labels */}
        <text x="30" y="295" className="fill-purple-400 text-xs" fontSize="12">Time →</text>
        <text x="5" y="25" className="fill-purple-400 text-xs" fontSize="12">↑ Multiplier</text>
        
        {/* Multiplier markers */}
        <text x="25" y="280" className="fill-purple-400 text-xs" fontSize="10">1.0x</text>
        <text x="25" y="150" className="fill-purple-400 text-xs" fontSize="10">5.0x</text>
        <text x="25" y="35" className="fill-purple-400 text-xs" fontSize="10">10x</text>
      </svg>
      
      {/* Crash overlay */}
      {crashed && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 animate-pulse">
          <div className="bg-red-500/90 text-white px-6 py-3 rounded-xl text-xl font-bold animate-bounce">
            💥 CRASHED!
          </div>
        </div>
      )}
      
      {/* Waiting state */}
      {gamePhase === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2 animate-bounce">🚀</div>
            <div className="text-white dark:text-white light:text-gray-800 text-lg font-semibold">
              Preparing for launch...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrashChart;
