'use client';

// 간단한 className 유틸리티 함수
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Skeleton({ 
  className, 
  width, 
  height, 
  rounded = 'md' 
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const roundedClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-full',
  }[rounded] || 'rounded-md';

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        roundedClass,
        className
      )}
      style={style}
    />
  );
}

// 미리 정의된 Skeleton 컴포넌트들
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
      <div className="flex items-start gap-4">
        <Skeleton width={48} height={48} rounded="lg" />
        <div className="flex-1 space-y-3">
          <Skeleton width="60%" height={20} />
          <Skeleton width="80%" height={16} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonActivityCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
      <div className="flex items-start gap-4">
        <Skeleton width={64} height={64} rounded="xl" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton width={80} height={24} rounded="xl" />
            <Skeleton width={60} height={20} rounded="lg" />
          </div>
          <Skeleton width="90%" height={20} />
          <Skeleton width="70%" height={16} />
          <div className="flex items-center gap-4 mt-4">
            <Skeleton width={100} height={14} />
            <Skeleton width={80} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonProgressBar({ className }: { className?: string }) {
  return (
    <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5', className)}>
      <Skeleton width="60%" height="100%" rounded="full" />
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
      <div className="space-y-4">
        <Skeleton width="40%" height={20} />
        <div className="h-64 flex items-end gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton 
              key={i} 
              width={32} 
              height={Math.random() * 200 + 50} 
              rounded="sm" 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          width={i === lines - 1 ? '60%' : '100%'} 
          height={16} 
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ 
  size = 40, 
  className 
}: { 
  size?: number; 
  className?: string; 
}) {
  return (
    <Skeleton 
      width={size} 
      height={size} 
      rounded="full" 
      className={className} 
    />
  );
}

export function SkeletonButton({ 
  width = 100, 
  height = 36, 
  className 
}: { 
  width?: number; 
  height?: number; 
  className?: string; 
}) {
  return (
    <Skeleton 
      width={width} 
      height={height} 
      rounded="lg" 
      className={className} 
    />
  );
}

export function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  className 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string; 
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width="80%" height={20} />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex}
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="90%" height={16} />
          ))}
        </div>
      ))}
    </div>
  );
}
