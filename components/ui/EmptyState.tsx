interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-[2rem] flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          {action.label}
        </button>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-300 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-300 rounded-full blur-2xl animate-float delay-300"></div>
      </div>
    </div>
  );
}
