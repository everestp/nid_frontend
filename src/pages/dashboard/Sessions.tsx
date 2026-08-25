import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound,
  X,
  Shield,
  Clock,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';

import { sessionApi } from '@/api/sessionApi';
import type { Session } from '@/api/sessionApi';

export function Sessions() {
  const { showToast } = useToast();

  // ============================================================
  // State
  // ============================================================

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  const [revokeTarget, setRevokeTarget] =
    useState<Session | null>(null);

  // ============================================================
  // Load Sessions
  // ============================================================

  const loadSessions = async () => {
    try {
      setLoading(true);

      const response = await sessionApi.list();

      if (response.success) {
        setSessions(response.sessions);
      } else {
        showToast(
          'error',
          'Failed to load authorized applications.',
        );
      }
    } catch (error) {
      console.error(
        'Failed to load sessions:',
        error,
      );

      showToast(
        'error',
        'Unable to load authorized applications.',
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Initial Load
  // ============================================================

  useEffect(() => {
    loadSessions();
  }, []);

  // ============================================================
  // Revoke Session
  // ============================================================

  const revoke = async () => {
    if (!revokeTarget || revoking) {
      return;
    }

    try {
      setRevoking(true);

      const response = await sessionApi.revoke(
        revokeTarget.id,
      );

      if (!response.success) {
        showToast(
          'error',
          response.message || 'Failed to revoke access.',
        );

        return;
      }

      // Remove from UI immediately
      setSessions((prev) =>
        prev.filter(
          (session) =>
            session.id !== revokeTarget.id,
        ),
      );

      showToast(
        'success',
        `Access revoked for ${revokeTarget.app_name}.`,
      );

      setRevokeTarget(null);
    } catch (error) {
      console.error(
        'Failed to revoke session:',
        error,
      );

      showToast(
        'error',
        'Failed to revoke application access.',
      );
    } finally {
      setRevoking(false);
    }
  };

  // ============================================================
  // Helpers
  // ============================================================

  const formatDate = (date: string) => {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return 'Unknown';
    }

    return value.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getAppIcon = (appName: string) => {
    return appName
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || 'A';
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div>
      <PageHeader
        title="Authorized Applications"
        description="Manage apps that have access to your NID identity via OAuth/OIDC."
      />

      {/* ======================================================
          Header Actions
      ======================================================= */}

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          icon={
            loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )
          }
          onClick={loadSessions}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* ======================================================
          Loading
      ======================================================= */}

      {loading && (
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-ink-400 mx-auto mb-3 animate-spin" />

          <h3 className="text-lg font-medium text-ink-200">
            Loading authorized applications
          </h3>

          <p className="text-sm text-ink-400 mt-1">
            Fetching your OAuth sessions...
          </p>
        </Card>
      )}

      {/* ======================================================
          Sessions
      ======================================================= */}

      {!loading && sessions.length > 0 && (
        <div className="grid gap-4">
          <AnimatePresence>
            {sessions.map((session, i) => (
              <motion.div
                key={session.id}
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
                  delay: i * 0.05,
                }}
                layout
              >
                <Card
                  className="p-5"
                  hover
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* ==========================================
                        App Information
                    =========================================== */}

                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-ink-800 border border-ink-700 flex items-center justify-center text-lg font-semibold text-ink-200 shrink-0">
                        {getAppIcon(
                          session.app_name,
                        )}
                      </div>

                      <div>
                        {/* App name + status */}

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold text-ink-50">
                            {session.app_name ||
                              'Unknown App'}
                          </span>

                          <Badge
                            variant={
                              session.status ===
                                'active'
                                ? 'success'
                                : 'neutral'
                            }
                            dot={
                              session.status ===
                              'active'
                            }
                          >
                            {session.status ===
                              'active'
                              ? 'Active'
                              : session.status
                                .charAt(0)
                                .toUpperCase() +
                              session.status.slice(
                                1,
                              )}
                          </Badge>

                          <Badge variant="brand">
                            OAuth / OIDC
                          </Badge>
                        </div>

                        {/* Client ID */}

                        {session.client_id && (
                          <div className="text-xs text-ink-400 mt-1">
                            Client ID:{' '}
                            <span className="text-ink-300">
                              {session.client_id}
                            </span>
                          </div>
                        )}

                        {/* Created time */}

                        <div className="text-xs text-ink-400 mt-1.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />

                          Authorized{' '}
                          {formatDate(
                            session.created_at,
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ==========================================
                        Actions
                    =========================================== */}

                    <div className="flex items-center gap-2">
                      {session.status ===
                        'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            icon={
                              <X className="w-3.5 h-3.5" />
                            }
                            onClick={() =>
                              setRevokeTarget(
                                session,
                              )
                            }
                          >
                            Revoke Access
                          </Button>
                        )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ======================================================
          Empty State
      ======================================================= */}

      {!loading &&
        sessions.length === 0 && (
          <Card className="p-12 text-center">
            <KeyRound className="w-10 h-10 text-ink-500 mx-auto mb-3" />

            <h3 className="text-lg font-medium text-ink-200">
              No authorized applications
            </h3>

            <p className="text-sm text-ink-400 mt-1">
              No applications currently have
              access to your NID identity.
            </p>
          </Card>
        )}

      {/* ======================================================
          Revoke Modal
      ======================================================= */}

      <Modal
        open={!!revokeTarget}
        onClose={() => {
          if (!revoking) {
            setRevokeTarget(null);
          }
        }}
      >
        {revokeTarget && (
          <div className="p-6">
            {/* ================================================
                Modal Header
            ================================================= */}

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-danger-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink-50">
                  Revoke Access
                </h2>

                <p className="text-sm text-ink-300">
                  Remove{' '}
                  <span className="text-ink-100">
                    {revokeTarget.app_name ||
                      'this application'}
                  </span>{' '}
                  access to your identity.
                </p>
              </div>
            </div>

            {/* ================================================
                Session Information
            ================================================= */}

            <div className="p-4 rounded-lg bg-ink-800/50 border border-ink-700 mb-5">
              <div className="text-xs text-ink-400 uppercase tracking-wider mb-3">
                Application
              </div>

              <div className="text-sm text-ink-100 font-medium">
                {revokeTarget.app_name ||
                  'Unknown App'}
              </div>

              {revokeTarget.client_id && (
                <div className="text-xs text-ink-400 mt-1 break-all">
                  Client ID:{' '}
                  {revokeTarget.client_id}
                </div>
              )}

              <div className="text-xs text-ink-400 mt-2">
                Authorized:{' '}
                {formatDate(
                  revokeTarget.created_at,
                )}
              </div>
            </div>

            {/* ================================================
                Warning
            ================================================= */}

            <div className="p-4 rounded-lg bg-danger-500/5 border border-danger-500/20 mb-5">
              <p className="text-sm text-ink-300">
                Revoking this application will
                invalidate its NID session. The
                application will need to authorize
                again to access your NID account.
              </p>
            </div>

            {/* ================================================
                Buttons
            ================================================= */}

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  setRevokeTarget(null)
                }
                disabled={revoking}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                className="flex-1"
                onClick={revoke}
                disabled={revoking}
              >
                {revoking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  'Revoke Access'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
