import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Shield, User, ExternalLink } from 'lucide-react';
import { ChigzoLogo } from '../common/ChigzoLogo';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  alertCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ alertCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminProfile, signOut, isDemoMode } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/communities')) return 'Communities';
    if (pathname.startsWith('/users')) return 'Users';
    if (pathname.startsWith('/events')) return 'Events';
    if (pathname.startsWith('/financials')) return 'Financials & Ledger';
    if (pathname.startsWith('/alerts')) return 'Alerts';
    if (pathname.startsWith('/reports')) return 'Reports';
    return 'Dashboard';
  };

  const adminEmail = adminProfile?.email || 'admin@chigzo.com';
  const initial = (adminProfile?.first_name?.[0] || adminEmail[0] || 'A').toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Logo & Page Title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <ChigzoLogo size="sm" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-lg font-bold text-[#20232B] tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Environment / Mode indicator */}
        {isDemoMode && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-50 text-[#C9165B] border border-pink-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9165B] animate-pulse" />
            Live Preview
          </span>
        )}

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/alerts')}
          className="relative p-2 rounded-xl text-[#64748B] hover:text-[#20232B] hover:bg-neutral-100 transition-colors"
          title="Alerts and notifications"
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9165B] ring-2 ring-white" />
          )}
        </button>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-neutral-100 transition-all border border-transparent hover:border-[#E5E7EB]"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] flex items-center justify-center font-bold text-xs">
              {initial}
            </div>
            <span className="hidden md:inline-block text-xs font-semibold text-[#20232B] max-w-[120px] truncate">
              {adminProfile?.first_name || 'Admin'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-[#E5E7EB] py-2 z-30 animate-fade-in">
                <div className="px-4 py-2 border-b border-[#E5E7EB]">
                  <p className="text-xs font-bold text-[#20232B] truncate">{adminEmail}</p>
                  <p className="text-[11px] text-[#64748B]">Administrator</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/users');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#20232B] hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Manage Users</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/financials');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#20232B] hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Audit & Compliance</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      signOut();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#DC3545] hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
