import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'dot' | 'subtle' | 'solid';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'subtle',
  size = 'md',
}) => {
  const normStatus = status.toLowerCase();

  let colorClasses = 'bg-neutral-100 text-neutral-700 border-neutral-200';
  let dotColor = 'bg-neutral-400';

  if (['active', 'healthy', 'published', 'completed', 'resolved', 'verified', 'linked'].includes(normStatus)) {
    colorClasses = 'bg-emerald-50 text-[#16A36A] border-emerald-200/60';
    dotColor = 'bg-[#16A36A]';
  } else if (['pending', 'warning', 'scheduled', 'under_review', 'open', 'draft'].includes(normStatus)) {
    colorClasses = 'bg-amber-50 text-[#D97706] border-amber-200/60';
    dotColor = 'bg-[#D97706]';
  } else if (['critical', 'danger', 'suspended', 'cancelled', 'deleted', 'not_linked', 'failed', 'rejected'].includes(normStatus)) {
    colorClasses = 'bg-rose-50 text-[#DC3545] border-rose-200/60';
    dotColor = 'bg-[#DC3545]';
  } else if (['info', 'acknowledged', 'reviewed'].includes(normStatus)) {
    colorClasses = 'bg-blue-50 text-[#2563EB] border-blue-200/60';
    dotColor = 'bg-[#2563EB]';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorClasses} ${sizeClasses}`}>
      {variant === 'dot' && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      <span className="capitalize">{status.replace(/_/g, ' ')}</span>
    </span>
  );
};
