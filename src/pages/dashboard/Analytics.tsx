import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, AppWindow, Link2, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard, Card } from '@/components/ui/Card';
import {
  ANALYTICS_LOGIN_TREND,
  APP_DISTRIBUTION,
  CHAIN_BREAKDOWN,
  AUTH_CHART_24H,
  AUTH_CHART_7D,
  AUTH_CHART_30D,
  AUTH_CHART_90D,
} from '@/data/mockData';
import type { AuthPoint } from '@/types';

const chartData: Record<string, AuthPoint[]> = {
  '24H': AUTH_CHART_24H,
  '7D': AUTH_CHART_7D,
  '30D': AUTH_CHART_30D,
  '90D': AUTH_CHART_90D,
};

export function Analytics() {
  const [range, setRange] = useState<keyof typeof chartData>('7D');
  const data = chartData[range];

  return (
    <div>
      <PageHeader title="Analytics" description="Identity usage insights across applications, chains, and time." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Logins" value="1,482" icon={<Activity className="w-4 h-4" />} subtext="All time" accent="brand" delay={0} />
        <StatCard label="Unique Apps" value="12" icon={<AppWindow className="w-4 h-4" />} subtext="Connected" accent="accent" delay={0.05} />
        <StatCard label="Active Chains" value="2" icon={<Link2 className="w-4 h-4" />} subtext="Solana + Ethereum" accent="success" delay={0.1} />
        <StatCard label="Success Rate" value="99.8%" icon={<CheckCircle2 className="w-4 h-4" />} subtext="Last 30 days" accent="warning" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Logins over time */}
        <Card className="p-6 lg:col-span-2" delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-ink-50">Logins Over Time</h2>
              <p className="text-sm text-ink-300 mt-0.5">Authentication events by period</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-800/50 border border-ink-700">
              {(Object.keys(chartData) as (keyof typeof chartData)[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    range === r ? 'bg-brand-600 text-white' : 'text-ink-300 hover:text-ink-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d10', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px', color: '#f4f4f5' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} fill="url(#colorLogins)" name="Logins" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chain breakdown */}
        <Card className="p-6" delay={0.25}>
          <h2 className="text-lg font-semibold text-ink-50 mb-1">Chain Breakdown</h2>
          <p className="text-sm text-ink-300 mb-4">Solana vs Ethereum</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CHAIN_BREAKDOWN} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {CHAIN_BREAKDOWN.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d10', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px', color: '#f4f4f5' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            {CHAIN_BREAKDOWN.map((chain) => (
              <div key={chain.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                <span className="text-sm text-ink-200">{chain.name}</span>
                <span className="text-xs text-ink-400">{chain.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* App distribution */}
      <Card className="p-6" delay={0.3}>
        <h2 className="text-lg font-semibold text-ink-50 mb-1">App Distribution</h2>
        <p className="text-sm text-ink-300 mb-4">Authentication requests by application</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={APP_DISTRIBUTION} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d0d10', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px', color: '#f4f4f5' }}
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
