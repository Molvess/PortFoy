import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { account } from '../lib/appwrite';
import { HiLockClosed, HiMail } from 'react-icons/hi';

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await account.createEmailPasswordSession(email, password);
      onLogin();
    } catch (err: any) {
      setError(err?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue overflow-hidden">
            <img src="/MlogoSiyah.png" alt="Molvess" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-text-muted">Molvess Dashboard'a giriş yap</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-dark-card p-8"
        >
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                E-posta
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@molvess.me"
                  required
                  className="w-full rounded-xl border border-white/10 bg-dark-secondary py-3 pl-10 pr-4 text-sm text-white placeholder-text-muted outline-none transition-colors focus:border-neon-purple/50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Şifre
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-dark-secondary py-3 pl-10 pr-4 text-sm text-white placeholder-text-muted outline-none transition-colors focus:border-neon-purple/50"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue py-3 font-semibold text-white shadow-lg shadow-neon-purple/25 transition-all hover:shadow-neon-purple/40 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Giriş yapılıyor...
              </span>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          <a href="/" className="text-neon-purple transition-colors hover:text-neon-purple/80">
            ← Ana Sayfaya Dön
          </a>
        </p>
      </motion.div>
    </div>
  );
}
