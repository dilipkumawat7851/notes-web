import React from 'react';

export const Skeleton = ({ 
  className = '', 
  variant = 'rect', 
  width, 
  height 
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700';
  
  const variants = {
    line: 'rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg'
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      style={style}
    />
  );
};

export const NoteCardSkeleton = () => (
  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-48 flex flex-col">
    <Skeleton variant="line" className="w-3/4 h-6 mb-4" />
    <Skeleton variant="line" className="w-full h-4 mb-2" />
    <Skeleton variant="line" className="w-5/6 h-4 mb-auto" />
    
    <div className="flex gap-2 mt-4">
      <Skeleton variant="line" className="w-16 h-6 rounded-full" />
      <Skeleton variant="line" className="w-20 h-6 rounded-full" />
    </div>
  </div>
);

export const NoteListSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
        <div className="flex-1">
          <Skeleton variant="line" className="w-1/3 h-5 mb-2" />
          <Skeleton variant="line" className="w-1/2 h-4" />
        </div>
        <Skeleton variant="line" className="w-24 h-4 ml-4" />
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton variant="circle" className="w-12 h-12" />
    <div>
      <Skeleton variant="line" className="w-32 h-5 mb-2" />
      <Skeleton variant="line" className="w-48 h-4" />
    </div>
  </div>
);

export default Skeleton;
