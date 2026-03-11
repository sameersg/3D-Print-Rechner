# 3D-Druck Kostenrechner 🖨️

Ein moderner, responsiver Kostenrechner für 3D-Druck-Projekte – optimiert für den Einsatz als Shopify-Preiskalkulationstool.

**[🔗 Live Demo](https://sameersg.github.io/3D-Print-Rechner/)**

![Screenshot](https://img.shields.io/badge/status-live-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Features

- ⚡ **Echtzeit-Berechnung** – Alle Kosten aktualisieren sich live bei jeder Eingabe
- 🎚️ **Gewinnmarge-Slider** – Frei einstellbar von 0–80 %
- 🧾 **MwSt-Berechnung** – 19 % (oder anpassbar)
- 💳 **Shopify Gebühren** – Transaktionsgebühr (5 % Starter Plan) + anteiliger Monatsbeitrag
- 🖨️ **Druckerverschleiß** – Automatische Abschreibung (Bambu Lab A1 + AMS Lite als Standard)
- 🔄 **Ausschussrate** – Fehldrucke einkalkuliert
- 📦 **Versandmaterial** – Verpackungskosten als Teil der Selbstkosten
- 📱 **Responsives Design** – Desktop, Tablet & Mobile
- 🖨️ **PDF-Export** – Drucken / als PDF speichern mit sauberem Print-Layout

## Kostenaufstellung

Der Rechner berechnet folgende Posten:

| Kostenart | Formel |
|-----------|--------|
| Materialkosten | `(Filamentpreis / 1000) × Filamentverbrauch` |
| Stromkosten | `(Watt / 1000) × Druckzeit × Strompreis` |
| Arbeitskosten | `(Minuten / 60) × Stundenlohn` |
| Druckerverschleiß | `Druckerpreis / 2000h × Druckzeit` |
| Ausschuss | `Zwischensumme × Ausschussrate %` |

**Verkaufspreis** = `Selbstkosten / (1 - Marge)` + Shopify-Gebühren + MwSt

## Tech Stack

- **HTML5** – Semantisches Markup
- **CSS3** – Custom Properties, Grid, Flexbox, Print Styles
- **Vanilla JavaScript** – Keine Abhängigkeiten, kein Build-Prozess
- **Google Fonts** – Inter

## Lokale Nutzung

Einfach `index.html` im Browser öffnen – kein Server nötig.

```bash
git clone https://github.com/sameersg/3D-Print-Rechner.git
cd 3D-Print-Rechner
open index.html
```

## Standardwerte

Vorkonfiguriert für **Bambu Lab A1 + AMS Lite**:
- Druckerpreis: 339 €
- Stromverbrauch: 100 W (Durchschnitt)
- Shopify Starter Plan: 5 % Gebühr, 5 €/Monat
- MwSt: 19 % (Deutschland)

## Lizenz

MIT
