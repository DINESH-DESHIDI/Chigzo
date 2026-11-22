import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  label,
  icon: Icon,
  trend,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-subtle transition-all duration-200 hover:shadow-card hover:border-[#D1D5DB] ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[#64748B] tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#20232B]">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded ${
              trend.positive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {label && (
        <p className="mt-1 text-xs text-[#64748B] line-clamp-1">
          {label}
        </p>
      )}
    </div>
  );
};
