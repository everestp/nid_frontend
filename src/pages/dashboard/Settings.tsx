import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Link2,
  Code2,
  Eye,
  RotateCcw,
  LogOut,
  Mail,
  AtSign,
  Save,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

type Tab = 'profile' | 'security' | 'wallets' | 'developer' | 'privacy';

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  { key: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  { key: 'wallets', label: 'Wallets', icon: <Link2 className="w-4 h-4" /> },
  { key: 'developer', label: 'Developer', icon: <Code2 className="w-4 h-4" /> },
  { key: 'privacy', label: 'Privacy', icon: <Eye className="w-4 h-4" /> },
];

export function Settings() {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [name, setName] = useState(user?.name || 'Everest Paudel');

  const resetDemo = () => {
    localStorage.clear();
    showToast('success', 'Demo reset. Redirecting to login...');
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your profile, security, and account preferences." />

      <div className="grid lg:grid-cols-[200px_1fr] gap-6">
        {/* Tab sidebar */}
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                  : 'text-ink-300 hover:text-ink-50 hover:bg-ink-800/50 border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-ink-50 mb-5">Profile</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xl font-semibold text-white">
                    {user?.avatar || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-50">{user?.name}</div>
                    <div className="text-xs text-ink-400">{user?.email}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Email</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5">
                        <Mail className="w-4 h-4 text-ink-400" />
                        <span className="text-sm text-ink-200">{user?.email}</span>
                      </div>
                      <Badge variant="success">Verified</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Primary Handle</label>
                    <div className="flex items-center gap-2 bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5">
                      <AtSign className="w-4 h-4 text-ink-400" />
                      <span className="text-sm text-ink-200 font-mono">everest.nid</span>
                    </div>
                  </div>
                  <Button icon={<Save className="w-4 h-4" />} onClick={() => showToast('success', 'Profile saved.')}>Save Changes</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-ink-50 mb-5">Security</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-ink-800/50 border border-ink-700">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-success-400" />
                      <div>
                        <div className="text-sm font-medium text-ink-50">Two-Factor Authentication</div>
                        <div className="text-xs text-ink-400">Passkey-based, always on</div>
                      </div>
                    </div>
                    <Badge variant="success" dot>Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-ink-800/50 border border-ink-700">
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-ink-400" />
                      <div>
                        <div className="text-sm font-medium text-ink-50">Session Timeout</div>
                        <div className="text-xs text-ink-400">Auto-expire after 24 hours</div>
                      </div>
                    </div>
                    <Badge variant="neutral">24h</Badge>
                  </div>
                  <Button variant="outline" icon={<LogOut className="w-4 h-4" />} onClick={handleLogout}>
                    Sign Out All Devices
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'wallets' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-ink-50 mb-5">Wallet Preferences</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-ink-800/50 border border-ink-700">
                    <div className="text-sm font-medium text-ink-50 mb-1">Default Chain</div>
                    <div className="text-xs text-ink-400">Chain used by default for new app connections</div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="brand">Ethereum</Badge>
                      <Badge variant="neutral">Solana</Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-ink-800/50 border border-ink-700">
                    <div className="text-sm font-medium text-ink-50 mb-1">Auto-link New Wallets</div>
                    <div className="text-xs text-ink-400">Automatically link wallets detected in the browser</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'developer' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-ink-50 mb-5">Developer Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-ink-800/50 border border-ink-700">
                    <div className="text-sm font-medium text-ink-50 mb-1">SDK Version</div>
                    <div className="text-xs text-ink-400 font-mono">v2.4.1 (latest)</div>
                  </div>
                  <div className="p-4 rounded-lg bg-ink-800/50 border border-ink-700">
                    <div className="text-sm font-medium text-ink-50 mb-1">Webhook URL</div>
                    <div className="text-xs text-ink-400">Receive authentication events</div>
                    <input
                      type="text"
                      placeholder="https://yourapp.com/webhooks/nid"
                      className="w-full mt-3 bg-ink-900/50 border border-ink-700 rounded-lg px-3 py-2 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 transition-colors font-mono"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-ink-50 mb-5">Privacy Preferences</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-ink-800/50 border border-ink-700">
                    <div className="text-sm font-medium text-ink-50 mb-1">Data Retention</div>
                    <div className="text-xs text-ink-400">How long authentication logs are stored</div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="brand">90 days</Badge>
                      <Badge variant="neutral">30 days</Badge>
                      <Badge variant="neutral">7 days</Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-ink-800/50 border border-ink-700">
                    <div className="text-sm font-medium text-ink-50 mb-1">Profile Visibility</div>
                    <div className="text-xs text-ink-400">Who can see your .nid profile</div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="brand">Private</Badge>
                      <Badge variant="neutral">Friends</Badge>
                      <Badge variant="neutral">Public</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Danger zone */}
          <Card className="p-6 mt-6 border-danger-500/20" delay={0.1}>
            <h2 className="text-lg font-semibold text-danger-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-ink-300 mb-4">Reset the demo environment to its default state. This clears all local data.</p>
            <div className="flex items-center gap-3">
              <Button variant="danger" icon={<RotateCcw className="w-4 h-4" />} onClick={resetDemo}>
                Reset Demo
              </Button>
              <Button variant="outline" icon={<LogOut className="w-4 h-4" />} onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
