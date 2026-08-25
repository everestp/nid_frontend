
import { useEffect, useState, type ReactNode } from 'react';
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
  Sparkles,
  Wallet,
  ExternalLink,
} from 'lucide-react';

import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { handleApi } from '@/api/hadleApi';

export function Landing() {
  const navigate = useNavigate();

  // ============================================================
  // AUTH
  // ============================================================

  const { isAuthenticated, user } = useAuth();

  // ============================================================
  // HANDLE CLAIM
  // ============================================================

  const [handleInput, setHandleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // THEME
  // ============================================================

  const [isDark, setIsDark] = useState(true);

  // ============================================================
  // THEME INITIALIZATION
  // ============================================================

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
      '(prefers-color-scheme: dark)',
    ).matches;

    if (prefersDark) {
      document.documentElement.classList.remove('light');
      setIsDark(true);
    } else {
      document.documentElement.classList.add('light');
      setIsDark(false);
    }
  }, []);

  // ============================================================
  // THEME TOGGLE
  // ============================================================

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

  // ============================================================
  // DASHBOARD
  // ============================================================

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // ============================================================
  // AUTH BUTTON
  // ============================================================

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    navigate('/login');
  };

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const normalizedHandle = handleInput
    .trim()
    .replace(/^@/, '')
    .toLowerCase();

  // ============================================================
  // CLAIM HANDLE
  // ============================================================

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!normalizedHandle) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ----------------------------------------------------------
      // Detect wallet
      // ----------------------------------------------------------

      const solanaProvider = (window as any).solana;
      const ethereumProvider = (window as any).ethereum;

      if (!solanaProvider && !ethereumProvider) {
        throw new Error(
          'No crypto wallet found. Please install Phantom or MetaMask.',
        );
      }

      let address = '';
      let chain = '';
      let signature = '';

      // ----------------------------------------------------------
      // Solana
      // ----------------------------------------------------------

      if (solanaProvider?.isPhantom) {
        const response = await solanaProvider.connect();

        address = response.publicKey.toString();
        chain = 'solana';

        const message = `Claim ${ normalizedHandle }.nid`;

        const encodedMessage = new TextEncoder().encode(message);

        const signed = await solanaProvider.signMessage(
          encodedMessage,
          'utf8',
        );

        const signatureBytes = signed.signature || signed;

        signature = btoa(
          String.fromCharCode(...signatureBytes),
        );

        const apiResponse = await handleApi.claimHandle({
          handle: normalizedHandle,
          address,
          chain,
          message,
          signature,
        });

        if ((apiResponse as any)?.token) {
          localStorage.setItem(
            'nid_token',
            (apiResponse as any).token,
          );
        }

        navigate('/dashboard');
        return;
      }

      // ----------------------------------------------------------
      // EVM
      // ----------------------------------------------------------

      if (ethereumProvider) {
        const accounts = await ethereumProvider.request({
          method: 'eth_requestAccounts',
        });

        if (!accounts?.length) {
          throw new Error('No wallet account selected.');
        }

        address = accounts[0];
        chain = 'evm';

        const message = `Claim ${ normalizedHandle }.nid`;

        signature = await ethereumProvider.request({
          method: 'personal_sign',
          params: [message, address],
        });

        const apiResponse = await handleApi.claimHandle({
          handle: normalizedHandle,
          address,
          chain,
          message,
          signature,
        });

        if ((apiResponse as any)?.token) {
          localStorage.setItem(
            'nid_token',
            (apiResponse as any).token,
          );
        }

        navigate('/dashboard');
        return;
      }

      throw new Error('Unsupported wallet provider.');
    } catch (err: any) {
      console.error('Claim handle error:', err);

      setError(
        err?.message ||
          'Failed to claim handle. It may already be taken.',
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ANIMATION
  // ============================================================

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 overflow-x-hidden">

      {/* ======================================================
          BACKGROUND SYSTEM
      ======================================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-40" />

        {/* Main glow */}
        <motion.div
          className="
            absolute
            top-[-200px]
            left-1/2
            -translate-x-1/2
            w-[900px]
            h-[600px]
            rounded-full
            bg-brand-600/10
            blur-[140px]
          "
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Left orb */}
        <motion.div
          className="
            absolute
            top-[35%]
            left-[-150px]
            w-[400px]
            h-[400px]
            rounded-full
            bg-purple-600/10
            blur-[120px]
          "
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Right orb */}
        <motion.div
          className="
            absolute
            top-[50%]
            right-[-150px]
            w-[450px]
            h-[450px]
            rounded-full
            bg-blue-600/10
            blur-[130px]
          "
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* ======================================================
          NAVBAR
      ======================================================= */}

      <motion.nav
        initial={{
          y: -80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed
          top-0
          left-0
          right-0
          z-50
          border-b
          border-ink-800/50
          bg-ink-950/70
          backdrop-blur-2xl
          theme-transition
        "
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
          >
            <Logo size={36} />
          </motion.div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm text-ink-300">
            {[
              ['Features', '#features'],
              ['SDK', '#sdk'],
              ['Security', '#security'],
            ].map(([label, href]) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ y: -1 }}
                className="
        relative
        group
        hover:text-ink-50
        transition-colors
      "
              >
                {label}

                <span
                  className="
          absolute
          left-0
          -bottom-1
          h-px
          w-0
          bg-[var(--nid-brand)]
          group-hover:w-full
          transition-all
          duration-300
        "
                />
              </motion.a>
            ))}
          </div>
          {/* Actions */}

          <div className="flex items-center gap-2">

            {/* Theme */}

            <motion.button
              type="button"
              onClick={toggleTheme}
              whileTap={{
                scale: 0.9,
                rotate: 15,
              }}
              whileHover={{
                scale: 1.05,
              }}
              aria-label={
                isDark
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              className="
                relative
                w-9
                h-9
                rounded-lg
                border
                border-ink-700
                bg-ink-800/50
                hover:bg-ink-800
                flex
                items-center
                justify-center
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
                  >
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Authenticated user */}

            {isAuthenticated ? (
              <motion.button
                onClick={goToDashboard}
                whileHover={{
                  y: -2,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  group
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-white
                  bg-brand-600
                  hover:bg-brand-500
                  px-4
                  py-2
                  rounded-lg
                  transition-all
                  border
                  border-brand-500/50
                  shadow-lg
                  shadow-brand-900/20
                "
              >
                <span>
                  Go to Dashboard
                </span>

                <ArrowRight
                  className="
                    w-4
                    h-4
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    text-sm
                    text-ink-200
                    hover:text-ink-50
                    transition-colors
                    px-4
                    py-2
                  "
                >
                  Sign in
                </motion.button>

                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{
                    y: -2,
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-white
                    bg-brand-600
                    hover:bg-brand-500
                    px-4
                    py-2
                    rounded-lg
                    transition-all
                    border
                    border-brand-500/50
                    shadow-lg
                    shadow-brand-900/20
                  "
                >
                  Get started
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="relative pt-32 pb-28 px-6">

        <div className="relative max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* LEFT */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >

              {/* Badge */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                }}
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  border
                  border-brand-500/20
                  bg-brand-500/5
                  text-xs
                  text-brand-300
                  mb-7
                "
              >
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.span>

                The identity layer for Web3
              </motion.div>

              {/* Heading */}

              <h1
                className="
                  text-5xl
                  sm:text-6xl
                  lg:text-[4.6rem]
                  font-bold
                  tracking-tight
                  leading-[0.98]
                  text-ink-50
                  mb-7
                "
              >
                One identity.
                <br />

                <motion.span
                  className="gradient-text inline-block"
                  animate={{
                    backgroundPosition: [
                      '0% 50%',
                      '100% 50%',
                      '0% 50%',
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  Every chain.
                </motion.span>
              </h1>

              {/* Description */}

              <p
                className="
                  text-lg
                  sm:text-xl
                  text-ink-300
                  leading-relaxed
                  max-w-xl
                  mb-9
                "
              >
                Own a universal Web3 identity with a human-readable{' '}
                <span className="text-ink-100 font-medium">
                  @handle.nid
                </span>
                , connect wallets across chains, and authenticate
                into decentralized applications without sharing
                private keys.
              </p>

              {/* Buttons */}

              <div className="flex flex-wrap items-center gap-3">

                <motion.button
                  onClick={handleAuthAction}
                  whileHover={{
                    y: -3,
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.97,
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
                    shadow-xl
                    shadow-brand-900/30
                  "
                >
                  {isAuthenticated
                    ? 'Go to Dashboard'
                    : 'Get started'}

                  <ArrowRight
                    className="
                      w-4
                      h-4
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </motion.button>

                <motion.a
                  href="#features"
                  whileHover={{
                    y: -3,
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
                  Explore protocol
                  <ChevronRight className="w-4 h-4" />
                </motion.a>
              </div>

              {/* Trust */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.7,
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
                {[
                  'No private keys shared',
                  'Multi-chain identity',
                  'OIDC compatible',
                ].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{
                      x: 2,
                    }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-success-400" />
                    {item}
                  </motion.div>
                ))}
              </motion.div>

              {/* Identity mini visual */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.9,
                }}
                className="flex items-center gap-4 mt-10"
              >
                <div className="flex -space-x-2">
                  {['S', 'E', 'P', 'B'].map((chain, index) => (
                    <motion.div
                      key={chain}
                      initial={{
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay: 0.9 + index * 0.12,
                        type: 'spring',
                      }}
                      className="
                        w-9
                        h-9
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

            {/* =================================================
                RIGHT CLAIM CARD
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: 40,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >

              {/* Glow */}

              <motion.div
                className="
                  absolute
                  -inset-10
                  bg-brand-600/10
                  rounded-[4rem]
                  blur-3xl
                  pointer-events-none
                "
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Card */}

              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 6,
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

                  {/* Shine */}

                  <motion.div
                    className="
                      absolute
                      top-0
                      -left-[100%]
                      w-[50%]
                      h-full
                      bg-gradient-to-r
                      from-transparent
                      via-white/5
                      to-transparent
                      skew-x-12
                      pointer-events-none
                    "
                    animate={{
                      left: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: 'easeInOut',
                    }}
                  />

                  <div className="relative">

                    {/* Header */}

                    <div className="flex items-start justify-between mb-7">

                      <div>
                        <div className="flex items-center gap-2 mb-2">

                          <motion.div
                            whileHover={{
                              rotate: 8,
                              scale: 1.08,
                            }}
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-brand-500/10
                              border
                              border-brand-500/20
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <AtSign className="w-5 h-5 text-brand-400" />
                          </motion.div>

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

                      <div
                        className="
                          hidden
                          sm:flex
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
                        <motion.span
                          animate={{
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                          className="
                            w-1.5
                            h-1.5
                            rounded-full
                            bg-success-400
                          "
                        />
                        Live
                      </div>
                    </div>

                    {/* Form */}

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
                            "
                          >
                            @
                          </div>

                          <input
                            type="text"
                            value={handleInput}
                            onChange={(e) => {
                              setHandleInput(
                                e.target.value
                                  .replace(/\s/g, '')
                                  .replace(/^@/, ''),
                              );
                              setError(null);
                            }}
                            placeholder="yourname"
                            disabled={loading}
                            autoComplete="off"
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

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: -8,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              height: 'auto',
                            }}
                            exit={{
                              opacity: 0,
                              y: -8,
                              height: 0,
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
                      </AnimatePresence>

                      {/* Submit */}

                      <motion.button
                        type="submit"
                        disabled={loading || !normalizedHandle}
                        whileHover={
                          !loading && normalizedHandle
                            ? {
                                y: -2,
                                scale: 1.01,
                              }
                            : {}
                        }
                        whileTap={
                          !loading && normalizedHandle
                            ? {
                                scale: 0.98,
                              }
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
                            Waiting for wallet...
                          </>
                        ) : (
                          <>
                            Claim{' '}
                            {normalizedHandle || 'your'} handle

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

                    {/* Identity */}

                    <motion.div
                      layout
                      className="
                        rounded-xl
                        border
                        border-ink-700
                        bg-ink-900/50
                        p-4
                      "
                    >
                      <div className="flex items-center gap-3">

                        <motion.div
                          layout
                          animate={{
                            scale: normalizedHandle ? [1, 1.08, 1] : 1,
                          }}
                          transition={{
                            duration: 0.5,
                          }}
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
                          {normalizedHandle
                            ? normalizedHandle
                                .charAt(0)
                                .toUpperCase()
                            : 'N'}
                        </motion.div>

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center gap-2">

                            <motion.span
                              key={normalizedHandle}
                              initial={{
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              className="
                                text-sm
                                font-medium
                                text-ink-100
                                truncate
                              "
                            >
                              {normalizedHandle
                                ? `@${ normalizedHandle }.nid`
                                : '@yourname.nid'}
                            </motion.span>

                            <CheckCircle2 className="w-3.5 h-3.5 text-success-400 shrink-0" />
                          </div>

                          <p className="text-[11px] text-ink-500 mt-0.5">
                            Universal Web3 identity
                          </p>
                        </div>

                        <div
                          className="
                            hidden
                            sm:flex
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
                        <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
                        Available now
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge */}

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="
                  absolute
                  -right-5
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

              {/* Floating badge */}

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -1, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
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

              {/* Wallet badge */}

              <motion.div
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="
                  absolute
                  right-8
                  -bottom-7
                  hidden
                  lg:flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-xl
                  border
                  border-brand-500/20
                  bg-brand-500/5
                  backdrop-blur-xl
                "
              >
                <Wallet className="w-4 h-4 text-brand-400" />

                <span className="text-[10px] text-brand-300">
                  Wallet verified
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FEATURES
      ======================================================= */}

      <section
        id="features"
        className="relative py-28 px-6 border-t border-ink-800/50"
      >
        <div className="max-w-7xl mx-auto">

          <SectionHeading
            badge="Identity infrastructure"
            title="Built for the decentralized web"
            description="Everything you need to turn wallet addresses into a portable, human-readable identity."
          />

          <div className="grid md:grid-cols-2 gap-6">

            <FeatureCard
              icon={<AtSign className="w-6 h-6" />}
              title="Human-Readable Handles"
              description="Claim a .nid handle that replaces opaque wallet addresses. Your identity is portable, memorable, and yours."
              delay={0}
            />

            <FeatureCard
              icon={<Link2 className="w-6 h-6" />}
              title="Multi-Chain Identity"
              description="Link Solana and EVM wallets under a single identity. Authenticate once and prove ownership across supported networks."
              delay={0.1}
            />

            <FeatureCard
              icon={<Fingerprint className="w-6 h-6" />}
              title="Passwordless Security"
              description="Use cryptographic signatures and passkeys instead of passwords. Authentication is based on proof of ownership."
              delay={0.2}
            />

            <FeatureCard
              icon={<Code2 className="w-6 h-6" />}
              title="Drop-In Developer SDK"
              description="Integrate Sign in with NID into applications with a simple developer-friendly SDK and standard authentication flows."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          SDK
      ======================================================= */}

      <section
        id="sdk"
        className="relative py-28 px-6 border-t border-ink-800/50"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: '-100px',
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                border
                border-ink-700
                bg-ink-900/50
                text-xs
                text-brand-300
                mb-6
              "
            >
              <Code2 className="w-3.5 h-3.5" />
              Developer SDK
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Two lines of code.
              <br />
              Universal Web3 login.
            </h2>

            <p className="text-ink-300 mb-8 max-w-lg leading-relaxed">
              Give users a familiar identity layer while keeping
              wallet ownership and cryptographic verification under
              their control.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              {['React', 'JavaScript', 'HTML', 'Vue', 'Svelte'].map(
                (technology, index) => (
                  <motion.span
                    key={technology}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -2,
                    }}
                    className="
                      text-sm
                      text-ink-400
                      hover:text-brand-300
                      font-mono
                      transition-colors
                    "
                  >
                    {technology}
                  </motion.span>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              rotateX: 8,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotateX: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            whileHover={{
              y: -5,
            }}
            className="
              card-surface
              p-6
              font-mono
              text-sm
              shadow-2xl
            "
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ink-700">
              <div className="w-3 h-3 rounded-full bg-danger-500/60" />
              <div className="w-3 h-3 rounded-full bg-warning-500/60" />
              <div className="w-3 h-3 rounded-full bg-success-500/60" />

              <span className="text-ink-400 text-xs ml-2">
                index.html
              </span>
            </div>

            <pre className="text-ink-200 leading-relaxed overflow-x-auto">
              <code>
                <span className="text-ink-500">
                  {'<!-- Load NID SDK -->'}
                </span>
                {'\n\n'}
                <span className="text-accent-400">
                  {'<script'}
                </span>{' '}
                <span className="text-brand-300">
                  src
                </span>
                =
                <span className="text-success-400">
                  {'"https://nid.xyz/sdk.js"'}
                </span>
                <span className="text-accent-400">
                  {'></script>'}
                </span>
                {'\n\n'}
                <span className="text-accent-400">
                  {'<nid-button'}
                </span>{' '}
                <span className="text-brand-300">
                  client-id
                </span>
                =
                <span className="text-success-400">
                  {'"nid_demo_client_123"'}
                </span>{' '}
                <span className="text-accent-400">
                  {'/>'}
                </span>
              </code>
            </pre>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          SECURITY
      ======================================================= */}

      <section
        id="security"
        className="relative py-28 px-6 border-t border-ink-800/50"
      >
        <div className="max-w-7xl mx-auto">

          <SectionHeading
            badge="Security first"
            title="Your keys. Your identity. Your control."
            description="NID is designed around cryptographic ownership, challenge-based authentication, and revocable sessions."
          />

          <div className="grid md:grid-cols-3 gap-6">

            <SecurityPillar
              icon={<Lock className="w-5 h-5" />}
              title="Passkey Authentication"
              description="Use FIDO2/WebAuthn passkeys for passwordless authentication and phishing-resistant account access."
            />

            <SecurityPillar
              icon={<Shield className="w-5 h-5" />}
              title="Multi-Chain Isolation"
              description="Wallets and chains can be independently verified without requiring NID to custody private keys."
            />

            <SecurityPillar
              icon={<Zap className="w-5 h-5" />}
              title="Replay Protection"
              description="Unique challenges and signatures prevent previously captured authentication messages from being reused."
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA
      ======================================================= */}

      <section className="relative py-28 px-6 border-t border-ink-800/50">

        <div className="max-w-4xl mx-auto text-center">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              card-surface
              p-10
              md:p-14
              relative
              overflow-hidden
            "
          >

            <motion.div
              className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-[500px]
                h-[250px]
                bg-brand-600/10
                rounded-full
                blur-[100px]
              "
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
            />

            <div className="relative">

              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              >
                <Globe className="w-10 h-10 text-brand-400 mx-auto mb-6" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {isAuthenticated
                  ? 'Welcome back.'
                  : 'Own your identity.'}
              </h2>

              <p className="text-ink-300 mb-8 max-w-md mx-auto">
                {isAuthenticated
                  ? 'Your universal identity is ready. Continue to your dashboard.'
                  : 'Claim your NID handle and start building your universal Web3 identity.'}
              </p>

              <motion.button
                onClick={goToDashboard}
                whileHover={{
                  y: -3,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-brand-600
                  hover:bg-brand-500
                  text-white
                  font-medium
                  px-8
                  py-3.5
                  rounded-xl
                  transition-colors
                  border
                  border-brand-500/50
                  shadow-lg
                  shadow-brand-900/30
                "
              >
                {isAuthenticated
                  ? 'Go to Dashboard'
                  : 'Get started'}

                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          FOOTER
      ======================================================= */}

      <footer className="py-12 px-6 border-t border-ink-800/50">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">

          <Logo size={32} />

          <p className="text-sm text-ink-400">
            Universal identity. Multi-chain. User-owned.
          </p>

          <div className="flex items-center gap-6 text-sm text-ink-400">

            <span className="flex items-center gap-2">
              <motion.span
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-success-400
                "
              />

              {isAuthenticated
                ? `Signed in${ user ? ` as ${user.email ?? ''}` : '' } `
                : 'Protocol online'}
            </span>

            <motion.a
              href="#security"
              whileHover={{
                x: 2,
              }}
              className="flex items-center gap-1 hover:text-ink-200 transition-colors"
            >
              Security
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// SECTION HEADING
// ============================================================

function SectionHeading({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-100px',
      }}
      transition={{
        duration: 0.7,
      }}
      className="text-center mb-16"
    >
      <motion.div
        whileHover={{
          scale: 1.03,
        }}
        className="
          inline-flex
          items-center
          gap-2
          px-3
          py-1.5
          rounded-full
          border
          border-ink-700
          bg-ink-900/50
          text-xs
          text-brand-300
          mb-6
        "
      >
        <Sparkles className="w-3.5 h-3.5" />
        {badge}
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        {title}
      </h2>

      <p className="text-ink-300 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-80px',
      }}
      transition={{
        duration: 0.6,
        delay,
      }}
      whileHover={{
        y: -7,
      }}
      className="
        card-surface
        glass-hover
        p-7
        group
        relative
        overflow-hidden
      "
    >

      <motion.div
        className="
          absolute
          -top-20
          -right-20
          w-40
          h-40
          rounded-full
          bg-brand-500/10
          blur-3xl
          opacity-0
          group-hover:opacity-100
          transition-opacity
        "
      />

      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: 5,
        }}
        className="
          relative
          w-12
          h-12
          rounded-xl
          bg-brand-500/10
          border
          border-brand-500/20
          flex
          items-center
          justify-center
          text-brand-400
          mb-5
        "
      >
        {icon}
      </motion.div>

      <h3 className="relative text-xl font-semibold text-ink-50 mb-2">
        {title}
      </h3>

      <p className="relative text-ink-300 leading-relaxed">
        {description}
      </p>

      <motion.div
        className="
          mt-6
          flex
          items-center
          gap-1
          text-xs
          text-brand-400
          opacity-0
          group-hover:opacity-100
          transition-opacity
        "
      >
        Learn more
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// SECURITY PILLAR
// ============================================================

function SecurityPillar({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-80px',
      }}
      transition={{
        duration: 0.6,
      }}
      whileHover={{
        y: -6,
      }}
      className="
        card-surface
        glass-hover
        p-6
        group
      "
    >
      <motion.div
        whileHover={{
          scale: 1.08,
          rotate: -5,
        }}
        className="
          w-10
          h-10
          rounded-lg
          bg-success-500/10
          border
          border-success-500/20
          flex
          items-center
          justify-center
          text-success-400
          mb-4
        "
      >
        {icon}
      </motion.div>

      <h3 className="text-lg font-semibold text-ink-50 mb-2">
        {title}
      </h3>

      <p className="text-sm text-ink-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
