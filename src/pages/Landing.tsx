import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  Moon,
  Sun,
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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('nid-theme');

    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      setIsDark(false);
      return;
    }

    if (savedTheme === 'dark') {
      document.documentElement.classList.remove('light');
      setIsDark(true);
      return;
    }

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (prefersDark) {
      document.documentElement.classList.remove('light');
      setIsDark(true);
    } else {
      document.documentElement.classList.add('light');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    setIsDark(nextIsDark);

    if (nextIsDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('nid-theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('nid-theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ink-800/50 bg-ink-950/70 backdrop-blur-xl theme-transition">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <Logo size={36} />

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm text-ink-300">
            <a
              href="#features"
              className="hover:text-ink-50 transition-colors"
            >
              Features
            </a>

            <a
              href="#sdk"
              className="hover:text-ink-50 transition-colors"
            >
              SDK
            </a>

            <a
              href="#security"
              className="hover:text-ink-50 transition-colors"
            >
              Security
            </a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.04 }}
              aria-label={
                isDark
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              title={
                isDark
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              className="
          relative
          w-9 h-9
          rounded-lg
          border border-ink-700
          bg-ink-800/50
          hover:bg-ink-800
          flex items-center justify-center
          text-ink-300
          hover:text-ink-50
          transition-all
          overflow-hidden
        "
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{
                      opacity: 0,
                      rotate: -90,
                      scale: 0.5,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: 90,
                      scale: 0.5,
                    }}
                    transition={{ duration: 0.18 }}
                  >
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{
                      opacity: 0,
                      rotate: 90,
                      scale: 0.5,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: -90,
                      scale: 0.5,
                    }}
                    transition={{ duration: 0.18 }}
                  >
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Sign In */}
            <button
              onClick={() => navigate('/login')}
              className="
          text-sm
          text-ink-200
          hover:text-ink-50
          transition-colors
          px-4 py-2
        "
            >
              Sign in
            </button>

            {/* Demo */}
            <button
              onClick={launchDashboard}
              className="
          text-sm
          font-medium
          text-white
          bg-brand-600
          hover:bg-brand-500
          px-4 py-2
          rounded-lg
          transition-colors
          border border-brand-500/50
        "
            >
              Enter Demo
            </button>

          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 px-6 grid-bg">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/60 to-ink-950 pointer-events-none" />

        <motion.div
          className="
      absolute
      top-20
      left-1/2
      -translate-x-1/2
      w-[500px]
      h-[300px]
      bg-brand-600/10
      rounded-full
      blur-[120px]
      pointer-events-none
    "
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* =====================================================
          LEFT — HERO CONTENT
      ====================================================== */}

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
            

              {/* Heading */}
              <h1
                className="
            text-5xl
            sm:text-6xl
            lg:text-[4.25rem]
            font-bold
            tracking-tight
            leading-[1.02]
            text-ink-50
            mb-6
          "
              >
                One identity.
                <br />

                <span className="gradient-text">
                  Every chain.
                </span>
              </h1>

              {/* Description */}
              <p
                className="
            text-lg
            sm:text-xl
            text-ink-300
            leading-relaxed
            max-w-xl
            mb-8
          "
              >
                Own a universal Web3 identity with a human-readable
                <span className="text-ink-100 font-medium">
                  {' '}@handle.nid
                </span>
                , connect wallets across chains, and authenticate
                into decentralized applications without sharing
                private keys.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  onClick={launchDashboard}
                  whileHover={{
                    y: -2,
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
              group
              inline-flex
              items-center
              gap-2
              bg-brand-600
              hover:bg-brand-500
              text-white
              font-medium
              px-6
              py-3.5
              rounded-xl
              transition-all
              border
              border-brand-500/50
              shadow-lg
              shadow-brand-900/30
            "
                >
                  Launch Dashboard

                  <ArrowRight
                    className="
                w-4
                h-4
                transition-transform
                group-hover:translate-x-1
              "
                  />
                </motion.button>

                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
              inline-flex
              items-center
              gap-2
              border
              border-ink-700
              hover:border-ink-500
              bg-ink-900/40
              hover:bg-ink-800/70
              text-ink-200
              hover:text-ink-50
              font-medium
              px-6
              py-3.5
              rounded-xl
              transition-all
            "
                >
                  Explore the protocol

                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Trust points */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.45,
                  duration: 0.5,
                }}
                className="
            flex
            flex-wrap
            gap-x-6
            gap-y-3
            mt-9
            text-xs
            text-ink-400
          "
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-400" />
                  No private keys shared
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-400" />
                  Multi-chain identity
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-400" />
                  OIDC compatible
                </div>
              </motion.div>

              {/* Mini ecosystem */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="flex items-center gap-4 mt-10"
              >
                <div className="flex -space-x-2">
                  {['S', 'E', 'P'].map((chain, index) => (
                    <motion.div
                      key={chain}
                      initial={{
                        opacity: 0,
                        scale: 0.5,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.7 + index * 0.1,
                      }}
                      className="
                  w-8
                  h-8
                  rounded-full
                  border-2
                  border-ink-950
                  bg-ink-800
                  flex
                  items-center
                  justify-center
                  text-[10px]
                  font-semibold
                  text-ink-200
                "
                    >
                      {chain}
                    </motion.div>
                  ))}
                </div>

                <span className="text-xs text-ink-500">
                  One identity across your Web3 stack
                </span>
              </motion.div>
            </motion.div>


            {/* =====================================================
          RIGHT — HANDLE CLAIM CARD
      ====================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.75,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative lg:pl-4"
            >
              {/* Floating glow */}
              <motion.div
                className="
            absolute
            -inset-8
            bg-brand-600/10
            rounded-[3rem]
            blur-3xl
            pointer-events-none
          "
                animate={{
                  opacity: [0.35, 0.65, 0.35],
                  scale: [0.98, 1.03, 0.98],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Floating card */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                <div
                  className="
              card-surface
              p-6
              sm:p-7
              relative
              overflow-hidden
              shadow-2xl
            "
                >
                  {/* Top glow */}
                  <div
                    className="
                absolute
                -top-20
                -right-20
                w-48
                h-48
                bg-brand-600/10
                rounded-full
                blur-3xl
                pointer-events-none
              "
                  />

                  <div className="relative">

                    {/* Card header */}
                    <div className="flex items-start justify-between mb-7">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="
                        w-9
                        h-9
                        rounded-lg
                        bg-brand-500/10
                        border
                        border-brand-500/20
                        flex
                        items-center
                        justify-center
                      "
                          >
                            <AtSign className="w-5 h-5 text-brand-400" />
                          </div>

                          <div>
                            <h3 className="text-base font-semibold text-ink-50">
                              Claim your identity
                            </h3>

                            <p className="text-[11px] text-ink-500">
                              Powered by nid.xyz
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-ink-400 leading-relaxed max-w-sm">
                          Choose a human-readable handle that belongs
                          to you across supported Web3 networks.
                        </p>
                      </div>

                      {/* Status */}
                      <div
                        className="
                    hidden sm:flex
                    items-center
                    gap-1.5
                    px-2
                    py-1
                    rounded-full
                    bg-success-500/10
                    border
                    border-success-500/20
                    text-[10px]
                    text-success-400
                  "
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-success-400" />
                        Live
                      </div>
                    </div>


                    {/* Claim form */}
                    <form
                      onSubmit={handleClaimSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-medium text-ink-300 mb-2">
                          Your Web3 handle
                        </label>

                        <div className="relative group">
                          <div
                            className="
                        absolute
                        inset-y-0
                        left-0
                        pl-4
                        flex
                        items-center
                        pointer-events-none
                        text-brand-400
                        font-mono
                        text-sm
                      "
                          >
                            @
                          </div>

                          <input
                            type="text"
                            value={handleInput}
                            onChange={(e) =>
                              setHandleInput(e.target.value)
                            }
                            placeholder="yourname"
                            disabled={loading}
                            className="
                        w-full
                        bg-ink-900/80
                        border
                        border-ink-700
                        rounded-xl
                        pl-9
                        pr-16
                        py-3.5
                        text-ink-100
                        placeholder:text-ink-500
                        focus:outline-none
                        focus:border-brand-500
                        focus:ring-2
                        focus:ring-brand-500/10
                        transition-all
                        font-mono
                        text-sm
                      "
                          />

                          <div
                            className="
                        absolute
                        inset-y-0
                        right-0
                        pr-4
                        flex
                        items-center
                        pointer-events-none
                        text-xs
                        text-ink-500
                        font-mono
                      "
                          >
                            .nid
                          </div>
                        </div>
                      </div>


                      {/* Error */}
                      {error && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                          }}
                          className="
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-danger-400
                      bg-danger-500/10
                      border
                      border-danger-500/20
                      p-3
                      rounded-lg
                    "
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />

                          <span>{error}</span>
                        </motion.div>
                      )}


                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={
                          loading ||
                          !handleInput.trim()
                        }
                        whileHover={
                          !loading && handleInput.trim()
                            ? { y: -1 }
                            : {}
                        }
                        whileTap={
                          !loading && handleInput.trim()
                            ? { scale: 0.99 }
                            : {}
                        }
                        className="
                    group
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-brand-600
                    hover:bg-brand-500
                    disabled:opacity-50
                    disabled:pointer-events-none
                    text-white
                    font-medium
                    py-3.5
                    rounded-xl
                    transition-all
                    border
                    border-brand-500/50
                    shadow-lg
                    shadow-brand-900/30
                  "
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Connecting wallet...
                          </>
                        ) : (
                          <>
                            Claim {handleInput.trim() || 'your'} handle
                            <ArrowRight
                              className="
                          w-4
                          h-4
                          transition-transform
                          group-hover:translate-x-1
                        "
                            />
                          </>
                        )}
                      </motion.button>
                    </form>


                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                      <div className="h-px bg-ink-800 flex-1" />

                      <span className="text-[10px] uppercase tracking-wider text-ink-500">
                        Identity preview
                      </span>

                      <div className="h-px bg-ink-800 flex-1" />
                    </div>


                    {/* Identity preview */}
                    <motion.div
                      whileHover={{
                        borderColor:
                          'rgba(99,102,241,0.35)',
                      }}
                      className="
                  rounded-xl
                  border
                  border-ink-700
                  bg-ink-900/50
                  p-4
                  transition-colors
                "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                      w-10
                      h-10
                      rounded-full
                      bg-gradient-to-br
                      from-brand-500
                      to-brand-700
                      flex
                      items-center
                      justify-center
                      text-white
                      font-semibold
                    "
                        >
                          {handleInput
                            ? handleInput
                              .charAt(0)
                              .toUpperCase()
                            : 'N'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-ink-100 truncate">
                              {handleInput
                                ? `@${handleInput}.nid`
                                : '@yourname.nid'}
                            </span>

                            <CheckCircle2 className="w-3.5 h-3.5 text-success-400 shrink-0" />
                          </div>

                          <p className="text-[11px] text-ink-500 mt-0.5">
                            Universal Web3 identity
                          </p>
                        </div>

                        <div
                          className="
                      hidden sm:flex
                      items-center
                      gap-1
                      text-[10px]
                      text-success-400
                    "
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Verified
                        </div>
                      </div>
                    </motion.div>


                    {/* Bottom info */}
                    <div
                      className="
                  flex
                  items-center
                  justify-between
                  pt-4
                  mt-4
                  border-t
                  border-ink-800/80
                  text-xs
                "
                    >
                      <span className="text-ink-500">
                        Registration
                      </span>

                      <span className="flex items-center gap-1.5 text-success-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-success-400" />
                        Available now
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>


              {/* Floating chain badges */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
                className="
            absolute
            -right-4
            top-12
            hidden
            xl:flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            border
            border-ink-700
            bg-ink-900/90
            backdrop-blur-xl
            shadow-xl
          "
              >
                <div className="w-6 h-6 rounded-full bg-ink-800 flex items-center justify-center text-[9px] font-bold text-ink-300">
                  SOL
                </div>

                <span className="text-[10px] text-ink-400">
                  Multi-chain
                </span>
              </motion.div>


              <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 1,
                  duration: 0.5,
                }}
                className="
            absolute
            -left-5
            bottom-12
            hidden
            xl:flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            border
            border-ink-700
            bg-ink-900/90
            backdrop-blur-xl
            shadow-xl
          "
              >
                <Shield className="w-4 h-4 text-success-400" />

                <span className="text-[10px] text-ink-400">
                  Non-custodial
                </span>
              </motion.div>
            </motion.div>
          </div>
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
