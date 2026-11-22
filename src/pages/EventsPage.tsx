import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Search,
  Building2,
  Users,
  MapPin,
  Clock,
  Eye,
  IndianRupee,
  CheckCircle,
  Filter,
  BarChart2
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { getEvents, getCommunities } from '../lib/api';
import { EventItem, Community } from '../lib/types';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'completed' | 'draft'>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [evts, comms] = await Promise.all([
          getEvents(),
          getCommunities(),
        ]);
        setEvents(evts);
        setCommunities(comms.communities);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const now = new Date().getTime();

  // Metrics
  const totalEvents = events.length;
  const publishedCount = events.filter(e => e.status === 'published').length;
  const upcomingCount = events.filter(e => new Date(e.start_date).getTime() > now).length;
  const completedCount = events.filter(e => new Date(e.start_date).getTime() <= now || e.status === 'completed').length;

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Tab filter
      if (activeTab === 'published' && evt.status !== 'published') return false;
      if (activeTab === 'completed' && evt.status !== 'completed' && new Date(evt.start_date).getTime() > now) return false;
      if (activeTab === 'draft' && evt.status !== 'draft') return false;

      // Community filter
      if (selectedCommunity !== 'all' && evt.community_id !== selectedCommunity) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const titleMatch = evt.title.toLowerCase().includes(q);
        const commMatch = evt.community_name?.toLowerCase().includes(q);
        const locMatch = evt.location?.toLowerCase().includes(q);
        return titleMatch || commMatch || locMatch;
      }

      return true;
    });
  }, [events, activeTab, selectedCommunity, search, now]);

  const tabs = [
    { id: 'all', label: 'All Events', count: totalEvents },
    { id: 'published', label: 'Published', count: publishedCount },
    { id: 'completed', label: 'Completed', count: completedCount },
    { id: 'draft', label: 'Draft', count: events.filter(e => e.status === 'draft').length },
  ];

  if (loading) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#20232B]">
          All Events
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
          Browse and manage marathon races, fitness runs, and workshops across every community.
        </p>
      </div>

      {/* 4 Overview Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[11px] font-bold uppercase text-[#64748B]">Total Events</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#20232B] mt-1">{totalEvents}</p>
          <span className="text-xs text-[#64748B]">Across all communities</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[11px] font-bold uppercase text-[#64748B]">Published</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#16A36A] mt-1">{publishedCount}</p>
          <span className="text-xs text-[#64748B]">Live and bookable</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[11px] font-bold uppercase text-[#64748B]">Upcoming</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#C9165B] mt-1">{upcomingCount}</p>
          <span className="text-xs text-[#64748B]">Scheduled in future</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[11px] font-bold uppercase text-[#64748B]">Completed</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#20232B] mt-1">{completedCount}</p>
          <span className="text-xs text-[#64748B]">Past events held</span>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search event title, venue, community..."
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
        extraControls={
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="px-3 py-2 text-xs bg-white text-[#20232B] rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B] shadow-subtle"
          >
            <option value="all">All Communities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        }
      />

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Events Found"
          description={search ? `No events match "${search}".` : 'No events available matching selected filters.'}
          actionText={search ? "Clear search" : undefined}
          onAction={search ? () => setSearch('') : undefined}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-[#E5E7EB] shadow-subtle overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-neutral-50/70 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Event Title</th>
                  <th className="py-3.5 px-4">Community</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Capacity</th>
                  <th className="py-3.5 px-4">Tickets Booked</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs">
                {filteredEvents.map((evt) => {
                  const percent = Math.min(100, Math.round((evt.booked_count / (evt.capacity || 1)) * 100));

                  return (
                    <tr
                      key={evt.id}
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#C9165B] group-hover:underline">
                          {evt.title}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#20232B] font-medium">
                        {evt.community_name}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {new Date(evt.start_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={evt.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#20232B]">
                        {evt.capacity}
                      </td>
                      <td className="py-3.5 px-4 w-44">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-medium text-[#64748B]">
                            <span>{evt.booked_count} of {evt.capacity} sold</span>
                            <span className="font-bold text-[#20232B]">{percent}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#C9165B] h-full rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/${evt.id}`);
                          }}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#C9165B] hover:bg-[#FFF0F5] transition-colors"
                          title="View event details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Event Cards View */}
          <div className="md:hidden space-y-3">
            {filteredEvents.map((evt) => {
              const percent = Math.min(100, Math.round((evt.booked_count / (evt.capacity || 1)) * 100));

              return (
                <div
                  key={evt.id}
                  onClick={() => navigate(`/events/${evt.id}`)}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-subtle hover:shadow-card active:bg-neutral-50 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#C9165B]">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {evt.community_name}
                      </p>
                    </div>
                    <StatusBadge status={evt.status} size="sm" />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <span>Tickets Sold: <strong className="text-[#20232B]">{evt.booked_count} / {evt.capacity}</strong></span>
                      <span className="font-bold text-[#20232B]">{percent}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C9165B] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] text-xs text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C9165B]" />
                      <span>{new Date(evt.start_date).toLocaleDateString('en-GB')}</span>
                    </span>
                    <span className="font-bold text-[#16A36A]">
                      {evt.price > 0 ? `₹${evt.price.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
