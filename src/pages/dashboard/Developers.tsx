import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  BookOpen,
  Terminal,
  X,
  ExternalLink,
  ShieldCheck,
  Globe,
  RefreshCw,
  Lock,
  AlertTriangle,
} from 'lucide-react';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';

import {
  clientRegisterApi,
  type RegisterClientRequest,
  type RegisterClientResponse,
} from '@/api/clientRegisterApi';

// ============================================================
// TYPES
// ============================================================

interface OAuthClient extends RegisterClientResponse {
  id: string;
  created_at?: string;
  updated_at?: string;
}

type TabKey = keyof typeof codeExamples;

// ============================================================
// CODE EXAMPLES
// ============================================================

const codeExamples = {
  HTML: {
    label: 'index.html',
    code: `<script src="https://nid.xyz/sdk.js"></script>
<nid-button client-id="YOUR_CLIENT_ID" />`,
  },

  React: {
    label: 'App.tsx',
    code: `import { NidButton } from '@nid/sdk-react';

export default function App() {
  return (
    <NidButton
      clientId="YOUR_CLIENT_ID"
    />
  );
}`,
  },

  JavaScript: {
    label: 'app.js',
    code: `const nid = new NID({
  clientId: 'YOUR_CLIENT_ID'
});

nid.signIn().then(session => {
  console.log('Authenticated:', session);
});`,
  },
};

// ============================================================
// EMPTY FORM
// ============================================================

const emptyForm: RegisterClientRequest = {
  name: '',
  redirect_uri: '',
  client_type: 'confidential',
  client_logo: '',
  client_uri: '',
  policy_uri: '',
};

// ============================================================
// COMPONENT
// ============================================================

export function Developers() {
  const { showToast } = useToast();

  // ==========================================================
  // QUICK START
  // ==========================================================

  const [activeTab, setActiveTab] =
    useState<TabKey>('HTML');

  const [copied, setCopied] =
    useState<string | null>(null);

  // ==========================================================
  // CLIENTS
  // ==========================================================

  const [clients, setClients] =
    useState<OAuthClient[]>([]);

  const [loadingClients, setLoadingClients] =
    useState(false);

  // ==========================================================
  // CREATE CLIENT
  // ==========================================================

  const [showCreateClient, setShowCreateClient] =
    useState(false);

  const [creatingClient, setCreatingClient] =
    useState(false);

  const [form, setForm] =
    useState<RegisterClientRequest>(emptyForm);

  // ==========================================================
  // CREATED CLIENT CREDENTIALS
  // ==========================================================

  const [createdClient, setCreatedClient] =
    useState<RegisterClientResponse | null>(null);

  const [showCredentials, setShowCredentials] =
    useState(false);

  const [showSecret, setShowSecret] =
    useState(false);

  // ==========================================================
  // CLIENT DETAILS
  // ==========================================================

  const [selectedClient, setSelectedClient] =
    useState<OAuthClient | null>(null);

  const [showClientDetails, setShowClientDetails] =
    useState(false);

  // ==========================================================
  // ROTATE SECRET
  // ==========================================================

  const [rotatingClient, setRotatingClient] =
    useState<OAuthClient | null>(null);

  const [showRotateConfirm, setShowRotateConfirm] =
    useState(false);

  const [rotating, setRotating] =
    useState(false);

  const [rotatingSecret, setRotatingSecret] =
    useState<string | null>(null);

  const [showRotatedSecret, setShowRotatedSecret] =
    useState(false);

  const [showNewSecret, setShowNewSecret] =
    useState(true);

  // ==========================================================
  // LOAD CLIENTS
  // ==========================================================

  const loadClients = async () => {
    setLoadingClients(true);

    try {
      const response =
        await clientRegisterApi.listAllByUser();

      setClients(response as OAuthClient[]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load OAuth clients.';

      showToast('error', message);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // ==========================================================
  // UPDATE FORM
  // ==========================================================

  const updateForm = (
    field: keyof RegisterClientRequest,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================================
  // URL VALIDATION
  // ==========================================================

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value);

      return (
        url.protocol === 'http:' ||
        url.protocol === 'https:'
      );
    } catch {
      return false;
    }
  };

  // ==========================================================
  // COPY
  // ==========================================================

  const copy = async (
    value: string,
    label: string,
  ) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(label);

      showToast(
        'success',
        `${label} copied to clipboard.`,
      );

      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch {
      showToast(
        'error',
        'Failed to copy to clipboard.',
      );
    }
  };

  // ==========================================================
  // CREATE CLIENT
  // ==========================================================

  const createClient = async () => {
    if (!form.name.trim()) {
      showToast(
        'error',
        'Application name is required.',
      );
      return;
    }

    if (!form.redirect_uri.trim()) {
      showToast(
        'error',
        'Redirect URI is required.',
      );
      return;
    }

    if (!isValidUrl(form.redirect_uri)) {
      showToast(
        'error',
        'Please enter a valid redirect URI.',
      );
      return;
    }

    if (
      form.client_uri &&
      !isValidUrl(form.client_uri)
    ) {
      showToast(
        'error',
        'Website URL is invalid.',
      );
      return;
    }

    if (
      form.policy_uri &&
      !isValidUrl(form.policy_uri)
    ) {
      showToast(
        'error',
        'Privacy policy URL is invalid.',
      );
      return;
    }

    if (
      form.client_logo &&
      !isValidUrl(form.client_logo)
    ) {
      showToast(
        'error',
        'Logo URL is invalid.',
      );
      return;
    }

    setCreatingClient(true);

    try {
      const response =
        await clientRegisterApi.register({
          name: form.name.trim(),
          redirect_uri:
            form.redirect_uri.trim(),
          client_type:
            form.client_type,
          client_logo:
            form.client_logo?.trim() || '',
          client_uri:
            form.client_uri?.trim() || '',
          policy_uri:
            form.policy_uri?.trim() || '',
        });

      setClients((prev) => [
        response as OAuthClient,
        ...prev,
      ]);

      setShowCreateClient(false);

      setCreatedClient(response);

      setShowSecret(true);

      setShowCredentials(true);

      showToast(
        'success',
        'OAuth client created successfully.',
      );

      setForm({
        ...emptyForm,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create OAuth client.';

      showToast('error', message);
    } finally {
      setCreatingClient(false);
    }
  };

  // ==========================================================
  // CLOSE CREATE MODAL
  // ==========================================================

  const closeCreateClient = () => {
    if (creatingClient) return;

    setShowCreateClient(false);

    setForm({
      ...emptyForm,
    });
  };

  // ==========================================================
  // CLOSE CREDENTIAL MODAL
  // ==========================================================

  const closeCredentials = () => {
    setShowCredentials(false);

    setCreatedClient(null);

    setShowSecret(false);
  };

  // ==========================================================
  // OPEN CLIENT DETAILS
  // ==========================================================

  const openClientDetails = (
    client: OAuthClient,
  ) => {
    setSelectedClient(client);

    setShowClientDetails(true);
  };

  // ==========================================================
  // CLOSE CLIENT DETAILS
  // ==========================================================

  const closeClientDetails = () => {
    setShowClientDetails(false);

    setSelectedClient(null);
  };

  // ==========================================================
  // OPEN ROTATE CONFIRMATION
  // ==========================================================

  const openRotateConfirm = (
    client: OAuthClient,
  ) => {
    setRotatingClient(client);

    setShowRotateConfirm(true);
  };

  // ==========================================================
  // CLOSE ROTATE CONFIRMATION
  // ==========================================================

  const closeRotateConfirm = () => {
    if (rotating) return;

    setShowRotateConfirm(false);

    setRotatingClient(null);
  };

  // ==========================================================
  // ROTATE SECRET
  // ==========================================================

  const rotateSecret = async () => {
    if (!rotatingClient) return;

    setRotating(true);

    try {
      const response =
        await clientRegisterApi.rotateSecret(
          rotatingClient.id,
        );

      setRotatingSecret(
        response.client_secret,
      );

      setShowNewSecret(true);

      setShowRotateConfirm(false);

      setShowRotatedSecret(true);

      showToast(
        'success',
        'Client secret rotated successfully.',
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to rotate client secret.';

      showToast('error', message);
    } finally {
      setRotating(false);
    }
  };

  // ==========================================================
  // CLOSE ROTATED SECRET
  // ==========================================================

  const closeRotatedSecret = () => {
    setShowRotatedSecret(false);

    setRotatingSecret(null);

    setRotatingClient(null);

    setShowNewSecret(false);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <PageHeader
        title="NID Developer"
        description="Build applications with Sign in with NID."
        actions={
          <Button
            icon={
              <Plus className="w-4 h-4" />
            }
            onClick={() =>
              setShowCreateClient(true)
            }
          >
            Create Client
          </Button>
        }
      />

      {/* ======================================================
          QUICK START
      ======================================================= */}

      <Card
        className="p-6"
        delay={0}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <div className="flex items-center gap-2">

            <Code2 className="w-5 h-5 text-brand-400" />

            <div>

              <h2 className="text-lg font-semibold text-ink-50">
                Quick Start
              </h2>

              <p className="text-xs text-ink-500 mt-0.5">
                Add NID authentication to your application.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-800/50 border border-ink-700">

            {(Object.keys(
              codeExamples,
            ) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white'
                    : 'text-ink-300 hover:text-ink-50'
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

            <span className="text-xs text-ink-400 font-mono">
              {codeExamples[activeTab].label}
            </span>

          </div>

          <pre className="rounded-b-xl bg-ink-900/80 border border-t-0 border-ink-700 p-4 text-sm font-mono text-ink-200 overflow-x-auto leading-relaxed">

            <code>
              {codeExamples[activeTab].code}
            </code>

          </pre>

          <button
            onClick={() =>
              copy(
                codeExamples[activeTab].code,
                'Code',
              )
            }
            className="absolute top-10 right-3 p-2 rounded-lg bg-ink-800/80 border border-ink-700 text-ink-300 hover:text-ink-50 transition-colors"
          >
            {copied === 'Code' ? (
              <Check className="w-3.5 h-3.5 text-success-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

        </div>
      </Card>

      {/* ======================================================
          OAUTH CLIENTS
      ======================================================= */}

      <Card
        className="p-6"
        delay={0.1}
      >

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">

            <KeyRound className="w-5 h-5 text-brand-400" />

            <div>

              <h2 className="text-lg font-semibold text-ink-50">
                OAuth Clients
              </h2>

              <p className="text-xs text-ink-500 mt-0.5">
                Applications registered with your NID account.
              </p>

            </div>

          </div>

          <Button
            variant="outline"
            size="sm"
            icon={
              <Plus className="w-3.5 h-3.5" />
            }
            onClick={() =>
              setShowCreateClient(true)
            }
          >
            Create Client
          </Button>

        </div>

        {/* Loading */}

        {loadingClients ? (
          <div className="py-12 text-center">

            <RefreshCw className="w-5 h-5 animate-spin text-brand-400 mx-auto mb-3" />

            <p className="text-sm text-ink-400">
              Loading clients...
            </p>

          </div>

        ) : clients.length === 0 ? (

          /* Empty */

          <div className="py-12 text-center rounded-xl border border-dashed border-ink-700 bg-ink-900/30">

            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">

              <KeyRound className="w-5 h-5 text-brand-400" />

            </div>

            <h3 className="text-sm font-semibold text-ink-100">
              No OAuth clients yet
            </h3>

            <p className="text-xs text-ink-500 mt-1 mb-4">
              Create your first client to start using NID authentication.
            </p>

            <Button
              size="sm"
              onClick={() =>
                setShowCreateClient(true)
              }
            >
              Create your first client
            </Button>

          </div>

        ) : (

          /* Client List */

          <div className="space-y-3">

            {clients.map((client, index) => (

              <motion.div
                key={client.client_id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.04,
                }}
                className="group p-4 rounded-xl bg-ink-800/40 border border-ink-700 hover:border-ink-600 transition-colors"
              >

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  {/* Client info */}

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-ink-900 border border-ink-700 flex items-center justify-center overflow-hidden">

                      {client.client_logo ? (
                        <img
                          src={client.client_logo}
                          alt={client.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <KeyRound className="w-5 h-5 text-brand-400" />
                      )}

                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h3 className="text-sm font-semibold text-ink-100 truncate">
                          {client.name}
                        </h3>

                        <Badge
                          variant={
                            client.client_type ===
                            'confidential'
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {client.client_type}
                        </Badge>

                      </div>

                      <p className="text-xs text-ink-500 font-mono mt-1 truncate">
                        {client.client_id}
                      </p>

                    </div>

                  </div>

                  {/* Actions */}

                  <div className="flex items-center gap-2">

                    {/* View */}

                    <Button
                      variant="outline"
                      size="sm"
                      icon={
                        <Eye className="w-3.5 h-3.5" />
                      }
                      onClick={() =>
                        openClientDetails(client)
                      }
                    >
                      View
                    </Button>

                    {/* Copy */}

                    <Button
                      variant="outline"
                      size="sm"
                      icon={
                        copied === 'Client ID' ? (
                          <Check className="w-3.5 h-3.5 text-success-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )
                      }
                      onClick={() =>
                        copy(
                          client.client_id,
                          'Client ID',
                        )
                      }
                    >
                      Copy ID
                    </Button>

                    {/* Rotate */}

                    {client.client_type ===
                      'confidential' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={
                          <RefreshCw className="w-3.5 h-3.5" />
                        }
                        onClick={() =>
                          openRotateConfirm(
                            client,
                          )
                        }
                      >
                        Rotate
                      </Button>
                    )}

                  </div>

                </div>

                {/* Redirect */}

                <div className="mt-4 pt-3 border-t border-ink-700/70 flex items-start gap-2">

                  <Globe className="w-3.5 h-3.5 text-ink-500 mt-0.5 shrink-0" />

                  <div className="min-w-0">

                    <p className="text-[11px] text-ink-500">
                      Redirect URI
                    </p>

                    <p className="text-xs text-ink-300 font-mono truncate">
                      {client.redirect_uri}
                    </p>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>
        )}

      </Card>

      {/* ======================================================
          RESOURCES
      ======================================================= */}

      <div className="grid sm:grid-cols-3 gap-4">

        {[
          {
            icon: (
              <BookOpen className="w-5 h-5" />
            ),
            title: 'Documentation',
            desc: 'Full API reference and guides',
            link: 'Read docs',
          },
          {
            icon: (
              <Terminal className="w-5 h-5" />
            ),
            title: 'API Reference',
            desc: 'OAuth/OIDC endpoints',
            link: 'View reference',
          },
          {
            icon: (
              <Code2 className="w-5 h-5" />
            ),
            title: 'Quickstart',
            desc: 'Get running in minutes',
            link: 'Get started',
          },
        ].map((resource, i) => (

          <motion.div
            key={resource.title}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15 + i * 0.05,
            }}
          >

            <Card
              className="p-5"
              hover
            >

              <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-3">
                {resource.icon}
              </div>

              <h3 className="text-sm font-semibold text-ink-50 mb-1">
                {resource.title}
              </h3>

              <p className="text-xs text-ink-400 mb-3">
                {resource.desc}
              </p>

              <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                {resource.link} →
              </button>

            </Card>

          </motion.div>

        ))}

      </div>

      {/* ======================================================
          CREATE CLIENT MODAL
      ======================================================= */}

      <Modal
        open={showCreateClient}
        onClose={closeCreateClient}
      >

        <div className="p-6 w-full max-w-2xl">

          {/* Header */}

          <div className="flex items-start justify-between mb-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">

                <KeyRound className="w-5 h-5 text-brand-400" />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-ink-50">
                  Create OAuth Client
                </h2>

                <p className="text-sm text-ink-400">
                  Register your application with NID.
                </p>

              </div>

            </div>

            <button
              onClick={closeCreateClient}
              className="p-2 rounded-lg text-ink-400 hover:text-ink-50 hover:bg-ink-800"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* Form */}

          <div className="space-y-5">

            {/* Name */}

            <div>

              <label className="block text-sm font-medium text-ink-200 mb-2">
                Application Name
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  updateForm(
                    'name',
                    e.target.value,
                  )
                }
                placeholder="My Awesome App"
                className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 placeholder:text-ink-500 outline-none focus:border-brand-500"
              />

              <p className="text-xs text-ink-500 mt-1.5">
                Users will see this name during login.
              </p>

            </div>

            {/* Redirect URI */}

            <div>

              <label className="block text-sm font-medium text-ink-200 mb-2">
                Redirect URI
              </label>

              <input
                value={form.redirect_uri}
                onChange={(e) =>
                  updateForm(
                    'redirect_uri',
                    e.target.value,
                  )
                }
                placeholder="https://example.com/auth/callback"
                className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 placeholder:text-ink-500 outline-none focus:border-brand-500"
              />

              <p className="text-xs text-ink-500 mt-1.5">
                NID will redirect users here after authorization.
              </p>

            </div>

            {/* Client Type */}

            <div>

              <label className="block text-sm font-medium text-ink-200 mb-2">
                Client Type
              </label>

              <select
                value={form.client_type}
                onChange={(e) =>
                  updateForm(
                    'client_type',
                    e.target.value,
                  )
                }
                className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 outline-none focus:border-brand-500"
              >

                <option value="confidential">
                  Confidential
                </option>

                <option value="public">
                  Public
                </option>

              </select>

              <p className="text-xs text-ink-500 mt-1.5">
                Confidential clients receive a client secret.
              </p>

            </div>

            {/* Website + Logo */}

            <div className="grid md:grid-cols-2 gap-4">

              <div>

                <label className="block text-sm font-medium text-ink-200 mb-2">
                  Website URL
                </label>

                <input
                  value={form.client_uri}
                  onChange={(e) =>
                    updateForm(
                      'client_uri',
                      e.target.value,
                    )
                  }
                  placeholder="https://example.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 placeholder:text-ink-500 outline-none focus:border-brand-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-ink-200 mb-2">
                  Logo URL
                </label>

                <input
                  value={form.client_logo}
                  onChange={(e) =>
                    updateForm(
                      'client_logo',
                      e.target.value,
                    )
                  }
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 placeholder:text-ink-500 outline-none focus:border-brand-500"
                />

              </div>

            </div>

            {/* Privacy */}

            <div>

              <label className="block text-sm font-medium text-ink-200 mb-2">
                Privacy Policy URL
              </label>

              <input
                value={form.policy_uri}
                onChange={(e) =>
                  updateForm(
                    'policy_uri',
                    e.target.value,
                  )
                }
                placeholder="https://example.com/privacy"
                className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-ink-100 placeholder:text-ink-500 outline-none focus:border-brand-500"
              />

            </div>

            {/* Security */}

            <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">

              <div className="flex gap-3">

                <ShieldCheck className="w-4 h-4 text-brand-400 mt-0.5" />

                <div>

                  <p className="text-sm font-medium text-ink-200">
                    Secure OAuth credentials
                  </p>

                  <p className="text-xs text-ink-400 mt-1">
                    Your client secret is shown only once.
                    NID stores only its hash.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Actions */}

          <div className="flex gap-3 mt-7">

            <Button
              variant="secondary"
              className="flex-1"
              onClick={closeCreateClient}
              disabled={creatingClient}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              onClick={createClient}
              disabled={creatingClient}
            >
              {creatingClient
                ? 'Creating...'
                : 'Create OAuth Client'}
            </Button>

          </div>

        </div>

      </Modal>

      {/* ======================================================
          CREATED CLIENT CREDENTIALS
      ======================================================= */}

      <Modal
        open={showCredentials}
        onClose={closeCredentials}
      >

        <div className="p-6 w-full max-w-xl">

          <div className="text-center mb-7">

            <div className="w-16 h-16 rounded-2xl bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto mb-4">

              <Check className="w-8 h-8 text-success-400" />

            </div>

            <h2 className="text-xl font-semibold text-ink-50">
              Client Created Successfully
            </h2>

            <p className="text-sm text-ink-400 mt-1">
              {createdClient?.name}
            </p>

          </div>

          {/* Warning */}

          <div className="p-4 rounded-xl bg-warning-500/5 border border-warning-500/20 mb-5">

            <div className="flex gap-3">

              <AlertTriangle className="w-5 h-5 text-warning-400 shrink-0" />

              <div>

                <p className="text-sm font-semibold text-warning-300">
                  Save your credentials now
                </p>

                <p className="text-xs text-warning-400/80 mt-1 leading-relaxed">
                  Your client secret will not be shown again.
                  NID stores only a secure hash of the secret.
                </p>

              </div>

            </div>

          </div>

          <div className="space-y-4">

            {/* Client ID */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="text-xs font-medium text-ink-400 uppercase tracking-wider">
                  Client ID
                </label>

                <span className="text-[10px] text-success-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Public
                </span>

              </div>

              <div className="flex gap-2">

                <code className="flex-1 min-w-0 px-3 py-3 rounded-lg bg-ink-900 border border-ink-700 text-sm font-mono text-ink-100 break-all">
                  {createdClient?.client_id}
                </code>

                <button
                  onClick={() =>
                    createdClient &&
                    copy(
                      createdClient.client_id,
                      'Client ID',
                    )
                  }
                  className="shrink-0 px-3 rounded-lg bg-ink-800 border border-ink-700 text-ink-300 hover:text-ink-50"
                >
                  {copied === 'Client ID' ? (
                    <Check className="w-4 h-4 text-success-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>

            {/* Secret */}

            {createdClient?.client_secret && (
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-xs font-medium text-ink-400 uppercase tracking-wider">
                    Client Secret
                  </label>

                  <span className="text-[10px] text-warning-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Keep private
                  </span>

                </div>

                <div className="flex gap-2">

                  <div className="flex-1 min-w-0 flex items-center px-3 rounded-lg bg-ink-900 border border-warning-500/30">

                    <code className="flex-1 text-sm font-mono text-ink-100 truncate">

                      {showSecret
                        ? createdClient.client_secret
                        : '••••••••••••••••••••••••••••'}

                    </code>

                    <button
                      onClick={() =>
                        setShowSecret(
                          (prev) => !prev,
                        )
                      }
                      className="ml-2 text-ink-400 hover:text-ink-100"
                    >
                      {showSecret ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                  </div>

                  <button
                    onClick={() =>
                      copy(
                        createdClient.client_secret!,
                        'Client Secret',
                      )
                    }
                    className="shrink-0 px-3 rounded-lg bg-brand-600 text-white hover:bg-brand-500"
                  >
                    {copied === 'Client Secret' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                </div>

                <p className="text-[11px] text-ink-500 mt-2">
                  Never expose this secret in frontend
                  JavaScript, mobile applications, or public
                  repositories.
                </p>

              </div>
            )}

            {/* Details */}

            <div className="rounded-xl border border-ink-700 overflow-hidden">

              <div className="px-4 py-3 bg-ink-800/50 border-b border-ink-700">

                <p className="text-xs font-medium text-ink-300">
                  Application details
                </p>

              </div>

              <div className="p-4 space-y-3">

                <div className="flex items-center justify-between gap-4">

                  <span className="text-xs text-ink-500">
                    Client type
                  </span>

                  <Badge
                    variant={
                      createdClient?.client_type ===
                      'confidential'
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {createdClient?.client_type}
                  </Badge>

                </div>

                <div>

                  <div className="flex items-center gap-2 mb-1">

                    <ExternalLink className="w-3.5 h-3.5 text-ink-500" />

                    <span className="text-xs text-ink-500">
                      Redirect URI
                    </span>

                  </div>

                  <p className="text-xs font-mono text-ink-300 break-all pl-5">
                    {createdClient?.redirect_uri}
                  </p>

                </div>

              </div>

            </div>

          </div>

          <Button
            className="w-full mt-6"
            onClick={closeCredentials}
          >
            I've Saved My Credentials
          </Button>

        </div>

      </Modal>

      {/* ======================================================
          CLIENT DETAILS MODAL
      ======================================================= */}

      <Modal
        open={showClientDetails}
        onClose={closeClientDetails}
      >

        {selectedClient && (

          <div className="p-6 w-full max-w-2xl">

            {/* Header */}

            <div className="flex items-start justify-between mb-6">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-ink-900 border border-ink-700 flex items-center justify-center overflow-hidden">

                  {selectedClient.client_logo ? (
                    <img
                      src={selectedClient.client_logo}
                      alt={selectedClient.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <KeyRound className="w-5 h-5 text-brand-400" />
                  )}

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <h2 className="text-lg font-semibold text-ink-50 truncate">
                      {selectedClient.name}
                    </h2>

                    <Badge
                      variant={
                        selectedClient.client_type ===
                        'confidential'
                          ? 'warning'
                          : 'success'
                      }
                    >
                      {selectedClient.client_type}
                    </Badge>

                  </div>

                  <p className="text-xs text-ink-500 mt-1">
                    OAuth Application
                  </p>

                </div>

              </div>

              <button
                onClick={closeClientDetails}
                className="p-2 rounded-lg text-ink-400 hover:text-ink-50 hover:bg-ink-800"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Client ID */}

            <div className="mb-4">

              <label className="block text-xs font-medium text-ink-400 uppercase tracking-wider mb-2">
                Client ID
              </label>

              <div className="flex gap-2">

                <code className="flex-1 px-3 py-3 rounded-lg bg-ink-900 border border-ink-700 text-sm font-mono text-ink-100 break-all">
                  {selectedClient.client_id}
                </code>

                <button
                  onClick={() =>
                    copy(
                      selectedClient.client_id,
                      'Client ID',
                    )
                  }
                  className="px-3 rounded-lg bg-ink-800 border border-ink-700 text-ink-300 hover:text-ink-50"
                >
                  {copied === 'Client ID' ? (
                    <Check className="w-4 h-4 text-success-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>

            {/* Application Details */}

            <div className="rounded-xl border border-ink-700 overflow-hidden">

              <div className="px-4 py-3 bg-ink-800/50 border-b border-ink-700">

                <p className="text-xs font-medium text-ink-300">
                  Application information
                </p>

              </div>

              <div className="p-4 space-y-4">

                {/* Type */}

                <div className="flex items-center justify-between gap-4">

                  <span className="text-xs text-ink-500">
                    Client type
                  </span>

                  <Badge
                    variant={
                      selectedClient.client_type ===
                      'confidential'
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {selectedClient.client_type}
                  </Badge>

                </div>

                {/* Redirect */}

                <div>

                  <div className="flex items-center gap-2 mb-1">

                    <Globe className="w-3.5 h-3.5 text-ink-500" />

                    <span className="text-xs text-ink-500">
                      Redirect URI
                    </span>

                  </div>

                  <code className="block text-xs font-mono text-ink-300 break-all pl-5">
                    {selectedClient.redirect_uri}
                  </code>

                </div>

                {/* Website */}

                {selectedClient.client_uri && (

                  <div>

                    <div className="flex items-center gap-2 mb-1">

                      <ExternalLink className="w-3.5 h-3.5 text-ink-500" />

                      <span className="text-xs text-ink-500">
                        Website
                      </span>

                    </div>

                    <a
                      href={selectedClient.client_uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-brand-400 hover:text-brand-300 break-all pl-5"
                    >
                      {selectedClient.client_uri}
                    </a>

                  </div>

                )}

                {/* Privacy */}

                {selectedClient.policy_uri && (

                  <div>

                    <div className="flex items-center gap-2 mb-1">

                      <ShieldCheck className="w-3.5 h-3.5 text-ink-500" />

                      <span className="text-xs text-ink-500">
                        Privacy Policy
                      </span>

                    </div>

                    <a
                      href={selectedClient.policy_uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-brand-400 hover:text-brand-300 break-all pl-5"
                    >
                      {selectedClient.policy_uri}
                    </a>

                  </div>

                )}

                {/* Created */}

                {selectedClient.created_at && (

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-xs text-ink-500">
                      Created
                    </span>

                    <span className="text-xs text-ink-300">
                      {new Date(
                        selectedClient.created_at,
                      ).toLocaleString()}
                    </span>

                  </div>

                )}

                {/* Updated */}

                {selectedClient.updated_at && (

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-xs text-ink-500">
                      Last updated
                    </span>

                    <span className="text-xs text-ink-300">
                      {new Date(
                        selectedClient.updated_at,
                      ).toLocaleString()}
                    </span>

                  </div>

                )}

              </div>

            </div>

            {/* Security */}

            <div className="mt-5 p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">

              <div className="flex gap-3">

                <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0" />

                <div>

                  <p className="text-sm font-medium text-ink-200">
                    Client secret security
                  </p>

                  <p className="text-xs text-ink-400 mt-1 leading-relaxed">
                    NID never displays your existing client
                    secret. If you lose it, rotate the secret
                    to generate a new one.
                  </p>

                </div>

              </div>

            </div>

            {/* Actions */}

            <div className="flex gap-3 mt-6">

              <Button
                variant="secondary"
                className="flex-1"
                onClick={closeClientDetails}
              >
                Close
              </Button>

              {selectedClient.client_type ===
                'confidential' && (

                <Button
                  className="flex-1"
                  icon={
                    <RefreshCw className="w-4 h-4" />
                  }
                  onClick={() => {

                    const client =
                      selectedClient;

                    closeClientDetails();

                    openRotateConfirm(client);
                  }}
                >
                  Rotate Secret
                </Button>

              )}

            </div>

          </div>

        )}

      </Modal>

      {/* ======================================================
          ROTATE CONFIRMATION MODAL
      ======================================================= */}

      <Modal
        open={showRotateConfirm}
        onClose={closeRotateConfirm}
      >

        {rotatingClient && (

          <div className="p-6 w-full max-w-md">

            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-xl bg-warning-500/10 border border-warning-500/20 flex items-center justify-center shrink-0">

                <RefreshCw className="w-5 h-5 text-warning-400" />

              </div>

              <div>

                <h2 className="text-lg font-semibold text-ink-50">
                  Rotate client secret?
                </h2>

                <p className="text-sm text-ink-400 mt-1">

                  Generate a new secret for{' '}

                  <span className="text-ink-200 font-medium">
                    {rotatingClient.name}
                  </span>

                  .

                </p>

              </div>

            </div>

            {/* Warning */}

            <div className="mt-5 p-4 rounded-xl bg-warning-500/5 border border-warning-500/20">

              <div className="flex gap-3">

                <AlertTriangle className="w-5 h-5 text-warning-400 shrink-0" />

                <div>

                  <p className="text-sm font-medium text-warning-300">
                    The current secret will stop working
                  </p>

                  <p className="text-xs text-warning-400/80 mt-1 leading-relaxed">
                    Any server using the existing client secret
                    must be updated with the new secret after
                    rotation.
                  </p>

                </div>

              </div>

            </div>

            {/* Client ID */}

            <div className="mt-5">

              <p className="text-xs text-ink-500 mb-2">
                Client ID
              </p>

              <code className="block px-3 py-2.5 rounded-lg bg-ink-900 border border-ink-700 text-xs font-mono text-ink-300 break-all">
                {rotatingClient.client_id}
              </code>

            </div>

            {/* Actions */}

            <div className="flex gap-3 mt-6">

              <Button
                variant="secondary"
                className="flex-1"
                onClick={closeRotateConfirm}
                disabled={rotating}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                onClick={rotateSecret}
                disabled={rotating}
                icon={
                  rotating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )
                }
              >
                {rotating
                  ? 'Rotating...'
                  : 'Rotate Secret'}
              </Button>

            </div>

          </div>

        )}

      </Modal>

      {/* ======================================================
          ROTATED SECRET MODAL
      ======================================================= */}

      <Modal
        open={showRotatedSecret}
        onClose={closeRotatedSecret}
      >

        <div className="p-6 w-full max-w-xl">

          {/* Success */}

          <div className="text-center mb-6">

            <div className="w-16 h-16 rounded-2xl bg-success-500/10 border border-success-500/20 flex items-center justify-center mx-auto mb-4">

              <Check className="w-8 h-8 text-success-400" />

            </div>

            <h2 className="text-xl font-semibold text-ink-50">
              Secret Rotated Successfully
            </h2>

            <p className="text-sm text-ink-400 mt-1">
              Your new client secret has been generated.
            </p>

          </div>

          {/* Warning */}

          <div className="p-4 rounded-xl bg-warning-500/5 border border-warning-500/20 mb-5">

            <div className="flex gap-3">

              <AlertTriangle className="w-5 h-5 text-warning-400 shrink-0" />

              <div>

                <p className="text-sm font-semibold text-warning-300">
                  Save this secret now
                </p>

                <p className="text-xs text-warning-400/80 mt-1 leading-relaxed">
                  This secret will only be displayed once.
                  NID does not store the plaintext secret.
                </p>

              </div>

            </div>

          </div>

          {/* Client */}

          {rotatingClient && (

            <div className="mb-4">

              <label className="block text-xs font-medium text-ink-400 uppercase tracking-wider mb-2">
                Client
              </label>

              <div className="px-3 py-3 rounded-lg bg-ink-900 border border-ink-700">

                <p className="text-sm font-medium text-ink-100">
                  {rotatingClient.name}
                </p>

                <p className="text-xs font-mono text-ink-500 mt-1 break-all">
                  {rotatingClient.client_id}
                </p>

              </div>

            </div>

          )}

          {/* Secret */}

          <div>

            <div className="flex items-center justify-between mb-2">

              <label className="text-xs font-medium text-ink-400 uppercase tracking-wider">
                New Client Secret
              </label>

              <span className="text-[10px] text-warning-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                One time only
              </span>

            </div>

            <div className="flex gap-2">

              <div className="flex-1 min-w-0 flex items-center px-3 py-3 rounded-lg bg-ink-900 border border-warning-500/30">

                <code className="flex-1 text-sm font-mono text-ink-100 break-all">

                  {showNewSecret
                    ? rotatingSecret
                    : '••••••••••••••••••••••••••••••••'}

                </code>

                <button
                  onClick={() =>
                    setShowNewSecret(
                      (prev) => !prev,
                    )
                  }
                  className="ml-2 shrink-0 text-ink-400 hover:text-ink-100"
                >
                  {showNewSecret ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

              <button
                onClick={() =>
                  rotatingSecret &&
                  copy(
                    rotatingSecret,
                    'New Client Secret',
                  )
                }
                className="shrink-0 px-3 rounded-lg bg-brand-600 text-white hover:bg-brand-500 transition-colors"
              >

                {copied === 'New Client Secret' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}

              </button>

            </div>

          </div>

          {/* Security */}

          <div className="mt-5 p-4 rounded-xl bg-ink-900/60 border border-ink-700">

            <div className="flex gap-3">

              <ShieldCheck className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />

              <div>

                <p className="text-xs font-medium text-ink-200">
                  Keep this secret private
                </p>

                <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">
                  Never put your client secret in React,
                  frontend JavaScript, mobile apps, GitHub,
                  or other public repositories.
                </p>

              </div>

            </div>

          </div>

          {/* Done */}

          <Button
            className="w-full mt-6"
            onClick={closeRotatedSecret}
          >
            I've Saved My New Secret
          </Button>

        </div>

      </Modal>

    </div>
  );
}
