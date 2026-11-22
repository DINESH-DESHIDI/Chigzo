import React from 'react';

interface ChigzoLogoProps {
  collapsed?: boolean;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const ChigzoLogo: React.FC<ChigzoLogoProps> = ({
  collapsed = false,
  variant = 'dark',
  size = 'md',
}) => {
  const isDark = variant === 'dark';

  if (collapsed) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9165B] to-[#A8124C] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
          C
        </div>
      </div>
    );
  }

  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl';

  return (
    <div className="flex items-center gap-2 select-none">
      <div className="flex items-baseline">
        <span className={`font-black tracking-tight ${textSize} ${isDark ? 'text-[#20232B]' : 'text-white'}`}>
          chigzo
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9165B] ml-0.5 mb-1" />
      </div>
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3]">
        Admin
      </span>
    </div>
  );
};
