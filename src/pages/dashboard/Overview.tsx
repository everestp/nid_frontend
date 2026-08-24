import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  AtSign,
  Link2,
  KeyRound,
  Activity as ActivityIcon,
  CheckCircle2,
  Shield,
  Fingerprint,
  ArrowUpRight,
  ArrowRightLeft,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard, Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  RECENT_LOGINS,
  AUTH_CHART_24H,
  AUTH_CHART_7D,
  AUTH_CHART_30D,
  AUTH_CHART_90D,
  PAYMENT_ROUTES,
  SOCIAL_IDENTITIES,
} from '@/data/mockData';
import type { AuthPoint } from '@/types';

const chartData: Record<string, AuthPoint[]> = {
  '24H': AUTH_CHART_24H,
  '7D': AUTH_CHART_7D,
  '30D': AUTH_CHART_30D,
  '90D': AUTH_CHART_90D,
};

export function Overview() {
  const [timeRange, setTimeRange] = useState<keyof typeof chartData>('24H');
  const data = chartData[timeRange];

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Your NID identity dashboard — handles, wallets, sessions, and authentication activity."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Handle" value="everest.nid" icon={<AtSign className="w-4 h-4" />} subtext="Primary identity" accent="brand" delay={0} />
        <StatCard label="Linked Wallets" value="2" icon={<Link2 className="w-4 h-4" />} subtext="Solana + Ethereum" accent="accent" delay={0.05} />
        <StatCard label="Payment Routes" value={PAYMENT_ROUTES.length} icon={<ArrowRightLeft className="w-4 h-4" />} subtext="Across 2 chains" accent="success" delay={0.1} />
        <StatCard label="Social Keys" value={SOCIAL_IDENTITIES.length} icon={<Users className="w-4 h-4" />} subtext={`${SOCIAL_IDENTITIES.filter((s) => s.verified).length} verified`} accent="warning" delay={0.15} />
      </div>

      {/* Chart */}
      <Card className="p-6 mb-8" delay={0.2}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-ink-50">Authentication Requests</h2>
            <p className="text-sm text-ink-300 mt-0.5">Authentication attempts over time</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-800/50 border border-ink-700">
            {(Object.keys(chartData) as (keyof typeof chartData)[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-brand-600 text-white'
                    : 'text-ink-300 hover:text-ink-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d0d10',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f4f4f5',
                }}
                labelStyle={{ color: '#a1a1aa' }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorRequests)"
                name="Requests"
              />
              <Area
                type="monotone"
                dataKey="success"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorSuccess)"
                name="Successful"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent logins */}
      <Card className="p-6" delay={0.25}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink-50">Recent App Logins</h2>
          <button className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          {RECENT_LOGINS.map((login, i) => (
            <motion.div
              key={login.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-ink-800/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-sm font-semibold text-ink-200 shrink-0">
                {login.appName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink-50">{login.appName}</div>
                <div className="text-xs text-ink-400 flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{login.handle}</span>
                  <span>·</span>
                  <span>{login.time}</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="neutral" className="font-mono">{login.protocol}</Badge>
                <Badge variant="brand" className="font-mono">
                  <Fingerprint className="w-3 h-3" /> {login.method}
                </Badge>
              </div>
              <Badge variant="success" dot>Success</Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
