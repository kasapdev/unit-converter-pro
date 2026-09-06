/* =====================================================================
   Unit Converter Pro — app.js
   Instant bidirectional conversion across 7 categories. Static factors
   only (no live rates). Classic script (no modules). Depends on
   window.WUS (core.js).
   ===================================================================== */
(function () {
  'use strict';

  var WUS = window.WUS;
  var STORE_KEY = 'unitconv.state';

  /* =================================================================
     CATEGORY DEFINITIONS
     Every category has a base unit; each unit converts to/from that
     base via a static `factor` (base = value * factor), except
     `temperature`, which is non-linear and uses toBase/fromBase
     functions expressed in Celsius as the base.
     ================================================================= */
  var CATEGORIES = {
    length: {
      label: 'Length',
      units: [
        { key: 'mm', label: 'Millimeters', abbr: 'mm', factor: 0.001 },
        { key: 'cm', label: 'Centimeters', abbr: 'cm', factor: 0.01 },
        { key: 'm', label: 'Meters', abbr: 'm', factor: 1 },
        { key: 'km', label: 'Kilometers', abbr: 'km', factor: 1000 },
        { key: 'in', label: 'Inches', abbr: 'in', factor: 0.0254 },
        { key: 'ft', label: 'Feet', abbr: 'ft', factor: 0.3048 },
        { key: 'yd', label: 'Yards', abbr: 'yd', factor: 0.9144 },
        { key: 'mi', label: 'Miles', abbr: 'mi', factor: 1609.344 },
        { key: 'nmi', label: 'Nautical miles', abbr: 'nmi', factor: 1852 }
      ]
    },
    mass: {
      label: 'Weight / Mass',
      units: [
        { key: 'mg', label: 'Milligrams', abbr: 'mg', factor: 0.000001 },
        { key: 'g', label: 'Grams', abbr: 'g', factor: 0.001 },
        { key: 'kg', label: 'Kilograms', abbr: 'kg', factor: 1 },
        { key: 'tonne', label: 'Tonnes', abbr: 't', factor: 1000 },
        { key: 'oz', label: 'Ounces', abbr: 'oz', factor: 0.028349523125 },
        { key: 'lb', label: 'Pounds', abbr: 'lb', factor: 0.45359237 },
        { key: 'stone', label: 'Stone', abbr: 'st', factor: 6.35029318 },
        { key: 'uston', label: 'US tons', abbr: 'US tn', factor: 907.18474 }
      ]
    },
    temperature: {
      label: 'Temperature',
      special: 'temperature',
      units: [
        { key: 'c', label: 'Celsius', abbr: '°C' },
        { key: 'f', label: 'Fahrenheit', abbr: '°F' },
        { key: 'k', label: 'Kelvin', abbr: 'K' }
      ]
    },
    area: {
      label: 'Area',
      units: [
        { key: 'mm2', label: 'Sq. millimeters', abbr: 'mm²', factor: 0.000001 },
        { key: 'cm2', label: 'Sq. centimeters', abbr: 'cm²', factor: 0.0001 },
        { key: 'm2', label: 'Sq. meters', abbr: 'm²', factor: 1 },
        { key: 'hectare', label: 'Hectares', abbr: 'ha', factor: 10000 },
        { key: 'km2', label: 'Sq. kilometers', abbr: 'km²', factor: 1000000 },
        { key: 'in2', label: 'Sq. inches', abbr: 'in²', factor: 0.00064516 },
        { key: 'ft2', label: 'Sq. feet', abbr: 'ft²', factor: 0.09290304 },
        { key: 'acre', label: 'Acres', abbr: 'ac', factor: 4046.8564224 },
        { key: 'mi2', label: 'Sq. miles', abbr: 'mi²', factor: 2589988.110336 }
      ]
    },
    volume: {
      label: 'Volume',
      units: [
        { key: 'mL', label: 'Milliliters', abbr: 'mL', factor: 0.001 },
        { key: 'L', label: 'Liters', abbr: 'L', factor: 1 },
        { key: 'm3', label: 'Cubic meters', abbr: 'm³', factor: 1000 },
        { key: 'tsp', label: 'US teaspoons', abbr: 'tsp', factor: 0.00492892159375 },
        { key: 'tbsp', label: 'US tablespoons', abbr: 'tbsp', factor: 0.01478676478125 },
        { key: 'floz', label: 'US fluid ounces', abbr: 'fl oz', factor: 0.0295735295625 },
        { key: 'cup', label: 'US cups', abbr: 'cup', factor: 0.2365882365 },
        { key: 'pint', label: 'US pints', abbr: 'pt', factor: 0.473176473 },
        { key: 'quart', label: 'US quarts', abbr: 'qt', factor: 0.946352946 },
        { key: 'gallon', label: 'US gallons', abbr: 'gal', factor: 3.785411784 },
        { key: 'impgallon', label: 'Imperial gallons', abbr: 'imp gal', factor: 4.54609 }
      ]
    },
    speed: {
      label: 'Speed',
      units: [
        { key: 'mps', label: 'Meters/second', abbr: 'm/s', factor: 1 },
        { key: 'kph', label: 'Kilometers/hour', abbr: 'km/h', factor: 0.277777777778 },
        { key: 'mph', label: 'Miles/hour', abbr: 'mph', factor: 0.44704 },
        { key: 'knot', label: 'Knots', abbr: 'kn', factor: 0.514444444444 },
        { key: 'fps', label: 'Feet/second', abbr: 'ft/s', factor: 0.3048 }
      ]
    },
    digital: {
      label: 'Digital Storage',
      note: 'Decimal (1000-based, SI) and binary (1024-based, IEC) units are both listed — pick the ones you need.',
      units: [
        { key: 'bit', label: 'Bits', abbr: 'bit', factor: 1 },
        { key: 'byte', label: 'Bytes', abbr: 'B', factor: 8 },
        { key: 'KB', label: 'Kilobytes (1000)', abbr: 'KB', factor: 8 * 1e3 },
        { key: 'MB', label: 'Megabytes (1000)', abbr: 'MB', factor: 8 * 1e6 },
        { key: 'GB', label: 'Gigabytes (1000)', abbr: 'GB', factor: 8 * 1e9 },
        { key: 'TB', label: 'Terabytes (1000)', abbr: 'TB', factor: 8 * 1e12 },
        { key: 'PB', label: 'Petabytes (1000)', abbr: 'PB', factor: 8 * 1e15 },
        { key: 'KiB', label: 'Kibibytes (1024)', abbr: 'KiB', factor: 8 * Math.pow(1024, 1) },
        { key: 'MiB', label: 'Mebibytes (1024)', abbr: 'MiB', factor: 8 * Math.pow(1024, 2) },
        { key: 'GiB', label: 'Gibibytes (1024)', abbr: 'GiB', factor: 8 * Math.pow(1024, 3) },
        { key: 'TiB', label: 'Tebibytes (1024)', abbr: 'TiB', factor: 8 * Math.pow(1024, 4) },
        { key: 'PiB', label: 'Pebibytes (1024)', abbr: 'PiB', factor: 8 * Math.pow(1024, 5) }
      ]
    }
  };

  var CATEGORY_ORDER = ['length', 'mass', 'temperature', 'area', 'volume', 'speed', 'digital'];

  /* Temperature is non-linear: base = Celsius. */
  var TEMP_TO_C = {
    c: function (v) { return v; },
    f: function (v) { return (v - 32) * 5 / 9; },
    k: function (v) { return v - 273.15; }
  };
  var TEMP_FROM_C = {
    c: function (v) { return v; },
    f: function (v) { return v * 9 / 5 + 32; },
    k: function (v) { return v + 273.15; }
  };

  function toBase(catKey, unitKey, value) {
    var cat = CATEGORIES[catKey];
    if (cat.special === 'temperature') return TEMP_TO_C[unitKey](value);
    var unit = unitByKey(cat, unitKey);
    return value * unit.factor;
  }
  function fromBase(catKey, unitKey, baseValue) {
    var cat = CATEGORIES[catKey];
    if (cat.special === 'temperature') return TEMP_FROM_C[unitKey](baseValue);
    var unit = unitByKey(cat, unitKey);
    return baseValue / unit.factor;
  }
  function unitByKey(cat, key) {
    for (var i = 0; i < cat.units.length; i++) if (cat.units[i].key === key) return cat.units[i];
    return null;
  }

  /* =================================================================
     NUMBER FORMATTING — avoid float noise, trim trailing zeros
     ================================================================= */
  function formatNumber(n) {
    if (n === null || n === undefined || !isFinite(n)) return '';
    if (Object.is(n, -0)) n = 0;
    var abs = Math.abs(n);
    if (abs !== 0 && (abs < 1e-9 || abs >= 1e18)) {
      return n.toExponential(6).replace(/(\.\d*?)0+e/, '$1e').replace(/\.e/, 'e');
    }
    var rounded = Number(n.toPrecision(12));
    return rounded.toString();
  }

  /* =================================================================
     STATE
     ================================================================= */
  var state = {
    category: 'length',
    bases: {} // categoryKey -> numeric base value (or undefined if empty)
  };

  var categoryTabs = document.getElementById('categoryTabs');
  var categoryTitle = document.getElementById('categoryTitle');
  var categoryNote = document.getElementById('categoryNote');
  var unitGrid = document.getElementById('unitGrid');
  var statusText = document.getElementById('statusText');
  var btnClear = document.getElementById('btnClear');

  /* =================================================================
     RENDER
     ================================================================= */
  function renderGrid(catKey) {
    var cat = CATEGORIES[catKey];
    unitGrid.innerHTML = '';

    cat.units.forEach(function (unit) {
      var field = document.createElement('div');
      field.className = 'unit-field';

      var head = document.createElement('div');
      head.className = 'unit-field-head';
      var label = document.createElement('label');
      label.setAttribute('for', 'unit-' + unit.key);
      label.textContent = unit.label;
      var abbr = document.createElement('span');
      abbr.className = 'unit-abbr';
      abbr.textContent = unit.abbr;
      head.appendChild(label);
      head.appendChild(abbr);

      var input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'decimal';
      input.id = 'unit-' + unit.key;
      input.setAttribute('data-unit', unit.key);
      input.setAttribute('aria-label', unit.label + ' (' + unit.abbr + ')');
      input.autocomplete = 'off';
      input.spellcheck = false;

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn--sm btn--ghost unit-copy';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', function () {
        if (!input.value) { WUS.toast('Nothing to copy', 'error'); return; }
        WUS.copy(input.value, unit.label + ' copied');
      });

      field.appendChild(head);
      field.appendChild(input);
      field.appendChild(copyBtn);
      unitGrid.appendChild(field);

      input.addEventListener('input', function () { onFieldInput(catKey, unit.key); });
    });

    // Populate from stored base value, if any.
    if (state.bases[catKey] !== undefined && state.bases[catKey] !== null) {
      fillFromBase(catKey, state.bases[catKey], null);
    }
  }

  function fillFromBase(catKey, baseValue, exceptUnitKey) {
    var cat = CATEGORIES[catKey];
    cat.units.forEach(function (unit) {
      if (unit.key === exceptUnitKey) return;
      var input = document.getElementById('unit-' + unit.key);
      if (!input) return;
      input.value = formatNumber(fromBase(catKey, unit.key, baseValue));
    });
  }

  function onFieldInput(catKey, unitKey) {
    var input = document.getElementById('unit-' + unitKey);
    var raw = input.value.trim();
    if (raw === '' || raw === '-') {
      state.bases[catKey] = undefined;
      persistDebounced();
      return;
    }
    var value = Number(raw);
    if (!isFinite(value)) return;
    var base = toBase(catKey, unitKey, value);
    state.bases[catKey] = base;
    fillFromBase(catKey, base, unitKey);
    persistDebounced();
  }

  function setCategory(catKey) {
    state.category = catKey;
    var cat = CATEGORIES[catKey];

    var tabs = categoryTabs.querySelectorAll('button');
    for (var i = 0; i < tabs.length; i++) {
      var active = tabs[i].getAttribute('data-category') === catKey;
      tabs[i].classList.toggle('is-active', active);
      tabs[i].setAttribute('aria-selected', active ? 'true' : 'false');
    }

    categoryTitle.textContent = cat.label;
    statusText.textContent = cat.label;
    if (cat.note) { categoryNote.textContent = cat.note; categoryNote.hidden = false; }
    else { categoryNote.hidden = true; }

    renderGrid(catKey);
    persist();
  }

  function clearCategory() {
    var catKey = state.category;
    state.bases[catKey] = undefined;
    var inputs = unitGrid.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) inputs[i].value = '';
    persist();
    WUS.toast(CATEGORIES[catKey].label + ' cleared');
  }

  /* =================================================================
     TABS WIRING
     ================================================================= */
  categoryTabs.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-category]');
    if (!btn) return;
    setCategory(btn.getAttribute('data-category'));
  });
  btnClear.addEventListener('click', clearCategory);

  /* =================================================================
     PERSISTENCE
     ================================================================= */
  function persist() {
    WUS.store.set(STORE_KEY, { category: state.category, bases: state.bases });
  }
  var persistDebounced = WUS.debounce(persist, 300);

  function restore() {
    var saved = WUS.store.get(STORE_KEY, null);
    if (saved) {
      if (saved.bases && typeof saved.bases === 'object') state.bases = saved.bases;
      if (saved.category && CATEGORIES[saved.category]) state.category = saved.category;
    }
    setCategory(state.category);
  }

  /* =================================================================
     SHORTCUTS HELP MODAL
     ================================================================= */
  var helpBackdrop = document.getElementById('helpBackdrop');
  var helpClose = document.getElementById('helpClose');
  var shortcutRows = document.getElementById('shortcutRows');

  var SHORTCUTS = [
    { keys: ['Alt', '1'], desc: 'Length' },
    { keys: ['Alt', '2'], desc: 'Weight / Mass' },
    { keys: ['Alt', '3'], desc: 'Temperature' },
    { keys: ['Alt', '4'], desc: 'Area' },
    { keys: ['Alt', '5'], desc: 'Volume' },
    { keys: ['Alt', '6'], desc: 'Speed' },
    { keys: ['Alt', '7'], desc: 'Digital Storage' },
    { keys: ['Alt', 'X'], desc: 'Clear current category' },
    { keys: ['?'], desc: 'Show this help' },
    { keys: ['Esc'], desc: 'Close dialog' }
  ];

  function buildShortcutTable() {
    var html = '';
    SHORTCUTS.forEach(function (s) {
      var kbds = s.keys.map(function (k) { return '<kbd>' + WUS.escapeHtml(k) + '</kbd>'; }).join('');
      html += '<tr><td>' + WUS.escapeHtml(s.desc) + '</td><td>' + kbds + '</td></tr>';
    });
    shortcutRows.innerHTML = html;
  }

  function openHelp() { helpBackdrop.hidden = false; helpClose.focus(); }
  function closeHelp() { helpBackdrop.hidden = true; }

  helpClose.addEventListener('click', closeHelp);
  helpBackdrop.addEventListener('click', function (e) {
    if (e.target === helpBackdrop) closeHelp();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !helpBackdrop.hidden) closeHelp();
  });

  var helpBtns = document.querySelectorAll('[data-shortcut-help]');
  for (var i = 0; i < helpBtns.length; i++) helpBtns[i].addEventListener('click', openHelp);

  /* =================================================================
     GLOBAL SHORTCUTS
     ================================================================= */
  CATEGORY_ORDER.forEach(function (key, idx) {
    WUS.registerShortcut('alt+' + (idx + 1), function () { setCategory(key); }, CATEGORIES[key].label);
  });
  WUS.registerShortcut('alt+x', function () { clearCategory(); }, 'Clear current category');
  WUS.registerShortcut('?', function () { openHelp(); }, 'Show shortcuts');

  /* =================================================================
     INIT
     ================================================================= */
  buildShortcutTable();
  restore();
})();
