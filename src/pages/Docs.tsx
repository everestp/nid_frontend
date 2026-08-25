import { useEffect, useMemo, useState, type ReactNode } from "react";

/* ============================================================
   NID Docs — OAuth 2.0 + OpenID Connect Identity Provider
   Single-file documentation surface. Built on the existing
   design tokens (glass, card-surface, gradient-text, grid-bg,
   ink-* / brand-* / success-warning-danger-* utility classes).
============================================================ */

/* ------------------------------------------------------------
   Small building blocks
------------------------------------------------------------ */

type Method = "GET" | "POST" | "DELETE";

function MethodBadge({ method }: { method: Method }) {
  const styles: Record<Method, string> = {
    GET: "bg-brand-600/15 text-brand-light border-brand-500/50",
    POST: "bg-success-400/10 text-success-400 border-success-400/30",
    DELETE: "bg-danger-400/10 text-danger-400 border-danger-400/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide ${styles[method]}`}
    >
      {method}
    </span>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink-700 bg-ink-800/50 px-2.5 py-0.5 text-xs text-ink-300">
      {children}
    </span>
  );
}

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
  | "Integration Guides"
  | "API Reference"
  | "Security"
  | "Deployment"
  | "Troubleshooting";

interface NavEntry {
  id: string;
  title: string;
  category: Category;
  keywords: string;
}

const NAV: NavEntry[] = [
  { id: "overview", title: "Overview", category: "Getting Started", keywords: "intro nid identity provider" },
  { id: "quickstart", title: "Quick start", category: "Getting Started", keywords: "5 minutes setup client" },
  { id: "register-app", title: "Register an application", category: "Getting Started", keywords: "client id secret redirect uri console" },
  { id: "env-vars", title: "Environment variables", category: "Getting Started", keywords: "env dotenv secret config" },

  { id: "oauth-vs-oidc", title: "OAuth 2.0 vs OIDC", category: "Core Concepts", keywords: "difference authentication authorization" },
  { id: "auth-code-pkce", title: "Authorization Code Flow + PKCE", category: "Core Concepts", keywords: "code verifier challenge state nonce" },
  { id: "tokens", title: "Tokens", category: "Core Concepts", keywords: "access token id token refresh jwt" },
  { id: "scopes", title: "Scopes & claims", category: "Core Concepts", keywords: "openid profile sub name preferred_username" },
  { id: "sessions", title: "Sessions & cookies", category: "Core Concepts", keywords: "app_session httponly samesite jwt cookie" },

  { id: "guide-react", title: "React", category: "Integration Guides", keywords: "spa frontend vite" },
  { id: "guide-nextjs", title: "Next.js", category: "Integration Guides", keywords: "app router route handler server" },
  { id: "guide-vue", title: "Vue", category: "Integration Guides", keywords: "vue 3 composition api" },
  { id: "guide-angular", title: "Angular", category: "Integration Guides", keywords: "angular service httpclient" },
  { id: "guide-vanilla", title: "Vanilla JavaScript", category: "Integration Guides", keywords: "no framework fetch" },
  { id: "guide-node", title: "Node.js (Express)", category: "Integration Guides", keywords: "express backend server" },
  { id: "guide-go", title: "Go", category: "Integration Guides", keywords: "golang net/http reference backend" },
  { id: "guide-python", title: "Python (FastAPI)", category: "Integration Guides", keywords: "fastapi flask python" },
  { id: "guide-java", title: "Java (Spring Boot)", category: "Integration Guides", keywords: "spring boot java" },
  { id: "guide-php", title: "PHP", category: "Integration Guides", keywords: "php curl session" },

  { id: "api-authorize", title: "GET /oauth/authorize", category: "API Reference", keywords: "authorize endpoint" },
  { id: "api-token", title: "POST /oauth/token", category: "API Reference", keywords: "token exchange endpoint" },
  { id: "api-userinfo", title: "GET /oauth/userinfo", category: "API Reference", keywords: "userinfo endpoint claims" },
  { id: "api-errors", title: "Errors", category: "API Reference", keywords: "error error_description invalid_grant" },

  { id: "security-best-practices", title: "Best practices", category: "Security", keywords: "csrf state pkce httponly secrets" },
  { id: "security-secrets", title: "Secret management", category: "Security", keywords: "client secret jwt secret rotation vault" },

  { id: "deploy-checklist", title: "Production checklist", category: "Deployment", keywords: "https secure cookies cors deploy" },

  { id: "troubleshooting", title: "Common issues", category: "Troubleshooting", keywords: "invalid state cors redirect_uri mismatch" },
];

const CATEGORY_ORDER: Category[] = [
  "Getting Started",
  "Core Concepts",
  "Integration Guides",
  "API Reference",
  "Security",
  "Deployment",
  "Troubleshooting",
];

/* ------------------------------------------------------------
   Reusable snippet fragments (kept accurate to the reference
   NID + Go client implementation)
------------------------------------------------------------ */

const ENV_EXAMPLE = `# .env  (server-side only — never shipped to the browser)
NID_CLIENT_ID=hZnNd0BdhkOkqgPGJRBoXdfaaaAkR2LS
NID_CLIENT_SECRET=change-me-in-nid-console
NID_AUTHORIZE_URL=https://auth.yourdomain.com/oauth/authorize
NID_TOKEN_URL=https://auth.yourdomain.com/oauth/token
NID_USERINFO_URL=https://auth.yourdomain.com/oauth/userinfo

APP_REDIRECT_URI=https://api.yourapp.com/oauth/callback
APP_FRONTEND_URL=https://app.yourapp.com

# 32+ random bytes, base64 — used only to sign your own session JWT
SESSION_JWT_SECRET=<openssl rand -base64 48>`;

const REACT_LOGIN_TSX = `// src/pages/Login.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE; // e.g. https://api.yourapp.com

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(\`\${API_BASE}/api/me\`, { credentials: "include" })
      .then((r) => r.ok && navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  const signIn = () => {
    window.location.href = \`\${API_BASE}/oauth/login\`;
  };

  return (
    <button onClick={signIn} className="glow-brand rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white">
      Sign in with NID
    </button>
  );
}`;

const REACT_USE_SESSION = `// src/hooks/useSession.ts
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`\${API_BASE}/api/me\`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch(\`\${API_BASE}/api/logout\`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return { user, loading, logout };
}`;

const NEXTJS_LOGIN_ROUTE = `// app/oauth/login/route.ts
import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

export async function GET() {
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  const params = new URLSearchParams({
    client_id: process.env.NID_CLIENT_ID!,
    redirect_uri: process.env.APP_REDIRECT_URI!,
    response_type: "code",
    scope: "openid",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  const res = NextResponse.redirect(\`\${process.env.NID_AUTHORIZE_URL}?\${params}\`);
  res.cookies.set("oauth_state", state, { httpOnly: true, maxAge: 600, sameSite: "lax" });
  res.cookies.set("pkce_verifier", verifier, { httpOnly: true, maxAge: 600, sameSite: "lax" });
  return res;
}`;

const NEXTJS_CALLBACK_ROUTE = `// app/oauth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const savedState = req.cookies.get("oauth_state")?.value;
  const verifier = req.cookies.get("pkce_verifier")?.value;

  if (!code || !state || state !== savedState || !verifier) {
    return NextResponse.json({ error: "invalid oauth state" }, { status: 400 });
  }

  const tokenRes = await fetch(process.env.NID_TOKEN_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.NID_CLIENT_ID!,
      client_secret: process.env.NID_CLIENT_SECRET!,
      redirect_uri: process.env.APP_REDIRECT_URI!,
      code_verifier: verifier,
    }),
  }).then((r) => r.json());

  const user = await fetch(process.env.NID_USERINFO_URL!, {
    headers: { Authorization: \`Bearer \${tokenRes.access_token}\` },
  }).then((r) => r.json());

  const secret = new TextEncoder().encode(process.env.SESSION_JWT_SECRET!);
  const jwt = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  const res = NextResponse.redirect(new URL("/dashboard", process.env.APP_FRONTEND_URL));
  res.cookies.set("app_session", jwt, { httpOnly: true, sameSite: "lax", maxAge: 86400 });
  res.cookies.delete("oauth_state");
  res.cookies.delete("pkce_verifier");
  return res;
}`;

const VUE_SNIPPET = `<!-- src/components/SignIn.vue -->
<script setup>
import { onMounted, ref } from "vue";

const API_BASE = import.meta.env.VITE_API_BASE;
const user = ref(null);

onMounted(async () => {
  const res = await fetch(\`\${API_BASE}/api/me\`, { credentials: "include" });
  if (res.ok) user.value = await res.json();
});

function signIn() {
  window.location.href = \`\${API_BASE}/oauth/login\`;
}
</script>

<template>
  <button v-if="!user" @click="signIn" class="glow-brand rounded-xl bg-brand-600 px-5 py-3 text-white">
    Sign in with NID
  </button>
  <p v-else>Welcome, {{ user.name }}</p>
</template>`;

const ANGULAR_SNIPPET = `// src/app/auth.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  me() {
    return this.http.get(\`\${environment.apiBase}/api/me\`, { withCredentials: true });
  }

  signIn() {
    window.location.href = \`\${environment.apiBase}/oauth/login\`;
  }

  logout() {
    return this.http.post(\`\${environment.apiBase}/api/logout\`, {}, { withCredentials: true });
  }
}`;

const VANILLA_SNIPPET = `<!-- index.html -->
<button id="signin">Sign in with NID</button>
<script>
  const API_BASE = "https://api.yourapp.com";

  document.getElementById("signin").addEventListener("click", () => {
    window.location.href = \`\${API_BASE}/oauth/login\`;
  });

  fetch(\`\${API_BASE}/api/me\`, { credentials: "include" })
    .then((r) => (r.ok ? r.json() : null))
    .then((user) => {
      if (user) console.log("Signed in as", user.preferred_username);
    });
</script>`;

const NODE_EXPRESS_SNIPPET = `// server.js
import express from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const app = express();
app.use(cookieParser());

app.get("/oauth/login", (req, res) => {
  const state = crypto.randomBytes(32).toString("base64url");
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");

  res.cookie("oauth_state", state, { httpOnly: true, maxAge: 600_000, sameSite: "lax" });
  res.cookie("pkce_verifier", verifier, { httpOnly: true, maxAge: 600_000, sameSite: "lax" });

  const params = new URLSearchParams({
    client_id: process.env.NID_CLIENT_ID,
    redirect_uri: process.env.APP_REDIRECT_URI,
    response_type: "code",
    scope: "openid",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  res.redirect(\`\${process.env.NID_AUTHORIZE_URL}?\${params}\`);
});

app.get("/oauth/callback", async (req, res) => {
  const { code, state } = req.query;
  if (!code || state !== req.cookies.oauth_state) {
    return res.status(400).send("invalid OAuth state");
  }

  const tokenRes = await fetch(process.env.NID_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.NID_CLIENT_ID,
      client_secret: process.env.NID_CLIENT_SECRET,
      redirect_uri: process.env.APP_REDIRECT_URI,
      code_verifier: req.cookies.pkce_verifier,
    }),
  }).then((r) => r.json());

  const user = await fetch(process.env.NID_USERINFO_URL, {
    headers: { Authorization: \`Bearer \${tokenRes.access_token}\` },
  }).then((r) => r.json());

  const session = jwt.sign(user, process.env.SESSION_JWT_SECRET, { expiresIn: "24h" });
  res.clearCookie("oauth_state").clearCookie("pkce_verifier");
  res.cookie("app_session", session, { httpOnly: true, sameSite: "lax", maxAge: 86_400_000 });
  res.redirect(\`\${process.env.APP_FRONTEND_URL}/dashboard\`);
});

app.get("/api/me", (req, res) => {
  try {
    const claims = jwt.verify(req.cookies.app_session, process.env.SESSION_JWT_SECRET);
    res.json(claims);
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("app_session").status(204).end();
});

app.listen(8082);`;

const GO_ANNOTATED = `// This mirrors your reference backend at cmd/server/main.go
//
// 1. GET /oauth/login
//    - generates \`state\` (CSRF) and a PKCE \`code_verifier\`
//    - stores both in short-lived HttpOnly cookies
//    - derives \`code_challenge = base64url(sha256(code_verifier))\`
//    - redirects the browser to NID's /oauth/authorize
//
// 2. GET /oauth/callback
//    - validates \`state\` against the cookie (rejects otherwise)
//    - exchanges \`code\` + \`code_verifier\` for tokens at /oauth/token
//    - calls /oauth/userinfo with the access token
//    - signs a first-party session JWT (HS256) with your own secret
//    - sets it as an HttpOnly \`app_session\` cookie
//    - redirects to the frontend dashboard
//
// 3. GET /api/me       — verifies app_session, returns the claims
// 4. POST /api/logout  — clears app_session

func loginHandler(w http.ResponseWriter, r *http.Request) {
    state, _ := randomString(32)
    verifier, _ := randomString(32)
    setTemporaryCookie(w, "oauth_state", state, 600)
    setTemporaryCookie(w, "pkce_verifier", verifier, 600)

    params := url.Values{
        "client_id":             {nidClientID},
        "redirect_uri":          {redirectURI},
        "response_type":         {"code"},
        "scope":                 {"openid"},
        "state":                 {state},
        "code_challenge":        {pkceChallenge(verifier)},
        "code_challenge_method": {"S256"},
    }
    http.Redirect(w, r, nidAuthorizeURL+"?"+params.Encode(), http.StatusFound)
}`;

const PYTHON_FASTAPI_SNIPPET = `# main.py
import base64, hashlib, os, secrets
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
import httpx, jwt

app = FastAPI()

NID_AUTHORIZE_URL = os.environ["NID_AUTHORIZE_URL"]
NID_TOKEN_URL = os.environ["NID_TOKEN_URL"]
NID_USERINFO_URL = os.environ["NID_USERINFO_URL"]
CLIENT_ID = os.environ["NID_CLIENT_ID"]
CLIENT_SECRET = os.environ["NID_CLIENT_SECRET"]
REDIRECT_URI = os.environ["APP_REDIRECT_URI"]
SESSION_SECRET = os.environ["SESSION_JWT_SECRET"]

def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

@app.get("/oauth/login")
def login():
    state = b64url(secrets.token_bytes(32))
    verifier = b64url(secrets.token_bytes(32))
    challenge = b64url(hashlib.sha256(verifier.encode()).digest())

    resp = RedirectResponse(
        f"{NID_AUTHORIZE_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
        f"&response_type=code&scope=openid&state={state}"
        f"&code_challenge={challenge}&code_challenge_method=S256"
    )
    resp.set_cookie("oauth_state", state, httponly=True, max_age=600, samesite="lax")
    resp.set_cookie("pkce_verifier", verifier, httponly=True, max_age=600, samesite="lax")
    return resp

@app.get("/oauth/callback")
async def callback(request: Request, code: str, state: str):
    if state != request.cookies.get("oauth_state"):
        return JSONResponse({"error": "invalid oauth state"}, status_code=400)

    async with httpx.AsyncClient() as client:
        token = (await client.post(NID_TOKEN_URL, data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "code_verifier": request.cookies.get("pkce_verifier"),
        })).json()

        user = (await client.get(NID_USERINFO_URL, headers={
            "Authorization": f"Bearer {token['access_token']}"
        })).json()

    session = jwt.encode(user, SESSION_SECRET, algorithm="HS256")
    resp = RedirectResponse(f"{os.environ['APP_FRONTEND_URL']}/dashboard")
    resp.set_cookie("app_session", session, httponly=True, samesite="lax", max_age=86400)
    resp.delete_cookie("oauth_state")
    resp.delete_cookie("pkce_verifier")
    return resp

@app.get("/api/me")
def me(request: Request):
    token = request.cookies.get("app_session")
    try:
        return jwt.decode(token, SESSION_SECRET, algorithms=["HS256"])
    except Exception:
        return JSONResponse({"error": "unauthorized"}, status_code=401)`;

const JAVA_SPRING_SNIPPET = `// OAuthController.java
@RestController
public class OAuthController {

    @Value("\${nid.client-id}") String clientId;
    @Value("\${nid.client-secret}") String clientSecret;
    @Value("\${nid.authorize-url}") String authorizeUrl;
    @Value("\${nid.token-url}") String tokenUrl;
    @Value("\${nid.userinfo-url}") String userinfoUrl;
    @Value("\${app.redirect-uri}") String redirectUri;

    @GetMapping("/oauth/login")
    public void login(HttpServletResponse res) throws IOException {
        String state = randomToken();
        String verifier = randomToken();
        String challenge = base64Url(sha256(verifier));

        addHttpOnlyCookie(res, "oauth_state", state, 600);
        addHttpOnlyCookie(res, "pkce_verifier", verifier, 600);

        String url = UriComponentsBuilder.fromHttpUrl(authorizeUrl)
            .queryParam("client_id", clientId)
            .queryParam("redirect_uri", redirectUri)
            .queryParam("response_type", "code")
            .queryParam("scope", "openid")
            .queryParam("state", state)
            .queryParam("code_challenge", challenge)
            .queryParam("code_challenge_method", "S256")
            .build().toUriString();

        res.sendRedirect(url);
    }

    @GetMapping("/oauth/callback")
    public void callback(@RequestParam String code, @RequestParam String state,
                          @CookieValue("oauth_state") String savedState,
                          @CookieValue("pkce_verifier") String verifier,
                          HttpServletResponse res) {
        if (!state.equals(savedState)) {
            res.setStatus(400);
            return;
        }
        // exchange code -> tokens, call /oauth/userinfo, sign app_session JWT,
        // set HttpOnly cookie, redirect to frontend — same shape as the Go reference.
    }
}`;

const PHP_SNIPPET = `<?php
// oauth-login.php
session_start();

$state = bin2hex(random_bytes(32));
$verifier = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
$challenge = rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '=');

setcookie('oauth_state', $state, ['httponly' => true, 'samesite' => 'Lax', 'expires' => time() + 600]);
setcookie('pkce_verifier', $verifier, ['httponly' => true, 'samesite' => 'Lax', 'expires' => time() + 600]);

$params = http_build_query([
    'client_id' => getenv('NID_CLIENT_ID'),
    'redirect_uri' => getenv('APP_REDIRECT_URI'),
    'response_type' => 'code',
    'scope' => 'openid',
    'state' => $state,
    'code_challenge' => $challenge,
    'code_challenge_method' => 'S256',
]);

header('Location: ' . getenv('NID_AUTHORIZE_URL') . '?' . $params);

// oauth-callback.php
$ch = curl_init(getenv('NID_TOKEN_URL'));
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'grant_type' => 'authorization_code',
        'code' => $_GET['code'],
        'client_id' => getenv('NID_CLIENT_ID'),
        'client_secret' => getenv('NID_CLIENT_SECRET'),
        'redirect_uri' => getenv('APP_REDIRECT_URI'),
        'code_verifier' => $_COOKIE['pkce_verifier'],
    ]),
]);
$token = json_decode(curl_exec($ch), true);`;

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
            <p className="text-xs text-ink-500">OAuth 2.0 · OpenID Connect</p>
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
          className={`${navOpen ? "block" : "hidden"
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
                        className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition ${active === entry.id
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
    case "quickstart":
      return <QuickStart />;
    case "register-app":
      return <RegisterApp />;
    case "env-vars":
      return <EnvVars />;
    case "oauth-vs-oidc":
      return <OAuthVsOIDC />;
    case "auth-code-pkce":
      return <AuthCodePKCE />;
    case "tokens":
      return <Tokens />;
    case "scopes":
      return <Scopes />;
    case "sessions":
      return <Sessions />;
    case "guide-react":
      return <GuideReact />;
    case "guide-nextjs":
      return <GuideNextjs />;
    case "guide-vue":
      return <GuideVue />;
    case "guide-angular":
      return <GuideAngular />;
    case "guide-vanilla":
      return <GuideVanilla />;
    case "guide-node":
      return <GuideNode />;
    case "guide-go":
      return <GuideGo />;
    case "guide-python":
      return <GuidePython />;
    case "guide-java":
      return <GuideJava />;
    case "guide-php":
      return <GuidePhp />;
    case "api-authorize":
      return <ApiAuthorize />;
    case "api-token":
      return <ApiToken />;
    case "api-userinfo":
      return <ApiUserinfo />;
    case "api-errors":
      return <ApiErrors />;
    case "security-best-practices":
      return <SecurityBestPractices />;
    case "security-secrets":
      return <SecuritySecrets />;
    case "deploy-checklist":
      return <DeployChecklist />;
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
        title="Identity for your apps, done the standard way"
        lead="NID is an OAuth 2.0 authorization server and OpenID Connect provider. Your app never sees a password — it redirects to NID, gets back a short-lived code, and exchanges it server-side for tokens and a verified identity."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "Authorization Code + PKCE", d: "The only flow this platform issues codes for. Safe for both server-rendered and single-page apps." },
          { t: "OpenID Connect", d: "openid scope returns a verifiable identity: sub, name, preferred_username." },
          { t: "Bring your own session", d: "Your backend exchanges the code, then mints its own short-lived session (JWT cookie, in the reference app)." },
        ].map((c) => (
          <div key={c.t} className="card-surface glass-hover p-5">
            <p className="mb-1 text-sm font-semibold text-ink-100">{c.t}</p>
            <p className="text-sm leading-6 text-ink-400">{c.d}</p>
          </div>
        ))}
      </div>

      <H2>How the pieces fit together</H2>
      <P>
        There are three parties in every sign-in: <strong className="text-ink-100">NID</strong> (the
        identity provider), <strong className="text-ink-100">your backend</strong> (the OAuth client,
        confidential — it holds the client secret), and{" "}
        <strong className="text-ink-100">your frontend</strong> (React, Vue, mobile, whatever renders the
        UI). The frontend never talks to NID directly — it only talks to your backend.
      </P>

      <CodeBlock
        lang="text"
        title="request flow"
        code={`Browser                Your Backend                  NID
   |  click "Sign in"        |                          |
   |------------------------>|                          |
   |   GET /oauth/login      | build state + PKCE pair  |
   |                         |------------------------->|
   |  <---- 302 redirect to NID /oauth/authorize ------- |
   |------------------------------------------------------>|
   |         user authenticates + approves on NID          |
   |  <---- 302 redirect to /oauth/callback?code=... ------|
   |------------------------>|                          |
   |  GET /oauth/callback    | POST /oauth/token ------>|
   |                         | <---- access_token -------|
   |                         | GET /oauth/userinfo ----->|
   |                         | <---- sub, name ...  ------|
   |                         | sign app_session JWT      |
   |  <--- Set-Cookie: app_session; 302 to /dashboard ---|`}
      />

      <Callout tone="info" title="This documentation mirrors a real reference implementation">
        Every code sample on this site is grounded in a working Go backend and React
        frontend pair (see <button className="underline decoration-dotted underline-offset-2" onClick={() => onNavigate("guide-go")}>Go</button> and{" "}
        <button className="underline decoration-dotted underline-offset-2" onClick={() => onNavigate("guide-react")}>React</button>{" "}
        guides). Framework guides for other stacks reproduce the same four endpoints
        (<code className="font-mono text-xs">/oauth/login</code>,{" "}
        <code className="font-mono text-xs">/oauth/callback</code>,{" "}
        <code className="font-mono text-xs">/api/me</code>,{" "}
        <code className="font-mono text-xs">/api/logout</code>) so you can swap languages without
        changing the protocol.
      </Callout>

      <H2>Where to start</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { id: "quickstart", t: "Quick start", d: "Get a working sign-in in under 10 minutes." },
          { id: "register-app", t: "Register an application", d: "Create a client, set redirect URIs." },
          { id: "auth-code-pkce", t: "Authorization Code + PKCE", d: "Understand the flow before you wire it up." },
          { id: "security-best-practices", t: "Security best practices", d: "The non-negotiables before you ship." },
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

function QuickStart() {
  return (
    <>
      <SectionHeading eyebrow="Getting Started" title="Quick start" lead="Wire up sign-in end to end using the reference backend + frontend shape." />

      <H2>1. Register your app</H2>
      <P>Create a client in the NID console and note the <code className="font-mono text-xs">client_id</code> and <code className="font-mono text-xs">client_secret</code>. Add your callback URL as an allowed redirect URI — exact match, including path and port.</P>

      <H2>2. Set environment variables</H2>
      <CodeBlock lang="bash" title=".env" code={ENV_EXAMPLE} />

      <H2>3. Implement the four endpoints on your backend</H2>
      <Table
        head={["Endpoint", "Purpose"]}
        rows={[
          [<><MethodBadge method="GET" /> <code className="font-mono text-xs">/oauth/login</code></>, "Builds state + PKCE pair, redirects to NID"],
          [<><MethodBadge method="GET" /> <code className="font-mono text-xs">/oauth/callback</code></>, "Exchanges the code, fetches userinfo, sets your session cookie"],
          [<><MethodBadge method="GET" /> <code className="font-mono text-xs">/api/me</code></>, "Returns the current user from your session"],
          [<><MethodBadge method="POST" /> <code className="font-mono text-xs">/api/logout</code></>, "Clears the session cookie"],
        ]}
      />
      <P>Full implementations: <code className="font-mono text-xs">Go</code>, <code className="font-mono text-xs">Node</code>, <code className="font-mono text-xs">Next.js</code>, <code className="font-mono text-xs">Python</code>, <code className="font-mono text-xs">Java</code>, and <code className="font-mono text-xs">PHP</code> are under Integration Guides in the sidebar.</P>

      <H2>4. Point your frontend at it</H2>
      <CodeBlock lang="tsx" title="src/pages/Login.tsx" code={REACT_LOGIN_TSX} />

      <Callout tone="success" title="That's it">
        Clicking the button redirects to NID, the user approves, and lands back on your
        dashboard with a session cookie already set.
      </Callout>
    </>
  );
}

function RegisterApp() {
  return (
    <>
      <SectionHeading eyebrow="Getting Started" title="Register an application" lead="Every OAuth client needs a client_id, a client_secret, and at least one exact redirect URI." />

      <H2>Application settings</H2>
      <Table
        head={["Field", "Notes"]}
        rows={[
          ["Application name", "Shown on the NID consent screen."],
          ["Redirect URIs", "Exact match required — scheme, host, port and path. Add one per environment (local, staging, prod)."],
          ["Grant types", "authorization_code only. Implicit and password grants are not issued."],
          ["Scopes", "openid is required for OIDC identity claims. Add custom scopes if your platform exposes them."],
          ["Client type", "Confidential — the client secret must stay on your backend, never in the browser or a mobile bundle."],
        ]}
      />

      <Callout tone="warn" title="Redirect URI mismatch is the #1 setup error">
        <code className="font-mono text-xs">http://localhost:8082/oauth/callback</code> and{" "}
        <code className="font-mono text-xs">http://localhost:8082/oauth/callback/</code> (trailing
        slash) are different URIs. Register exactly what your server sends.
      </Callout>

      <H2>What you get back</H2>
      <CodeBlock
        lang="text"
        code={`client_id      hZnNd0BdhkOkqgPGJRBoXdfaaaAkR2LS
client_secret  ******************************** (shown once — store it now)`}
      />
      <P>Treat the secret like a database password: put it in your secret manager or <code className="font-mono text-xs">.env</code> (git-ignored), rotate it if it ever leaks, and never send it to a browser.</P>
    </>
  );
}

function EnvVars() {
  return (
    <>
      <SectionHeading eyebrow="Getting Started" title="Environment variables" lead="Keep every OAuth secret server-side. The pattern below matches the reference Go server's constants, moved into config." />

      <CodeBlock lang="bash" title=".env" code={ENV_EXAMPLE} />

      <H2>Loading rules</H2>
      <Table
        head={["Variable", "Where it may live"]}
        rows={[
          ["NID_CLIENT_ID", "Backend only. Not secret by itself, but keep it out of frontend bundles anyway."],
          ["NID_CLIENT_SECRET", "Backend only. Never in a frontend build, mobile app, or public repo."],
          ["SESSION_JWT_SECRET", "Backend only. Used solely to sign your own session cookie — unrelated to NID's keys."],
          ["VITE_API_BASE / NEXT_PUBLIC_*", "Frontend-safe: just the URL of your own backend, not NID directly."],
        ]}
      />

      <Callout tone="danger" title="Never commit .env">
        Add <code className="font-mono text-xs">.env</code> to <code className="font-mono text-xs">.gitignore</code> and ship a{" "}
        <code className="font-mono text-xs">.env.example</code> with placeholder values instead. If a secret
        ever lands in git history, rotate it — removing the commit is not enough.
      </Callout>

      <H2>Loading in code</H2>
      <CodeBlock
        lang="go"
        title="Go"
        code={`clientID := os.Getenv("NID_CLIENT_ID")
clientSecret := os.Getenv("NID_CLIENT_SECRET")
if clientID == "" || clientSecret == "" {
    log.Fatal("missing NID_CLIENT_ID / NID_CLIENT_SECRET")
}`}
      />
      <CodeBlock
        lang="javascript"
        title="Node.js (dotenv)"
        code={`import "dotenv/config";
const { NID_CLIENT_ID, NID_CLIENT_SECRET } = process.env;
if (!NID_CLIENT_ID || !NID_CLIENT_SECRET) {
  throw new Error("missing NID_CLIENT_ID / NID_CLIENT_SECRET");
}`}
      />
    </>
  );
}

/* ---------- Core Concepts ---------- */

function OAuthVsOIDC() {
  return (
    <>
      <SectionHeading eyebrow="Core Concepts" title="OAuth 2.0 vs OpenID Connect" lead="OAuth 2.0 is an authorization framework. OIDC is a thin identity layer on top of it." />

      <Table
        head={["", "OAuth 2.0", "OpenID Connect"]}
        rows={[
          ["Answers", "\u201cCan this app act on the user's behalf?\u201d", "\u201cWho is this user?\u201d"],
          ["Core artifact", "Access token (opaque to the client)", "ID token + userinfo claims"],
          ["On NID", "Always issued alongside OIDC", "Requested via the openid scope"],
        ]}
      />
      <P>
        In practice: request the <code className="font-mono text-xs">openid</code> scope, and NID's
        token response and <code className="font-mono text-xs">/oauth/userinfo</code> endpoint give you a
        verified <code className="font-mono text-xs">sub</code> (stable user ID), display{" "}
        <code className="font-mono text-xs">name</code>, and{" "}
        <code className="font-mono text-xs">preferred_username</code>.
      </P>
    </>
  );
}

function AuthCodePKCE() {
  return (
    <>
      <SectionHeading eyebrow="Core Concepts" title="Authorization Code Flow with PKCE" lead="The only flow NID issues codes for. PKCE protects the code exchange even for confidential clients." />

      <H2>Step by step</H2>
      <ol className="mb-6 space-y-4">
        {[
          ["Generate state + PKCE pair", "Your backend creates a random state (CSRF protection) and a code_verifier, then derives code_challenge = base64url(sha256(code_verifier))."],
          ["Redirect to /oauth/authorize", "Send client_id, redirect_uri, response_type=code, scope=openid, state, code_challenge, code_challenge_method=S256."],
          ["User authenticates on NID", "NID handles login and consent — your app never sees credentials."],
          ["NID redirects back with a code", "GET /oauth/callback?code=...&state=... — verify state matches what you stored before doing anything else."],
          ["Exchange the code", "POST /oauth/token with grant_type=authorization_code, code, client_id, client_secret, redirect_uri, and code_verifier."],
          ["Fetch identity", "GET /oauth/userinfo with the access token to get sub, name, preferred_username."],
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

      <H2>Deriving the code_challenge</H2>
      <CodeBlock
        lang="go"
        title="reference implementation"
        code={`func pkceChallenge(verifier string) string {
    hash := sha256.Sum256([]byte(verifier))
    return base64.RawURLEncoding.EncodeToString(hash[:])
}`}
      />

      <Callout tone="info" title="Why PKCE even for a confidential backend client">
        The reference server generates the verifier itself, so an attacker who
        intercepts the authorization code still can't complete the exchange without
        it. It's cheap insurance and NID requires it on every client.
      </Callout>
    </>
  );
}

function Tokens() {
  return (
    <>
      <SectionHeading eyebrow="Core Concepts" title="Tokens" lead="The token endpoint returns everything your backend needs — nothing the browser should ever hold directly." />

      <Table
        head={["Token", "Format", "Used for"]}
        rows={[
          ["access_token", "Opaque / bearer", "Authenticating calls to /oauth/userinfo (and any NID-protected API)."],
          ["id_token", "JWT", "OIDC identity assertion — verify signature + expiry if you consume it directly."],
          ["refresh_token", "Opaque", "Only if offline_access-style long-lived sessions were negotiated for your client."],
          ["expires_in", "Seconds", "Access token lifetime — treat as short-lived, don't cache past this."],
        ]}
      />

      <H2>Token response shape</H2>
      <CodeBlock
        lang="json"
        code={`{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "eyJhbGciOi...",
  "scope": "openid"
}`}
      />

      <Callout tone="warn" title="Tokens never touch the browser">
        In the reference architecture, the frontend never sees NID's access token or
        id token. Your backend consumes them once, then issues its own short-lived
        session cookie. This keeps the client_secret and NID's tokens off the
        client entirely.
      </Callout>
    </>
  );
}

function Scopes() {
  return (
    <>
      <SectionHeading eyebrow="Core Concepts" title="Scopes & claims" lead="Scopes are what you ask for; claims are what comes back." />
      <Table
        head={["Scope", "Claims returned"]}
        rows={[
          ["openid", "sub — required for any OIDC request"],
          ["profile (if enabled on your client)", "name, preferred_username"],
        ]}
      />
      <H2>/oauth/userinfo response</H2>
      <CodeBlock
        lang="json"
        code={`{
  "sub": "usr_9f21ac",
  "name": "Ada Lovelace",
  "preferred_username": "ada"
}`}
      />
      <P>Treat <code className="font-mono text-xs">sub</code> as the durable identifier for the user in your own database — <code className="font-mono text-xs">name</code> and <code className="font-mono text-xs">preferred_username</code> can change.</P>
    </>
  );
}

function Sessions() {
  return (
    <>
      <SectionHeading eyebrow="Core Concepts" title="Sessions & cookies" lead="NID hands you an identity once. What you do with it afterward is your app's own session." />

      <H2>The reference pattern: a first-party JWT cookie</H2>
      <CodeBlock
        lang="go"
        code={`token := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
    Sub: user.Sub, Name: user.Name, PreferredUsername: user.PreferredUsername,
    RegisteredClaims: jwt.RegisteredClaims{
        ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
        IssuedAt:  jwt.NewNumericDate(time.Now()),
        Issuer:    "your-app",
    },
})
signed, _ := token.SignedString(jwtSecret)

http.SetCookie(w, &http.Cookie{
    Name:     "app_session",
    Value:    signed,
    Path:     "/",
    HttpOnly: true,
    Secure:   true, // true in production (HTTPS)
    SameSite: http.SameSiteLaxMode,
    MaxAge:   86400,
})`}
      />

      <Table
        head={["Cookie flag", "Why"]}
        rows={[
          ["HttpOnly", "Blocks JavaScript access — mitigates token theft via XSS."],
          ["Secure", "Cookie is only sent over HTTPS. Set true in every deployed environment."],
          ["SameSite=Lax", "Blocks the cookie on cross-site POSTs while still allowing the OAuth redirect back from NID."],
          ["Short-lived temp cookies", "oauth_state and pkce_verifier expire in 600s — just long enough for the redirect round trip."],
        ]}
      />
    </>
  );
}

/* ---------- Integration Guides ---------- */

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
      <SectionHeading eyebrow="Integration Guide" title={title} lead={lead} />
      {children}
    </>
  );
}

function GuideReact() {
  return (
    <GuideShell
      title="React"
      lead="A single-page app talks only to your own backend — never directly to NID."
    >
      <H2>1. Redirect to sign-in</H2>
      <CodeBlock lang="tsx" title="src/pages/Login.tsx" code={REACT_LOGIN_TSX} />
      <H2>2. Read the session anywhere</H2>
      <CodeBlock lang="tsx" title="src/hooks/useSession.ts" code={REACT_USE_SESSION} />
      <Callout tone="info" title="credentials: 'include' is required">
        Every fetch to your backend needs <code className="font-mono text-xs">credentials: "include"</code> so
        the browser sends the <code className="font-mono text-xs">app_session</code> cookie. Also allow-list
        your frontend origin with <code className="font-mono text-xs">Access-Control-Allow-Credentials: true</code> on
        the backend.
      </Callout>
    </GuideShell>
  );
}

function GuideNextjs() {
  return (
    <GuideShell
      title="Next.js"
      lead="Next.js can be the OAuth client itself using Route Handlers — no separate backend needed."
    >
      <H2>Route handlers</H2>
      <CodeBlock lang="typescript" title="app/oauth/login/route.ts" code={NEXTJS_LOGIN_ROUTE} />
      <CodeBlock lang="typescript" title="app/oauth/callback/route.ts" code={NEXTJS_CALLBACK_ROUTE} />
      <H2>Reading the session in a Server Component</H2>
      <CodeBlock
        lang="typescript"
        title="app/dashboard/page.tsx"
        code={`import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function Dashboard() {
  const token = cookies().get("app_session")?.value;
  if (!token) redirect("/login");

  const secret = new TextEncoder().encode(process.env.SESSION_JWT_SECRET!);
  const { payload: user } = await jwtVerify(token, secret);

  return <p>Welcome, {user.name as string}</p>;
}`}
      />
    </GuideShell>
  );
}

function GuideVue() {
  return (
    <GuideShell title="Vue" lead="Same pattern as React — redirect for login, credentialed fetch for session.">
      <CodeBlock lang="vue" title="src/components/SignIn.vue" code={VUE_SNIPPET} />
    </GuideShell>
  );
}

function GuideAngular() {
  return (
    <GuideShell title="Angular" lead="Wrap the two calls in an injectable AuthService and consume it via DI.">
      <CodeBlock lang="typescript" title="src/app/auth.service.ts" code={ANGULAR_SNIPPET} />
      <Callout tone="info" title="withCredentials: true">
        Angular's HttpClient needs <code className="font-mono text-xs">withCredentials: true</code> on every
        call for the session cookie to be sent and accepted.
      </Callout>
    </GuideShell>
  );
}

function GuideVanilla() {
  return (
    <GuideShell title="Vanilla JavaScript" lead="No framework required — two fetch calls and a redirect.">
      <CodeBlock lang="html" code={VANILLA_SNIPPET} />
    </GuideShell>
  );
}

function GuideNode() {
  return (
    <GuideShell title="Node.js (Express)" lead="A direct port of the reference Go server's four endpoints.">
      <CodeBlock lang="javascript" title="server.js" code={NODE_EXPRESS_SNIPPET} />
    </GuideShell>
  );
}

function GuideGo() {
  return (
    <GuideShell title="Go" lead="The reference implementation this whole platform's docs are grounded in.">
      <CodeBlock lang="go" title="cmd/server/main.go (excerpt)" code={GO_ANNOTATED} />
      <Callout tone="success" title="Already production-shaped">
        The reference server already separates temporary OAuth cookies from the
        long-lived session cookie, validates state before touching the code, and
        signs its own JWT rather than forwarding NID's tokens to the browser. Keep
        that shape when you port it.
      </Callout>
    </GuideShell>
  );
}

function GuidePython() {
  return (
    <GuideShell title="Python (FastAPI)" lead="Async endpoints mirroring the same four routes; Flask works the same with requests instead of httpx.">
      <CodeBlock lang="python" title="main.py" code={PYTHON_FASTAPI_SNIPPET} />
    </GuideShell>
  );
}

function GuideJava() {
  return (
    <GuideShell title="Java (Spring Boot)" lead="A REST controller implementing login and callback; wire the exchange with RestTemplate or WebClient.">
      <CodeBlock lang="java" title="OAuthController.java" code={JAVA_SPRING_SNIPPET} />
    </GuideShell>
  );
}

function GuidePhp() {
  return (
    <GuideShell title="PHP" lead="Session-based state storage instead of cookies, cURL for the token exchange.">
      <CodeBlock lang="php" code={PHP_SNIPPET} />
    </GuideShell>
  );
}

/* ---------- API Reference ---------- */

function ApiAuthorize() {
  return (
    <>
      <SectionHeading eyebrow="API Reference" title={<><MethodBadge method="GET" /> <span className="ml-2 align-middle">/oauth/authorize</span></>} />
      <P>Browser-facing endpoint. Your backend redirects here; it is never called with fetch/XHR.</P>
      <Table
        head={["Parameter", "Required", "Description"]}
        rows={[
          ["client_id", "yes", "Issued when you registered your application."],
          ["redirect_uri", "yes", "Must exactly match a registered URI."],
          ["response_type", "yes", "Always code."],
          ["scope", "yes", "Space-delimited; include openid for identity claims."],
          ["state", "yes", "Opaque CSRF token you generate and verify on return."],
          ["code_challenge", "yes", "base64url(sha256(code_verifier))."],
          ["code_challenge_method", "yes", "Always S256."],
          ["nonce", "recommended", "Bound into the ID token to prevent replay."],
        ]}
      />
      <H2>Redirect on success</H2>
      <CodeBlock lang="text" code={`302 Found
Location: https://api.yourapp.com/oauth/callback?code=abc123&state=xyz789`} />
      <H2>Redirect on denial / error</H2>
      <CodeBlock lang="text" code={`302 Found
Location: https://api.yourapp.com/oauth/callback?error=access_denied&error_description=...`} />
    </>
  );
}

function ApiToken() {
  return (
    <>
      <SectionHeading eyebrow="API Reference" title={<><MethodBadge method="POST" /> <span className="ml-2 align-middle">/oauth/token</span></>} />
      <P>Server-to-server only. Requires the client secret — never call this from a browser.</P>
      <CodeBlock
        lang="http"
        code={`POST /oauth/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=abc123
&client_id=hZnNd0BdhkOkqgPGJRBoXdfaaaAkR2LS
&client_secret=********
&redirect_uri=https://api.yourapp.com/oauth/callback
&code_verifier=<the original PKCE verifier>`}
      />
      <CodeBlock
        lang="json"
        title="200 OK"
        code={`{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "eyJhbGciOi...",
  "scope": "openid"
}`}
      />
    </>
  );
}

function ApiUserinfo() {
  return (
    <>
      <SectionHeading eyebrow="API Reference" title={<><MethodBadge method="GET" /> <span className="ml-2 align-middle">/oauth/userinfo</span></>} />
      <CodeBlock lang="http" code={`GET /oauth/userinfo HTTP/1.1
Authorization: Bearer <access_token>`} />
      <CodeBlock lang="json" title="200 OK" code={`{
  "sub": "usr_9f21ac",
  "name": "Ada Lovelace",
  "preferred_username": "ada"
}`} />
      <P>A 401 here means the access token is expired or invalid — restart the flow from <code className="font-mono text-xs">/oauth/login</code> rather than retrying.</P>
    </>
  );
}

function ApiErrors() {
  return (
    <>
      <SectionHeading eyebrow="API Reference" title="Errors" lead="Errors surface either as a redirect back to your callback (authorize step) or a JSON body (token step)." />
      <Table
        head={["Error", "Where", "Typical cause"]}
        rows={[
          ["access_denied", "callback redirect", "User declined consent."],
          ["invalid_request", "callback redirect / token", "Missing or malformed required parameter."],
          ["invalid_client", "token", "Wrong client_id/client_secret pair."],
          ["invalid_grant", "token", "Code already used, expired, or code_verifier doesn't match the original challenge."],
          ["redirect_uri_mismatch", "authorize", "redirect_uri doesn't exactly match a registered URI."],
        ]}
      />
      <Callout tone="warn" title="Codes are single-use">
        An authorization code is consumed on first exchange. A second attempt (e.g. a
        double page load on the callback route) returns invalid_grant — guard the
        callback handler against double-submission if your framework can trigger it.
      </Callout>
    </>
  );
}

/* ---------- Security ---------- */

function SecurityBestPractices() {
  return (
    <>
      <SectionHeading eyebrow="Security" title="Best practices" lead="What the reference implementation already does, and why." />
      <ul className="mb-4 space-y-3">
        {[
          ["Always use PKCE", "Generate a fresh code_verifier per login attempt; never reuse one."],
          ["Validate state before anything else", "Compare the callback's state to the cookie you set — reject on mismatch before touching the code."],
          ["Short-lived temp cookies", "oauth_state and pkce_verifier should expire in minutes (600s in the reference), not hours."],
          ["HttpOnly + Secure + SameSite=Lax on every auth cookie", "Blocks script access, forces HTTPS, and limits cross-site submission while still allowing the OAuth redirect."],
          ["Never forward NID's tokens to the browser", "Consume access_token/id_token server-side; issue your own scoped session token."],
          ["Verify the JWT signing method", "Explicitly check the alg on your session JWT (reject anything but HS256/your chosen algorithm) to avoid algorithm-confusion attacks."],
          ["Lock CORS to known origins", "Allow-list exact frontend origins with credentials — never a wildcard alongside Allow-Credentials: true."],
        ].map(([t, d]) => (
          <li key={t} className="card-surface flex gap-3 p-4">
            <span className="mt-0.5 text-success-400">✓</span>
            <div>
              <p className="text-sm font-semibold text-ink-100">{t}</p>
              <p className="mt-0.5 text-sm text-ink-400">{d}</p>
            </div>
          </li>
        ))}
      </ul>

      <H2>What the reference CORS middleware does</H2>
      <CodeBlock
        lang="go"
        code={`var allowedOrigins = map[string]bool{
    "https://app.yourapp.com": true,
}

func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        origin := r.Header.Get("Origin")
        if allowedOrigins[origin] {
            w.Header().Set("Access-Control-Allow-Origin", origin)
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Vary", "Origin")
        }
        next.ServeHTTP(w, r)
    })
}`}
      />
    </>
  );
}

function SecuritySecrets() {
  return (
    <>
      <SectionHeading eyebrow="Security" title="Secret management" lead="Two different secrets, two different blast radii if leaked." />
      <Table
        head={["Secret", "Compromise impact", "Rotation"]}
        rows={[
          ["NID_CLIENT_SECRET", "Attacker can exchange codes as your app — revoke and re-issue from the NID console immediately.", "Rotate on any suspected leak; otherwise on a routine schedule (e.g. every 90 days)."],
          ["SESSION_JWT_SECRET", "Attacker can forge session cookies for any user — treat as a full account-takeover risk.", "Rotate immediately on leak. Rotating invalidates all active sessions — plan for a forced re-login."],
        ]}
      />
      <Callout tone="danger" title="Placeholder secrets are not safe defaults">
        A hardcoded fallback like <code className="font-mono text-xs">"change-this-to-a-very-long-random-secret-key-in-production"</code> should
        fail startup if still present in a production environment, not silently run with it.
      </Callout>
      <CodeBlock
        lang="go"
        code={`jwtSecret := []byte(os.Getenv("SESSION_JWT_SECRET"))
if len(jwtSecret) < 32 {
    log.Fatal("SESSION_JWT_SECRET must be set and at least 32 bytes")
}`}
      />
    </>
  );
}

/* ---------- Deployment ---------- */

function DeployChecklist() {
  return (
    <>
      <SectionHeading eyebrow="Deployment" title="Production checklist" lead="Everything that's safe to leave loose in local dev but must be tightened before launch." />
      <Table
        head={["Local dev", "Production"]}
        rows={[
          ["http://localhost URLs", "HTTPS everywhere — NID, your backend, your frontend."],
          ["Cookie Secure: false", "Cookie Secure: true on every auth cookie."],
          ["Hardcoded client ID/secret in source", "Loaded from env vars or a secret manager, never committed."],
          ["Permissive CORS for quick testing", "Exact-origin allow-list, credentials enabled only for that list."],
          ["Long-lived debug logging of tokens", "Never log access_token, id_token, or the session JWT — log the sub instead."],
          ["Single instance, in-memory state cookies", "Stateless temp cookies (as in the reference) work fine across multiple instances — no shared session store needed for the OAuth handshake itself."],
        ]}
      />
      <H2>Cookie flags in production</H2>
      <CodeBlock lang="go" code={`http.SetCookie(w, &http.Cookie{
    Name:     "app_session",
    Value:    signed,
    Path:     "/",
    HttpOnly: true,
    Secure:   true,
    SameSite: http.SameSiteLaxMode,
    MaxAge:   86400,
})`} />
      <Callout tone="info" title="Health check">
        Keep a plain <code className="font-mono text-xs">GET /health</code> route outside auth and CORS
        restrictions for load balancer probes — the reference server already exposes one.
      </Callout>
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
          ["invalid OAuth state on callback", "Cookies blocked or SameSite too strict, or the request hit a different backend instance without the cookie.", "Confirm SameSite=Lax (not Strict), HTTPS in prod, and that /oauth/login and /oauth/callback share a cookie domain."],
          ["redirect_uri_mismatch from NID", "Registered URI doesn't exactly match what your server sends.", "Compare byte-for-byte, including trailing slashes and port."],
          ["/api/me always returns 401", "app_session cookie not sent — usually a CORS/credentials issue.", "Ensure fetch uses credentials: 'include' and the backend sets Access-Control-Allow-Credentials: true for that exact origin."],
          ["invalid_grant on token exchange", "Code reused, expired, or code_verifier doesn't match the original code_challenge.", "Regenerate the flow from /oauth/login; don't retry a stale code."],
          ["Works locally, fails in production", "Usually Secure: true cookies over plain HTTP, or an origin not in the CORS allow-list.", "Serve everything over HTTPS and add the production origin explicitly."],
        ]}
      />
    </>
  );
}
