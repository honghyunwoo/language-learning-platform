import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center">
              {!isFirst && (
                <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-2" />
              )}
              
              {isLast ? (
                // 현재 페이지는 클릭 불가능
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                  {isFirst && <HomeIcon className="w-4 h-4" />}
                  {item.label}
                </span>
              ) : item.href ? (
                // 클릭 가능한 링크
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {isFirst && <HomeIcon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ) : (
                // 클릭 불가능한 항목
                <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  {isFirst && <HomeIcon className="w-4 h-4" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
