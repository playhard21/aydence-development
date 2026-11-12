import LegalPage from '../components/LegalPage';

export const metadata = {
  title: 'Datenschutz | Aydence',
  description: 'Datenschutzerklärung von Aydence.',
};

// DRAFT: covers the topics required in the brief. Replace with the text from a generator
// (e-recht24.de or datenschutz-generator.de) and have it checked before relying on it.
const sections = [
  {
    heading: '1. Verantwortliche',
    body: (
      <p>
        Aydence by Dr. Shoba Kapoor, Königsallee 10b, 37081 Göttingen, E-Mail: info@aydence.de.
      </p>
    ),
  },
  {
    heading: '2. Hosting (Vercel)',
    body: (
      <p>
        Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf werden technisch notwendige Daten (z. B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite) in Server-Logfiles verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (sicherer und effizienter Betrieb der Website).
      </p>
    ),
  },
  {
    heading: '3. Kontakt per E-Mail',
    body: (
      <p>
        Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b oder f DSGVO). Die Daten werden gelöscht, sobald sie nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.
      </p>
    ),
  },
  {
    heading: '4. Kontakt- und Buchungsformular, Kalender',
    body: (
      <p>
        Wenn Sie das Formular unter /booking nutzen, verarbeiten wir Name, E-Mail-Adresse, optional Telefon- bzw. WhatsApp-Nummer, Interesse, Sprachniveau, Wohnort, Nachricht und den gewählten Termin, um Ihre Probestunde zu vereinbaren und zu bestätigen (Art. 6 Abs. 1 lit. b DSGVO und Ihre Einwilligung, Art. 6 Abs. 1 lit. a DSGVO). Der Termin wird in unserem Kalender (Google Calendar) eingetragen, die Bestätigung versenden wir per E-Mail.
      </p>
    ),
  },
  {
    heading: '5. WhatsApp',
    body: (
      <p>
        Auf der Website befindet sich ein Link zu WhatsApp (wa.me). Erst wenn Sie darauf klicken, werden Sie zu WhatsApp weitergeleitet und es gelten die Datenschutzbestimmungen von WhatsApp. Beim bloßen Besuch der Website werden keine Daten an WhatsApp übermittelt.
      </p>
    ),
  },
  {
    heading: '6. Instagram und LinkedIn',
    body: (
      <p>
        Wir verlinken auf unsere Profile bei Instagram und LinkedIn. Es werden keine Plugins eingebunden; Daten werden erst übertragen, wenn Sie den jeweiligen Link anklicken. Es gelten dann die Datenschutzbestimmungen der Anbieter.
      </p>
    ),
  },
  {
    heading: '7. Schriftarten',
    body: (
      <p>
        Die Schriftarten werden lokal von unserem eigenen Server ausgeliefert. Es findet keine Verbindung zu Google-Servern statt.
      </p>
    ),
  },
  {
    heading: '8. Ihre Rechte',
    body: (
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht, erteilte Einwilligungen jederzeit zu widerrufen. Außerdem können Sie sich bei einer Datenschutzaufsichtsbehörde beschweren. Wenden Sie sich dazu an info@aydence.de.
      </p>
    ),
  },
];

export default function DatenschutzPage() {
  return <LegalPage title="Datenschutzerklärung" sections={sections} />;
}
