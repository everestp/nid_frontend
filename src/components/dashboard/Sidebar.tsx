import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  AtSign,
  Link2,
  KeyRound,
  Code2,
  Fingerprint,
  ShieldCheck,
  BarChart3,
  Activity,
  Settings,
  LogOut,
  ChevronRight,
  ArrowRightLeft,
  Users,
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

const navSections = [
  { label: 'Overview', items: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/handles', label: 'Handles (.nid)', icon: AtSign },
    { to: '/dashboard/wallets', label: 'Linked Wallets', icon: Link2 },
    { to: '/dashboard/sessions', label: 'OAuth Sessions', icon: KeyRound },
  ]},
  { label: 'Identity', items: [
    { to: '/dashboard/sdk', label: 'SDK & Apps', icon: Code2 },
    { to: '/dashboard/passkeys', label: 'Passkeys & Credentials', icon: Fingerprint },
    { to: '/dashboard/privacy', label: 'Privacy Policies', icon: ShieldCheck },
    { to: '/dashboard/payment-routing', label: 'Payment Routing', icon: ArrowRightLeft },
    { to: '/dashboard/social-directory', label: 'Social Directory', icon: Users },
  ]},
  { label: 'Insights', items: [
    { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/security', label: 'Security Center', icon: ShieldCheck },
    { to: '/dashboard/activity', label: 'Activity Log', icon: Activity },
  ]},
  { label: 'Account', items: [
    { to: '/dashboard/developers', label: 'Developers', icon: Code2 },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]},
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 h-full flex flex-col bg-ink-900/80 border-r border-ink-800 backdrop-blur-xl">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-ink-800">
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <span className="text-lg font-semibold tracking-tight text-ink-50">
            NID<span className="text-ink-400">.xyz</span>
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-2 text-[10px] font-semibold text-ink-500 uppercase tracking-wider">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                        : 'text-ink-300 hover:text-ink-50 hover:bg-ink-800/50 border border-transparent'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: demo badge + user */}
      <div className="border-t border-ink-800 p-3 space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warning-500/20 bg-warning-500/5">
          <span className="w-1.5 h-1.5 rounded-full bg-warning-400 animate-pulse" />
          <span className="text-xs font-medium text-warning-400">Demo Environment</span>
        </div>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-ink-800/50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-ink-50 truncate">{user?.name}</div>
            <div className="text-xs text-ink-400 truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-ink-400 hover:text-danger-400 transition-colors p-1"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
