// Kontrabass-Stücke, notiert wie üblich im Bassschlüssel (klingt eine Oktave tiefer).
// lh = Basslinie, chords = Akkorde für die Begleitung, style2 = Begleitstil (straight, swing, waltz, klassisch)
// Fingersätze (Simandl) werden automatisch berechnet. @d = Abstrich, @u = Aufstrich.

import { REP_PIECES } from './bass-repertoire.js';

const B = (o) => ({ by: 'Klavier-Quest', ts: [4, 4], ...o });

export const BASS_PIECES = {
  // ---------- Welt 1
  'b-vier-saiten': B({
    title: 'Vier Saiten', style: 'Etüde', tempo: 72, key: 'D', tech: 'arco', style2: 'klassisch',
    lh: 'G3@d/h D3@u/h | A2@d/h D3@u/h | G3@d/q G3@u D3@d D3@u | A2@d/w | E2@u/h A2@d/h | D3@u/h G3@d/h | D3@u/q A2@d D3@u A2@d | D3@u/w',
    chords: 'G | D | G | A | Em A | D G | D A | D',
  }),
  'b-erste-melodie': B({
    title: 'Erste Melodie', style: 'Etüde', tempo: 72, key: 'D', tech: 'arco', style2: 'klassisch',
    lh: 'D3/q E3 F#3 G3 | A3/h F#3/h | G3/q F#3 E3 G3 | F#3/w | A3/q B3 A3 G3 | F#3/h D3/h | E3/q F#3 E3 A2 | D3/w',
    chords: 'D | D | Em A | D | D | D | A | D',
  }),
  'b-tiefsee': B({
    title: 'Tiefsee', style: 'Soundtrack', tempo: 66, key: 'G', tech: 'arco', style2: 'klassisch',
    lh: 'E2/h G2/h | A2/q B2 C3 B2 | A2/h G2/h | F#2/w | E2/q F#2 G2 A2 | B2/h E2/h | F#2/q G2 A2 F#2 | E2/w',
    chords: 'Em | Am | Am Em | B7 | Em | Em | B7 | Em',
  }),
  'b-g-dur-leiter': B({
    title: 'G-Dur-Tonleiter', by: 'Übung', style: 'Technik', tempo: 72, key: 'G', tech: 'arco',
    lh: 'G2@d/q A2@u B2@d C3@u | D3@d E3@u F#3@d G3@u | G3@d F#3@u E3@d D3@u | C3@d B2@u A2@d G2@u',
  }),
  'b-ode': B({
    title: 'Ode an die Freude', by: 'L. v. Beethoven', style: 'Klassik', tempo: 84, key: 'D', tech: 'arco', style2: 'klassisch',
    lh: 'F#3/q F#3 G3 A3 | A3 G3 F#3 E3 | D3 D3 E3 F#3 | F#3/q. E3/e E3/h | F#3/q F#3 G3 A3 | A3 G3 F#3 E3 | D3 D3 E3 F#3 | E3/q. D3/e D3/h',
    chords: 'D | A | D | A | D | A | D | A D',
  }),
  // ---------- Welt 2
  'b-schleichkatze': B({
    title: 'Schleichkatze', style: 'Jazz', tempo: 76, key: 'F', tech: 'pizz', style2: 'straight',
    lh: 'F2/q A2 C3 A2 | Bb2/q D3 F3 D3 | C3/q Bb2 A2 G2 | F2/h C3/h | F2/q A2 C3 F3 | Eb3/q D3 C3 Bb2 | A2/q C3 Bb2 G2 | F2/w',
    chords: 'F | Bb | C7 | F C7 | F | F7 | C7 | F',
  }),
  'b-polka': B({
    title: 'Pizzicato-Polka', style: 'Pop', tempo: 92, key: 'G', tech: 'pizz', style2: 'straight',
    lh: 'G2/e B2 D3 B2 G2/q D3 | C3/e E3 G3 E3 C3/q G2 | D3/e F#3 A3 F#3 D3/q A2 | G2/q B2 G2/h | G2/e B2 D3 B2 G2/q D3 | C3/e E3 G3 E3 C3/q A2 | D3/e C3 B2 A2 D3/q F#2 | G2/h r/h',
    chords: 'G | C | D | G | G | C | D7 | G',
  }),
  'b-turmuhr': B({
    title: 'Turmuhr', style: 'Klassik', tempo: 72, key: 'C', tech: 'arco', style2: 'klassisch',
    lh: 'C3/h G2/h | C3/q D3 E3 F3 | G3/h E3/h | C4/w | B3/q A3 G3 F3 | E3/h C3/h | D3/q G2 A2 B2 | C3/w',
    chords: 'C | C | C | C | G | C | G7 | C',
  }),
  'b-leichter-schritt': B({
    title: 'Leichter Schritt', style: 'Etüde', tempo: 80, key: 'D', tech: 'arco', style2: 'klassisch',
    lh: 'D3/q r A2 r | D3/q F#3 A3/h | G3/q r E3 r | A2/h. r/q | D3/q r F#3 r | G3/q B3 A3 G3 | F#3/q E3 A2 C#3 | D3/w',
    chords: 'D | D | A | A | D | G | D A | D',
  }),
  'b-kanon': B({
    title: 'Kanon (Bassstimme)', by: 'J. Pachelbel', style: 'Klassik', tempo: 60, key: 'D', tech: 'arco', style2: 'klassisch',
    lh: 'D3/h A2/h | B2/h F#2/h | G2/h D3/h | G2/h A2/h | D3/q F#3 A2 C#3 | B2/q D3 F#2 A2 | G2/q B2 D3 F#3 | G2/q B2 A2 C#3 | D3/e F#3 A3 F#3 A2 C#3 E3 C#3 | B2/e D3 F#3 D3 F#2 A2 C#3 A2 | G2/e B2 D3 B2 D3 F#3 A3 F#3 | G2/e B2 D3 B2 A2 C#3 E3 C#3 | D3/h A2/h | B2/h F#2/h | G2/h D3/h | G2/h A2/h | D3/w',
    chords: 'D A | Bm F#m | G D | G A | D A | Bm F#m | G D | G A | D A | Bm F#m | G D | G A | D A | Bm F#m | G D | G A | D',
  }),
  // ---------- Welt 3
  'b-marsch-f': B({
    title: 'Marsch in F', style: 'Klassik', tempo: 92, key: 'F', tech: 'arco', style2: 'straight',
    lh: 'F2/q C3 F2 C3 | Bb2/q D3 F3 D3 | C3/q E3 G3 E3 | F3/h C3/h | F2/q A2 C3 F3 | Bb2/q D3 Bb2 G2 | C3/q G2 C3 E2 | F2/w',
    chords: 'F | Bb | C | F C | F | Bb Gm | C | F',
  }),
  'b-abend-b': B({
    title: 'Abend in B', style: 'Soundtrack', tempo: 72, key: 'Bb', tech: 'arco', style2: 'klassisch',
    lh: 'Bb2/h D3/h | F3/q Eb3 D3 C3 | Bb2/h F2/h | G2/q A2 Bb2 C3 | D3/h F3/h | Eb3/q D3 C3 A2 | Bb2/q F2 G2 A2 | Bb2/w',
    chords: 'Bb | Bb F | Bb | Gm F | Bb | Eb F | Bb F | Bb',
  }),
  'b-kriecher': B({
    title: 'Chromatischer Kriecher', style: 'Game', tempo: 66, key: 'C', tech: 'pizz',
    lh: 'E2/q F2 F#2 G2 | G#2/q A2 Bb2 B2 | C3/q C#3 D3 D#3 | E3/w | E3/q Eb3 D3 C#3 | C3/q B2 Bb2 A2 | G#2/q G2 F#2 F2 | E2/w',
  }),
  'b-walzer': B({
    title: 'Bass-Walzer', style: 'Klassik', tempo: 120, key: 'F', ts: [3, 4], tech: 'pizz', style2: 'waltz',
    lh: 'F2/h. | C3/h. | F2/q A2 C3 | F3/h. | Bb2/h. | F2/h. | C3/q E3 G3 | C3/h. | F2/h. | A2/h. | Bb2/q D3 F3 | G2/h. | C3/q Bb2 G2 | C3/h. | F2/q C3 A2 | F2/h.',
    chords: 'F | C | F | F | Bb | F | C | C | F | F | Bb | Gm | C7 | C7 | F | F',
  }),
  'b-riesen': B({
    title: 'Marsch der Riesen', style: 'Soundtrack', tempo: 84, key: 'F', tech: 'arco', style2: 'klassisch',
    lh: 'D3/q. D3/e A2/h | D3/q. D3/e F3/h | E3/q. D3/e C#3/q A2 | D3/h. r/q | F3/q. E3/e D3/q C3 | Bb2/q. A2/e G2/h | A2/q E2 A2 C#3 | D3/w | D3/q. D3/e A2/h | F3/q. G3/e A3/h | Bb3/q A3 G3 F3 | E3/h A2/h | D3/q F3 E3 D3 | C#3/q. B2/e A2/q G2 | F2/q E2 A2 C#3 | D3/w',
    chords: 'Dm | Dm | A | Dm | Dm | Gm | A | Dm | Dm | Dm | Gm | A | Dm | A | A | Dm',
  }),
  // ---------- Welt 4 (Walking Bass)
  'b-zwei-schritt': B({
    title: 'Zwei-Schritt', style: 'Jazz', tempo: 108, key: 'F', tech: 'pizz', style2: 'swing',
    lh: 'F2/h C3/h | D3/h A2/h | G2/h D3/h | C3/h G2/h | F2/h A2/h | D3/h F#2/h | G2/h C3/h | F2/w',
    chords: 'F | D7 | Gm | C7 | F | D7 | Gm C7 | F',
  }),
  'b-spaziergang': B({
    title: 'Spaziergang in F', style: 'Jazz', tempo: 108, key: 'F', tech: 'pizz', style2: 'swing',
    lh: 'F2/q A2 C3 A2 | D3/q F#3 A3 F#3 | G3/q F3 D3 Bb2 | C3/q E3 G3 E3 | F3/q C3 A2 F2 | D3/q C3 A2 F#2 | G2/q Bb2 C3 E3 | F3/h F2/h',
    chords: 'F | D7 | Gm | C7 | F | D7 | Gm C7 | F',
  }),
  'b-blues-treppe': B({
    title: 'Blues-Treppe', style: 'Jazz', tempo: 112, key: 'F', tech: 'pizz', style2: 'swing',
    lh: 'F2/q A2 C3 B2 | Bb2/q D3 F3 E3 | F3/q C3 A2 C3 | F2/q A2 C3 A2 | Bb2/q D3 F3 D3 | Bb2/q C3 D3 E3 | F3/q C3 A2 C#3 | D3/q F#3 A3 Ab3 | G3/q F3 D3 Bb2 | C3/q E3 G3 E3 | F3/q A2 D3 F#2 | G2/q Bb2 C3 E2 | F2/w',
    chords: 'F7 | Bb7 | F7 | F7 | Bb7 | Bb7 | F7 | D7 | Gm7 | C7 | F7 D7 | Gm7 C7 | F7',
  }),
  'b-mitternacht': B({
    title: 'Mitternachtsblues', style: 'Jazz', tempo: 116, key: 'Bb', tech: 'pizz', style2: 'swing',
    lh: 'Bb2/q D3 F3 D3 | Eb3/q G3 Bb2 A2 | Bb2/q D3 F3 D3 | Bb2/q Ab2 C3 D3 | Eb3/q G3 Bb3 G3 | Eb3/q Db3 C3 A2 | Bb2/q D3 F3 F#3 | G3/q D3 B2 Db3 | C3/q Eb3 G3 E3 | F3/q Eb3 C3 A2 | Bb2/q D3 G2 B2 | C3/q Eb3 F2 A2 | Bb2/q D3 F3 E3 | Eb3/q G3 C3 B2 | Bb2/q F2 G2 A2 | Bb2/q D3 F3 E3 | Eb3/q Bb2 C3 D3 | Eb3/q Db3 C3 B2 | Bb2/q D3 F3 Ab3 | G3/q F3 D3 B2 | C3/q D3 Eb3 E3 | F3/q Eb3 C3 B2 | Bb2/q D3 G2 B2 | C3/q G2 F2 A2 | Bb2/w',
    chords: 'Bb7 | Eb7 | Bb7 | Bb7 | Eb7 | Eb7 | Bb7 | G7 | Cm7 | F7 | Bb7 G7 | Cm7 F7 | Bb7 | Eb7 | Bb7 | Bb7 | Eb7 | Eb7 | Bb7 | G7 | Cm7 | F7 | Bb7 G7 | Cm7 F7 | Bb7',
  }),
  // ---------- Welt 5
  'b-nebelmond': B({
    title: 'Nebelmond', style: 'Soundtrack', tempo: 72, key: 'C', tech: 'arco', style2: 'klassisch',
    lh: 'A2/h E3/h | C4/q B3 A3 G#3 | A3/h E3/h | D4/q C4 B3 A3 | G#3/h E3/h | A3/q B3 C4 D4 | E3/q G#3 B3 G#3 | A3/w',
    chords: 'Am | E | Am | Dm | E | Am | E | Am',
  }),
  'b-hoch-hinaus': B({
    title: 'Hoch hinaus', style: 'Etüde', tempo: 76, key: 'G', tech: 'arco', style2: 'klassisch',
    lh: 'G2/q D3 G3 B3 | D4/h B3/h | C4/q B3 A3 G3 | F#3/h D3/h | E3/q F#3 G3 A3 | B3/q C4 D4 E4 | D4/q B3 A3 F#3 | G3/w',
    chords: 'G | G | C D | D | C | G C | D | G',
  }),
  'b-aufwaerts': B({
    title: 'Aufwärts', style: 'Etüde', tempo: 72, key: 'C', tech: 'arco', style2: 'klassisch',
    lh: 'C3/q D3 E3 F3 | G3/q A3 B3 C4 | D4/h C4/h | B3/q A3 G3 F3 | E3/q F3 G3 A3 | B3/q C4 D4 E4 | D4/q B3 G3 D3 | C3/w',
    chords: 'C | C | G C | G | C | G | G7 | C',
  }),
  'b-sturmfahrt': B({
    title: 'Sturmfahrt', style: 'Game', tempo: 88, key: 'G', tech: 'arco', style2: 'klassisch',
    lh: 'E2/e G2 B2 E3 G3/q E3 | F#2/e A2 C3 D#3 F#3/q B2 | E2/e G2 B2 E3 G3/q B3 | A2/e C3 E3 A3 C4/q A3 | B3/q A3 G3 F#3 | E3/q G3 B3 E4 | D4/q C4 B3 A3 | B3/w | E3/e F#3 G3 A3 B3/q G3 | C4/e B3 A3 G3 F#3/q D#3 | E3/e G3 B3 G3 E3/q B2 | C3/e E3 A3 E3 C3/q A2 | F#2/e A2 B2 D#3 F#3/q A3 | G3/q F#3 E3 D#3 | E3/e B2 G2 B2 F#2/q D#3 | E3/w',
    chords: 'Em | B7 | Em | Am | B7 | Em | Am | B7 | Em | Am B7 | Em | Am | B7 | Em B7 | Em B7 | Em',
  }),
  // ---------- Welt 6
  'b-neon-funk': B({
    title: 'Neon-Funk', style: 'Pop', tempo: 96, key: 'G', tech: 'pizz', style2: 'straight',
    lh: 'E2/e E2/e r/e E3/e r/e D3/e B2/q | A2/e A2/e r/e A3/e r/e G3/e E3/q | E2/e E2/e r/e E3/e r/e D3/e B2/e D3/e | E3/q. B2/e D3/q E3/q | E2/e E2/e r/e E3/e r/e D3/e B2/q | C3/e C3/e r/e C4/e r/e B3/e G3/q | D3/e D3/e r/e D4/e r/e C4/e A3/e F#3/e | E3/h. r/q',
    chords: 'Em7 | Am7 | Em7 | Em7 | Em7 | Cmaj7 | D | Em7',
  }),
  'b-tutti': B({
    title: 'Orchester-Tutti', style: 'Klassik', tempo: 100, key: 'D', tech: 'arco', style2: 'klassisch',
    lh: 'D3/q. D3/e D3/q A2 | D3/q F#3 A3 D4 | C#4/q. B3/e A3/q G3 | F#3/h D3/h | G3/q B3 D4 B3 | A3/q F#3 D3 F#3 | E3/q A2 C#3 E3 | D3/w',
    chords: 'D | D | A | D | G | D | A | D',
  }),
  'b-abendlied': B({
    title: 'Abendlied', style: 'Klassik', tempo: 72, key: 'G', ts: [3, 4], tech: 'arco', style2: 'klassisch',
    lh: 'G3/h. | B3/h. | D4/h C4/q | B3/h. | E4/h. | D4/h C4/q | B3/h A3/q | G3/h.',
    chords: 'G | G | D | G | C | D | G D | G',
  }),
  'b-riesenschritte': B({
    title: 'Riesenschritte', style: 'Jazz', tempo: 104, key: 'G', tech: 'pizz', style2: 'swing',
    lh: 'G2/q B2 D3 F3 | E3/q G3 B3 Bb3 | A3/q C4 E3 Eb3 | D3/q F#3 A3 F#3 | G3/q D3 B2 D#3 | E3/q G#3 B3 G#3 | A3/q E3 C3 C#3 | D3/q A2 F#2 A#2 | B2/q D#3 F#3 F3 | E3/q B2 G2 G#2 | A2/q C#3 E3 Eb3 | D3/q F#3 A3 Ab3 | G3/q B3 D4 B3 | C4/q G3 E3 Bb2 | A2/q C3 D3 F#3 | G3/h G2/h',
    chords: 'G | Em | Am | D7 | G | E7 | Am | D7 | B7 | Em | A7 | D7 | G | C | Am D7 | G',
  }),
  ...REP_PIECES,
};
