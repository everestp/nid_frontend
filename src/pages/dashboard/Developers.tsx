import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Zap,
  BookOpen,
  Terminal,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { API_KEYS } from '@/data/mockData';
import type { ApiKey } from '@/types';

const codeExamples = {
  HTML: { label: 'index.html', code: `<script src="https://nid.xyz/sdk.js"></script>\n<nid-button client-id="nid_demo_client_123" />` },
  React: { label: 'App.tsx', code: `import { NidButton } from '@nid/sdk-react';\n\nexport default function App() {\n  return <NidButton clientId="nid_demo_client_123" />;\n}` },
  JavaScript: { label: 'app.js', code: `const nid = new NID({ clientId: 'nid_demo_client_123' });\n\nnid.signIn().then(session => {\n  console.log('Authenticated:', session.handle);\n});` },
};

type TabKey = keyof typeof codeExamples;

export function Developers() {
  const { showToast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>(API_KEYS);
  const [activeTab, setActiveTab] = useState<TabKey>('HTML');
  const [copied, setCopied] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const regenerateSecret = () => {
    setKeys((prev) => prev.map((k) => k.id === 'k2' ? { ...k, value: `nid_sk_live_${Math.random().toString(36).slice(2, 18)}` } : k));
    showToast('success', 'Secret API key regenerated.');
  };

  const createClientId = () => {
    showToast('success', 'New client ID created: nid_pk_live_demo_new');
  };

  return (
    <div>
      <PageHeader
        title="NID Developer SDK"
        description="Embed 'Sign in with NID' into any web application with two lines of code."
        actions={<Button icon={<Plus className="w-4 h-4" />} onClick={createClientId}>Create Client ID</Button>}
      />

      {/* Code examples */}
      <Card className="p-6 mb-6" delay={0}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-semibold text-ink-50">Quick Start</h2>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-800/50 border border-ink-700">
            {(Object.keys(codeExamples) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab ? 'bg-brand-600 text-white' : 'text-ink-300 hover:text-ink-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-ink-700 bg-ink-900/50 rounded-t-xl">
            <Terminal className="w-3.5 h-3.5 text-ink-400" />
            <span className="text-xs text-ink-400 font-mono">{codeExamples[activeTab].label}</span>
          </div>
          <pre className="rounded-b-xl bg-ink-900/80 border border-t-0 border-ink-700 p-4 text-sm font-mono text-ink-200 overflow-x-auto leading-relaxed">
            <code>{codeExamples[activeTab].code}</code>
          </pre>
          <button
            onClick={() => copy(codeExamples[activeTab].code, activeTab)}
            className="absolute top-10 right-3 p-2 rounded-lg bg-ink-800/80 border border-ink-700 text-ink-300 hover:text-ink-50 transition-colors"
          >
            {copied === activeTab ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="p-6 mb-6" delay={0.1}>
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-ink-50">API Keys</h2>
        </div>
        <div className="space-y-4">
          {keys.map((key) => (
            <div key={key.id} className="p-4 rounded-lg bg-ink-800/50 border border-ink-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ink-200">{key.label}</span>
                <Badge variant={key.id === 'k1' ? 'success' : 'warning'}>{key.id === 'k1' ? 'Publishable' : 'Secret'}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono text-ink-100 bg-ink-900/50 rounded-md px-3 py-2 border border-ink-700 truncate">
                  {key.masked && !showSecret ? '••••••••••••••••••••' : key.value}
                </code>
                {key.id === 'k2' && (
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="p-2 rounded-lg bg-ink-800 border border-ink-700 text-ink-300 hover:text-ink-50 transition-colors"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => copy(key.value, key.id)}
                  className="p-2 rounded-lg bg-ink-800 border border-ink-700 text-ink-300 hover:text-ink-50 transition-colors"
                >
                  {copied === key.id ? <Check className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-5">
          <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={createClientId}>
            Create Client ID
          </Button>
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={regenerateSecret}>
            Regenerate Secret
          </Button>
        </div>
      </Card>

      {/* Resources */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: <BookOpen className="w-5 h-5" />, title: 'Documentation', desc: 'Full API reference and guides', link: 'Read docs' },
          { icon: <Terminal className="w-5 h-5" />, title: 'API Reference', desc: 'OAuth/OIDC endpoints', link: 'View reference' },
          { icon: <Zap className="w-5 h-5" />, title: 'Quickstart', desc: 'Get running in 5 minutes', link: 'Get started' },
        ].map((r, i) => (
          <motion.div key={r.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
            <Card className="p-5" hover>
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3">
                {r.icon}
              </div>
              <h3 className="text-sm font-semibold text-ink-50 mb-1">{r.title}</h3>
              <p className="text-xs text-ink-400 mb-3">{r.desc}</p>
              <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">{r.link} →</button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
