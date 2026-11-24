# Klavier-Quest 🎹

Eine Web-App zum Wiedereinstieg ins Klavierspielen: Noten lesen und in Echtzeit spielen, vom **Beginner** bis zum **Intermediate**.

**App öffnen:** https://jonahweh.github.io/Klavier-Quest/

## Funktionen
- **6 Welten** mit Lektionen, Theorie-Karten, Blattspiel-Übungen (bei jedem Versuch neu generiert) und Stücken
- **Boss-Stücke** am Ende jeder Welt (Rhythmus-Modus, ab 2 Sternen geschafft) – jede Welt lässt sich direkt per Boss überspringen
- **Mikrofon-Erkennung**: Die App hört dein Klavier oder Keyboard (kein MIDI nötig). MIDI-Unterstützung ist für Chrome/Edge am Computer vorbereitet
- **Warte-Modus** (die App wartet auf die richtige Note) und **Rhythmus-Modus** (läuft im Tempo, bewertet das Timing)
- Hilfen mit Übergang: Notennamen → leuchtende Tasten → ohne
- XP, Level bis „Ultra-God“, Sterne, Tagesziel, Serien, Erfolge
- Extras: **Notenlese-Sprint**, **Gehörtraining** (Höher/Tiefer, Intervalle, Dur/Moll, Nachspielen), **Theorie-Bibliothek**
- Fortschritt per **Sync-Code** zwischen iPad und iPhone übertragen

## Kontrabass-Modus
Oben auf der Startseite zwischen **Klavier** und **Kontrabass** umschalten. Der Kontrabass-Modus hat:
- **6 eigene Welten**: leere Saiten & I. Lage → untere Lagen → Tonarten & Rhythmus → **Walking Bass** → mittlere Lagen → Orchester & Groove
- Arco und Pizzicato, Klassik (u. a. Pachelbel-Kanon, Ode an die Freude) und Jazz (Blues, Walking Bass)
- **Simandl-Fingersatz (1-2-4)** und Lagenangaben automatisch in den Noten
- **Griffbrett** statt Klaviatur: zeigt Saite, Lage und Finger der nächsten Note
- **Intonations-Nadel** in Cent; Wertung streng (±15 ct), einstellbar
- Optionale **Begleitung** (Klavier + Schlagzeug: Swing, Straight, Walzer, klassisch) im Rhythmus-Modus – am besten mit Kopfhörern
- **Stimmgerät**, Notenlese-Sprint im Bassschlüssel, Gehörtraining zum Nachspielen auf dem Bass

## Tipps fürs iPad
- In Safari öffnen → Teilen → „Zum Home-Bildschirm“ → startet wie eine App im Vollbild
- Mikrofon erlauben; iPad nah ans Instrument legen
- Erst den Mikrofon-Test in den Einstellungen machen

## Technik
Reines HTML/CSS/JavaScript ohne Build-Schritt. Notensatz in SVG mit Bravura-Glyphen (SIL Open Font License).
Stücke: eigene Kompositionen sowie gemeinfreie Werke von Beethoven und Petzold.
