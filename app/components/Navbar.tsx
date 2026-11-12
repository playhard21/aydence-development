'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { WHATSAPP_URL } from '../lib/links';

interface NavLink {
  label: string;
  href: string;
}

const homeLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Speaking Coaching (B1 Level)', href: '/advanced-german' },
  { label: 'WhatsApp', href: WHATSAPP_URL },
];

const advancedGermanLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'The Gap', href: '#problem' },
  { label: 'Training', href: '#training' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'WhatsApp', href: WHATSAPP_URL },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLinks = pathname === '/advanced-german' ? advancedGermanLinks : homeLinks;

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: 'left' }}
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-[var(--c-accent-primary)] to-[var(--c-accent-secondary)]"
      />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${menuOpen ? 'bg-white shadow-lg py-2' : scrolled ? 'glass-nav py-2' : 'bg-transparent py-4'}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-new.png"
                  alt="Aydence Logo"
                  width={320}
                  height={112}
                  priority
                  className="h-16 md:h-20 w-auto object-contain filter drop-shadow-sm"
                />
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-10">
              {currentLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className="relative text-sm uppercase tracking-widest font-semibold text-slate-600 group hover:text-[var(--c-accent-primary)] transition-colors duration-300"
                  >
                    {link.label}
                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[var(--c-accent-primary)] rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}

              {/* Desktop CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Link
                  id="nav-cta-desktop"
                  href="/booking"
                  className="cta-nav-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Book your free trial session
                </Link>
              </motion.div>
            </div>

            {/* Mobile CTA + Hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <Link
                id="nav-cta-mobile"
                href="/booking"
                className="cta-nav-btn !text-[0.7rem] !px-3 !py-[0.4rem]"
              >
                Book your free trial session
              </Link>
              <motion.button
                id="menu-toggle"
                className="flex flex-col gap-[6px] p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                {[0, 1, 2].map((bar) => (
                  <motion.span
                    key={bar}
                    animate={
                      bar === 0 ? (menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 })
                    : bar === 1 ? (menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 })
                    : (menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 })
                    }
                    className="block w-6 h-[2px] bg-slate-800 rounded-full origin-center"
                    transition={{ duration: 0.25 }}
                  />
                ))}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
          <motion.div
            initial={false}
            animate={menuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4 pb-8 border-t border-slate-200 mt-4">
              {currentLinks.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium py-2 px-4 text-slate-700 hover:text-[var(--c-accent-primary)] hover:bg-slate-100 rounded-xl transition-all"
                >
                  <motion.span
                    initial={{ x: -16, opacity: 0 }}
                    animate={menuOpen ? { x: 0, opacity: 1 } : { x: -16, opacity: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="block"
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}

              {/* Mobile menu CTA */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={menuOpen ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                transition={{ delay: currentLinks.length * 0.06, duration: 0.3 }}
                className="px-4 pt-2"
              >
                <Link
                  id="nav-cta-mobile-menu"
                  href="/booking"
                  onClick={() => setMenuOpen(false)}
                  className="cta-nav-btn w-full justify-center text-center !text-sm !py-3"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Book your free trial session
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
}
