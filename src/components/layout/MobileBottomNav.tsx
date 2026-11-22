import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  IndianRupee,
  Menu
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMore: () => void;
  isMoreActive?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenMore,
  isMoreActive = false,
}) => {
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { id: 'communities', label: 'Communities', path: '/communities', icon: Building2 },
    { id: 'events', label: 'Events', path: '/events', icon: Calendar },
    { id: 'financials', label: 'Finance', path: '/financials', icon: IndianRupee },
  ];

  const isMoreRouteActive = ['/users', '/alerts', '/reports'].some(p => location.pathname.startsWith(p));

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] shadow-lg pb-safe">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 select-none transition-colors ${
                  isActive
                    ? 'text-[#C9165B] font-bold'
                    : 'text-[#64748B] hover:text-[#20232B] font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#FFF0F5]' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* More Button */}
        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center gap-1 select-none transition-colors ${
            isMoreActive || isMoreRouteActive
              ? 'text-[#C9165B] font-bold'
              : 'text-[#64748B] hover:text-[#20232B] font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isMoreActive || isMoreRouteActive ? 'bg-[#FFF0F5]' : ''}`}>
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </div>
    </div>
  );
};
