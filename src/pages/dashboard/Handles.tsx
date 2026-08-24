import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AtSign,
  Plus,
  Star,
  Edit3,
  ArrowRightLeft,
  Check,
  X,
  Shield,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { HANDLES } from '@/data/mockData';
import type { NidHandle } from '@/types';

export function Handles() {
  const { showToast } = useToast();
  const [handles, setHandles] = useState<NidHandle[]>(HANDLES);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [newHandle, setNewHandle] = useState('');
  const [transferTarget, setTransferTarget] = useState<NidHandle | null>(null);

  const setPrimary = (id: string) => {
    setHandles((prev) => prev.map((h) => ({ ...h, primary: h.id === id })));
    showToast('success', 'Primary handle updated successfully.');
  };

  const registerHandle = () => {
    if (!newHandle.trim()) return;
    const name = newHandle.trim().endsWith('.nid') ? newHandle.trim() : `${newHandle.trim()}.nid`;
    const handle: NidHandle = {
      id: `h${Date.now()}`,
      name,
      status: 'active',
      primary: false,
      linkedAddress: '0x0000...0000',
      chain: 'ethereum',
      createdAt: 'Just now',
      metadata: { 'Display Name': name, Bio: '', Avatar: name[0].toUpperCase() },
    };
    setHandles((prev) => [...prev, handle]);
    setNewHandle('');
    setRegisterOpen(false);
    showToast('success', `Handle ${name} registered successfully.`);
  };

  return (
    <div>
      <PageHeader
        title="Handles (.nid)"
        description="Your human-readable Web3 identity. Claim, manage, and transfer .nid handles."
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setRegisterOpen(true)}>
            Register New .nid Handle
          </Button>
        }
      />

      <div className="grid gap-4">
        {handles.map((handle, i) => (
          <motion.div
            key={handle.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5" hover>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Handle identity */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-lg font-semibold text-brand-300 shrink-0">
                    {handle.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-ink-50 font-mono">{handle.name}</span>
                      {handle.primary && <Badge variant="brand" dot>Primary</Badge>}
                      <Badge variant={handle.status === 'active' ? 'success' : 'warning'}>
                        {handle.status === 'active' ? 'Active' : 'Reserved'}
                      </Badge>
                    </div>
                    <div className="text-xs text-ink-400 mt-1 flex items-center gap-3">
                      <span>Linked: <span className="font-mono text-ink-300">{handle.linkedAddress}</span></span>
                      <span>·</span>
                      <span>Created {handle.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="hidden md:flex items-center gap-4 text-xs text-ink-400">
                  {Object.entries(handle.metadata).slice(0, 2).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <div className="text-ink-500 uppercase tracking-wider text-[10px]">{key}</div>
                      <div className="text-ink-200 mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<Edit3 className="w-3.5 h-3.5" />}>Edit</Button>
                  {!handle.primary && handle.status === 'active' && (
                    <Button variant="ghost" size="sm" icon={<Star className="w-3.5 h-3.5" />} onClick={() => setPrimary(handle.id)}>
                      Set Primary
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" icon={<ArrowRightLeft className="w-3.5 h-3.5" />} onClick={() => setTransferTarget(handle)}>
                    Transfer
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Register modal */}
      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <AtSign className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink-50">Register New .nid Handle</h2>
              <p className="text-sm text-ink-300">Claim your human-readable Web3 identity</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Handle Name</label>
              <div className="flex items-center bg-ink-800/50 border border-ink-700 rounded-lg overflow-hidden focus-within:border-brand-500 transition-colors">
                <input
                  type="text"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && registerHandle()}
                  placeholder="yourname"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none"
                />
                <span className="px-4 text-sm text-ink-400 font-mono border-l border-ink-700">.nid</span>
              </div>
              <p className="text-xs text-ink-400 mt-2">Handle will be registered as: <span className="font-mono text-brand-300">{newHandle || 'yourname'}.nid</span></p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-ink-800/50 border border-ink-700">
              <Shield className="w-4 h-4 text-success-400 shrink-0" />
              <span className="text-xs text-ink-300">Demo: No real on-chain registration will occur.</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setRegisterOpen(false)}>Cancel</Button>
              <Button className="flex-1" icon={<Check className="w-4 h-4" />} onClick={registerHandle}>Register</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Transfer modal */}
      <Modal open={!!transferTarget} onClose={() => setTransferTarget(null)}>
        {transferTarget && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-warning-500/10 border border-warning-500/20 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-warning-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink-50">Transfer Handle</h2>
                <p className="text-sm text-ink-300">Transfer ownership of <span className="font-mono text-ink-100">{transferTarget.name}</span></p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x... or Solana address"
                  className="w-full bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 transition-colors font-mono"
                />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning-500/5 border border-warning-500/20">
                <X className="w-4 h-4 text-warning-400 shrink-0" />
                <span className="text-xs text-ink-300">Demo: No real transfer will occur. This is a simulation.</span>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setTransferTarget(null)}>Cancel</Button>
                <Button variant="danger" className="flex-1" onClick={() => { showToast('info', `Transfer of ${transferTarget.name} initiated (demo).`); setTransferTarget(null); }}>
                  Transfer Handle
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
