import {
  AdminAlert,
  Community,
  CommunityApplication,
  CommunityFinancials,
  ContentReport,
  EventItem,
  FinancialObservabilityKPIs,
  PassbookTransaction,
  UserProfile
} from './types';

export const INITIAL_KPIS: FinancialObservabilityKPIs = {
  stored_wallet_liability: 17.00,
  pending_payout_amount: 0.00,
  disputed_payout_amount: 0.00,
  disputed_payout_count: 0,
  uncommitted_payable: 17.00,
  health_status: 'HEALTHY',
  total_inflow_unsettled: 17.00
};

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'comm-1',
    name: 'Abhinab',
    description: 'Premier endurance running and marathon training collective for athletes.',
    owner_id: 'user-1',
    owner_email: 'kalluriatwork@gmail.com',
    owner_name: 'Abhinav Kalluri',
    member_count: 1,
    event_count: 0,
    created_at: '2026-11-22T10:00:00Z',
    is_hidden: false,
    verification_status: 'verified',
    category: 'Marathon & Running',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India'
  },
  {
    id: 'comm-2',
    name: 'Editrunclub',
    description: 'Weekly city trail running and fitness community in Hyderabad.',
    owner_id: 'user-2',
    owner_email: 'amyash181@gmail.com',
    owner_name: 'Yash Sharma',
    member_count: 6,
    event_count: 0,
    created_at: '2026-11-14T08:30:00Z',
    is_hidden: false,
    verification_status: 'verified',
    category: 'Athletics',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India'
  },
  {
    id: 'comm-3',
    name: 'WanderSphere',
    description: 'Adventure treks, sunrise hikes, and cultural walking tours across Telangana.',
    owner_id: 'user-3',
    owner_email: 'kbunny1401@gmail.com',
    owner_name: 'Bunny K',
    member_count: 5,
    event_count: 2,
    created_at: '2026-11-14T09:15:00Z',
    is_hidden: false,
    verification_status: 'verified',
    category: 'Trekking & Outdoors',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India'
  },
  {
    id: 'comm-4',
    name: 'Vibe Tribe',
    description: 'Music festivals, live dance workshops, and youth community mixers.',
    owner_id: 'user-4',
    owner_email: 'kandalashiva43@gmail.com',
    owner_name: 'Shiva Kandala',
    member_count: 2,
    event_count: 2,
    created_at: '2026-11-14T11:00:00Z',
    is_hidden: false,
    verification_status: 'verified',
    category: 'Arts & Culture',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India'
  },
  {
    id: 'comm-5',
    name: 'Nexora Tech Community',
    description: 'Developer bootcamps, cybersecurity workshops, and cloud conferences.',
    owner_id: 'user-5',
    owner_email: 'shivapraneeth01@gmail.com',
    owner_name: 'Shiva Praneeth',
    member_count: 2,
    event_count: 3,
    created_at: '2026-11-14T14:45:00Z',
    is_hidden: false,
    verification_status: 'verified',
    category: 'Tech & Innovation',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India'
  }
];

export const MOCK_COMMUNITY_APPLICATIONS: CommunityApplication[] = [
  {
    id: 'app-1',
    community_name: 'Deccan Trail Runners',
    applicant_name: 'Vikram Joshi',
    applicant_email: 'vikram.trail@gmail.com',
    category: 'Running & Marathon',
    description: 'Organizing 10k, 21k, and 42k trail runs across the Deccan plateau.',
    status: 'pending',
    created_at: '2026-11-22T14:10:00Z',
    notes: 'Awaiting KYC bank account verification.'
  },
  {
    id: 'app-2',
    community_name: 'Cyberabad Cycling League',
    applicant_name: 'Preeti Deshmukh',
    applicant_email: 'preeti.cycling@gmail.com',
    category: 'Cycling',
    description: 'Weekly morning rides and annual cyclothon for road racers.',
    status: 'pending',
    created_at: '2026-11-21T18:20:00Z',
    notes: 'All documents submitted.'
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    first_name: 'Shiva',
    last_name: 'Kandala',
    email: 'shivakandala43@gmail.com',
    username: 'shivakandala',
    is_admin: true,
    role: 'Admin',
    status: 'active',
    created_at: '2026-11-10T12:00:00Z',
    communities_count: 3,
    events_count: 4
  },
  {
    id: 'user-1',
    first_name: 'Abhinav',
    last_name: 'Kalluri',
    email: 'kalluriatwork@gmail.com',
    username: 'abhinavk',
    is_admin: false,
    role: 'Organizer',
    status: 'active',
    created_at: '2026-11-22T08:00:00Z',
    communities_count: 1,
    events_count: 0
  },
  {
    id: 'user-2',
    first_name: 'Mohammed Sohail',
    last_name: 'Ahmed Khan',
    email: 'mohammedsohailahmedkhan226@gmail.com',
    username: 'sohailkhan',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T16:30:00Z',
    communities_count: 2,
    events_count: 1
  },
  {
    id: 'user-3',
    first_name: 'Sathwik',
    last_name: 'Reddy',
    email: 'sathwikreddy.ssr@gmail.com',
    username: 'sathwikssr',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T15:10:00Z',
    communities_count: 1,
    events_count: 2
  },
  {
    id: 'user-4',
    first_name: 'Srineer',
    last_name: 'Chowdary',
    email: 'gunturichowdary92@gmail.com',
    username: 'srineerch',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T14:40:00Z',
    communities_count: 1,
    events_count: 1
  },
  {
    id: 'user-5',
    first_name: 'G.Sandeep',
    last_name: 'Yadav',
    email: 'g.sandeepyadav85@gmail.com',
    username: 'sandeepyadav',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T13:20:00Z',
    communities_count: 2,
    events_count: 1
  },
  {
    id: 'user-6',
    first_name: 'Abhinash',
    last_name: 'Kamma',
    email: 'kammaabhinash@gmail.com',
    username: 'abhinashk',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T12:00:00Z',
    communities_count: 1,
    events_count: 0
  },
  {
    id: 'user-7',
    first_name: 'Karthik',
    last_name: 'Vardelly',
    email: 'vardelly.karthikgoud@gmail.com',
    username: 'karthikgoud',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T11:15:00Z',
    communities_count: 1,
    events_count: 0
  },
  {
    id: 'user-8',
    first_name: 'J',
    last_name: 'Bhanu',
    email: 'jbhanuprakashreddy10@gmail.com',
    username: 'bhanuprakash',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T10:05:00Z',
    communities_count: 1,
    events_count: 1
  },
  {
    id: 'user-9',
    first_name: 'Jacob',
    last_name: 'Jones',
    email: 'jacob.13085@gmail.com',
    username: 'jacobjones',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T09:40:00Z',
    communities_count: 3,
    events_count: 2
  },
  {
    id: 'user-10',
    first_name: 'Leo',
    last_name: 'Stevens',
    email: 'leostevens.85211@gmail.com',
    username: 'leostevens',
    is_admin: false,
    role: 'Member',
    status: 'active',
    created_at: '2026-11-21T08:20:00Z',
    communities_count: 2,
    events_count: 1
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Beyond the Hills – Ananthagiri Sunrise Trek',
    description: 'Scenic early morning hike through the Ananthagiri hills and pine forests.',
    community_id: 'comm-3',
    community_name: 'WanderSphere',
    start_date: '2026-11-25T05:30:00Z',
    capacity: 3,
    booked_count: 1,
    price: 6.00,
    status: 'published',
    location: 'Vikarabad, Telangana',
    created_at: '2026-11-18T10:00:00Z',
    revenue: 6.00
  },
  {
    id: 'evt-2',
    title: 'chigazo-day-1',
    description: 'Grand opening community sprint and inaugural marathon run meet.',
    community_id: 'comm-5',
    community_name: 'Nexora Tech Community',
    start_date: '2026-11-24T09:00:00Z',
    capacity: 12,
    booked_count: 8,
    price: 1.00,
    status: 'published',
    location: 'Gachibowli Stadium, Hyderabad',
    created_at: '2026-11-17T11:00:00Z',
    revenue: 8.00
  },
  {
    id: 'evt-3',
    title: 'Rhythm & Roots – Dance Workshop and Showcase',
    description: 'Contemporary and urban dance intensive featuring leading choreographers.',
    community_id: 'comm-4',
    community_name: 'Vibe Tribe',
    start_date: '2026-11-20T17:00:00Z',
    capacity: 6,
    booked_count: 1,
    price: 2.00,
    status: 'published',
    location: 'Jubilee Hills Studio, Hyderabad',
    created_at: '2026-11-16T14:00:00Z',
    revenue: 2.00
  },
  {
    id: 'evt-4',
    title: 'CyberX – Cybersecurity Workshop 2026',
    description: 'Hands-on offensive security, zero-trust architecture, and web vulnerability analysis.',
    community_id: 'comm-5',
    community_name: 'Nexora Tech Community',
    start_date: '2026-11-17T10:00:00Z',
    capacity: 1,
    booked_count: 1,
    price: 1.00,
    status: 'published',
    location: 'Hitec City, Hyderabad',
    created_at: '2026-11-15T09:00:00Z',
    revenue: 1.00
  },
  {
    id: 'evt-5',
    title: 'Build & Deploy – Docker and Kubernetes Bootcamp',
    description: 'Container orchestration, CI/CD pipeline automation, and production deployments.',
    community_id: 'comm-5',
    community_name: 'Nexora Tech Community',
    start_date: '2026-11-16T11:00:00Z',
    capacity: 2,
    booked_count: 0,
    price: 5.00,
    status: 'published',
    location: 'Virtual Classroom',
    created_at: '2026-11-14T16:00:00Z',
    revenue: 0.00
  },
  {
    id: 'evt-6',
    title: 'Neon Nights – Music & DJ Festival 2026',
    description: 'Electronic music showcase with local DJs and festival production lights.',
    community_id: 'comm-4',
    community_name: 'Vibe Tribe',
    start_date: '2026-11-15T19:00:00Z',
    capacity: 2,
    booked_count: 1,
    price: 0.00,
    status: 'published',
    location: 'Madhapur Open Arena, Hyderabad',
    created_at: '2026-11-13T12:00:00Z',
    revenue: 0.00
  },
  {
    id: 'evt-7',
    title: 'Hyderabad Uncovered – Heritage & Food Walk',
    description: 'Curated historic monuments and Old City culinary trail.',
    community_id: 'comm-3',
    community_name: 'WanderSphere',
    start_date: '2026-11-15T07:00:00Z',
    capacity: 2,
    booked_count: 2,
    price: 0.00,
    status: 'published',
    location: 'Charminar, Old Hyderabad',
    created_at: '2026-11-12T08:00:00Z',
    revenue: 0.00
  }
];

export const MOCK_COMMUNITY_FINANCIALS: Record<string, CommunityFinancials> = {
  'comm-1': {
    community_id: 'comm-1',
    community_name: 'Abhinab',
    current_balance: 0.00,
    total_collected: 0.00,
    platform_fees_collected: 0.00,
    refunds_deducted: 0.00,
    payouts_settled: 0.00,
    beneficiary_status: 'not_linked'
  },
  'comm-2': {
    community_id: 'comm-2',
    community_name: 'Editrunclub',
    current_balance: 0.00,
    total_collected: 0.00,
    platform_fees_collected: 0.00,
    refunds_deducted: 0.00,
    payouts_settled: 0.00,
    beneficiary_status: 'not_linked'
  },
  'comm-3': {
    community_id: 'comm-3',
    community_name: 'WanderSphere',
    current_balance: 6.00,
    total_collected: 6.38,
    platform_fees_collected: 0.38,
    refunds_deducted: 0.00,
    payouts_settled: 0.00,
    beneficiary_status: 'linked',
    beneficiary_account_masked: 'HDFC Bank •••• 9812',
    beneficiary_bank_name: 'HDFC Bank'
  },
  'comm-4': {
    community_id: 'comm-4',
    community_name: 'Vibe Tribe',
    current_balance: 2.00,
    total_collected: 2.12,
    platform_fees_collected: 0.12,
    refunds_deducted: 0.00,
    payouts_settled: 0.00,
    beneficiary_status: 'linked',
    beneficiary_account_masked: 'ICICI Bank •••• 4421',
    beneficiary_bank_name: 'ICICI Bank'
  },
  'comm-5': {
    community_id: 'comm-5',
    community_name: 'Nexora Tech Community',
    current_balance: 9.00,
    total_collected: 9.54,
    platform_fees_collected: 0.54,
    refunds_deducted: 0.00,
    payouts_settled: 0.00,
    beneficiary_status: 'linked',
    beneficiary_account_masked: 'State Bank of India •••• 1092',
    beneficiary_bank_name: 'State Bank of India'
  }
};

export const MOCK_PASSBOOK_TRANSACTIONS: PassbookTransaction[] = [
  {
    id: 'tx-1',
    transaction_id: 'pay_NzJk89Lkw12',
    customer_name: 'Jacob Jones',
    customer_email: 'jacob.13085@gmail.com',
    event_id: 'evt-1',
    event_title: 'Beyond the Hills – Ananthagiri Sunrise Trek',
    community_id: 'comm-3',
    community_name: 'WanderSphere',
    transaction_type: 'ticket_sale',
    amount: 6.00,
    platform_fee: 0.36,
    net_amount: 5.64,
    date: '2026-11-21T14:22:00Z',
    status: 'completed',
    payment_method: 'UPI (Google Pay)',
    utr: 'UTR4928172910'
  },
  {
    id: 'tx-2',
    transaction_id: 'pay_NzJk89Lkw13',
    customer_name: 'Mohammed Sohail',
    customer_email: 'mohammedsohailahmedkhan226@gmail.com',
    event_id: 'evt-2',
    event_title: 'chigazo-day-1',
    community_id: 'comm-5',
    community_name: 'Nexora Tech Community',
    transaction_type: 'ticket_sale',
    amount: 8.00,
    platform_fee: 0.48,
    net_amount: 7.52,
    date: '2026-11-20T11:15:00Z',
    status: 'completed',
    payment_method: 'Card •••• 8812',
    utr: 'UTR8839201948'
  },
  {
    id: 'tx-3',
    transaction_id: 'pay_NzJk89Lkw14',
    customer_name: 'Leo Stevens',
    customer_email: 'leostevens.85211@gmail.com',
    event_id: 'evt-3',
    event_title: 'Rhythm & Roots – Dance Workshop',
    community_id: 'comm-4',
    community_name: 'Vibe Tribe',
    transaction_type: 'ticket_sale',
    amount: 2.00,
    platform_fee: 0.12,
    net_amount: 1.88,
    date: '2026-11-19T18:40:00Z',
    status: 'completed',
    payment_method: 'UPI (PhonePe)',
    utr: 'UTR1928374650'
  },
  {
    id: 'tx-4',
    transaction_id: 'pay_NzJk89Lkw15',
    customer_name: 'Sathwik Reddy',
    customer_email: 'sathwikreddy.ssr@gmail.com',
    event_id: 'evt-4',
    event_title: 'CyberX – Cybersecurity Workshop',
    community_id: 'comm-5',
    community_name: 'Nexora Tech Community',
    transaction_type: 'ticket_sale',
    amount: 1.00,
    platform_fee: 0.06,
    net_amount: 0.94,
    date: '2026-11-17T09:30:00Z',
    status: 'completed',
    payment_method: 'Netbanking (HDFC)',
    utr: 'UTR7728193847'
  }
];

export const MOCK_ALERTS: AdminAlert[] = [
  {
    id: 'al-1',
    title: 'Payout Bank Verification Pending',
    description: 'Community "Abhinab" requested payout onboarding but bank IFSC verification failed auto-validation.',
    severity: 'warning',
    module: 'Financials / Payouts',
    status: 'open',
    created_at: '2026-11-22T09:15:00Z'
  },
  {
    id: 'al-2',
    title: 'Razorpay Webhook Latency',
    description: 'Settlement reconciliation hook delayed by 180s due to high peak gateway load.',
    severity: 'info',
    module: 'Webhooks / Payments',
    status: 'acknowledged',
    created_at: '2026-11-21T19:40:00Z'
  }
];

export const MOCK_REPORTS: ContentReport[] = [
  {
    id: 'rep-1',
    reporter_id: 'user-3',
    reporter_name: 'Sathwik Reddy',
    reporter_email: 'sathwikreddy.ssr@gmail.com',
    target_user_id: 'user-9',
    target_user_name: 'Jacob Jones',
    target_type: 'comment',
    target_id: 'c-912',
    target_title: 'Comment in Ananthagiri Trek forum',
    reason: 'Commercial spam / Unsolicited marketing links',
    details: 'User repeatedly posted unofficial external merchandise store links in the public event forum.',
    status: 'open',
    created_at: '2026-11-22T08:30:00Z'
  }
];
