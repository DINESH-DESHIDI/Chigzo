import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Users,
  Search,
  Check,
  X,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { Modal } from '../components/common/Modal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import {
  getCommunities,
  approveCommunityApplication,
  rejectCommunityApplication,
} from '../lib/api';
import { Community, CommunityApplication } from '../lib/types';

export const CommunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [applications, setApplications] = useState<CommunityApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'approvals' | 'scheduled'>('all');
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<CommunityApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, []);

  async function loadCommunities() {
    setLoading(true);
    try {
      const res = await getCommunities();
      setCommunities(res.communities);
      setApplications(res.applications);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (app: CommunityApplication) => {
    setProcessingAction(true);
    const success = await approveCommunityApplication(app.id);
    if (success) {
      setApplications(prev => prev.filter(a => a.id !== app.id));
      setActionSuccess(`Community "${app.community_name}" has been approved!`);
      setTimeout(() => setActionSuccess(null), 4000);
      loadCommunities();
    }
    setProcessingAction(false);
  };

  const handleOpenReject = (app: CommunityApplication) => {
    setSelectedApp(app);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedApp || !rejectReason.trim()) return;
    setProcessingAction(true);
    const success = await rejectCommunityApplication(selectedApp.id, rejectReason.trim());
    if (success) {
      setApplications(prev => prev.filter(a => a.id !== selectedApp.id));
      setActionSuccess(`Application for "${selectedApp.community_name}" rejected.`);
      setTimeout(() => setActionSuccess(null), 4000);
      setRejectModalOpen(false);
    }
    setProcessingAction(false);
  };

  // Filtered communities
  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      // Tab filter
      if (activeTab === 'active' && (comm.is_hidden || comm.deleted_at || comm.deletion_grace_started_at)) return false;
      if (activeTab === 'scheduled' && !comm.deletion_grace_started_at) return false;

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const nameMatch = comm.name.toLowerCase().includes(query);
        const emailMatch = comm.owner_email?.toLowerCase().includes(query);
        const cityMatch = comm.city?.toLowerCase().includes(query);
        return nameMatch || emailMatch || cityMatch;
      }
      return true;
    });
  }, [communities, activeTab, search]);

  const activeCount = communities.filter(c => !c.deletion_grace_started_at && !c.deleted_at).length;
  const scheduledCount = communities.filter(c => !!c.deletion_grace_started_at).length;
  const approvalsCount = applications.filter(a => a.status === 'pending').length;

  const tabs = [
    { id: 'all', label: 'All Communities', count: communities.length },
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'approvals', label: 'Approvals', count: approvalsCount },
    { id: 'scheduled', label: 'Scheduled for closure', count: scheduledCount },
  ];

  if (loading) {
    return <LoadingSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#20232B]">
          Communities Directory
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
          Manage active communities, review pending onboarding requests, and oversee platform closures.
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
        placeholder="Search by community name, owner email, city..."
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
      />

      {/* Approvals View */}
      {activeTab === 'approvals' ? (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No Pending Approvals"
              description="All community onboarding applications have been reviewed."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-subtle flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#C9165B] flex items-center justify-center font-bold text-base">
                          {app.community_name[0]}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#20232B]">
                            {app.community_name}
                          </h3>
                          <span className="text-[11px] font-medium text-[#C9165B] bg-[#FFF0F5] px-2 py-0.5 rounded-full">
                            {app.category || 'General'}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status="Pending" size="sm" />
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-[#64748B]">
                      <p>
                        <strong className="text-[#20232B]">Applicant:</strong> {app.applicant_name} ({app.applicant_email})
                      </p>
                      {app.description && (
                        <p className="line-clamp-2">
                          <strong className="text-[#20232B]">Description:</strong> {app.description}
                        </p>
                      )}
                      {app.notes && (
                        <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/50">
                          <strong>Note:</strong> {app.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenReject(app)}
                      disabled={processingAction}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#DC3545] hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(app)}
                      disabled={processingAction}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#16A36A] text-white hover:bg-[#128354] shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Community</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Regular Communities Directory */
        <div>
          {filteredCommunities.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No Communities Found"
              description={search ? `No communities match "${search}".` : "No communities available in this tab."}
              actionText={search ? "Clear search" : undefined}
              onAction={search ? () => setSearch('') : undefined}
            />
          ) : (
            <>
              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block bg-white rounded-xl border border-[#E5E7EB] shadow-subtle overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-neutral-50/70 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      <th className="py-3.5 px-4">Community Name</th>
                      <th className="py-3.5 px-4">Owner Email</th>
                      <th className="py-3.5 px-4 text-center">Members</th>
                      <th className="py-3.5 px-4 text-center">Events</th>
                      <th className="py-3.5 px-4">Created</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-xs">
                    {filteredCommunities.map((comm) => (
                      <tr
                        key={comm.id}
                        className="hover:bg-neutral-50/80 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/communities/${comm.id}`)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {comm.name[0]}
                            </div>
                            <span className="font-semibold text-[#C9165B] group-hover:underline">
                              {comm.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {comm.owner_email || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium text-[#20232B]">
                          {comm.member_count}
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium text-[#20232B]">
                          {comm.event_count}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          {new Date(comm.created_at).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge
                            status={comm.deletion_grace_started_at ? 'Scheduled' : comm.deleted_at ? 'Deleted' : 'Active'}
                            size="sm"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/communities/${comm.id}`);
                            }}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#C9165B] hover:bg-[#FFF0F5] transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View (Visible on mobile, replaces wide table) */}
              <div className="md:hidden space-y-3">
                {filteredCommunities.map((comm) => (
                  <div
                    key={comm.id}
                    onClick={() => navigate(`/communities/${comm.id}`)}
                    className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-subtle hover:shadow-card active:bg-neutral-50 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3] flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {comm.name[0]}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[#C9165B] truncate">
                            {comm.name}
                          </h3>
                          <p className="text-xs text-[#64748B] truncate">
                            {comm.owner_email || 'No email attached'}
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        status={comm.deletion_grace_started_at ? 'Scheduled' : comm.deleted_at ? 'Deleted' : 'Active'}
                        size="sm"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E7EB] text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[#64748B] uppercase">Members</span>
                        <p className="font-bold text-[#20232B]">{comm.member_count}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748B] uppercase">Events</span>
                        <p className="font-bold text-[#20232B]">{comm.event_count}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748B] uppercase">Created</span>
                        <p className="font-medium text-[#64748B] text-[11px]">
                          {new Date(comm.created_at).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Application"
        subtitle={`Reject onboarding request for "${selectedApp?.community_name}"`}
        footer={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#20232B]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim() || processingAction}
              className="px-4 py-2 text-xs font-semibold bg-[#DC3545] text-white rounded-lg hover:bg-[#B91C1C] disabled:opacity-50 transition-colors"
            >
              Confirm Rejection
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#20232B]">
            Reason for Rejection <span className="text-red-500">*</span>
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Incomplete KYC documentation or unverified bank account details..."
            rows={3}
            className="w-full p-3 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B]"
          />
        </div>
      </Modal>
    </div>
  );
};
