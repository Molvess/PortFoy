import { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboardV2';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark">
        <div className="flex flex-col items-center gap-4">
          <svg className="h-10 w-10 animate-spin text-neon-purple" viewBox="0 0 24 24">
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
          <p className="text-sm text-text-muted">Oturum kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard />;
}
