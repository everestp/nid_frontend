import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

import { Overview } from "@/pages/dashboard/Overview";
import { Handles } from "@/pages/dashboard/Handles";
import { Wallets } from "@/pages/dashboard/Wallets";
import { Sessions } from "@/pages/dashboard/Sessions";
import { SDKDemo } from "@/pages/dashboard/SDKDemo";
import { Passkeys } from "@/pages/dashboard/Passkeys";
import { Privacy } from "@/pages/dashboard/Privacy";
import { Analytics } from "@/pages/dashboard/Analytics";
import { Developers } from "@/pages/dashboard/Developers";
import { Security } from "@/pages/dashboard/Security";
import { Activity } from "@/pages/dashboard/Activity";
import { Settings } from "@/pages/dashboard/Settings";
import { PaymentRouting } from "@/pages/dashboard/PaymentRouting";
import { SocialDirectory } from "@/pages/dashboard/SocialDirectory";

import OAuthAuthorize from "@/pages/OAuthAuthorize";

import type { ReactNode } from "react";
import UserProfilePageWrapper from "./pages/UserProfilePageWrapper";

/*
 * ============================================================
 * Protected Dashboard Route
 * ============================================================
 */

function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/*
 * ============================================================
 * Application Routes
 * ============================================================
 */

function AppRoutes() {
  return (
    <Routes>

      {/* ======================================================
          Public Landing Page
          ====================================================== */}

      <Route
        path="/"
        element={<Landing />}
      />

      {/* ======================================================
          Public User Profile

          Example:
          /everest
          /john
          /alice
          ====================================================== */}

      <Route
        path="/:handle"
        element={<UserProfilePageWrapper />}
      />

      {/* ======================================================
          Internal NID Login
          ====================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ======================================================
          OAuth Authorization

          IMPORTANT:
          This route is NOT protected by ProtectedRoute.
          ====================================================== */}

      <Route
        path="/oauth/authorize"
        element={<OAuthAuthorize />}
      />

      {/* ======================================================
          Protected Dashboard
          ====================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Overview />}
        />

        <Route
          path="handles"
          element={<Handles />}
        />

        <Route
          path="wallets"
          element={<Wallets />}
        />

        <Route
          path="sessions"
          element={<Sessions />}
        />

        <Route
          path="sdk"
          element={<SDKDemo />}
        />

        <Route
          path="passkeys"
          element={<Passkeys />}
        />

        <Route
          path="privacy"
          element={<Privacy />}
        />

        <Route
          path="payment-routing"
          element={<PaymentRouting />}
        />

        <Route
          path="social-directory"
          element={<SocialDirectory />}
        />

        <Route
          path="analytics"
          element={<Analytics />}
        />

        <Route
          path="developers"
          element={<Developers />}
        />

        <Route
          path="security"
          element={<Security />}
        />

        <Route
          path="activity"
          element={<Activity />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>

      {/* ======================================================
          Unknown Route
          ====================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

/*
 * ============================================================
 * Root Application
 * ============================================================
 */

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
