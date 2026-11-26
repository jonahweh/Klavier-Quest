// Pro- und Ultra-God-Welten für Klavier und Kontrabass.
// Alle Stücke sind Eigenkompositionen (Klavier-Quest). Probespiel-Etüden sind im Stil der Klassik geschrieben,
// echte Orchesterstellen kannst du über „Eigene Stücke“ selbst eintragen.

const D = (id, title, cfg) => ({ type: 'drill', id, title, cfg });
const T = id => ({ type: 'theory', id: 't-' + id, card: id });
const Pc = id => ({ type: 'piece', id: 'p-' + id, piece: id });
const KQ = 'Klavier-Quest';

// ================= Klavier =================
export const PRO_THEORY = {
  'umkehrung': {
    title: 'Umkehrungen',
    html: `<p>Ein Dreiklang muss nicht immer mit dem Grundton unten stehen. Legst du den tiefsten Ton eine Oktave nach oben, entsteht die <b>1. Umkehrung</b> (Sextakkord), noch einmal und du hast die <b>2. Umkehrung</b> (Quartsextakkord). C-Dur bleibt C-Dur: C–E–G, E–G–C oder G–C–E.</p>
<p>Erkennungstrick: In der Grundstellung liegen alle drei Töne auf Linien <em>oder</em> alle in Zwischenräumen (wie ein Schneemann). Bei einer Umkehrung siehst du eine <b>Quarte</b> – zwei Töne mit einer Lücke dazwischen. Der obere Ton dieser Quarte ist der Grundton.</p>`,
    example: { rh: 'C4+E4+G4/h E4+G4+C5/h | G4+C5+E5/w', tempo: 70 },
  },
  'stimmfuehrung': {
    title: 'Kurze Wege',
    html: `<p>Profis springen nicht mit der ganzen Hand von Akkord zu Akkord. Sie wählen die Umkehrung, bei der sich die Finger <b>möglichst wenig bewegen</b>. Gemeinsame Töne bleiben liegen, die anderen rutschen zum nächstgelegenen Ton.</p>
<p>C-Dur → F-Dur: Das C bleibt, E geht einen Halbton hoch zum F, G einen Ganzton hoch zum A. Heraus kommt F-Dur in der 2. Umkehrung (C–F–A) – ohne Sprung. So klingen Begleitungen ruhig und verbunden, und du hast die Hand frei für die Melodie.</p>`,
    example: { rh: 'C4+E4+G4/h C4+F4+A4/h | B3+D4+G4/h C4+E4+G4/h', lh: 'C3/h F2/h | G2/h C3/h', tempo: 66 },
  },
  'pop-begleitung': {
    title: 'Pop-Begleitung',
    html: `<p>Unzählige Popsongs benutzen nur vier Akkorde: <b>I – V – vi – IV</b>, in C-Dur also C – G – a-Moll – F. Die linke Hand spielt den Grundton (gern als Oktave oder gebrochen), die rechte die Akkorde in kurzen Wegen.</p>
<p>Für den Groove kommt es auf den Rhythmus an: Ein typisches Pop-Pattern ist <b>3 + 3 + 2</b> Achtel (punktierte Viertel, punktierte Viertel, Viertel). Probier das in der Jam-Session aus – dort läuft die Begleitband mit.</p>`,
    example: { rh: 'E4+G4+C5/q. E4+G4+C5/q. E4+G4+C5/q | D4+G4+B4/q. D4+G4+B4/q. D4+G4+B4/q', lh: 'C3/w | G2/w', tempo: 84 },
  },
  'improvisation': {
    title: 'Improvisieren',
    html: `<p>Improvisieren heißt nicht, wild auf die Tasten zu hauen. Starte mit nur <b>fünf Tönen</b>: der Pentatonik. In a-Moll sind das A – C – D – E – G. Über a-Moll, F, C und G klingt jeder dieser Töne gut – es gibt keine falschen Noten.</p>
<p>Drei Regeln für den Anfang: <b>1.</b> Wenige Töne, viel Rhythmus. <b>2.</b> Spiel eine kleine Idee und wiederhole sie leicht verändert („Frage und Antwort“). <b>3.</b> Lass Pausen – sie machen ein Solo erst spannend.</p>
<p>In der Jam-Session spielt eine Band mit, und du kannst frei drauflos spielen. Die App zeigt dir, welche Töne zum aktuellen Akkord passen.</p>`,
    example: { rh: 'A4/e C5 D5/q E5/e D5 C5/q | A4/q. G4/e A4/h', lh: 'A2/w | A2/w', tempo: 88 },
    jam: true,
  },
  'sechzehntel': {
    title: 'Sechzehntel',
    html: `<p>Eine <b>Sechzehntelnote</b> hat zwei Fähnchen bzw. zwei Balken und dauert einen Viertelschlag. Vier Sechzehntel passen in eine Viertel. Zählen: „1-e-und-e, 2-e-und-e“.</p>
<p>Schnelle Läufe lernt man langsam: Stell das Tempo auf 60 %, aktiviere die <b>Schleife</b> mit Tempo-Steigerung und lass die App nach jedem fehlerfreien Durchlauf 5 % schneller werden. Die Finger bleiben nah an den Tasten, die Bewegung kommt aus den Fingern, nicht aus dem Arm.</p>`,
    example: { rh: 'C4/s D4 E4 F4 G4/q G4/s F4 E4 D4 C4/q', tempo: 66 },
  },
  'virtuos': {
    title: 'Ultra-God-Modus',
    html: `<p>Auf dem höchsten Level geht es nicht um mehr Noten, sondern um <b>Kontrolle</b>: gleichmäßige Läufe, klare Melodie über leiser Begleitung, sicheres Blattspiel in allen Tonarten.</p>
<p>So üben Profis schwierige Stücke: <b>1.</b> Hände einzeln, langsam. <b>2.</b> Die schwerste Stelle zuerst, als Takt-Schleife. <b>3.</b> Zusammen im Warte-Modus. <b>4.</b> Rhythmus-Modus mit 70 %, dann steigern. Die Fehlerstatistik zeigt dir, welche Töne noch wackeln.</p>`,
    example: null,
  },
};

export const PRO_PIECES = {
  'pop-ballade': {
    title: 'Vier Akkorde', by: KQ, style: 'Pop', tempo: 76, key: 'C', ts: [4, 4],
    rh: 'E5:3/q. D5:2/e C5:1/q E5:3 | D5:2/h. B4:1/q | C5:2/q. B4:1/e A4:1/q C5:2 | A4:1/h. r/q | E5:3/q. D5:2/e C5:1/q G5:5 | G5:5/q. F5:4/e D5:2/h | C5:1/q A4:1 C5:2 F5:5 | E5:4/w',
    lh: 'C3:5/e G3:2 C4:1 G3:2 C3:5 G3:2 C4:1 G3:2 | G2:5/e D3:2 G3:1 D3:2 G2:5 D3:2 G3:1 D3:2 | A2:5/e E3:2 A3:1 E3:2 A2:5 E3:2 A3:1 E3:2 | F2:5/e C3:2 F3:1 C3:2 F2:5 C3:2 F3:1 C3:2 | C3:5/e G3:2 C4:1 G3:2 C3:5 G3:2 C4:1 G3:2 | G2:5/e D3:2 G3:1 D3:2 G2:5 D3:2 G3:1 D3:2 | F2:5/e C3:2 F3:1 C3:2 F2:5 C3:2 F3:1 C3:2 | C3+G3+C4:5,2,1/w',
  },
  'umkehr-choral': {
    title: 'Choral der kurzen Wege', by: KQ, style: 'Choral', tempo: 66, key: 'G', ts: [4, 4],
    rh: 'B3+D4+G4:1,2,5/h C4+E4+G4:1,3,5/h | C4+D4+F#4:1,2,4/h B3+D4+G4:1,2,5/h | B3+E4+G4:1,3,5/h C4+E4+A4:1,3,5/h | C4+D4+F#4:1,2,4/w | B3+D4+G4:1,2,5/h B3+E4+G4:1,3,5/h | C4+E4+A4:1,3,5/h D4+F#4+A4:1,3,5/h | B3+D4+G4:1,2,5/h C4+D4+F#4:1,2,4/h | B3+D4+G4:1,2,5/w',
    lh: 'G2/h C3/h | D3/h G2/h | E2/h A2/h | D3/w | G2/h E2/h | A2/h D3/h | G2/h D3/h | G2/w',
  },
  'pop-groove': {
    title: 'Stadtlichter', by: KQ, style: 'Pop', tempo: 92, key: 'C', ts: [4, 4],
    rh: 'A4+C5+E5/e r/e A4+C5+E5/q r/e A4+C5+E5/e r/q | A4+C5+F5/e r/e A4+C5+F5/q r/e A4+C5+F5/e r/q | G4+C5+E5/e r/e G4+C5+E5/q r/e G4+C5+E5/e r/q | G4+B4+D5/e r/e G4+B4+D5/q r/e G4+B4+D5/e r/q | E5/e E5 r/e D5 C5/q A4 | C5/e C5 r/e A4 F5/q E5 | E5/e D5 r/e C5 G5/q E5 | D5/h. r/q',
    lh: 'A2/q. A2/e A2/h | F2/q. F2/e F2/h | C3/q. C3/e C3/h | G2/q. G2/e G2/h | A2/q. A2/e A2/h | F2/q. F2/e F2/h | C3/q. C3/e C3/h | G2/q. G2/e G2/h',
  },
  'stadionhymne': {
    title: 'Stadionhymne', by: KQ, style: 'Pop', tempo: 84, key: 'D', ts: [4, 4],
    rh: 'F#4:1/q A4:2 D5:4 A4:2 | B4:3/h. A4:2/q | G4:1/q B4:2 E5:5 D5:4 | C#5:3/h A4:1/h | F#4:1/q A4:2 D5:4 F#5:5 | E5:4/q. D5:3/e B4:1/h | G4:1/q B4:2 D5:4 C#5:3 | D5:4/w',
    lh: 'D3:5/q A3:2 D4:1 A3:2 | B2:5/q F#3:2 B3:1 F#3:2 | G2:5/q D3:2 G3:1 D3:2 | A2:5/q E3:2 A3:1 E3:2 | D3:5/q A3:2 D4:1 A3:2 | E3:5/q B3:2 E4:1 B3:2 | G2:5/q D3:2 A2:4 E3:1 | D3+A3+D4:5,2,1/w',
  },
  'toccata-neon': {
    title: 'Neon-Toccata', by: KQ, style: 'Konzertstück', tempo: 76, key: 'C', ts: [4, 4],
    rh: 'A4:1/s E5 C5 E5 A4 E5 C5 E5 A4 E5 C5 E5 A4 E5 C5 E5 | A4:1 F5 C5 F5 A4 F5 C5 F5 A4 F5 C5 F5 A4 F5 C5 F5 | B4:1 G5 D5 G5 B4 G5 D5 G5 B4 G5 D5 G5 B4 G5 D5 G5 | G#4:1 E5 B4 E5 G#4 E5 B4 E5 G#4 B4 D5 E5 G#5/q | C5:1/s A5 E5 A5 C5 A5 E5 A5 B4 G5 D5 G5 B4 G5 D5 G5 | A4:1 F5 C5 F5 A4 F5 C5 F5 G#4 E5 B4 E5 G#4 E5 B4 E5 | A4:1 C5 E5 A5 E5 C5 A4 E4 D5 F5 A5 F5 B4 D5 G#5 E5 | A5:5/h A4+C5+E5+A5/h',
    lh: 'A2:5/q A3:1 A2:5 A3:1 | F2:5/q F3:1 F2:5 F3:1 | G2:5/q G3:1 G2:5 G3:1 | E2:5/q E3:1 E2:5 E3:1 | A2:5/h G2:5/h | F2:5/h E2:5/h | A2:5/h D3:2/q E3:1 | A2+A3:5,1/w',
  },
  'nocturne-es': {
    title: 'Nachtstück in Es', by: KQ, style: 'Konzertstück', tempo: 60, key: 'Eb', ts: [4, 4],
    rh: 'G5:5/h. F5:4/e Eb5:3/e | Eb5:3/q. C5:2/e Ab4:1/h | D5:2/t Eb5:3 F5:4 Ab5:5/q. G5:4/e F5:3/q | G5:4/h Eb5:2/h | Eb5:2/q. D5:1/e C5:1/q G5:5 | Ab5:5/q. G5:4/e F5:3/q Eb5:2 | D5:1/t Eb5:2 F5:3 Bb5:5/q. Ab5:4/e D5:1/q | Eb5:2/w',
    lh: 'Eb2:5/e Bb2:3 G3:1 Bb2:3 Eb3:2 Bb2:3 G3:1 Bb2:3 | Ab2:5/e Eb3:3 C4:1 Eb3:3 Ab3:2 Eb3:3 C4:1 Eb3:3 | Bb2:5/e F3:3 Ab3:2 F3:3 D3:4 F3:3 Ab3:2 F3:3 | Eb2:5/e Bb2:3 G3:1 Bb2:3 Eb3:2 Bb2:3 G3:1 Bb2:3 | C3:5/e G3:3 Eb4:1 G3:3 C4:2 G3:3 Eb4:1 G3:3 | F2:5/e C3:3 Ab3:1 C3:3 F3:2 C3:3 Ab3:1 C3:3 | Bb2:5/e F3:3 D4:1 F3:3 Ab3:2 F3:3 D4:1 F3:3 | Eb2+Bb2+G3:5,2,1/w',
  },
  'ultra-finale': {
    title: 'Endgegner', by: KQ, style: 'Konzertstück', tempo: 80, key: 'F', ts: [4, 4],
    rh: 'D5:1/e F5 A5 F5 D5/s E5 F5 G5 A5/q | Bb5:5/e A5 G5 F5 E5/s F5 G5 E5 D5/q | G5:3/e Bb5 D5 G5 A5/s G5 F5 E5 F5/q | E5:3/e C#5 A4 C#5 E5/h | D5:1/s E5 F5 G5 A5 G5 F5 E5 D5/s F5 A5 D6 A5/q | G5:5/s A5 Bb5 A5 G5 F5 E5 D5 Bb4/q G4/q | A4:1/e C#5 E5 G5 A5/s G5 F5 E5 C#5/q | D5:5/h D4+F4+A4+D5/h',
    lh: 'D3:1/q A2:5 D3:1 A2:5 | Bb2:1/q F2:5 Bb2:1 F2:5 | G2:5/q D3:1 G2:5 D3:1 | A2:5/q E3:2 A2:5 C#3:3 | D3:1/q A2:5 F3:1 D3:3 | G2:5/q Bb2:3 D3:1 G2:5 | A2:5/q C#3:3 E3:1 A2:5 | D2+D3:5,1/w',
  },
};

export const PRO_WORLDS = [
  {
    id: 'w7', title: 'Pop & Umkehrungen', level: 'Pro', hint: 0, color: '#f08c00',
    blurb: 'Umkehrungen, kurze Wege, Pop-Begleitung und erste Improvisation.',
    lessons: [
      { id: 'l7-1', title: 'Umkehrungen', steps: [T('umkehrung'), D('d7-1', 'Melodie über Umkehrungen', { layout: 'both', t: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'], chordsB: ['C3+E3+G3', 'C3+F3+A3', 'B2+D3+G3', 'C3+E3+A3'], posT: 'C4', patterns: ['qh', 'e'], bars: 4, tempo: 68 }), Pc('umkehr-choral')] },
      { id: 'l7-2', title: 'Kurze Wege', steps: [T('stimmfuehrung'), D('d7-2', 'G-Dur mit Umkehrungen', { layout: 'both', key: 'G', t: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'D5'], chordsB: ['B2+D3+G3', 'C3+E3+G3', 'C3+D3+F#3', 'B2+E3+G3'], patterns: ['qh', 'e', 'dot'], bars: 8, tempo: 70 })] },
      { id: 'l7-3', title: 'Pop-Begleitung', steps: [T('pop-begleitung'), Pc('pop-ballade'), Pc('pop-groove')] },
      { id: 'l7-4', title: 'Improvisieren', steps: [T('improvisation')] },
    ],
    boss: 'stadionhymne',
  },
  {
    id: 'w8', title: 'Ultra-God', level: 'Ultra-God', hint: 0, color: '#5f3dc4',
    blurb: 'Sechzehntel, Konzertstücke, Blattspiel in allen Tonarten.',
    lessons: [
      { id: 'l8-1', title: 'Sechzehntel', steps: [T('sechzehntel'), D('d8-1', 'Sechzehntel-Läufe', { layout: 't', t: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], patterns: ['s16'], bars: 4, tempo: 60, stepwise: true }), Pc('toccata-neon')] },
      { id: 'l8-2', title: 'Kantilene', steps: [T('virtuos'), Pc('nocturne-es')] },
      { id: 'l8-3', title: 'Blattspiel-Olymp', steps: [D('d8-3a', 'Es-Dur, beide Hände', { layout: 'both', key: 'Eb', t: ['Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5', 'D5', 'Eb5'], chordsB: ['Eb3+G3+Bb3', 'Ab2+C3+Eb3', 'Bb2+D3+F3'], patterns: ['qh', 'e', 'dot'], bars: 8, tempo: 72 }), D('d8-3b', 'A-Dur, beide Hände', { layout: 'both', key: 'A', t: ['E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D5', 'E5'], chordsB: ['A2+C#3+E3', 'A2+D3+F#3', 'G#2+B2+E3'], patterns: ['qh', 'e', 'sync'], bars: 8, tempo: 72 }), D('d8-3c', 'E-Dur, Sechzehntel', { layout: 't', key: 'E', t: ['E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5', 'E5'], patterns: ['s16', 'dot'], bars: 8, tempo: 60, stepwise: true })] },
    ],
    boss: 'ultra-finale',
  },
];

// ================= Kontrabass =================
// Notiert eine Oktave höher als klingend. clefs: { lh: 't' } = Violinschlüssel für hohe Lagen.
const B = (o) => ({ by: KQ, ts: [4, 4], ...o });
const HI = { clefs: { lh: 't' } };

export const PRO_BASS_THEORY = {
  'b-daumen': {
    title: 'Daumenlage',
    html: `<p>Ab der Mitte der Saite – dort, wo das <b>Oktav-Flageolett</b> liegt – reicht der Arm nicht mehr um den Hals herum. Jetzt kommt der <b>Daumen</b> aufs Griffbrett: Er liegt quer über einer oder zwei Saiten und dient als beweglicher Sattel.</p>
<p>Auf der G-Saite liegt der Daumen auf dem hohen G, dann folgen <b>1</b> (A), <b>2</b> (H) und <b>3</b> (C). Der dritte Finger, der unten nie benutzt wird, ist hier oben fest dabei, weil die Abstände kleiner sind. Das Zeichen für den Daumen ist ein <b>Kreis mit Strich</b>.</p>
<p>Hohe Stellen stehen im <b>Violinschlüssel</b> – sie klingen wie alles beim Kontrabass eine Oktave tiefer als notiert.</p>`,
    example: { lh: 'G4/q A4 B4 C5 | B4/q A4 G4/h', tempo: 66 }, bass: true, maxPos: 17, ...HI,
  },
  'b-flageolett': {
    title: 'Orientierung oben',
    html: `<p>Das Oktav-Flageolett ist dein Kompass: Berühr die Saite genau in der Mitte nur leicht – es klingt die Oktave der leeren Saite, glockenklar. Genau hier sitzt der Daumen in der Grundstellung der Daumenlage.</p>
<p>Prüfe die Lage immer wieder, indem du den Daumenton kurz mit dem Flageolett vergleichst. Das Stimmgerät hilft: Bleib im grünen Bereich, bevor du weiterspielst. In den hohen Lagen sind die Abstände winzig – schon ein paar Millimeter sind ein Viertelton.</p>`,
    example: { lh: 'D4/h G4/h | D4/q E4 F#4 G4 | A4/w', tempo: 60 }, bass: true, maxPos: 17, ...HI,
  },
  'b-solo': {
    title: 'Solo spielen',
    html: `<p>Im Solo wird der Kontrabass zur Stimme. Drei Dinge machen den Unterschied: ein <b>langer, gleichmäßiger Bogen</b> mit viel Haar, ein ruhiges <b>Vibrato</b> aus dem Unterarm und <b>Lagenwechsel, die man nicht hört</b> (der Finger gleitet leicht, der Bogen bleibt in Bewegung).</p>
<p>Denk in Phrasen, nicht in Noten: Wohin will die Melodie? Meist zum längsten oder höchsten Ton. Dorthin wird es lauter, danach entspannt sich die Linie.</p>`,
    example: null,
  },
  'b-impro': {
    title: 'Improvisieren am Bass',
    html: `<p>Ein Bass-Solo baut auf dem auf, was du schon kannst: <b>Grundton, Terz, Quinte</b> und die chromatische Annäherung aus dem Walking Bass. Statt Vierteln spielst du jetzt freie Rhythmen, Pausen und kleine Motive.</p>
<p>Trick für den Anfang: Spiel eine Walking-Line und ersetze jeden dritten Takt durch ein kurzes Motiv mit Achteln. So bleibt die Form klar, und das Solo entsteht wie von selbst. In der Jam-Session läuft die Band, und du kannst ohne Noten ausprobieren.</p>`,
    example: { lh: 'F2/q A2 C3 Eb3 | D3/e C3 r/e A2 Bb2/h', chords: 'F7 | Bb7', tempo: 100 }, bass: true,
    jam: true,
  },
  'b-probespiel': {
    title: 'Probespiel',
    html: `<p>Wer in ein Orchester will, muss beim <b>Probespiel</b> Orchesterstellen vorspielen. Klassiker auf der Liste sind Mozart (Sinfonien 35, 39, 40), Beethoven (5. und 9. Sinfonie), Brahms (2. Sinfonie), Verdi (Otello), Mahler und Richard Strauss.</p>
<p>Die Stücke dieser Welt sind <b>Etüden im Stil</b> solcher Stellen: schnelle, saubere Achtel und Sechzehntel wie bei Mozart, eine große Kantilene wie bei Brahms, ein freies Rezitativ wie in Beethovens Neunter. Echte Stellen aus deinen Noten kannst du über <b>Eigene Stücke</b> eintragen.</p>
<p>Juroren achten vor allem auf drei Dinge: Rhythmus, Intonation und Klang. Genau das misst die App auch.</p>`,
    example: null,
  },
  'b-sechzehntel': {
    title: 'Schnelle Noten',
    html: `<p>Bei schnellen Passagen kommt der Rhythmus aus dem <b>Bogen</b>: kurze Striche in der Mitte des Bogens, die linke Hand ist eine Spur früher dran als der Bogen.</p>
<p>Übe mit der Takt-Schleife: zuerst 60 % Tempo, dann nach jedem sauberen Durchlauf 5 % schneller. Gruppiere im Kopf immer vier Sechzehntel zu einem Schlag – dann bleibt der Puls stabil, auch wenn die Finger fliegen.</p>`,
    example: { lh: 'D3/s E3 F#3 G3 A3/q A3/s G3 F#3 E3 D3/q', tempo: 72 }, bass: true,
  },
};

export const PRO_BASS_PIECES = {
  'b-daumen-etude': B({
    title: 'Erste Daumenlage', style: 'Etüde', tempo: 63, key: 'G', tech: 'arco', style2: 'klassisch', ...HI,
    lh: 'G4/q A4 B4 C5 | B4/h G4/h | A4/q B4 C5 B4 | A4/h D4/h | G4/q B4 A4 C5 | B4/q A4 G4 A4 | B4/q. A4/e G4/q F#4 | G4/w',
    chords: 'G | G | Am | D | G Am | G | G D | G',
  }),
  'b-kantilene': B({
    title: 'Kantilene', style: 'Solo', tempo: 58, key: 'D', tech: 'arco', style2: 'klassisch', ...HI,
    lh: 'A4/h. F#4/q | D5/q. C#5/e B4/h | A4/q G4 F#4 E4 | F#4/w | A4/h. D5/q | E5/q. D5/e C#5/h | B4/q A4 G4 E4 | D4/w',
    chords: 'D | Bm | A | D | D | A | G A | D',
  }),
  'b-blues-solo': B({
    title: 'Blues-Solo in F', style: 'Jazz', tempo: 108, key: 'F', tech: 'pizz', style2: 'swing',
    lh: 'F2/q A2 C3 Eb3 | Bb2/q D3 F3 Ab3 | F3/q Eb3 C3 A2 | F2/q G2 Ab2 A2 | Bb2/q D3 F3 D3 | Bb2/q Ab2 G2 E2 | F2/q A2 C3 A2 | D3/q C3 A2 Ab2 | G2/q Bb2 D3 G3 | C3/q E3 G3 Bb3 | F3/q D3 G2 C3 | F2/h r/h',
    chords: 'F7 | Bb7 | F7 | F7 | Bb7 | Bb7 | F7 | D7 | Gm7 | C7 | F7 C7 | F7',
  }),
  'b-gipfelsturm': B({
    title: 'Gipfelsturm', style: 'Solo', tempo: 76, key: 'G', tech: 'arco', style2: 'straight', ...HI,
    lh: 'E4/e F#4 G4 A4 B4/q E5 | D5/e C5 B4 A4 B4/h | C5/e B4 A4 G4 F#4/q B4 | E4/h. r/q | E4/e G4 B4 E5 D5/q B4 | C5/e E5 D5 C5 B4/h | A4/e C5 B4 A4 G4/q F#4 | E4/w',
    chords: 'Em | Am Em | Am B7 | Em | Em | Am Em | Am B7 | Em',
  }),
  'b-probe-klassik': B({
    title: 'Probespiel-Etüde: Klassik', by: 'Klavier-Quest · im Stil Mozarts', style: 'Klassik', tempo: 92, key: 'D', tech: 'arco', style2: 'klassisch',
    lh: 'D3/e D3 F#3 F#3 A3 A3 D4 D4 | C#4/e A3 E3 A3 C#3 E3 A2 C#3 | D3/s E3 F#3 G3 A3/e A3 B3/s A3 G3 F#3 G3/e E3 | F#3/e A3 F#3 E3 D3/q r/q | G2/e B2 D3 G3 B3 G3 D3 B2 | A2/e C#3 E3 A3 C#4 A3 E3 C#3 | D3/s C#3 B2 A2 G2/e B2 A2/s B2 C#3 A2 D3/e r/e | D3/s E3 F#3 G3 A3/e F#3 D3/q r/q',
    chords: 'D | A | D A | D | G | A | D A | D',
  }),
  'b-probe-romantik': B({
    title: 'Probespiel-Etüde: Romantik', by: 'Klavier-Quest · im Stil von Brahms', style: 'Klassik', tempo: 72, key: 'F', ts: [3, 4], tech: 'arco', style2: 'waltz',
    lh: 'C3/h F3/q | A3/h. | G3/q. F3/e E3/q | F3/h C3/q | D3/h Bb3/q | A3/q. G3/e F3/q | E3/q G3 C4 | D4/h C4/q | Bb3/q. A3/e G3/q | A3/q F3 D3 | C3/h E3/q | F3/h.',
    chords: 'F | F | C | F | Bb | F | C | Bb | Gm | Dm | C | F',
  }),
  'b-probe-rezitativ': B({
    title: 'Probespiel-Etüde: Rezitativ', by: 'Klavier-Quest · im Stil Beethovens', style: 'Klassik', tempo: 60, key: 'F', tech: 'arco', style2: 'klassisch',
    lh: 'D3/q. A2/e D3/q F3 | A3/h. r/q | G3/e F3 E3 D3 C#3/q E3 | A2/h. r/q | Bb2/q. D3/e G3/q Bb3 | A3/q. G3/e F3/q E3 | D3/e E3 F3 G3 A3/q A2 | D3/w',
    chords: 'Dm | Dm | Gm A | A | Gm | Dm A | Dm A | Dm',
  }),
  'b-ultra-finale': B({
    title: 'Ultra-Finale', style: 'Konzertstück', tempo: 80, key: 'D', tech: 'arco', style2: 'klassisch', ...HI,
    lh: 'D4/s E4 F#4 G4 A4 B4 C#5 D5 E5/q C#5/q | D5/e A4 F#4 A4 D4/h | B4/s C#5 D5 B4 G4/e B4 A4/s B4 C#5 A4 E4/e A4 | F#4/q. E4/e D4/h | G4/e B4 D5 B4 A4/e C#5 E5 C#5 | D5/s C#5 B4 A4 G4 F#4 E4 D4 C#4/q A3/q | B3/e D4 G4 B4 A4/e E4 C#4 E4 | D4/w',
    chords: 'D A | D | G A | D | G A | D A | G A | D',
  }),
};

export const PRO_BASS_WORLDS = [
  {
    id: 'bw8', title: 'Daumenlage', level: 'Pro', hint: 0, color: '#f08c00', maxPos: 17,
    blurb: 'Daumenlage, Violinschlüssel, Solospiel und Improvisation.',
    lessons: [
      { id: 'bl8-1', title: 'Der Daumen', steps: [T('b-daumen'), D('bd8-1', 'Daumenlage auf der G-Saite', { layout: 'b', key: 'G', b: ['G4', 'A4', 'B4', 'C5', 'D5'], patterns: ['qh'], bars: 4, tempo: 60, stepwise: true, clef: 't' }), Pc('b-daumen-etude')] },
      { id: 'bl8-2', title: 'Orientierung oben', steps: [T('b-flageolett'), D('bd8-2', 'Daumen auf D- und G-Saite', { layout: 'b', key: 'D', b: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'], patterns: ['qh', 'e'], bars: 4, tempo: 60, stepwise: true, clef: 't' })] },
      { id: 'bl8-3', title: 'Solo', steps: [T('b-solo'), Pc('b-kantilene')] },
      { id: 'bl8-4', title: 'Improvisieren', steps: [T('b-impro'), Pc('b-blues-solo')] },
    ],
    boss: 'b-gipfelsturm',
  },
  {
    id: 'bw9', title: 'Probespiel', level: 'Ultra-God', hint: 0, color: '#5f3dc4', maxPos: 17,
    blurb: 'Etüden im Stil echter Orchesterstellen, schnelle Noten, ganzer Tonraum.',
    lessons: [
      { id: 'bl9-1', title: 'Klassik', steps: [T('b-probespiel'), T('b-sechzehntel'), Pc('b-probe-klassik')] },
      { id: 'bl9-2', title: 'Romantik', steps: [Pc('b-probe-romantik')] },
      { id: 'bl9-3', title: 'Rezitativ', steps: [Pc('b-probe-rezitativ')] },
      { id: 'bl9-4', title: 'Blattspiel-Olymp', steps: [D('bd9-4a', 'Ganzer Tonraum, Sechzehntel', { layout: 'b', key: 'D', b: ['E2', 'F#2', 'G2', 'A2', 'B2', 'C#3', 'D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4'], patterns: ['qh', 'e', 's16'], bars: 8, tempo: 66, stepwise: true }), D('bd9-4b', 'Es-Dur', { layout: 'b', key: 'Eb', b: ['Eb2', 'F2', 'G2', 'Ab2', 'Bb2', 'C3', 'D3', 'Eb3', 'F3', 'G3', 'Ab3', 'Bb3'], patterns: ['qh', 'e', 'dot'], bars: 8, tempo: 72 })] },
    ],
    boss: 'b-ultra-finale',
  },
];
