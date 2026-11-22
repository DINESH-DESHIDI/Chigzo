export type AlertSeverity = 'all' | 'critical' | 'warning' | 'info';
export type AlertStatus = 'all' | 'open' | 'acknowledged' | 'resolved';

export interface AdminAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  module: string;
  status: 'open' | 'acknowledged' | 'resolved';
  created_at: string;
  metadata?: Record<string, any>;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  location?: string;
  banner_url?: string;
  community_avatar_url?: string;
  avatar_url?: string;
  category?: string;
  city?: string;
  state?: string;
  country?: string;
  tags?: string[];
  rules?: string;
  visibility?: 'public' | 'private';
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  owner_id: string;
  owner_email?: string;
  owner_name?: string;
  member_count: number;
  event_count: number;
  deleted_at?: string | null;
  is_hidden?: boolean;
  verification_status?: string;
  created_at: string;
  deletion_grace_started_at?: string | null;
}

export interface CommunityApplication {
  id: string;
  community_name: string;
  applicant_name?: string;
  applicant_email?: string;
  description?: string;
  category?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  username?: string;
  avatar_url?: string;
  is_admin?: boolean;
  role?: string;
  is_suspended?: boolean;
  status?: 'active' | 'scheduled' | 'suspended' | 'deleted';
  deleted_at?: string | null;
  deletion_grace_started_at?: string | null;
  created_at: string;
  phone?: string;
  bio?: string;
  communities_count?: number;
  events_count?: number;
}

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  banner_url?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  venue_name?: string;
  capacity: number;
  booked_count: number;
  price: number;
  currency?: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  community_id: string;
  community_name?: string;
  created_at: string;
  revenue?: number;
  is_featured?: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  ticket_type?: string;
  status: 'confirmed' | 'cancelled' | 'attended';
  registered_at: string;
  amount_paid: number;
}

export interface FinancialObservabilityKPIs {
  stored_wallet_liability: number;
  pending_payout_amount: number;
  disputed_payout_amount: number;
  disputed_payout_count: number;
  uncommitted_payable: number;
  health_status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  total_inflow_unsettled?: number;
}

export interface CommunityFinancials {
  community_id: string;
  community_name: string;
  current_balance: number;
  total_collected: number;
  platform_fees_collected: number;
  refunds_deducted: number;
  payouts_settled: number;
  beneficiary_status: 'linked' | 'not_linked' | 'pending';
  beneficiary_account_masked?: string;
  beneficiary_bank_name?: string;
}

export type TransactionType = 'all' | 'ticket_sale' | 'refund' | 'payout_settlement';

export interface PassbookTransaction {
  id: string;
  transaction_id: string;
  customer_name?: string;
  customer_email?: string;
  event_id?: string;
  event_title?: string;
  community_id?: string;
  community_name?: string;
  transaction_type: 'ticket_sale' | 'refund' | 'payout_settlement';
  amount: number;
  platform_fee?: number;
  net_amount?: number;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'disputed';
  utr?: string;
  payment_method?: string;
  notes?: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  reporter_email?: string;
  target_user_id?: string;
  target_user_name?: string;
  target_type: 'event' | 'community' | 'user' | 'comment';
  target_id: string;
  target_title?: string;
  reason: string;
  details?: string;
  status: 'open' | 'reviewed' | 'dismissed' | 'actioned';
  created_at: string;
}
