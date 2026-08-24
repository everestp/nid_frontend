import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { DEMO_CREDENTIALS } from '@/data/mockData';

export function Login() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use the demo credentials below.');
        setLoading(false);
      }
    }, 600);
  };

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => {
      demoLogin();
      navigate('/dashboard');
    }, 400);
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen bg-ink-950 grid-bg flex items-center justify-center p-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <button onClick={() => navigate('/')} className="inline-block">
            <Logo size={40} />
          </button>
        </div>

        <div className="card-surface p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-ink-50">Sign in to NID</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-warning-500/20 bg-warning-500/10 text-warning-400">
              <span className="w-1.5 h-1.5 rounded-full bg-warning-400 animate-pulse" />
              Demo Environment
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-ink-800/50 border border-ink-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-ink-800/50 border border-ink-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-sm text-danger-400 bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors border border-brand-500/50 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-ink-700" />
            <span className="text-xs text-ink-400">or</span>
            <div className="flex-1 h-px bg-ink-700" />
          </div>

          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 border border-ink-600 hover:border-ink-500 hover:bg-ink-800 text-ink-100 font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-warning-400" />
            Enter Demo
          </button>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 card-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-ink-300 uppercase tracking-wider">Demo Credentials</span>
            <button
              onClick={fillDemo}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Fill in
            </button>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center gap-2 text-ink-200">
              <Mail className="w-3.5 h-3.5 text-ink-400" />
              {DEMO_CREDENTIALS.email}
            </div>
            <div className="flex items-center gap-2 text-ink-200">
              <Lock className="w-3.5 h-3.5 text-ink-400" />
              {DEMO_CREDENTIALS.password}
            </div>
          </div>
        </div>

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
