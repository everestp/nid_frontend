import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Trash2,
  Check,
  X,
  Twitter,
  Github,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  Send,
  CheckCircle2,
  Eye,
  EyeOff,
  AtSign,
  Shield,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { SOCIAL_IDENTITIES } from '@/data/mockData';
import type { SocialIdentity, SocialPlatform } from '@/types';

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  'Twitter/X': <Twitter className="w-5 h-5" />,
  'Discord': <MessageCircle className="w-5 h-5" />,
  'GitHub': <Github className="w-5 h-5" />,
  'Telegram': <Send className="w-5 h-5" />,
  'Farcaster': <AtSign className="w-5 h-5" />,
  'Email': <Mail className="w-5 h-5" />,
  'Phone': <Phone className="w-5 h-5" />,
  'Website': <Globe className="w-5 h-5" />,
};

const platformColors: Record<SocialPlatform, string> = {
  'Twitter/X': 'bg-brand-500/10 border-brand-500/20 text-brand-400',
  'Discord': 'bg-accent-500/10 border-accent-500/20 text-accent-400',
  'GitHub': 'bg-ink-700 border-ink-600 text-ink-100',
  'Telegram': 'bg-brand-500/10 border-brand-500/20 text-brand-300',
  'Farcaster': 'bg-warning-500/10 border-warning-500/20 text-warning-400',
  'Email': 'bg-success-500/10 border-success-500/20 text-success-400',
  'Phone': 'bg-success-500/10 border-success-500/20 text-success-400',
  'Website': 'bg-ink-700 border-ink-600 text-ink-200',
};

const allPlatforms: SocialPlatform[] = ['Twitter/X', 'Discord', 'GitHub', 'Telegram', 'Farcaster', 'Email', 'Phone', 'Website'];

export function SocialDirectory() {
  const { showToast } = useToast();
  const [identities, setIdentities] = useState<SocialIdentity[]>(SOCIAL_IDENTITIES);
  const [addOpen, setAddOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<SocialIdentity | null>(null);
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('Twitter/X');
  const [newHandle, setNewHandle] = useState('');

  const toggleVisible = (id: string) => {
    setIdentities((prev) => prev.map((s) => {
      if (s.id === id) {
        showToast('success', `${s.platform} is now ${!s.publiclyVisible ? 'publicly visible' : 'app-only'}.`);
        return { ...s, publiclyVisible: !s.publiclyVisible };
      }
      return s;
    }));
  };

  const addIdentity = () => {
    if (!newHandle.trim()) return;
    const identity: SocialIdentity = {
      id: `si${Date.now()}`,
      platform: newPlatform,
      handle: newHandle.trim(),
      verified: false,
      publiclyVisible: true,
    };
    setIdentities((prev) => [...prev, identity]);
    setAddOpen(false);
    setNewHandle('');
    showToast('success', `${newPlatform} key added. Verification pending.`);
  };

  const removeIdentity = () => {
    if (removeTarget) {
      setIdentities((prev) => prev.filter((s) => s.id !== removeTarget.id));
      showToast('success', `${removeTarget.platform} key removed.`);
      setRemoveTarget(null);
    }
  };

  const publicCount = identities.filter((s) => s.publiclyVisible).length;
  const verifiedCount = identities.filter((s) => s.verified).length;

  return (
    <div>
      <PageHeader
        title="Social Directory"
        description="Universal keys — connect your social identities, contact info, and web presence to your .nid handle."
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>
            Add Social Key
          </Button>
        }
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Identity list */}
        <div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Card className="p-4" delay={0}>
              <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">Total Keys</div>
              <div className="text-xl font-semibold text-ink-50">{identities.length}</div>
            </Card>
            <Card className="p-4" delay={0.03}>
              <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">Verified</div>
              <div className="text-xl font-semibold text-success-400">{verifiedCount}</div>
            </Card>
            <Card className="p-4" delay={0.06}>
              <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">Public</div>
              <div className="text-xl font-semibold text-brand-300">{publicCount}</div>
            </Card>
          </div>

          <div className="grid gap-3">
            <AnimatePresence>
              {identities.map((identity, i) => (
                <motion.div
                  key={identity.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="p-4" hover>
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${platformColors[identity.platform]}`}>
                        {platformIcons[identity.platform]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-ink-50">{identity.platform}</span>
                          {identity.verified ? (
                            <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Verified</Badge>
                          ) : (
                            <Badge variant="warning">Unverified</Badge>
                          )}
                        </div>
                        <div className="text-sm font-mono text-ink-300 mt-0.5 truncate">{identity.handle}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {identity.publiclyVisible ? (
                            <span className="flex items-center gap-1 text-xs text-ink-300"><Eye className="w-3.5 h-3.5" /> Public</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-ink-400"><EyeOff className="w-3.5 h-3.5" /> Private</span>
                          )}
                          <Toggle checked={identity.publiclyVisible} onChange={() => toggleVisible(identity.id)} label="Public visibility" />
                        </div>
                        <button
                          onClick={() => setRemoveTarget(identity)}
                          className="p-1.5 rounded-md text-ink-400 hover:text-danger-400 hover:bg-ink-700 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Shareable profile card preview */}
        <div>
          <Card className="p-5 sticky top-6" delay={0.1}>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-brand-400" />
              <h2 className="text-sm font-semibold text-ink-50">Shareable Profile Card</h2>
            </div>
            <p className="text-xs text-ink-400 mb-4">How third-party apps see your identity metadata</p>

            <div className="rounded-xl border border-ink-700 bg-ink-900/50 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-ink-700 bg-gradient-to-br from-brand-500/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-semibold text-white">
                    EP
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink-50">Everest Paudel</div>
                    <div className="text-xs font-mono text-brand-300">everest.nid</div>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="text-xs text-ink-400 uppercase tracking-wider mb-2">Connected Keys</div>
                {identities.filter((s) => s.publiclyVisible).map((identity) => (
                  <div key={identity.id} className="flex items-center gap-2.5 py-1.5">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${platformColors[identity.platform]}`}>
                      {platformIcons[identity.platform] && (
                        <span className="[&>svg]:w-3.5 [&>svg]:h-3.5">{platformIcons[identity.platform]}</span>
                      )}
                    </div>
                    <span className="text-xs text-ink-200 flex-1 truncate font-mono">{identity.handle}</span>
                    {identity.verified && <CheckCircle2 className="w-3.5 h-3.5 text-success-400 shrink-0" />}
                  </div>
                ))}
                {identities.filter((s) => s.publiclyVisible).length === 0 && (
                  <div className="text-xs text-ink-500 py-2">No public keys visible</div>
                )}
              </div>
              {/* Footer */}
              <div className="px-4 py-3 border-t border-ink-700 flex items-center gap-2">
                <Shield className="w-3 h-3 text-ink-400" />
                <span className="text-xs text-ink-400">Verified via NID.xyz</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add social key modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink-50">Add Social Key</h2>
              <p className="text-sm text-ink-300">Connect a social identity to your .nid handle</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Platform</label>
              <div className="grid grid-cols-4 gap-2">
                {allPlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setNewPlatform(platform)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg border transition-colors ${
                      newPlatform === platform ? platformColors[platform] : 'bg-ink-800/50 border-ink-700 text-ink-400 hover:text-ink-50'
                    }`}
                  >
                    {platformIcons[platform]}
                    <span className="text-[10px] font-medium">{platform}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Handle / Value</label>
              <input
                type="text"
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIdentity()}
                placeholder="@username or email@example.com"
                className="w-full bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 transition-colors font-mono"
              />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-ink-800/50 border border-ink-700">
              <Shield className="w-4 h-4 text-ink-400 shrink-0" />
              <span className="text-xs text-ink-300">A verification challenge will be sent to confirm ownership.</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button className="flex-1" icon={<Check className="w-4 h-4" />} onClick={addIdentity}>Add Key</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Remove modal */}
      <Modal open={!!removeTarget} onClose={() => setRemoveTarget(null)}>
        {removeTarget && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
                <X className="w-5 h-5 text-danger-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink-50">Remove Social Key</h2>
                <p className="text-sm text-ink-300">Disconnect <span className="text-ink-100">{removeTarget.platform}</span> ({removeTarget.handle})</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-5">
              <span className="text-xs text-ink-300">Apps using this key for verification will lose access. This cannot be undone.</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setRemoveTarget(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={removeIdentity}>Remove Key</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
