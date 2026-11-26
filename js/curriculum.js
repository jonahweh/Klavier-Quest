// Lehrplan: Welten → Lektionen → Schritte. Theorie-Karten mit Beispielen zum Anhören.
import { BASS_WORLDS, BASS_THEORY } from './bass-curriculum.js';

const C_POS_T = ['C4', 'D4', 'E4', 'F4', 'G4'];
const C_POS_B = ['C3', 'D3', 'E3', 'F3', 'G3'];
const G_POS_T = ['G4', 'A4', 'B4', 'C5', 'D5'];
const G_POS_B = ['G2', 'A2', 'B2', 'C3', 'D3'];

export const THEORY = {
  'system': {
    title: 'Notensystem & Mittel-C',
    html: `<p>Noten stehen auf fünf Linien. Je höher eine Note im System sitzt, desto höher klingt sie. Der <b>Violinschlüssel</b> legt fest, dass die zweite Linie von unten das <b>G</b> ist – deshalb heißt er auch G-Schlüssel und kringelt sich genau um diese Linie.</p>
<p>Das <b>Mittel-C</b> (auch c¹ oder C4) ist dein Ankerpunkt: Es liegt im Violinschlüssel auf einer kleinen Hilfslinie <em>unter</em> dem System und auf dem Klavier ungefähr in der Mitte, links neben der Zweiergruppe schwarzer Tasten.</p>
<p>Von dort aus geht es Schritt für Schritt: Linie, Zwischenraum, Linie, Zwischenraum – jeder Schritt ist eine weiße Taste weiter.</p>`,
    example: { rh: 'C4/q D4 E4 F4 | G4/w', tempo: 80 },
  },
  'finger': {
    title: 'Fingernummern & Fünffingerlage',
    html: `<p>Beide Hände zählen vom <b>Daumen (1)</b> bis zum <b>kleinen Finger (5)</b>. In der <b>C-Lage</b> liegt jeder Finger der rechten Hand auf einer eigenen Taste: Daumen auf C, dann D, E, F, G.</p>
<p>Die Zahlen über den Noten sind der Fingersatz. Er ist kein Gesetz, aber er spart dir später viele Knoten in den Fingern. Halte die Hand locker gewölbt, als würdest du einen kleinen Ball halten.</p>`,
    example: { rh: 'C4:1/q D4:2 E4:3 F4:4 | G4:5/w', tempo: 80 },
  },
  'werte': {
    title: 'Notenwerte & 4/4-Takt',
    html: `<p>Die Form der Note verrät, wie lange sie klingt. Eine <b>Viertelnote</b> (schwarz mit Hals) dauert einen Schlag, die <b>halbe Note</b> (hohl mit Hals) zwei Schläge und die <b>ganze Note</b> (hohl, ohne Hals) vier Schläge.</p>
<p>Im <b>4/4-Takt</b> passen genau vier Viertel in einen Takt. Taktstriche trennen die Takte – zähl beim Üben ruhig laut mit: „eins, zwei, drei, vier“.</p>
<p>Im <b>Warte-Modus</b> wartet die App, bis du die richtige Taste triffst. Im <b>Rhythmus-Modus</b> läuft die Musik im Tempo weiter und bewertet dein Timing.</p>`,
    example: { rh: 'C4/q C4 C4 C4 | E4/h E4/h | G4/w', tempo: 80 },
  },
  'bass': {
    title: 'Bassschlüssel',
    html: `<p>Der <b>Bassschlüssel</b> (F-Schlüssel) markiert mit seinen zwei Punkten die vierte Linie von unten: das ist das <b>F</b> unter dem Mittel-C (F3).</p>
<p>Eselsbrücke: Das <b>C3</b> liegt im Bassschlüssel im zweiten Zwischenraum von unten. Die linke Hand übernimmt in der C-Lage C3 bis G3 – hier ist der <b>kleine Finger (5)</b> auf dem C und der Daumen auf dem G.</p>
<p>Weil du beide Schlüssel schon lesen kannst, geht es hier vor allem ums Tempo: Erkenne die Lage einer Note, ohne abzuzählen.</p>`,
    example: { lh: 'C3:5/q D3:4 E3:3 F3:2 | G3:1/w', tempo: 80 },
  },
  'haende': {
    title: 'Hand für Hand',
    html: `<p>Im <b>Klaviersystem</b> stehen Violin- und Bassschlüssel übereinander, verbunden durch eine Klammer. Oben spielt meist die rechte, unten die linke Hand.</p>
<p>Lies immer <b>senkrecht</b>: Was genau übereinander steht, wird gleichzeitig gespielt. Steht in einem System eine Pause, hat die Hand frei.</p>`,
    example: { rh: 'C4/q E4 G4/h | r/w', lh: 'r/w | C3/q E3 G3/h', tempo: 84 },
  },
  'zusammen': {
    title: 'Beide Hände zusammen',
    html: `<p>Der Trick beim beidhändigen Spiel: Eine Hand führt, die andere begleitet. Am Anfang hält die linke Hand lange Töne, während die rechte die Melodie spielt.</p>
<p>Übe schwierige Stellen zuerst einzeln, dann im Warte-Modus zusammen. Erst wenn das sitzt, wechselst du in den Rhythmus-Modus.</p>`,
    example: { rh: 'E4/q G4 F4 E4 | D4/h C4/h', lh: 'C3/w | G3/h C3/h', tempo: 80 },
  },
  'achtel': {
    title: 'Achtelnoten',
    html: `<p>Eine <b>Achtelnote</b> hat ein Fähnchen und dauert einen halben Schlag. Zwei Achtel passen also in eine Viertel.</p>
<p>Zähl dazu „eins-und-zwei-und“: Die erste Achtel fällt auf die Zahl, die zweite auf das „und“. Achtel klingen schnell, sind aber nichts anderes als halbierte Viertel.</p>`,
    example: { rh: 'C4/e D4 E4 F4 G4/q G4 | E4/e F4 G4 E4 C4/h', tempo: 84 },
  },
  'pausen': {
    title: 'Pausen',
    html: `<p>Pausen sind genauso wichtig wie Noten – Musik muss atmen. Jeder Notenwert hat seine Pause: Die <b>ganze Pause</b> hängt wie ein Balken unter der vierten Linie, die <b>halbe Pause</b> sitzt wie ein Hut auf der Mittellinie, die <b>Viertelpause</b> sieht aus wie ein Blitz.</p>
<p>In einer Pause hebst du die Hand leicht an, damit der Ton wirklich aufhört.</p>`,
    example: { rh: 'G4/q r E4 r | F4/q E4 D4/h', tempo: 84 },
  },
  'g-lage': {
    title: 'Neue Lage: G',
    html: `<p>Die <b>G-Lage</b> verschiebt deine Hand um fünf Tasten: Der rechte Daumen liegt auf G4, der kleine Finger auf D5. Links liegt der kleine Finger auf G2, der Daumen auf D3.</p>
<p>Lagen sind wie Startpositionen im Spiel: Wer weiß, wo die Hand liegt, muss nicht mehr nach unten schauen.</p>`,
    example: { rh: 'G4:1/q A4:2 B4:3 C5:4 | D5:5/w', tempo: 84 },
  },
  'vorzeichen': {
    title: 'Kreuz, B & Auflöser',
    html: `<p>Ein <b>Kreuz (♯)</b> erhöht eine Note um einen Halbton – du spielst die nächste Taste rechts davon, meist eine schwarze. Aus F wird Fis, aus C wird Cis.</p>
<p>Ein <b>B (♭)</b> erniedrigt um einen Halbton: Aus E wird Es, aus A wird As. Achtung, deutsche Besonderheit: Ein erniedrigtes H heißt einfach <b>B</b>.</p>
<p>Ein Vorzeichen gilt bis zum Ende des Taktes. Der <b>Auflöser (♮)</b> hebt es wieder auf.</p>`,
    example: { rh: 'F4/q F#4 G4/h | E4/q Eb4 D4/h', tempo: 76 },
  },
  'g-dur': {
    title: 'G-Dur: ein Kreuz',
    html: `<p>Steht ein Kreuz direkt am Anfang auf der F-Linie, ist das die <b>Tonart-Vorzeichnung</b>: Jedes F im ganzen Stück wird zu Fis – auch in anderen Oktaven.</p>
<p>Ein Kreuz bedeutet meistens <b>G-Dur</b> (oder e-Moll). Merk dir: Das letzte Kreuz liegt immer einen Halbton unter dem Grundton.</p>`,
    example: { rh: 'G4/q A4 B4 C5 | D5/q E5 F#5 G5/q', key: 'G', tempo: 84 },
  },
  'f-dur': {
    title: 'F-Dur: ein B',
    html: `<p>Ein einzelnes <b>B</b> in der Vorzeichnung sitzt auf der H-Linie: Jedes H wird zu B. Das ist <b>F-Dur</b> (oder d-Moll).</p>
<p>Bei B-Tonarten gilt: Das vorletzte B nennt dir die Tonart. Bei nur einem B musst du dir F-Dur einfach merken.</p>`,
    example: { rh: 'F4/q G4 A4 Bb4 | C5/w', key: 'F', tempo: 84 },
  },
  'punktiert': {
    title: '3/4-Takt & Punktierung',
    html: `<p>Im <b>3/4-Takt</b> hat jeder Takt drei Schläge – der Walzer-Rhythmus: „EINS zwei drei“.</p>
<p>Ein <b>Punkt</b> hinter einer Note verlängert sie um die Hälfte. Die punktierte Halbe dauert drei Schläge, die punktierte Viertel eineinhalb. Danach folgt oft eine Achtel, die den Schlag auffüllt: „lang – kurz“.</p>`,
    example: { rh: 'E4/h. | G4/q. F4/e E4/q | D4/h.', ts: [3, 4], tempo: 96 },
  },
  'dreiklang': {
    title: 'Dreiklänge',
    html: `<p>Ein <b>Dreiklang</b> besteht aus drei Tönen im Terzabstand – Note auf Linie, Linie, Linie (oder Zwischenraum, Zwischenraum, Zwischenraum). C–E–G ist der <b>C-Dur-Dreiklang</b>.</p>
<p>Mit nur drei Akkorden – C, F und G – kannst du schon unzählige Lieder begleiten. Damit die linke Hand nicht springen muss, spielt man F und G oft <b>umgekehrt</b>: C–F–A und H–D–G.</p>
<p>Tipp für das Mikrofon: Schlag alle Töne eines Akkords möglichst gleichzeitig an.</p>`,
    example: { lh: 'C3+E3+G3/h C3+F3+A3/h | B2+D3+G3/h C3+E3+G3/h', tempo: 72 },
  },
  'gebrochen': {
    title: 'Gebrochene Akkorde',
    html: `<p>Statt alle Töne gleichzeitig zu spielen, kannst du einen Akkord <b>brechen</b>: nacheinander, meist Grundton – Quinte – Terz – Quinte. So klingt Begleitung lebendig und fließend.</p>
<p>Die Hand bleibt dabei in ihrer Akkord-Form liegen, nur die Finger wechseln sich ab.</p>`,
    example: { lh: 'C3/e G3 E3 G3 C3 G3 E3 G3 | A2/e E3 C3 E3 A2 E3 C3 E3', tempo: 80 },
  },
  'moll': {
    title: 'Dur und Moll',
    html: `<p>Dur klingt hell, Moll eher dunkel oder geheimnisvoll. Der Unterschied liegt nur in der <b>mittleren Note</b>: Bei C-Dur ist es E, bei c-Moll Es.</p>
<p><b>a-Moll</b> ist die „Schwester“ von C-Dur: gleiche Tasten, aber das A ist der Ruhepunkt. Viele Game- und Filmmusiken nutzen a-Moll für Spannung. Oft taucht dabei ein <b>Gis</b> auf – es zieht stark zurück zum A.</p>`,
    example: { rh: 'C4+E4+G4/h C4+Eb4+G4/h | A3+C4+E4/w', tempo: 70 },
  },
  'kadenz': {
    title: 'Die Kadenz: I – IV – V',
    html: `<p>Auf jeder Stufe einer Tonleiter lässt sich ein Dreiklang bauen. Die wichtigsten sind die <b>I. Stufe</b> (Tonika, Zuhause), die <b>IV.</b> (Subdominante, Aufbruch) und die <b>V.</b> (Dominante, Spannung).</p>
<p>In G-Dur sind das G, C und D. Spannung – Lösung: Fast jedes Heldenthema lebt davon, dass die Dominante zurück zur Tonika will.</p>`,
    example: { lh: 'G2+B2+D3/h G2+C3+E3/h | F#2+A2+D3/h G2+B2+D3/h', key: 'G', tempo: 72 },
  },
  'untersatz': {
    title: 'Daumenuntersatz',
    html: `<p>Fünf Finger reichen nicht für acht Töne. Deshalb schlüpft bei der Tonleiter der <b>Daumen unter</b> die Hand: rechts nach dem E (Finger 3) auf das F. Abwärts kreuzt der 3. Finger über den Daumen.</p>
<p>Wichtig ist, dass die Hand dabei ruhig bleibt und nur der Daumen wandert – wie eine Brücke, unter der ein Boot durchfährt.</p>`,
    example: { rh: 'C4:1/q D4:2 E4:3 F4:1 | G4:2 A4:3 B4:4 C5:5', tempo: 76 },
  },
  'd-dur': {
    title: 'D-Dur: zwei Kreuze',
    html: `<p>Zwei Kreuze – auf F und C – ergeben <b>D-Dur</b> (das letzte Kreuz, Cis, liegt einen Halbton unter D). Jedes F wird zu Fis, jedes C zu Cis.</p>
<p>Fühl die schwarzen Tasten: In der D-Lage liegt dein dritter Finger auf dem Fis.</p>`,
    example: { rh: 'D4/q E4 F#4 G4 | A4/q B4 C#5 D5', key: 'D', tempo: 80 },
  },
  'lagenwechsel': {
    title: 'Lagenwechsel',
    html: `<p>Bei einem <b>Lagenwechsel</b> springt die ganze Hand an eine neue Stelle. Der Trick: Schau schon während der letzten Note der alten Lage zur neuen – und nutze Pausen zum Umsetzen.</p>
<p>Die Fingersätze zeigen dir, wo die neue Lage beginnt (oft wieder mit dem Daumen).</p>`,
    example: { rh: 'C4:1/q E4:3 G4:5 r | G4:1/q B4:3 D5:5 r', tempo: 84 },
  },
  'synkope': {
    title: 'Synkopen',
    html: `<p>Eine <b>Synkope</b> betont einen Schlag, der eigentlich unbetont ist – zum Beispiel eine Viertel, die auf dem „und“ beginnt. Das erzeugt Groove.</p>
<p>Zähl konsequent in Achteln mit („eins und zwei und“) und lass die lange Note über den Hauptschlag klingen.</p>`,
    example: { rh: 'A4/e C5/q A4/e C5/q D5 | E5/e D5/q C5/e A4/h', tempo: 88 },
  },
  'walzerbass': {
    title: 'Melodie & Walzerbass',
    html: `<p>Der klassische Walzerbass: Auf „eins“ spielt die linke Hand den <b>Grundton</b>, auf „zwei“ und „drei“ den Rest des Akkords. „Bumm – tschak – tschak“.</p>
<p>Halte die Begleitung leicht, damit die Melodie oben singen kann.</p>`,
    example: { lh: 'C3/q E3+G3 E3+G3 | G2/q B2+D3 B2+D3', ts: [3, 4], tempo: 108 },
  },
  'blattspiel': {
    title: 'Vom Blatt spielen',
    html: `<p>Beim Blattspiel gilt: <b>Nie anhalten.</b> Lieber eine Note auslassen als den Rhythmus verlieren.</p>
<p>Bevor du startest: Tonart, Taktart und tiefste und höchste Note checken. Lies beim Spielen immer schon ein bis zwei Schläge voraus – deine Augen sind der Scout, die Finger folgen.</p>`,
    example: null,
  },
};

const D = (id, title, cfg) => ({ type: 'drill', id, title, cfg });
const T = id => ({ type: 'theory', id: 't-' + id, card: id });
const Pc = id => ({ type: 'piece', id: 'p-' + id, piece: id });

export const WORLDS = [
  {
    id: 'w1', title: 'Comeback', level: 'Beginner I', hint: 2, color: '#3d7bfd',
    blurb: 'Zurück an die Tasten: C-Lage, Notenwerte, beide Schlüssel.',
    lessons: [
      { id: 'l1-1', title: 'Die C-Lage rechts', steps: [T('system'), T('finger'), D('d1-1', 'Viertel in der C-Lage', { layout: 't', t: C_POS_T, posT: 'C4', patterns: ['q'], bars: 4, tempo: 70 }), Pc('erster-schritt')] },
      { id: 'l1-2', title: 'Notenwerte', steps: [T('werte'), D('d1-2', 'Viertel, Halbe, Ganze', { layout: 't', t: C_POS_T, posT: 'C4', patterns: ['qhw'], bars: 4, tempo: 72 }), Pc('treppenhaus')] },
      { id: 'l1-3', title: 'Die C-Lage links', steps: [T('bass'), D('d1-3', 'Bassschlüssel C-Lage', { layout: 'b', b: C_POS_B, posB: 'C3', patterns: ['qh'], bars: 4, tempo: 70 }), Pc('glockenturm')] },
      { id: 'l1-4', title: 'Hand für Hand', steps: [T('haende'), D('d1-4', 'Abwechselnd rechts & links', { layout: 'alt', t: C_POS_T, b: C_POS_B, posT: 'C4', posB: 'C3', patterns: ['qh'], bars: 4, tempo: 72 }), Pc('echo')] },
    ],
    boss: 'ode',
  },
  {
    id: 'w2', title: 'Zwei Hände', level: 'Beginner II', hint: 1, color: '#11a36a',
    blurb: 'Melodie und Begleitung gleichzeitig, Achtel, Pausen, G-Lage.',
    lessons: [
      { id: 'l2-1', title: 'Gemeinsam spielen', steps: [T('zusammen'), D('d2-1', 'Melodie über langen Basstönen', { layout: 'both', t: C_POS_T, b: ['C3', 'G3', 'F3', 'E3'], posT: 'C4', patterns: ['qh'], bars: 4, tempo: 70 }), Pc('wellen')] },
      { id: 'l2-2', title: 'Achtelnoten', steps: [T('achtel'), D('d2-2', 'Achtel in der C-Lage', { layout: 't', t: C_POS_T, posT: 'C4', patterns: ['e'], bars: 4, tempo: 72, stepwise: true }), Pc('pixel-marsch')] },
      { id: 'l2-3', title: 'Pausen', steps: [T('pausen'), D('d2-3', 'Noten und Pausen', { layout: 't', t: C_POS_T, posT: 'C4', patterns: ['rest'], bars: 4, tempo: 76 }), Pc('leise-schritte')] },
      { id: 'l2-4', title: 'Neue Lage: G', steps: [T('g-lage'), D('d2-4a', 'G-Lage rechts', { layout: 't', t: G_POS_T, posT: 'G4', patterns: ['qh'], bars: 4, tempo: 72 }), D('d2-4b', 'G-Lage links', { layout: 'b', b: G_POS_B, posB: 'G2', patterns: ['qh'], bars: 4, tempo: 72 }), Pc('wolkenreise')] },
    ],
    boss: 'ode-2',
  },
  {
    id: 'w3', title: 'Tonarten', level: 'Beginner III', hint: 0, color: '#e8590c',
    blurb: 'Vorzeichen, G-Dur, F-Dur, 3/4-Takt und Punktierungen.',
    lessons: [
      { id: 'l3-1', title: 'Kreuz, B & Auflöser', steps: [T('vorzeichen'), D('d3-1', 'Halbtöne lesen', { layout: 't', t: ['C4', 'C#4', 'D4', 'Eb4', 'E4', 'F4', 'F#4', 'G4'], patterns: ['qh'], bars: 4, tempo: 66, stepwise: true }), Pc('geister')] },
      { id: 'l3-2', title: 'G-Dur', steps: [T('g-dur'), D('d3-2', 'Blattspiel in G-Dur', { layout: 't', key: 'G', t: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'D5'], patterns: ['qh'], bars: 4, tempo: 72 }), Pc('morgen-in-g')] },
      { id: 'l3-3', title: 'F-Dur', steps: [T('f-dur'), D('d3-3', 'Blattspiel in F-Dur', { layout: 't', key: 'F', t: ['F4', 'G4', 'A4', 'Bb4', 'C5'], posT: 'F4', patterns: ['qh'], bars: 4, tempo: 72 }), Pc('abendlied-f')] },
      { id: 'l3-4', title: '3/4-Takt & Punktierung', steps: [T('punktiert'), D('d3-4', 'Dreiertakt', { layout: 't', ts: [3, 4], t: C_POS_T, posT: 'C4', patterns: ['w3'], bars: 4, tempo: 84 }), D('d3-4b', 'Punktierte Rhythmen', { layout: 't', t: C_POS_T, posT: 'C4', patterns: ['dot'], bars: 4, tempo: 72 }), Pc('kleiner-walzer')] },
    ],
    boss: 'menuett-g',
  },
  {
    id: 'w4', title: 'Akkorde', level: 'Intermediate I', hint: 0, color: '#9c36b5',
    blurb: 'Dreiklänge, gebrochene Akkorde, Moll und die Kadenz.',
    lessons: [
      { id: 'l4-1', title: 'Dreiklänge', steps: [T('dreiklang'), D('d4-1', 'Melodie über Akkorden', { layout: 'both', t: C_POS_T, chordsB: ['C3+E3+G3', 'C3+F3+A3', 'B2+D3+G3'], posT: 'C4', patterns: ['qh'], bars: 4, tempo: 66 }), Pc('choral')] },
      { id: 'l4-2', title: 'Gebrochene Akkorde', steps: [T('gebrochen'), Pc('sternenstaub')] },
      { id: 'l4-3', title: 'Dur und Moll', steps: [T('moll'), D('d4-3', 'A-Lage in a-Moll', { layout: 't', t: ['A4', 'B4', 'C5', 'D5', 'E5'], posT: 'A4', patterns: ['qh', 'dot'], bars: 4, tempo: 72 }), Pc('burg-im-nebel')] },
      { id: 'l4-4', title: 'Die Kadenz', steps: [T('kadenz'), Pc('heldenthema')] },
    ],
    boss: 'drachenflug',
  },
  {
    id: 'w5', title: 'Bewegung', level: 'Intermediate II', hint: 0, color: '#0c8599',
    blurb: 'Tonleitern, Daumenuntersatz, D-Dur und Lagenwechsel.',
    lessons: [
      { id: 'l5-1', title: 'Daumenuntersatz', steps: [T('untersatz'), Pc('tonleiter-c'), Pc('tonleiter-c-links'), Pc('aufzug')] },
      { id: 'l5-2', title: 'D-Dur', steps: [T('d-dur'), D('d5-2', 'Blattspiel in D-Dur', { layout: 't', key: 'D', t: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'], patterns: ['qh', 'e'], bars: 4, tempo: 72, stepwise: true }), Pc('sonnenaufgang-d')] },
      { id: 'l5-3', title: 'Lagenwechsel', steps: [T('lagenwechsel'), D('d5-3', 'Großer Tonraum', { layout: 't', t: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'], patterns: ['qh'], bars: 4, tempo: 72 }), Pc('daecher-sprint')] },
    ],
    boss: 'fuer-elise',
  },
  {
    id: 'w6', title: 'Ausdruck', level: 'Intermediate III', hint: 0, color: '#c2255c',
    blurb: 'Synkopen, Walzerbass, Blattspiel-Marathon, längere Stücke.',
    lessons: [
      { id: 'l6-1', title: 'Synkopen', steps: [T('synkope'), D('d6-1', 'Groove lesen', { layout: 't', t: ['A4', 'B4', 'C5', 'D5', 'E5'], patterns: ['sync'], bars: 4, tempo: 76 }), Pc('neon-groove')] },
      { id: 'l6-2', title: 'Walzerbass', steps: [T('walzerbass'), Pc('nordlicht-walzer')] },
      { id: 'l6-3', title: 'Blattspiel-Marathon', steps: [T('blattspiel'), D('d6-3a', 'Beide Hände, C-Dur', { layout: 'both', t: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], b: ['C3', 'F3', 'G3', 'A2', 'E3'], patterns: ['qh', 'e', 'dot'], bars: 8, tempo: 72 }), D('d6-3b', 'Bassschlüssel weit', { layout: 'b', b: ['E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'], patterns: ['qh', 'e'], bars: 8, tempo: 72 }), D('d6-3c', 'G-Dur mit Begleitung', { layout: 'both', key: 'G', t: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'D5'], chordsB: ['G2+B2+D3', 'G2+C3+E3', 'F#2+A2+D3'], patterns: ['qh', 'e'], bars: 8, tempo: 70 })] },
      { id: 'l6-4', title: 'Filmmusik', steps: [Pc('abspann')] },
    ],
    boss: 'ueber-den-wolken',
  },
];

// Wunschstücke: immer spielbar, unabhängig vom Fortschritt
export const FAVORITES = { piano: ['schwanensee'], bass: ['b-schwanensee'] };
export const worldsFor = inst => (inst === 'bass' ? BASS_WORLDS : WORLDS);
export const ALL_THEORY = { ...THEORY, ...BASS_THEORY };
export { BASS_WORLDS };

// Alle Schritte mit IDs (beide Instrumente)
export function allSteps() {
  const out = [];
  for (const w of [...WORLDS, ...BASS_WORLDS]) {
    for (const l of w.lessons) for (const s of l.steps) out.push({ ...s, world: w.id, lesson: l.id });
    out.push({ type: 'piece', id: 'boss-' + w.id, piece: w.boss, boss: true, world: w.id });
  }
  return out;
}

export const LEVEL_TITLES = [
  [1, 'Neuling'], [3, 'Tastenfinder'], [6, 'Notenleser'], [10, 'Melodiker'], [15, 'Akkord-Ass'],
  [20, 'Tastenvirtuose'], [30, 'Klavier-Pro'], [40, 'Konzertmeister'], [50, 'Ultra-God'],
];
