import Navbar from './Navbar';
import Footer from './Footer';
import PageWrapper from './PageWrapper';
import type { ReactNode } from 'react';

export interface LegalSection {
  heading?: string;
  body: ReactNode;
}

export default function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <PageWrapper>
      <Navbar />
      <main className="pt-32 pb-24 min-h-screen bg-[var(--bg-primary)]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white p-10 md:p-16 rounded-[var(--radius-card)] border border-slate-100 shadow-sm">
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--c-text)] mb-10 pb-6 border-b border-slate-200">
              {title}
            </h1>
            <div className="space-y-8 text-[var(--c-muted)] text-lg leading-relaxed">
              {sections.map((s, i) => (
                <section key={i}>
                  {s.heading && <h2 className="text-xl font-bold text-[var(--c-text)] mb-3">{s.heading}</h2>}
                  <div className="space-y-3">{s.body}</div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
