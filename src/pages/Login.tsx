// src/components/Login.tsx

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AtSign,
  ArrowRight,
  AlertCircle,
  Zap,
  ShieldCheck,
} from 'lucide-react';

import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/authApi';

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { demoLogin } = useAuth();

  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /*
   * ============================================================
   * OAuth / OIDC CONTEXT
   * ============================================================
   *
   * When a third-party website sends the user to:
   *
   * https://nid.xyz/oauth/authorize?...
   *
   * your backend may redirect the user here:
   *
   * https://nid.xyz/login?oauth=1&client_id=...&...
   *
   * We preserve those parameters and send them back to the
   * backend after successful wallet authentication.
   */

  const isOAuthLogin = searchParams.get('oauth') === '1';

  const oauthParams = {
    client_id: searchParams.get('client_id') || '',
    redirect_uri: searchParams.get('redirect_uri') || '',
    response_type: searchParams.get('response_type') || 'code',
    scope: searchParams.get('scope') || 'openid',
    state: searchParams.get('state') || '',
    nonce: searchParams.get('nonce') || '',
    code_challenge: searchParams.get('code_challenge') || '',
    code_challenge_method:
      searchParams.get('code_challenge_method') || 'S256',
  };

  /*
   * ============================================================
   * WALLET LOGIN
   * ============================================================
   */

  const handleWalletSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handle.trim()) return;

    setLoading(true);
    setError('');

    try {
      /*
       * --------------------------------------------------------
       * 1. Normalize handle
       * --------------------------------------------------------
       */

      const cleanHandle = handle
        .trim()
        .replace(/^@/, '')
        .toLowerCase()
        .replace(/\.nid$/, '');

      const fullHandle = `${cleanHandle}.nid`;

      /*
       * --------------------------------------------------------
       * 2. Detect wallet
       * --------------------------------------------------------
       */

      const solanaProvider = (window as any).solana;
      const ethereumProvider = (window as any).ethereum;

      if (!solanaProvider && !ethereumProvider) {
        throw new Error(
          'No crypto wallet found! Please install Phantom or MetaMask.'
        );
      }

      let address = '';
      let chain = '';

      /*
       * --------------------------------------------------------
       * 3. Connect wallet
       * --------------------------------------------------------
       */

      if (solanaProvider?.isPhantom) {
        const resp = await solanaProvider.connect();

        address = resp.publicKey.toString();
        chain = 'solana';
      } else if (ethereumProvider) {
        const accounts = await ethereumProvider.request({
          method: 'eth_requestAccounts',
        });

        if (!accounts?.length) {
          throw new Error('No EVM wallet account found.');
        }

        address = accounts[0];
        chain = 'evm';
      } else {
        throw new Error('Unsupported wallet provider.');
      }

      /*
       * --------------------------------------------------------
       * 4. Authentication message
       * --------------------------------------------------------
       */

      const message = `Sign in to NID with handle: ${fullHandle}`;

      /*
       * --------------------------------------------------------
       * 5. Sign message
       * --------------------------------------------------------
       */

      let signature = '';

      if (chain === 'solana') {
        /*
         * Phantom signs raw UTF-8 bytes.
         */

        const encodedMessage = new TextEncoder().encode(message);

        const signed = await solanaProvider.signMessage(
          encodedMessage,
          'utf8'
        );

        const sigBytes = signed.signature || signed;

        /*
         * Uint8Array -> Base64
         *
         * This matches your backend Solana verification.
         */

        signature = btoa(
          String.fromCharCode(...sigBytes)
        );
      } else {
        /*
         * MetaMask / EVM personal_sign
         */

        signature = await ethereumProvider.request({
          method: 'personal_sign',
          params: [message, address],
        });
      }

      /*
       * --------------------------------------------------------
       * 6. Normal NID wallet authentication
       * --------------------------------------------------------
       */

      console.log('Wallet login:', {
        handle: fullHandle,
        address,
        chain,
        message,
        signature,
      });

      const response = await authApi.walletLogin({
        handle: cleanHandle,
        address,
        chain,
        message,
        signature,
      });

      if (!response?.token) {
        throw new Error('Authentication failed.');
      }

      /*
       * --------------------------------------------------------
       * 7. Store NID session
       * --------------------------------------------------------
       */

      localStorage.setItem('nid_token', response.token);

      /*
       * ========================================================
       * 8. OAuth / OIDC FLOW
       * ========================================================
       *
       * If this login came from a third-party application,
       * DON'T simply navigate to /dashboard.
       *
       * Instead continue the OAuth authorization flow.
       */

      if (isOAuthLogin) {
        /*
         * We now have an authenticated NID session.
         *
         * Send the browser back to the NID OAuth authorize
         * endpoint.
         *
         * The backend will:
         *
         * 1. Verify the NID session
         * 2. Validate client_id
         * 3. Validate redirect_uri
         * 4. Validate OAuth parameters
         * 5. Generate authorization code
         * 6. Redirect to the third-party application
         */

        const params = new URLSearchParams();

        params.set('client_id', oauthParams.client_id);
        params.set('redirect_uri', oauthParams.redirect_uri);
        params.set(
          'response_type',
          oauthParams.response_type
        );
        params.set('scope', oauthParams.scope);

        if (oauthParams.state) {
          params.set('state', oauthParams.state);
        }

        if (oauthParams.nonce) {
          params.set('nonce', oauthParams.nonce);
        }

        if (oauthParams.code_challenge) {
          params.set(
            'code_challenge',
            oauthParams.code_challenge
          );
        }

        if (oauthParams.code_challenge_method) {
          params.set(
            'code_challenge_method',
            oauthParams.code_challenge_method
          );
        }

        /*
         * Continue OAuth flow.
         */

        window.location.href =
          `/oauth/authorize?${params.toString()}`;

        return;
      }

      /*
       * --------------------------------------------------------
       * 9. Normal NID login
       * --------------------------------------------------------
       */

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Wallet login failed:', err);

      setError(
        err?.message ||
        'Failed to sign in. Please check your handle or wallet connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * DEMO LOGIN
   * ============================================================
   */

  const handleDemo = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await authApi.demoLogin();

      if (res?.token) {
        localStorage.setItem('nid_token', res.token);
      }

      demoLogin();

      /*
       * Don't allow demo login to automatically authenticate
       * an OAuth client.
       *
       * OAuth should require real wallet authentication.
       */

      if (isOAuthLogin) {
        throw new Error(
          'Demo login cannot be used for Sign in with NID.'
        );
      }

      navigate('/dashboard');
    } catch (err: any) {
      if (isOAuthLogin) {
        setError(
          err?.message ||
          'Demo login cannot be used for Sign in with NID.'
        );

        return;
      }

      /*
       * Existing local demo fallback.
       */

      demoLogin();
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-ink-950 grid-bg flex items-center justify-center p-6 text-ink-100">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >

        {/* Logo */}

        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-block"
          >
            <Logo size={40} />
          </button>
        </div>

        {/* Card */}

        <div className="card-surface p-8 shadow-2xl">

          {/* Header */}

          <div className="flex items-center justify-between mb-6">

            <div>
              <h1 className="text-xl font-semibold text-ink-50">
                {isOAuthLogin
                  ? 'Sign in with NID'
                  : 'Sign in with Wallet'}
              </h1>

              {isOAuthLogin && (
                <p className="text-xs text-ink-400 mt-1">
                  Continue securely with your NID identity
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-brand-500/20 bg-brand-500/10 text-brand-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Web3 Secure
            </span>

          </div>

          {/* OAuth information */}

          {isOAuthLogin && (
            <div className="mb-5 rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-3">

              <p className="text-xs text-ink-400">
                You're signing in to
              </p>

              <p className="text-sm font-medium text-ink-100 mt-1">
                {oauthParams.client_id}
              </p>

            </div>
          )}

          {/* Login form */}

          <form
            onSubmit={handleWalletSignIn}
            className="space-y-4"
          >

            {/* Handle */}

            <div>

              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">
                Your .nid Handle
              </label>

              <div className="relative">

                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />

                <input
                  type="text"
                  value={handle}
                  onChange={(e) =>
                    setHandle(e.target.value)
                  }
                  placeholder="everest.nid"
                  autoComplete="username"
                  disabled={loading}
                  className="w-full bg-ink-800/50 border border-ink-700 rounded-lg pl-10 pr-16 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors font-mono disabled:opacity-50"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-500 font-mono">
                  .nid
                </span>

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
                className="flex items-center gap-2 text-sm text-danger-400 bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2"
              >

                <AlertCircle className="w-4 h-4 shrink-0" />

                {error}

              </motion.div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={
                loading ||
                !handle.trim()
              }
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors border border-brand-500/50 disabled:opacity-50 shadow-lg shadow-brand-950"
            >

              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  {isOAuthLogin
                    ? 'Continue with NID'
                    : 'Connect Wallet & Sign In'}

                  <ArrowRight className="w-4 h-4" />
                </>
              )}

            </button>

          </form>

          {/* Demo */}

          {!isOAuthLogin && (
            <>
              <div className="my-6 flex items-center gap-3">

                <div className="flex-1 h-px bg-ink-700" />

                <span className="text-xs text-ink-400">
                  or
                </span>

                <div className="flex-1 h-px bg-ink-700" />

              </div>

              <button
                onClick={handleDemo}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 border border-ink-600 hover:border-ink-500 hover:bg-ink-800 text-ink-100 font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >

                <Zap className="w-4 h-4 text-warning-400" />

                Quick Demo Sandbox Mode

              </button>
            </>
          )}

        </div>

        {/* Back */}

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full text-center text-sm text-ink-400 hover:text-ink-200 transition-colors"
        >
          Back to home
        </button>

      </motion.div>

    </div>
  );
}
