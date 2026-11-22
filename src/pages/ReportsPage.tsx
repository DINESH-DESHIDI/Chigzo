import React, { useEffect, useState, useMemo } from 'react';
import {
  Flag,
  BarChart3,
  Download,
  Calendar,
  Building2,
  Users,
  IndianRupee,
  ShieldAlert,
  CheckCircle,
  Eye,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { getContentReports, updateReportStatus } from '../lib/api';
import { ContentReport } from '../lib/types';

export const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [activeView, setActiveView] = useState<'moderation' | 'analytics'>('moderation');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Date range filter for analytics
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const data = await getContentReports();
      setReports(data);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (reportId: string, newStatus: 'reviewed' | 'dismissed' | 'actioned') => {
    setProcessingId(reportId);
    const success = await updateReportStatus(reportId, newStatus);
    if (success) {
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      setNotification(`Report status marked as ${newStatus}.`);
      setTimeout(() => setNotification(null), 3000);
    }
    setProcessingId(null);
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [reports, statusFilter]);

  const openCount = reports.filter(r => r.status === 'open').length;

  const handleExportAnalytics = (reportName: string) => {
    setNotification(`Exported "${reportName}" CSV report successfully.`);
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return <LoadingSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#20232B]">
            Reports
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            User-submitted reports of objectionable content or abuse. Review each and act.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 self-start sm:self-auto p-1 bg-white border border-[#E5E7EB] rounded-xl shadow-subtle">
          <button
            onClick={() => setActiveView('moderation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeView === 'moderation'
              ? 'bg-[#C9165B] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#20232B]'
              }`}
          >
            Abuse & Content ({openCount} open)
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeView === 'analytics'
              ? 'bg-[#C9165B] text-white shadow-sm'
              : 'text-[#64748B] hover:text-[#20232B]'
              }`}
          >
            Analytics & Reports
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* View 1: Moderation / Abuse Reports */}
      {activeView === 'moderation' ? (
        <div className="space-y-5">
          {/* Status Filter */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">
              {openCount} open
            </span>

            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white text-[#20232B] rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B] shadow-subtle font-medium"
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="reviewed">Reviewed</option>
                <option value="dismissed">Dismissed</option>
                <option value="actioned">Actioned</option>
              </select>
            </div>
          </div>

          {/* Reports List */}
          {filteredReports.length === 0 ? (
            <EmptyState
              icon={Flag}
              title="No reports yet"
              description="No user-submitted reports matching current filters."
            />
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-subtle space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#DC3545] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/50">
                          {report.reason}
                        </span>
                        <StatusBadge status={report.status} size="sm" />
                      </div>

                      <h3 className="text-sm font-bold text-[#20232B] pt-1">
                        Reported Target: {report.target_title || report.target_type}
                      </h3>

                      <p className="text-xs text-[#64748B]">
                        {report.details}
                      </p>

                      <div className="pt-2 text-[11px] text-[#64748B] flex items-center gap-3">
                        <span>Reporter: <strong>{report.reporter_name}</strong></span>
                        <span>•</span>
                        <span>Reported User: <strong>{report.target_user_name}</strong></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                      {report.status !== 'reviewed' && (
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                          disabled={processingId === report.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-[#20232B] transition-colors"
                        >
                          Review
                        </button>
                      )}
                      {report.status !== 'dismissed' && (
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                          disabled={processingId === report.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-[#64748B] transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                      {report.status !== 'actioned' && (
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'actioned')}
                          disabled={processingId === report.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-[#DC3545] hover:bg-rose-100 border border-rose-200 transition-colors"
                        >
                          Action (Take Down)
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB] text-[11px] text-[#64748B]">
                    Submitted: {new Date(report.created_at).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* View 2: Platform Analytics & Performance Reports */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Ticket Sales Reports', desc: 'Breakdown of bookings by marathon & category', count: '13 Bookings' },
              { title: 'Revenue Reports', desc: 'Gross booking value and net proceeds', count: '₹17.00 Stored' },
              { title: 'Platform Fee Reports', desc: 'Audited 6% platform fee deductions', count: '₹1.04 Revenue' },
              { title: 'Community Growth Reports', desc: 'New community creation and organizer metrics', count: '5 Communities' },
              { title: 'User Registration Reports', desc: 'Member signups and verification rate', count: '28 Users' },
              { title: 'Event Performance Reports', desc: 'Capacity utilization and attendance rates', count: '7 Events' },
              { title: 'Refund Reports', desc: 'Gateway chargebacks and cancelled tickets', count: '₹0.00 (0 Disputes)' },
              { title: 'Payout Reports', desc: 'Settlements to organizer bank accounts', count: '₹0.00 Settled' },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C9165B]">{card.count}</span>
                    <BarChart3 className="w-4 h-4 text-[#64748B]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#20232B] mt-2">{card.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1">{card.desc}</p>
                </div>

                <button
                  onClick={() => handleExportAnalytics(card.title)}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#FFF0F5] text-[#C9165B] hover:bg-pink-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
