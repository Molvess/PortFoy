import { motion } from 'framer-motion';
import { FaGithub, FaYoutube, FaDiscord, FaInstagram } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import SectionWrapper from './SectionWrapper';

const socials = [
  { icon: FaGithub, label: 'GitHub', href: 'https://github.com/molvess', color: 'hover:text-white' },
  { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com/@Molvess', color: 'hover:text-red-500' },
  { icon: FaDiscord, label: 'Discord', href: 'https://discord.gg/TftzkvvCx2', color: 'hover:text-indigo-400' },
  { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com/molvess0x', color: 'hover:text-pink-400' },
  { icon: HiMail, label: 'E-posta', href: 'mailto:contact@molves09@gmail.com', color: 'hover:text-neon-purple' },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <div className="text-center">
            <span className="mb-4 inline-block font-mono text-sm text-neon-purple">
              {'<Contact />'}
            </span>
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Bir Projen mi var?{' '}
              <span className="text-gradient-mixed">Konuşalım.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              Video düzenleme, yazılım geliştirme ya da iş birliği için benimle
              iletişime geçebilirsin.
            </p>

            {/* CTA Button */}
            <motion.a
              href="mailto:contact@molves09@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue px-8 py-4 font-semibold text-white shadow-lg shadow-neon-purple/25 transition-shadow hover:shadow-neon-purple/40"
            >
              <HiMail className="h-5 w-5" />
              E-posta Gönder
            </motion.a>

            {/* Social Links */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-dark-card text-text-muted transition-all ${social.color} hover:border-white/20 hover:bg-white/5`}
                  title={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  );
}
