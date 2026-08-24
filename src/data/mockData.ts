import type {
  NidHandle,
  Wallet,
  OAuthSession,
  AppLogin,
  Passkey,
  ActivityEvent,
  Notification,
  SecurityCheck,
  PrivacySetting,
  ApiKey,
  AuthPoint,
  PaymentRoute,
  SocialIdentity,
} from '@/types';

export const DEMO_USER = {
  name: 'Everest Paudel',
  email: 'demo@nid.xyz',
  avatar: 'EP',
};

export const DEMO_CREDENTIALS = {
  email: 'demo@nid.xyz',
  password: 'nid-demo-2026',
};

export const HANDLES: NidHandle[] = [
  {
    id: 'h1',
    name: 'everest.nid',
    status: 'active',
    primary: true,
    linkedAddress: '0x71C2...3291',
    chain: 'ethereum',
    createdAt: 'Jan 04, 2026',
    metadata: { 'Display Name': 'Everest Paudel', Bio: 'Building identity infra', Avatar: 'EP' },
  },
  {
    id: 'h2',
    name: 'alex.nid',
    status: 'active',
    primary: false,
    linkedAddress: '5Kx8Q...9pQ2',
    chain: 'solana',
    createdAt: 'Feb 18, 2026',
    metadata: { 'Display Name': 'Alex', Bio: 'Side identity', Avatar: 'AX' },
  },
  {
    id: 'h3',
    name: 'dev.nid',
    status: 'reserved',
    primary: false,
    linkedAddress: '—',
    chain: 'ethereum',
    createdAt: 'Mar 02, 2026',
    metadata: { 'Display Name': 'Dev', Bio: 'Reserved for testing', Avatar: 'DV' },
  },
];

export const WALLETS: Wallet[] = [
  {
    id: 'w1',
    chain: 'ethereum',
    network: 'Ethereum Mainnet',
    address: '0x71C2...3291',
    status: 'verified',
    linkedAt: '3 days ago',
  },
  {
    id: 'w2',
    chain: 'solana',
    network: 'Solana Devnet',
    address: '5Kx8Q...9pQ2',
    status: 'verified',
    linkedAt: '5 days ago',
  },
];

export const OAUTH_SESSIONS: OAuthSession[] = [
  {
    id: 's1',
    appName: 'MetaCraft Gaming',
    appIcon: 'M',
    permissions: ['Handle', 'Ethereum Address'],
    lastActive: '2 mins ago',
    protocol: 'OAuth 2.0',
    status: 'active',
  },
  {
    id: 's2',
    appName: 'Aether DEX',
    appIcon: 'A',
    permissions: ['Handle', 'Solana Address', 'Profile Email'],
    lastActive: '14 mins ago',
    protocol: 'OIDC',
    status: 'active',
  },
  {
    id: 's3',
    appName: 'Nova Social',
    appIcon: 'N',
    permissions: ['Handle'],
    lastActive: '1 hour ago',
    protocol: 'OAuth 2.0',
    status: 'active',
  },
  {
    id: 's4',
    appName: 'CyberDeck Studio',
    appIcon: 'C',
    permissions: ['Handle', 'Ethereum Address', 'Solana Address'],
    lastActive: '3 hours ago',
    protocol: 'OIDC',
    status: 'active',
  },
  {
    id: 's5',
    appName: 'Orbit Finance',
    appIcon: 'O',
    permissions: ['Handle', 'Profile Email'],
    lastActive: '2 days ago',
    protocol: 'OAuth 2.0',
    status: 'expired',
  },
];

export const RECENT_LOGINS: AppLogin[] = [
  { id: 'l1', appName: 'MetaCraft Gaming', handle: 'everest.nid', time: '2 mins ago', status: 'success', protocol: 'OAuth/OIDC', method: 'Passkey' },
  { id: 'l2', appName: 'Aether DEX', handle: 'everest.nid', time: '14 mins ago', status: 'success', protocol: 'OAuth/OIDC', method: 'Signature' },
  { id: 'l3', appName: 'Nova Social', handle: 'everest.nid', time: '1 hour ago', status: 'success', protocol: 'OAuth/OIDC', method: 'Passkey' },
  { id: 'l4', appName: 'CyberDeck Studio', handle: 'everest.nid', time: '3 hours ago', status: 'success', protocol: 'OAuth/OIDC', method: 'Signature' },
  { id: 'l5', appName: 'Orbit Finance', handle: 'everest.nid', time: '2 days ago', status: 'success', protocol: 'OAuth/OIDC', method: 'Passkey' },
];

export const PASSKEYS: Passkey[] = [
  { id: 'p1', name: 'MacBook Pro TouchID', type: 'Platform Passkey (FIDO2)', registeredAt: 'Jan 12, 2026', lastUsed: '2 mins ago' },
  { id: 'p2', name: 'YubiKey 5Ci', type: 'Security Key', registeredAt: 'Feb 04, 2026', lastUsed: '14 mins ago' },
  { id: 'p3', name: 'iPhone FaceID', type: 'Cross-Platform Passkey', registeredAt: 'Mar 15, 2026', lastUsed: '1 hour ago' },
];

export const ACTIVITY_EVENTS: ActivityEvent[] = [
  { id: 'a1', type: 'login', message: 'Handle everest.nid authenticated with MetaCraft Gaming', timestamp: '2 mins ago' },
  { id: 'a2', type: 'wallet', message: 'New Solana wallet linked to profile', timestamp: '5 days ago' },
  { id: 'a3', type: 'security', message: 'Passkey signature verified successfully', timestamp: '2 mins ago' },
  { id: 'a4', type: 'sdk', message: 'SDK integration initialized by CyberDeck Studio', timestamp: '3 hours ago' },
  { id: 'a5', type: 'handle', message: 'Handle dev.nid reserved', timestamp: 'Mar 02, 2026' },
  { id: 'a6', type: 'login', message: 'Handle everest.nid authenticated with Aether DEX', timestamp: '14 mins ago' },
  { id: 'a7', type: 'security', message: 'Session expiry policy enforced on Orbit Finance', timestamp: '2 days ago' },
  { id: 'a8', type: 'wallet', message: 'Ethereum wallet verified and linked', timestamp: '3 days ago' },
  { id: 'a9', type: 'sdk', message: 'API key regenerated for nid_demo_client_123', timestamp: '1 week ago' },
  { id: 'a10', type: 'login', message: 'Handle everest.nid authenticated with Nova Social', timestamp: '1 hour ago' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New app connected', message: 'MetaCraft Gaming now has access to your handle and Ethereum address.', time: '2 mins ago', read: false, type: 'info' },
  { id: 'n2', title: 'Security check completed', message: 'All security checks passed. Your identity score is 99/100.', time: '1 hour ago', read: false, type: 'success' },
  { id: 'n3', title: 'Passkey added', message: 'iPhone FaceID passkey was registered to your account.', time: '5 days ago', read: false, type: 'security' },
  { id: 'n4', title: 'Session expired', message: 'Orbit Finance session expired after inactivity.', time: '2 days ago', read: true, type: 'warning' },
];

export const SECURITY_CHECKS: SecurityCheck[] = [
  { id: 'sc1', label: 'Passkey enabled', enabled: true },
  { id: 'sc2', label: 'Multi-chain isolation', enabled: true },
  { id: 'sc3', label: 'Session expiry policies', enabled: true },
  { id: 'sc4', label: 'Replay protection', enabled: true },
  { id: 'sc5', label: 'Hardware key backup', enabled: false },
];

export const PRIVACY_SETTINGS: PrivacySetting[] = [
  { id: 'pr1', label: 'Auto-hide email from untrusted dApps', description: 'Your email is only shared with applications you explicitly trust.', enabled: true },
  { id: 'pr2', label: 'Rotate wallet address visibility per application', description: 'Generate per-app address aliases to prevent cross-app tracking.', enabled: true },
  { id: 'pr3', label: 'Require biometric confirmation for spending/signing actions', description: 'Every transaction requires an additional passkey challenge.', enabled: true },
  { id: 'pr4', label: 'Share verifiable credentials automatically', description: 'Automatically present verified credentials during authentication.', enabled: false },
];

export const API_KEYS: ApiKey[] = [
  { id: 'k1', label: 'Publishable Client ID', value: 'nid_pk_live_9824a7f3c1d9b6e0', masked: false },
  { id: 'k2', label: 'Secret API Key', value: 'nid_sk_live_4f8c2a1e9d7b3f6a8c0e', masked: true },
];

export const AUTH_CHART_24H: AuthPoint[] = [
  { time: '00:00', requests: 12, success: 12 },
  { time: '02:00', requests: 8, success: 8 },
  { time: '04:00', requests: 5, success: 5 },
  { time: '06:00', requests: 14, success: 14 },
  { time: '08:00', requests: 32, success: 31 },
  { time: '10:00', requests: 48, success: 47 },
  { time: '12:00', requests: 56, success: 55 },
  { time: '14:00', requests: 42, success: 42 },
  { time: '16:00', requests: 38, success: 37 },
  { time: '18:00', requests: 51, success: 51 },
  { time: '20:00', requests: 29, success: 28 },
  { time: '22:00', requests: 18, success: 18 },
];

export const AUTH_CHART_7D: AuthPoint[] = [
  { time: 'Mon', requests: 142, success: 140 },
  { time: 'Tue', requests: 188, success: 187 },
  { time: 'Wed', requests: 165, success: 164 },
  { time: 'Thu', requests: 210, success: 209 },
  { time: 'Fri', requests: 245, success: 244 },
  { time: 'Sat', requests: 132, success: 131 },
  { time: 'Sun', requests: 98, success: 98 },
];

export const AUTH_CHART_30D: AuthPoint[] = [
  { time: 'W1', requests: 890, success: 886 },
  { time: 'W2', requests: 1024, success: 1021 },
  { time: 'W3', requests: 1156, success: 1153 },
  { time: 'W4', requests: 1340, success: 1338 },
];

export const AUTH_CHART_90D: AuthPoint[] = [
  { time: 'M1', requests: 3210, success: 3198 },
  { time: 'M2', requests: 3890, success: 3875 },
  { time: 'M3', requests: 4482, success: 4471 },
];

export const APP_DISTRIBUTION = [
  { name: 'MetaCraft', value: 412 },
  { name: 'Aether DEX', value: 328 },
  { name: 'Nova Social', value: 245 },
  { name: 'CyberDeck', value: 198 },
  { name: 'Orbit', value: 142 },
  { name: 'Other', value: 167 },
];

export const CHAIN_BREAKDOWN = [
  { name: 'Solana', value: 642, color: '#ac4cf5' },
  { name: 'Ethereum', value: 840, color: '#6366f1' },
];

export const ANALYTICS_LOGIN_TREND = AUTH_CHART_30D;

export const PAYMENT_ROUTES: PaymentRoute[] = [
  { id: 'pr1', asset: 'USDC', chain: 'solana', destinationAddress: '5Kx8Q...9pQ2', isDefault: true, label: 'Primary Solana Wallet' },
  { id: 'pr2', asset: 'ETH', chain: 'ethereum', destinationAddress: '0x71C2...3291', isDefault: true, label: 'Main Vault' },
  { id: 'pr3', asset: 'USDT', chain: 'ethereum', destinationAddress: '0x71C2...3291', isDefault: false, label: 'Stablecoin Vault' },
];

export const SOCIAL_IDENTITIES: SocialIdentity[] = [
  { id: 'si1', platform: 'Twitter/X', handle: '@everest', verified: true, publiclyVisible: true },
  { id: 'si2', platform: 'GitHub', handle: 'everestpaudel', verified: true, publiclyVisible: true },
  { id: 'si3', platform: 'Email', handle: 'demo@nid.xyz', verified: true, publiclyVisible: false },
  { id: 'si4', platform: 'Telegram', handle: '@everest_nid', verified: false, publiclyVisible: false },
];
