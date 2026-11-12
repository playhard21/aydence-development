import LegalPage from '../components/LegalPage';

export const metadata = {
  title: 'Impressum | Aydence',
  description: 'Impressum von Aydence.',
};

const sections = [
  {
    body: (
      <p>
        Aydence by Dr. Shoba Kapoor<br />
        Königsallee 10b<br />
        37081 Göttingen
      </p>
    ),
  },
  {
    heading: 'Kontakt',
    body: (
      <p>
        E-Mail: <a className="underline" href="mailto:info@aydence.de">info@aydence.de</a><br />
        Kontaktformular: <a className="underline" href="/booking">aydence.de/booking</a>
      </p>
    ),
  },
  // TODO: add the USt-IdNr. here if available.
  {
    heading: 'Verantwortlich für den Inhalt',
    body: <p>Dr. Shoba Kapoor (Anschrift wie oben)</p>,
  },
];

export default function ImpressumPage() {
  return <LegalPage title="Impressum" sections={sections} />;
}
