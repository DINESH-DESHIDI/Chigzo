import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  ShieldCheck,
  Calendar,
  Building2,
  CheckCircle,
  AlertTriangle,
  UserX,
  UserCheck,
  Clock
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { getUsers, getEvents } from '../lib/api';
import { UserProfile, EventItem } from '../lib/types';
import { MOCK_EVENTS } from '../lib/mockData';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookedEvents, setBookedEvents] = useState<EventItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const users = await getUsers('all');
        const found = users.find(u => u.id === id);
        if (found) {
          setUser(found);
          // Sample booked events
          setBookedEvents(MOCK_EVENTS.slice(0, 2));
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleToggleSuspend = () => {
    if (!user) return;
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setUser({ ...user, status: newStatus, is_suspended: newStatus === 'suspended' });
    setNotification(`User account marked as ${newStatus}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleAdmin = () => {
    if (!user) return;
    const newAdmin = !user.is_admin;
    setUser({ ...user, is_admin: newAdmin, role: newAdmin ? 'Admin' : 'Member' });
    setNotification(`Administrator privileges ${newAdmin ? 'granted' : 'revoked'}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!user) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-[#E5E7EB]">
        <User className="w-10 h-10 text-[#64748B] mx-auto mb-2" />
        <h3 className="text-base font-bold text-[#20232B]">User Not Found</h3>
        <p className="text-xs text-[#64748B] mt-1">The requested user profile does not exist.</p>
        <button
          onClick={() => navigate('/users')}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-[#C9165B] text-white rounded-lg"
        >
          Return to Users Directory
        </button>
      </div>
    );
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User';
  const initial = (user.first_name?.[0] || user.email[0] || 'U').toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/users')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#C9165B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Users</span>
      </button>

      {/* Notification banner */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] flex items-center justify-center font-bold text-2xl flex-shrink-0">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[#20232B]">{fullName}</h2>
              {user.is_admin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3]">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
              )}
              <StatusBadge status={user.status || 'Active'} size="sm" />
            </div>
            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-2">
              <span>{user.email}</span>
              {user.username && (
                <>
                  <span>•</span>
                  <span>@{user.username}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={handleToggleAdmin}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E5E7EB] bg-white text-[#20232B] hover:bg-neutral-50 shadow-subtle transition-colors"
          >
            {user.is_admin ? 'Revoke Admin' : 'Make Administrator'}
          </button>
          <button
            onClick={handleToggleSuspend}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              user.status === 'suspended'
                ? 'bg-emerald-50 text-[#16A36A] hover:bg-emerald-100 border border-emerald-200'
                : 'bg-rose-50 text-[#DC3545] hover:bg-rose-100 border border-rose-200'
            }`}
          >
            {user.status === 'suspended' ? 'Restore User' : 'Suspend Account'}
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Registration Date</span>
          <p className="text-sm font-semibold text-[#20232B] mt-1">
            {new Date(user.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Communities Joined</span>
          <p className="text-sm font-semibold text-[#20232B] mt-1">
            {user.communities_count || 1} community
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
          <span className="text-[10px] font-bold uppercase text-[#64748B]">Events Booked</span>
          <p className="text-sm font-semibold text-[#20232B] mt-1">
            {bookedEvents.length} events
          </p>
        </div>
      </div>

      {/* Booked Events History */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-base font-bold text-[#20232B]">Event Booking History</h3>
            <p className="text-xs text-[#64748B]">Marathons and workshops attended or booked by this user</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-[#64748B]">
            {bookedEvents.length} Bookings
          </span>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {bookedEvents.map((evt) => (
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
                  {evt.community_name} • {new Date(evt.start_date).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#16A36A]">₹{evt.price.toFixed(2)}</span>
                <StatusBadge status="Confirmed" size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
