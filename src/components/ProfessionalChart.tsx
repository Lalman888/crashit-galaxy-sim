import React, { useEffect, useRef, useState } from 'react';

interface ProfessionalChartProps {
  multiplier: number;
  isRunning: boolean;
  crashed: boolean;
  gamePhase: 'waiting' | 'running' | 'crashed';
  crashPoint?: number;
}

interface DataPoint {
  x: number;
  y: number;
  multiplier: number;
  timestamp: number;
}

const ProfessionalChart: React.FC<ProfessionalChartProps> = ({ 
  multiplier, 
  isRunning, 
  crashed, 
  gamePhase,
  crashPoint = 10
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [pathData, setPathData] = useState('');
  const [gradientId] = useState(`gradient-${Math.random().toString(36).substr(2, 9)}`);
  const animationRef = useRef<number>();

  // Chart dimensions
  const width = 800;
  const height = 400;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  useEffect(() => {
    if (gamePhase === 'waiting') {
      setDataPoints([]);
      setPathData('');
      return;
    }

    const updateChart = () => {
      if (!isRunning && !crashed) return;

      const timestamp = Date.now();
      
      // Calculate position
      const progress = Math.min((multiplier - 1) / (crashPoint - 1), 1);
      const x = padding + progress * chartWidth;
      const y = padding + chartHeight - ((multiplier - 1) / Math.max(crashPoint, 10)) * chartHeight;

      setDataPoints(prev => {
        const newPoints = [...prev, { x, y, multiplier, timestamp }];
        // Keep only last 200 points for performance
        return newPoints.slice(-200);
      });

      if (isRunning && !crashed) {
        animationRef.current = requestAnimationFrame(updateChart);
      }
    };

    if (isRunning || crashed) {
      updateChart();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [multiplier, isRunning, crashed, gamePhase, crashPoint]);

  useEffect(() => {
    if (dataPoints.length < 2) {
      setPathData('');
      return;
    }

    // Create smooth bezier curve
    let path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
    
    for (let i = 1; i < dataPoints.length; i++) {
      const current = dataPoints[i];
      const previous = dataPoints[i - 1];
      
      if (i === 1) {
        path += ` L ${current.x} ${current.y}`;
      } else {
        // Smooth curve using quadratic bezier
        const tension = 0.3;
        const controlX = previous.x + (current.x - previous.x) * tension;
        const controlY = previous.y + (current.y - previous.y) * tension;
        path += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`;
      }
    }
    
    setPathData(path);
  }, [dataPoints]);

  // Generate grid lines
  const gridLines = [];
  
  // Vertical grid lines (time)
  for (let i = 0; i <= 10; i++) {
    const x = padding + (i / 10) * chartWidth;
    gridLines.push(
      <line 
        key={`v-${i}`} 
        x1={x} 
        y1={padding} 
        x2={x} 
        y2={height - padding} 
        className="stroke-gray-600/30" 
        strokeWidth="0.5" 
      />
    );
  }
  
  // Horizontal grid lines (multiplier)
  for (let i = 0; i <= 8; i++) {
    const y = padding + (i / 8) * chartHeight;
    const multiplierValue = crashPoint - (i / 8) * (crashPoint - 1);
    gridLines.push(
      <g key={`h-${i}`}>
        <line 
          x1={padding} 
          y1={y} 
          x2={width - padding} 
          y2={y} 
          className="stroke-gray-600/30" 
          strokeWidth="0.5" 
        />
        <text 
          x={padding - 5} 
          y={y + 4} 
          className="fill-gray-400 text-xs" 
          textAnchor="end"
        >
          {multiplierValue.toFixed(1)}x
        </text>
      </g>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-red-500/5 pointer-events-none" />
      
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={crashed ? "#ef4444" : "#10b981"} stopOpacity="1" />
            <stop offset="50%" stopColor={crashed ? "#dc2626" : "#059669"} stopOpacity="0.8" />
            <stop offset="100%" stopColor={crashed ? "#b91c1c" : "#047857"} stopOpacity="0.6" />
          </linearGradient>
          
          <linearGradient id={`${gradientId}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={crashed ? "#ef4444" : "#10b981"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={crashed ? "#ef4444" : "#10b981"} stopOpacity="0.05" />
          </linearGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={crashed ? "#ef4444" : "#10b981"} floodOpacity="0.5"/>
          </filter>
        </defs>
        
        {/* Grid */}
        <g opacity="0.6">
          {gridLines}
        </g>
        
        {/* Chart background area */}
        {pathData && (
          <path
            d={`${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill={`url(#${gradientId}-fill)`}
            className="opacity-40"
          />
        )}
        
        {/* Main chart line */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className={`transition-all duration-200 ${crashed ? 'animate-pulse' : ''}`}
          />
        )}
        
        {/* Current position indicator */}
        {dataPoints.length > 0 && (
          <g transform={`translate(${dataPoints[dataPoints.length - 1]?.x || 0}, ${dataPoints[dataPoints.length - 1]?.y || 0})`}>
            <circle
              r="6"
              fill={crashed ? "#ef4444" : "#fbbf24"}
              className={`${crashed ? 'animate-ping' : 'animate-pulse'}`}
              filter="url(#shadow)"
            />
            <circle
              r="3"
              fill="white"
              className="animate-pulse"
            />
          </g>
        )}
        
        {/* Axis labels */}
        <text x={width / 2} y={height - 10} className="fill-gray-400 text-sm text-center" textAnchor="middle">
          Time →
        </text>
        <text x={15} y={25} className="fill-gray-400 text-sm" textAnchor="middle">
          Multiplier
        </text>
      </svg>
      
      {/* Crash explosion effect */}
      {crashed && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="bg-red-500/95 backdrop-blur-sm text-white px-8 py-4 rounded-2xl text-2xl font-bold animate-bounce border-2 border-red-400 shadow-2xl shadow-red-500/50">
            💥 CRASHED AT {multiplier.toFixed(2)}x
          </div>
        </div>
      )}
      
      {/* Waiting state */}
      {gamePhase === 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🚀</div>
            <div className="text-white text-xl font-semibold opacity-80">
              Market Opening...
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Preparing next crash cycle
            </div>
          </div>
        </div>
      )}
      
      {/* High multiplier effects */}
      {multiplier > 5 && gamePhase === 'running' && (
        <div className="absolute top-4 right-4 animate-pulse">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
            🔥 {multiplier.toFixed(2)}x RISING!
          </div>
        </div>
      )}
      
      {multiplier > 15 && gamePhase === 'running' && (
        <div className="absolute top-4 left-4 animate-bounce">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
            🚀 MOON SHOT!
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalChart;
