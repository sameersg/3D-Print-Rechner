/**
 * 3D-Druck Kostenrechner v2 – Berechnungslogik
 * -----------------------------------------------
 * Enthält: Material, Strom, Arbeit, Druckerverschleiß,
 * Ausschuss, Shopify-Gebühren, MwSt, Gewinnmarge.
 * Alle Werte in Echtzeit bei jeder Eingabeänderung.
 */

(function () {
  'use strict';

  // ===== Konstante: geschätzte Drucker-Lebensdauer (intern, nicht sichtbar) =====
  const PRINTER_LIFETIME_HOURS = 2000;

  // ===== DOM-Referenzen: Eingabefelder =====
  const elFilamentPrice    = document.getElementById('filamentPrice');       // €/kg
  const elFilamentUsed     = document.getElementById('filamentUsed');        // g
  const elPrintTimeHours   = document.getElementById('printTimeHours');      // h
  const elPrintTimeMinutes = document.getElementById('printTimeMinutes');    // min
  const elPowerConsumption = document.getElementById('powerConsumption');    // W
  const elElectricityPrice = document.getElementById('electricityPrice');    // €/kWh
  const elLaborMinutes     = document.getElementById('laborMinutes');        // min
  const elHourlyWage       = document.getElementById('hourlyWage');          // €/h
  const elPrinterCost      = document.getElementById('printerCost');         // €
  const elFailureRate      = document.getElementById('failureRate');         // %
  const elExtraCosts       = document.getElementById('extraCosts');          // €
  const elPackagingCost    = document.getElementById('packagingCost');       // €
  const elShopifyFeePct    = document.getElementById('shopifyFeePercent');   // %
  const elShopifyMonthly   = document.getElementById('shopifyMonthly');      // €
  const elEstSalesMonth    = document.getElementById('estimatedSalesMonth'); // Stück/Monat
  const elTaxRate          = document.getElementById('taxRate');             // %
  const elMarginSlider     = document.getElementById('marginSlider');        // 0-80

  // ===== DOM-Referenzen: Ausgabefelder =====
  const outMaterialCost      = document.getElementById('materialCost');
  const outElectricityCost   = document.getElementById('electricityCost');
  const outLaborCost         = document.getElementById('laborCost');
  const outDepreciationCost  = document.getElementById('depreciationCost');
  const outExtraCost         = document.getElementById('extraCostDisplay');
  const outPackagingCost     = document.getElementById('packagingCostDisplay');
  const outFailureSurcharge  = document.getElementById('failureSurcharge');
  const outTotalCost         = document.getElementById('totalCost');
  const outNettoPrice        = document.getElementById('nettoPrice');
  const outShopifyFee        = document.getElementById('shopifyFeeDisplay');
  const outShopifyMonthShare = document.getElementById('shopifyMonthlyShare');
  const outTaxAmount         = document.getElementById('taxAmount');
  const outBruttoPrice       = document.getElementById('bruttoPrice');
  const outProfitPerUnit     = document.getElementById('profitPerUnit');
  const outMarginDisplay     = document.getElementById('marginDisplay');
  const outFeePercentLabel   = document.getElementById('feePercentLabel');
  const outTaxRateLabel      = document.getElementById('taxRateLabel');

  // ===== Hilfsfunktionen =====

  /** Numerischen Wert aus Eingabefeld lesen (0 bei leer/negativ) */
  function getVal(el) {
    const v = parseFloat(el.value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  /** Euro-Formatierung: deutsches Format, 2 Nachkommastellen */
  function formatEuro(value) {
    return value.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €';
  }

  // ===== Hauptberechnung =====
  function calculate() {
    // --- Eingabewerte auslesen ---
    const filamentPricePerKg  = getVal(elFilamentPrice);       // €/kg
    const filamentUsedGrams   = getVal(elFilamentUsed);         // g
    const printHours          = getVal(elPrintTimeHours);        // h
    const printMinutes        = getVal(elPrintTimeMinutes);      // min
    const powerWatts          = getVal(elPowerConsumption);      // W
    const electricityPriceKWh = getVal(elElectricityPrice);      // €/kWh
    const laborMin            = getVal(elLaborMinutes);          // min
    const hourlyWage          = getVal(elHourlyWage);            // €/h
    const printerCost         = getVal(elPrinterCost);           // €
    const failureRate         = getVal(elFailureRate);           // %
    const extraCosts          = getVal(elExtraCosts);            // €
    const packagingCost       = getVal(elPackagingCost);         // €
    const shopifyFeePct       = getVal(elShopifyFeePct);         // %
    const shopifyMonthly      = getVal(elShopifyMonthly);        // €
    const estSalesMonth       = Math.max(1, getVal(elEstSalesMonth)); // min 1
    const taxRate             = getVal(elTaxRate);               // %
    const marginPercent       = getVal(elMarginSlider);          // 0-80

    // --- Gesamte Druckzeit in Stunden ---
    const totalPrintTimeH = printHours + (printMinutes / 60);

    // ==========================================
    //  1. SELBSTKOSTEN (Netto-Herstellungskosten)
    // ==========================================

    // Materialkosten = (Preis pro kg / 1000) * verbrauchte Gramm
    const materialCost = (filamentPricePerKg / 1000) * filamentUsedGrams;

    // Stromkosten = (Leistung in kW) * Druckzeit * Strompreis
    const electricityCost = (powerWatts / 1000) * totalPrintTimeH * electricityPriceKWh;

    // Arbeitskosten = (Arbeitszeit in h) * Stundenlohn
    const laborCost = (laborMin / 60) * hourlyWage;

    // Druckerverschleiß = Druckerpreis / Lebensdauer * Druckzeit
    const depreciationCost = (printerCost / PRINTER_LIFETIME_HOURS) * totalPrintTimeH;

    // Zwischensumme vor Ausschuss
    // Versandmaterial (Karton, Polster, Klebeband) ist Teil der Selbstkosten
    const subtotal = materialCost + electricityCost + laborCost + depreciationCost + extraCosts + packagingCost;

    // Ausschuss-Aufschlag = Zwischensumme * (Ausschussrate / 100)
    const failureSurcharge = subtotal * (failureRate / 100);

    // Gesamte Selbstkosten
    const totalCost = subtotal + failureSurcharge;

    // ==========================================
    //  2. VERKAUFSPREIS-BERECHNUNG
    // ==========================================

    // Netto-Verkaufspreis = Selbstkosten / (1 - Marge)
    const marginDecimal = marginPercent / 100;
    const nettoPrice = marginDecimal < 1 ? totalCost / (1 - marginDecimal) : totalCost;

    // Anteilige Shopify-Monatsgebühr pro Bestellung
    const shopifyMonthShare = shopifyMonthly / estSalesMonth;

    // Zwischensumme vor Shopify-Transaktionsgebühr (ohne Versand – der Kunde zahlt Versand separat)
    const subtotalBeforeFee = nettoPrice + shopifyMonthShare;

    // Shopify Transaktionsgebühr (% vom Gesamtbetrag)
    // Formel: finalAmount = subtotalBeforeFee / (1 - feeRate), dann fee = finalAmount - subtotalBeforeFee
    const feeDecimal = shopifyFeePct / 100;
    const amountAfterFee = feeDecimal < 1 ? subtotalBeforeFee / (1 - feeDecimal) : subtotalBeforeFee;
    const shopifyFeeAmount = amountAfterFee - subtotalBeforeFee;

    // Netto-Gesamtbetrag (inkl. Versand + Gebühren)
    const nettoTotal = amountAfterFee;

    // MwSt
    const taxAmount = nettoTotal * (taxRate / 100);

    // Brutto-Verkaufspreis
    const bruttoPrice = nettoTotal + taxAmount;

    // Gewinn pro Stück = Netto-Verkaufspreis - Selbstkosten
    const profitPerUnit = nettoPrice - totalCost;

    // ==========================================
    //  3. ERGEBNISSE IN DIE UI SCHREIBEN
    // ==========================================

    // Kostenaufstellung
    outMaterialCost.textContent     = formatEuro(materialCost);
    outElectricityCost.textContent  = formatEuro(electricityCost);
    outLaborCost.textContent        = formatEuro(laborCost);
    outDepreciationCost.textContent = formatEuro(depreciationCost);
    outExtraCost.textContent        = formatEuro(extraCosts);
    outPackagingCost.textContent    = formatEuro(packagingCost);
    outFailureSurcharge.textContent = formatEuro(failureSurcharge);
    outTotalCost.textContent        = formatEuro(totalCost);

    // Verkaufspreis-Berechnung
    outNettoPrice.textContent        = formatEuro(nettoPrice);
    outShopifyFee.textContent        = formatEuro(shopifyFeeAmount);
    outShopifyMonthShare.textContent = formatEuro(shopifyMonthShare);
    outTaxAmount.textContent         = formatEuro(taxAmount);
    outBruttoPrice.textContent       = formatEuro(bruttoPrice);
    outProfitPerUnit.textContent     = formatEuro(profitPerUnit);

    // Labels aktualisieren
    outFeePercentLabel.textContent = shopifyFeePct;
    outTaxRateLabel.textContent    = taxRate;
    outMarginDisplay.textContent   = marginPercent + ' %';
  }

  // ===== Event-Listener =====
  const allInputs = [
    elFilamentPrice, elFilamentUsed, elPrintTimeHours, elPrintTimeMinutes,
    elPowerConsumption, elElectricityPrice, elLaborMinutes, elHourlyWage,
    elPrinterCost, elFailureRate, elExtraCosts, elPackagingCost,
    elShopifyFeePct, elShopifyMonthly, elEstSalesMonth, elTaxRate,
    elMarginSlider,
  ];

  allInputs.forEach(function (input) {
    input.addEventListener('input', calculate);
  });

  // ===== Drucken-Button =====
  document.getElementById('btnPrint').addEventListener('click', function () {
    window.print();
  });

  // ===== Initiale Berechnung =====
  calculate();
})();
