"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function HomeHero() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (textRef.current) {
      const elements = textRef.current.children;
      gsap.fromTo(
        elements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-[var(--bg-primary)] text-[var(--c-text)]">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 bg-[var(--bg-hero)] opacity-80 pointer-events-none"></div>
      
      <div className="centered-content relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Text */}
        <div ref={textRef} className="w-full lg:w-1/2 max-w-2xl">
          <p className="text-sm md:text-base uppercase tracking-widest font-semibold text-[var(--c-accent-primary)] mb-4">
            Dr. Shoba Kapoor · Communication Coach
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-[var(--c-navy)]">
            Build a Thriving Career in Germany
          </h1>
          <p className="text-xl md:text-2xl text-[var(--c-muted)] mb-10 font-medium max-w-xl">
            Your career in Germany depends on how you speak. In my 9-week Speaking Coaching (B1 Level), we train the conversations that matter: small talk, phone calls and appointments, WG-Castings and job interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking" className="px-8 py-4 bg-[var(--c-accent-primary)] hover:bg-orange-700 text-white font-bold rounded-[var(--radius-pill)] transition-all flex items-center justify-center shadow-xl hover:-translate-y-1">
              Book your free trial session →
            </Link>
            <Link href="/advanced-german" className="px-8 py-4 bg-transparent border-2 border-[var(--c-navy-light)] hover:bg-[var(--c-navy)] hover:text-white text-[var(--c-navy)] font-bold rounded-[var(--radius-pill)] transition-all flex items-center justify-center shadow-lg hover:-translate-y-1">
              Speaking Coaching (B1 Level)
            </Link>
          </div>
        </div>

        {/* Right Column: Video Box */}
        <div className="w-full lg:w-1/3 relative group mt-10 lg:mt-0 lg:ml-auto">
          {/* Decorative glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[var(--c-accent-primary)] to-[var(--c-accent-secondary)] rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
          
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 aspect-[9/16] bg-black/5 backdrop-blur-sm max-w-sm mx-auto lg:mx-0">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            >
              <source src="/main_Video.mp4" type="video/mp4" />
            </video>
            
            {/* Audio Toggle Button */}
            <button 
              onClick={toggleMute}
              className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center transition-all text-gray-800 shadow-lg hover:scale-110 active:scale-95"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
