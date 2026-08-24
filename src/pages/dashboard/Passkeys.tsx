import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fingerprint,
  Plus,
  Trash2,
  Shield,
  Check,
  X,
  Loader2,
  KeyRound,
  Smartphone,
  Usb,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { PASSKEYS } from '@/data/mockData';
import type { Passkey } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  'Platform Passkey (FIDO2)': <Fingerprint className="w-5 h-5" />,
  'Security Key': <Usb className="w-5 h-5" />,
  'Cross-Platform Passkey': <Smartphone className="w-5 h-5" />,
};

export function Passkeys() {
  const { showToast } = useToast();
  const [passkeys, setPasskeys] = useState<Passkey[]>(PASSKEYS);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [regStep, setRegStep] = useState(0);
  const [revokeTarget, setRevokeTarget] = useState<Passkey | null>(null);

  const startRegister = () => {
    setRegisterOpen(true);
    setRegStep(0);
    setTimeout(() => setRegStep(1), 2000);
    setTimeout(() => setRegStep(2), 4000);
  };

  const completeRegister = () => {
    const newPasskey: Passkey = {
      id: `p${Date.now()}`,
      name: 'New Passkey',
      type: 'Platform Passkey (FIDO2)',
      registeredAt: 'Just now',
      lastUsed: 'Just now',
    };
    setPasskeys((prev) => [...prev, newPasskey]);
    setRegisterOpen(false);
    showToast('success', 'New passkey registered successfully.');
  };

  const confirmRevoke = () => {
    if (revokeTarget) {
      setPasskeys((prev) => prev.filter((p) => p.id !== revokeTarget.id));
      showToast('success', `${revokeTarget.name} credential revoked.`);
      setRevokeTarget(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Passkeys & Verifiable Credentials"
        description="Manage your passwordless authentication methods and cryptographic credentials."
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={startRegister}>
            Register New Passkey
          </Button>
        }
      />

      <div className="grid gap-4">
        <AnimatePresence>
          {passkeys.map((passkey, i) => (
            <motion.div
              key={passkey.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              layout
            >
              <Card className="p-5" hover>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 shrink-0">
                      {typeIcons[passkey.type] || <KeyRound className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-ink-50">{passkey.name}</span>
                        <Badge variant="success" dot>Active</Badge>
                      </div>
                      <div className="text-xs text-ink-400 mt-1 flex items-center gap-3">
                        <span>Type: <span className="text-ink-300">{passkey.type}</span></span>
                      </div>
                      <div className="text-xs text-ink-400 mt-0.5 flex items-center gap-3">
                        <span>Registered: {passkey.registeredAt}</span>
                        <span>·</span>
                        <span>Last used: {passkey.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => setRevokeTarget(passkey)}>
                      Revoke
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Card className="p-5 mt-6" delay={0.2}>
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-success-400 shrink-0" />
          <div>
            <div className="text-sm font-medium text-ink-50">FIDO2 / WebAuthn</div>
            <div className="text-xs text-ink-400 mt-0.5">All passkeys use the FIDO2 standard. NID never stores private keys — authentication is challenge-based.</div>
          </div>
        </div>
      </Card>

      {/* Register modal */}
      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)} closeOnBackdrop={regStep < 1}>
        <div className="p-6">
          {regStep === 0 && (
            <div className="text-center py-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-accent-500/10 border border-accent-500/30 flex items-center justify-center mx-auto mb-5"
              >
                <Fingerprint className="w-8 h-8 text-accent-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-ink-50 mb-2">Creating Passkey</h2>
              <p className="text-sm text-ink-300">Waiting for biometric confirmation...</p>
            </div>
          )}
          {regStep === 1 && (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-2 border-brand-500/20 border-t-brand-400 mx-auto mb-5"
              />
              <h2 className="text-lg font-semibold text-ink-50 mb-2">Generating Key Pair</h2>
              <p className="text-sm text-ink-300">Creating cryptographic credentials...</p>
            </div>
          )}
          {regStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto mb-5"
              >
                <Check className="w-8 h-8 text-success-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-ink-50 mb-2">Passkey Registered</h2>
              <p className="text-sm text-ink-300 mb-5">Your new passkey is ready to use</p>
              <Button className="mx-auto" icon={<Check className="w-4 h-4" />} onClick={completeRegister}>Done</Button>
            </motion.div>
          )}
        </div>
      </Modal>

      {/* Revoke modal */}
      <Modal open={!!revokeTarget} onClose={() => setRevokeTarget(null)}>
        {revokeTarget && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
                <X className="w-5 h-5 text-danger-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink-50">Revoke Credential</h2>
                <p className="text-sm text-ink-300">Remove <span className="text-ink-100">{revokeTarget.name}</span> from your account</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-5">
              <Shield className="w-4 h-4 text-danger-400 shrink-0" />
              <span className="text-xs text-ink-300">You will no longer be able to authenticate with this passkey. This cannot be undone.</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setRevokeTarget(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={confirmRevoke}>Revoke Credential</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
