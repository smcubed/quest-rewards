import React from 'react';
import { cn } from '@/lib/utils';

export const PageContainer = ({ className, children, ...props }) => (
  <div
    className={cn(
      "container mx-auto max-w-6xl p-8",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const PageHeader = ({
  title,
  description,
  action,
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex justify-between items-center mb-8",
      className
    )}
    {...props}
  >
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
    </div>
    {action && (
      <div>
        {action}
      </div>
    )}
  </div>
);

export const Section = ({
  title,
  description,
  className,
  children,
  ...props
}) => (
  <section
    className={cn("mb-8", className)}
    {...props}
  >
    {(title || description) && (
      <div className="mb-4">
        {title && <h2 className="text-2xl font-semibold">{title}</h2>}
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
    )}
    {children}
  </section>
);
