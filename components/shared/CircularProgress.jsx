import React from 'react';

const CircularProgress = ({
  value,
  max,
  size = 100,
  strokeWidth = 10,
  colorClass = 'text-primary',
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Ensure max is not zero to avoid division by zero
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  // Cap the visual progress at 100% even if the value exceeds it
  const cappedPercentage = Math.min(percentage, 100);
  const offset = circumference - (cappedPercentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background circle */}
        <circle
          className="text-gray-200 dark:text-slate-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={`${colorClass} transition-all duration-500`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
};

export default CircularProgress;