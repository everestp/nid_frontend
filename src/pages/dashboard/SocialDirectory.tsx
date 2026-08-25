// src/pages/dashboard/SocialDirectory.tsx

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AtSign,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Github,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Send,
  Shield,
  Trash2,
  Twitter,
  Users,
  X,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Modal } from '@/components/ui/Modal';

import { useToast } from '@/context/ToastContext';

import {
  socialApi,
  type SocialIdentity,
  type CreateSocialRequest,
} from '@/api/socialApi';

// ============================================================================
// PLATFORM CONFIG
// ============================================================================

type PlatformConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
};

const platformMap: Record<string, PlatformConfig> = {
  twitter: {
    label: 'Twitter/X',
    icon: <Twitter className="w-5 h-5" />,
    color:
      'bg-brand-500/10 border-brand-500/20 text-brand-400',
  },

  discord: {
    label: 'Discord',
    icon: <MessageCircle className="w-5 h-5" />,
    color:
      'bg-accent-500/10 border-accent-500/20 text-accent-400',
  },

  github: {
    label: 'GitHub',
    icon: <Github className="w-5 h-5" />,
    color:
      'bg-ink-700 border-ink-600 text-ink-100',
  },

  telegram: {
    label: 'Telegram',
    icon: <Send className="w-5 h-5" />,
    color:
      'bg-brand-500/10 border-brand-500/20 text-brand-300',
  },

  farcaster: {
    label: 'Farcaster',
    icon: <AtSign className="w-5 h-5" />,
    color:
      'bg-warning-500/10 border-warning-500/20 text-warning-400',
  },

  email: {
    label: 'Email',
    icon: <Mail className="w-5 h-5" />,
    color:
      'bg-success-500/10 border-success-500/20 text-success-400',
  },

  phone: {
    label: 'Phone',
    icon: <Phone className="w-5 h-5" />,
    color:
      'bg-success-500/10 border-success-500/20 text-success-400',
  },

  website: {
    label: 'Website',
    icon: <Globe className="w-5 h-5" />,
    color:
      'bg-ink-700 border-ink-600 text-ink-200',
  },

  instagram: {
    label: 'Instagram',
    icon: <AtSign className="w-5 h-5" />,
    color:
      'bg-brand-500/10 border-brand-500/20 text-brand-300',
  },

  facebook: {
    label: 'Facebook',
    icon: <Users className="w-5 h-5" />,
    color:
      'bg-brand-500/10 border-brand-500/20 text-brand-300',
  },

  linkedin: {
    label: 'LinkedIn',
    icon: <Users className="w-5 h-5" />,
    color:
      'bg-brand-500/10 border-brand-500/20 text-brand-300',
  },

  tiktok: {
    label: 'TikTok',
    icon: <AtSign className="w-5 h-5" />,
    color:
      'bg-ink-700 border-ink-600 text-ink-100',
  },

  reddit: {
    label: 'Reddit',
    icon: <MessageCircle className="w-5 h-5" />,
    color:
      'bg-warning-500/10 border-warning-500/20 text-warning-400',
  },

  youtube: {
    label: 'YouTube',
    icon: <Globe className="w-5 h-5" />,
    color:
      'bg-danger-500/10 border-danger-500/20 text-danger-400',
  },
};

// ============================================================================
// SUPPORTED PLATFORMS
// ============================================================================

const allPlatforms = [
  'twitter',
  'discord',
  'github',
  'telegram',
  'farcaster',
  'email',
  'phone',
  'website',
  'instagram',
  'facebook',
  'linkedin',
  'tiktok',
  'reddit',
  'youtube',
];

// ============================================================================
// HELPERS
// ============================================================================

function getPlatformConfig(platform?: string) {
  const normalizedPlatform = String(platform ?? '')
    .trim()
    .toLowerCase();

  return (
    platformMap[normalizedPlatform] ?? {
      label: platform || 'Unknown',
      icon: <AtSign className="w-5 h-5" />,
      color:
        'bg-ink-700 border-ink-600 text-ink-200',
    }
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SocialDirectory() {
  const { showToast } = useToast();

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  const [identities, setIdentities] = useState<
    SocialIdentity[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [addLoading, setAddLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [visibilityLoading, setVisibilityLoading] =
    useState<string | null>(null);

  const [addOpen, setAddOpen] =
    useState(false);

  const [removeTarget, setRemoveTarget] =
    useState<SocialIdentity | null>(null);

  const [newPlatform, setNewPlatform] =
    useState('twitter');

  const [newHandle, setNewHandle] =
    useState('');

  // ==========================================================================
  // LOAD SOCIAL IDENTITIES
  // ==========================================================================

  const loadSocials = async () => {
    try {
      setLoading(true);

      const response =
        await socialApi.getMySocials();

      setIdentities(response.socials ?? []);
    } catch (error) {
      console.error(
        'Failed to load social identities:',
        error,
      );

      showToast(
        'error',
        getErrorMessage(
          error,
          'Failed to load your social identities.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocials();
  }, []);

  // ==========================================================================
  // TOGGLE VISIBILITY
  // ==========================================================================

  const toggleVisible = async (identity: SocialIdentity) => {
    try {
      setVisibilityLoading(identity.id);

      const newVisibility = !identity.publicly_visible;

      await socialApi.toggleVisibility(
        identity.id,
        newVisibility
      );

      // IMPORTANT:
      // Do not replace the whole identity with the PATCH response.
      // Only update the field that changed.
      setIdentities((prev) =>
        prev.map((item) =>
          item.id === identity.id
            ? {
              ...item,
              publicly_visible: newVisibility,
            }
            : item
        )
      );

      showToast(
        'success',
        `${identity.platform} is now ${newVisibility ? 'publicly visible' : 'private'
        }.`
      );
    } catch (error) {
      console.error('Failed to toggle visibility:', error);

      showToast(
        'error',
        'Failed to update visibility.'
      );
    } finally {
      setVisibilityLoading(null);
    }
  };
  // ==========================================================================
  // ADD SOCIAL IDENTITY
  // ==========================================================================

  const addIdentity = async () => {
    const handle = newHandle.trim();

    if (!handle) {
      showToast(
        'error',
        'Handle or value is required.',
      );
      return;
    }

    try {
      setAddLoading(true);

      const data: CreateSocialRequest = {
        platform: newPlatform,
        handle,
        publicly_visible: true,
        metadata: {},
      };

      const identity =
        await socialApi.addSocial(data);

      setIdentities((prev) => [
        ...prev,
        identity,
      ]);

      setAddOpen(false);
      setNewHandle('');

      showToast(
        'success',
        `${getPlatformConfig(newPlatform).label} added successfully.`,
      );
    } catch (error) {
      console.error(
        'Failed to add social identity:',
        error,
      );

      showToast(
        'error',
        getErrorMessage(
          error,
          'Failed to add social identity.',
        ),
      );
    } finally {
      setAddLoading(false);
    }
  };

  // ==========================================================================
  // DELETE SOCIAL IDENTITY
  // ==========================================================================

  const removeIdentity = async () => {
    if (!removeTarget) {
      return;
    }

    try {
      setDeleteLoading(true);

      await socialApi.deleteSocial(
        removeTarget.id,
      );

      setIdentities((prev) =>
        prev.filter(
          (item) =>
            item.id !== removeTarget.id,
        ),
      );

      showToast(
        'success',
        `${removeTarget.platform} removed successfully.`,
      );

      setRemoveTarget(null);
    } catch (error) {
      console.error(
        'Failed to delete social identity:',
        error,
      );

      showToast(
        'error',
        getErrorMessage(
          error,
          'Failed to remove social identity.',
        ),
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================================================
  // COUNTS
  // ==========================================================================

  const publicCount = identities.filter(
    (identity) =>
      identity.publicly_visible,
  ).length;

  const verifiedCount = identities.filter(
    (identity) =>
      identity.verified,
  ).length;

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div>
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <PageHeader
        title="Social Directory"
        description="Universal keys — connect your social identities, contact info, and web presence to your .nid handle."
        actions={
          <Button
            icon={
              <Plus className="w-4 h-4" />
            }
            onClick={() => setAddOpen(true)}
          >
            Add Social Key
          </Button>
        }
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* ================================================================== */}
        {/* LEFT COLUMN                                                        */}
        {/* ================================================================== */}

        <div>
          {/* ---------------------------------------------------------------- */}
          {/* STATISTICS                                                       */}
          {/* ---------------------------------------------------------------- */}

          <div className="grid grid-cols-3 gap-3 mb-5">
            <Card
              className="p-4"
              delay={0}
            >
              <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">
                Total Keys
              </div>

              <div className="text-xl font-semibold text-ink-50">
                {identities.length}
              </div>
            </Card>

            <Card
              className="p-4"
              delay={0.03}
            >
              <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">
                Verified
              </div>

              <div className="text-xl font-semibold text-success-400">
                {verifiedCount}
              </div>
            </Card>

            <Card
              className="p-4"
              delay={0.06}
            >
              <div className="text-xs text-ink-400 uppercase tracking-wider mb-1">
                Public
              </div>

              <div className="text-xl font-semibold text-brand-300">
                {publicCount}
              </div>
            </Card>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* LOADING                                                          */}
          {/* ---------------------------------------------------------------- */}

          {loading && (
            <Card className="p-8">
              <div className="flex items-center justify-center gap-3 text-ink-400">
                <Loader2 className="w-5 h-5 animate-spin" />

                <span className="text-sm">
                  Loading social identities...
                </span>
              </div>
            </Card>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* EMPTY STATE                                                      */}
          {/* ---------------------------------------------------------------- */}

          {!loading &&
            identities.length === 0 && (
              <Card className="p-10">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-brand-400" />
                  </div>

                  <h3 className="text-sm font-semibold text-ink-50 mb-1">
                    No social identities
                  </h3>

                  <p className="text-sm text-ink-400 mb-5">
                    Connect your first social
                    identity to your .nid profile.
                  </p>

                  <Button
                    icon={
                      <Plus className="w-4 h-4" />
                    }
                    onClick={() =>
                      setAddOpen(true)
                    }
                  >
                    Add Social Key
                  </Button>
                </div>
              </Card>
            )}

          {/* ---------------------------------------------------------------- */}
          {/* IDENTITY LIST                                                    */}
          {/* ---------------------------------------------------------------- */}

          {!loading &&
            identities.length > 0 && (
              <div className="grid gap-3">
                <AnimatePresence>
                  {identities.map(
                    (identity, index) => {
                      const platform =
                        getPlatformConfig(
                          identity.platform,
                        );

                      const isVisibilityLoading =
                        visibilityLoading ===
                        identity.id;

                      return (
                        <motion.div
                          key={identity.id}
                          layout
                          initial={{
                            opacity: 0,
                            y: 12,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            x: -20,
                          }}
                          transition={{
                            delay:
                              index * 0.03,
                          }}
                        >
                          <Card
                            className="p-4"
                            hover
                          >
                            <div className="flex items-center gap-4">
                              {/* Platform icon */}

                              <div
                                className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${platform.color}`}
                              >
                                {
                                  platform.icon
                                }
                              </div>

                              {/* Identity */}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-ink-50">
                                    {
                                      platform.label
                                    }
                                  </span>

                                  {identity.verified ? (
                                    <Badge variant="success">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Verified
                                    </Badge>
                                  ) : (
                                    <Badge variant="warning">
                                      Unverified
                                    </Badge>
                                  )}
                                </div>

                                <div className="text-sm font-mono text-ink-300 mt-0.5 truncate">
                                  {
                                    identity.handle
                                  }
                                </div>
                              </div>

                              {/* Actions */}

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {identity.publicly_visible ? (
                                    <span className="flex items-center gap-1 text-xs text-ink-300">
                                      <Eye className="w-3.5 h-3.5" />
                                      Public
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-xs text-ink-400">
                                      <EyeOff className="w-3.5 h-3.5" />
                                      Private
                                    </span>
                                  )}

                                  {isVisibilityLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-ink-400" />
                                  ) : (
                                    <Toggle
                                      checked={
                                        identity.publicly_visible
                                      }
                                      onChange={() =>
                                        toggleVisible(
                                          identity,
                                        )
                                      }
                                      label="Public visibility"
                                    />
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setRemoveTarget(
                                      identity,
                                    )
                                  }
                                  className="p-1.5 rounded-md text-ink-400 hover:text-danger-400 hover:bg-ink-700 transition-colors"
                                  aria-label={`Remove ${identity.platform}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    },
                  )}
                </AnimatePresence>
              </div>
            )}
        </div>

        {/* ================================================================== */}
        {/* PROFILE PREVIEW                                                   */}
        {/* ================================================================== */}

        <div>
          <Card
            className="p-5 sticky top-6"
            delay={0.1}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-brand-400" />

              <h2 className="text-sm font-semibold text-ink-50">
                Shareable Profile Card
              </h2>
            </div>

            <p className="text-xs text-ink-400 mb-4">
              How third-party apps see your identity
              metadata
            </p>

            <div className="rounded-xl border border-ink-700 bg-ink-900/50 overflow-hidden">
              {/* Profile header */}

              <div className="p-4 border-b border-ink-700 bg-gradient-to-br from-brand-500/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-semibold text-white">
                    EP
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-ink-50">
                      Everest Paudel
                    </div>

                    <div className="text-xs font-mono text-brand-300">
                      everest.nid
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected keys */}

              <div className="p-4 space-y-2">
                <div className="text-xs text-ink-400 uppercase tracking-wider mb-2">
                  Connected Keys
                </div>

                {identities
                  .filter(
                    (identity) =>
                      identity.publicly_visible,
                  )
                  .map((identity) => {
                    const platform =
                      getPlatformConfig(
                        identity.platform,
                      );

                    return (
                      <div
                        key={identity.id}
                        className="flex items-center gap-2.5 py-1.5"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${platform.color}`}
                        >
                          <span className="[&>svg]:w-3.5 [&>svg]:h-3.5">
                            {
                              platform.icon
                            }
                          </span>
                        </div>

                        <span className="text-xs text-ink-200 flex-1 truncate font-mono">
                          {
                            identity.handle
                          }
                        </span>

                        {identity.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-success-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}

                {publicCount === 0 && (
                  <div className="text-xs text-ink-500 py-2">
                    No public keys visible
                  </div>
                )}
              </div>

              {/* Footer */}

              <div className="px-4 py-3 border-t border-ink-700 flex items-center gap-2">
                <Shield className="w-3 h-3 text-ink-400" />

                <span className="text-xs text-ink-400">
                  Verified via NID.xyz
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ADD SOCIAL MODAL                                                     */}
      {/* ==================================================================== */}

      <Modal
        open={addOpen}
        onClose={() => {
          if (!addLoading) {
            setAddOpen(false);
          }
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-ink-50">
                Add Social Key
              </h2>

              <p className="text-sm text-ink-300">
                Connect a social identity to your
                .nid handle
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Platform */}

            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">
                Platform
              </label>

              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {allPlatforms.map(
                  (platformName) => {
                    const platform =
                      getPlatformConfig(
                        platformName,
                      );

                    const selected =
                      newPlatform ===
                      platformName;

                    return (
                      <button
                        key={platformName}
                        type="button"
                        onClick={() =>
                          setNewPlatform(
                            platformName,
                          )
                        }
                        disabled={addLoading}
                        className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg border transition-colors ${selected
                            ? platform.color
                            : 'bg-ink-800/50 border-ink-700 text-ink-400 hover:text-ink-50'
                          } ${addLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                          }`}
                      >
                        {platform.icon}

                        <span className="text-[10px] font-medium">
                          {platform.label}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Handle */}

            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">
                Handle / Value
              </label>

              <input
                type="text"
                value={newHandle}
                onChange={(event) =>
                  setNewHandle(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' &&
                    !addLoading
                  ) {
                    event.preventDefault();
                    addIdentity();
                  }
                }}
                placeholder="@username or email@example.com"
                disabled={addLoading}
                className="w-full bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 transition-colors font-mono disabled:opacity-50"
              />
            </div>

            {/* Verification info */}

            <div className="flex items-center gap-2 p-3 rounded-lg bg-ink-800/50 border border-ink-700">
              <Shield className="w-4 h-4 text-ink-400 shrink-0" />

              <span className="text-xs text-ink-300">
                A verification challenge will be
                sent to confirm ownership.
              </span>
            </div>

            {/* Buttons */}

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  setAddOpen(false)
                }
                disabled={addLoading}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                icon={
                  addLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )
                }
                onClick={addIdentity}
                disabled={
                  addLoading ||
                  !newHandle.trim()
                }
              >
                {addLoading
                  ? 'Adding...'
                  : 'Add Key'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ==================================================================== */}
      {/* REMOVE MODAL                                                         */}
      {/* ==================================================================== */}

      <Modal
        open={!!removeTarget}
        onClose={() => {
          if (!deleteLoading) {
            setRemoveTarget(null);
          }
        }}
      >
        {removeTarget && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
                <X className="w-5 h-5 text-danger-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink-50">
                  Remove Social Key
                </h2>

                <p className="text-sm text-ink-300">
                  Disconnect{' '}
                  <span className="text-ink-100">
                    {removeTarget.platform}
                  </span>{' '}
                  ({removeTarget.handle})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-5">
              <span className="text-xs text-ink-300">
                Apps using this key for verification
                will lose access. This cannot be
                undone.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  setRemoveTarget(null)
                }
                disabled={deleteLoading}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                className="flex-1"
                onClick={removeIdentity}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  'Remove Key'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
