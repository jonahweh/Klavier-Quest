// Gesang: Lehrplan (Stimme finden, Intervalle, Blattsingen, Chor) und Probenmappe.
// Alle Übungsstücke sind Eigenkompositionen. Die Probenmappe füllt sich mit Jonahs Chorstücken.
// voice = eigene Stimme im Bassschlüssel. parts = Chorstimmen (S, A, T, B), partClefs: 'w' = Violinschlüssel mit 8 (Tenor).

const D = (id, title, cfg) => ({ type: 'drill', id, title, cfg: { layout: 'b', ...cfg } });
const T = id => ({ type: 'theory', id: 't-' + id, card: id });
const Pc = id => ({ type: 'piece', id: 'p-' + id, piece: id });
const V = (o) => ({ by: 'Klavier-Quest', ts: [4, 4], style2: 'klassisch', ...o });

export const VOICE_RANGES = {
  bass: { lo: 40, hi: 60, label: 'Bass', roots: 41 },        // E2–C4
  bariton: { lo: 45, hi: 64, label: 'Bariton', roots: 45 },  // A2–E4
  tenor: { lo: 48, hi: 67, label: 'Tenor', roots: 48 },      // C3–G4
};

export const VOICE_THEORY = {
  'v-stimme': {
    title: 'Deine Stimmlage',
    html: `<p>Der <b>Bariton</b> liegt zwischen Bass und Tenor. Bequem singst du ungefähr vom großen A bis zum e¹ (A2–E4), mit Übung auch etwas darüber. Deine Noten stehen im <b>Bassschlüssel</b>, genau wie beim Kontrabass – nur klingt die Stimme so, wie es dasteht.</p>
<p>Im Chor gibt es meist keine eigene Bariton-Stimme. Je nach Stück singst du <b>Bass</b> oder <b>Tenor</b>. Die App lässt dich bei jedem Chorstück wählen. Tenorstimmen stehen oft im Violinschlüssel mit einer kleinen <b>8</b> darunter: Sie klingen eine Oktave tiefer als notiert.</p>`,
    example: { voice: 'A2/h D3/h | G3/h C4/h | E4/w', tempo: 72 }, voice: true,
  },
  'v-atmung': {
    title: 'Atmung & Haltung',
    html: `<p>Gut singen beginnt beim Stehen: Füße hüftbreit, Knie locker, Brustbein leicht angehoben, Schultern unten. Der Kopf balanciert frei, das Kinn zeigt nicht nach oben.</p>
<p>Atme <b>tief in den Bauch und die Flanken</b>, nicht in die Schultern. Beim Singen lässt du die Luft gleichmäßig strömen, als würdest du eine Kerze anblasen, ohne sie auszupusten. Vor jeder Phrase kurz und lautlos einatmen – Atemstellen sind in Chornoten oft mit einem Komma markiert.</p>`,
    example: null,
  },
  'v-ton-halten': {
    title: 'Ton halten',
    html: `<p>Unten im Bildschirm siehst du deine <b>Tonhöhe als Linie</b>. Der farbige Balken ist der Zielton. Bleibt deine Linie im Balken, singst du sauber.</p>
<p>Ein Ton wird gern am Ende zu tief, weil die Luft ausgeht. Denk bei langen Tönen nach vorne und oben, halte die Spannung im Bauch und lass den Ton nicht „fallen“. Kleine Wellen sind in Ordnung – das ist dein natürliches Vibrato.</p>`,
    example: { voice: 'D3/w | E3/w | F3/h E3/h | D3/w', tempo: 66 }, voice: true,
  },
  'v-schritte': {
    title: 'Tonschritte',
    html: `<p>Die meisten Melodien bewegen sich in <b>Schritten</b>: von einem Ton zum nächsten auf der Tonleiter. Das ist ein Ganzton (z. B. C–D) oder ein Halbton (E–F, H–C).</p>
<p>Trick: Stell dir die Tonleiter wie eine Treppe vor und hör den nächsten Ton <b>innerlich</b>, bevor du ihn singst. Mit dem „Ton“-Knopf spielt dir die App jederzeit den Zielton vor.</p>`,
    example: { voice: 'C3/q D3 E3 F3 | G3/h E3/h | C3/w', tempo: 76 }, voice: true,
  },
  'v-intervalle': {
    title: 'Intervalle treffen',
    html: `<p>Bei Sprüngen hilft ein bekanntes Lied als Anker für den Abstand:</p>
<p><b>Kleine Terz</b>: „Kuckuck, Kuckuck“ · <b>Große Terz</b>: „Oh When the Saints“ · <b>Quarte</b>: „O Tannenbaum“ · <b>Quinte</b>: „Morgen kommt der Weihnachtsmann“ · <b>Große Sexte</b>: „My Bonnie“ · <b>Oktave</b>: „Somewhere Over the Rainbow“.</p>
<p>Noch einfacher: Viele Sprünge gehen über die Töne eines <b>Dreiklangs</b> (Grundton, Terz, Quinte, Oktave). Wenn du den Akkord im Ohr hast, findest du die Töne fast von selbst.</p>`,
    example: { voice: 'C3/h E3/h | C3/h G3/h | C3/h C4/h | G3/h C3/h', tempo: 72 }, voice: true,
  },
  'v-solmisation': {
    title: 'Do – Re – Mi',
    html: `<p>Bei der <b>relativen Solmisation</b> heißt der Grundton immer <b>Do</b>, egal in welcher Tonart. Dann folgen Re, Mi, Fa, So, La, Ti, Do. Das Tolle: „So–Do“ fühlt sich in jeder Tonart gleich an.</p>
<p>Für Chorsänger ist das Gold wert: Du merkst dir nicht einzelne Töne, sondern ihre <b>Funktion</b>. Mi ist die Terz und klingt hell, Ti will unbedingt zum Do hinauf, Fa will zum Mi hinunter.</p>`,
    example: { voice: 'D3/q E3 F#3 G3 | A3/q B3 C#4 D4 | A3/h F#3/h | D3/w', tempo: 80 }, voice: true,
  },
  'v-rhythmus': {
    title: 'Rhythmus zuerst',
    html: `<p>Beim Blattsingen ist der Rhythmus wichtiger als jeder einzelne Ton. Ein guter Ablauf: <b>1.</b> Tonart und Takt anschauen. <b>2.</b> Den Rhythmus auf „ta“ sprechen und dabei leise den Takt klopfen. <b>3.</b> Erst dann singen.</p>
<p>Lieber einen Ton ungenau, aber im Takt – dann findest du sofort wieder rein. Wer anhält, verliert den Chor.</p>`,
    example: { voice: 'G3/q. G3/e E3/q E3 | D3/e E3 F3 G3 A3/h | G3/w', tempo: 80 }, voice: true,
  },
  'v-einsatz': {
    title: 'Einsätze finden',
    html: `<p>Im Chor hast du oft Pausen, während andere singen oder das Klavier spielt. Zähl die Takte mit („<b>1</b>-2-3-4, <b>2</b>-2-3-4 …“) und atme rechtzeitig vor dem Einsatz.</p>
<p>Deinen ersten Ton holst du dir aus der Begleitung: Oft spielt das Klavier ihn kurz vorher, oder er ist ein Ton des Akkords. In den Chorstücken kannst du mit „Ton“ jederzeit den Einsatzton hören.</p>`,
    example: null,
  },
  'v-chor': {
    title: 'Die eigene Stimme halten',
    html: `<p>Allein singst du sicher – aber im Chor ziehen die anderen Stimmen an dir. Übe in drei Stufen mit dem <b>Stimmen-Mixer</b>:</p>
<p><b>1.</b> „Anhören“: Deine Stimme laut, die anderen leise. <b>2.</b> „Mitsingen“: Die anderen laufen, du singst deine Stimme dazu. <b>3.</b> Rhythmus-Modus: Die App hört zu und bewertet dich, während der Chor um dich herum singt.</p>
<p>Tipp: Kopfhörer auf, damit das Mikrofon nur dich hört.</p>`,
    example: null,
  },
  'v-probe': {
    title: 'Perfekt vorbereitet zur Probe',
    html: `<p>So gehst du jedes neue Stück an:</p>
<p><b>1.</b> Einmal komplett anhören und mitlesen. <b>2.</b> Schwierige Stellen als <b>Takt-Schleife</b>, erst langsam, dann mit Tempo-Steigerung. <b>3.</b> Mit dem Chor mitsingen, die anderen Stimmen nach und nach leiser drehen. <b>4.</b> Eine <b>Aufnahme</b> machen und anhören. <b>5.</b> In der Schwachstellen-Statistik prüfen, welche Töne noch wackeln.</p>
<p>Vor der Probe: 5 Minuten einsingen. Dann bist du stimmlich warm und kannst sofort voll mitmachen.</p>`,
    example: null,
  },
};

const STEP = ['C3', 'D3', 'E3', 'F3', 'G3'];
export const VOICE_PIECES = {
  'v-summton': V({ title: 'Summton', style: 'Übung', tempo: 60, key: 'C', voice: 'C3/w | D3/w | E3/w | D3/w | C3/h E3/h | G3/w | E3/h D3/h | C3/w', chords: 'C | G | C | G | C | C | C G | C' }),
  'v-stufen': V({ title: 'Stufen', style: 'Übung', tempo: 72, key: 'C', voice: 'C3/q D3 E3 F3 | G3/h G3 | F3/q E3 D3 E3 | C3/w | E3/q F3 G3 A3 | G3/h E3 | D3/q E3 D3 B2 | C3/w', chords: 'C | C | G | C | C | C | G | C' }),
  'v-bogen': V({ title: 'Großer Bogen', style: 'Lied', tempo: 66, key: 'F', voice: 'F3/h A3 | C4/w | Bb3/h G3 | A3/w | C4/h A3 | F3/h D3 | E3/h G3 | F3/w', chords: 'F | F | Gm | F | F | Dm | C | F' }),
  'v-erstes-lied': V({ title: 'Erstes Lied', style: 'Lied', tempo: 80, key: 'G', voice: 'D3/q G3 B3 A3 | G3/h D3 | E3/q G3 F#3 E3 | D3/w | D3/q G3 B3 D4 | C4/q A3 F#3 A3 | G3/q B3 A3 F#3 | G3/w', chords: 'G | G | Em D | D | G | Am D | G D | G' }),
  'v-do-re-mi': V({ title: 'Do – Re – Mi', style: 'Übung', tempo: 76, key: 'D', voice: 'D3/q E3 F#3 D3 | A3/h F#3 | G3/q F#3 E3 G3 | F#3/h D3 | B3/q A3 G3 F#3 | E3/q F#3 G3 E3 | A3/q G3 F#3 E3 | D3/w', chords: 'D | D | A | D | G | A | A | D' }),
  'v-sprungbrett': V({ title: 'Sprungbrett', style: 'Übung', tempo: 76, key: 'C', voice: 'C3/h G3 | E3/h C3 | F3/h A3 | G3/w | C3/q E3 G3 C4 | B3/h G3 | D3/h G3 | C3/w', chords: 'C | C | F | G | C | G | G | C' }),
  'v-einsatz-walzer': V({ title: 'Einsatz-Walzer', style: 'Lied', tempo: 104, key: 'F', ts: [3, 4], style2: 'waltz', voice: 'r/h. | r/h. | C3/h F3/q | A3/h. | G3/q F3 E3 | F3/h. | r/h. | r/q A3 Bb3 | C4/h A3/q | F3/h. | G3/q A3 G3 | F3/h.', chords: 'F | C | F | F | C | F | C | F | F | Dm | C | F' }),
  'v-blatt-boss': V({ title: 'Vom Blatt', style: 'Pop', tempo: 88, key: 'G', style2: 'straight', voice: 'B2/q D3 G3/h | A3/q G3 F#3/h | E3/e F#3 G3 E3 C3/h | D3/w | B2/q D3 G3 B3 | A3/q. G3/e E3/h | C3/e E3 D3 C3 A2/q D3 | G2/w', chords: 'G | D | C | D | G | Am C | Am D | G' }),
  // Chor a cappella, vier Stimmen
  'v-choral-g': V({
    title: 'Choral in G', style: 'Chor a cappella', tempo: 72, key: 'G', partClefs: { S: 't', A: 't', T: 'w', B: 'v' }, parts: {
      S: 'B4/h C5 | A4/h B4 | B4/h C5 | A4/w | D5/h B4 | C5/h A4 | B4/h A4 | G4/w',
      A: 'G4/h G4 | F#4/h G4 | G4/h G4 | F#4/w | G4/h G4 | A4/h F#4 | G4/h F#4 | D4/w',
      T: 'D5/h E5 | D5/h D5 | E5/h E5 | D5/w | B4/h E5 | E5/h D5 | D5/h C5 | B4/w',
      B: 'G3/h C3 | D3/h G2 | E3/h C3 | D3/w | G3/h E3 | A2/h D3 | B2/h D3 | G2/w',
    },
  }),
  // Chor mit Klavier
  'v-abendruhe': V({
    title: 'Abendruhe', style: 'Chor mit Klavier', tempo: 76, key: 'F', partClefs: { S: 't', A: 't', T: 'w', B: 'v' }, parts: {
      S: 'A4/q G4 F4 A4 | Bb4/h A4 | G4/q A4 Bb4 G4 | A4/w | A4/q Bb4 C5 A4 | Bb4/h C5 | A4/h G4 | F4/w',
      A: 'F4/h F4 | F4/h F4 | D4/h E4 | F4/w | F4/h F4 | F4/h E4 | F4/h E4 | C4/w',
      T: 'C5/w | D5/h C5 | Bb4/h C5 | C5/w | D5/w | D5/h C5 | C5/h Bb4 | A4/w',
      B: 'F3/w | Bb2/h F3 | G2/h C3 | F3/w | D3/w | Bb2/h C3 | C3/w | F2/w',
    },
    rh: 'A3+C4+F4/h A3+C4+F4 | Bb3+D4+F4/h A3+C4+F4 | Bb3+D4+G4/h Bb3+C4+E4 | A3+C4+F4/w | A3+D4+F4/h A3+D4+F4 | Bb3+D4+F4/h G3+C4+E4 | A3+C4+F4/h Bb3+C4+E4 | A3+C4+F4/w',
    lh: 'F2/h C3 | Bb2/h F2 | G2/h C3 | F2/h C3 | D3/h A2 | Bb2/h C3 | C3/h C3 | F2/w',
  }),
};

export const VOICE_WORLDS = [
  {
    id: 'vw1', title: 'Stimme finden', level: 'Beginner I', hint: 2, color: '#3d7bfd',
    blurb: 'Stimmlage, Atmung, Töne halten und Tonschritte.',
    lessons: [
      { id: 'vl1-1', title: 'Deine Stimmlage', steps: [T('v-stimme'), T('v-atmung'), D('vd1-1', 'Lange Töne', { b: STEP, patterns: ['qhw'], bars: 4, tempo: 60, stepwise: true }), Pc('v-summton')] },
      { id: 'vl1-2', title: 'Tonschritte', steps: [T('v-schritte'), D('vd1-2', 'Schritte in C-Dur', { b: STEP, patterns: ['qh'], bars: 4, tempo: 66, stepwise: true }), Pc('v-stufen')] },
      { id: 'vl1-3', title: 'Ton halten', steps: [T('v-ton-halten'), Pc('v-bogen')] },
    ],
    boss: 'v-erstes-lied',
  },
  {
    id: 'vw2', title: 'Intervalle', level: 'Beginner II', hint: 1, color: '#11a36a',
    blurb: 'Terzen, Quinten, Oktaven und Do-Re-Mi.',
    lessons: [
      { id: 'vl2-1', title: 'Terzen', steps: [T('v-intervalle'), D('vd2-1', 'Dreiklangstöne', { b: ['C3', 'E3', 'G3', 'D3', 'F3', 'A3'], patterns: ['qh'], bars: 4, tempo: 63 })] },
      { id: 'vl2-2', title: 'Quinte & Oktave', steps: [D('vd2-2', 'Große Sprünge', { b: ['G2', 'C3', 'D3', 'G3', 'C4'], patterns: ['qh'], bars: 4, tempo: 60 })] },
      { id: 'vl2-3', title: 'Solmisation', steps: [T('v-solmisation'), Pc('v-do-re-mi')] },
    ],
    boss: 'v-sprungbrett',
  },
  {
    id: 'vw3', title: 'Blattsingen', level: 'Beginner III', hint: 0, color: '#e8590c',
    blurb: 'Rhythmus lesen, Tonarten, Einsätze nach Pausen.',
    lessons: [
      { id: 'vl3-1', title: 'Rhythmus zuerst', steps: [T('v-rhythmus'), D('vd3-1', 'Achtel und Punktierungen', { b: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3'], patterns: ['e', 'dot'], bars: 4, tempo: 72, stepwise: true })] },
      { id: 'vl3-2', title: 'G-Dur & F-Dur', steps: [D('vd3-2a', 'Blattsingen in G-Dur', { key: 'G', b: ['B2', 'C3', 'D3', 'E3', 'F#3', 'G3', 'A3'], patterns: ['qh', 'e'], bars: 4, tempo: 72, stepwise: true }), D('vd3-2b', 'Blattsingen in F-Dur', { key: 'F', b: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'Bb3'], patterns: ['qh', 'dot'], bars: 4, tempo: 72, stepwise: true })] },
      { id: 'vl3-3', title: 'Einsätze', steps: [T('v-einsatz'), Pc('v-einsatz-walzer')] },
    ],
    boss: 'v-blatt-boss',
  },
  {
    id: 'vw4', title: 'Chor', level: 'Intermediate', hint: 0, color: '#9c36b5',
    blurb: 'Die eigene Stimme im Chor halten, Probenvorbereitung.',
    lessons: [
      { id: 'vl4-1', title: 'Eigene Stimme', steps: [T('v-chor'), Pc('v-choral-g')] },
      { id: 'vl4-2', title: 'Probe vorbereiten', steps: [T('v-probe')] },
    ],
    boss: 'v-abendruhe',
  },
];

// Probenmappe: Chorstücke nach Ordner. folder: 'musical' | 'schule'
export const CHOIR_FOLDERS = [
  { id: 'musical', title: 'Musical · Mysterious Worlds', blurb: 'Deine Stücke fürs Musical, in Probenreihenfolge.' },
  { id: 'schule', title: 'Schulchor', blurb: 'Aktuelle Stücke aus dem Schulchor.' },
];
export const CHOIR_PIECES = {};
