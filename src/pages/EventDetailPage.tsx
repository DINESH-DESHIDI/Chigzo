import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Tag
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { getEvents } from '../lib/api';
import { EventItem } from '../lib/types';
import { MOCK_USERS } from '../lib/mockData';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const events = await getEvents();
        const found = events.find(e => e.id === id);
        if (found) {
          setEvent(found);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleToggleStatus = (newStatus: 'published' | 'completed' | 'cancelled') => {
    if (!event) return;
    setEvent({ ...event, status: newStatus });
    setNotification(`Event status updated to ${newStatus}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!event) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-[#E5E7EB]">
        <Calendar className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
        <h3 className="text-base font-bold text-[#20232B]">Event Not Found</h3>
        <p className="text-xs text-[#64748B] mt-1">The requested event does not exist.</p>
        <button
          onClick={() => navigate('/events')}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-[#C9165B] text-white rounded-lg"
        >
          Return to Events Directory
        </button>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((event.booked_count / (event.capacity || 1)) * 100));
  const estimatedRevenue = (event.price || 0) * (event.booked_count || 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/events')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#C9165B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events Directory</span>
      </button>

      {/* Notification banner */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Event Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#C9165B] bg-[#FFF0F5] px-2.5 py-1 rounded-full">
                {event.community_name}
              </span>
              <StatusBadge status={event.status} size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#20232B] mt-2">
              {event.title}
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              {event.description || 'No event description provided.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {event.status === 'published' && (
              <button
                onClick={() => handleToggleStatus('completed')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-[#16A36A] hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                Mark Completed
              </button>
            )}
            {event.status !== 'cancelled' && (
              <button
                onClick={() => handleToggleStatus('cancelled')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-[#DC3545] hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                Cancel Event
              </button>
            )}
          </div>
        </div>

        {/* Details row */}
        <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center gap-6 text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#C9165B]" />
            <span>{new Date(event.start_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#C9165B]" />
            <span>{event.location || 'Hyderabad, Telangana'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-[#16A36A]" />
            <span>Ticket: <strong className="text-[#20232B]">{event.price > 0 ? `₹${event.price.toFixed(2)}` : 'Free'}</strong></span>
          </span>
        </div>
      </div>

      {/* Capacity & Booking Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Total Capacity</span>
          <p className="text-2xl font-bold text-[#20232B] mt-1">{event.capacity}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Tickets Booked</span>
          <p className="text-2xl font-bold text-[#C9165B] mt-1">{event.booked_count}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Available Tickets</span>
          <p className="text-2xl font-bold text-[#16A36A] mt-1">{Math.max(0, event.capacity - event.booked_count)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Est. Revenue</span>
          <p className="text-2xl font-bold text-[#20232B] mt-1">₹{estimatedRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-subtle">
        <div className="flex items-center justify-between text-xs font-semibold text-[#20232B] mb-2">
          <span>Booking Progress</span>
          <span>{event.booked_count} of {event.capacity} seats filled ({percent}%)</span>
        </div>
        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#C9165B] h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Registered Attendees */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-base font-bold text-[#20232B]">Registered Participants</h3>
            <p className="text-xs text-[#64748B]">Marathon runners and attendees for this event</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-[#64748B]">
            {event.booked_count} Bookings
          </span>
        </div>

        {event.booked_count === 0 ? (
          <p className="text-xs text-[#64748B] py-6 text-center">
            No attendees registered for this event yet.
          </p>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {MOCK_USERS.slice(0, event.booked_count).map((user, idx) => (
              <div
                key={user.id + idx}
                onClick={() => navigate(`/users/${user.id}`)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-neutral-50 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center font-bold text-xs">
                    {(user.first_name?.[0] || 'U').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#20232B] hover:text-[#C9165B]">
                      {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                    </p>
                    <p className="text-[11px] text-[#64748B]">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#16A36A]">
                    {event.price > 0 ? `₹${event.price.toFixed(2)}` : 'Free'}
                  </span>
                  <StatusBadge status="Confirmed" size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
