import React from 'react';
import { cn } from '@/lib/utils';

export const StatCard = ({
  icon: Icon,
  value,
  label,
  color = "text-blue-500",
  className,
  ...props
}) => (
  <div
    className={cn(
      "bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center",
      className
    )}
    {...props}
  >
    {Icon && <Icon className={`w-12 h-12 ${color} mb-4`} />}
    <div className="text-4xl font-bold mb-2">{value}</div>
    <div className="text-gray-600 text-lg">{label}</div>
  </div>
);

export const QuestCard = ({
  title,
  description,
  xpValue,
  icon: Icon,
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow",
      className
    )}
    {...props}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      </div>
      {xpValue && (
        <div className="flex items-center gap-2 text-yellow-500 font-bold">
          <span>{xpValue} XP</span>
        </div>
      )}
    </div>
    {children}
  </div>
);

export const ProgressBar = ({
  value,
  max,
  className,
  showLabels = true,
  ...props
}) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabels && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-6">
        <div
          className="bg-blue-500 rounded-full h-6 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const ActionButton = ({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  ...props
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-500",
    secondary: "bg-gradient-to-r from-gray-500 to-gray-600",
    success: "bg-gradient-to-r from-green-500 to-emerald-600",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <button
      className={cn(
        variants[variant],
        sizes[size],
        "text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
