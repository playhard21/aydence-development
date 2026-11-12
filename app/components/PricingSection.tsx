"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { WHATSAPP_URL } from '../lib/links';

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const pulseTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (priceRef.current && sectionRef.current && btnRef.current && pulseTextRef.current) {
      const priceElement = priceRef.current;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      tl.fromTo(
        priceElement,
        { innerText: 0 },
        {
          innerText: 220,
          duration: 2,
          ease: "power3.out",
          snap: { innerText: 1 },
          onUpdate: function() {
            priceElement.innerHTML = Math.ceil(this.targets()[0].innerText).toString();
          }
        }
      ).fromTo(
        btnRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
        "-=0.5"
      );

      gsap.to(pulseTextRef.current, {
        opacity: 0.5,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="py-24 bg-[var(--bg-secondary)]">
      <div className="centered-content">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--c-text)] mb-6">Speaking Coaching (B1 Level) – 9 Weeks</h2>
            <div className="w-24 h-1 bg-[var(--c-accent-primary)] mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-[var(--c-muted)]">Join a fixed group of dedicated learners for intensive training.</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[var(--c-accent-primary)] to-[var(--c-accent-secondary)]"></div>
            <div className="p-10 md:p-12">
              <div className="flex flex-col items-center text-center mb-10">
                <span className="px-4 py-1.5 bg-[var(--c-accent-secondary)]/10 text-[var(--c-accent-secondary)] text-sm font-bold uppercase tracking-widest rounded-full mb-6">
                  Next Cohort Start: February 2027
                </span>
                <div className="flex items-baseline gap-1 mt-4 text-[var(--c-accent-primary)]">
                  <span className="text-5xl font-black">€</span>
                  <span ref={priceRef} className="text-7xl font-black">0</span>
                </div>
                <p className="mt-4 text-[var(--c-text)] font-semibold text-lg">total for 9 weeks · or 2 × €110</p>
                <p ref={pulseTextRef} className="mt-2 text-[var(--c-accent-primary)] font-medium text-sm">Small online groups</p>
              </div>

              <div className="space-y-5 mb-10">
                {[
                  "Full coaching plan and times on request",
                  "27 coaching sessions",
                  "All materials included"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-4 text-[var(--c-text)]">
                    <div className="flex-shrink-0 w-6 h-6 bg-[var(--c-accent-secondary)]/10 text-[var(--c-accent-secondary)] rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/booking"
                ref={btnRef as any}
                className="block w-full py-5 bg-[var(--c-accent-primary)] text-white text-center font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-orange-700 transition-all duration-300"
              >
                Book your free trial session →
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-center text-sm text-[var(--c-muted)] hover:text-[var(--c-text)] underline"
              >
                Questions? WhatsApp me →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
