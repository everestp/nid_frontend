import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  Fingerprint,
  Link2,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { useToast } from '@/context/ToastContext';
import { SECURITY_CHECKS, ACTIVITY_EVENTS } from '@/data/mockData';
import type { SecurityCheck } from '@/types';

const checkIcons = [
  <Fingerprint className="w-5 h-5" />,
  <Link2 className="w-5 h-5" />,
  <Clock className="w-5 h-5" />,
  <RefreshCw className="w-5 h-5" />,
  <ShieldCheck className="w-5 h-5" />,
];

const auditEvents = ACTIVITY_EVENTS.filter((e) => e.type === 'security').concat(
  ACTIVITY_EVENTS.filter((e) => e.type === 'wallet')
).slice(0, 6);

export function Security() {
  const { showToast } = useToast();
  const [checks, setChecks] = useState<SecurityCheck[]>(SECURITY_CHECKS);

  const toggle = (id: string) => {
    setChecks((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          showToast('success', `${c.label} ${!c.enabled ? 'enabled' : 'disabled'}.`);
          return { ...c, enabled: !c.enabled };
        }
        return c;
      })
    );
  };

  const enabledCount = checks.filter((c) => c.enabled).length;
  const score = Math.round((enabledCount / checks.length) * 100);

  return (
    <div>
      <PageHeader title="Security Center" description="Monitor your identity security posture and audit trail." />

      {/* Security score */}
      <Card className="p-6 mb-6" delay={0}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#27272a" strokeWidth="8" />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-ink-50">{score}</span>
              <span className="text-xs text-ink-400">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <ShieldCheck className="w-5 h-5 text-success-400" />
              <h2 className="text-lg font-semibold text-ink-50">Excellent Security Score</h2>
            </div>
            <p className="text-sm text-ink-300 mb-3">
              Your identity is well-protected. {enabledCount} of {checks.length} security checks are enabled.
            </p>
            <Badge variant="success" dot>Secure</Badge>
          </div>
        </div>
      </Card>

      {/* Security checks */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {checks.map((check, i) => (
          <motion.div
            key={check.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5" hover>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                  check.enabled ? 'bg-success-500/10 border-success-500/20 text-success-400' : 'bg-ink-800 border-ink-700 text-ink-400'
                }`}>
                  {checkIcons[i] || <Shield className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-ink-50">{check.label}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {check.enabled ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-success-400" /><span className="text-xs text-success-400">Enabled</span></>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5 text-ink-500" /><span className="text-xs text-ink-400">Disabled</span></>
                    )}
                  </div>
                </div>
                <Toggle checked={check.enabled} onChange={() => toggle(check.id)} label={check.label} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Audit log */}
      <Card className="p-6" delay={0.2}>
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-ink-50">Security Audit Log</h2>
        </div>
        <div className="space-y-2">
          {auditEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-ink-800/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center shrink-0">
                {event.type === 'security' ? (
                  <Shield className="w-4 h-4 text-success-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink-100">{event.message}</div>
                <div className="text-xs text-ink-400 mt-0.5">{event.timestamp}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
