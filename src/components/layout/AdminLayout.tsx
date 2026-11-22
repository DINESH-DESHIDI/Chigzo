import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileMoreDrawer } from './MobileMoreDrawer';
import { getAlertsCount } from '../../lib/api';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Alert count polling (every 30s)
  useEffect(() => {
    let mounted = true;
    async function fetchAlertsCount() {
      try {
        const count = await getAlertsCount();
        if (mounted && count !== undefined) {
          setAlertCount(count);
        }
      } catch {
        if (mounted) setAlertCount(1);
      }
    }

    fetchAlertsCount();
    const interval = setInterval(fetchAlertsCount, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Desktop Fixed Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        alertCount={alertCount}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Top Header */}
        <Header alertCount={alertCount} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenMore={() => setMobileMoreOpen(true)}
        isMoreActive={mobileMoreOpen}
      />

      {/* Mobile More Slide-Up Drawer */}
      <MobileMoreDrawer
        isOpen={mobileMoreOpen}
        onClose={() => setMobileMoreOpen(false)}
        alertCount={alertCount}
      />
    </div>
  );
};
