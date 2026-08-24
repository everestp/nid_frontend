import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity as ActivityIcon,
  LogIn,
  Shield,
  Link2,
  Code2,
  AtSign,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ACTIVITY_EVENTS } from '@/data/mockData';
import type { ActivityEvent } from '@/types';

type FilterTab = 'all' | 'login' | 'security' | 'wallet' | 'sdk';

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'login', label: 'Logins' },
  { key: 'security', label: 'Security' },
  { key: 'wallet', label: 'Wallets' },
  { key: 'sdk', label: 'SDK' },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  login: { icon: <LogIn className="w-4 h-4" />, color: 'text-brand-400 bg-brand-500/10', label: 'Login' },
  security: { icon: <Shield className="w-4 h-4" />, color: 'text-success-400 bg-success-500/10', label: 'Security' },
  wallet: { icon: <Link2 className="w-4 h-4" />, color: 'text-accent-400 bg-accent-500/10', label: 'Wallet' },
  sdk: { icon: <Code2 className="w-4 h-4" />, color: 'text-warning-400 bg-warning-500/10', label: 'SDK' },
  handle: { icon: <AtSign className="w-4 h-4" />, color: 'text-brand-300 bg-brand-500/10', label: 'Handle' },
};

export function Activity() {
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = filter === 'all'
    ? ACTIVITY_EVENTS
    : ACTIVITY_EVENTS.filter((e) => e.type === filter);

  return (
    <div>
      <PageHeader title="Activity Log" description="Real-time feed of identity events across your NID account." />

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-800/50 border border-ink-700 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filter === tab.key ? 'bg-brand-600 text-white' : 'text-ink-300 hover:text-ink-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="p-6" delay={0}>
        <div className="flex items-center gap-2 mb-5">
          <ActivityIcon className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-ink-50">Event Feed</h2>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-ink-400">
            <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" /> Live
          </span>
        </div>

        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => {
              const config = typeConfig[event.type] || typeConfig.login;
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-ink-800/50 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink-100">{event.message}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="neutral" className="text-[10px]">{config.label}</Badge>
                      <span className="text-xs text-ink-400">{event.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <ActivityIcon className="w-8 h-8 text-ink-500 mx-auto mb-2" />
            <p className="text-sm text-ink-400">No events for this filter.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
