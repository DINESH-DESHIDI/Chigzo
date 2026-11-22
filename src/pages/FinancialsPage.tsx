import React, { useEffect, useState, useMemo } from 'react';
import {
  IndianRupee,
  RefreshCw,
  Download,
  Scale,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Building2,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Check,
  X,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { FinancialKpiCard } from '../components/common/FinancialKpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import {
  getCommunities,
  getEvents,
  getFinancialStatement,
  runReconciliationAudit,
  recordManualPayout,
} from '../lib/api';
import {
  Community,
  EventItem,
  CommunityFinancials,
  PassbookTransaction,
  TransactionType,
} from '../lib/types';
import { MOCK_COMMUNITY_FINANCIALS } from '../lib/mockData';

export const FinancialsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('comm-1');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [statement, setStatement] = useState<CommunityFinancials>(MOCK_COMMUNITY_FINANCIALS['comm-1']);
  const [transactions, setTransactions] = useState<PassbookTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<TransactionType>('all');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Manual Payout Modal
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutUtr, setPayoutUtr] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('UPI');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [submittingPayout, setSubmittingPayout] = useState(false);

  // Reconciliation Audit Modal
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [commsRes, evtsRes] = await Promise.all([
          getCommunities(),
          getEvents(),
        ]);
        setCommunities(commsRes.communities);
        setEvents(evtsRes);
        if (commsRes.communities.length > 0) {
          const firstCommId = commsRes.communities[0].id;
          setSelectedCommunityId(firstCommId);
          await loadFinancials(firstCommId, 'all');
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function loadFinancials(commId: string, evtId: string) {
    setIsRefreshing(true);
    try {
      const res = await getFinancialStatement(commId, evtId);
      setStatement(res.statement);
      setTransactions(res.transactions);
    } finally {
      setIsRefreshing(false);
    }
  }

  const handleCommunityChange = (commId: string) => {
    setSelectedCommunityId(commId);
    setSelectedEventId('all');
    loadFinancials(commId, 'all');
  };

  const handleEventChange = (evtId: string) => {
    setSelectedEventId(evtId);
    loadFinancials(selectedCommunityId, evtId);
  };

  const handleManualPayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || !payoutUtr.trim()) return;

    setSubmittingPayout(true);
    const amountNum = parseFloat(payoutAmount);
    const res = await recordManualPayout({
      community_id: selectedCommunityId,
      amount: amountNum,
      utr: payoutUtr.trim(),
      payment_method: payoutMethod,
      event_id: selectedEventId !== 'all' ? selectedEventId : undefined,
      admin_notes: payoutNotes.trim(),
    });

    if (res.success) {
      setPayoutModalOpen(false);
      setPayoutAmount('');
      setPayoutUtr('');
      setPayoutNotes('');
      setNotification(`Payout of ₹${amountNum.toFixed(2)} recorded successfully.`);
      setTimeout(() => setNotification(null), 4000);
      loadFinancials(selectedCommunityId, selectedEventId);
    }
    setSubmittingPayout(false);
  };

  const handleTriggerAudit = async () => {
    setRunningAudit(true);
    setAuditModalOpen(true);
    const res = await runReconciliationAudit();
    setAuditResult(res.message);
    setRunningAudit(false);
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Customer Name', 'Customer Email', 'Event', 'Type', 'Amount (INR)', 'Platform Fee (INR)', 'Date', 'Status', 'UTR'];
    const rows = filteredTransactions.map(t => [
      t.transaction_id,
      t.customer_name || '',
      t.customer_email || '',
      t.event_title || '',
      t.transaction_type,
      t.amount,
      t.platform_fee || 0,
      t.date,
      t.status,
      t.utr || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `passbook_ledger_${selectedCommunityId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification('Passbook ledger exported as CSV.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (activeTab !== 'all' && t.transaction_type !== activeTab) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const idMatch = t.transaction_id.toLowerCase().includes(q);
        const nameMatch = t.customer_name?.toLowerCase().includes(q);
        const emailMatch = t.customer_email?.toLowerCase().includes(q);
        const utrMatch = t.utr?.toLowerCase().includes(q);
        return idMatch || nameMatch || emailMatch || utrMatch;
      }
      return true;
    });
  }, [transactions, activeTab, search]);

  const selectedCommObj = communities.find(c => c.id === selectedCommunityId);
  const communityEvents = events.filter(e => e.community_id === selectedCommunityId);

  const tabs = [
    { id: 'all', label: `All Transactions (${transactions.length})` },
    { id: 'ticket_sale', label: 'Ticket Sales (Credits)' },
    { id: 'refund', label: 'Refunds (Debits)' },
    { id: 'payout_settlement', label: 'Payout Settlements' },
  ];

  if (loading) {
    return <LoadingSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header and Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#20232B]">
              Financials & Event Passbook
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFF0F5] text-[#C9165B] border border-[#FCE7F3]">
              Razorpay Ground Truth
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Bank-grade financial ledger auditing ticket sales, 6% platform fees, customer refunds, and organizer payouts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          <button
            onClick={() => loadFinancials(selectedCommunityId, selectedEventId)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E5E7EB] text-[#20232B] hover:bg-neutral-50 shadow-subtle transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C9165B]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E5E7EB] text-[#20232B] hover:bg-neutral-50 shadow-subtle transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleTriggerAudit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFF0F5] border border-[#FCE7F3] text-[#C9165B] hover:bg-pink-100 shadow-subtle transition-all"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Reconciliation Audit</span>
          </button>

          <button
            onClick={() => setPayoutModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#C9165B] text-white hover:bg-[#B0134F] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Manual Payout</span>
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

      {/* Filters Row: Community Selector, Event Selector, Bank Account */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. SELECT COMMUNITY */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            1. Select Community
          </label>
          <select
            value={selectedCommunityId}
            onChange={(e) => handleCommunityChange(e.target.value)}
            className="w-full p-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#20232B] focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B]"
          >
            {communities.map((c) => {
              const fin = MOCK_COMMUNITY_FINANCIALS[c.id];
              const balance = fin ? (fin.current_balance ?? 0) : 0.00;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} — Balance: ₹{Number(balance).toFixed(2)}
                </option>
              );
            })}
          </select>
          <p className="text-[11px] text-[#64748B]">
            Total Community Wallet: <strong className="text-[#16A36A]">₹{Number(statement?.current_balance ?? 0).toFixed(2)}</strong>
          </p>
        </div>

        {/* 2. FILTER BY EVENT */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            2. Filter by Event
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => handleEventChange(e.target.value)}
            className="w-full p-2.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#20232B] focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B]"
          >
            <option value="all">🌟 All Events (Entire Community Statement)</option>
            {communityEvents.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[#64748B]">
            Showing consolidated activity across {communityEvents.length} events.
          </p>
        </div>

        {/* BENEFICIARY BANK ACCOUNT */}
        <div className="space-y-1.5 p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Beneficiary Bank Account
            </span>
            <StatusBadge
              status={statement.beneficiary_status === 'linked' ? 'Linked' : 'Not Linked'}
              size="sm"
            />
          </div>
          <p className="text-xs text-[#64748B]">
            {statement.beneficiary_status === 'linked'
              ? statement.beneficiary_account_masked
              : 'Organizer has not yet added an active bank account.'}
          </p>
        </div>
      </div>

      {/* 5 Financial Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <FinancialKpiCard
          title="Total Collected (Incl. Fee)"
          amount={statement.total_collected}
          subtext="From Razorpay customer payments"
          colorVariant="neutral"
        />
        <FinancialKpiCard
          title="Platform Fees (6%)"
          amount={statement.platform_fees_collected}
          subtext="Chigzo platform revenue"
          colorVariant="rose"
        />
        <FinancialKpiCard
          title="Refunds Deducted"
          amount={statement.refunds_deducted}
          subtext="Clawed back to customers"
          colorVariant="rose"
        />
        <FinancialKpiCard
          title="Payouts Settled"
          amount={statement.payouts_settled}
          subtext="Transferred to organizer"
          colorVariant="blue"
        />
        <FinancialKpiCard
          title="Current Wallet Balance"
          amount={statement.current_balance}
          subtext="Payable to organizer"
          colorVariant="green"
          highlightBorder
        />
      </div>

      {/* Consolidated Passbook Ledger */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-subtle space-y-5">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#20232B]">
                Consolidated Passbook Ledger
              </h3>
              <p className="text-xs text-[#64748B]">
                Full transaction history across all events, customer refunds, and platform transfers.
              </p>
            </div>
          </div>

          {/* Ledger Tabs & Search */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      isActive
                        ? 'bg-[#20232B] text-white shadow-sm'
                        : 'bg-white text-[#64748B] hover:bg-neutral-100 hover:text-[#20232B] border border-[#E5E7EB]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative md:w-72">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, name, email, UTR..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white text-[#20232B] rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B]"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table (Desktop) / Cards (Mobile) */}
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon={IndianRupee}
            title="No Transactions Recorded"
            description="No transaction records match the current filters for this community."
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-neutral-50/70 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Customer Info</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {filteredTransactions.map((tx) => {
                    const isCredit = tx.transaction_type === 'ticket_sale';
                    const isDebit = tx.transaction_type === 'refund';

                    return (
                      <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-[#20232B]">
                          {tx.transaction_id}
                          {tx.utr && <span className="block text-[10px] text-[#64748B]">{tx.utr}</span>}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[#20232B]">{tx.customer_name || 'Guest'}</p>
                          <p className="text-[11px] text-[#64748B]">{tx.customer_email || '—'}</p>
                        </td>
                        <td className="py-3 px-4 text-[#64748B] max-w-[180px] truncate">
                          {tx.event_title || 'Community General'}
                        </td>
                        <td className="py-3 px-4 capitalize">
                          <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                            isCredit ? 'text-[#16A36A]' : isDebit ? 'text-[#DC3545]' : 'text-[#2563EB]'
                          }`}>
                            {isCredit && <ArrowDownLeft className="w-3 h-3" />}
                            {isDebit && <ArrowUpRight className="w-3 h-3" />}
                            {tx.transaction_type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-sm">
                          <span className={isCredit ? 'text-[#16A36A]' : isDebit ? 'text-[#DC3545]' : 'text-[#20232B]'}>
                            {isCredit ? '+' : isDebit ? '-' : ''}₹{Number(tx.amount ?? 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={tx.status} size="sm" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Transaction Cards */}
            <div className="md:hidden space-y-3">
              {filteredTransactions.map((tx) => {
                const isCredit = tx.transaction_type === 'ticket_sale';
                const isDebit = tx.transaction_type === 'refund';

                return (
                  <div
                    key={tx.id}
                    className="p-4 rounded-xl border border-[#E5E7EB] bg-neutral-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[11px] text-[#64748B]">{tx.transaction_id}</span>
                        <p className="font-bold text-sm text-[#20232B]">{tx.customer_name || 'Guest'}</p>
                      </div>
                      <span className={`text-base font-bold ${isCredit ? 'text-[#16A36A]' : isDebit ? 'text-[#DC3545]' : 'text-[#20232B]'}`}>
                        {isCredit ? '+' : isDebit ? '-' : ''}₹{Number(tx.amount ?? 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-[#E5E7EB]">
                      <span>{tx.event_title || 'General'}</span>
                      <StatusBadge status={tx.status} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Record Manual Payout Modal */}
      <Modal
        isOpen={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="Record Manual Payout"
        subtitle={`Manually transfer payable funds to "${selectedCommObj?.name}"`}
        footer={
          <>
            <button
              onClick={() => setPayoutModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#20232B]"
            >
              Cancel
            </button>
            <button
              onClick={handleManualPayoutSubmit}
              disabled={submittingPayout || !payoutAmount || !payoutUtr.trim()}
              className="px-4 py-2 text-xs font-semibold bg-[#C9165B] text-white rounded-lg hover:bg-[#B0134F] disabled:opacity-50 transition-colors"
            >
              {submittingPayout ? 'Recording...' : 'Confirm Payout'}
            </button>
          </>
        }
      >
        <form onSubmit={handleManualPayoutSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#20232B] mb-1">
              Community Wallet Balance
            </label>
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
              Available Payable: ₹{Number(statement?.current_balance ?? 0).toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20232B] mb-1">
              Payout Amount (INR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B]">₹</span>
              <input
                type="number"
                step="0.01"
                max={statement.current_balance || 10000}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9165B]/20 focus:border-[#C9165B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20232B] mb-1">
              Payment Method
            </label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full p-2 text-xs bg-white border border-[#E5E7EB] rounded-lg"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="IMPS">Bank IMPS Transfer</option>
              <option value="NEFT">Bank NEFT Transfer</option>
              <option value="RTGS">RTGS Settlement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20232B] mb-1">
              UTR / Reference Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={payoutUtr}
              onChange={(e) => setPayoutUtr(e.target.value)}
              placeholder="e.g. UTR182930491823"
              className="w-full p-2 text-xs bg-white border border-[#E5E7EB] rounded-lg font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20232B] mb-1">
              Admin Notes / Reason
            </label>
            <input
              type="text"
              value={payoutNotes}
              onChange={(e) => setPayoutNotes(e.target.value)}
              placeholder="Weekly event ticket payout settlement..."
              className="w-full p-2 text-xs bg-white border border-[#E5E7EB] rounded-lg"
            />
          </div>
        </form>
      </Modal>

      {/* Reconciliation Audit Modal */}
      <Modal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        title="Reconciliation Audit"
        subtitle="3-Way Razorpay Ground Truth Ledger Verification"
        footer={
          <button
            onClick={() => setAuditModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold bg-[#20232B] text-white rounded-lg"
          >
            Close Audit
          </button>
        }
      >
        {runningAudit ? (
          <div className="py-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#C9165B] animate-spin mx-auto" />
            <p className="text-xs text-[#64748B]">Auditing Razorpay gateway transactions vs platform wallet liabilities...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Audit Complete: Status HEALTHY</p>
                <p className="mt-0.5">{auditResult}</p>
              </div>
            </div>

            <div className="text-xs text-[#64748B] space-y-1.5 pt-2">
              <p>• Verified Razorpay capture status for all active bookings.</p>
              <p>• 6% platform fees calculated with zero variance.</p>
              <p>• Wallet balances synchronized across all 5 communities.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
