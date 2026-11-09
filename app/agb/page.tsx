import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';

export const metadata = {
  title: 'Terms of Use (AGB) | Aydence',
  description: 'Allgemeine Geschäftsbedingungen for Aydence programs.',
};

export default function AGBPage() {
  return (
    <PageWrapper>
      <Navbar />
      
      <main className="pt-32 pb-24 min-h-screen bg-[var(--bg-primary)]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white p-10 md:p-16 rounded-[var(--radius-card)] border border-slate-100 shadow-sm">
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--c-text)] mb-10 pb-6 border-b border-slate-200">
              Aydence – Allgemeine Geschäftsbedingungen (AGB)
            </h1>

            <div className="space-y-10 text-[var(--c-muted)] text-lg leading-relaxed">
              
              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">1</span>
                  Gegenstand des Programms
                </h2>
                <p>
                  Aydence bietet ein strukturiertes Integrationsprogramm für eine Karriere in Deutschland. Dieses umfasst Sprachtraining, strategische Karriereplanung sowie Profil- und Bewerbungsentwicklung. Sprachunterricht ist dabei integraler Bestandteil eines Gesamtprozesses und kein isoliertes Produkt.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">2</span>
                  Programmstruktur und Teilnahmeverpflichtung
                </h2>
                <p>
                  Teilnehmer verpflichten sich zur aktiven Mitwirkung. Dazu gehören die Definition eines Karriereziels, Teilnahme an strategischen Einheiten sowie die Bearbeitung von Aufgaben (z. B. Lebenslauf, Bewerbungen). Bei mangelnder Mitwirkung kann der Zugang eingeschränkt oder beendet werden.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">3</span>
                  Leistungen und Preise
                </h2>
                <ul className="list-disc pl-14 space-y-2 mt-2">
                  <li><strong className="text-[var(--c-text)]">Webinare:</strong> 199–599 INR</li>
                  <li><strong className="text-[var(--c-text)]">4-Wochen-Programme:</strong> 4.800 INR (vollständig im Voraus)</li>
                  <li><strong className="text-[var(--c-text)]">Semesterprogramm:</strong> 24.999 INR (10.000 upfront nicht erstattbar, 10.000 nach 2 Monaten, 4.999 nach 4 Monaten)</li>
                  <li><strong className="text-[var(--c-text)]">Karriere-Strategieprogramm:</strong> 9.999 INR (3 intensive Sitzungen)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">4</span>
                  Zahlungsabwicklung
                </h2>
                <p>
                  {/* NOTE: Razorpay payments are on hold for now; review this clause before they go live. */}
                  Zahlungen erfolgen über Razorpay (UPI). Zugang wird erst nach vollständigem Zahlungseingang gewährt.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">5</span>
                  Zahlungsverzug
                </h2>
                <p>
                  Bei ausbleibenden Zahlungen wird der Zugang sofort gesperrt. Erfolgt keine Zahlung innerhalb von 7 Tagen, wird der Vertrag beendet. Bereits geleistete Zahlungen werden nicht erstattet.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">6</span>
                  Kein passiver Konsum
                </h2>
                <p>
                  Aydence ist ein aktives Programm. Teilnehmer müssen sich beteiligen. Bei fehlender Aktivität kann der Zugang entzogen werden.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">7</span>
                  Keine Erfolgsgarantie
                </h2>
                <p>
                  Aydence garantiert keine Jobvermittlung, kein Visum und keine Zulassung. Der Erfolg hängt von individuellen Leistungen und externen Faktoren ab.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">8</span>
                  Kündigung
                </h2>
                <p>
                  Webinare und 4-Wochen-Kurse sind nicht erstattbar. Die erste Rate des Semesterprogramms ist nicht erstattbar.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">9</span>
                  Urheberrecht
                </h2>
                <p>
                  Alle Inhalte sind Eigentum von Aydence. Weitergabe oder Verkauf ist untersagt.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">10</span>
                  Technische Voraussetzungen
                </h2>
                <p>
                  Teilnehmer sind selbst für Internet und Geräte verantwortlich.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--c-accent-primary)] flex items-center justify-center text-sm font-black flex-shrink-0">11</span>
                  Gerichtsstand
                </h2>
                <p>
                  Es gilt deutsches Recht. Gerichtsstand ist Deutschland.
                </p>
              </section>

              <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
                <h2 className="text-xl font-bold text-[var(--c-text)] mb-4">
                  12. Beispielhafter Kundenablauf (Customer Journey)
                </h2>
                <ol className="list-decimal pl-6 space-y-3 font-medium text-slate-700">
                  <li>Teilnahme an einem Webinar</li>
                  <li>Buchung eines 4-Wochen-Programms</li>
                  <li>Einstieg ins Semesterprogramm</li>
                  <li>Definition eines Karrierepfads</li>
                  <li>Erstellung von Lebenslauf und Bewerbungen</li>
                  <li>Durchführung von Bewerbungen und Vorbereitung auf Deutschland</li>
                </ol>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageWrapper>
  );
}
