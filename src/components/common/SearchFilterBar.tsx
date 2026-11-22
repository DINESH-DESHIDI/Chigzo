import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  tabs?: { id: string; label: string; count?: number }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  extraControls?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  onSearchChange,
  placeholder = 'Search...',
  tabs,
  activeTab,
  onTabChange,
  extraControls,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Tabs / Pills */}
      {tabs && onTabChange && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-[#C9165B] text-white shadow-sm'
                    : 'bg-white text-[#64748B] hover:bg-neutral-100 hover:text-[#20232B] border border-[#E5E7EB]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-[#64748B]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Search Input & Extra Controls */}
      <div className="flex items-center gap-2 flex-1 sm:max-w-md sm:ml-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 py-2 bg-white text-xs sm:text-sm text-[#20232B] placeholder-[#64748B] rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B] transition-all shadow-subtle"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#20232B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {extraControls}
      </div>
    </div>
  );
};
