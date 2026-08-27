import { useEffect, useMemo, useState, type ReactNode } from "react";

/* ============================================================
   NID Docs — @nid/react SDK
   No-backend OAuth 2.0 + OIDC integration. Single-file docs
   surface built on the existing design tokens (glass,
   card-surface, gradient-text, grid-bg, ink, brand, and
   success/warning/danger utility classes).
============================================================ */

/* ------------------------------------------------------------
   Small building blocks
------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-brand-light/80">
          {eyebrow}
        </p>
      )}
      <h1 className="gradient-text text-3xl font-bold sm:text-4xl">{title}</h1>
      {lead && <p className="mt-3 max-w-2xl text-ink-300">{lead}</p>}
    </div>
  );
}

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="mb-3 mt-10 scroll-mt-24 text-xl font-semibold text-ink-50 first:mt-0"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mb-4 leading-7 text-ink-300">{children}</p>;
}

function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "danger" | "success";
  title: string;
  children: ReactNode;
}) {
  const toneMap = {
    info: { icon: "i", cls: "border-brand-500/50 text-brand-light" },
    warn: { icon: "!", cls: "border-warning-400/40 text-warning-400" },
    danger: { icon: "!", cls: "border-danger-400/40 text-danger-400" },
    success: { icon: "✓", cls: "border-success-400/40 text-success-400" },
  } as const;
  const t = toneMap[tone];
  return (
    <div className={`card-surface my-5 border p-4 ${t.cls}`}>
      <div className="flex gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border font-mono text-[11px] ${t.cls}`}
        >
          {t.icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-100">{title}</p>
          <div className="mt-1 text-sm leading-6 text-ink-300">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({
  code,
  lang = "text",
  title,
}: {
  code: string;
  lang?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div className="card-surface my-5 overflow-hidden !rounded-xl">
      <div className="flex items-center justify-between border-b border-ink-800 bg-ink-900/60 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success-400/60" />
          {title && (
            <span className="ml-2 font-mono text-xs text-ink-400">{title}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-500">
            {lang}
          </span>
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-ink-700 px-2 py-1 font-mono text-[11px] text-ink-300 transition hover:border-brand-500/50 hover:text-brand-light"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-6">
        <code className="font-mono text-ink-200">{code}</code>
      </pre>
    </div>
  );
}

function Table({
  head,
  rows,
}: {
  head: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="card-surface my-5 overflow-x-auto !rounded-xl">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink-800 bg-ink-900/60">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-ink-800/60 last:border-0 hover:bg-ink-800/30"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-ink-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------
   Navigation model
------------------------------------------------------------ */

type Category =
  | "Getting Started"
  | "Core Concepts"
  | "Framework Guides"
  | "SDK Reference"
  | "Security"
  | "Troubleshooting";

interface NavEntry {
  id: string;
  title: string;
  category: Category;
  keywords: string;
}

const NAV: NavEntry[] = [
  { id: "overview", title: "Overview", category: "Getting Started", keywords: "nid react sdk no backend" },
  { id: "install", title: "Install & configure", category: "Getting Started", keywords: "npm nidprovider clientid setup" },
  { id: "quickstart", title: "Quick start", category: "Getting Started", keywords: "login button dashboard 5 minutes" },

  { id: "public-clients", title: "Public clients & PKCE", category: "Core Concepts", keywords: "no secret spa client type authorization code" },
  { id: "session-tokens", title: "Session & token storage", category: "Core Concepts", keywords: "access token id token memory storage refresh" },
  { id: "user-object", title: "The user object", category: "Core Concepts", keywords: "sub name preferred_username claims" },

  { id: "guide-react", title: "React", category: "Framework Guides", keywords: "vite create-react-app spa" },
  { id: "guide-nextjs", title: "Next.js", category: "Framework Guides", keywords: "app router client component provider" },
  { id: "guide-angular", title: "Angular", category: "Framework Guides", keywords: "angular service standalone component" },
  { id: "guide-other", title: "Other frameworks", category: "Framework Guides", keywords: "vue svelte vanilla rest api core" },

  { id: "ref-provider", title: "<NIDProvider>", category: "SDK Reference", keywords: "clientid props context" },
  { id: "ref-usenid", title: "useNID()", category: "SDK Reference", keywords: "hook user isauthenticated isloading login logout" },
  { id: "ref-loginbutton", title: "<NIDLoginButton>", category: "SDK Reference", keywords: "button styling props colors" },

  { id: "security-no-secrets", title: "Never ship a client secret", category: "Security", keywords: "clientsecret bundle devtools leak public client" },
  { id: "security-redirect", title: "Redirect URI allow-list", category: "Security", keywords: "callback origin registered uri" },
  { id: "security-logout", title: "Logout & multi-tab sessions", category: "Security", keywords: "logout storage event broadcast channel" },

  { id: "troubleshooting", title: "Common issues", category: "Troubleshooting", keywords: "isauthenticated stuck loading redirect_uri cors" },
];

const CATEGORY_ORDER: Category[] = [
  "Getting Started",
  "Core Concepts",
  "Framework Guides",
  "SDK Reference",
  "Security",
  "Troubleshooting",
];

/* ------------------------------------------------------------
   Reusable snippet fragments
------------------------------------------------------------ */

const INSTALL_CMD = `npm install @nid/react`;

const PROVIDER_SETUP = `// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NIDProvider } from "@nid/react";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NIDProvider
      clientId="2X85wiHX94Sng0hJ2lZhfYEQe-164JM5"
      redirectUri="http://localhost:5173/callback"
    >
      <App />
    </NIDProvider>
  </StrictMode>,
);`;

const LOGIN_PAGE = `// src/pages/Login.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNID, NIDLoginButton } from "@nid/react";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useNID();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-sm text-gray-400">Loading NID session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
        <div className="mb-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-bold text-black">
            N
          </div>
          <h1 className="mb-2 text-3xl font-bold">Welcome</h1>
          <p className="text-gray-400">Sign in to Example App with your NID identity.</p>
        </div>

        <NIDLoginButton
          width="100%"
          height="48px"
          borderRadius="12px"
          backgroundColor="#0f172a"
          hoverBackgroundColor="#1e293b"
          borderColor="rgba(6, 182, 212, 0.3)"
          textColor="#e2e8f0"
          fontSize="15px"
          fontWeight={600}
        >
          Sign in with NID
        </NIDLoginButton>

        <div className="mt-6 rounded-xl border border-gray-800 bg-black/40 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 text-green-400">✓</div>
            <div>
              <p className="text-sm font-medium text-gray-200">Secure authentication</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Handled entirely in-browser by NID using OAuth 2.0 and OpenID Connect with PKCE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

const DASHBOARD_PAGE = `// src/pages/Dashboard.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNID } from "@nid/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useNID();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <FullscreenLoader />;
  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink-950 text-ink-50 p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-ink-400">Welcome to the demo application.</p>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-ink-700 px-4 py-2">
            Logout
          </button>
        </div>

        <div className="card-surface p-6">
          <h2 className="mb-5 text-lg font-semibold">NID Identity</h2>
          <dl className="grid gap-5">
            <div>
              <dt className="text-xs text-ink-500">User ID</dt>
              <dd className="mt-1 font-mono">{user.sub}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500">Name</dt>
              <dd className="mt-1">{user.name || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500">NID Handle</dt>
              <dd className="mt-1 font-semibold text-brand-light">{user.preferred_username}.nid</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}`;

const CALLBACK_ROUTE = `// src/pages/Callback.tsx
// The redirect target you registered as redirectUri. NIDProvider
// completes the code exchange here and then hands control back to
// your router — this route just needs to exist and render nothing
// (or a spinner) while that happens.
import { useNID } from "@nid/react";
import { Navigate } from "react-router-dom";

export default function Callback() {
  const { isLoading, isAuthenticated } = useNID();
  if (isLoading) return <FullscreenLoader />;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}`;

const NEXTJS_PROVIDER = `// app/providers.tsx
"use client";

import { NIDProvider } from "@nid/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NIDProvider
      clientId={process.env.NEXT_PUBLIC_NID_CLIENT_ID!}
      redirectUri={process.env.NEXT_PUBLIC_NID_REDIRECT_URI!}
    >
      {children}
    </NIDProvider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`;

const NEXTJS_PAGE = `// app/dashboard/page.tsx
"use client";

import { useNID } from "@nid/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useNID();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) return null;
  return <p>Welcome, {user.name}</p>;
}`;

const ANGULAR_MODULE = `// src/app/app.config.ts
import { ApplicationConfig } from "@angular/core";
import { provideNID } from "@nid/angular";

export const appConfig: ApplicationConfig = {
  providers: [
    provideNID({
      clientId: "2X85wiHX94Sng0hJ2lZhfYEQe-164JM5",
      redirectUri: "http://localhost:4200/callback",
    }),
  ],
};`;

const ANGULAR_COMPONENT = `// src/app/login/login.component.ts
import { Component, inject, effect } from "@angular/core";
import { Router } from "@angular/router";
import { NIDService } from "@nid/angular";

@Component({
  selector: "app-login",
  standalone: true,
  template: \`
    <button (click)="nid.login()" [disabled]="nid.isLoading()">
      Sign in with NID
    </button>
  \`,
})
export class LoginComponent {
  nid = inject(NIDService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.nid.isLoading() && this.nid.isAuthenticated()) {
        this.router.navigateByUrl("/dashboard");
      }
    });
  }
}`;

const OTHER_FRAMEWORKS = `// @nid/react and @nid/angular wrap the same underlying flow.
// For Vue, Svelte, or a framework-less page, drive it directly:

import { NIDClient } from "@nid/core";

export const nid = new NIDClient({
  clientId: "2X85wiHX94Sng0hJ2lZhfYEQe-164JM5",
  redirectUri: "https://app.yourapp.com/callback",
});

// Kick off login
nid.login();

// On your redirect route
await nid.handleRedirectCallback();

// Anywhere after that
const user = nid.getUser();
const isAuthenticated = nid.isAuthenticated();`;

const PROVIDER_PROPS_ROWS: (string | ReactNode)[][] = [
  ["clientId", "string", "Your public client ID from the NID console. Safe to embed — it identifies the app, it doesn't authorize on its own."],
  ["redirectUri", "string", "Must exactly match a URI registered for this client. Where the SDK completes the code exchange."],
  ["scope", "string (optional)", 'Defaults to "openid". Add space-delimited scopes your client is approved for.'],
  ["storage", '"memory" | "localStorage" (optional)', "Where the session is cached between reloads. Defaults to memory — see Session & token storage."],
];

const USENID_ROWS: (string | ReactNode)[][] = [
  ["user", "{ sub, name, preferred_username } | null", "The current identity, or null while unauthenticated."],
  ["isAuthenticated", "boolean", "True once a valid session exists."],
  ["isLoading", "boolean", "True while the SDK is restoring or exchanging a session. Gate all redirect logic on this being false first."],
  ["login()", "() => void", "Starts the redirect to NID. Equivalent to what <NIDLoginButton> calls internally."],
  ["logout()", "() => void", "Clears the local session. Pair with a navigate() back to your login route."],
];

const LOGINBUTTON_ROWS: (string | ReactNode)[][] = [
  ["width / height", "string", 'CSS size values, e.g. "100%", "48px".'],
  ["borderRadius", "string", "CSS border-radius value."],
  ["backgroundColor / hoverBackgroundColor", "string", "Button fill, default and hover states."],
  ["borderColor", "string", "Button border color, any CSS color value."],
  ["textColor / iconColor", "string", "Label and icon color."],
  ["fontSize / fontWeight", "string / number", "Label typography."],
  ["children", "ReactNode", 'Button label — defaults to "Sign in with NID" if omitted.'],
];

/* ------------------------------------------------------------
   Main component
------------------------------------------------------------ */

export default function Docs() {
  const [active, setActive] = useState("overview");
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [active]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV;
    return NAV.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<Category, NavEntry[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const entry of filtered) map.get(entry.category)?.push(entry);
    return map;
  }, [filtered]);

  return (
    <div className="grid-bg min-h-screen">
      {/* Top bar */}
      <header className="glass sticky top-0 z-30 flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            className="rounded-lg border border-ink-800 p-2 text-ink-300 lg:hidden"
            aria-label="Toggle navigation"
          >
            <BurgerIcon />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
            N
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-50">NID Docs</p>
            <p className="text-xs text-ink-500">@nid/react · no backend required</p>
          </div>
        </div>

        <div className="hidden max-w-sm flex-1 sm:mx-8 sm:block">
          <SearchInput query={query} setQuery={setQuery} />
        </div>

        <a
          href="#quickstart"
          onClick={() => setActive("quickstart")}
          className="hidden rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-500 sm:inline-block"
        >
          Quick start
        </a>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside
          className={`${
            navOpen ? "block" : "hidden"
          } glass fixed inset-y-0 left-0 z-20 w-72 overflow-y-auto pt-20 lg:sticky lg:top-[65px] lg:block lg:h-[calc(100vh-65px)] lg:border-r lg:border-ink-800 lg:bg-transparent lg:pt-6 lg:backdrop-blur-none`}
        >
          <div className="px-4 pb-10 sm:px-6 lg:px-4">
            <div className="mb-4 sm:hidden">
              <SearchInput query={query} setQuery={setQuery} />
            </div>

            {CATEGORY_ORDER.map((cat) => {
              const entries = grouped.get(cat) ?? [];
              if (entries.length === 0) return null;
              return (
                <div key={cat} className="mb-6">
                  <p className="mb-2 px-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-500">
                    {cat}
                  </p>
                  <nav className="space-y-0.5">
                    {entries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => setActive(entry.id)}
                        className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition ${
                          active === entry.id
                            ? "bg-brand-600/15 font-medium text-brand-light"
                            : "text-ink-300 hover:bg-ink-800/50 hover:text-ink-100"
                        }`}
                      >
                        {entry.title}
                      </button>
                    ))}
                  </nav>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p className="px-2 text-sm text-ink-500">No results for "{query}".</p>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-4 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <Breadcrumb id={active} />
            <PageContent id={active} onNavigate={setActive} />
          </div>
        </main>
      </div>
    </div>
  );
}

function SearchInput({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search docs…"
        className="w-full rounded-lg border border-ink-800 bg-ink-900/60 py-2 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-500 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}

function Breadcrumb({ id }: { id: string }) {
  const entry = NAV.find((n) => n.id === id);
  if (!entry) return null;
  return (
    <p className="mb-4 flex items-center gap-2 font-mono text-xs text-ink-500">
      <span>{entry.category}</span>
      <span>/</span>
      <span className="text-ink-300">{entry.title}</span>
    </p>
  );
}

function BurgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------
   Page content — one function per NAV id
------------------------------------------------------------ */

function PageContent({
  id,
  onNavigate,
}: {
  id: string;
  onNavigate: (id: string) => void;
}) {
  switch (id) {
    case "overview":
      return <Overview onNavigate={onNavigate} />;
    case "install":
      return <Install />;
    case "quickstart":
      return <QuickStart />;
    case "public-clients":
      return <PublicClients />;
    case "session-tokens":
      return <SessionTokens />;
    case "user-object":
      return <UserObject />;
    case "guide-react":
      return <GuideReact />;
    case "guide-nextjs":
      return <GuideNextjs />;
    case "guide-angular":
      return <GuideAngular />;
    case "guide-other":
      return <GuideOther />;
    case "ref-provider":
      return <RefProvider />;
    case "ref-usenid":
      return <RefUseNID />;
    case "ref-loginbutton":
      return <RefLoginButton />;
    case "security-no-secrets":
      return <SecurityNoSecrets />;
    case "security-redirect":
      return <SecurityRedirect />;
    case "security-logout":
      return <SecurityLogout />;
    case "troubleshooting":
      return <Troubleshooting />;
    default:
      return <Overview onNavigate={onNavigate} />;
  }
}

/* ---------- Getting Started ---------- */

function Overview({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <>
      <SectionHeading
        eyebrow="NID Platform"
        title="Sign-in with no backend to run"
        lead="@nid/react wraps the entire OAuth 2.0 + OIDC exchange — redirect, callback, token handling, session restore — behind a provider and a hook. Your app never touches a token directly."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "Zero server code", d: "NIDProvider + useNID() is the whole integration. No /oauth/callback route for you to write." },
          { t: "Public client, PKCE only", d: "No client secret exists in this model — the SDK generates and verifies PKCE per login attempt." },
          { t: "One hook, everywhere", d: "user, isAuthenticated, isLoading, login(), logout() — same shape in React, Next.js, and Angular." },
        ].map((c) => (
          <div key={c.t} className="card-surface glass-hover p-5">
            <p className="mb-1 text-sm font-semibold text-ink-100">{c.t}</p>
            <p className="text-sm leading-6 text-ink-400">{c.d}</p>
          </div>
        ))}
      </div>

      <H2>What the SDK does under the hood</H2>
      <CodeBlock
        lang="text"
        title="request flow"
        code={`Browser (your app)                                 NID
   |  <NIDLoginButton> click                          |
   |  SDK generates state + PKCE pair, redirects ----->|
   |                                                    |
   |          user authenticates + approves on NID      |
   |  <---- 302 redirect to your redirectUri -----------|
   |                                                    |
   |  SDK exchanges code + code_verifier -------------->|
   |  <---- tokens -------------------------------------|
   |  SDK fetches identity ---------------------------->|
   |  <---- sub, name, preferred_username --------------|
   |                                                    |
   |  useNID() now returns { user, isAuthenticated }     |`}
      />

      <Callout tone="info" title="No client secret in this flow, ever">
        A confidential secret has no place in code that ships to a browser. This
        SDK is built for <strong className="text-ink-100">public clients</strong> —
        registered with only a <code className="font-mono text-xs">client_id</code>{" "}
        and one or more allow-listed redirect URIs. See{" "}
        <button className="underline decoration-dotted underline-offset-2" onClick={() => onNavigate("public-clients")}>
          Public clients &amp; PKCE
        </button>{" "}
        for why that's still secure.
      </Callout>

      <H2>Where to start</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { id: "install", t: "Install & configure", d: "Add the package, wire up NIDProvider." },
          { id: "quickstart", t: "Quick start", d: "Login button to protected dashboard in one pass." },
          { id: "guide-nextjs", t: "Next.js guide", d: "Provider placement in the App Router." },
          { id: "security-no-secrets", t: "Never ship a client secret", d: "What to fix if your console gave you one." },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => onNavigate(c.id)}
            className="card-surface glass-hover p-4 text-left"
          >
            <p className="text-sm font-semibold text-brand-light">{c.t} →</p>
            <p className="mt-1 text-sm text-ink-400">{c.d}</p>
          </button>
        ))}
      </div>
    </>
  );
}

function Install() {
  return (
    <>
      <SectionHeading eyebrow="Getting Started" title="Install & configure" lead="Register a public client, then wrap your app in NIDProvider." />

      <H2>1. Register a public (SPA) client</H2>
      <P>
        In the NID console, create an application and choose client type{" "}
        <strong className="text-ink-100">Public / SPA</strong> — not Confidential. Public
        clients receive only a <code className="font-mono text-xs">client_id</code>; no
        secret is issued, because none should ever exist in browser code.
      </P>
      <Table
        head={["Field", "Value"]}
        rows={[
          ["Client type", "Public (SPA)"],
          ["Grant type", "Authorization Code + PKCE"],
          ["Redirect URIs", "Every exact URL your app redirects back to — one per environment"],
        ]}
      />

      <H2>2. Install the package</H2>
      <CodeBlock lang="bash" code={INSTALL_CMD} />

      <H2>3. Wrap your app</H2>
      <CodeBlock lang="tsx" title="src/main.tsx" code={PROVIDER_SETUP} />

      <Callout tone="success" title="clientId is safe to commit">
        Unlike a secret, <code className="font-mono text-xs">clientId</code> identifies
        your app but can't authorize anything by itself — PKCE does the proving. It's fine
        in source control and in your bundled JS.
      </Callout>
    </>
  );
}

function QuickStart() {
  return (
    <>
      <SectionHeading eyebrow="Getting Started" title="Quick start" lead="A login page, a protected dashboard, and the callback route that connects them." />

      <H2>1. Login page</H2>
      <CodeBlock lang="tsx" title="src/pages/Login.tsx" code={LOGIN_PAGE} />

      <H2>2. Callback route</H2>
      <P>Point <code className="font-mono text-xs">redirectUri</code> at a real route in your router. It only needs to exist — the SDK does the exchange automatically when this route mounts.</P>
      <CodeBlock lang="tsx" title="src/pages/Callback.tsx" code={CALLBACK_ROUTE} />

      <H2>3. Protected dashboard</H2>
      <CodeBlock lang="tsx" title="src/pages/Dashboard.tsx" code={DASHBOARD_PAGE} />

      <Callout tone="success" title="That's the whole integration">
        No token exchange to write, no cookie to set, no CORS config for a backend that
        doesn't exist. <code className="font-mono text-xs">isLoading</code> covers the
        window while the SDK restores or exchanges a session — always gate redirects on
        it being false first.
      </Callout>
    </>
  );
}

/* ---------- Core Concepts ---------- */

function PublicClients() {
  return (
    <>
      <SectionHeading eyebrow="Core Concepts" title="Public clients & PKCE" lead="Why a browser-only app can be secure without ever holding a secret." />

      <P>
        A <strong className="text-ink-100">confidential client</strong> (a backend) proves
        its identity with a secret only it knows. A browser can't keep a secret — anything
        shipped in JS is readable by the person running that JS. OAuth's answer for this
        case is the <strong className="text-ink-100">public client</strong>: no secret is
        issued at all, and <strong className="text-ink-100">PKCE</strong> takes over proving
        that whoever exchanges the authorization code is the same party who started the
        login.
      </P>

      <H2>How PKCE replaces the secret</H2>
      <ol className="mb-6 space-y-4">
        {[
          ["SDK generates a code_verifier", "A random string, created fresh in memory for this login attempt only."],
          ["Derives a code_challenge", "sha256(code_verifier), sent with the initial redirect to NID — the verifier itself is never sent yet."],
          ["NID stores the challenge against the issued code", "Anyone who intercepts the code alone still can't redeem it."],
          ["SDK exchanges the code together with the original verifier", "NID recomputes the hash and checks it matches — proving continuity without any long-lived secret."],
        ].map(([t, d], i) => (
          <li key={t} className="card-surface flex gap-4 p-4">
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-600/20 font-mono text-xs font-semibold text-brand-light">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-100">{t}</p>
              <p className="mt-0.5 text-sm text-ink-400">{d}</p>
            </div>
          </li>
        ))}
      </ol>

      <Callout tone="warn" title="If your console issued a client secret, request a public client instead">
        A secret paired with an SDK that runs entirely in the browser means that secret
        is effectively public the moment you ship it. Re-register the app as Public /
        SPA — you'll get a <code className="font-mono text-xs">client_id</code> and
        nothing else, which is what <code className="font-mono text-xs">NIDProvider</code>{" "}
        expects.
      </Callout>
    </>
  );
}

function SessionTokens() {
  return (
    <>
      <SectionHeading eyebrow="Core Concepts" title="Session & token storage" lead="The SDK holds tokens for you — but where it holds them is a real security choice." />

      <Table
        head={["storage option", "Persists across reload", "Exposure if XSS occurs"]}
        rows={[
          ["memory (default)", "No — re-runs the silent session check on load", "Lowest — nothing readable from disk or a storage API"],
          ["localStorage", "Yes — instant restore, no network round trip", "Higher — any injected script can read it directly"],
        ]}
      />

      <CodeBlock
        lang="tsx"
        code={`<NIDProvider
  clientId="..."
  redirectUri="..."
  storage="memory" // default — recommended unless you need instant reload restore
>`}
      />

      <Callout tone="info" title="Prefer memory storage">
        The brief reload flash from a memory-only session (useNID() resolving
        isLoading a moment after mount) is a small UX cost for meaningfully lower
        exposure if an XSS bug ever slips into your app. Reach for{" "}
        <code className="font-mono text-xs">localStorage</code> only if that flash is
        genuinely unacceptable for your product, and pair it with strict output
        encoding and a Content-Security-Policy elsewhere in the app.
      </Callout>
    </>
  );
}

function UserObject() {
  return (
    <>
      <SectionHeading eyebrow="Core Concepts" title="The user object" lead="What useNID().user contains once isAuthenticated is true." />
      <CodeBlock
        lang="ts"
        code={`interface NIDUser {
  sub: string;                  // stable, durable user ID — use this as your foreign key
  name: string | null;          // display name, can be empty
  preferred_username: string;   // NID handle, e.g. "ada"
}`}
      />
      <P>Treat <code className="font-mono text-xs">sub</code> as the identifier you store — <code className="font-mono text-xs">name</code> and <code className="font-mono text-xs">preferred_username</code> can change over time.</P>
    </>
  );
}

/* ---------- Framework Guides ---------- */

function GuideShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <>
      <SectionHeading eyebrow="Framework Guide" title={title} lead={lead} />
      {children}
    </>
  );
}

function GuideReact() {
  return (
    <GuideShell title="React" lead="Vite, Create React App, or any React Router setup — the pattern from Quick start.">
      <CodeBlock lang="tsx" title="src/main.tsx" code={PROVIDER_SETUP} />
      <CodeBlock lang="tsx" title="src/pages/Login.tsx" code={LOGIN_PAGE} />
      <CodeBlock lang="tsx" title="src/pages/Dashboard.tsx" code={DASHBOARD_PAGE} />
    </GuideShell>
  );
}

function GuideNextjs() {
  return (
    <GuideShell title="Next.js" lead="NIDProvider needs the browser, so it lives in a Client Component boundary at the root of the App Router tree.">
      <CodeBlock lang="tsx" title="app/providers.tsx + app/layout.tsx" code={NEXTJS_PROVIDER} />
      <H2>Using useNID() in a page</H2>
      <CodeBlock lang="tsx" title="app/dashboard/page.tsx" code={NEXTJS_PAGE} />

      <Callout tone="warn" title="Client-side identity only">
        Because this is a public-client, browser-driven flow, <code className="font-mono text-xs">useNID()</code>{" "}
        only resolves in Client Components — a Server Component can't read the session
        directly. If you need the identity during server rendering (not just after
        hydration), that's a signal you actually want a backend-mediated flow instead of
        the no-backend SDK.
      </Callout>

      <H2>Environment variables</H2>
      <CodeBlock lang="bash" title=".env.local" code={`NEXT_PUBLIC_NID_CLIENT_ID=2X85wiHX94Sng0hJ2lZhfYEQe-164JM5
NEXT_PUBLIC_NID_REDIRECT_URI=http://localhost:3000/callback`} />
      <P><code className="font-mono text-xs">NEXT_PUBLIC_</code> vars are bundled into client JS by design — which is fine here, since a public client's <code className="font-mono text-xs">clientId</code> is meant to be visible.</P>
    </GuideShell>
  );
}

function GuideAngular() {
  return (
    <GuideShell title="Angular" lead="provideNID() in your app config, NIDService injected wherever you need the session.">
      <CodeBlock lang="typescript" title="src/app/app.config.ts" code={ANGULAR_MODULE} />
      <CodeBlock lang="typescript" title="src/app/login/login.component.ts" code={ANGULAR_COMPONENT} />
      <P><code className="font-mono text-xs">NIDService</code> exposes the same shape as <code className="font-mono text-xs">useNID()</code> — <code className="font-mono text-xs">user()</code>, <code className="font-mono text-xs">isAuthenticated()</code>, <code className="font-mono text-xs">isLoading()</code> as signals, plus <code className="font-mono text-xs">login()</code> and <code className="font-mono text-xs">logout()</code>.</P>
    </GuideShell>
  );
}

function GuideOther() {
  return (
    <GuideShell title="Other frameworks" lead="Vue, Svelte, SolidJS, or no framework at all — drop to the framework-less core client.">
      <CodeBlock lang="typescript" title="@nid/core" code={OTHER_FRAMEWORKS} />
      <P><code className="font-mono text-xs">@nid/react</code> and <code className="font-mono text-xs">@nid/angular</code> are thin wrappers over <code className="font-mono text-xs">@nid/core</code> — the redirect, PKCE, and token handling logic is identical underneath.</P>
    </GuideShell>
  );
}

/* ---------- SDK Reference ---------- */

function RefProvider() {
  return (
    <>
      <SectionHeading eyebrow="SDK Reference" title="<NIDProvider>" lead="Wraps your app once, at the root. Every useNID() call below it shares the same session." />
      <Table head={["Prop", "Type", "Notes"]} rows={PROVIDER_PROPS_ROWS} />
      <Callout tone="danger" title="No clientSecret prop exists">
        If you're passing <code className="font-mono text-xs">clientSecret</code> to{" "}
        <code className="font-mono text-xs">NIDProvider</code>, stop and re-register the
        app as a public client — see{" "}
        <code className="font-mono text-xs">Security → Never ship a client secret</code>.
      </Callout>
    </>
  );
}

function RefUseNID() {
  return (
    <>
      <SectionHeading eyebrow="SDK Reference" title="useNID()" lead="The one hook you need — call it from any component under NIDProvider." />
      <Table head={["Field", "Type", "Notes"]} rows={USENID_ROWS} />
      <CodeBlock lang="tsx" code={`const { user, isAuthenticated, isLoading, login, logout } = useNID();`} />
      <Callout tone="info" title="Always check isLoading before isAuthenticated">
        On first mount the SDK is restoring (or exchanging) a session — treating a
        false isAuthenticated as "logged out" before isLoading settles causes a
        flash-redirect to your login page even for already-signed-in users.
      </Callout>
    </>
  );
}

function RefLoginButton() {
  return (
    <>
      <SectionHeading eyebrow="SDK Reference" title="<NIDLoginButton>" lead="A pre-wired button that calls login() on click — fully restyleable via props." />
      <Table head={["Prop", "Type", "Notes"]} rows={LOGINBUTTON_ROWS} />
      <CodeBlock
        lang="tsx"
        code={`<NIDLoginButton
  width="100%"
  height="48px"
  borderRadius="12px"
  backgroundColor="#0f172a"
  hoverBackgroundColor="#1e293b"
  borderColor="rgba(6, 182, 212, 0.3)"
  textColor="#e2e8f0"
  fontSize="15px"
  fontWeight={600}
>
  Sign in with NID
</NIDLoginButton>`}
      />
      <P>Prefer this over calling <code className="font-mono text-xs">login()</code> from a plain <code className="font-mono text-xs">{"<button>"}</code> only when you want the styling props above — functionally they're equivalent.</P>
    </>
  );
}

/* ---------- Security ---------- */

function SecurityNoSecrets() {
  return (
    <>
      <SectionHeading eyebrow="Security" title="Never ship a client secret" lead="The single most important rule for this SDK." />

      <P>
        Anything that ends up in the JavaScript your app serves — including a value
        passed as a prop to <code className="font-mono text-xs">NIDProvider</code> — is
        readable by anyone who opens dev tools or views the page source. There is no
        bundler setting, obfuscation trick, or environment-variable naming convention
        that changes this. A value only stays secret if it never leaves a server you
        control.
      </P>

      <Callout tone="danger" title="If your console gave you a client secret for this app">
        <>
          That means the app was registered as a <strong>confidential</strong> client,
          which is the wrong type for a browser-only SDK. Two options:
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Re-register (or ask an admin to re-register) the application as <strong>Public / SPA</strong> — you'll receive a <code className="font-mono text-xs">client_id</code> only.</li>
            <li>If you specifically need the confidential-client flow, that means you need a backend to hold the secret — that's a different integration than this no-backend SDK.</li>
          </ul>
        </>
      </Callout>

      <H2>Correct vs. incorrect provider setup</H2>
      <Table
        head={["", "Example"]}
        rows={[
          ["Correct — public client", <code className="font-mono text-xs">{'<NIDProvider clientId="..." redirectUri="..." />'}</code>],
          ["Incorrect — secret in browser code", <span className="text-danger-400"><code className="font-mono text-xs">{'<NIDProvider clientId="..." clientSecret="..." />'}</code> — extractable from any deployed build</span>],
        ]}
      />
    </>
  );
}

function SecurityRedirect() {
  return (
    <>
      <SectionHeading eyebrow="Security" title="Redirect URI allow-list" lead="The one server-side check standing between an attacker and your users, for a public client." />
      <P>
        Because there's no secret, NID's only guarantee that a code is going to the right
        place is the <code className="font-mono text-xs">redirect_uri</code> allow-list.
        Register every environment's exact callback URL — scheme, host, port, and path —
        and nothing broader.
      </P>
      <Callout tone="warn" title="Don't register a wildcard or a shared local URI across projects">
        A loosely-matched redirect URI is the classic way a public client's authorization
        code gets sent somewhere other than your app.
      </Callout>
    </>
  );
}

function SecurityLogout() {
  return (
    <>
      <SectionHeading eyebrow="Security" title="Logout & multi-tab sessions" lead="logout() clears the local session — make sure every open tab notices." />
      <CodeBlock
        lang="tsx"
        code={`const { logout } = useNID();

const handleLogout = () => {
  logout();
  navigate("/login", { replace: true });
};`}
      />
      <P>
        With <code className="font-mono text-xs">storage="memory"</code> (the default),
        each tab holds its own session in memory, so a logout in one tab doesn't
        automatically clear another already-open tab until it revalidates. If your app
        needs immediate cross-tab logout, dispatch a{" "}
        <code className="font-mono text-xs">BroadcastChannel</code> event alongside{" "}
        <code className="font-mono text-xs">logout()</code> and call it from every open
        tab's listener.
      </P>
    </>
  );
}

/* ---------- Troubleshooting ---------- */

function Troubleshooting() {
  return (
    <>
      <SectionHeading eyebrow="Troubleshooting" title="Common issues" />
      <Table
        head={["Symptom", "Likely cause", "Fix"]}
        rows={[
          ["isAuthenticated flips to false on every reload", "storage is set to memory and the silent session check is failing.", "Check that redirectUri exactly matches a registered URI, and that third-party cookies/storage aren't blocked for the NID domain."],
          ["Stuck on isLoading forever", "Callback route never mounted, or redirectUri points somewhere the SDK isn't listening.", "Confirm the redirect URL in the console matches a real route rendering NIDProvider's tree."],
          ["redirect_uri_mismatch from NID", "Registered URI doesn't exactly match what the SDK sends.", "Compare byte-for-byte, including trailing slashes and port, per environment."],
          ["Console issued a client secret", "App was registered as Confidential instead of Public/SPA.", "Re-register as Public — see Security → Never ship a client secret."],
          ["user is null right after login() resolves", "Reading user before isLoading has settled.", "Always branch on isLoading first, then isAuthenticated, before reading user."],
        ]}
      />
    </>
  );
}