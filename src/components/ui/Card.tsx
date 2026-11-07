import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
  bodyClassName = ''
}) => {
  return (
    <div
      className={`bg-[#111E30] border border-[#26364B] rounded-xl shadow-lg transition-all duration-200 hover:border-[#33465E] flex flex-col overflow-hidden ${className}`}
    >
      {(title || headerAction) && (
        <div className="px-4 py-3.5 border-b border-[#26364B]/80 flex items-center justify-between shrink-0 bg-[#111E30]/80 backdrop-blur-sm">
          <div className="flex items-baseline space-x-2 truncate">
            {typeof title === 'string' ? (
              <h3 className="text-xs font-bold tracking-wider text-[#F3F6FA] uppercase">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && (
              <span className="text-[11px] font-medium text-[#A0AEC0] tracking-normal">
                {subtitle}
              </span>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center space-x-2 shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={`p-4 flex-1 flex flex-col min-h-0 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};
