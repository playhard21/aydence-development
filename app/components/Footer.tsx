'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrollReveal, fadeLeft } from './AnimationHelpers';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { WHATSAPP_URL, BOOKING_URL, COACHING_URL, INSTAGRAM_URL, LINKEDIN_URL } from '../lib/links';

interface QuickLink {
  label: string;
  href: string;
}

interface LegalLink {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

const quickLinks: QuickLink[] = [
  { label: 'Speaking Coaching (B1 Level)', href: COACHING_URL },
  { label: 'WhatsApp', href: WHATSAPP_URL },
  { label: 'About', href: '/#about' },
];

const legal: LegalLink[] = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
];

const socials: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: LINKEDIN_URL,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Footer() {
  const pathname = usePathname();
  const showBigCTA = pathname !== '/advanced-german';

  return (
    <footer className="bg-[--bg-primary] text-slate-900 relative overflow-hidden border-t border-slate-200">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
      
      {/* ── Big Footer CTA ────────────────────────────────────── */}
      {showBigCTA && (
        <div className="section-pad relative z-10 border-b border-slate-200 bg-slate-50">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
          <div className="centered-content text-center relative z-10">

            <ScrollReveal>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500" />
                <span className="text-xs tracking-[0.2em] font-semibold text-cyan-600 uppercase">Your Next Step</span>
                <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500" />
              </div>
            </ScrollReveal>
            
            <ScrollReveal custom={1}>
              <h2 className="font-bold text-slate-900 mb-6 mx-auto text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-3xl">
                Ready to Speak German with Confidence?
              </h2>
            </ScrollReveal>

            <ScrollReveal custom={2} className="mb-12">
              <p className="text-slate-600 text-lg md:text-xl font-light max-w-2xl mx-auto">
                Book a free trial session with me. I will check your level and tell you honestly whether the coaching is right for you. Coming in 2027: my books “German for Indians” A1 and A2, and monthly workshops on pronunciation, grammar and interviews.
              </p>
            </ScrollReveal>

            <ScrollReveal custom={3}>
              <div className="flex flex-wrap gap-6 justify-center">
                <Link
                  href={BOOKING_URL}
                  className="bg-slate-900 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                >
                  Book your free trial session →
                </Link>
                <Link
                  href={COACHING_URL}
                  className="glass border border-slate-200 text-slate-900 font-bold px-8 py-4 rounded-full hover:bg-slate-100 hover:border-slate-300 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                >
                  Speaking Coaching (B1 Level) →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      )}

      {/* ── Footer Link Grid ───────────────────────────────────── */}
      <div className="centered-content pt-20 pb-0 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Col 1: Brand */}
          <ScrollReveal variants={fadeLeft} className="md:col-span-5 lg:col-span-4">
            <div className="flex flex-col gap-8">
              <Link href="/">
                <Image
                  src="/logo-new.png"
                  alt="Aydence Logo"
                  width={320}
                  height={112}
                  className="h-16 md:h-20 w-auto object-contain filter drop-shadow-sm"
                  priority
                />
              </Link>
              <p className="text-slate-600 text-base leading-relaxed font-light max-w-sm">
                I help people from abroad speak German with confidence, for life and work in Germany. Online, from Göttingen.
              </p>

              {/* Socials */}
              <div className="flex gap-4 mt-2">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target={s.label === 'Instagram' ? "_blank" : undefined}
                    rel={s.label === 'Instagram' ? "noopener noreferrer" : undefined}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-cyan-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Col 2: Quick Links */}
          <ScrollReveal custom={1} className="md:col-span-3 md:col-start-7 lg:col-start-7">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-8">Navigation</h4>
            <div className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <motion.div key={link.label} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                  <Link href={link.href} className="text-slate-500 hover:text-cyan-600 text-base transition-colors font-light relative group">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Col 3: Legal */}
          <ScrollReveal custom={3} className="md:col-span-3">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-8">Legal</h4>
            <div className="flex flex-col gap-4">
              {legal.map((link) => (
                <motion.div key={link.label} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                  <Link href={link.href} className="text-slate-500 hover:text-cyan-600 text-base transition-colors font-light">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-20 pt-8 pb-0 mb-0 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-slate-500 text-sm font-light m-0 p-0">
            © {new Date().getFullYear()} Aydence. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm font-light m-0 p-0">
            Made with <span className="text-cyan-500">♥</span> in Germany
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
