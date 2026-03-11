/**
 * 3D-Druck Kostenrechner – Berechnungslogik
 * -------------------------------------------
 * Alle Kosten werden in Echtzeit bei jeder Eingabeänderung neu berechnet.
 */

(function () {
  'use strict';

  // ===== DOM-Referenzen: Eingabefelder =====
  const inputFilamentPrice    = document.getElementById('filamentPrice');      // €/kg
  const inputFilamentUsed     = document.getElementById('filamentUsed');       // Gramm
  const inputPrintTime        = document.getElementById('printTime');          // Stunden
  const inputPowerConsumption = document.getElementById('powerConsumption');   // Watt
  const inputElectricityPrice = document.getElementById('electricityPrice');   // €/kWh
  const inputLaborMinutes     = document.getElementById('laborMinutes');       // Minuten
  const inputHourlyWage       = document.getElementById('hourlyWage');         // €/Stunde
  const inputExtraCosts       = document.getElementById('extraCosts');         // €

  // ===== DOM-Referenzen: Ausgabefelder =====
  const outputMaterialCost    = document.getElementById('materialCost');
  const outputElectricityCost = document.getElementById('electricityCost');
  const outputLaborCost       = document.getElementById('laborCost');
  const outputExtraCost       = document.getElementById('extraCostDisplay');
  const outputTotalCost       = document.getElementById('totalCost');
  const outputPrice25         = document.getElementById('priceVal25');
  const outputPrice40         = document.getElementById('priceVal40');
  const outputPrice60         = document.getElementById('priceVal60');
  const outputPrice80         = document.getElementById('priceVal80');

  // ===== Hilfsfunktionen =====

  /**
   * Liest den numerischen Wert aus einem Eingabefeld.
   * Gibt 0 zurück, wenn das Feld leer oder ungültig ist.
   */
  function getVal(el) {
    const v = parseFloat(el.value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  /**
   * Formatiert eine Zahl als Euro-Betrag mit genau zwei Nachkommastellen.
   * Verwendet deutsches Nummernformat (Komma als Dezimaltrenner).
   */
  function formatEuro(value) {
    return value.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €';
  }

  // ===== Hauptberechnung =====
  function calculate() {
    // Werte auslesen
    const filamentPricePerKg  = getVal(inputFilamentPrice);      // €/kg
    const filamentUsedGrams   = getVal(inputFilamentUsed);       // g
    const printTimeHours      = getVal(inputPrintTime);          // h
    const powerWatts          = getVal(inputPowerConsumption);   // W
    const electricityPriceKWh = getVal(inputElectricityPrice);   // €/kWh
    const laborMin            = getVal(inputLaborMinutes);       // min
    const hourlyWage          = getVal(inputHourlyWage);         // €/h
    const extraCosts          = getVal(inputExtraCosts);         // €

    // --- Berechnung der Einzelkosten ---

    // Materialkosten = (Preis pro kg / 1000) * verbrauchte Gramm
    const materialCost = (filamentPricePerKg / 1000) * filamentUsedGrams;

    // Stromkosten = (Leistung in kW) * Druckzeit in h * Strompreis pro kWh
    const electricityCost = (powerWatts / 1000) * printTimeHours * electricityPriceKWh;

    // Arbeitskosten = (Arbeitszeit in Stunden) * Stundenlohn
    const laborCost = (laborMin / 60) * hourlyWage;

    // --- Gesamte Selbstkosten ---
    const totalCost = materialCost + electricityCost + laborCost + extraCosts;

    // --- Verkaufspreise basierend auf Gewinnmargen ---
    // Formel: Verkaufspreis = Selbstkosten / (1 - Marge)
    const price25 = totalCost / (1 - 0.25);   // 25 % Marge – Wettbewerbsfähig
    const price40 = totalCost / (1 - 0.40);   // 40 % Marge – Standard
    const price60 = totalCost / (1 - 0.60);   // 60 % Marge – Premium
    const price80 = totalCost / (1 - 0.80);   // 80 % Marge – Luxus

    // --- Ergebnisse in die UI schreiben ---
    outputMaterialCost.textContent    = formatEuro(materialCost);
    outputElectricityCost.textContent = formatEuro(electricityCost);
    outputLaborCost.textContent       = formatEuro(laborCost);
    outputExtraCost.textContent       = formatEuro(extraCosts);
    outputTotalCost.textContent       = formatEuro(totalCost);

    outputPrice25.textContent = formatEuro(price25);
    outputPrice40.textContent = formatEuro(price40);
    outputPrice60.textContent = formatEuro(price60);
    outputPrice80.textContent = formatEuro(price80);
  }

  // ===== Event-Listener: Live-Update bei jeder Eingabeänderung =====
  const allInputs = [
    inputFilamentPrice,
    inputFilamentUsed,
    inputPrintTime,
    inputPowerConsumption,
    inputElectricityPrice,
    inputLaborMinutes,
    inputHourlyWage,
    inputExtraCosts,
  ];

  allInputs.forEach(function (input) {
    input.addEventListener('input', calculate);
  });

  // ===== Drucken-Button =====
  document.getElementById('btnPrint').addEventListener('click', function () {
    window.print();
  });

  // ===== Initiale Berechnung beim Laden =====
  calculate();
})();
