import React from 'react';

interface FinancialKpiCardProps {
  title: string;
  amount: number | string;
  subtext: string;
  colorVariant?: 'neutral' | 'green' | 'amber' | 'rose' | 'blue';
  highlightBorder?: boolean;
}

export const FinancialKpiCard: React.FC<FinancialKpiCardProps> = ({
  title,
  amount,
  subtext,
  colorVariant = 'neutral',
  highlightBorder = false,
}) => {
  const formattedAmount = typeof amount === 'number'
    ? `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : amount;

  const colorStyles = {
    neutral: 'text-[#20232B]',
    green: 'text-[#16A36A]',
    amber: 'text-[#D97706]',
    rose: 'text-[#DC3545]',
    blue: 'text-[#2563EB]',
  };

  const borderStyles = highlightBorder
    ? 'border-[#C9165B]/30 ring-1 ring-[#C9165B]/10'
    : 'border-[#E5E7EB]';

  return (
    <div className={`bg-white rounded-xl border ${borderStyles} p-4 sm:p-5 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between`}>
      <div>
        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
          {title}
        </span>
        <div className={`mt-2 text-xl sm:text-2xl font-bold tracking-tight ${colorStyles[colorVariant]}`}>
          {formattedAmount}
        </div>
      </div>
      <p className="mt-2 text-xs text-[#64748B]">
        {subtext}
      </p>
    </div>
  );
};
