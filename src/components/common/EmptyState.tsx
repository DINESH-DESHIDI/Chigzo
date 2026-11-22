import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-[#E5E7EB] bg-white my-4">
      <div className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-[#20232B]">{title}</h4>
      <p className="mt-1 text-xs sm:text-sm text-[#64748B] max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-[#C9165B] text-white hover:bg-[#B0134F] shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
