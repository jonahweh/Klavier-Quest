// Kontrabass-Repertoire: bekannte klassische Stellen (gemeinfrei) je in leichter und originalnaher Fassung,
// dazu eigene Stücke im Stil großer Filmmusik. Notiert im Bassschlüssel (klingt eine Oktave tiefer).

const R = o => ({ ts: [4, 4], tech: 'arco', style2: 'klassisch', ...o });
const rep = (s, n, sep = ' | ') => Array(n).fill(s).join(sep);

// ---------- Tschaikowsky: Schwanensee (h-Moll, Originaltonart)
const SW = 'F#3/h B2/e C#3 D3 E3 | F#3/q. D3/e F#3/q. D3/e | F#3/q. B2/e D3 B2 G2 D3 | B2/w';
const SW8 = 'F#4/h B3/e C#4 D4 E4 | F#4/q. D4/e F#4/q. D4/e | F#4/q. B3/e D4 B3 G3 D4 | B3/w';
const SW_CH = 'Bm | Bm | Bm G | Bm';
// ---------- Grieg: In der Halle des Bergkönigs (h-Moll)
const GR = 'B2/q C#3 D3 E3 | F#3/q D3 F#3/h | F3/q C#3 F3/h | E3/q C3 E3/h | B2/q C#3 D3 E3 | F#3 D3 F#3 B3 | A3 F#3 D3 F#3 | A3/w';
const GR5 = 'F#2/q G#2 A2 B2 | C#3/q A2 C#3/h | C3/q G#2 C3/h | B2/q G2 B2/h | F#2/q G#2 A2 B2 | C#3 A2 C#3 F#3 | E3 C#3 A2 C#3 | E3/w';
const GR_CH = 'Bm | Bm | C#7 | C | Bm | Bm | D | A';
const GR5_CH = 'F#m | F#m | G#7 | G | F#m | F#m | A | E';
// ---------- Mahler: Sinfonie Nr. 1, 3. Satz (d-Moll)
const MA = 'D3/q E3 F3 D3 | D3 E3 F3 D3 | F3 G3 A3/h | F3/q G3 A3/h | A3/e Bb3 A3 G3 F3/q D3 | A3/e Bb3 A3 G3 F3/q D3 | D3/q A2 D3/h | D3/q A2 D3/h';
// ---------- Bach: Cellosuite Nr. 1, Prélude (G-Dur)
const BA = ['G2 D3 B3 A3 B3 D3 B3 D3', 'G2 E3 C4 B3 C4 E3 C4 E3', 'G2 F#3 C4 B3 C4 F#3 C4 F#3', 'G2 G3 B3 A3 B3 G3 B3 F#3'];
const BA_E = BA.map(b => b.replace(/^G2/, 'G2/e')).join(' | ');
const BA_S = BA.map(b => (b + ' ' + b).replace(/^G2/, 'G2/s')).join(' | ');
// ---------- Mozart: Eine kleine Nachtmusik (G-Dur)
const MO = 'G3/q r/e D3/e G3/q r/e D3/e | G3/e D3 G3 B3 D4/h | C4/q r/e A3/e C4/q r/e A3/e | C4/e A3 F#3 A3 D3/h';
const MO_L = 'G3/h D3/h | G3/q B3 D4/h | C4/h A3/h | C4/q F#3 D3/h';
// ---------- Beethoven: 9. Sinfonie, Freudenthema in Celli und Bässen (D-Dur)
const B9A = 'F#3/q F#3 G3 A3 | A3 G3 F#3 E3 | D3 D3 E3 F#3 | F#3/q. E3/e E3/h';
const B9B = 'F#3/q F#3 G3 A3 | A3 G3 F#3 E3 | D3 D3 E3 F#3 | E3/q. D3/e D3/h';
const B9C = 'E3/q E3 F#3 D3 | E3/q F#3/e G3/e F#3/q D3 | E3/q F#3/e G3/e F#3/q E3 | D3/q E3 A2/h';
const B9_CH = { A: 'D | A | D | A', B: 'D | A | D | A D', C: 'A | A D | A D | D A' };
// ---------- Beethoven: 5. Sinfonie, Schicksalsmotiv (c-Moll, 2/4)
const B5 = 'r/e G3/e G3 G3 | Eb3/h | r/e F3/e F3 F3 | D3/h | r/e G3/e G3 G3 | Eb3/h | r/e F3/e F3 F3 | D3/h | r/e Ab3/e Ab3 Ab3 | G3/h | r/e Eb3/e Eb3 Eb3 | C3/h | r/e D3/e D3 D3 | B2/h | C3/h | C3/h';
const B5_CH = 'Cm | Cm | G | G | Cm | Cm | G | G | Fm | Cm | Cm | Cm | G | G | Cm | Cm';
// ---------- Eigene Stücke im Filmmusik-Stil
const OST = 'D3/e D3 A2 D3 D3 A2 D3 F3 | Bb2/e Bb2 F2 Bb2 Bb2 F2 Bb2 D3 | F2/e F2 C3 F2 F2 C3 F2 A2 | C3/e C3 G2 C3 C3 G2 C3 E3';
const WR = 'G2/q B2/e D3/q B2/e | E2/q G2/e B2/q G2/e | C3/q E3/e G3/q E3/e | D3/q F#3/e A3/q F#3/e';
const HM = 'E2/e E2 E2/q E2/e E2 E2/q | C3/e C3 C3/q C3/e C3 C3/q | D3/e D3 D3/q D3/e D3 D3/q | B2/e B2 B2/q B2/e B2 B2/q';

export const REP_PIECES = {
  'r-schwanensee-l': R({ title: 'Schwanensee (leicht)', by: 'P. I. Tschaikowsky', style: 'Klassik', tempo: 66, key: 'D',
    lh: `${SW} | ${SW} | D3/h C#3/h | B2/w`, chords: `${SW_CH} | ${SW_CH} | G F# | Bm` }),
  'r-schwanensee-o': R({ title: 'Schwanensee (original)', by: 'P. I. Tschaikowsky', style: 'Klassik', tempo: 76, key: 'D',
    lh: `${SW8} | ${SW} | ${SW8} | D4/h C#4/h | B3/w`, chords: `${rep(SW_CH, 3)} | G F# | Bm` }),
  'r-bergkoenig-l': R({ title: 'Halle des Bergkönigs (leicht)', by: 'E. Grieg', style: 'Klassik', tempo: 84, key: 'D', tech: 'pizz',
    lh: `${GR} | B2/w`, chords: `${GR_CH} | Bm` }),
  'r-bergkoenig-o': R({ title: 'Halle des Bergkönigs (original)', by: 'E. Grieg', style: 'Klassik', tempo: 120, key: 'D', tech: 'pizz',
    lh: `${GR} | ${GR5} | ${GR} | B2/w`, chords: `${GR_CH} | ${GR5_CH} | ${GR_CH} | Bm` }),
  'r-mahler-l': R({ title: 'Bruder Jakob in Moll (leicht)', by: 'G. Mahler', style: 'Klassik', tempo: 56, key: 'F',
    lh: MA, chords: rep('Dm', 8) }),
  'r-mahler-o': R({ title: 'Bruder Jakob in Moll (original)', by: 'G. Mahler', style: 'Klassik', tempo: 66, key: 'F',
    lh: `${MA} | ${MA}`, chords: rep('Dm', 16) }),
  'r-bach-l': R({ title: 'Prélude G-Dur (leicht)', by: 'J. S. Bach', style: 'Klassik', tempo: 66, key: 'G',
    lh: `${BA_E} | ${BA_E} | G2/w`, chords: 'G | C | D7 | G | G | C | D7 | G | G' }),
  'r-bach-o': R({ title: 'Prélude G-Dur (original)', by: 'J. S. Bach', style: 'Klassik', tempo: 60, key: 'G',
    lh: `${BA_S} | ${BA_S} | G2/w`, chords: 'G | C | D7 | G | G | C | D7 | G | G' }),
  'r-mozart-l': R({ title: 'Kleine Nachtmusik (leicht)', by: 'W. A. Mozart', style: 'Klassik', tempo: 84, key: 'G',
    lh: `${MO_L} | ${MO_L} | G3/w`, chords: 'G | G | D7 | D7 | G | G | D7 | D7 | G' }),
  'r-mozart-o': R({ title: 'Kleine Nachtmusik (original)', by: 'W. A. Mozart', style: 'Klassik', tempo: 132, key: 'G',
    lh: `${MO} | ${MO} | G3/w`, chords: 'G | G | D7 | D7 | G | G | D7 | D7 | G' }),
  'r-beethoven9-l': R({ title: 'Freudenthema (leicht)', by: 'L. v. Beethoven', style: 'Klassik', tempo: 72, key: 'D',
    lh: `${B9A} | ${B9B} | ${B9C} | ${B9B}`, chords: `${B9_CH.A} | ${B9_CH.B} | ${B9_CH.C} | ${B9_CH.B}` }),
  'r-beethoven9-o': R({ title: 'Freudenthema (original)', by: 'L. v. Beethoven', style: 'Klassik', tempo: 88, key: 'D',
    lh: `${B9A} | ${B9B} | ${B9C} | ${B9B} | ${B9C} | ${B9B}`, chords: `${B9_CH.A} | ${B9_CH.B} | ${B9_CH.C} | ${B9_CH.B} | ${B9_CH.C} | ${B9_CH.B}` }),
  'r-beethoven5-l': R({ title: 'Schicksalsmotiv (leicht)', by: 'nach L. v. Beethoven', style: 'Klassik', tempo: 100, key: 'Eb', ts: [2, 4],
    lh: B5, chords: B5_CH }),
  'r-beethoven5-o': R({ title: 'Schicksalsmotiv (original)', by: 'nach L. v. Beethoven', style: 'Klassik', tempo: 152, key: 'Eb', ts: [2, 4],
    lh: B5, chords: B5_CH }),
  'r-weite': R({ title: 'Endlose Weite', by: 'Klavier-Quest · Filmmusik-Stil', style: 'Soundtrack', tempo: 92, key: 'F', style2: 'straight',
    lh: `${OST} | ${OST} | Bb2/w | F2/w | C3/w | A2/w | ${OST} | D3/w`,
    chords: 'Dm | Bb | F | C | Dm | Bb | F | C | Bb | F | C | A | Dm | Bb | F | C | Dm' }),
  'r-wolkenreiter': R({ title: 'Wolkenreiter', by: 'Klavier-Quest · Filmmusik-Stil', style: 'Soundtrack', tempo: 132, key: 'G', ts: [6, 8], tech: 'pizz',
    lh: `${WR} | ${WR} | C3/q. E3/q. | D3/q. F#3/q. | E3/q G3/e B3/q G3/e | C3/q. D3/q. | G2/q B2/e D3/q B2/e | G2/h.`,
    chords: 'G | Em | C | D | G | Em | C | D | C | D | Em | C D | G | G' }),
  'r-countdown': R({ title: 'Countdown', by: 'Klavier-Quest · Filmmusik-Stil', style: 'Soundtrack', tempo: 88, key: 'C',
    lh: 'A2/q A2 A2 A2 | F2/q F2 F2 F2 | C3/q C3 C3 C3 | G2/q G2 G2 G2 | A2/q A2 A2 A2 | F2/q F2 F2 F2 | C3/q C3 C3 C3 | E2/q E2 E2 E2 | A2/w | F2/w | C3/w | E2/w | A2/e A2 A2 A2 A2 A2 A2 A2 | F2/e F2 F2 F2 F2 F2 F2 F2 | C3/e C3 C3 C3 C3 C3 C3 C3 | G2/e G2 G2 G2 E2 E2 E2 E2 | A2/w',
    chords: 'Am | F | C | G | Am | F | C | E | Am | F | C | E | Am | F | C | G E | Am' }),
  'r-heldenmarsch': R({ title: 'Heldenmarsch', by: 'Klavier-Quest · Filmmusik-Stil', style: 'Soundtrack', tempo: 100, key: 'G', style2: 'straight',
    lh: `${HM} | ${HM} | C3/h G2/h | D3/h A2/h | E3/h B2/h | B2/h F#2/h | ${HM} | E2/w`,
    chords: 'Em | C | D | B | Em | C | D | B | C | D | Em | B | Em | C | D | B | Em' }),
};

export const REP_THEORY = {
  'r-schwanensee': {
    title: 'Tschaikowsky: Schwanensee',
    html: `<p>Tschaikowskys Ballett <b>Schwanensee</b> wurde 1877 am Bolschoi-Theater in Moskau uraufgeführt. Das berühmte Thema erklingt im zweiten Akt, gespielt von der Oboe über flirrenden Streichern – in <b>h-Moll</b>, der Originaltonart.</p>
<p>Die <b>leichte Fassung</b> liegt bequem in der I. Lage. Die <b>originalnahe</b> spielt die Melodie zusätzlich eine Oktave höher, so wie sie im Orchester klingt – dafür musst du bis in die hohen Lagen.</p>`,
    example: null, bass: true,
  },
  'r-grieg': {
    title: 'Grieg: In der Halle des Bergkönigs',
    html: `<p>Aus Edvard Griegs Musik zu <b>Peer Gynt</b> (1875). Das Stück beginnt ganz leise mit <b>Celli und Kontrabässen im Pizzicato</b> – der Bass stellt das Thema vor! Danach wird es immer lauter und schneller, bis das ganze Orchester tobt.</p>
<p>Die originalnahe Fassung bringt das Thema dreimal, beim zweiten Mal versetzt in fis-Moll. Achte auf die chromatischen Töne F und C – sie geben dem Thema seinen schleichenden Charakter.</p>`,
    example: null, bass: true,
  },
  'r-mahler': {
    title: 'Mahler: Sinfonie Nr. 1, 3. Satz',
    html: `<p>Einer der berühmtesten Kontrabass-Momente überhaupt: Gustav Mahler lässt den 3. Satz seiner <b>1. Sinfonie</b> mit einem <b>Kontrabass-Solo</b> beginnen – das Kinderlied „Bruder Jakob“, aber in Moll, gedämpft und über einem Paukenschlag D – A.</p>
<p>Spiel es ruhig, gleichmäßig und mit gleichbleibendem Ton. Genau dieses Solo kommt oft in Probespielen für Orchesterstellen dran.</p>`,
    example: null, bass: true,
  },
  'r-bach': {
    title: 'Bach: Cellosuite Nr. 1',
    html: `<p>Bachs sechs <b>Suiten für Violoncello solo</b> entstanden um 1720 und gehören zu den meistgespielten Stücken für tiefe Streicher – auch auf dem Kontrabass. Das <b>Prélude in G-Dur</b> besteht aus gebrochenen Akkorden über dem tiefen G.</p>
<p>Du übst hier die ersten vier Takte: Die leichte Fassung in Achteln, die originalnahe in Sechzehnteln. Lass das tiefe G als Basis klingen und spiel die oberen Töne leicht.</p>`,
    example: null, bass: true,
  },
  'r-mozart': {
    title: 'Mozart: Eine kleine Nachtmusik',
    html: `<p>Mozarts Serenade KV 525 von 1787 ist für Streicher geschrieben. Den berühmten Anfang spielen <b>alle Instrumente gemeinsam im Unisono</b> – der Kontrabass also mitten im Rampenlicht.</p>
<p>Die originalnahe Fassung hat die kurzen Pausen und das schnelle Allegro-Tempo. Die leichte vereinfacht den Rhythmus.</p>`,
    example: null, bass: true,
  },
  'r-beethoven': {
    title: 'Beethoven: 5. und 9. Sinfonie',
    html: `<p>Im Finale der <b>9. Sinfonie</b> (1824) stellen <b>Celli und Kontrabässe allein</b> das Freudenthema vor – ganz leise, ohne Begleitung. Erst danach übernehmen die anderen Instrumente. Für Bassisten ein Gänsehaut-Moment.</p>
<p>Das <b>Schicksalsmotiv</b> der 5. Sinfonie (1808) spielen die Streicher am Anfang im Unisono. Unsere Fassung ist eine Motiv-Etüde: Sie übt den typischen Rhythmus „kurz-kurz-kurz-lang“ in mehreren Sequenzen.</p>`,
    example: null, bass: true,
  },
  'r-film': {
    title: 'Filmmusik-Stil',
    html: `<p>In moderner Filmmusik ist der Bass oft der Motor: <b>Ostinati</b> (sich wiederholende Figuren), pulsierende Achtel und galoppierende Rhythmen treiben die Szene voran.</p>
<p>Die vier Stücke hier sind <b>eigene Kompositionen</b> im Stil großer Hollywood-Scores – keine Kopien geschützter Filmmusik. Schalte die Begleitung ein, dann klingt es nach Orchester.</p>`,
    example: null, bass: true,
  },
};

const T = id => ({ type: 'theory', id: 't-' + id, card: id });
const Pc = id => ({ type: 'piece', id: 'p-' + id, piece: id });
export const REP_WORLD = {
  id: 'bw7', title: 'Repertoire', level: 'Klassik & Film', hint: 0, color: '#495057', maxPos: 11,
  blurb: 'Berühmte Orchesterstellen und Filmmusik-Stil, je leicht und originalnah.',
  lessons: [
    { id: 'bl7-1', title: 'Tschaikowsky', steps: [T('r-schwanensee'), Pc('r-schwanensee-l'), Pc('r-schwanensee-o')] },
    { id: 'bl7-2', title: 'Mahler', steps: [T('r-mahler'), Pc('r-mahler-l'), Pc('r-mahler-o')] },
    { id: 'bl7-3', title: 'Bach', steps: [T('r-bach'), Pc('r-bach-l'), Pc('r-bach-o')] },
    { id: 'bl7-4', title: 'Mozart', steps: [T('r-mozart'), Pc('r-mozart-l'), Pc('r-mozart-o')] },
    { id: 'bl7-5', title: 'Beethoven', steps: [T('r-beethoven'), Pc('r-beethoven9-l'), Pc('r-beethoven9-o'), Pc('r-beethoven5-l'), Pc('r-beethoven5-o')] },
    { id: 'bl7-6', title: 'Grieg', steps: [T('r-grieg'), Pc('r-bergkoenig-l')] },
    { id: 'bl7-7', title: 'Filmmusik-Stil', steps: [T('r-film'), Pc('r-weite'), Pc('r-countdown'), Pc('r-wolkenreiter'), Pc('r-heldenmarsch')] },
  ],
  boss: 'r-bergkoenig-o',
};
export const REP_FAVORITES = Object.keys(REP_PIECES);
