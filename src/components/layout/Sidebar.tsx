import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  IndianRupee,
  Bell,
  Flag,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { ChigzoLogo } from '../common/ChigzoLogo';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  alertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  alertCount = 0,
}) => {
  const { adminProfile, signOut, isDemoMode } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'communities', label: 'Communities', path: '/communities', icon: Building2 },
    { id: 'users', label: 'Users', path: '/users', icon: Users },
    { id: 'events', label: 'Events', path: '/events', icon: Calendar },
    { id: 'financials', label: 'Financials & Ledger', path: '/financials', icon: IndianRupee },
    { id: 'alerts', label: 'Alerts', path: '/alerts', icon: Bell, badge: alertCount },
    { id: 'reports', label: 'Reports', path: '/reports', icon: Flag },
  ];

  const adminEmail = adminProfile?.email || 'admin@chigzo.com';
  const initial = (adminProfile?.first_name?.[0] || adminEmail[0] || 'A').toUpperCase();

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 select-none z-30 h-screen sticky top-0 ${
        collapsed ? 'w-[76px]' : 'w-[250px]'
      }`}
    >
      {/* Top Brand & Collapse Toggle */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E5E7EB]">
        <div className="overflow-hidden">
          <ChigzoLogo collapsed={collapsed} />
        </div>
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#20232B] hover:bg-neutral-100 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative group ${
                  isActive
                    ? 'bg-[#FFF0F5] text-[#C9165B] shadow-sm'
                    : 'text-[#64748B] hover:bg-neutral-50 hover:text-[#20232B]'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C9165B] text-white">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C9165B]" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Demo Mode Badge */}
      {isDemoMode && !collapsed && (
        <div className="mx-3 mb-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] text-amber-800 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Interactive Preview Mode</span>
        </div>
      )}

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-[#E5E7EB]">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors ${
            collapsed ? 'justify-center p-1' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initial}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#20232B] truncate">{adminEmail}</p>
              <p className="text-[11px] text-[#64748B] flex items-center gap-1">
                <span>Admin</span>
                <span className="w-1 h-1 rounded-full bg-[#16A36A]" />
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 text-[#64748B] hover:text-[#DC3545] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
