import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card, StatCard } from '@/components/ui/Card';
import { userProfileApi, type UserDashboardResponse } from '@/api/userProfileApi';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  AtSign,
  Fingerprint,
  Globe,
  Link2,
  ShieldCheck,
  ShieldAlert,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function Overview() {
  const [dashboard, setDashboard] = useState<UserDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await userProfileApi.getDashboard();
        if (isMounted) {
          setDashboard(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard data.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute derived states from real backend data
  const primaryHandleObj = dashboard?.handles.find((h) => h.is_primary) || dashboard?.handles[0];
  const primaryHandle = primaryHandleObj ? `@${primaryHandleObj.handle}` : 'No Handle';
  const totalWallets = dashboard?.wallets.length || 0;
  const verifiedWallets = dashboard?.wallets.filter((w) => w.status === 'verified').length || 0;
  const verifiedSocials = dashboard?.socials.filter((s) => s.verified).length || 0;
  const totalSocials = dashboard?.socials.length || 0;
  const activeSessionsCount = dashboard?.active_sessions.length || 0;

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Overview"
          description="Your NID identity dashboard — handles, wallets, sessions, and authentication activity."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-ink-800/50 animate-pulse border border-ink-700" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-ink-800/50 animate-pulse border border-ink-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title="Overview"
          description="Your NID identity dashboard — handles, wallets, sessions, and authentication activity."
        />
        <Card className="p-6 text-center text-red-400">
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your NID identity dashboard — handles, wallets, sessions, and authentication activity."
      />

      {/* Real Metrics from Backend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Handle"
          value={primaryHandle}
          icon={<AtSign className="w-4 h-4" />}
          subtext={primaryHandleObj ? `${dashboard?.handles.length} total handles` : 'Not set'}
          accent="brand"
          delay={0}
        />
        <StatCard
          label="Linked Wallets"
          value={totalWallets.toString()}
          icon={<Link2 className="w-4 h-4" />}
          subtext={`${verifiedWallets} verified`}
          accent="accent"
          delay={0.05}
        />
        <StatCard
          label="Social Identities"
          value={totalSocials.toString()}
          icon={<Users className="w-4 h-4" />}
          subtext={`${verifiedSocials} verified`}
          accent="warning"
          delay={0.1}
        />
        <StatCard
          label="Active Sessions"
          value={activeSessionsCount.toString()}
          icon={<Globe className="w-4 h-4" />}
          subtext="Authorized OAuth apps"
          accent="success"
          delay={0.15}
        />
      </div>

      {/* Active App Logins & Sessions from Backend */}
      <Card className="p-6" delay={0.25}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink-50">Active OAuth Sessions</h2>
          <button className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {dashboard?.active_sessions.length === 0 ? (
          <div className="text-center py-8 text-ink-400 text-sm">
            No active OAuth app sessions found.
          </div>
        ) : (
          <div className="space-y-2">
            {dashboard?.active_sessions.map((session, i) => {
              const appName = session.client_name || session.client_id || 'Unknown Application';
              const formattedDate = session.last_used_at
                ? new Date(session.last_used_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : new Date(session.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                });

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-ink-800/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-sm font-semibold text-ink-200 shrink-0">
                    {appName[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink-50">{appName}</div>
                    <div className="text-xs text-ink-400 flex items-center gap-2 mt-0.5">
                      <span>Last active: {formattedDate}</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Badge variant="neutral" className="font-mono">
                      OAuth2 / OIDC
                    </Badge>
                    <Badge variant="brand" className="font-mono">
                      <Fingerprint className="w-3 h-3" /> PKCE
                    </Badge>
                  </div>
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
