import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft,
  Plus,
  Trash2,
  Star,
  Check,
  X,
  Search,
  Loader2,
  AtSign,
  Coins,
  Link2,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { PAYMENT_ROUTES } from '@/data/mockData';
import type { PaymentRoute, Chain } from '@/types';

const assetMeta: Record<string, { color: string; bg: string; symbol: string }> = {
  USDC: { color: 'text-brand-300', bg: 'bg-brand-500/10 border-brand-500/20', symbol: 'USDC' },
  SOL: { color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20', symbol: 'SOL' },
  ETH: { color: 'text-ink-100', bg: 'bg-ink-700 border-ink-600', symbol: 'ETH' },
  USDT: { color: 'text-success-400', bg: 'bg-success-500/10 border-success-500/20', symbol: 'USDT' },
};

const chainLabels: Record<Chain, string> = {
  ethereum: 'Ethereum',
  solana: 'Solana',
};

export function PaymentRouting() {
  const { showToast } = useToast();
  const [routes, setRoutes] = useState<PaymentRoute[]>(PAYMENT_ROUTES);
  const [addOpen, setAddOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<PaymentRoute | null>(null);
  const [resolverInput, setResolverInput] = useState('');
  const [resolving, setResolving] = useState(false);
  const [resolvedRoutes, setResolvedRoutes] = useState<PaymentRoute[] | null>(null);

  // Add form state
  const [newAsset, setNewAsset] = useState<PaymentRoute['asset']>('USDC');
  const [newChain, setNewChain] = useState<Chain>('solana');
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const setDefault = (id: string) => {
    setRoutes((prev) => prev.map((r) => {
      if (r.chain !== routes.find((x) => x.id === id)?.chain) return r;
      return { ...r, isDefault: r.id === id };
    }));
    showToast('success', 'Default payment route updated.');
  };

  const addRoute = () => {
    if (!newAddress.trim() || !newLabel.trim()) return;
    const route: PaymentRoute = {
      id: `pr${Date.now()}`,
      asset: newAsset,
      chain: newChain,
      destinationAddress: newAddress.trim(),
      isDefault: false,
      label: newLabel.trim(),
    };
    setRoutes((prev) => [...prev, route]);
    setAddOpen(false);
    setNewAddress('');
    setNewLabel('');
    showToast('success', 'Payment route added successfully.');
  };

  const removeRoute = () => {
    if (removeTarget) {
      setRoutes((prev) => prev.filter((r) => r.id !== removeTarget.id));
      showToast('success', 'Payment route removed.');
      setRemoveTarget(null);
    }
  };

  const resolveHandle = () => {
    if (!resolverInput.trim()) return;
    setResolving(true);
    setResolvedRoutes(null);
    setTimeout(() => {
      setResolving(false);
      setResolvedRoutes(routes);
    }, 1500);
  };

  return (
    <div>
      <PageHeader
        title="Universal Payment Routing"
        description="Configure how your .nid handle resolves to payment endpoints across chains."
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>
            Add Payment Route
          </Button>
        }
      />

      {/* Active handle header */}
      <Card className="p-5 mb-6" delay={0}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-300 shrink-0">
            <AtSign className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-ink-400 uppercase tracking-wider">Active Handle</div>
            <div className="text-lg font-semibold text-ink-50 font-mono">everest.nid</div>
          </div>
          <Badge variant="success" dot>Routing Active</Badge>
        </div>
      </Card>

      {/* Routes table */}
      <Card className="p-6 mb-6" delay={0.05}>
        <div className="flex items-center gap-2 mb-5">
          <ArrowRightLeft className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-ink-50">Configured Routes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-ink-400 uppercase tracking-wider border-b border-ink-700">
                <th className="text-left py-3 px-3 font-medium">Asset</th>
                <th className="text-left py-3 px-3 font-medium">Chain</th>
                <th className="text-left py-3 px-3 font-medium">Label</th>
                <th className="text-left py-3 px-3 font-medium">Destination</th>
                <th className="text-left py-3 px-3 font-medium">Status</th>
                <th className="text-right py-3 px-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {routes.map((route, i) => {
                  const meta = assetMeta[route.asset];
                  return (
                    <motion.tr
                      key={route.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-ink-800 hover:bg-ink-800/30 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${meta.bg} ${meta.color}`}>
                          <Coins className="w-3 h-3" /> {route.asset}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-sm text-ink-200">{chainLabels[route.chain]}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-sm text-ink-100">{route.label}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-sm font-mono text-ink-300">{route.destinationAddress}</span>
                      </td>
                      <td className="py-3 px-3">
                        {route.isDefault ? (
                          <Badge variant="success" dot>Default</Badge>
                        ) : (
                          <Badge variant="neutral">Active</Badge>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-1">
                          {!route.isDefault && (
                            <button
                              onClick={() => setDefault(route.id)}
                              className="p-1.5 rounded-md text-ink-400 hover:text-brand-300 hover:bg-ink-700 transition-colors"
                              title="Set as default"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setRemoveTarget(route)}
                            className="p-1.5 rounded-md text-ink-400 hover:text-danger-400 hover:bg-ink-700 transition-colors"
                            title="Remove route"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resolver Simulator */}
      <Card className="p-6" delay={0.1}>
        <div className="flex items-center gap-2 mb-5">
          <Search className="w-5 h-5 text-accent-400" />
          <h2 className="text-lg font-semibold text-ink-50">Resolver Simulator</h2>
        </div>
        <p className="text-sm text-ink-300 mb-4">Test how a handle resolves to its active payment endpoints — just like a third-party app would.</p>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={resolverInput}
              onChange={(e) => setResolverInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && resolveHandle()}
              placeholder="everest.nid"
              className="w-full bg-ink-800/50 border border-ink-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all font-mono"
            />
          </div>
          <Button icon={<Search className="w-4 h-4" />} onClick={resolveHandle} disabled={resolving}>
            Resolve
          </Button>
        </div>

        {resolving && (
          <div className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
            <span className="text-sm text-ink-300">Resolving payment endpoints...</span>
          </div>
        )}

        {resolvedRoutes && !resolving && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-success-400" />
              <span className="text-sm text-success-400">Resolved {resolverInput || 'everest.nid'} to {resolvedRoutes.length} endpoints</span>
            </div>
            {resolvedRoutes.map((route) => {
              const meta = assetMeta[route.asset];
              return (
                <div key={route.id} className="flex items-center gap-3 p-3 rounded-lg bg-ink-800/50 border border-ink-700">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold ${meta.bg} ${meta.color}`}>
                    {route.asset}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink-50">{route.label}</div>
                    <div className="text-xs text-ink-400 font-mono">{route.destinationAddress}</div>
                  </div>
                  <Badge variant="neutral">{chainLabels[route.chain]}</Badge>
                  {route.isDefault && <Badge variant="success">Default</Badge>}
                </div>
              );
            })}
          </motion.div>
        )}
      </Card>

      {/* Add route modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink-50">Add Payment Route</h2>
              <p className="text-sm text-ink-300">Configure a new payment endpoint for your handle</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Asset</label>
              <div className="grid grid-cols-4 gap-2">
                {(['USDC', 'SOL', 'ETH', 'USDT'] as const).map((asset) => {
                  const meta = assetMeta[asset];
                  return (
                    <button
                      key={asset}
                      onClick={() => setNewAsset(asset)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        newAsset === asset ? meta.bg + ' ' + meta.color : 'bg-ink-800/50 border-ink-700 text-ink-300 hover:text-ink-50'
                      }`}
                    >
                      {asset}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Chain</label>
              <div className="grid grid-cols-2 gap-2">
                {(['solana', 'ethereum'] as Chain[]).map((chain) => (
                  <button
                    key={chain}
                    onClick={() => setNewChain(chain)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-2 ${
                      newChain === chain ? 'bg-brand-500/10 border-brand-500/20 text-brand-300' : 'bg-ink-800/50 border-ink-700 text-ink-300 hover:text-ink-50'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" /> {chainLabels[chain]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Destination Address</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x... or Solana address"
                className="w-full bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Primary Solana Wallet"
                className="w-full bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button className="flex-1" icon={<Check className="w-4 h-4" />} onClick={addRoute}>Add Route</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Remove route modal */}
      <Modal open={!!removeTarget} onClose={() => setRemoveTarget(null)}>
        {removeTarget && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
                <X className="w-5 h-5 text-danger-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink-50">Remove Payment Route</h2>
                <p className="text-sm text-ink-300">Remove <span className="text-ink-100">{removeTarget.label}</span> ({removeTarget.asset} on {chainLabels[removeTarget.chain]})</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-5">
              <span className="text-xs text-ink-300">Apps resolving this handle will no longer see this payment endpoint. This cannot be undone.</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setRemoveTarget(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={removeRoute}>Remove Route</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
