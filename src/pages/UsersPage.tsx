import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Eye,
  Mail,
  Calendar,
  MoreVertical,
  CheckCircle,
  Clock
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { getUsers } from '../lib/api';
import { UserProfile } from '../lib/types';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'suspended' | 'all'>('active');
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [activeTab]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getUsers(activeTab);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase().includes(q);
        const emailMatch = u.email.toLowerCase().includes(q);
        const userMatch = u.username?.toLowerCase().includes(q);
        return nameMatch || emailMatch || userMatch;
      }
      return true;
    });
  }, [users, search]);

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'suspended', label: 'Suspended' },
    { id: 'all', label: 'All' },
  ];

  if (loading) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#20232B]">
          All Users
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
          View and manage all registered platform users, organizers, and administrators.
        </p>
      </div>

      {/* Success banner */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search and Tab Filters */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by name, email, or username..."
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
      />

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Users Found"
          description={search ? `No registered user matches "${search}".` : 'No users found in this status category.'}
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
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Username</th>
                  <th className="py-3.5 px-4 text-center">Admin</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs">
                {filteredUsers.map((user) => {
                  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User';
                  const initial = (user.first_name?.[0] || user.email[0] || 'U').toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {initial}
                          </div>
                          <span className="font-semibold text-[#C9165B] group-hover:underline">
                            {fullName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {user.username ? `@${user.username}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {user.is_admin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3]">
                            <ShieldCheck className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="text-[#64748B]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          status={user.deleted_at ? 'Deleted' : user.deletion_grace_started_at ? 'Scheduled' : user.is_suspended ? 'Suspended' : 'Active'}
                          size="sm"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {new Date(user.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/users/${user.id}`);
                          }}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#C9165B] hover:bg-[#FFF0F5] transition-colors"
                          title="View user profile"
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

          {/* Mobile User Cards View */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => {
              const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User';
              const initial = (user.first_name?.[0] || user.email[0] || 'U').toUpperCase();

              return (
                <div
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-subtle hover:shadow-card active:bg-neutral-50 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#C9165B] truncate">
                            {fullName}
                          </h3>
                          {user.is_admin && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FFF0F5] text-[#C9165B]">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                      </div>
                    </div>
                    <StatusBadge
                      status={user.deleted_at ? 'Deleted' : user.deletion_grace_started_at ? 'Scheduled' : user.is_suspended ? 'Suspended' : 'Active'}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] text-xs text-[#64748B]">
                    <span>Username: <strong className="text-[#20232B]">{user.username ? `@${user.username}` : '—'}</strong></span>
                    <span>Joined: {new Date(user.created_at).toLocaleDateString('en-GB')}</span>
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
