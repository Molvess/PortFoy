import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-dark-secondary/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Left — Branding */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden">
              <img src="/MlogoSiyah.png" alt="Molvess" className="h-7 w-7 object-contain" />
            </div>
            <span className="font-heading text-sm font-semibold text-white">
              Molvess
            </span>
          </div>

          {/* Center */}
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            © {year} Molvess. Tüm hakları saklıdır. — Designed with
            <FaHeart className="h-3 w-3 text-neon-purple" />
            by <span className="font-semibold text-text-secondary">Molvess</span>
          </p>

          {/* Right */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/molvess"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://youtube.com/@Molvess"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted transition-colors hover:text-white"
            >
              YouTube
            </a>
            <a
              href="mailto:contact@molves09@gmail.com"
              className="text-xs text-text-muted transition-colors hover:text-white"
            >
              İletişim
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
