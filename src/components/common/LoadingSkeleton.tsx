import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-4 animate-pulse">
      <div className="h-6 bg-neutral-200 rounded w-1/4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <div className="w-8 h-8 rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
            </div>
            <div className="h-6 bg-neutral-200 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};
