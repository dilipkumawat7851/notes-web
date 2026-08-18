import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({
  content,
  children,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setIsVisible(true), 300);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-slate-800 dark:border-t-slate-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-slate-800 dark:border-b-slate-700',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-slate-800 dark:border-l-slate-700',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-slate-800 dark:border-r-slate-700'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && content && (
        <div className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-800 dark:bg-slate-700 rounded shadow-sm whitespace-nowrap pointer-events-none transition-opacity duration-200 ${positionStyles[position]}`}>
          {content}
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowStyles[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
