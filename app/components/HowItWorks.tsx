"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const programStructure = [
  {
    title: "Format",
    value: "Small online groups",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )
  },
  {
    title: "Duration",
    value: "3 sessions per week, each 2 × 25 minutes with a short break, 9 weeks",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    )
  },
  {
    title: "Materials",
    value: "You receive a speaking script every week. Plan 1–2 hours of self-study per week.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    )
  },
  {
    title: "Speaking",
    value: "Every session is speaking only: understand the script, practise pronunciation, then speak freely in role plays",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )
  },
  {
    title: "Feedback",
    value: "Direct feedback from me during the session",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    )
  }
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemsRef.current && sectionRef.current) {
      const items = Array.from(itemsRef.current.children);
      
      items.forEach((item, index) => {
        const icon = item.querySelector('.icon-container');
        const text = item.querySelector('.text-container');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          }
        });

        if (icon && text) {
          tl.fromTo(
            icon,
            { scale: 0, rotate: -90, opacity: 0 },
            { scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }
          ).fromTo(
            text,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            "-=0.3"
          );
        }
      });
    }
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 bg-[var(--bg-secondary)] overflow-hidden">
      <div className="centered-content">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--c-text)]">Program Structure</h2>
            <div className="w-24 h-1 bg-[var(--c-accent-primary)] mx-auto rounded-full"></div>
          </div>

          <div ref={itemsRef} className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Desktop dividers */}
            <div className="hidden md:block absolute top-1/2 left-[33%] w-[1px] h-3/4 bg-slate-200 -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 left-[66%] w-[1px] h-3/4 bg-slate-200 -translate-y-1/2"></div>

            {programStructure.map((item, index) => (
              <div key={item.title} className="flex flex-col items-center text-center px-4 relative z-10">
                <div className="icon-container w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-[var(--c-accent-primary)] mb-6">
                  {item.icon}
                </div>
                <div className="text-container">
                  <h3 className="text-xl font-bold text-[var(--c-text)] mb-3">{item.title}</h3>
                  <p className="text-[var(--c-muted)] leading-relaxed">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="inline-block bg-white px-6 py-3 rounded-full text-sm font-medium text-[var(--c-muted)] shadow-sm border border-slate-100">
              If you live in Göttingen: optional weekend meet-ups, for example a BBQ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
