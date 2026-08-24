import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Link2,
  Plus,
  Unlink,
  Check,
  X,
  Shield,
  Loader2,
  Fingerprint,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { WALLETS } from '@/data/mockData';
import type { Wallet, Chain } from '@/types';

const chainMeta: Record<Chain, { color: string; icon: string; bg: string }> = {
  ethereum: { color: 'text-brand-300', icon: 'ETH', bg: 'bg-brand-500/10 border-brand-500/20' },
  solana: { color: 'text-accent-400', icon: 'SOL', bg: 'bg-accent-500/10 border-accent-500/20' },
};

export function Wallets() {
  const { showToast } = useToast();
  const [wallets, setWallets] = useState<Wallet[]>(WALLETS);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkStep, setLinkStep] = useState(0);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [unlinkTarget, setUnlinkTarget] = useState<Wallet | null>(null);

  const startLink = (chain: Chain) => {
    setSelectedChain(chain);
    setLinkStep(0);
  };

  const nextStep = () => {
    if (linkStep < 3) {
      setLinkStep(linkStep + 1);
    } else {
      // Complete
      if (selectedChain) {
        const newWallet: Wallet = {
          id: `w${Date.now()}`,
          chain: selectedChain,
          network: selectedChain === 'ethereum' ? 'Ethereum Sepolia' : 'Solana Devnet',
          address: selectedChain === 'ethereum' ? '0x9a3F...7e21' : '7Hn2R...4kL8',
          status: 'verified',
          linkedAt: 'Just now',
        };
        setWallets((prev) => [...prev, newWallet]);
        showToast('success', `${selectedChain === 'ethereum' ? 'Ethereum' : 'Solana'} wallet linked successfully.`);
      }
      setLinkOpen(false);
      setLinkStep(0);
      setSelectedChain(null);
    }
  };

  const confirmUnlink = () => {
    if (unlinkTarget) {
      setWallets((prev) => prev.filter((w) => w.id !== unlinkTarget.id));
      showToast('success', `${unlinkTarget.network} wallet unlinked.`);
      setUnlinkTarget(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Multi-Chain Identity Linking"
        description="Link and manage wallets across Solana and Ethereum. Your identity, your chains."
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setLinkOpen(true)}>
            Link New Wallet
          </Button>
        }
      />

      <div className="grid gap-4">
        {wallets.map((wallet, i) => {
          const meta = chainMeta[wallet.chain];
          return (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5" hover>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-bold ${meta.bg} ${meta.color}`}>
                      {meta.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-ink-50">{wallet.network}</span>
                        <Badge variant={wallet.status === 'verified' ? 'success' : 'warning'} dot>
                          {wallet.status === 'verified' ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="text-sm font-mono text-ink-300 mt-1">{wallet.address}</div>
                      <div className="text-xs text-ink-400 mt-0.5">Linked {wallet.linkedAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={<Unlink className="w-3.5 h-3.5" />} onClick={() => setUnlinkTarget(wallet)}>
                      Unlink
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Link wallet modal */}
      <Modal open={linkOpen} onClose={() => { setLinkOpen(false); setLinkStep(0); setSelectedChain(null); }}>
        <div className="p-6">
          {linkStep === 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink-50">Link New Wallet</h2>
                  <p className="text-sm text-ink-300">Select a chain to connect</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['ethereum', 'solana'] as Chain[]).map((chain) => {
                  const meta = chainMeta[chain];
                  return (
                    <button
                      key={chain}
                      onClick={() => startLink(chain)}
                      className={`p-5 rounded-xl border transition-all hover:scale-[1.02] ${meta.bg}`}
                    >
                      <div className={`text-2xl font-bold ${meta.color} mb-2`}>{meta.icon}</div>
                      <div className="text-sm font-medium text-ink-50 capitalize">{chain}</div>
                      <div className="text-xs text-ink-400 mt-1">{chain === 'ethereum' ? 'Mainnet / Sepolia' : 'Mainnet / Devnet'}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {linkStep === 1 && selectedChain && (
            <div className="text-center py-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-2 border-brand-500/20 border-t-brand-400 mx-auto mb-5"
              />
              <h2 className="text-lg font-semibold text-ink-50 mb-2">Connecting to {selectedChain === 'ethereum' ? 'Ethereum' : 'Solana'}</h2>
              <p className="text-sm text-ink-300 mb-5">Simulating wallet connection...</p>
              <Button onClick={nextStep} className="mx-auto">Continue</Button>
            </div>
          )}

          {linkStep === 2 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto mb-5">
                <Fingerprint className="w-8 h-8 text-accent-400" />
              </div>
              <h2 className="text-lg font-semibold text-ink-50 mb-2">Cryptographic Challenge</h2>
              <p className="text-sm text-ink-300 mb-5">Sign a message to verify wallet ownership</p>
              <div className="card-surface p-4 mb-5 text-left">
                <div className="text-xs text-ink-400 uppercase tracking-wider mb-2">Message to sign</div>
                <div className="font-mono text-xs text-ink-200 break-all">
                  NID.xyz identity verification nonce: 0x7f3a9c2e1b8d4f6a
                </div>
              </div>
              <Button onClick={nextStep} className="mx-auto" icon={<Fingerprint className="w-4 h-4" />}>Sign & Verify</Button>
            </div>
          )}

          {linkStep === 3 && (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto mb-5"
              >
                <Check className="w-8 h-8 text-success-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-ink-50 mb-2">Wallet Verified</h2>
              <p className="text-sm text-ink-300 mb-5">Your {selectedChain === 'ethereum' ? 'Ethereum' : 'Solana'} wallet is ready to link</p>
              <Button onClick={nextStep} className="mx-auto" icon={<Check className="w-4 h-4" />}>Complete Linking</Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Unlink modal */}
      <Modal open={!!unlinkTarget} onClose={() => setUnlinkTarget(null)}>
        {unlinkTarget && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
                <X className="w-5 h-5 text-danger-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink-50">Unlink Wallet</h2>
                <p className="text-sm text-ink-300">This will remove <span className="font-mono text-ink-100">{unlinkTarget.address}</span> from your identity</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-5">
              <Shield className="w-4 h-4 text-danger-400 shrink-0" />
              <span className="text-xs text-ink-300">Apps using this wallet address will lose access. This cannot be undone.</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setUnlinkTarget(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={confirmUnlink}>Unlink Wallet</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
