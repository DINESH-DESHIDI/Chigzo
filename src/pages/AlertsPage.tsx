import React, { useEffect, useState, useMemo } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  ShieldCheck,
  Check,
  RefreshCw,
  Eye
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { getAlerts, updateAlertStatus } from '../lib/api';
import { AdminAlert, AlertSeverity, AlertStatus } from '../lib/types';

export const AlertsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadAlerts() {
    setLoading(true);
    try {
      const data = await getAlerts();
      setAlerts(data);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (alertId: string, newStatus: 'acknowledged' | 'resolved') => {
    setProcessingId(alertId);
    const success = await updateAlertStatus(alertId, newStatus);
    if (success) {
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
      setNotification(`Alert marked as ${newStatus}.`);
      setTimeout(() => setNotification(null), 3000);
    }
    setProcessingId(null);
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      return true;
    });
  }, [alerts, severityFilter, statusFilter]);

  const severities: AlertSeverity[] = ['all', 'critical', 'warning', 'info'];

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#20232B]">
          Alerts
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
          Failures reported by background jobs — acknowledge while handling, resolve when fixed.
        </p>
      </div>

      {/* Notification banner */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Row: Severity Pills & Status Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Severity Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {severities.map((sev) => {
            const isActive = severityFilter === sev;
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full capitalize transition-all ${
                  isActive
                    ? 'bg-[#C9165B] text-white shadow-sm'
                    : 'bg-white text-[#64748B] hover:bg-neutral-100 hover:text-[#20232B] border border-[#E5E7EB]'
                }`}
              >
                {sev}
              </button>
            );
          })}
        </div>

        {/* Status Dropdown */}
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 text-xs bg-white text-[#20232B] rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B] shadow-subtle font-medium"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="All systems operational"
          description="No alerts require your attention right now."
        />
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-subtle hover:shadow-card transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCritical ? 'bg-rose-50 text-[#DC3545]' : isWarning ? 'bg-amber-50 text-[#D97706]' : 'bg-blue-50 text-[#2563EB]'
                    }`}>
                      {isCritical ? <AlertTriangle className="w-5 h-5" /> : isWarning ? <Clock className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#20232B]">
                          {alert.title}
                        </h3>
                        <StatusBadge status={alert.severity} size="sm" />
                        <StatusBadge status={alert.status} size="sm" />
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    {alert.status === 'open' && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'acknowledged')}
                        disabled={processingId === alert.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-[#20232B] transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                        disabled={processingId === alert.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-[#16A36A] hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] text-[11px] text-[#64748B]">
                  <span>Module: <strong className="text-[#20232B]">{alert.module}</strong></span>
                  <span>{new Date(alert.created_at).toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
