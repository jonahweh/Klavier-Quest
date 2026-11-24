// Stücke. Eigene Kompositionen + gemeinfreie Klassiker (Beethoven, Petzold).
// rh = rechte Hand (Violinschlüssel), lh = linke Hand (Bassschlüssel). Fingersatz nach dem Doppelpunkt.

export const PIECES = {
  'erster-schritt': {
    title: 'Erster Schritt', by: 'Klavier-Quest', style: 'Etüde', tempo: 72, key: 'C', ts: [4, 4],
    rh: 'C4:1/q D4:2 E4:3 F4:4 | G4:5/h E4:3/h | F4:4/q E4:3 D4:2 C4:1 | D4:2/w | C4:1/q D4:2 E4:3 F4:4 | G4:5/h E4:3/h | F4:4/q D4:2 E4:3 D4:2 | C4:1/w',
  },
  'treppenhaus': {
    title: 'Treppenhaus', by: 'Klavier-Quest', style: 'Etüde', tempo: 76, key: 'C', ts: [4, 4],
    rh: 'E4:3/h D4:2/h | C4:1/q D4:2 E4:3 C4:1 | E4:3/q F4:4 G4:5/h | G4:5/w | G4:5/q F4:4 E4:3 D4:2 | E4:3/h C4:1/h | D4:2/q E4:3 D4:2/h | C4:1/w',
  },
  'glockenturm': {
    title: 'Glockenturm', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 70, key: 'C', ts: [4, 4],
    lh: 'C3:5/h G3:1/h | E3:3/h G3:1/h | F3:2/q E3:3 D3:4 C3:5 | D3:4/w | C3:5/h G3:1/h | E3:3/q F3:2 G3:1/h | F3:2/q E3:3 D3:4 E3:3 | C3:5/w',
  },
  'echo': {
    title: 'Echo im Tal', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 76, key: 'C', ts: [4, 4],
    rh: 'C4:1/q E4:3 G4:5/h | r/w | D4:2/q F4:4 E4:3/h | r/w | E4:3/q D4:2 C4:1 E4:3 | r/w | D4:2/q E4:3 C4:1/h | r/w',
    lh: 'r/w | C3:5/q E3:3 G3:1/h | r/w | D3:4/q F3:2 E3:3/h | r/w | E3:3/q D3:4 C3:5 E3:3 | r/w | D3:4/q E3:3 C3:5/h',
  },
  'ode': {
    title: 'Ode an die Freude', by: 'L. v. Beethoven', style: 'Klassik', tempo: 84, key: 'C', ts: [4, 4],
    rh: 'E4:3/q E4:3 F4:4 G4:5 | G4:5 F4:4 E4:3 D4:2 | C4:1 C4:1 D4:2 E4:3 | E4:3/q. D4:2/e D4:2/h | E4:3/q E4:3 F4:4 G4:5 | G4:5 F4:4 E4:3 D4:2 | C4:1 C4:1 D4:2 E4:3 | D4:2/q. C4:1/e C4:1/h',
  },
  // ---------- Welt 2
  'wellen': {
    title: 'Wellen', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 72, key: 'C', ts: [4, 4],
    rh: 'E4:3/q G4:5 F4:4 E4:3 | D4:2/h C4:1/h | D4:2/q E4:3 F4:4 D4:2 | E4:3/w | E4:3/q G4:5 F4:4 E4:3 | D4:2/h G4:5/h | F4:4/q E4:3 D4:2 E4:3 | C4:1/w',
    lh: 'C3:5/w | G3:1/h E3:3/h | F3:2/w | C3:5/w | C3:5/w | G3:1/w | F3:2/h G3:1/h | C3:5/w',
  },
  'pixel-marsch': {
    title: 'Pixel-Marsch', by: 'Klavier-Quest', style: 'Game', tempo: 92, key: 'C', ts: [4, 4],
    rh: 'C4:1/e E4:3 G4:5 E4:3 C4:1/q G4:5 | F4:4/e E4:3 D4:2 E4:3 F4:4/q D4:2 | E4:3/e G4:5 E4:3 C4:1 D4:2/q G4:5 | C4:1/h r/h | C4:1/e E4:3 G4:5 E4:3 C4:1/q G4:5 | F4:4/e E4:3 D4:2 C4:1 D4:2/q G4:5 | E4:3/e D4:2 C4:1 D4:2 E4:3/q D4:2 | C4:1/h r/h',
    lh: 'C3:5/h G3:1/h | F3:2/h G3:1/h | C3:5/h G3:1/h | C3:5/q G3:1 C3:5/h | C3:5/h G3:1/h | F3:2/h G3:1/h | C3:5/h G3:1/h | C3:5/q G3:1 C3:5/h',
  },
  'leise-schritte': {
    title: 'Leise Schritte', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 80, key: 'C', ts: [4, 4],
    rh: 'G4:5/q r E4:3 r | F4:4/q E4:3 D4:2/h | E4:3/q r C4:1 r | D4:2/h. r/q | G4:5/q r E4:3 r | F4:4/q E4:3 D4:2 F4:4 | E4:3/q D4:2 C4:1/h | r/w',
    lh: 'C3:5/w | G3:1/w | C3:5/w | G3:1/h. r/q | C3:5/w | F3:2/h G3:1/h | C3:5/h G3:1/h | C3:5/w',
  },
  'wolkenreise': {
    title: 'Wolkenreise', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 76, key: 'C', ts: [4, 4],
    rh: 'G4:1/q A4:2 B4:3 C5:4 | D5:5/h B4:3/h | C5:4/q B4:3 A4:2 B4:3 | G4:1/w | D5:5/q C5:4 B4:3 A4:2 | B4:3/h G4:1/h | A4:2/q B4:3 C5:4 A4:2 | G4:1/w',
    lh: 'G2:5/w | G2:5/h D3:1/h | A2:4/h D3:1/h | G2:5/w | D3:1/w | G2:5/w | C3:2/h D3:1/h | G2:5/w',
  },
  'ode-2': {
    title: 'Ode an die Freude (beidhändig)', by: 'L. v. Beethoven', style: 'Klassik', tempo: 84, key: 'C', ts: [4, 4],
    rh: 'E4:3/q E4:3 F4:4 G4:5 | G4:5 F4:4 E4:3 D4:2 | C4:1 C4:1 D4:2 E4:3 | E4:3/q. D4:2/e D4:2/h | E4:3/q E4:3 F4:4 G4:5 | G4:5 F4:4 E4:3 D4:2 | C4:1 C4:1 D4:2 E4:3 | D4:2/q. C4:1/e C4:1/h',
    lh: 'C3:5/w | G3:1/w | C3:5/w | G3:1/w | C3:5/w | G3:1/w | C3:5/h E3:3/h | G3:1/h C3:5/h',
  },
  // ---------- Welt 3
  'geister': {
    title: 'Geisterflur', by: 'Klavier-Quest', style: 'Game', tempo: 70, key: 'C', ts: [4, 4],
    rh: 'C4:1/q C#4:1 D4:2/h | D4:2/q D#4:2 E4:3/h | E4:3/q F4:4 F#4:4 G4:5 | G4:5/w | G4:5/q F#4:4 F4:4 E4:3 | Eb4:3/q D4:2 C#4:1 D4:2 | E4:3/q D4:2 C#4:1 D4:2 | C4:1/w',
    lh: 'C3:5/w | C3:5/w | C3:5/w | G3:1/w | C3:5/w | G3:1/w | G3:1/w | C3:5/w',
  },
  'morgen-in-g': {
    title: 'Morgen in G', by: 'Klavier-Quest', style: 'Klassik', tempo: 80, key: 'G', ts: [4, 4],
    rh: 'G4:4/q F#4:3 E4:2 D4:1 | E4:2/h F#4:3/h | G4:4/q A4:5 G4:4 F#4:3 | G4:4/w | D4:1/q E4:2 F#4:3 G4:4 | A4:5/h F#4:3/h | G4:4/q F#4:3 E4:2 F#4:3 | G4:4/w',
    lh: 'G2:5/w | C3:2/h D3:1/h | G2:5/h B2:3/h | G2:5/w | B2:3/w | D3:1/w | C3:2/h D3:1/h | G2:5/w',
  },
  'abendlied-f': {
    title: 'Abendlied in F', by: 'Klavier-Quest', style: 'Klassik', tempo: 72, key: 'F', ts: [4, 4],
    rh: 'A4:3/q Bb4:4 C5:5/h | A4:3/q G4:2 F4:1/h | G4:2/q A4:3 Bb4:4 G4:2 | A4:3/w | C5:5/q Bb4:4 A4:3 G4:2 | A4:3/h F4:1/h | G4:2/q Bb4:4 A4:3 G4:2 | F4:1/w',
    lh: 'F2:5/w | F2:5/h C3:1/h | Bb2:2/h C3:1/h | F2:5/w | F2:5/h C3:1/h | F2:5/w | Bb2:2/h C3:1/h | F2:5/w',
  },
  'kleiner-walzer': {
    title: 'Kleiner Walzer', by: 'Klavier-Quest', style: 'Klassik', tempo: 96, key: 'C', ts: [3, 4],
    rh: 'E4:3/h. | G4:5/q. F4:4/e E4:3/q | D4:2/h. | F4:4/q. E4:3/e D4:2/q | C4:1/q E4:3 G4:5 | G4:5/q. F4:4/e E4:3/q | D4:2/q E4:3 D4:2 | C4:1/h.',
    lh: 'C3:5/h. | C3:5/h. | G3:1/h. | G3:1/h. | C3:5/h. | C3:5/h. | G3:1/h. | C3:5/h.',
  },
  'menuett-g': {
    title: 'Menuett in G', by: 'C. Petzold', style: 'Klassik', tempo: 92, key: 'G', ts: [3, 4],
    rh: 'D5:5/q G4:1/e A4:2 B4:3 C5:4 | D5:5/q G4:1 G4:1 | E5:3/q C5:1/e D5:2 E5:3 F#5:4 | G5:5/q G4:1 G4:1 | C5:4/q D5:5/e C5:4 B4:3 A4:2 | B4:3/q C5:4/e B4:3 A4:2 G4:1 | F#4:2/q G4:1/e A4:2 B4:3 G4:1 | A4:2/h. | D5:5/q G4:1/e A4:2 B4:3 C5:4 | D5:5/q G4:1 G4:1 | E5:3/q C5:1/e D5:2 E5:3 F#5:4 | G5:5/q G4:1 G4:1 | C5:4/q D5:5/e C5:4 B4:3 A4:2 | B4:3/q C5:4/e B4:3 A4:2 G4:1 | A4:2/q B4:3/e A4:2 G4:1 F#4:2 | G4:1/h.',
    lh: 'G3:1/h. | B2:3/h. | C3:2/h. | B2:3/h. | A2:4/h. | G2:5/h. | D3:1/h. | D3:1/h. | B2:3/h. | G2:5/h. | C3:2/h. | B2:3/h. | A2:4/h. | G2:5/h. | D3:1/h. | G2:5/h.',
  },
  // ---------- Welt 4
  'choral': {
    title: 'Choral', by: 'Klavier-Quest', style: 'Klassik', tempo: 66, key: 'C', ts: [4, 4],
    rh: 'E4:3/h D4:2/h | C4:1/h D4:2/h | E4:3/h F4:4/h | E4:3/w | G4:5/h F4:4/h | E4:3/h D4:2/h | C4:1/h D4:2/h | C4:1/w',
    lh: 'C3+E3+G3:5,3,1/h B2+D3+G3:5,3,1/h | C3+E3+G3:5,3,1/h B2+D3+G3:5,3,1/h | C3+E3+G3:5,3,1/h C3+F3+A3:5,2,1/h | C3+E3+G3:5,3,1/w | C3+E3+G3:5,3,1/h C3+F3+A3:5,2,1/h | C3+E3+G3:5,3,1/h B2+D3+G3:5,3,1/h | C3+F3+A3:5,2,1/h B2+D3+G3:5,3,1/h | C3+E3+G3:5,3,1/w',
  },
  'sternenstaub': {
    title: 'Sternenstaub', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 72, key: 'C', ts: [4, 4],
    rh: 'G4:5/w | E4:3/w | F4:4/h E4:3/h | D4:2/w | E4:3/h G4:5/h | E4:3/h C4:1/h | D4:2/h F4:4/h | E4:3/w',
    lh: 'C3:5/e G3:1 E3:3 G3:1 C3:5 G3:1 E3:3 G3:1 | A2:5/e E3:1 C3:3 E3:1 A2:5 E3:1 C3:3 E3:1 | F2:5/e C3:1 A2:3 C3:1 F2:5 C3:1 A2:3 C3:1 | G2:5/e D3:1 B2:3 D3:1 G2:5 D3:1 B2:3 D3:1 | C3:5/e G3:1 E3:3 G3:1 C3:5 G3:1 E3:3 G3:1 | A2:5/e E3:1 C3:3 E3:1 A2:5 E3:1 C3:3 E3:1 | G2:5/e D3:1 B2:3 D3:1 G2:5 D3:1 B2:3 D3:1 | C3+E3+G3:5,3,1/w',
  },
  'burg-im-nebel': {
    title: 'Burg im Nebel', by: 'Klavier-Quest', style: 'Game', tempo: 76, key: 'C', ts: [4, 4],
    rh: 'A4:1/q C5:3 E5:5 C5:3 | D5:4/q. C5:3/e B4:2/h | C5:3/q B4:2 A4:1 C5:3 | B4:2/w | A4:1/q C5:3 E5:5 C5:3 | D5:4/q. C5:3/e A4:1/h | B4:2/q D5:4 C5:3 B4:2 | A4:1/w',
    lh: 'A2:5/h E3:1/h | E3:1/h B2:4/h | A2:5/h C3:3/h | E3:1/w | A2:5/h E3:1/h | D3:2/h A2:5/h | E3:1/h B2:4/h | A2+C3+E3:5,3,1/w',
  },
  'heldenthema': {
    title: 'Heldenthema', by: 'Klavier-Quest', style: 'Game', tempo: 84, key: 'G', ts: [4, 4],
    rh: 'G4:1/q. G4:1/e D5:5/h | C5:4/q. B4:3/e A4:2/h | B4:3/q C5:4 D5:5 B4:3 | A4:2/w | G4:1/q. G4:1/e D5:5/h | C5:4/q. B4:3/e A4:2/q D5:5 | B4:3/q G4:1 A4:2 B4:3 | G4:1/w',
    lh: 'G2+B2+D3:5,3,1/h G2+B2+D3/h | G2+C3+E3:5,2,1/h G2+C3+E3/h | G2+B2+D3:5,3,1/h G2+B2+D3/h | F#2+A2+D3:5,3,1/w | G2+B2+D3:5,3,1/h G2+B2+D3/h | G2+C3+E3:5,2,1/h F#2+A2+D3:5,3,1/h | G2+B2+D3:5,3,1/h F#2+A2+D3:5,3,1/h | G2+B2+D3:5,3,1/w',
  },
  'drachenflug': {
    title: 'Drachenflug', by: 'Klavier-Quest', style: 'Game', tempo: 80, key: 'C', ts: [4, 4],
    rh: 'A4:1/q B4:2 C5:3 E5:5 | C5:3/h. A4:1/q | E5:5/q D5:4 C5:3 E5:5 | D5:4/w | A4:1/q B4:2 C5:3 E5:5 | C5:3/q. A4:1/e C5:3/q D5:4 | B4:2/q. G#4:1/e B4:2/q D5:4 | A4:1/w',
    lh: 'A2:5/e E3:1 C3:3 E3:1 A2:5 E3:1 C3:3 E3:1 | F2:5/e C3:1 A2:3 C3:1 F2:5 C3:1 A2:3 C3:1 | C3:5/e G3:1 E3:3 G3:1 C3:5 G3:1 E3:3 G3:1 | G2:5/e D3:1 B2:3 D3:1 G2:5 D3:1 B2:3 D3:1 | A2:5/e E3:1 C3:3 E3:1 A2:5 E3:1 C3:3 E3:1 | F2:5/e C3:1 A2:3 C3:1 F2:5 C3:1 A2:3 C3:1 | E2:5/e B2:1 G#2:3 B2:1 E2:5 B2:1 G#2:3 B2:1 | A2+C3+E3:5,3,1/w',
  },
  // ---------- Welt 5
  'tonleiter-c': {
    title: 'C-Dur-Tonleiter', by: 'Übung', style: 'Technik', tempo: 72, key: 'C', ts: [4, 4],
    rh: 'C4:1/q D4:2 E4:3 F4:1 | G4:2 A4:3 B4:4 C5:5 | C5:5 B4:4 A4:3 G4:2 | F4:1 E4:3 D4:2 C4:1',
  },
  'tonleiter-c-links': {
    title: 'C-Dur-Tonleiter links', by: 'Übung', style: 'Technik', tempo: 72, key: 'C', ts: [4, 4],
    lh: 'C3:5/q D3:4 E3:3 F3:2 | G3:1 A3:3 B3:2 C4:1 | C4:1 B3:2 A3:3 G3:1 | F3:2 E3:3 D3:4 C3:5',
  },
  'aufzug': {
    title: 'Aufzug', by: 'Klavier-Quest', style: 'Game', tempo: 80, key: 'C', ts: [4, 4],
    rh: 'C4:1/e D4:2 E4:3 F4:1 G4:2 A4:3 B4:4 C5:5 | G4:2/h C5:5/h | C5:5/e B4:4 A4:3 G4:2 F4:1 E4:3 D4:2 C4:1 | D4:2/h. r/q | E4:3/q F4:4 G4:5 E4:3 | F4:1/q G4:2 A4:3 F4:1 | G4:2/q A4:3 B4:4 G4:2 | C5:5/w',
    lh: 'C3:5/w | C3:5/h E3:3/h | F3:2/w | G3:1/w | C3:5/w | F3:2/w | G3:1/w | C3+E3+G3:5,3,1/w',
  },
  'sonnenaufgang-d': {
    title: 'Sonnenaufgang in D', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 76, key: 'D', ts: [4, 4],
    rh: 'D4:1/q F#4:3 A4:5 F#4:3 | G4:4/h E4:2/h | F#4:3/q G4:4 A4:5 G4:4 | F#4:3/w | A4:5/q G4:4 F#4:3 E4:2 | F#4:3/h D4:1/h | E4:2/q F#4:3 G4:4 E4:2 | D4:1/w',
    lh: 'D3:5/w | G3:2/h A3:1/h | D3:5/w | D3+F#3+A3:5,3,1/w | A3:1/w | D3:5/w | A3:1/w | D3+F#3+A3:5,3,1/w',
  },
  'daecher-sprint': {
    title: 'Dächer-Sprint', by: 'Klavier-Quest', style: 'Game', tempo: 84, key: 'C', ts: [4, 4],
    rh: 'C4:1/q E4:3 G4:5 r | G4:1/q B4:3 D5:5 r | C5:4/e B4:3 A4:2 G4:1 A4:2/q B4:3 | G4:1/h r/h | C4:1/q E4:3 G4:5 E4:3 | G4:1/q B4:3 D5:5 B4:3 | C5:4/q B4:3 A4:2 B4:3 | C5:4/w',
    lh: 'C3:5/w | G2:5/w | G2:5/h D3:1/h | G2:5/w | C3:5/w | G2:5/w | G2:5/w | C3:5/w',
  },
  'fuer-elise': {
    title: 'Für Elise – Thema (vereinfacht)', by: 'L. v. Beethoven', style: 'Klassik', tempo: 66, key: 'C', ts: [3, 4],
    rh: 'r/h E5:5/e D#5:4 | E5:5/e D#5:4 E5:5 B4:2 D5:4 C5:3 | A4:1/e r r C4:1 E4:2 A4:3 | B4:4/e r r E4:2 G#4:3 B4:4 | C5:5/e r r E4:1 E5:5 D#5:4 | E5:5/e D#5:4 E5:5 B4:2 D5:4 C5:3 | A4:1/e r r C4:1 E4:2 A4:3 | B4:4/e r r E4:2 C5:4 B4:3 | A4:2/h.',
    lh: 'r/h. | r/h. | A2:5/e E3:2 A3:1 r/e r/q | E2:5/e E3:2 G#3:1 r/e r/q | A2:5/e E3:2 A3:1 r/e r/q | r/h. | A2:5/e E3:2 A3:1 r/e r/q | E2:5/e E3:2 G#3:1 r/e r/q | A2+E3+A3:5,2,1/h.',
  },
  // ---------- Welt 6
  'neon-groove': {
    title: 'Neon-Groove', by: 'Klavier-Quest', style: 'Game', tempo: 88, key: 'C', ts: [4, 4],
    rh: 'A4:1/e C5:2/q A4:1/e C5:2/q D5:3 | E5:4/e D5:3/q C5:2/e A4:1/h | G4:1/e A4:2/q C5:3/e A4:2/q G4:1 | A4:2/w | A4:1/e C5:2/q A4:1/e C5:2/q D5:3 | E5:3/e G5:5/q E5:3/e D5:2/h | C5:2/e D5:3/q C5:2/e A4:1/q G4:1 | A4:1/w',
    lh: 'A2:5/q. A2:5/e r/q E3:1/q | F2:5/q. F2:5/e r/q C3:1/q | G2:5/q. G2:5/e r/q D3:1/q | A2:5/q. A2:5/e r/q E3:1/q | A2:5/q. A2:5/e r/q E3:1/q | F2:5/q. F2:5/e r/q C3:1/q | G2:5/q. G2:5/e r/q D3:1/q | A2+E3:5,1/w',
  },
  'nordlicht-walzer': {
    title: 'Nordlicht-Walzer', by: 'Klavier-Quest', style: 'Klassik', tempo: 108, key: 'C', ts: [3, 4],
    rh: 'E4:1/q G4:2 C5:4 | B4:3/h D5:5/q | D5:5/q. C5:4/e B4:3/q | C5:4/h. | A4:1/q C5:2 F5:5 | E5:4/h C5:2/q | D5:3/q. E5:4/e D5:3/q | C5:2/h.',
    lh: 'C3:5/q E3+G3:3,1 E3+G3:3,1 | G2:5/q B2+D3:2,1 B2+D3:2,1 | G2:5/q B2+D3:2,1 B2+D3:2,1 | C3:5/q E3+G3:3,1 E3+G3:3,1 | F2:5/q A2+C3:2,1 A2+C3:2,1 | C3:5/q E3+G3:3,1 E3+G3:3,1 | G2:5/q B2+D3:2,1 B2+D3:2,1 | C3+E3+G3:5,3,1/h.',
  },
  'abspann': {
    title: 'Abspann', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 72, key: 'C', ts: [4, 4],
    rh: 'E5:5/q. D5:4/e C5:3/h | C5:3/q. B4:2/e A4:1/h | G4:1/q C5:2 E5:4 G5:5 | F5:4/q E5:3 D5:2/h | E5:3/q. D5:2/e C5:1/q E5:3 | F5:4/q. E5:3/e C5:1/h | D5:2/q. C5:1/e B4:1/q D5:3 | C5:2/w',
    lh: 'A2:5/h E3:1/h | F2:5/h C3:1/h | C3:5/h G3:1/h | G2:5/h D3:1/h | A2:5/h E3:1/h | F2:5/h C3:1/h | G2:5/h D3:1/h | C3+E3+G3:5,3,1/w',
  },
  'ueber-den-wolken': {
    title: 'Über den Wolken', by: 'Klavier-Quest', style: 'Soundtrack', tempo: 80, key: 'G', ts: [4, 4],
    rh: 'B4:3/q. A4:2/e G4:1/q D5:5 | E5:5/q. D5:4/e B4:2/h | C5:3/e B4:2 A4:1 G4:1 E5:5/h | D5:5/q. C5:4/e A4:2/h | B4:3/q. A4:2/e G4:1/q D5:5 | G5:5/q. F#5:4/e E5:3/h | E5:3/e D5:2 C5:1 E5:3 D5:2/q A4:1 | G4:1/w',
    lh: 'G2:5/e D3:1 B2:3 D3:1 G2:5 D3:1 B2:3 D3:1 | E2:5/e B2:1 G2:3 B2:1 E2:5 B2:1 G2:3 B2:1 | C3:5/e G3:1 E3:3 G3:1 C3:5 G3:1 E3:3 G3:1 | D3:5/e A3:1 F#3:3 A3:1 D3:5 A3:1 F#3:3 A3:1 | G2:5/e D3:1 B2:3 D3:1 G2:5 D3:1 B2:3 D3:1 | E2:5/e B2:1 G2:3 B2:1 E2:5 B2:1 G2:3 B2:1 | C3:5/e G3:1 E3:3 G3:1 D3:5 A3:1 F#3:3 A3:1 | G2+B2+D3:5,3,1/w',
  },
};
