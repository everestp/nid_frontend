import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Eye, RotateCw, Fingerprint, Award } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';
import { PRIVACY_SETTINGS } from '@/data/mockData';
import type { PrivacySetting } from '@/types';

const settingIcons = [
  <Eye className="w-5 h-5" />,
  <RotateCw className="w-5 h-5" />,
  <Fingerprint className="w-5 h-5" />,
  <Award className="w-5 h-5" />,
];

export function Privacy() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<PrivacySetting[]>(PRIVACY_SETTINGS);

  const toggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          showToast('success', `${s.label} ${!s.enabled ? 'enabled' : 'disabled'}.`);
          return { ...s, enabled: !s.enabled };
        }
        return s;
      })
    );
  };

  return (
    <div>
      <PageHeader
        title="Granular Privacy Settings"
        description="Control exactly what information is shared with applications and how your identity is used."
      />

      <div className="grid gap-4">
        {settings.map((setting, i) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5" hover>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                  {settingIcons[i] || <Shield className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-ink-50">{setting.label}</h3>
                    {setting.enabled && <Badge variant="success">Enabled</Badge>}
                  </div>
                  <p className="text-sm text-ink-300 leading-relaxed">{setting.description}</p>
                </div>
                <Toggle checked={setting.enabled} onChange={() => toggle(setting.id)} label={setting.label} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-5 mt-6" delay={0.25}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-success-400 shrink-0" />
          <div>
            <div className="text-sm font-medium text-ink-50">Privacy by Design</div>
            <div className="text-xs text-ink-400 mt-0.5">NID enforces least-privilege access. Apps only receive what you explicitly consent to share, and you can revoke at any time.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
