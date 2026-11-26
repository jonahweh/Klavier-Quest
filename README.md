# Klavier-Quest 🎹

Eine Web-App zum Wiedereinstieg ins Klavier- und Kontrabassspielen: Noten lesen und in Echtzeit spielen, vom **Beginner** bis zum **Ultra-God**.

**App öffnen:** https://jonahweh.github.io/Klavier-Quest/

## Funktionen
- **8 Welten** von Beginner über Intermediate bis **Pro** (Umkehrungen, Pop-Begleitung, Improvisation) und **Ultra-God** (Sechzehntel, Konzertstücke, Blattspiel in allen Tonarten)
- Lektionen mit Theorie-Karten, Blattspiel-Übungen (bei jedem Versuch neu generiert) und Stücken
- **Boss-Stücke** am Ende jeder Welt (Rhythmus-Modus, ab 2 Sternen geschafft)
- **Mikrofon-Erkennung** für Klavier, Keyboard und Kontrabass (kein MIDI nötig); MIDI ist für Chrome/Edge vorbereitet
- **Warte-Modus** und **Rhythmus-Modus**, Hilfen mit Übergang (Notennamen → leuchtende Tasten → ohne)
- **Takt-Schleife** mit automatischer Tempo-Steigerung, Sprung zu Taktnummern, Tempo wird pro Stück gemerkt
- **Aufnahme** deines Spiels zum Nachhören
- **Schwachstellen-Statistik**: welche Töne oft danebengehen, mit gezielter Übung
- **Tonleiter-Trainer**, **Jam-Session** zum Improvisieren mit Begleitband
- **Eigene Stücke** eintippen und üben
- **Einrichtungs-Assistent** für Mikrofon, Empfindlichkeit und Timing
- Extras: Notenlese-Sprint, Gehörtraining, Theorie-Bibliothek, Wunschstücke
- XP, Level bis „Ultra-God“, Sterne, Tagesziel, Serien, Erfolge, **Dunkelmodus**
- Fortschritt per **Cloud-Sync** (privates GitHub-Gist) oder Sync-Code zwischen Geräten übertragen

## Kontrabass-Modus
Oben auf der Startseite zwischen **Klavier** und **Kontrabass** umschalten:
- **9 Welten**: leere Saiten & I. Lage → untere Lagen → Tonarten → Walking Bass → mittlere Lagen → Orchester & Groove → **Repertoire** (Tschaikowsky, Mahler, Bach, Mozart, Beethoven, Grieg, Filmmusik-Stil) → **Daumenlage** (Pro) → **Probespiel** (Ultra-God)
- **Simandl-Fingersatz** automatisch in den Noten, inklusive Daumenlage (Daumenzeichen, Violinschlüssel für hohe Stellen)
- **Griffbrett** mit Saite, Lage und Finger der nächsten Note, **Intonations-Nadel** in Cent
- Optionale **Begleitung** (Klavier + Schlagzeug), auch über Bluetooth-Box mit „Mitspielen“
- **Stimmgerät**, Notenlese-Sprint im Bassschlüssel, Gehörtraining auf dem Bass

## Cloud-Sync einrichten
1. Auf github.com → Settings → Developer settings → Personal access tokens → **Tokens (classic)** → neuen Token erstellen, nur Haken bei **gist**
2. In der App: Einstellungen → Cloud-Sync → Token einfügen → Synchronisieren
3. Auf dem zweiten Gerät denselben Token eintragen. Der Token bleibt nur auf dem jeweiligen Gerät gespeichert.

## Tipps fürs iPad
- In Safari öffnen → Teilen → „Zum Home-Bildschirm“ → startet wie eine App im Vollbild
- Mikrofon erlauben; iPad nah ans Instrument legen
- Einmal den Einrichtungs-Assistenten durchlaufen

## Technik
Reines HTML/CSS/JavaScript ohne Build-Schritt. Notensatz in SVG mit Bravura-Glyphen (SIL Open Font License).
Stücke: eigene Kompositionen sowie gemeinfreie Werke (u. a. Beethoven, Petzold, Bach, Mozart, Tschaikowsky, Grieg, Mahler). Probespiel- und Filmmusik-Stücke sind Eigenkompositionen im jeweiligen Stil.
