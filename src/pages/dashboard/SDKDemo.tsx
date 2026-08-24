import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Fingerprint,
  Check,
  X,
  ArrowRight,
  Loader2,
  Shield,
  Lock,
  AtSign,
  Link2,
  Mail,
  Copy,
  CheckCheck,
  Zap,
  Users,
  ArrowRightLeft,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';

type FlowStep = 'idle' | 'handle' | 'challenge' | 'consent' | 'success';

const codeExamples = {
  HTML: `<script src="https://nid.xyz/sdk.js"></script>
<nid-button client-id="nid_demo_client_123" />`,
  React: `import { NidButton } from '@nid/sdk-react';

<NidButton clientId="nid_demo_client_123" />`,
  JavaScript: `const nid = new NID({ clientId: 'nid_demo_client_123' });
nid.signIn().then(session => console.log(session));`,
};

export function SDKDemo() {
  const { showToast } = useToast();
  const [flowOpen, setFlowOpen] = useState(false);
  const [step, setStep] = useState<FlowStep>('idle');
  const [handle, setHandle] = useState('');
  const [consents, setConsents] = useState({ eth: true, sol: true, email: false, socialKeys: false, paymentRouting: false });
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof typeof codeExamples>('HTML');

  const startFlow = () => {
    setFlowOpen(true);
    setStep('handle');
    setHandle('');
    setConsents({ eth: true, sol: true, email: false, socialKeys: false, paymentRouting: false });
  };

  const closeFlow = () => {
    setFlowOpen(false);
    setStep('idle');
  };

  const useDemoHandle = () => setHandle('everest.nid');

  const proceedToChallenge = () => {
    if (!handle.trim()) return;
    setStep('challenge');
    setTimeout(() => setStep('consent'), 2500);
  };

  const completeAuth = () => {
    setStep('success');
    setConnected(true);
    setTimeout(() => {
      showToast('success', `Authenticated as ${handle} on CyberDeck Studio.`);
    }, 500);
  };

  const disconnect = () => {
    setConnected(false);
    showToast('info', 'Disconnected from CyberDeck Studio.');
  };

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <PageHeader
        title="SDK Integration & Login Simulator"
        description="Experience the 'Sign in with NID' flow from a third-party application's perspective."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Simulator */}
        <Card className="p-6" delay={0}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-sm font-bold text-ink-200">C</div>
              <span className="text-sm font-semibold text-ink-50">CyberDeck Studio</span>
              <Badge variant="neutral">Third-party app</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-ink-700 bg-ink-900/50 overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-ink-700 bg-ink-800/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-danger-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-success-500/40" />
              </div>
              <div className="flex-1 ml-3 text-xs text-ink-400 font-mono truncate">
                https://cyberdeck.studio
              </div>
            </div>

            {/* App content */}
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/10 border border-ink-700 flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-8 h-8 text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold text-ink-50 mb-1">CyberDeck Studio</h3>
              <p className="text-sm text-ink-400 mb-6">A decentralized creative platform</p>

              {connected ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-success-500/10 border border-success-500/20">
                    <CheckCheck className="w-5 h-5 text-success-400" />
                    <span className="text-sm font-medium text-success-400">Connected as <span className="font-mono">{handle || 'everest.nid'}</span></span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-ink-400">
                    <span>Session active</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
                  </div>
                  <Button variant="outline" size="sm" icon={<X className="w-3.5 h-3.5" />} onClick={disconnect}>
                    Disconnect
                  </Button>
                </motion.div>
              ) : (
                <button
                  onClick={startFlow}
                  className="inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-brand-500/50 shadow-lg shadow-brand-900/30 group"
                >
                  <AtSign className="w-5 h-5" />
                  Sign in with NID
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Code examples */}
        <Card className="p-6" delay={0.1}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-ink-50">Integration Code</h3>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-800/50 border border-ink-700">
              {(Object.keys(codeExamples) as (keyof typeof codeExamples)[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab ? 'bg-brand-600 text-white' : 'text-ink-300 hover:text-ink-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <pre className="rounded-xl bg-ink-900/80 border border-ink-700 p-4 text-sm font-mono text-ink-200 overflow-x-auto leading-relaxed">
              <code>{codeExamples[activeTab]}</code>
            </pre>
            <button
              onClick={() => copyCode(codeExamples[activeTab], activeTab)}
              className="absolute top-3 right-3 p-2 rounded-lg bg-ink-800/80 border border-ink-700 text-ink-300 hover:text-ink-50 transition-colors"
            >
              {copied === activeTab ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-ink-800/50 border border-ink-700">
            <Zap className="w-4 h-4 text-warning-400 shrink-0" />
            <span className="text-xs text-ink-300">Two lines of code. Full OAuth/OIDC flow handled.</span>
          </div>
        </Card>
      </div>

      {/* Sign-in flow modal */}
      <Modal open={flowOpen} onClose={closeFlow} closeOnBackdrop={step !== 'challenge'} className="max-w-md">
        <div className="p-6">
          {/* Step 1: Handle prompt */}
          {step === 'handle' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <AtSign className="w-7 h-7 text-brand-400" />
                </div>
                <h2 className="text-lg font-semibold text-ink-50">Sign in with NID</h2>
                <p className="text-sm text-ink-300 mt-1">CyberDeck Studio is requesting your identity</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">Your .nid Handle</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && proceedToChallenge()}
                    placeholder="everest.nid"
                    className="w-full bg-ink-800/50 border border-ink-700 rounded-lg px-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all font-mono"
                  />
                </div>
                <button
                  onClick={useDemoHandle}
                  className="w-full text-xs text-brand-400 hover:text-brand-300 transition-colors py-1"
                >
                  Use Demo Handle (everest.nid)
                </button>
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={closeFlow}>Cancel</Button>
                  <Button className="flex-1" icon={<ArrowRight className="w-4 h-4" />} onClick={proceedToChallenge}>Continue</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Cryptographic challenge */}
          {step === 'challenge' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-accent-500/10 border border-accent-500/30 flex items-center justify-center mx-auto mb-5"
              >
                <Fingerprint className="w-8 h-8 text-accent-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-ink-50 mb-2">Cryptographic Challenge</h2>
              <p className="text-sm text-ink-300 mb-4">Verifying your identity with a passkey signature</p>
              <div className="flex items-center justify-center gap-2 text-xs text-ink-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Waiting for biometric confirmation...</span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Privacy consent */}
          {step === 'consent' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-success-400" />
                </div>
                <h2 className="text-lg font-semibold text-ink-50">Grant Access</h2>
                <p className="text-sm text-ink-300 mt-1">
                  <span className="text-ink-100">CyberDeck Studio</span> wants to access:
                </p>
              </div>
              <div className="space-y-2 mb-6">
                <ConsentRow
                  icon={<AtSign className="w-4 h-4" />}
                  label="Your .nid Handle"
                  value={handle || 'everest.nid'}
                  required
                />
                <ConsentToggle
                  icon={<Link2 className="w-4 h-4" />}
                  label="Share Ethereum Address"
                  value="0x71C2...3291"
                  checked={consents.eth}
                  onChange={(v) => setConsents({ ...consents, eth: v })}
                />
                <ConsentToggle
                  icon={<Link2 className="w-4 h-4" />}
                  label="Share Solana Address"
                  value="5Kx8Q...9pQ2"
                  checked={consents.sol}
                  onChange={(v) => setConsents({ ...consents, sol: v })}
                />
                <ConsentToggle
                  icon={<Mail className="w-4 h-4" />}
                  label="Share Email"
                  value="demo@nid.xyz"
                  checked={consents.email}
                  onChange={(v) => setConsents({ ...consents, email: v })}
                />
                <ConsentToggle
                  icon={<Users className="w-4 h-4" />}
                  label="Access Social Keys"
                  value="Twitter, GitHub, Telegram"
                  checked={consents.socialKeys}
                  onChange={(v) => setConsents({ ...consents, socialKeys: v })}
                />
                <ConsentToggle
                  icon={<ArrowRightLeft className="w-4 h-4" />}
                  label="Payment Routing Lookups"
                  value="Resolve .nid to payment endpoints"
                  checked={consents.paymentRouting}
                  onChange={(v) => setConsents({ ...consents, paymentRouting: v })}
                />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-ink-800/50 border border-ink-700 mb-4">
                <Lock className="w-4 h-4 text-ink-400 shrink-0" />
                <span className="text-xs text-ink-300">You can revoke this access at any time from your NID dashboard.</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="flex-1" onClick={closeFlow}>Deny</Button>
                <Button className="flex-1" icon={<Check className="w-4 h-4" />} onClick={completeAuth}>Authorize</Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto mb-5"
              >
                <Check className="w-8 h-8 text-success-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-ink-50 mb-2">Authentication Successful</h2>
              <p className="text-sm text-ink-300 mb-4">You are now signed in as <span className="font-mono text-brand-300">{handle || 'everest.nid'}</span></p>
              <div className="flex items-center justify-center gap-2 text-xs text-ink-400 mb-5">
                <span>Redirecting back to CyberDeck Studio...</span>
              </div>
              <Button className="mx-auto" onClick={closeFlow} icon={<ArrowRight className="w-4 h-4" />}>Return to App</Button>
            </motion.div>
          )}
        </div>
      </Modal>
    </div>
  );
}

function ConsentRow({ icon, label, value, required }: { icon: React.ReactNode; label: string; value: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-ink-800/50 border border-ink-700">
      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium text-ink-50">{label}</div>
        <div className="text-xs text-ink-400 font-mono">{value}</div>
      </div>
      {required ? (
        <Badge variant="neutral">Required</Badge>
      ) : (
        <Check className="w-4 h-4 text-success-400" />
      )}
    </div>
  );
}

function ConsentToggle({ icon, label, value, checked, onChange }: { icon: React.ReactNode; label: string; value: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
        checked ? 'bg-brand-500/10 border-brand-500/20' : 'bg-ink-800/50 border-ink-700'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${checked ? 'bg-brand-500/20 text-brand-300' : 'bg-ink-700 text-ink-400'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-ink-50">{label}</div>
        <div className="text-xs text-ink-400 font-mono">{value}</div>
      </div>
      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${checked ? 'bg-brand-600 border-brand-500' : 'border-ink-600'}`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
}
