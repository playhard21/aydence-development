"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const trainingPoints = [
  {
    title: "Weeks 1–2 · Small talk",
    description: "How to start a conversation, ask follow-up questions and keep it going – with colleagues, neighbours and strangers.",
  },
  {
    title: "Weeks 3–4 · Phone calls & appointments",
    description: "Polite German (Sie), calling the doctor, writing to landlords on WG-Gesucht and arranging a flat viewing by phone.",
  },
  {
    title: "Week 5 · Informal interview – the WG-Casting",
    description: "Introducing yourself (du), answering questions and asking the right questions at a viewing.",
  },
  {
    title: "Weeks 6–8 · Formal interview – the job interview",
    description: "The same introduction, now per Sie – tell me about yourself, strengths and weaknesses, where you see yourself in 5 years, and a final mock interview.",
  },
  {
    title: "Week 9 · Grammar check-up",
    description: "Akkusativ & Dativ.",
  }
];

export default function WhatYouWillTrain() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardsRef.current && sectionRef.current) {
      const cards = cardsRef.current.children;
      
      gsap.fromTo(
        cards,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }
  }, []);

  return (
    <section id="training" ref={sectionRef} className="py-24 bg-white">
      <div className="centered-content">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--c-text)] mb-6">What You'll Master</h2>
            <div className="w-24 h-1 bg-[var(--c-accent-secondary)] mx-auto rounded-full"></div>
          </div>

          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingPoints.map((point, index) => (
              <div
                key={point.title}
                className="group p-8 bg-[var(--bg-primary)] rounded-[var(--radius-card)] border-t-4 border-[var(--c-accent-secondary)] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <h3 className="text-xl font-bold text-[var(--c-text)] mb-3">{point.title}</h3>
                <p className="text-[var(--c-muted)] leading-relaxed font-light">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
