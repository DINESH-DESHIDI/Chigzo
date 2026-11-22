import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  MapPin,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  Mail,
  ExternalLink,
  CheckCircle,
  IndianRupee
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { getCommunities, getEvents, toggleCommunityVisibility } from '../lib/api';
import { Community, EventItem } from '../lib/types';
import { MOCK_COMMUNITY_FINANCIALS } from '../lib/mockData';

export const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<Community | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [commsRes, eventsRes] = await Promise.all([
          getCommunities(),
          getEvents(),
        ]);

        const comm = commsRes.communities.find(c => c.id === id);
        if (comm) {
          setCommunity(comm);
        }
        setEvents(eventsRes.filter(e => e.community_id === id));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleToggleHide = async () => {
    if (!community) return;
    setIsUpdating(true);
    const newHidden = !community.is_hidden;
    const success = await toggleCommunityVisibility(community.id, community.is_hidden || false);
    if (success) {
      setCommunity({ ...community, is_hidden: newHidden });
      setNotification(`Community ${newHidden ? 'hidden from public explore' : 'unhidden'}`);
      setTimeout(() => setNotification(null), 3000);
    }
    setIsUpdating(false);
  };

  if (loading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!community) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-[#E5E7EB]">
        <Building2 className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
        <h3 className="text-base font-bold text-[#20232B]">Community Not Found</h3>
        <p className="text-xs text-[#64748B] mt-1">The requested community ID does not exist.</p>
        <button
          onClick={() => navigate('/communities')}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-[#C9165B] text-white rounded-lg"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const financials = id ? MOCK_COMMUNITY_FINANCIALS[id] : null;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/communities')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#C9165B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Communities Directory</span>
      </button>

      {/* Notification banner */}
      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Community Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-subtle">
        {/* Banner Area */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-[#C9165B] via-[#D83A76] to-[#8C0E3E] relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Info header */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-card border border-[#E5E7EB] flex-shrink-0">
                <div className="w-full h-full rounded-xl bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center font-black text-2xl sm:text-3xl">
                  {community.name[0]}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#20232B]">
                    {community.name}
                  </h2>
                  <StatusBadge
                    status={community.deletion_grace_started_at ? 'Scheduled' : community.deleted_at ? 'Deleted' : 'Active'}
                    size="sm"
                  />
                  {community.is_hidden && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#C9165B]" />
                  <span>{community.owner_email || 'No owner email'}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleToggleHide}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E5E7EB] bg-white text-[#20232B] hover:bg-neutral-50 shadow-subtle transition-colors"
              >
                {community.is_hidden ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#16A36A]" />
                    <span>Unhide Community</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Hide from Public</span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/financials')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] hover:bg-pink-100 transition-colors"
              >
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Financial Passbook</span>
              </button>
            </div>
          </div>

          {/* Description & Location */}
          <div className="pt-2 border-t border-[#E5E7EB] text-xs text-[#64748B] space-y-1">
            <p className="text-sm text-[#20232B]">
              {community.description || 'No community description provided.'}
            </p>
            <div className="flex items-center gap-4 pt-1 text-[11px]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C9165B]" />
                <span>{community.city || 'Hyderabad'}, {community.state || 'Telangana'}</span>
              </span>
              <span>Category: <strong className="text-[#20232B]">{community.category || 'General'}</strong></span>
              <span>Created: <strong>{new Date(community.created_at).toLocaleDateString('en-GB')}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Members</span>
          <p className="text-2xl font-bold text-[#20232B] mt-1">{community.member_count}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Events Hosted</span>
          <p className="text-2xl font-bold text-[#20232B] mt-1">{events.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Current Balance</span>
          <p className="text-2xl font-bold text-[#16A36A] mt-1">₹{(financials?.current_balance || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Bank Status</span>
          <p className="mt-1">
            <StatusBadge status={financials?.beneficiary_status === 'linked' ? 'Linked' : 'Not Linked'} size="sm" />
          </p>
        </div>
      </div>

      {/* Community Events Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-base font-bold text-[#20232B]">Hosted Events</h3>
            <p className="text-xs text-[#64748B]">Events organized by {community.name}</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-[#64748B]">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </span>
        </div>

        {events.length === 0 ? (
          <p className="text-xs text-[#64748B] py-6 text-center">
            No events published by this community yet.
          </p>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate(`/events/${evt.id}`)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-neutral-50 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#20232B] hover:text-[#C9165B]">
                    {evt.title}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    {new Date(evt.start_date).toLocaleDateString('en-GB')} • Capacity: {evt.booked_count}/{evt.capacity}
                  </p>
                </div>
                <StatusBadge status={evt.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
