"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const btnGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current && btnGroupRef.current) {
      const texts = textRef.current.children;
      const btns = btnGroupRef.current.children;

      // Staggered reveal for text
      gsap.fromTo(
        texts,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.2, ease: "power3.out" }
      );

      // Entrance for buttons
      gsap.fromTo(
        btns,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white text-[var(--c-text)]">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#FAFAFA] to-[#E5E7EB] opacity-60"></div>
      
      <div className="centered-content relative z-10 text-center">
        <div ref={textRef} className="max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--c-text)]">
            <span className="text-[var(--c-accent-primary)]">Speaking Coaching (B1 Level)</span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--c-muted)] max-w-3xl mx-auto font-light leading-relaxed">
            You know the grammar, but speaking still feels difficult? In this coaching we only speak. For 9 weeks we practise, in role plays and improvisation, the situations you will really face in Germany.
          </p>
        </div>
        
        <div ref={btnGroupRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <div className="flex flex-col items-center">
            <Link 
              href="/booking" 
              className="px-8 py-4 bg-[var(--c-accent-primary)] hover:bg-orange-700 text-white font-medium rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Book your free trial session →
            </Link>
            <span className="text-sm text-[var(--c-subtle)] mt-2 font-medium">9 weeks · 27 sessions · €220</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Link 
              href="#pricing" 
              className="px-8 py-4 bg-transparent border-2 border-[var(--c-accent-primary)] text-[var(--c-accent-primary)] hover:bg-[var(--c-accent-primary)] hover:text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              See price
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
