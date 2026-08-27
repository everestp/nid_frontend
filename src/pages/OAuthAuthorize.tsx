// src/pages/OAuthAuthorize.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AtSign,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  X,
  Globe,
  ExternalLink,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { authApi } from "@/api/authApi";

const NID_BACKEND =
  import.meta.env.VITE_NID_BACKEND || "https://api.nid.xyz";

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

interface ClientDetails {
  clientName: string;
  clientLogo: string;
  clientUri: string;
  policyUri: string;
}

export default function OAuthAuthorize() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [handle, setHandle] = useState("");
  const [clientDetails, setClientDetails] =
    useState<ClientDetails>({
      clientName: "",
      clientLogo: "",
      clientUri: "",
      policyUri: "",
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // OAuth Parameters
  // ============================================================

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
    [params]
  );

  // ============================================================
  // Load OAuth Client Information
  // ============================================================

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!oauth.clientId) return;

      try {
        const response = await fetch(
          `${NID_BACKEND}/oauth/client-info?client_id=${encodeURIComponent(
            oauth.clientId
          )}`
        );

        if (response.status === 404) {
          console.warn(
            "OAuth client not found:",
            oauth.clientId
          );
          return;
        }

        if (!response.ok) {
          console.error(
            "Failed to fetch OAuth client:",
            response.status
          );
          return;
        }

        const data = await response.json();

        setClientDetails({
          clientName: data.client_name || "",
          clientLogo: data.client_logo || "",
          clientUri: data.client_uri || "",
          policyUri: data.policy_uri || "",
        });
      } catch (err) {
        console.error(
          "Failed to fetch OAuth client information:",
          err
        );
      }
    };

    fetchClientDetails();
  }, [oauth.clientId]);

  // ============================================================
  // Validate OAuth Request
  // ============================================================

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

    const scopes = oauth.scope
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!scopes.includes("openid")) {
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

  // ============================================================
  // Normalize Handle
  // ============================================================

  const normalizeHandle = (value: string): string => {
    return value
      .trim()
      .replace(/^@/, "")
      .toLowerCase()
      .replace(/\.nid$/, "");
  };

  // ============================================================
  // Wallet Authentication
  // ============================================================

  const authenticateWallet = async (): Promise<void> => {
    const cleanHandle = normalizeHandle(handle);

    if (!cleanHandle) {
      throw new Error("Please enter your .nid handle.");
    }

    const fullHandle = `${cleanHandle}.nid`;

    const solanaProvider = (window as any).solana;
    const ethereumProvider = (window as any).ethereum;

    if (!solanaProvider && !ethereumProvider) {
      throw new Error(
        "No crypto wallet found. Please install Phantom or MetaMask."
      );
    }

    const message =
      `Sign in to NID with handle: ${fullHandle}`;

    // ==========================================================
    // Solana
    // ==========================================================

    if (solanaProvider?.isPhantom) {
      const wallet = await solanaProvider.connect();

      const address = wallet.publicKey.toString();

      const encodedMessage =
        new TextEncoder().encode(message);

      const signed = await solanaProvider.signMessage(
        encodedMessage,
        "utf8"
      );

      const signatureBytes =
        signed.signature || signed;

      const signature = btoa(
        String.fromCharCode(...signatureBytes)
      );

      await authApi.walletLogin({
        handle: cleanHandle,
        address,
        chain: "solana",
        message,
        signature,
      });

      return;
    }

    // ==========================================================
    // EVM
    // ==========================================================

    if (ethereumProvider) {
      const accounts =
        await ethereumProvider.request({
          method: "eth_requestAccounts",
        });

      if (!accounts?.length) {
        throw new Error(
          "No EVM wallet account found."
        );
      }

      const address = accounts[0];

      const signature =
        await ethereumProvider.request({
          method: "personal_sign",
          params: [
            message,
            address,
          ],
        });

      await authApi.walletLogin({
        handle: cleanHandle,
        address,
        chain: "evm",
        message,
        signature,
      });

      return;
    }

    throw new Error(
      "Unsupported wallet provider."
    );
  };

  // ============================================================
  // Approve OAuth Authorization
  // ============================================================

  const approveAuthorization = async () => {
    const response = await fetch(
      `${NID_BACKEND}/oauth/authorize/approve`,
      {
        method: "POST",

        // VERY IMPORTANT
        // Send NID session cookie
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          client_id: oauth.clientId,
          redirect_uri: oauth.redirectUri,
          response_type: oauth.responseType,
          scope: oauth.scope,
          state: oauth.state,
          nonce: oauth.nonce,
          code_challenge: oauth.codeChallenge,
          code_challenge_method:
            oauth.codeChallengeMethod,
        }),
      }
    );

    if (!response.ok) {
      let message = "Authorization failed.";

      try {
        const data = await response.json();

        if (data?.message) {
          message = data.message;
        }
      } catch {
        // ignore invalid JSON
      }

      throw new Error(message);
    }

    return response.json();
  };

  // ============================================================
  // Continue
  // ============================================================

  const handleContinue = async () => {
    setError("");

    const validationError =
      validateOAuthRequest();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!handle.trim()) {
      setError(
        "Please enter your .nid handle."
      );
      return;
    }

    try {
      setLoading(true);

      // --------------------------------------------------------
      // 1. Wallet authentication
      // --------------------------------------------------------

      await authenticateWallet();

      // --------------------------------------------------------
      // 2. Approve OAuth request
      // --------------------------------------------------------

      const authorization =
        await approveAuthorization();

      // --------------------------------------------------------
      // 3. Backend creates redirect URI
      // --------------------------------------------------------

      if (!authorization?.redirect_uri) {
        throw new Error(
          "NID did not return a redirect URI."
        );
      }

      // --------------------------------------------------------
      // 4. Redirect user back to OAuth client
      // --------------------------------------------------------

      window.location.assign(
        authorization.redirect_uri
      );
    } catch (err) {
      console.error(
        "OAuth authorization failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Authorization failed."
      );

      setLoading(false);
    }
  };

  // ============================================================
  // Cancel OAuth
  // ============================================================

  const handleCancel = () => {
    if (!oauth.redirectUri) {
      navigate("/");
      return;
    }

    try {
      const callback = new URL(
        oauth.redirectUri
      );

      callback.searchParams.set(
        "error",
        "access_denied"
      );

      callback.searchParams.set(
        "error_description",
        "The user denied the authorization request."
      );

      if (oauth.state) {
        callback.searchParams.set(
          "state",
          oauth.state
        );
      }

      window.location.assign(
        callback.toString()
      );
    } catch {
      navigate("/");
    }
  };

  // ============================================================
  // Display
  // ============================================================

  const displayName =
    clientDetails.clientName ||
    "An application";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-ink-950 grid-bg flex items-center justify-center p-6 text-ink-100">

      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[500px]
          h-[500px]
          bg-brand-600/15
          rounded-full
          blur-[140px]
        "
      />

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

        {/* ======================================================
            Logo
        ====================================================== */}

        <div className="text-center mb-6">

          <button
            onClick={() => navigate("/")}
            className="inline-block"
            disabled={loading}
          >
            <Logo size={40} />
          </button>

        </div>

        {/* ======================================================
            Card
        ====================================================== */}

        <div
          className="
            card-surface
            p-8
            shadow-2xl
            border
            border-ink-800
            rounded-2xl
            bg-ink-900/80
            backdrop-blur-xl
          "
        >

          {/* ====================================================
              Client
          ==================================================== */}

          <div className="text-center mb-8">

            <div
              className="
                mx-auto
                mb-4
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-brand-500/10
                border
                border-brand-500/20
                text-brand-400
                overflow-hidden
              "
            >
              {clientDetails.clientLogo ? (
                <img
                  src={clientDetails.clientLogo}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Globe className="w-8 h-8" />
              )}
            </div>

            <h1 className="text-xl font-bold text-ink-50">
              {displayName}
            </h1>

            <p className="text-sm text-ink-300 mt-1">
              wants to sign you in with NID
            </p>

            {clientDetails.clientUri ? (
              <a
                href={clientDetails.clientUri}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-1
                  text-xs
                  text-brand-400
                  hover:text-brand-300
                  mt-2
                "
              >
                {clientDetails.clientUri}

                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <p className="text-xs text-ink-500 mt-2 break-all font-mono">
                {oauth.redirectUri}
              </p>
            )}

          </div>

          <div className="h-px bg-ink-800 my-6" />

          {/* ====================================================
              Permissions
          ==================================================== */}

          <div className="mb-6">

            <p
              className="
                text-xs
                text-ink-400
                uppercase
                tracking-wider
                mb-3
                font-medium
              "
            >
              This app will be able to:
            </p>

            <ul className="space-y-3 text-xs text-ink-300">

              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />

                View your basic NID identity
              </li>

              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />

                Verify your NID handle
              </li>

            </ul>

          </div>

          {/* ====================================================
              Security
          ==================================================== */}

          <div
            className="
              mb-5
              flex
              gap-3
              p-4
              rounded-lg
              bg-emerald-500/5
              border
              border-emerald-500/10
            "
          >

            <ShieldCheck
              className="
                w-5
                h-5
                text-emerald-400
                shrink-0
              "
            />

            <p
              className="
                text-xs
                text-ink-400
                leading-5
              "
            >
              Your wallet private keys never leave
              your wallet. NID only verifies your
              signed authentication message.
            </p>

          </div>

          {/* ====================================================
              Handle
          ==================================================== */}

          <div className="mb-5">

            <label
              className="
                block
                text-xs
                font-medium
                text-ink-300
                mb-2
                uppercase
                tracking-wider
              "
            >
              Confirm your .nid handle
            </label>

            <div className="relative">

              <AtSign
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-4
                  h-4
                  text-ink-400
                "
              />

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
                    handle.trim() &&
                    !loading
                  ) {
                    handleContinue();
                  }
                }}
                className="
                  w-full
                  bg-ink-800/50
                  border
                  border-ink-700
                  rounded-lg
                  pl-10
                  pr-16
                  py-3
                  text-sm
                  text-ink-50
                  placeholder:text-ink-500
                  focus:outline-none
                  focus:border-brand-500
                  focus:ring-1
                  focus:ring-brand-500/30
                  transition-colors
                  font-mono
                  disabled:opacity-50
                "
              />

              <span
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-xs
                  text-ink-500
                  font-mono
                "
              >
                .nid
              </span>

            </div>

          </div>

          {/* ====================================================
              Error
          ==================================================== */}

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
              className="
                flex
                items-start
                gap-2
                text-sm
                text-red-400
                bg-red-500/10
                border
                border-red-500/20
                rounded-lg
                px-3
                py-3
                mb-4
              "
            >
              <AlertCircle
                className="
                  w-4
                  h-4
                  shrink-0
                  mt-0.5
                "
              />

              <span>{error}</span>
            </motion.div>
          )}

          {/* ====================================================
              Actions
          ==================================================== */}

          <div className="space-y-3">

            <button
              onClick={handleContinue}
              disabled={
                loading ||
                !handle.trim() ||
                !oauth.clientId ||
                !oauth.redirectUri
              }
              className="
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                bg-white
                hover:bg-gray-100
                text-black
                font-semibold
                px-4
                py-3
                rounded-xl
                transition-all
                disabled:opacity-50
                disabled:cursor-not-allowed
                shadow-lg
              "
            >
              {loading ? (
                <>
                  <Loader2
                    className="
                      w-4
                      h-4
                      animate-spin
                    "
                  />

                  Verifying wallet...
                </>
              ) : (
                <>
                  Continue

                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={handleCancel}
              disabled={loading}
              className="
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-3
                rounded-xl
                border
                border-ink-700
                hover:bg-ink-800
                text-ink-300
                transition
                disabled:opacity-50
                text-sm
                font-medium
              "
            >
              <X className="w-4 h-4" />

              Cancel
            </button>

          </div>

          {/* ====================================================
              Footer
          ==================================================== */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-4
              text-[11px]
              text-ink-500
            "
          >

            {clientDetails.policyUri && (
              <>
                <a
                  href={clientDetails.policyUri}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  Privacy Policy
                </a>

                <span>•</span>
              </>
            )}

            <span>
              Secured by NID OpenID Connect
            </span>

          </div>

        </div>

        {/* ======================================================
            Back
        ====================================================== */}

        <button
          onClick={() => navigate("/")}
          disabled={loading}
          className="
            mt-6
            w-full
            text-center
            text-sm
            text-ink-400
            hover:text-ink-200
            transition-colors
            disabled:opacity-50
          "
        >
          Back to NID
        </button>

      </motion.div>
    </div>
  );
}
