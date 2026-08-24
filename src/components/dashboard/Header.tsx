import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NOTIFICATIONS } from '@/data/mockData';
import type { Notification } from '@/types';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const notifIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    security: Shield,
  };

  const notifColors = {
    info: 'text-brand-400 bg-brand-500/10',
    success: 'text-success-400 bg-success-500/10',
    warning: 'text-warning-400 bg-warning-500/10',
    security: 'text-accent-400 bg-accent-500/10',
  };

  return (
    <header className="h-16 border-b border-ink-800 bg-ink-900/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-ink-800 text-ink-300"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search handles, apps, wallets..."
            className="w-full bg-ink-800/50 border border-ink-700 rounded-lg pl-10 pr-4 py-2 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right: network + notifications + profile */}
      <div className="flex items-center gap-3">
        {/* Network indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ink-700 bg-ink-800/50">
          <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
          <span className="text-xs font-medium text-ink-200">SOLANA</span>
          <span className="text-xs text-ink-500">·</span>
          <span className="text-xs font-medium text-ink-200">ETHEREUM</span>
          <span className="text-xs text-ink-500 ml-1 px-1.5 py-0.5 rounded border border-warning-500/20 text-warning-400 text-[10px]">
            TESTNET
          </span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-ink-800 text-ink-300 hover:text-ink-50 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 card-surface shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700">
                  <span className="text-sm font-semibold text-ink-50">Notifications</span>
                  <button onClick={markAllRead} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = notifIcons[n.type];
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-ink-800 hover:bg-ink-800/50 transition-colors ${
                          !n.read ? 'bg-brand-500/5' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notifColors[n.type]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-ink-50">{n.title}</div>
                          <div className="text-xs text-ink-300 mt-0.5 leading-relaxed">{n.message}</div>
                          <div className="text-xs text-ink-500 mt-1">{n.time}</div>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-brand-400 shrink-0 mt-1.5" />}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-ink-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-semibold text-white">
              {user?.avatar || 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-ink-400" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 card-surface shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-ink-700">
                  <div className="text-sm font-medium text-ink-50">{user?.name}</div>
                  <div className="text-xs text-ink-400">{user?.email}</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-ink-200 hover:bg-ink-800 hover:text-ink-50 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-ink-200 hover:bg-ink-800 hover:text-ink-50 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </button>
                </div>
                <div className="border-t border-ink-700 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger-400 hover:bg-danger-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
