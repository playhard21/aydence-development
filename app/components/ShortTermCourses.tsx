/* NOTE: links to /payment are on hold; Razorpay payments are disabled for now. See app/payment/page.tsx. */
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrollReveal } from './AnimationHelpers';

export default function ShortTermCourses() {
  return (
    <section className="section-pad bg-[--bg-primary]" id="short-term-courses">
      <div className="centered-content">
        
        <ScrollReveal>
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Short-Term Courses</h2>
            <span className="text-xs uppercase tracking-[0.3em] font-black bg-cyan-50 px-4 py-2 rounded-lg text-cyan-600 border border-cyan-100 shadow-sm">Intense</span>
          </div>
        </ScrollReveal>
        
        <div className="space-y-24">

          {/* Intro Course */}
          <ScrollReveal>
            <div className="glass hover:-translate-y-1 transition-transform duration-500 bg-white/70 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row group border border-slate-200 shadow-xl hover:shadow-2xl">
              <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
                 <h3 className="text-[32px] font-bold text-slate-900 mb-6">Introduction to German</h3>
                 <p className="text-slate-600 text-[18px] mb-8 leading-[1.8] max-w-md">
                   A comprehensive entry point for absolute beginners focused on foundational grammar and immediate conversational utility.
                 </p>
                 <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                       <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 shadow-sm">⏱</span>
                       60 mins/session | Monday &amp; Wednesday
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                       <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 shadow-sm">📚</span>
                       A1-B2 Full Course
                    </div>
                 </div>
                 <div className="flex flex-wrap items-center gap-8">
                    <Link href="/payment?course=intro-german-course" className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-slate-800 shadow-lg hover:shadow-xl inline-block">
                       Book Now
                    </Link>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Only 4 slots left</span>
                 </div>
              </div>
              <div className="md:w-5/12 h-[350px] md:h-auto relative bg-slate-50 overflow-hidden">
                <Image 
                  src="/course-german-intro.png" 
                  alt="German Intro" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
              </div>
            </div>
          </ScrollReveal>

          {/* B2 Speaking */}
          <ScrollReveal custom={1}>
            <div className="glass hover:-translate-y-1 transition-transform duration-500 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row-reverse group text-white shadow-xl hover:shadow-2xl hover:shadow-purple-900/20">
              <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
                 <div className="flex flex-wrap items-center gap-3 mb-4">
                   <h3 className="text-[32px] font-bold text-white">B2/C1 Intense Speaking</h3>
                   <span className="text-[10px] bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-purple-300">Advanced</span>
                 </div>
                 <p className="text-slate-300 text-[18px] mb-8 leading-[1.8] max-w-md">
                   Native speakers&apos; designed sessions to bridge the gap between academic knowledge and professional fluency.
                 </p>
                 <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-300">
                       <span className="text-xl">🎓</span>
                       Led by Native German Coaches
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-300">
                       <span className="text-xl">💬</span>
                       Live Interactive Group Sessions
                    </div>
                 </div>
                 <Link href="/payment?course=b2-intense-speaking" className="w-fit bg-emerald-500 text-slate-950 px-10 py-4 rounded-xl font-bold transition-all hover:bg-emerald-400 shadow-lg hover:shadow-emerald-500/20 inline-block">
                    Enroll Now
                 </Link>
              </div>
              <div className="md:w-5/12 h-[350px] md:h-auto relative overflow-hidden bg-slate-950">
                <Image 
                  src="/course-b2-speaking.png" 
                  alt="B2 Speaking" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
