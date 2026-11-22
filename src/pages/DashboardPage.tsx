import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Calendar,
  Layers,
  Scale,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { FinancialKpiCard } from '../components/common/FinancialKpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { getDashboardOverview, getCommunities, getEvents, getAlerts } from '../lib/api';
import { Community, EventItem, AdminAlert, FinancialObservabilityKPIs } from '../lib/types';
import { INITIAL_KPIS } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    communities: 5,
    users: 28,
    events: 7,
    members: 0,
  });
  const [kpis, setKpis] = useState<FinancialObservabilityKPIs>(INITIAL_KPIS);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dashData, commsData, eventsData, alertsData] = await Promise.allSettled([
          getDashboardOverview(),
          getCommunities(),
          getEvents(),
          getAlerts(),
        ]);

        if (dashData.status === 'fulfilled') {
          setMetrics({
            communities: dashData.value.communities,
            users: dashData.value.users,
            events: dashData.value.events,
            members: dashData.value.members,
          });
          setKpis(dashData.value.kpis);
        }

        if (commsData.status === 'fulfilled') {
          setCommunities(commsData.value.communities.slice(0, 4));
        }

        if (eventsData.status === 'fulfilled') {
          setEvents(eventsData.value.slice(0, 4));
        }

        if (alertsData.status === 'fulfilled') {
          setAlerts(alertsData.value.filter(a => a.status !== 'resolved').slice(0, 2));
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const adminName = adminProfile?.first_name || 'Admin';
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (loading) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#20232B]">
              Good morning, {adminName}
            </h2>
            <Sparkles className="w-5 h-5 text-[#C9165B]" />
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Summary of all activity across Chigzo marathon & event booking network.
          </p>
        </div>

        <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#64748B] shadow-subtle">
          <Clock className="w-3.5 h-3.5 text-[#C9165B]" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* 4 Primary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard
          title="Total Communities"
          value={metrics.communities}
          label="All communities on the platform"
          icon={Building2}
          onClick={() => navigate('/communities')}
        />
        <StatCard
          title="Total Users"
          value={metrics.users}
          label="All registered users"
          icon={Users}
          onClick={() => navigate('/users')}
        />
        <StatCard
          title="Total Events"
          value={metrics.events}
          label="All events across communities"
          icon={Calendar}
          onClick={() => navigate('/events')}
        />
        <StatCard
          title="Total Memberships"
          value={metrics.members}
          label="Total community memberships"
          icon={Layers}
        />
      </div>

      {/* Financial Reconciliation & Health Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-subtle">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[#E5E7EB]">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-[#20232B]">
                  Financial Reconciliation & Health
                </h3>
                <StatusBadge status={kpis.health_status} variant="dot" size="sm" />
              </div>
              <p className="mt-0.5 text-xs text-[#64748B]">
                Real-time 3-way balance integrity, refund queue health, and settlement liability tracking.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/financials')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#20232B] hover:text-[#C9165B] hover:bg-[#FFF0F5] border border-[#E5E7EB] hover:border-[#FCE7F3] transition-all shadow-subtle self-start sm:self-auto"
          >
            <span>Open Financial Ledger & Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Financial Sub-cards */}
        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <FinancialKpiCard
            title="Total Stored Wallet"
            amount={kpis?.stored_wallet_liability ?? 17.00}
            subtext="Platform wallet liability"
            colorVariant="green"
            highlightBorder
          />
          <FinancialKpiCard
            title="Pending Payouts"
            amount={kpis?.pending_payout_amount ?? 0.00}
            subtext="Awaiting organizer confirm"
            colorVariant="amber"
          />
          <FinancialKpiCard
            title="Disputed Payouts"
            amount={`${kpis?.disputed_payout_count ?? 0} (₹${(kpis?.disputed_payout_amount ?? 0).toFixed(2)})`}
            subtext="Requires investigation"
            colorVariant={(kpis?.disputed_payout_count ?? 0) > 0 ? 'rose' : 'neutral'}
          />
          <FinancialKpiCard
            title="Uncommitted Payable"
            amount={kpis?.uncommitted_payable ?? 17.00}
            subtext="Available uncommitted"
            colorVariant="green"
          />
        </div>
      </div>

      {/* Two Column Grid: Upcoming Events & Communities Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-base font-bold text-[#20232B]">Upcoming Events</h3>
                <p className="text-xs text-[#64748B]">Active marathon races & community workshops</p>
              </div>
              <button
                onClick={() => navigate('/events')}
                className="text-xs font-semibold text-[#C9165B] hover:underline"
              >
                View all ({metrics.events})
              </button>
            </div>

            <div className="mt-4 divide-y divide-[#E5E7EB]">
              {events.map((evt) => {
                const percent = Math.min(100, Math.round((evt.booked_count / (evt.capacity || 1)) * 100));
                return (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/events/${evt.id}`)}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-50 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-[#20232B] truncate">
                        {evt.title}
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        {evt.community_name} • {new Date(evt.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    <div className="sm:w-36 flex-shrink-0">
                      <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B] mb-1">
                        <span>Sold: {evt.booked_count}/{evt.capacity}</span>
                        <span className="font-bold text-[#20232B]">{percent}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C9165B] h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Communities Directory Preview Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-base font-bold text-[#20232B]">Active Communities</h3>
                <p className="text-xs text-[#64748B]">Marathon clubs and organizers</p>
              </div>
              <button
                onClick={() => navigate('/communities')}
                className="text-xs font-semibold text-[#C9165B] hover:underline"
              >
                View directory ({metrics.communities})
              </button>
            </div>

            <div className="mt-4 divide-y divide-[#E5E7EB]">
              {communities.map((comm) => (
                <div
                  key={comm.id}
                  onClick={() => navigate(`/communities/${comm.id}`)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-neutral-50 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {comm.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-[#20232B] truncate hover:text-[#C9165B]">
                        {comm.name}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {comm.owner_email || 'Organizer'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-[#64748B]">
                      {comm.member_count} {comm.member_count === 1 ? 'member' : 'members'}
                    </span>
                    <StatusBadge status="Active" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Health / Alert Banner if present */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                {alerts[0].title}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {alerts[0].description}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/alerts')}
            className="text-xs font-bold text-amber-800 underline hover:text-amber-900 flex-shrink-0"
          >
            Review Alerts
          </button>
        </div>
      )}
    </div>
  );
};
