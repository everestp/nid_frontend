
import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AtSign,
  Plus,
  Star,
  Edit3,
  ArrowRightLeft,
  Check,
  X,
  Shield,
  RefreshCw,
  Copy,
  ExternalLink,
  Loader2,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { handleApi, type ClaimHandleResponse } from '@/api/hadleApi';

export function Handles() {
  const { showToast } = useToast();

  const [handles, setHandles] = useState<ClaimHandleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [newHandle, setNewHandle] = useState('');

  const [transferTarget, setTransferTarget] =
    useState<ClaimHandleResponse | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  /**
   * Load all handles belonging to the authenticated user.
   */
  const loadHandles = useCallback(async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const data = await handleApi.getAllByUserID();

      setHandles(data ?? []);
    } catch (err) {
      console.error('Failed to load handles:', err);

      const message =
        err instanceof Error
          ? err.message
          : 'Failed to load your handles';

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Load handles when page mounts.
   */
  useEffect(() => {
    loadHandles();
  }, [loadHandles]);

  /**
   * Copy handle name.
   */
  const copyHandle = async (handle: ClaimHandleResponse) => {
    try {
      await navigator.clipboard.writeText(`${ handle.name }.nid`);

      setCopiedId(handle.id);

      showToast('success', 'Handle copied to clipboard.');

      setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch {
      showToast('error', 'Failed to copy handle.');
    }
  };

  /**
   * Register button.
   *
   * NOTE:
   * Real registration requires wallet address, chain and signature.
   * The actual claim flow should call handleApi.claimHandle()
   * after wallet signing.
   */
  const openRegisterModal = () => {
    setNewHandle('');
    setRegisterOpen(true);
  };

  const handleRegister = () => {
    if (!newHandle.trim()) {
      showToast('error', 'Please enter a handle name.');
      return;
    }

    /*
     * Do not create a fake local handle here.
     *
     * The backend requires:
     * - name
     * - address
     * - chain
     * - signature
     *
     * The actual wallet-signing flow should be connected here.
     */
    showToast(
      'info',
      'Wallet signing is required to register a new .nid handle.'
    );
  };

  /**
   * Placeholder for future primary-handle API.
   *
   * Currently primary changing is not available in the backend
   * repository/service/controller shown earlier.
   */
  const setPrimary = (id: string) => {
    const selected = handles.find((handle) => handle.id === id);

    if (!selected) return;

    showToast(
      'info',
      'Primary handle API is not connected yet.'
    );
  };

  /**
   * Format backend timestamp.
   */
  const formatCreatedAt = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  /**
   * Empty state.
   */
  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-10">
        <div className="max-w-md mx-auto text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <AtSign className="w-8 h-8 text-brand-400" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-ink-50">
            No .nid handles yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-400">
            Claim your first human-readable Web3 identity and make your
            wallet easier to discover and share.
          </p>

          <div className="mt-6">
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={openRegisterModal}
            >
              Claim Your First .nid
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  /**
   * Loading skeleton.
   */
  const renderSkeletons = () => (
    <div className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <Card key={item} className="p-5">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-ink-800 shrink-0" />

            <div className="flex-1 space-y-3">
              <div className="h-4 w-40 bg-ink-800 rounded" />
              <div className="h-3 w-64 bg-ink-800 rounded" />
            </div>

            <div className="hidden md:block h-9 w-24 bg-ink-800 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );

  /**
   * Error state.
   */
  const renderError = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="p-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
            <X className="w-6 h-6 text-danger-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-ink-50">
            Failed to load handles
          </h2>

          <p className="mt-2 text-sm text-ink-400">
            {error || 'Something went wrong while loading your handles.'}
          </p>

          <div className="mt-5">
            <Button
              variant="secondary"
              icon={
                refreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )
              }
              onClick={() => loadHandles(true)}
              disabled={refreshing}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div>
      <PageHeader
        title="Handles (.nid)"
        description="Your human-readable Web3 identity. Claim, manage, and transfer your .nid handles."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={
                refreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )
              }
              onClick={() => loadHandles(true)}
              disabled={loading || refreshing}
            >
              Refresh
            </Button>

            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={openRegisterModal}
            >
              Register New .nid Handle
            </Button>
          </div>
        }
      />

      {/* Summary */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">
                  Total Handles
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink-50">
                  {handles.length}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <AtSign className="w-5 h-5 text-brand-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">
                  Active
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink-50">
                  {handles.filter((h) => h.status === 'active').length}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-success-500/10 border border-success-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-success-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">
                  Primary
                </p>

                <p className="mt-1 text-sm font-medium text-ink-50 font-mono">
                  {handles.find((h) => h.primary)?.name
                    ? `@${ handles.find((h) => h.primary)?.name } `
                    : 'Not set'}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-warning-500/10 border border-warning-500/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-warning-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        renderSkeletons()
      ) : error ? (
        renderError()
      ) : handles.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {handles.map((handle, index) => (
              <motion.div
                key={handle.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.25,
                }}
              >
                <Card className="p-5" hover>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    {/* Identity */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-lg font-semibold text-brand-300">
                          {handle.name?.[0]?.toUpperCase() || '@'}
                        </div>

                        {handle.primary && (
                          <div className="absolute -right-1.5 -bottom-1.5 w-5 h-5 rounded-full bg-brand-500 border-2 border-ink-950 flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-white fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-semibold text-ink-50 font-mono truncate">
                            @{handle.name}.nid
                          </span>

                          {handle.primary && (
                            <Badge variant="brand" dot>
                              Primary
                            </Badge>
                          )}

                          <Badge
                            variant={
                              handle.status === 'active'
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {handle.status === 'active'
                              ? 'Active'
                              : 'Reserved'}
                          </Badge>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
                          <span>
                            Created{' '}
                            <span className="text-ink-300">
                              {formatCreatedAt(handle.created_at)}
                            </span>
                          </span>

                          <span className="text-ink-600">·</span>

                          <span className="font-mono text-ink-500">
                            {handle.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ownership */}
                    <div className="hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-lg bg-ink-900/50 border border-ink-800">
                      <Shield className="w-4 h-4 text-success-400" />

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-ink-500">
                          Owner
                        </p>

                        <p className="text-xs text-ink-300 font-mono">
                          {handle.user_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={
                          copiedId === handle.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )
                        }
                        onClick={() => copyHandle(handle)}
                      >
                        {copiedId === handle.id ? 'Copied' : 'Copy'}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit3 className="w-3.5 h-3.5" />}
                        onClick={() =>
                          showToast(
                            'info',
                            'Handle editing is coming soon.'
                          )
                        }
                      >
                        Edit
                      </Button>

                      {!handle.primary && handle.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Star className="w-3.5 h-3.5" />}
                          onClick={() => setPrimary(handle.id)}
                        >
                          Set Primary
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        }
                        onClick={() => setTransferTarget(handle)}
                      >
                        Transfer
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Register Modal */}
      <Modal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <AtSign className="w-5 h-5 text-brand-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-ink-50">
                Register New .nid Handle
              </h2>

              <p className="text-sm text-ink-400">
                Claim your human-readable Web3 identity
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">
                Handle Name
              </label>

              <div className="flex items-center bg-ink-800/50 border border-ink-700 rounded-lg overflow-hidden focus-within:border-brand-500 transition-colors">
                <input
                  type="text"
                  value={newHandle}
                  onChange={(e) =>
                    setNewHandle(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/\.nid$/i, '')
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleRegister()
                  }
                  placeholder="yourname"
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none font-mono"
                  autoFocus
                />

                <span className="px-4 text-sm text-ink-400 font-mono border-l border-ink-700">
                  .nid
                </span>
              </div>

              <p className="text-xs text-ink-400 mt-2">
                Your identity will be registered as:{' '}
                <span className="font-mono text-brand-300">
                  {newHandle || 'yourname'}.nid
                </span>
              </p>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-brand-500/5 border border-brand-500/20">
              <Shield className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />

              <div>
                <p className="text-xs font-medium text-ink-200">
                  Wallet verification required
                </p>

                <p className="text-xs text-ink-400 mt-1 leading-5">
                  Your wallet will sign a message to prove ownership.
                  No private key is sent to the backend.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setRegisterOpen(false)}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                icon={<Check className="w-4 h-4" />}
                onClick={handleRegister}
                disabled={!newHandle.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        open={!!transferTarget}
        onClose={() => setTransferTarget(null)}
      >
        {transferTarget && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warning-500/10 border border-warning-500/20 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-warning-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink-50">
                  Transfer Handle
                </h2>

                <p className="text-sm text-ink-400">
                  Transfer ownership of{' '}
                  <span className="font-mono text-ink-100">
                    @{transferTarget.name}.nid
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">
                  Recipient Address
                </label>

                <input
                  type="text"
                  placeholder="0x... or Solana address"
                  className="w-full bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-3 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 transition-colors font-mono"
                />
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-warning-500/5 border border-warning-500/20">
                <X className="w-4 h-4 text-warning-400 shrink-0 mt-0.5" />

                <p className="text-xs text-ink-300 leading-5">
                  Handle transfers are not connected to the backend yet.
                  This action will be enabled once the transfer API is
                  implemented.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setTransferTarget(null)}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    showToast(
                      'info',
                      'Handle transfer API is not connected yet.'
                    );
                    setTransferTarget(null);
                  }}
                >
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
