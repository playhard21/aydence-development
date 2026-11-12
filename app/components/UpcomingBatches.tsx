'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from './AnimationHelpers';
import Link from 'next/link';
import { BOOKING_URL, WHATSAPP_URL } from '../lib/links';

const batches = [
  {
    key: 'coaching',
    title: "Speaking Coaching (B1 Level)",
    subtitle: "9 weeks · Online · Small group",
    date: "February 2027",
    status: "Enrolling",
    color: "bg-emerald-500",
    description: "Three coaching sessions a week for 9 weeks. We practise small talk, phone calls and appointments, WG-Castings and job interviews – with role plays and improvisation. €220, or two payments of €110.",
    scheduleLabel: "Schedule",
    scheduleValue: "Full coaching plan and times on request",
    button: { label: "Book your free trial session →", href: BOOKING_URL },
    whatsappLink: true,
  },
  {
    key: 'translation',
    title: "Personal Translation Assistance",
    subtitle: "At official appointments",
    date: "On request",
    status: "Available",
    color: "bg-blue-500",
    description: "I come with you to official appointments, for example at the Ausländerbehörde, and translate for you so that nothing gets lost.",
    scheduleLabel: "Price",
    scheduleValue: "€65 per appointment",
    button: { label: "Ask on WhatsApp →", href: WHATSAPP_URL },
    whatsappLink: false,
  },
];

export default function UpcomingBatches() {
  return (
    <section className="section-pad bg-slate-50/50" id="batches">
      <div className="centered-content">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Speaking Coaching (B1 Level)</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6">
          {batches.map((batch, i) => (
            <ScrollReveal key={batch.key} custom={i}>
              <div className="glass h-full p-8 rounded-3xl border border-slate-200 bg-white/70 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex justify-between items-start mb-6">
                  <span className={`${batch.color} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm`}>
                    {batch.status}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">{batch.date}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{batch.title}</h3>
                <p className="text-sm font-semibold text-orange-600 mb-4 uppercase tracking-wider">{batch.subtitle}</p>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 min-h-[60px]">
                  {batch.description}
                </p>
                
                <div className="pt-6 border-t border-slate-100 mt-auto">
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2">{batch.scheduleLabel}</p>
                  <p className="text-slate-900 font-medium text-sm">{batch.scheduleValue}</p>
                </div>

                <Link
                  href={batch.button.href}
                  {...(batch.button.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="mt-6 block w-full text-center px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  {batch.button.label}
                </Link>
                {batch.whatsappLink && (
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-center text-sm text-slate-500 hover:text-slate-900 underline"
                  >
                    Questions? WhatsApp me →
                  </a>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
