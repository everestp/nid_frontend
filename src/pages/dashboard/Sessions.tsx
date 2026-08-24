import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, X, Shield, Clock } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { OAUTH_SESSIONS } from '@/data/mockData';
import type { OAuthSession } from '@/types';

export function Sessions() {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<OAuthSession[]>(OAUTH_SESSIONS);
  const [revokeTarget, setRevokeTarget] = useState<OAuthSession | null>(null);

  const revoke = () => {
    if (revokeTarget) {
      setSessions((prev) => prev.filter((s) => s.id !== revokeTarget.id));
      showToast('success', `Access revoked for ${revokeTarget.appName}.`);
      setRevokeTarget(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Authorized Applications"
        description="Manage apps that have access to your NID identity via OAuth/OIDC."
      />

      <div className="grid gap-4">
        <AnimatePresence>
          {sessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              layout
            >
              <Card className="p-5" hover>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center text-lg font-semibold text-ink-200 shrink-0">
                      {session.appIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-ink-50">{session.appName}</span>
                        <Badge variant={session.status === 'active' ? 'success' : 'neutral'} dot={session.status === 'active'}>
                          {session.status === 'active' ? 'Active' : 'Expired'}
                        </Badge>
                        <Badge variant="brand">{session.protocol}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {session.permissions.map((perm) => (
                          <span key={perm} className="text-xs px-2 py-0.5 rounded-md bg-ink-800 border border-ink-700 text-ink-300">
                            {perm}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-ink-400 mt-1.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Last active {session.lastActive}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<X className="w-3.5 h-3.5" />}
                      onClick={() => setRevokeTarget(session)}
                    >
                      Revoke Access
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sessions.length === 0 && (
        <Card className="p-12 text-center">
          <KeyRound className="w-10 h-10 text-ink-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-ink-200">No active sessions</h3>
          <p className="text-sm text-ink-400 mt-1">All app access has been revoked.</p>
        </Card>
      )}

      {/* Revoke modal */}
      <Modal open={!!revokeTarget} onClose={() => setRevokeTarget(null)}>
        {revokeTarget && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-danger-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink-50">Revoke Access</h2>
                <p className="text-sm text-ink-300">Remove <span className="text-ink-100">{revokeTarget.appName}</span>'s access to your identity</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-ink-800/50 border border-ink-700 mb-5">
              <div className="text-xs text-ink-400 uppercase tracking-wider mb-2">Permissions being revoked</div>
              <div className="flex items-center gap-2 flex-wrap">
                {revokeTarget.permissions.map((perm) => (
                  <span key={perm} className="text-xs px-2 py-1 rounded-md bg-ink-700 text-ink-200">{perm}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setRevokeTarget(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={revoke}>Revoke Access</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
