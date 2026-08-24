export type Chain = 'ethereum' | 'solana';

export type HandleStatus = 'active' | 'reserved';

export interface NidHandle {
  id: string;
  name: string;
  status: HandleStatus;
  primary: boolean;
  linkedAddress: string;
  chain: Chain;
  createdAt: string;
  metadata: Record<string, string>;
}

export interface Wallet {
  id: string;
  chain: Chain;
  network: string;
  address: string;
  status: 'verified' | 'pending';
  linkedAt: string;
}

export interface OAuthSession {
  id: string;
  appName: string;
  appIcon: string;
  permissions: string[];
  lastActive: string;
  protocol: 'OAuth 2.0' | 'OIDC';
  status: 'active' | 'expired';
}

export interface AppLogin {
  id: string;
  appName: string;
  handle: string;
  time: string;
  status: 'success' | 'failed';
  protocol: string;
  method: string;
}

export interface Passkey {
  id: string;
  name: string;
  type: 'Platform Passkey (FIDO2)' | 'Security Key' | 'Cross-Platform Passkey';
  registeredAt: string;
  lastUsed: string;
}

export interface ActivityEvent {
  id: string;
  type: 'login' | 'security' | 'wallet' | 'sdk' | 'handle';
  message: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'security';
}

export interface SecurityCheck {
  id: string;
  label: string;
  enabled: boolean;
}

export interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface ApiKey {
  id: string;
  label: string;
  value: string;
  masked: boolean;
}

export interface AuthPoint {
  time: string;
  requests: number;
  success: number;
}

export interface PaymentRoute {
  id: string;
  asset: 'USDC' | 'SOL' | 'ETH' | 'USDT';
  chain: Chain;
  destinationAddress: string;
  isDefault: boolean;
  label: string;
}

export type SocialPlatform = 'Twitter/X' | 'Discord' | 'GitHub' | 'Telegram' | 'Farcaster' | 'Email' | 'Phone' | 'Website';

export interface SocialIdentity {
  id: string;
  platform: SocialPlatform;
  handle: string;
  verified: boolean;
  publiclyVisible: boolean;
}
