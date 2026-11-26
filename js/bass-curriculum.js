import { REP_WORLD, REP_THEORY } from './bass-repertoire.js';
import { PRO_BASS_WORLDS, PRO_BASS_THEORY } from './pro-content.js';
// Kontrabass-Lehrplan: 6 Welten (Beginner I bis Intermediate III), Bogen und Pizzicato, Klassik und Jazz

export const BASS_THEORY = {
  ...REP_THEORY,
  ...PRO_BASS_THEORY,
  'b-schluessel': {
    title: 'Bassschlüssel & Oktavierung',
    html: `<p>Kontrabass-Noten stehen im <b>Bassschlüssel</b>. Die Besonderheit: Der Kontrabass <b>klingt eine Oktave tiefer</b>, als er notiert ist. So bleiben die Noten im System, statt auf vielen Hilfslinien darunter zu kleben.</p>
<p>Für dich heißt das: Du liest ganz normal im Bassschlüssel. Die App weiß, dass dein Ton eine Oktave tiefer klingt, und hört entsprechend zu.</p>
<p>Die leeren Saiten stehen so: <b>E</b> unter dem System (Hilfslinie), <b>A</b> im untersten Zwischenraum, <b>D</b> auf der Mittellinie, <b>G</b> im obersten Zwischenraum.</p>`,
    example: { lh: 'E2/q A2 D3 G3 | G3/q D3 A2 E2', tempo: 72 }, bass: true,
  },
  'b-saiten': {
    title: 'Die vier Saiten & das Stimmen',
    html: `<p>Der Kontrabass ist in <b>Quarten</b> gestimmt: E – A – D – G, von der dicksten zur dünnsten Saite. Das ist anders als bei Geige und Cello (Quinten) und macht viele Griffe bequemer.</p>
<p>Stimm vor jedem Üben – im Menü findest du das <b>Stimmgerät</b>. Tipp für Fortgeschrittene: Das Flageolett in der Saitenmitte klingt eine Oktave höher und lässt sich besonders genau stimmen.</p>`,
    example: { lh: 'E2/h A2/h | D3/h G3/h', tempo: 60 }, bass: true,
  },
  'b-simandl': {
    title: 'Simandl-Fingersatz & I. Lage',
    html: `<p>In den tiefen Lagen greift die linke Hand mit nur drei Fingern: <b>1, 2 und 4</b>. Der dritte Finger hilft dem vierten mit, weil die Abstände auf dem großen Griffbrett so weit sind. Zwischen 1 und 2 liegt ein Halbton, zwischen 2 und 4 auch – zusammen ein Ganzton.</p>
<p>In der <b>I. Lage</b> liegt Finger 1 einen Ganzton über der leeren Saite: auf der G-Saite das A, auf der D-Saite das E. Die Zahlen über den Noten zeigen dir den Fingersatz, <b>0</b> heißt leere Saite. Unten auf dem Griffbrett siehst du, wo die nächste Note liegt.</p>`,
    example: { lh: 'D3:0/q E3:1 F#3:4 G3:0 | A3:1/q B3:4 A3:1 G3:0', key: 'D', tempo: 72 }, bass: true,
  },
  'b-bogen': {
    title: 'Arco: Bogen & Strichrichtung',
    html: `<p><b>Arco</b> heißt: mit dem Bogen. Das Zeichen <b>⊓</b> bedeutet <b>Abstrich</b> (vom Frosch zur Spitze), <b>V</b> bedeutet <b>Aufstrich</b>. Schwere Zählzeiten bekommen meist den Abstrich.</p>
<p>Für einen satten Ton: Bogen zwischen Griffbrettende und Steg, Gewicht aus dem Arm statt Druck aus den Fingern, Bogen gerade halten. Sauberer Ton ist auch für die Erkennung im Mikrofon gut.</p>`,
    example: { lh: 'G3@d/h D3@u/h | A2@d/h D3@u/h', key: 'D', tempo: 72, tech: 'arco' }, bass: true,
  },
  'b-pizz': {
    title: 'Pizzicato',
    html: `<p><b>Pizz.</b> heißt gezupft. Zupf mit der Seite des Zeigefingers (oder Zeige- und Mittelfinger zusammen), nicht mit der Fingerspitze, etwa dort, wo das Griffbrett endet. Der Daumen stützt sich am Griffbrettrand ab.</p>
<p>Lass den Ton ausklingen, bis die nächste Note kommt – gerade im Jazz trägt der lange Pizzicato-Ton die ganze Band.</p>`,
    example: { lh: 'G2/q B2 D3 B2 | C3/q E3 G3 E3', key: 'G', tempo: 92, tech: 'pizz' }, bass: true,
  },
  'b-halbe-lage': {
    title: 'Halbe Lage',
    html: `<p>In der <b>halben Lage</b> rutscht die Hand einen Halbton näher zum Sattel: Finger 1 liegt direkt einen Halbton über der leeren Saite. Damit erreichst du Töne wie <b>F</b> (E-Saite), <b>B</b> (A-Saite) und <b>Es</b> (D-Saite).</p>
<p>Die halbe Lage ist das Zuhause der B-Tonarten wie F-Dur und B-Dur.</p>`,
    example: { lh: 'F2:1/q A2:0 Bb2:1 C3:4 | D3:0/q Eb3:1 F3:4 r', key: 'F', tempo: 72 }, bass: true,
  },
  'b-achtel': {
    title: 'Achtel & Groove',
    html: `<p>Eine <b>Achtel</b> dauert einen halben Schlag – zwei passen in eine Viertel. Zähl „eins-und-zwei-und“.</p>
<p>Beim Bass zählt vor allem das Timing: Spiel lieber einfach und exakt auf den Schlag, als viele Töne ungenau. Schalte im Rhythmus-Modus die <b>Begleitung</b> ein, dann hörst du, wie dein Bass die Band trägt.</p>`,
    example: { lh: 'G2/e B2 D3 B2 G2/q D3', key: 'G', tempo: 92, tech: 'pizz' }, bass: true,
  },
  'b-zweite-lage': {
    title: 'II. Lage & erster Lagenwechsel',
    html: `<p>In der <b>II. Lage</b> liegt Finger 1 eine kleine Terz über der leeren Saite: auf der A-Saite das <b>C</b>, auf der G-Saite das <b>B</b>.</p>
<p>Beim <b>Lagenwechsel</b> gleitet die ganze Hand – Daumen und Finger gemeinsam. Lass den Finger leicht auf der Saite, statt zu springen. Die blauen Lagen-Bezeichnungen über den Noten zeigen dir, wann du wechselst.</p>`,
    example: { lh: 'C3/q D3 E3 F3 | G3/h C4/h', key: 'C', tempo: 72 }, bass: true,
  },
  'b-saitenwechsel': {
    title: 'Saitenwechsel & Pausen',
    html: `<p>Bei einem <b>Saitenwechsel</b> mit dem Bogen bewegt sich der rechte Arm schon vorher in die neue Ebene – nicht erst im letzten Moment.</p>
<p>In <b>Pausen</b> muss der Bass wirklich still sein: Saite mit der linken Hand oder dem Bogen abdämpfen. Ein nachklingender Ton in der Pause fällt im Orchester sofort auf.</p>`,
    example: { lh: 'D3/q r A2 r | D3/q F#3 A3/h', key: 'D', tempo: 80 }, bass: true,
  },
  'b-b-tonarten': {
    title: 'F-Dur & B-Dur',
    html: `<p><b>F-Dur</b> hat ein B (jedes H wird zu B), <b>B-Dur</b> zwei (B und Es). Am Kontrabass liegen diese Tonarten gut in der <b>halben Lage</b>.</p>
<p>Achte auf das Es auf der D-Saite: Finger 1 in halber Lage, sehr nah am Sattel.</p>`,
    example: { lh: 'Bb2/q C3 D3 Eb3 | F3/q G3 A3 Bb3', key: 'Bb', tempo: 72 }, bass: true,
  },
  'b-dreier': {
    title: '3/4-Takt & Punktierung',
    html: `<p>Im <b>3/4-Takt</b> spielt der Bass meist nur die „Eins“ – den Grundton – und die Begleitung macht „tschak, tschak“.</p>
<p>Eine <b>punktierte Viertel</b> dauert eineinhalb Schläge, danach füllt eine Achtel auf. Das klingt nach Marsch: „lang – kurz – lang“.</p>`,
    example: { lh: 'F2/h. | C3/h. | D3/q. D3/e A2/q', key: 'F', ts: [3, 4], tempo: 100 }, bass: true,
  },
  'b-intonation': {
    title: 'Sauber intonieren',
    html: `<p>Der Kontrabass hat keine Bünde – jeder Ton entsteht erst durch deine Fingerposition. Die <b>Nadel rechts unten</b> zeigt dir live, ob du zu hoch oder zu tief bist. Im grünen Bereich (± 15 Cent) gilt der Ton als sauber.</p>
<p>Trick: Viele gegriffene Töne kannst du mit einer <b>leeren Saite</b> vergleichen – ein sauberes D auf der A-Saite schwingt mit der leeren D-Saite mit.</p>`,
    example: null, bass: true,
  },
  'b-akkorde': {
    title: 'Akkordsymbole lesen',
    html: `<p>Über den Noten stehen jetzt <b>Akkordsymbole</b>. Der Buchstabe ist der Grundton. Achtung: B♭ ist unser deutsches <b>B</b>, und ein „H“ steht für das deutsche H.</p>
<p>„m“ heißt Moll, „7“ heißt Septakkord mit kleiner Septime, „maj7“ mit großer Septime. Als Bassist spielst du auf der „Eins“ fast immer den <b>Grundton</b> – das ist dein wichtigster Job.</p>`,
    example: { lh: 'F2/h C3/h | D3/h A2/h', chords: 'F | D7', key: 'F', tempo: 100, tech: 'pizz' }, bass: true,
  },
  'b-walking': {
    title: 'Walking Bass',
    html: `<p>Beim <b>Walking Bass</b> läufst du in Vierteln durch die Akkorde: Schlag 1 Grundton, danach weitere Akkordtöne (Terz, Quinte, Sexte, Septime) oder Tonleiterschritte.</p>
<p>Der Swing kommt vom gleichmäßigen, langen Pizzicato – jede Viertel gleich laut und gleich lang. Schalte die Begleitung ein: Ride-Becken und Klavier spielen mit dir.</p>`,
    example: { lh: 'F2/q A2 C3 A2 | D3/q F#3 A3 F#3', chords: 'F | D7', key: 'F', tempo: 108, tech: 'pizz' }, bass: true,
  },
  'b-approach': {
    title: 'Chromatische Annäherung',
    html: `<p>Der Profi-Trick: Auf Schlag 4 spielst du einen Ton, der einen <b>Halbton über oder unter dem nächsten Grundton</b> liegt. Das zieht magisch in den nächsten Akkord.</p>
<p>Beispiel: Von F7 nach B♭7 spielst du am Ende des Taktes ein H oder ein A – beides landet einen Halbton neben dem B.</p>`,
    example: { lh: 'F2/q A2 C3 B2 | Bb2/w', chords: 'F7 | Bb7', key: 'F', tempo: 108, tech: 'pizz' }, bass: true,
  },
  'b-dritte-lage': {
    title: 'III. und IV. Lage',
    html: `<p>In der <b>III. Lage</b> liegt Finger 1 eine Quarte über der leeren Saite (G-Saite: C), in der <b>IV. Lage</b> eine Quinte (G-Saite: D). Damit erreichst du die obere Oktave, ohne in die Daumenlage zu müssen.</p>
<p>Orientierung: In der IV. Lage liegt dein vierter Finger auf der G-Saite auf dem E – kurz bevor der Hals in den Korpus übergeht.</p>`,
    example: { lh: 'C4/q B3 A3 G#3 | D4/q C4 B3 A3', key: 'C', tempo: 72 }, bass: true,
  },
  'b-moll': {
    title: 'Moll am Kontrabass',
    html: `<p><b>e-Moll</b> und <b>a-Moll</b> liegen dem Bass besonders gut, weil die leeren Saiten E und A die Grundtöne sind.</p>
<p>Typisch für Moll ist der <b>Leitton</b> – in a-Moll das Gis, in e-Moll das Dis. Er klingt am besten, wenn du ihn eher etwas höher intonierst, damit er zum Grundton zieht.</p>`,
    example: { lh: 'E2/e G2 B2 E3 G3/q E3', key: 'G', tempo: 88 }, bass: true,
  },
  'b-shift': {
    title: 'Lagenwechsel sauber',
    html: `<p>Ein sauberer Lagenwechsel hat drei Phasen: <b>loslassen</b> (Druck kurz raus), <b>gleiten</b> (der alte Finger rutscht zur neuen Lage) und <b>ankommen</b> (neuer Finger setzt genau auf).</p>
<p>Übe langsam im Warte-Modus und schau auf die Intonations-Nadel – beim Ankommen nach einem Wechsel sieht man jede Ungenauigkeit sofort.</p>`,
    example: { lh: 'C3/q D3 E3 F3 | G3/q A3 B3 C4', key: 'C', tempo: 72 }, bass: true,
  },
  'b-groove': {
    title: 'Groove & Ghost Notes',
    html: `<p>Funk und Pop leben von <b>Pausen</b> und kurzen Tönen. Eine gut gesetzte Pause groovt mehr als drei extra Töne.</p>
<p>Spiel die Achtel gerade (nicht geswingt) und dämpfe nach kurzen Tönen sofort ab. Die Kick-Drum der Begleitung ist dein Partner – spiel mit ihr zusammen.</p>`,
    example: { lh: 'E2/e E2/e r/e E3/e r/e D3/e B2/q', key: 'G', tempo: 96, tech: 'pizz' }, bass: true,
  },
  'b-orchester': {
    title: 'Im Orchester',
    html: `<p>Im Orchester ist der Kontrabass das Fundament: Er spielt die tiefste Stimme und oft mit den Celli zusammen eine Oktave tiefer.</p>
<p>Drei Grundregeln: <b>Zählen</b> (auch in langen Pausen), <b>gemeinsam einsetzen</b> (auf den Dirigenten achten) und <b>nicht zu früh</b> spielen – ein tiefer Ton braucht etwas Zeit, bis er anspricht.</p>`,
    example: null, bass: true,
  },
};

const D = (id, title, cfg) => ({ type: 'drill', id, title, cfg: { layout: 'b', ...cfg } });
const T = id => ({ type: 'theory', id: 't-' + id, card: id });
const Pc = id => ({ type: 'piece', id: 'p-' + id, piece: id });

export const BASS_WORLDS = [
  {
    id: 'bw1', title: 'Leere Saiten & I. Lage', level: 'Beginner I', hint: 2, color: '#3d7bfd', maxPos: 2,
    blurb: 'Bassschlüssel, die vier Saiten, Bogen und erste Griffe.',
    lessons: [
      { id: 'bl1-1', title: 'Leere Saiten', steps: [T('b-schluessel'), T('b-saiten'), T('b-bogen'), D('bd1-1', 'Leere Saiten lesen', { b: ['E2', 'A2', 'D3', 'G3'], patterns: ['qh'], bars: 4, tempo: 66 }), Pc('b-vier-saiten')] },
      { id: 'bl1-2', title: 'I. Lage: G- und D-Saite', steps: [T('b-simandl'), D('bd1-2', 'G- und D-Saite', { key: 'D', b: ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3'], patterns: ['qh'], bars: 4, tempo: 66, stepwise: true }), Pc('b-erste-melodie')] },
      { id: 'bl1-3', title: 'I. Lage: A- und E-Saite', steps: [D('bd1-3', 'A- und E-Saite', { key: 'G', b: ['E2', 'F#2', 'G2', 'A2', 'B2', 'C3', 'D3'], patterns: ['qh'], bars: 4, tempo: 66, stepwise: true }), Pc('b-tiefsee')] },
      { id: 'bl1-4', title: 'Intonation & Tonleiter', steps: [T('b-intonation'), Pc('b-g-dur-leiter')] },
    ],
    boss: 'b-ode',
  },
  {
    id: 'bw2', title: 'Untere Lagen', level: 'Beginner II', hint: 1, color: '#11a36a', maxPos: 3,
    blurb: 'Halbe und II. Lage, Pizzicato, Achtel, Saitenwechsel.',
    lessons: [
      { id: 'bl2-1', title: 'Halbe Lage', steps: [T('b-halbe-lage'), T('b-pizz'), D('bd2-1', 'Halbe Lage in F-Dur', { key: 'F', b: ['F2', 'G2', 'A2', 'Bb2', 'C3', 'D3', 'Eb3', 'F3'], patterns: ['qh'], bars: 4, tempo: 66, stepwise: true }), Pc('b-schleichkatze')] },
      { id: 'bl2-2', title: 'Achtel & Groove', steps: [T('b-achtel'), D('bd2-2', 'Achtel in G-Dur', { key: 'G', b: ['G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F#3', 'G3'], patterns: ['e'], bars: 4, tempo: 72, stepwise: true }), Pc('b-polka')] },
      { id: 'bl2-3', title: 'II. Lage', steps: [T('b-zweite-lage'), D('bd2-3', 'C-Dur mit Lagenwechsel', { b: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'], patterns: ['qh'], bars: 4, tempo: 66, stepwise: true }), Pc('b-turmuhr')] },
      { id: 'bl2-4', title: 'Saitenwechsel & Pausen', steps: [T('b-saitenwechsel'), D('bd2-4', 'Noten und Pausen', { key: 'D', b: ['A2', 'C#3', 'D3', 'E3', 'F#3', 'G3', 'A3'], patterns: ['rest'], bars: 4, tempo: 72 }), Pc('b-leichter-schritt')] },
    ],
    boss: 'b-kanon',
  },
  {
    id: 'bw3', title: 'Tonarten & Rhythmus', level: 'Beginner III', hint: 0, color: '#e8590c', maxPos: 4,
    blurb: 'F- und B-Dur, Vorzeichen, Dreiertakt, Punktierungen.',
    lessons: [
      { id: 'bl3-1', title: 'F-Dur & B-Dur', steps: [T('b-b-tonarten'), D('bd3-1', 'Blattspiel in B-Dur', { key: 'Bb', b: ['F2', 'G2', 'A2', 'Bb2', 'C3', 'D3', 'Eb3', 'F3'], patterns: ['qh'], bars: 4, tempo: 70 }), Pc('b-marsch-f'), Pc('b-abend-b')] },
      { id: 'bl3-2', title: 'Chromatik', steps: [D('bd3-2', 'Halbtonschritte', { b: ['E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'Bb2', 'B2'], patterns: ['qh'], bars: 4, tempo: 62, stepwise: true }), Pc('b-kriecher')] },
      { id: 'bl3-3', title: 'Dreiertakt & Punktierung', steps: [T('b-dreier'), D('bd3-3', 'Punktierte Rhythmen', { key: 'F', b: ['F2', 'A2', 'Bb2', 'C3', 'D3', 'F3'], patterns: ['dot'], bars: 4, tempo: 72 }), Pc('b-walzer')] },
    ],
    boss: 'b-riesen',
  },
  {
    id: 'bw4', title: 'Walking Bass', level: 'Intermediate I', hint: 0, color: '#9c36b5', maxPos: 5,
    blurb: 'Akkordsymbole, Two-Feel, Walking, chromatische Annäherung.',
    lessons: [
      { id: 'bl4-1', title: 'Grundton & Quinte', steps: [T('b-akkorde'), Pc('b-zwei-schritt')] },
      { id: 'bl4-2', title: 'Walking in Vierteln', steps: [T('b-walking'), Pc('b-spaziergang')] },
      { id: 'bl4-3', title: 'Chromatische Annäherung', steps: [T('b-approach'), Pc('b-blues-treppe')] },
    ],
    boss: 'b-mitternacht',
  },
  {
    id: 'bw5', title: 'Mittlere Lagen', level: 'Intermediate II', hint: 0, color: '#0c8599', maxPos: 7,
    blurb: 'III. und IV. Lage, Lagenwechsel, Moll-Tonarten.',
    lessons: [
      { id: 'bl5-1', title: 'III. Lage', steps: [T('b-dritte-lage'), T('b-moll'), Pc('b-nebelmond')] },
      { id: 'bl5-2', title: 'IV. Lage', steps: [D('bd5-2', 'Obere Oktave', { key: 'G', b: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4'], patterns: ['qh'], bars: 4, tempo: 66, stepwise: true }), Pc('b-hoch-hinaus')] },
      { id: 'bl5-3', title: 'Lagenwechsel', steps: [T('b-shift'), Pc('b-aufwaerts')] },
    ],
    boss: 'b-sturmfahrt',
  },
  {
    id: 'bw6', title: 'Orchester & Groove', level: 'Intermediate III', hint: 0, color: '#c2255c', maxPos: 9,
    blurb: 'Funk-Groove, Orchester-Tutti, lange Töne, Blattspiel.',
    lessons: [
      { id: 'bl6-1', title: 'Funk', steps: [T('b-groove'), Pc('b-neon-funk')] },
      { id: 'bl6-2', title: 'Orchester', steps: [T('b-orchester'), Pc('b-tutti'), Pc('b-abendlied')] },
      { id: 'bl6-3', title: 'Blattspiel-Marathon', steps: [D('bd6-3a', 'Ganzer Tonraum', { key: 'G', b: ['E2', 'F#2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'D4'], patterns: ['qh', 'e', 'dot'], bars: 8, tempo: 72 }), D('bd6-3b', 'B-Tonarten', { key: 'F', b: ['F2', 'G2', 'A2', 'Bb2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'Bb3', 'C4'], patterns: ['qh', 'e'], bars: 8, tempo: 72 })] },
    ],
    boss: 'b-riesenschritte',
  },
  REP_WORLD,
  ...PRO_BASS_WORLDS,
];
