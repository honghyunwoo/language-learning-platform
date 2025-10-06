import { HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'level';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type LevelType = 'A1' | 'A2' | 'B1' | 'B2';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  level?: LevelType;
  children: React.ReactNode;
}

const Badge = ({
  variant = 'default',
  size = 'md',
  level,
  className = '',
  children,
  ...props
}: BadgeProps) => {
  // 기본 스타일
  const baseStyles =
    'inline-flex items-center font-medium rounded-full border';

  // 변형별 스타일
  const variantStyles: Record<BadgeVariant, string> = {
    default:
      'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
    success:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    warning:
      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    error:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    level: '', // 레벨별로 별도 처리
  };

  // 레벨별 스타일 (A1, A2, B1, B2)
  const levelStyles: Record<LevelType, string> = {
    A1: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    A2: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    B1: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    B2: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
  };

  // 크기별 스타일
  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  // 스타일 선택 (레벨이 있으면 레벨 스타일 우선)
  const selectedVariantStyle =
    variant === 'level' && level ? levelStyles[level] : variantStyles[variant];

  const combinedClassName = `${baseStyles} ${selectedVariantStyle} ${sizeStyles[size]} ${className}`;

  return (
    <span className={combinedClassName} {...props}>
      {children}
    </span>
  );
};

export default Badge;
