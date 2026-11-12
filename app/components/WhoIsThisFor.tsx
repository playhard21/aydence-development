"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const criteria = [
  "You have reached B1.",
  "You understand a lot, but speaking is still hard for you.",
  "You live in Germany or will move here soon.",
  "You have appointments or interviews coming up and want to feel prepared."
];

export default function WhoIsThisFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current && sectionRef.current) {
      const items = Array.from(listRef.current.children);
      
      items.forEach((item, index) => {
        const checkmark = item.querySelector('.checkmark-icon');
        const text = item.querySelector('.criteria-text');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 80%",
          }
        });

        if (checkmark && text) {
          tl.fromTo(
            checkmark,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", delay: index * 0.15 }
          ).fromTo(
            text,
            { x: -10, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
            "-=0.2"
          );
        }
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="centered-content">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--c-text)]">Is This Program Right for You?</h2>
            <div className="w-24 h-1 bg-[var(--c-accent-secondary)] mx-auto rounded-full"></div>
          </div>

          <div className="bg-[var(--bg-primary)] p-10 md:p-14 rounded-[var(--radius-card)] shadow-lg shadow-black/5 border border-slate-100">
            <ul ref={listRef} className="space-y-6">
              {criteria.map((text, i) => (
                <li key={i} className="flex items-center gap-4 text-xl md:text-2xl font-light text-[var(--c-text)]">
                  <div className="checkmark-icon flex-shrink-0 w-8 h-8 rounded-full bg-[var(--c-accent-primary)]/10 text-[var(--c-accent-primary)] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="criteria-text">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
