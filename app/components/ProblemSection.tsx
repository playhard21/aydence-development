"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current && sectionRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );
    }
  }, []);

  return (
    <section id="problem" ref={sectionRef} className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="centered-content">
        <div ref={textRef} className="max-w-4xl bg-white p-12 md:p-16 rounded-[var(--radius-card)] shadow-xl shadow-black/5 relative">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--c-accent-primary)]/10 rounded-bl-[100px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[var(--c-text)]">
            The Gap That Most Learners Face
          </h2>
          
          <div className="space-y-6 text-xl text-[var(--c-muted)] leading-relaxed font-light">
            <p>
              Many people I meet have reached B1 and still freeze when they have to speak. They translate everything in their head and avoid phone calls, appointments and interviews. I developed this coaching to close exactly that gap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
