
import React from 'react';

const ProgressBar = ({ value, max, label, color = 'bg-primary', small = false }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      {label && <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>}
      <div className={`w-full bg-gray-200 rounded-full ${small ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className={`${color} ${small ? 'h-1.5' : 'h-2.5'} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
