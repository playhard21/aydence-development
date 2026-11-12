"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function IntensiveSupport() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && sectionRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, []);

  return (
    <section id="intensive" ref={sectionRef} className="py-20 bg-[var(--bg-primary)]">
      <div className="centered-content">
        <div 
          ref={cardRef} 
          className="max-w-4xl mx-auto p-10 md:p-14 bg-white rounded-[var(--radius-card)] border border-[var(--c-accent-secondary)]/20 shadow-md flex flex-col md:flex-row items-center gap-10"
        >
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--c-text)] mb-4">Not sure if you are at B1?</h2>
            <p className="text-[var(--c-muted)] mb-6 leading-relaxed font-light text-lg">
              Book a free trial session with me and I will check your level. If you are not at B1 yet, my books “German for Indians” A1 and A2 will help you get there. They will be available in 2027.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-4xl font-black text-[var(--c-text)]">Free</span>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-auto">
            <Link
              href="/booking"
              className="block w-full md:w-auto px-8 py-4 bg-[var(--bg-dark)] text-white text-center font-bold rounded-xl hover:bg-black transition-all duration-300"
            >
              Book your free trial session →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
