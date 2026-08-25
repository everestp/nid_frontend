import { useEffect, useMemo, useState } from 'react';
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
  Eye,
  Copy,
  RefreshCw,
  Pencil,
  Wallet as WalletIcon,
  Globe,
  Clock3,
  CircleCheck,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';

import {
  walletListApi,
  type Wallet,
  type Chain,
  type WalletStatus,
  type CreateWalletRequest,
  type UpdateWalletRequest,
} from '@/api/walletListApi';

// ============================================================
// CHAIN META
// ============================================================

interface ChainMeta {
  name: string;
  shortName: string;
  color: string;
  bg: string;
  border: string;
  description: string;
}

const chainMeta: Record<string, ChainMeta> = {
  ethereum: {
    name: 'Ethereum',
    shortName: 'ETH',
    color: 'text-brand-300',
    bg: 'bg-brand-500/10',
    border: 'border-brand-500/20',
    description: 'Ethereum Mainnet and test networks',
  },

  solana: {
    name: 'Solana',
    shortName: 'SOL',
    color: 'text-accent-400',
    bg: 'bg-accent-500/10',
    border: 'border-accent-500/20',
    description: 'Solana Mainnet and Devnet',
  },

  bitcoin: {
    name: 'Bitcoin',
    shortName: 'BTC',
    color: 'text-warning-400',
    bg: 'bg-warning-500/10',
    border: 'border-warning-500/20',
    description: 'Bitcoin network',
  },

  polygon: {
    name: 'Polygon',
    shortName: 'POL',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    description: 'Polygon Mainnet and Amoy',
  },

  bsc: {
    name: 'BNB Smart Chain',
    shortName: 'BNB',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    description: 'BNB Smart Chain',
  },

  arbitrum: {
    name: 'Arbitrum',
    shortName: 'ARB',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    description: 'Arbitrum One and test networks',
  },

  base: {
    name: 'Base',
    shortName: 'BASE',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description: 'Base Mainnet and test networks',
  },

  optimism: {
    name: 'Optimism',
    shortName: 'OP',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    description: 'Optimism Mainnet and test networks',
  },

  avalanche: {
    name: 'Avalanche',
    shortName: 'AVAX',
    color: 'text-danger-400',
    bg: 'bg-danger-500/10',
    border: 'border-danger-500/20',
    description: 'Avalanche C-Chain',
  },

  tron: {
    name: 'TRON',
    shortName: 'TRX',
    color: 'text-red-300',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    description: 'TRON Mainnet',
  },

  other: {
    name: 'Other',
    shortName: 'WEB3',
    color: 'text-ink-300',
    bg: 'bg-ink-500/10',
    border: 'border-ink-500/20',
    description: 'Other supported blockchain networks',
  },
};

// ============================================================
// SUPPORTED CHAINS
// ============================================================

const supportedChains: Chain[] = [
  'ethereum',
  'solana',
  'bitcoin',
  'polygon',
  'bsc',
  'arbitrum',
  'base',
  'optimism',
  'avalanche',
  'tron',
  'other',
];

// ============================================================
// NETWORK OPTIONS
// ============================================================

const networkOptions: Record<string, string[]> = {
  ethereum: [
    'Ethereum Mainnet',
    'Ethereum Sepolia',
  ],

  solana: [
    'Solana Mainnet',
    'Solana Devnet',
  ],

  bitcoin: [
    'Bitcoin Mainnet',
    'Bitcoin Testnet',
  ],

  polygon: [
    'Polygon Mainnet',
    'Polygon Amoy',
  ],

  bsc: [
    'BNB Smart Chain Mainnet',
    'BNB Smart Chain Testnet',
  ],

  arbitrum: [
    'Arbitrum One',
    'Arbitrum Sepolia',
  ],

  base: [
    'Base Mainnet',
    'Base Sepolia',
  ],

  optimism: [
    'Optimism Mainnet',
    'Optimism Sepolia',
  ],

  avalanche: [
    'Avalanche C-Chain',
    'Avalanche Fuji',
  ],

  tron: [
    'TRON Mainnet',
    'TRON Nile',
  ],

  other: [
    'Mainnet',
    'Testnet',
  ],
};

// ============================================================
// HELPERS
// ============================================================

const getChainMeta = (chain: string): ChainMeta => {
  return chainMeta[chain] ?? chainMeta.other;
};

const formatAddress = (address: string) => {
  if (!address) return '';

  if (address.length <= 22) {
    return address;
  }

  return `${address.slice(0, 10)}...${address.slice(-8)}`;
};

const formatDate = (date: string) => {
  if (!date) return 'Unknown';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString();
};

const getStatusLabel = (status: WalletStatus) => {
  if (status === 'verified') {
    return 'Verified';
  }

  return 'Pending';
};

// ============================================================
// COMPONENT
// ============================================================

export function Wallets() {
  const { showToast } = useToast();

  // ==========================================================
  // WALLETS
  // ==========================================================

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================================
  // ADD WALLET
  // ==========================================================

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkStep, setLinkStep] = useState(0);

  const [selectedChain, setSelectedChain] =
    useState<Chain | null>(null);

  const [selectedNetwork, setSelectedNetwork] =
    useState('');

  const [walletAddress, setWalletAddress] =
    useState('');

  const [creating, setCreating] = useState(false);

  // ==========================================================
  // WALLET DETAILS
  // ==========================================================

  const [detailsWallet, setDetailsWallet] =
    useState<Wallet | null>(null);

  // ==========================================================
  // DELETE
  // ==========================================================

  const [unlinkTarget, setUnlinkTarget] =
    useState<Wallet | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  // ==========================================================
  // EDIT
  // ==========================================================

  const [editWallet, setEditWallet] =
    useState<Wallet | null>(null);

  const [editChain, setEditChain] =
    useState<Chain>('ethereum');

  const [editNetwork, setEditNetwork] =
    useState('');

  const [editAddress, setEditAddress] =
    useState('');

  const [updating, setUpdating] =
    useState(false);

  // ==========================================================
  // COPY
  // ==========================================================

  const [copied, setCopied] =
    useState(false);

  // ==========================================================
  // LOAD WALLETS
  // ==========================================================

  const loadWallets = async () => {
    try {
      setLoading(true);

      const response =
        await walletListApi.list();

      setWallets(response.wallets ?? []);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load wallets.';

      showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadWallets();
  }, []);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const refreshWallets = async () => {
    try {
      setRefreshing(true);

      const response =
        await walletListApi.list();

      setWallets(response.wallets ?? []);

      showToast(
        'success',
        'Wallet list refreshed.',
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to refresh wallets.';

      showToast('error', message);
    } finally {
      setRefreshing(false);
    }
  };

  // ==========================================================
  // RESET LINK MODAL
  // ==========================================================

  const resetLinkModal = () => {
    if (creating) return;

    setLinkOpen(false);
    setLinkStep(0);
    setSelectedChain(null);
    setSelectedNetwork('');
    setWalletAddress('');
  };

  // ==========================================================
  // START LINK
  // ==========================================================

  const startLink = (chain: Chain) => {
    setSelectedChain(chain);

    const networks =
      networkOptions[chain] ?? [];

    setSelectedNetwork(
      networks[0] ?? '',
    );

    setLinkStep(1);
  };

  // ==========================================================
  // NEXT LINK STEP
  // ==========================================================

  const nextStep = () => {
    if (linkStep < 3) {
      setLinkStep(
        (prev) => prev + 1,
      );

      return;
    }

    completeLink();
  };

  // ==========================================================
  // COMPLETE LINK
  // ==========================================================

  const completeLink = async () => {
    if (!selectedChain) {
      return;
    }

    if (!walletAddress.trim()) {
      showToast(
        'error',
        'Wallet address is required.',
      );

      setLinkStep(1);

      return;
    }

    if (!selectedNetwork) {
      showToast(
        'error',
        'Please select a network.',
      );

      setLinkStep(1);

      return;
    }

    const payload: CreateWalletRequest = {
      chain: selectedChain,
      network: selectedNetwork,
      address: walletAddress.trim(),
    };

    try {
      setCreating(true);

      const response =
        await walletListApi.create(
          payload,
        );

      if (response.wallet) {
        setWallets((prev) => [
          response.wallet,
          ...prev,
        ]);
      }

      showToast(
        'success',
        `${getChainMeta(selectedChain).name} wallet linked successfully.`,
      );

      resetLinkModal();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to link wallet.';

      showToast(
        'error',
        message,
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================================
  // DELETE / UNLINK
  // ==========================================================

  const confirmUnlink = async () => {
    if (!unlinkTarget) {
      return;
    }

    try {
      setDeleting(true);

      await walletListApi.delete(
        unlinkTarget.id,
      );

      setWallets((prev) =>
        prev.filter(
          (wallet) =>
            wallet.id !== unlinkTarget.id,
        ),
      );

      showToast(
        'success',
        `${getChainMeta(unlinkTarget.chain).name} wallet unlinked successfully.`,
      );

      setUnlinkTarget(null);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to unlink wallet.';

      showToast(
        'error',
        message,
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const openEdit = (wallet: Wallet) => {
    setEditWallet(wallet);
    setEditChain(wallet.chain);
    setEditNetwork(wallet.network);
    setEditAddress(wallet.address);
  };

  // ==========================================================
  // CLOSE EDIT
  // ==========================================================

  const closeEdit = () => {
    if (updating) return;

    setEditWallet(null);
    setEditChain('ethereum');
    setEditNetwork('');
    setEditAddress('');
  };

  // ==========================================================
  // UPDATE WALLET
  // ==========================================================

  const saveEdit = async () => {
    if (!editWallet) {
      return;
    }

    if (!editAddress.trim()) {
      showToast(
        'error',
        'Wallet address is required.',
      );

      return;
    }

    if (!editNetwork) {
      showToast(
        'error',
        'Network is required.',
      );

      return;
    }

    const payload: UpdateWalletRequest = {
      chain: editChain,
      network: editNetwork,
      address: editAddress.trim(),
    };

    try {
      setUpdating(true);

      const response =
        await walletListApi.update(
          editWallet.id,
          payload,
        );

      if (response.wallet) {
        setWallets((prev) =>
          prev.map((wallet) =>
            wallet.id === editWallet.id
              ? response.wallet
              : wallet,
          ),
        );
      }

      showToast(
        'success',
        'Wallet updated successfully.',
      );

      closeEdit();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update wallet.';

      showToast(
        'error',
        message,
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================================
  // COPY ADDRESS
  // ==========================================================

  const copyAddress = async (
    address: string,
  ) => {
    try {
      await navigator.clipboard.writeText(
        address,
      );

      setCopied(true);

      showToast(
        'success',
        'Wallet address copied.',
      );

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      showToast(
        'error',
        'Failed to copy wallet address.',
      );
    }
  };

  // ==========================================================
  // WALLET COUNTS
  // ==========================================================

  const verifiedCount = useMemo(
    () =>
      wallets.filter(
        (wallet) =>
          wallet.status === 'verified',
      ).length,
    [wallets],
  );

  const pendingCount = useMemo(
    () =>
      wallets.filter(
        (wallet) =>
          wallet.status === 'pending',
      ).length,
    [wallets],
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <PageHeader
        title="Wallets"
        description="Manage the blockchain wallets connected to your NID identity."
        actions={
          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              icon={
                <RefreshCw
                  className={`w-4 h-4 ${refreshing
                      ? 'animate-spin'
                      : ''
                    }`}
                />
              }
              onClick={refreshWallets}
              disabled={
                loading ||
                refreshing
              }
            >
              Refresh
            </Button>

            <Button
              icon={
                <Plus className="w-4 h-4" />
              }
              onClick={() =>
                setLinkOpen(true)
              }
            >
              Link New Wallet
            </Button>

          </div>
        }
      />

      {/* ======================================================
          SUMMARY
      ======================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Card className="p-4">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-ink-500">
                Total Wallets
              </p>

              <p className="text-2xl font-semibold text-ink-50 mt-1">
                {wallets.length}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-brand-400" />
            </div>

          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-ink-500">
                Verified
              </p>

              <p className="text-2xl font-semibold text-success-400 mt-1">
                {verifiedCount}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-success-500/10 border border-success-500/20 flex items-center justify-center">
              <CircleCheck className="w-5 h-5 text-success-400" />
            </div>

          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-ink-500">
                Pending
              </p>

              <p className="text-2xl font-semibold text-warning-400 mt-1">
                {pendingCount}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-warning-500/10 border border-warning-500/20 flex items-center justify-center">
              <Clock3 className="w-5 h-5 text-warning-400" />
            </div>

          </div>
        </Card>

      </div>

      {/* ======================================================
          WALLET LIST
      ======================================================= */}

      <Card
        className="p-6"
        delay={0.05}
      >

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">

            <Link2 className="w-5 h-5 text-brand-400" />

            <div>
              <h2 className="text-lg font-semibold text-ink-50">
                Connected Wallets
              </h2>

              <p className="text-xs text-ink-500 mt-0.5">
                Wallets associated with your NID identity.
              </p>
            </div>

          </div>

          {wallets.length > 0 && (
            <span className="text-xs text-ink-500">
              {wallets.length} wallet
              {wallets.length !== 1
                ? 's'
                : ''}
            </span>
          )}

        </div>

        {/* ====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div className="py-16 text-center">

            <Loader2 className="w-6 h-6 animate-spin text-brand-400 mx-auto mb-3" />

            <p className="text-sm text-ink-400">
              Loading your wallets...
            </p>

          </div>

        ) : wallets.length === 0 ? (

          /* ==================================================
             EMPTY
          ================================================== */

          <div className="py-16 text-center rounded-xl border border-dashed border-ink-700 bg-ink-900/30">

            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">

              <WalletIcon className="w-6 h-6 text-brand-400" />

            </div>

            <h3 className="text-sm font-semibold text-ink-100">
              No wallets connected
            </h3>

            <p className="text-xs text-ink-500 mt-1 mb-5 max-w-sm mx-auto">
              Connect a blockchain wallet to associate it with your NID identity.
            </p>

            <Button
              size="sm"
              icon={
                <Plus className="w-4 h-4" />
              }
              onClick={() =>
                setLinkOpen(true)
              }
            >
              Link Your First Wallet
            </Button>

          </div>

        ) : (

          /* ==================================================
             LIST
          ================================================== */

          <div className="space-y-3">

            {wallets.map(
              (wallet, index) => {
                const meta =
                  getChainMeta(
                    wallet.chain,
                  );

                return (
                  <motion.div
                    key={wallet.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                  >

                    <div className="group p-4 rounded-xl bg-ink-800/40 border border-ink-700 hover:border-ink-600 transition-all">

                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                        {/* ================================
                            WALLET INFO
                        ================================= */}

                        <div className="flex items-center gap-4 flex-1 min-w-0">

                          {/* Network icon */}

                          <div
                            className={`
                              w-12 h-12
                              shrink-0
                              rounded-xl
                              border
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-bold
                              ${meta.bg}
                              ${meta.border}
                              ${meta.color}
                            `}
                          >
                            {meta.shortName}
                          </div>

                          {/* Details */}

                          <div className="min-w-0">

                            <div className="flex items-center gap-2 flex-wrap">

                              <span className="text-base font-semibold text-ink-50">
                                {meta.name}
                              </span>

                              <Badge
                                variant={
                                  wallet.status ===
                                    'verified'
                                    ? 'success'
                                    : 'warning'
                                }
                                dot
                              >
                                {getStatusLabel(
                                  wallet.status,
                                )}
                              </Badge>

                            </div>

                            <div className="flex items-center gap-2 mt-1">

                              <span className="text-xs text-ink-500">
                                {wallet.network}
                              </span>

                              <span className="text-ink-700">
                                •
                              </span>

                              <span className="text-xs font-mono text-ink-300 truncate">
                                {formatAddress(
                                  wallet.address,
                                )}
                              </span>

                            </div>

                            <div className="text-[11px] text-ink-500 mt-1">
                              Linked{' '}
                              {formatDate(
                                wallet.linkedAt,
                              )}
                            </div>

                          </div>

                        </div>

                        {/* ================================
                            ACTIONS
                        ================================= */}

                        <div className="flex items-center gap-2">

                          {/* COPY */}

                          <Button
                            variant="ghost"
                            size="sm"
                            icon={
                              copied ? (
                                <Check className="w-3.5 h-3.5 text-success-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )
                            }
                            onClick={() =>
                              copyAddress(
                                wallet.address,
                              )
                            }
                          >
                            Copy
                          </Button>

                          {/* VIEW */}

                          <Button
                            variant="outline"
                            size="sm"
                            icon={
                              <Eye className="w-3.5 h-3.5" />
                            }
                            onClick={() =>
                              setDetailsWallet(
                                wallet,
                              )
                            }
                          >
                            View
                          </Button>

                          {/* EDIT */}

                          <Button
                            variant="outline"
                            size="sm"
                            icon={
                              <Pencil className="w-3.5 h-3.5" />
                            }
                            onClick={() =>
                              openEdit(wallet)
                            }
                          >
                            Edit
                          </Button>

                          {/* DELETE */}

                          <Button
                            variant="ghost"
                            size="sm"
                            icon={
                              <Unlink className="w-3.5 h-3.5" />
                            }
                            onClick={() =>
                              setUnlinkTarget(
                                wallet,
                              )
                            }
                          >
                            Unlink
                          </Button>

                        </div>

                      </div>

                    </div>

                  </motion.div>
                );
              },
            )}

          </div>

        )}

      </Card>

      {/* ======================================================
          LINK WALLET MODAL
      ======================================================= */}

      <Modal
        open={linkOpen}
        onClose={resetLinkModal}
      >

        <div className="p-6 w-full max-w-xl">

          {/* ==================================================
              STEP 0
          ================================================== */}

          {linkStep === 0 && (

            <div>

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">

                  <Link2 className="w-5 h-5 text-brand-400" />

                </div>

                <div>

                  <h2 className="text-lg font-semibold text-ink-50">
                    Link New Wallet
                  </h2>

                  <p className="text-sm text-ink-400">
                    Select a blockchain network
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                {supportedChains.map(
                  (chain) => {

                    const meta =
                      getChainMeta(
                        chain,
                      );

                    return (
                      <button
                        key={chain}
                        onClick={() =>
                          startLink(
                            chain,
                          )
                        }
                        className={`
                          p-4
                          rounded-xl
                          border
                          text-left
                          transition-all
                          hover:scale-[1.02]
                          hover:border-ink-500
                          ${meta.bg}
                          ${meta.border}
                        `}
                      >

                        <div
                          className={`
                            w-10
                            h-10
                            rounded-lg
                            border
                            flex
                            items-center
                            justify-center
                            text-[10px]
                            font-bold
                            mb-3
                            ${meta.border}
                            ${meta.color}
                          `}
                        >
                          {meta.shortName}
                        </div>

                        <div className="text-sm font-medium text-ink-50">
                          {meta.name}
                        </div>

                        <div className="text-[11px] text-ink-500 mt-1 leading-relaxed">
                          {meta.description}
                        </div>

                      </button>
                    );
                  },
                )}

              </div>

            </div>

          )}

          {/* ==================================================
              STEP 1
          ================================================== */}

          {linkStep === 1 &&
            selectedChain && (

              <div>

                <div className="flex items-center gap-3 mb-6">

                  <div
                    className={`
                      w-10
                      h-10
                      rounded-lg
                      border
                      flex
                      items-center
                      justify-center
                      ${getChainMeta(
                      selectedChain,
                    ).bg}
                      ${getChainMeta(
                      selectedChain,
                    ).border}
                    `}
                  >

                    <span
                      className={`
                        text-xs
                        font-bold
                        ${getChainMeta(
                        selectedChain,
                      ).color}
                      `}
                    >
                      {
                        getChainMeta(
                          selectedChain,
                        ).shortName
                      }
                    </span>

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold text-ink-50">
                      Connect Wallet
                    </h2>

                    <p className="text-sm text-ink-400">
                      {
                        getChainMeta(
                          selectedChain,
                        ).name
                      }
                    </p>

                  </div>

                </div>

                {/* NETWORK */}

                <div className="mb-5">

                  <label className="block text-sm font-medium text-ink-200 mb-2">
                    Network
                  </label>

                  <select
                    value={
                      selectedNetwork
                    }
                    onChange={(event) =>
                      setSelectedNetwork(
                        event.target
                          .value,
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 outline-none focus:border-brand-500"
                  >

                    {(
                      networkOptions[
                      selectedChain
                      ] ?? []
                    ).map(
                      (network) => (
                        <option
                          key={
                            network
                          }
                          value={
                            network
                          }
                        >
                          {network}
                        </option>
                      ),
                    )}

                  </select>

                </div>

                {/* ADDRESS */}

                <div className="mb-5">

                  <label className="block text-sm font-medium text-ink-200 mb-2">
                    Wallet Address
                  </label>

                  <input
                    value={
                      walletAddress
                    }
                    onChange={(event) =>
                      setWalletAddress(
                        event.target
                          .value,
                      )
                    }
                    placeholder={
                      selectedChain ===
                        'ethereum'
                        ? '0x...'
                        : selectedChain ===
                          'solana'
                          ? 'Wallet public key...'
                          : 'Wallet address...'
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 placeholder:text-ink-600 outline-none focus:border-brand-500 font-mono text-sm"
                  />

                  <p className="text-xs text-ink-500 mt-2">
                    Enter the public wallet address you want to associate with your NID identity.
                  </p>

                </div>

                {/* SECURITY */}

                <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 mb-6">

                  <div className="flex gap-3">

                    <Shield className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />

                    <div>

                      <p className="text-sm font-medium text-ink-200">
                        Ownership verification
                      </p>

                      <p className="text-xs text-ink-400 mt-1 leading-relaxed">
                        You must prove ownership of this wallet before it can be verified and linked to your NID identity.
                      </p>

                    </div>

                  </div>

                </div>

                <div className="flex gap-3">

                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setLinkStep(0);
                      setSelectedChain(
                        null,
                      );
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    className="flex-1"
                    onClick={() =>
                      nextStep()
                    }
                    disabled={
                      !walletAddress.trim() ||
                      !selectedNetwork
                    }
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>

                </div>

              </div>
            )}

          {/* ==================================================
              STEP 2
          ================================================== */}

          {linkStep === 2 && (

            <div className="text-center py-6">

              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="w-16 h-16 rounded-full bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto mb-5"
              >

                <Fingerprint className="w-8 h-8 text-accent-400" />

              </motion.div>

              <h2 className="text-lg font-semibold text-ink-50 mb-2">
                Cryptographic Verification
              </h2>

              <p className="text-sm text-ink-300 mb-5 max-w-sm mx-auto">
                Sign a message with your wallet to prove that you control this address.
              </p>

              <div className="card-surface p-4 mb-5 text-left">

                <div className="text-xs text-ink-500 uppercase tracking-wider mb-2">
                  Wallet
                </div>

                <div className="font-mono text-xs text-ink-200 break-all mb-4">
                  {walletAddress}
                </div>

                <div className="text-xs text-ink-500 uppercase tracking-wider mb-2">
                  Message
                </div>

                <div className="font-mono text-xs text-ink-200 break-all">
                  NID.xyz identity verification request.
                  Please sign this message to prove wallet ownership.
                </div>

              </div>

              <div className="flex gap-3 justify-center">

                <Button
                  variant="secondary"
                  onClick={() =>
                    setLinkStep(1)
                  }
                >
                  Back
                </Button>

                <Button
                  onClick={() =>
                    nextStep()
                  }
                  icon={
                    <Fingerprint className="w-4 h-4" />
                  }
                >
                  Sign & Verify
                </Button>

              </div>

            </div>
          )}

          {/* ==================================================
              STEP 3
          ================================================== */}

          {linkStep === 3 && (

            <div className="text-center py-6">

              <motion.div
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="w-16 h-16 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto mb-5"
              >

                <Check className="w-8 h-8 text-success-400" />

              </motion.div>

              <h2 className="text-lg font-semibold text-ink-50 mb-2">
                Wallet Verified
              </h2>

              <p className="text-sm text-ink-300 mb-5">
                Your wallet ownership has been verified and is ready to be linked.
              </p>

              <div className="p-4 rounded-xl bg-ink-900 border border-ink-700 text-left mb-6">

                <div className="flex items-center justify-between mb-3">

                  <span className="text-xs text-ink-500">
                    Network
                  </span>

                  <span className="text-xs text-ink-200">
                    {selectedNetwork}
                  </span>

                </div>

                <div>

                  <span className="text-xs text-ink-500">
                    Address
                  </span>

                  <p className="text-xs font-mono text-ink-200 break-all mt-1">
                    {walletAddress}
                  </p>

                </div>

              </div>

              <Button
                onClick={() =>
                  nextStep()
                }
                disabled={creating}
                className="mx-auto"
                icon={
                  creating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )
                }
              >
                {creating
                  ? 'Linking...'
                  : 'Complete Linking'}
              </Button>

            </div>
          )}

        </div>

      </Modal>

      {/* ======================================================
          WALLET DETAILS MODAL
      ======================================================= */}

      <Modal
        open={!!detailsWallet}
        onClose={() =>
          setDetailsWallet(null)
        }
      >

        {detailsWallet && (
          <div className="p-6 w-full max-w-xl">

            {(() => {
              const meta =
                getChainMeta(
                  detailsWallet.chain,
                );

              return (
                <>
                  <div className="flex items-start justify-between mb-6">

                    <div className="flex items-center gap-3">

                      <div
                        className={`
                          w-12
                          h-12
                          rounded-xl
                          border
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-bold
                          ${meta.bg}
                          ${meta.border}
                          ${meta.color}
                        `}
                      >
                        {meta.shortName}
                      </div>

                      <div>

                        <h2 className="text-lg font-semibold text-ink-50">
                          {meta.name}
                        </h2>

                        <p className="text-sm text-ink-400">
                          Wallet details
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        setDetailsWallet(
                          null,
                        )
                      }
                      className="p-2 rounded-lg text-ink-400 hover:text-ink-50 hover:bg-ink-800"
                    >
                      <X className="w-5 h-5" />
                    </button>

                  </div>

                  <div className="space-y-4">

                    {/* STATUS */}

                    <div className="p-4 rounded-xl bg-ink-900 border border-ink-700">

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-ink-500">
                          Status
                        </span>

                        <Badge
                          variant={
                            detailsWallet.status ===
                              'verified'
                              ? 'success'
                              : 'warning'
                          }
                          dot
                        >
                          {getStatusLabel(
                            detailsWallet.status,
                          )}
                        </Badge>

                      </div>

                    </div>

                    {/* CHAIN */}

                    <div className="p-4 rounded-xl bg-ink-900 border border-ink-700">

                      <div className="flex items-center gap-3">

                        <Globe className="w-4 h-4 text-brand-400" />

                        <div>

                          <p className="text-xs text-ink-500">
                            Blockchain
                          </p>

                          <p className="text-sm text-ink-100 mt-0.5">
                            {meta.name}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* NETWORK */}

                    <div className="p-4 rounded-xl bg-ink-900 border border-ink-700">

                      <div className="flex items-center gap-3">

                        <Link2 className="w-4 h-4 text-accent-400" />

                        <div>

                          <p className="text-xs text-ink-500">
                            Network
                          </p>

                          <p className="text-sm text-ink-100 mt-0.5">
                            {detailsWallet.network}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ADDRESS */}

                    <div className="p-4 rounded-xl bg-ink-900 border border-ink-700">

                      <div className="flex items-center justify-between mb-2">

                        <p className="text-xs text-ink-500">
                          Wallet Address
                        </p>

                        <button
                          onClick={() =>
                            copyAddress(
                              detailsWallet.address,
                            )
                          }
                          className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>

                      </div>

                      <code className="block text-xs font-mono text-ink-100 break-all leading-relaxed">
                        {detailsWallet.address}
                      </code>

                    </div>

                    {/* LINKED DATE */}

                    <div className="p-4 rounded-xl bg-ink-900 border border-ink-700">

                      <div className="flex items-center gap-3">

                        <Clock3 className="w-4 h-4 text-warning-400" />

                        <div>

                          <p className="text-xs text-ink-500">
                            Linked At
                          </p>

                          <p className="text-sm text-ink-100 mt-0.5">
                            {formatDate(
                              detailsWallet.linkedAt,
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="flex gap-3 mt-6">

                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() =>
                        setDetailsWallet(
                          null,
                        )
                      }
                    >
                      Close
                    </Button>

                    <Button
                      className="flex-1"
                      icon={
                        <Pencil className="w-4 h-4" />
                      }
                      onClick={() => {
                        const wallet =
                          detailsWallet;

                        setDetailsWallet(
                          null,
                        );

                        openEdit(wallet);
                      }}
                    >
                      Edit Wallet
                    </Button>

                  </div>
                </>
              );
            })()}

          </div>
        )}

      </Modal>

      {/* ======================================================
          EDIT WALLET MODAL
      ======================================================= */}

      <Modal
        open={!!editWallet}
        onClose={closeEdit}
      >

        {editWallet && (

          <div className="p-6 w-full max-w-xl">

            <div className="flex items-start justify-between mb-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">

                  <Pencil className="w-5 h-5 text-brand-400" />

                </div>

                <div>

                  <h2 className="text-lg font-semibold text-ink-50">
                    Edit Wallet
                  </h2>

                  <p className="text-sm text-ink-400">
                    Update your wallet information.
                  </p>

                </div>

              </div>

              <button
                onClick={closeEdit}
                className="p-2 rounded-lg text-ink-400 hover:text-ink-50 hover:bg-ink-800"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="space-y-5">

              {/* CHAIN */}

              <div>

                <label className="block text-sm font-medium text-ink-200 mb-2">
                  Blockchain
                </label>

                <select
                  value={editChain}
                  onChange={(event) => {
                    const chain =
                      event.target
                        .value as Chain;

                    setEditChain(
                      chain,
                    );

                    const networks =
                      networkOptions[
                      chain
                      ] ?? [];

                    setEditNetwork(
                      networks[0] ?? '',
                    );
                  }}
                  className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 outline-none focus:border-brand-500"
                >

                  {supportedChains.map(
                    (chain) => (
                      <option
                        key={chain}
                        value={chain}
                      >
                        {
                          getChainMeta(
                            chain,
                          ).name
                        }
                      </option>
                    ),
                  )}

                </select>

              </div>

              {/* NETWORK */}

              <div>

                <label className="block text-sm font-medium text-ink-200 mb-2">
                  Network
                </label>

                <select
                  value={editNetwork}
                  onChange={(event) =>
                    setEditNetwork(
                      event.target
                        .value,
                    )
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 outline-none focus:border-brand-500"
                >

                  {(
                    networkOptions[
                    editChain
                    ] ?? []
                  ).map(
                    (network) => (
                      <option
                        key={network}
                        value={network}
                      >
                        {network}
                      </option>
                    ),
                  )}

                </select>

              </div>

              {/* ADDRESS */}

              <div>

                <label className="block text-sm font-medium text-ink-200 mb-2">
                  Wallet Address
                </label>

                <input
                  value={editAddress}
                  onChange={(event) =>
                    setEditAddress(
                      event.target
                        .value,
                    )
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 placeholder:text-ink-600 outline-none focus:border-brand-500 font-mono text-sm"
                />

                <p className="text-xs text-ink-500 mt-1.5">
                  Changing the address may require wallet ownership verification again.
                </p>

              </div>

              {/* WARNING */}

              <div className="p-4 rounded-xl bg-warning-500/5 border border-warning-500/20">

                <div className="flex gap-3">

                  <AlertTriangle className="w-4 h-4 text-warning-400 mt-0.5 shrink-0" />

                  <p className="text-xs text-ink-400 leading-relaxed">
                    Only add wallet addresses that you control. Your backend should re-verify ownership whenever a wallet address changes.
                  </p>

                </div>

              </div>

            </div>

            <div className="flex gap-3 mt-7">

              <Button
                variant="secondary"
                className="flex-1"
                onClick={closeEdit}
                disabled={updating}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                onClick={saveEdit}
                disabled={updating}
                icon={
                  updating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )
                }
              >
                {updating
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>

            </div>

          </div>

        )}

      </Modal>

      {/* ======================================================
          UNLINK MODAL
      ======================================================= */}

      <Modal
        open={!!unlinkTarget}
        onClose={() => {
          if (!deleting) {
            setUnlinkTarget(
              null,
            );
          }
        }}
      >

        {unlinkTarget && (

          <div className="p-6 w-full max-w-md">

            <div className="flex items-start gap-3 mb-5">

              <div className="w-10 h-10 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center shrink-0">

                <Unlink className="w-5 h-5 text-danger-400" />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-ink-50">
                  Unlink Wallet
                </h2>

                <p className="text-sm text-ink-400 mt-1">
                  Remove this wallet from your NID identity.
                </p>

              </div>

            </div>

            <div className="p-4 rounded-xl bg-ink-900 border border-ink-700 mb-5">

              <div className="flex items-center gap-3 mb-3">

                <div
                  className={`
                    w-10
                    h-10
                    rounded-lg
                    border
                    flex
                    items-center
                    justify-center
                    text-[10px]
                    font-bold
                    ${getChainMeta(
                    unlinkTarget.chain,
                  ).bg
                    }
                    ${getChainMeta(
                      unlinkTarget.chain,
                    ).border
                    }
                    ${getChainMeta(
                      unlinkTarget.chain,
                    ).color
                    }
                  `}
                >
                  {
                    getChainMeta(
                      unlinkTarget.chain,
                    ).shortName
                  }
                </div>

                <div>

                  <p className="text-sm font-medium text-ink-100">
                    {
                      getChainMeta(
                        unlinkTarget.chain,
                      ).name
                    }
                  </p>

                  <p className="text-xs text-ink-500">
                    {unlinkTarget.network}
                  </p>

                </div>

              </div>

              <code className="text-xs font-mono text-ink-300 break-all">
                {unlinkTarget.address}
              </code>

            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-6">

              <Shield className="w-4 h-4 text-danger-400 shrink-0" />

              <span className="text-xs text-ink-300">
                Applications relying on this wallet may lose access to your NID identity.
              </span>

            </div>

            <div className="flex gap-3">

              <Button
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  setUnlinkTarget(
                    null,
                  )
                }
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                className="flex-1"
                onClick={
                  confirmUnlink
                }
                disabled={deleting}
                icon={
                  deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Unlink className="w-4 h-4" />
                  )
                }
              >
                {deleting
                  ? 'Unlinking...'
                  : 'Unlink Wallet'}
              </Button>

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}
