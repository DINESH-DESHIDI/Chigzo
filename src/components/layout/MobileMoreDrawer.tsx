import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Bell,
  Flag,
  User,
  LogOut,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alertCount?: number;
}

export const MobileMoreDrawer: React.FC<MobileMoreDrawerProps> = ({
  isOpen,
  onClose,
  alertCount = 0,
}) => {
  const navigate = useNavigate();
  const { adminProfile, signOut, isDemoMode, signInAsDemoAdmin } = useAuth();

  if (!isOpen) return null;

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const adminEmail = adminProfile?.email || 'admin@chigzo.com';
  const initial = (adminProfile?.first_name?.[0] || adminEmail[0] || 'A').toUpperCase();

  return (
    <div className="lg:hidden fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fade-in flex flex-col justify-end">
      {/* Backdrop listener */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide up sheet */}
      <div className="bg-white rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl p-5 pb-safe space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Handle & Close */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] flex items-center justify-center font-bold text-sm">
              {initial}
            </div>
            <div>
              <p className="text-xs font-bold text-[#20232B] truncate">{adminProfile?.first_name || 'Admin'} ({adminProfile?.role || 'Admin'})</p>
              <p className="text-[11px] text-[#64748B] truncate max-w-[200px]">{adminEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 text-[#64748B] hover:text-[#20232B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* More Menu Items */}
        <div className="space-y-1">
          <button
            onClick={() => handleNav('/users')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#20232B]">Users</p>
                <p className="text-xs text-[#64748B]">Manage members, accounts, and administrators</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          <button
            onClick={() => handleNav('/alerts')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#20232B]">Alerts</p>
                  {alertCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#C9165B] text-white">
                      {alertCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B]">System alerts and background job health</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          <button
            onClick={() => handleNav('/reports')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#20232B]">Reports & Moderation</p>
                <p className="text-xs text-[#64748B]">User content flags and community analytics</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>

        {/* Mode & Logout */}
        <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
          {isDemoMode && (
            <div className="p-3 rounded-xl bg-pink-50 border border-pink-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9165B]" />
                <span className="text-xs font-semibold text-[#C9165B]">Preview Mode Active</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              signOut();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-[#DC3545] font-semibold text-xs active:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Admin Console</span>
          </button>
        </div>
      </div>
    </div>
  );
};
