import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

const codeLines = [
  'const developer = {',
  '  name: "Molvess",',
  '  alias: "Molvess",',
  '  stack: ["React", "TypeScript",',
  '         "Node.js", "Python"],',
  '  passion: "Building things",',
  '};',
];

const roles = ['Video Editor', 'Full Stack Developer', 'Content Creator', 'UI/UX Designer'];

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typedLines, setTypedLines] = useState(0);

  // Typewriter effect for roles
  useEffect(() => {
    const role = roles[currentRole];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayedText(role.substring(0, displayedText.length + 1));
          if (displayedText.length === role.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setDisplayedText(role.substring(0, displayedText.length - 1));
          if (displayedText.length === 0) {
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRole]);

  // Terminal typing effect
  useEffect(() => {
    if (typedLines < codeLines.length) {
      const timeout = setTimeout(() => setTypedLines((l) => l + 1), 400);
      return () => clearTimeout(timeout);
    }
  }, [typedLines]);

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-dark"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Gradient orbs */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-neon-purple/8 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-neon-blue/8 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/5 blur-[100px]" />

        {/* Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-neon-purple/30"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side — Creative / Video Editor */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-purple/20 bg-neon-purple/10 px-4 py-1.5"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-neon-purple" />
              <span className="text-xs font-medium tracking-wider text-neon-purple uppercase">
                Açık iş birliğine
              </span>
            </motion.div>

            <h1 className="font-heading text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="text-white">Ben </span>
              <span className="text-gradient-purple">Molvess</span>
              <br />
              <span className="text-text-secondary text-2xl font-light sm:text-3xl lg:text-4xl">
                aka{' '}
                <span className="text-gradient-mixed font-bold">Molvess</span>
              </span>
            </h1>

            <div className="mt-6 h-10">
              <span className="font-mono text-lg text-neon-blue sm:text-xl">
                {'> '}
                {displayedText}
                <span className="animate-terminal-blink text-neon-purple">|</span>
              </span>
            </div>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg lg:mx-0 mx-auto">
              Ritim, kurgu ve kod. Video düzenlemenin sanatını, yazılım
              geliştirmenin mühendisliğiyle birleştiriyorum.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <motion.a
                href="#showreel"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#showreel')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue px-8 py-3.5 font-semibold text-white shadow-lg shadow-neon-purple/25 transition-shadow hover:shadow-neon-purple/40"
              >
                Showreel'i İzle
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.a>
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
              >
                Projeleri Gör
              </motion.a>
            </div>
          </motion.div>

          {/* Right Side — Terminal / Developer */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg">
              {/* Terminal Window */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-dark-secondary shadow-2xl shadow-black/50">
                {/* Title bar */}
                <div className="flex items-center gap-2 border-b border-white/5 bg-dark-card px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 font-mono text-xs text-text-muted">
                    molvess@dev ~ /portfolio
                  </span>
                </div>

                {/* Terminal Content */}
                <div className="p-5 font-mono text-sm leading-relaxed">
                  <div className="mb-3 text-text-muted">
                    <span className="text-neon-blue">molvess</span>
                    <span className="text-text-muted">@</span>
                    <span className="text-neon-purple">dev</span>
                    <span className="text-text-muted"> ~ $ </span>
                    <span className="text-white">cat about.ts</span>
                  </div>

                  {codeLines.slice(0, typedLines).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="whitespace-pre"
                    >
                      {line.includes('const') && (
                        <>
                          <span className="text-neon-purple">const </span>
                          <span className="text-neon-blue">developer</span>
                          <span className="text-white"> = {'{'}</span>
                        </>
                      )}
                      {line.includes('name:') && (
                        <span>
                          <span className="text-text-muted">  </span>
                          <span className="text-neon-blue">name</span>
                          <span className="text-white">: </span>
                          <span className="text-green-400">"Molvess"</span>
                          <span className="text-white">,</span>
                        </span>
                      )}
                      {line.includes('alias:') && (
                        <span>
                          <span className="text-text-muted">  </span>
                          <span className="text-neon-blue">alias</span>
                          <span className="text-white">: </span>
                          <span className="text-green-400">"Molvess"</span>
                          <span className="text-white">,</span>
                        </span>
                      )}
                      {line.includes('stack:') && (
                        <span>
                          <span className="text-text-muted">  </span>
                          <span className="text-neon-blue">stack</span>
                          <span className="text-white">: [</span>
                          <span className="text-green-400">"React"</span>
                          <span className="text-white">, </span>
                          <span className="text-green-400">"TypeScript"</span>
                          <span className="text-white">,</span>
                        </span>
                      )}
                      {line.includes('Node') && (
                        <span>
                          <span className="text-text-muted">         </span>
                          <span className="text-green-400">"Node.js"</span>
                          <span className="text-white">, </span>
                          <span className="text-green-400">"Python"</span>
                          <span className="text-white">],</span>
                        </span>
                      )}
                      {line.includes('passion:') && (
                        <span>
                          <span className="text-text-muted">  </span>
                          <span className="text-neon-blue">passion</span>
                          <span className="text-white">: </span>
                          <span className="text-green-400">"Building things"</span>
                          <span className="text-white">,</span>
                        </span>
                      )}
                      {line === '};' && (
                        <span className="text-white">{'};'}</span>
                      )}
                    </motion.div>
                  ))}

                  {typedLines >= codeLines.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3"
                    >
                      <span className="text-neon-blue">molvess</span>
                      <span className="text-text-muted">@</span>
                      <span className="text-neon-purple">dev</span>
                      <span className="text-text-muted"> ~ $ </span>
                      <span className="animate-terminal-blink text-white">▋</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Stats below terminal */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Proje', value: '20+' },
                  { label: 'Video', value: '50+' },
                  { label: 'Deneyim', value: '3+ Yıl' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="rounded-xl border border-white/5 bg-dark-card/50 p-3 text-center"
                  >
                    <div className="font-heading text-xl font-bold text-gradient-purple">
                      {stat.value}
                    </div>
                    <div className="text-xs text-text-muted">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1"
        >
          <div className="h-2 w-1 rounded-full bg-neon-purple" />
        </motion.div>
      </motion.div>
    </section>
  );
}
