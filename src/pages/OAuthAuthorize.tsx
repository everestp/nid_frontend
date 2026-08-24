// src/pages/OAuthAuthorize.tsx

import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AtSign,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { authApi } from "@/api/authApi";

const NID_BACKEND = "http://localhost:8081";

interface OAuthRequest {
  clientId: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  state: string;
  nonce: string;
  codeChallenge: string;
  codeChallengeMethod: string;
}

export default function OAuthAuthorize() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * ============================================================
   * OAuth request
   * ============================================================
   */

  const oauth = useMemo<OAuthRequest>(
    () => ({
      clientId: params.get("client_id") || "",
      redirectUri: params.get("redirect_uri") || "",
      responseType: params.get("response_type") || "",
      scope: params.get("scope") || "openid",
      state: params.get("state") || "",
      nonce: params.get("nonce") || "",
      codeChallenge: params.get("code_challenge") || "",
      codeChallengeMethod:
        params.get("code_challenge_method") || "",
    }),
    [params],
  );

  /*
   * ============================================================
   * Validate OAuth request
   * ============================================================
   */

  const validateOAuthRequest = (): string | null => {
    if (!oauth.clientId) {
      return "Missing client_id.";
    }

    if (!oauth.redirectUri) {
      return "Missing redirect_uri.";
    }

    if (oauth.responseType !== "code") {
      return "Only response_type=code is supported.";
    }

    if (!oauth.scope.split(/\s+/).includes("openid")) {
      return "The openid scope is required.";
    }

    if (!oauth.codeChallenge) {
      return "PKCE code_challenge is required.";
    }

    if (oauth.codeChallengeMethod !== "S256") {
      return "Only PKCE S256 is supported.";
    }

    return null;
  };

  /*
   * ============================================================
   * Normalize handle
   * ============================================================
   */

  const normalizeHandle = (value: string) => {
    return value
      .trim()
      .replace(/^@/, "")
      .toLowerCase()
      .replace(/\.nid$/, "");
  };

  /*
   * ============================================================
   * Wallet authentication
   *
   * Same logic as Login.tsx
   * ============================================================
   */

  const authenticateWallet = async (): Promise<string> => {
    const cleanHandle = normalizeHandle(handle);

    if (!cleanHandle) {
      throw new Error("Please enter your .nid handle.");
    }

    const fullHandle = `${cleanHandle}.nid`;

    const solanaProvider = (window as any).solana;
    const ethereumProvider = (window as any).ethereum;

    if (!solanaProvider && !ethereumProvider) {
      throw new Error(
        "No crypto wallet found. Please install Phantom or MetaMask.",
      );
    }

    let address = "";
    let chain = "";
    let signature = "";

    /*
     * ----------------------------------------------------------
     * Solana
     * ----------------------------------------------------------
     */

    if (solanaProvider?.isPhantom) {
      const resp = await solanaProvider.connect();

      address = resp.publicKey.toString();
      chain = "solana";

      const message =
        `Sign in to NID with handle: ${fullHandle}`;

      const encodedMessage = new TextEncoder().encode(message);

      const signed = await solanaProvider.signMessage(
        encodedMessage,
        "utf8",
      );

      const sigBytes = signed.signature || signed;

      signature = btoa(
        String.fromCharCode(...sigBytes),
      );

      /*
       * Store message for API.
       */
      const response = await authApi.walletLogin({
        handle: cleanHandle,
        address,
        chain,
        message,
        signature,
      });

      if (!response?.token) {
        throw new Error(
          "NID wallet authentication failed.",
        );
      }

      localStorage.setItem(
        "nid_token",
        response.token,
      );

      return response.token;
    }

    /*
     * ----------------------------------------------------------
     * EVM
     * ----------------------------------------------------------
     */

    if (ethereumProvider) {
      const accounts =
        await ethereumProvider.request({
          method: "eth_requestAccounts",
        });

      if (!accounts?.length) {
        throw new Error(
          "No EVM wallet account found.",
        );
      }

      address = accounts[0];
      chain = "evm";

      const message =
        `Sign in to NID with handle: ${fullHandle}`;

      signature =
        await ethereumProvider.request({
          method: "personal_sign",
          params: [message, address],
        });

      const response = await authApi.walletLogin({
        handle: cleanHandle,
        address,
        chain,
        message,
        signature,
      });

      if (!response?.token) {
        throw new Error(
          "NID wallet authentication failed.",
        );
      }

      localStorage.setItem(
        "nid_token",
        response.token,
      );

      return response.token;
    }

    throw new Error(
      "Unsupported wallet provider.",
    );
  };

  /*
   * ============================================================
   * OAuth authorization
   * ============================================================
   */

  const continueOAuthAuthorization = () => {
    const query = new URLSearchParams();

    query.set("client_id", oauth.clientId);
    query.set("redirect_uri", oauth.redirectUri);
    query.set("response_type", oauth.responseType);
    query.set("scope", oauth.scope);
    query.set("code_challenge", oauth.codeChallenge);
    query.set(
      "code_challenge_method",
      oauth.codeChallengeMethod,
    );

    if (oauth.state) {
      query.set("state", oauth.state);
    }

    if (oauth.nonce) {
      query.set("nonce", oauth.nonce);
    }

    window.location.assign(
      `${NID_BACKEND}/oauth/authorize?${query.toString()}`,
    );
  };

  /*
   * ============================================================
   * Continue
   * ============================================================
   */

  const handleContinue = async () => {
    if (loading) {
      return;
    }

    setError("");

    const validationError = validateOAuthRequest();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!handle.trim()) {
      setError("Enter your .nid handle.");
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate the NID user
      await authenticateWallet();

      // 2. Return to backend OAuth endpoint
      //    Backend now sees the OAuth query parameters
      continueOAuthAuthorization();

    } catch (err) {
      console.error(
        "OAuth authentication failed:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed.",
      );

      setLoading(false);
    }
  };

  /*
   * ============================================================
   * Cancel
   * ============================================================
   */

  const handleCancel = () => {
    if (!oauth.redirectUri) {
      navigate("/");
      return;
    }

    try {
      const callback =
        new URL(oauth.redirectUri);

      callback.searchParams.set(
        "error",
        "access_denied",
      );

      callback.searchParams.set(
        "error_description",
        "The user denied the authorization request.",
      );

      if (oauth.state) {
        callback.searchParams.set(
          "state",
          oauth.state,
        );
      }

      window.location.assign(
        callback.toString(),
      );
    } catch {
      navigate("/");
    }
  };

  /*
   * ============================================================
   * Render
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-ink-950 grid-bg flex items-center justify-center p-6 text-ink-100">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="relative w-full max-w-md"
      >

        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-block"
            disabled={loading}
          >
            <Logo size={40} />
          </button>
        </div>

        <div className="card-surface p-8 shadow-2xl">

          <div className="flex items-start justify-between gap-4 mb-6">

            <div>
              <h1 className="text-xl font-semibold text-ink-50">
                Sign in with NID
              </h1>

              <p className="text-xs text-ink-400 mt-1">
                Securely continue to this application
              </p>
            </div>

            <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-brand-500/20 bg-brand-500/10 text-brand-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              OAuth
            </div>

          </div>

          <div className="mb-5 rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-4">
            <p className="text-xs text-ink-400 uppercase tracking-wider">
              Application
            </p>

            <p className="text-sm font-medium text-ink-100 mt-1 break-all">
              {oauth.clientId || "Unknown application"}
            </p>
          </div>

          <div className="mb-5 rounded-lg border border-ink-700 bg-ink-800/50 px-4 py-4">
            <p className="text-xs text-ink-500 uppercase tracking-wider">
              Redirect
            </p>

            <p className="text-xs text-ink-300 mt-1 break-all">
              {oauth.redirectUri}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-xs text-ink-400 uppercase tracking-wider mb-2">
              Requested permissions
            </p>

            <div className="flex flex-wrap gap-2">
              {oauth.scope
                .split(/\s+/)
                .filter(Boolean)
                .map((scope) => (
                  <span
                    key={scope}
                    className="px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300"
                  >
                    {scope}
                  </span>
                ))}
            </div>
          </div>

          <div className="mb-6 flex gap-3 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />

            <p className="text-xs text-ink-400 leading-5">
              Your wallet private keys never leave
              your wallet. NID only verifies your
              signed authentication message.
            </p>
          </div>

          <div className="mb-4">
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
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    handle.trim()
                  ) {
                    handleContinue();
                  }
                }}
                className="w-full bg-ink-800/50 border border-ink-700 rounded-lg pl-10 pr-16 py-3 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors font-mono disabled:opacity-50"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-500 font-mono">
                .nid
              </span>

            </div>
          </div>

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              className="flex items-start gap-2 text-sm text-danger-400 bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-3 mb-4"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            onClick={handleContinue}
            disabled={
              loading ||
              !handle.trim() ||
              !oauth.clientId ||
              !oauth.redirectUri
            }
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-4 py-3 rounded-lg transition-colors border border-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-950"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying wallet...
              </>
            ) : (
              <>
                Continue with NID
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-ink-700 hover:bg-ink-800 text-ink-300 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

          <p className="text-xs text-ink-500 text-center mt-6">
            Secured by NID OAuth 2.0 / OpenID Connect
          </p>

        </div>

        <button
          onClick={() => navigate("/")}
          disabled={loading}
          className="mt-6 w-full text-center text-sm text-ink-400 hover:text-ink-200 transition-colors disabled:opacity-50"
        >
          Back to NID
        </button>

      </motion.div>
    </div>
  );
}
