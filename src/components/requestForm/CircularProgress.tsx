
import React from 'react';

interface CircularProgressProps {
  progress: number; // Percentage (0-100)
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
  progress, 
  size = 48, 
  strokeWidth = 4 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500 ease-out"
        />
        {/* Inner circle to improve text legibility */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={Math.max(0, radius - strokeWidth - 1)}
          fill="currentColor"
          className="text-background"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-primary">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
