import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  AtSign,
  Fingerprint,
  Link2,
  Code2,
  Shield,
  CheckCircle2,
  Globe,
  Zap,
  Lock,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { handleApi } from '@/api/hadleApi';

export function Landing() {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();

  // State for the handle claim component
  const [handleInput, setHandleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const launchDashboard = () => {
    demoLogin();
    navigate('/dashboard');
  };

  // Handle live wallet sign & claim API interaction
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const cleanHandle = handleInput.trim().replace(/^@/, '').toLowerCase();

      // 1. Detect wallet provider (Phantom for Solana or EVM like MetaMask)
      const provider = (window as any).solana || (window as any).ethereum;
      if (!provider) {
        throw new Error('No crypto wallet found! Please install Phantom or MetaMask.');
      }

      let address = '';
      let chain = 'ethereum';

      if ((window as any).solana && provider.isPhantom) {
        const resp = await provider.connect();
        address = resp.publicKey.toString();
        chain = 'solana';
      } else {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        address = accounts[0];
        chain = 'evm'; // Matches backend expectation ('evm' or 'ethereum')
      }

      // 2. Exact message matched with backend expectation: fmt.Sprintf("Claim %s.nid", name)
      const message = `Claim ${cleanHandle}.nid`;

      // 3. Request wallet signature
      let signature = '';
      if (chain === 'solana') {
        const encodedMessage = new TextEncoder().encode(message);
        const signed = await provider.signMessage(encodedMessage, 'utf8');
        // Handle Solana signature formatting reliably
        const sigBytes = signed.signature || signed;
        signature = btoa(String.fromCharCode(...sigBytes));
      } else {
        signature = await provider.request({
          method: 'personal_sign',
          params: [message, address],
        });
      }

      console.log('This is the signature', signature);

      // 4. Make API call matching your backend's ClaimHandleRequest structure
      const response = await handleApi.claimHandle({
        handle: cleanHandle,  // Backend expects 'name', not 'handle'
        address: address,
        chain: chain,       // 'evm' or 'solana'
        message: message,   // Required for backend verification
        signature: signature,
      });

      if (response && (response as any).token) {
        localStorage.setItem('nid_token', (response as any).token);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to claim handle. It may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ink-800/50 bg-ink-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={36} />
          <div className="hidden md:flex items-center gap-8 text-sm text-ink-300">
            <a href="#features" className="hover:text-ink-50 transition-colors">Features</a>
            <a href="#sdk" className="hover:text-ink-50 transition-colors">SDK</a>
            <a href="#security" className="hover:text-ink-50 transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-ink-200 hover:text-ink-50 transition-colors px-4 py-2"
            >
              Sign in
            </button>
            <button
              onClick={launchDashboard}
              className="text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg transition-colors border border-brand-500/50"
            >
              Enter Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/50 to-ink-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink-700 bg-ink-900/50 text-xs text-ink-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
              Demo environment live
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              Sign in with Google
              <br />
              <span className="gradient-text">for Web3.</span>
            </h1>
            <p className="text-lg text-ink-300 leading-relaxed mb-8 max-w-xl">
              A universal Web3 identity and authentication protocol. Link multi-chain wallets,
              claim human-readable handles, and log into decentralized apps securely with passkeys.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={launchDashboard}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-brand-500/50 shadow-lg shadow-brand-900/30"
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 border border-ink-600 hover:border-ink-500 text-ink-100 hover:bg-ink-800 font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Explore SDK
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10 text-xs text-ink-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-400" /> No private keys shared
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-400" /> Multi-chain native
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-400" /> OIDC compliant
              </div>
            </div>
          </motion.div>

          {/* Hero visual: interactive claim handle box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="card-surface p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/10 rounded-full blur-[60px]" />
              <div className="relative space-y-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-ink-50 flex items-center gap-2">
                    <AtSign className="w-5 h-5 text-brand-400" />
                    Claim your .nid handle
                  </h3>
                  <p className="text-xs text-ink-400 mt-1">
                    Secure your universal identity across all chains instantly.
                  </p>
                </div>

                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-400 font-mono">
                      @
                    </div>
                    <input
                      type="text"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      placeholder="yourname"
                      className="w-full bg-ink-900 border border-ink-700 rounded-xl pl-8 pr-4 py-3 text-ink-100 placeholder-ink-500 focus:outline-none focus:border-brand-500 transition-colors font-mono text-sm"
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs text-ink-500 font-mono">
                      .nid
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs text-danger-400 bg-danger-500/10 border border-danger-500/20 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !handleInput.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:pointer-events-none text-white font-medium py-3 rounded-xl transition-colors border border-brand-500/50 shadow-lg shadow-brand-900/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting Wallet & Claiming...
                      </>
                    ) : (
                      <>
                        Claim Handle Now
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 border-t border-ink-800/80 flex items-center justify-between text-xs text-ink-400">
                  <span>Free registration</span>
                  <span className="text-success-400 font-mono">Available</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-ink-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Identity infrastructure for the decentralized web
            </h2>
            <p className="text-ink-300 max-w-2xl mx-auto">
              Four pillars that make NID the drop-in identity layer for any application.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<AtSign className="w-6 h-6" />}
              title="Human-Readable Handles"
              description="Claim a .nid handle that replaces opaque wallet addresses. Your identity is portable, memorable, and yours."
              delay={0}
            />
            <FeatureCard
              icon={<Link2 className="w-6 h-6" />}
              title="Multi-Chain Unified Profile"
              description="Link Solana and Ethereum wallets under a single identity. Authenticate once, prove ownership across chains."
              delay={0.1}
            />
            <FeatureCard
              icon={<Fingerprint className="w-6 h-6" />}
              title="Passwordless Security & Passkeys"
              description="FIDO2 passkeys and hardware keys replace passwords. Every authentication is a cryptographic challenge, not a shared secret."
              delay={0.2}
            />
            <FeatureCard
              icon={<Code2 className="w-6 h-6" />}
              title="Drop-In Developer SDK"
              description="Embed 'Sign in with NID' into any web application with two lines of code. OAuth/OIDC flows handled for you."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* SDK section */}
      <section id="sdk" className="py-24 px-6 border-t border-ink-800/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink-700 bg-ink-900/50 text-xs text-brand-300 mb-6">
              <Code2 className="w-3.5 h-3.5" /> Developer SDK
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Two lines of code.
              <br />
              Universal Web3 login.
            </h2>
            <p className="text-ink-300 mb-8 max-w-lg">
              Drop the NID SDK into any web application. Standard OAuth/OIDC flows,
              granular consent screens, and multi-chain wallet verification — all handled.
            </p>
            <div className="flex items-center gap-6">
              {['React', 'JavaScript', 'HTML', 'Vue', 'Svelte'].map((t) => (
                <span key={t} className="text-sm text-ink-400 font-mono">{t}</span>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-surface p-6 font-mono text-sm"
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ink-700">
              <div className="w-3 h-3 rounded-full bg-danger-500/60" />
              <div className="w-3 h-3 rounded-full bg-warning-500/60" />
              <div className="w-3 h-3 rounded-full bg-success-500/60" />
              <span className="text-ink-400 text-xs ml-2">index.html</span>
            </div>
            <pre className="text-ink-200 leading-relaxed overflow-x-auto"><code><span className="text-ink-400">{'<!-- Load the SDK -->'}</span>{'\n'}<span className="text-accent-400">{'<script'}</span> <span className="text-brand-300">src</span>=<span className="text-success-400">{'"https://nid.xyz/sdk.js"'}</span><span className="text-accent-400">{'></script>'}</span>{'\n\n'}<span className="text-accent-400">{'<nid-button'}</span> <span className="text-brand-300">client-id</span>=<span className="text-success-400">{'"nid_demo_client_123"'}</span> <span className="text-accent-400">{'/>'}</span></code></pre>
          </motion.div>
        </div>
      </section>

      {/* Security section */}
      <section id="security" className="py-24 px-6 border-t border-ink-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink-700 bg-ink-900/50 text-xs text-success-400 mb-6">
              <Shield className="w-3.5 h-3.5" /> Security First
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Your keys. Your identity. Your control.
            </h2>
            <p className="text-ink-300 max-w-2xl mx-auto">
              NID never stores private keys. Authentication is challenge-based, sessions are revocable,
              and privacy is granular.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <SecurityPillar icon={<Lock className="w-5 h-5" />} title="Passkey Authentication" description="FIDO2/WebAuthn passkeys replace passwords. No shared secrets, no phishing." />
            <SecurityPillar icon={<Shield className="w-5 h-5" />} title="Multi-Chain Isolation" description="Each chain operates independently. A compromised session on one chain doesn't affect others." />
            <SecurityPillar icon={<Zap className="w-5 h-5" />} title="Replay Protection" description="Every challenge uses a unique nonce. Signed challenges can't be replayed across applications." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-ink-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-surface p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-brand-600/10 rounded-full blur-[100px]" />
            <div className="relative">
              <Globe className="w-10 h-10 text-brand-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to explore?</h2>
              <p className="text-ink-300 mb-8 max-w-md mx-auto">
                Enter the demo environment and experience the full NID identity dashboard.
              </p>
              <button
                onClick={launchDashboard}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-8 py-3.5 rounded-xl transition-colors border border-brand-500/50 shadow-lg shadow-brand-900/30"
              >
                Enter Demo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-ink-800/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={32} />
          <p className="text-sm text-ink-400">Universal identity. Multi-chain. User-owned.</p>
          <div className="flex items-center gap-6 text-sm text-ink-400">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" /> Demo environment
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="card-surface glass-hover p-7 group"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-ink-50 mb-2">{title}</h3>
      <p className="text-ink-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function SecurityPillar({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card-surface glass-hover p-6"
    >
      <div className="w-10 h-10 rounded-lg bg-success-500/10 border border-success-500/20 flex items-center justify-center text-success-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink-50 mb-2">{title}</h3>
      <p className="text-sm text-ink-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}
