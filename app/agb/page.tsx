import LegalPage from '../components/LegalPage';

export const metadata = {
  title: 'AGB | Aydence',
  description: 'Allgemeine Geschäftsbedingungen von Aydence.',
};

const sections = [
  ['§ 1 Anbieter', 'Aydence by Dr. Shoba Kapoor, Königsallee 10b, 37081 Göttingen, info@aydence.de.'],
  ['§ 2 Angebot', 'Aydence bietet das Online-Coaching „Speaking Coaching (B1 Level)“ an: 9 Wochen, 27 Einheiten à 2 × 25 Minuten (8 Wochen Sprechtraining, Woche 9 Wiederholung Akkusativ und Dativ). Voraussetzung ist Sprachniveau B1.'],
  ['§ 3 Vertragsschluss', 'Der Vertrag kommt mit einem schriftlichen Kursvertrag (auch per E-Mail) zustande. Eine kostenlose Probestunde ist möglich.'],
  ['§ 4 Preise und Zahlung', 'Das Coaching „Speaking Coaching (B1 Level)“ kostet 220 EUR. Zahlung einmalig oder in zwei Raten zu je 110 EUR ohne Aufpreis, per Überweisung. Die Fälligkeiten stehen im Kursvertrag.'],
  ['§ 5 Kurszeiten', 'Die genauen Kurszeiten (deutsche Zeit) werden vor Kursbeginn bekannt gegeben und im Kursvertrag festgelegt. Terminänderungen aus organisatorischen Gründen bleiben vorbehalten und werden rechtzeitig mitgeteilt.'],
  ['§ 6 Teilnahme und Versäumnis', 'Versäumte Einheiten werden nicht nachgeholt und nicht erstattet. Die Kursgebühr ist unabhängig von der tatsächlichen Teilnahme fällig. Fällt Unterricht aus Gründen aus, die der Anbieter zu vertreten hat, wird er nachgeholt.'],
  ['§ 7 Widerrufsrecht', 'Verbraucher haben bei Verträgen im Fernabsatz ein Widerrufsrecht von 14 Tagen ab Vertragsschluss (§§ 312g, 355 BGB). Der Widerruf erfolgt durch eine eindeutige Erklärung, z. B. per E-Mail. Beginnt der Unterricht auf Wunsch während der Widerrufsfrist, ist für die bis zum Widerruf erbrachten Einheiten ein anteiliger Betrag zu zahlen.'],
  ['§ 8 Technik', 'Teilnehmende sorgen selbst für Internetzugang und ein geeignetes Gerät.'],
  ['§ 9 Urheberrecht', 'Kursmaterialien und Bücher sind nur für den persönlichen Gebrauch bestimmt und dürfen nicht weitergegeben werden.'],
  ['§ 10 Datenschutz', 'Personenbezogene Daten werden nur zur Durchführung des Vertrags nach DSGVO und BDSG verarbeitet. Details: Datenschutzerklärung.'],
  ['§ 11 Schlussbestimmungen', 'Es gilt deutsches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, Göttingen. Sollte eine Bestimmung unwirksam sein, bleiben die übrigen wirksam.'],
].map(([heading, text]) => ({ heading, body: <p>{text}</p> }));

export default function AGBPage() {
  return <LegalPage title="Allgemeine Geschäftsbedingungen – Aydence" sections={sections} />;
}
