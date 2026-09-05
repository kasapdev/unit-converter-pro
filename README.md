# Unit Converter Pro

[![CI](https://github.com/kasapdev/unit-converter-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/kasapdev/unit-converter-pro/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) ![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?logo=javascript&logoColor=black)

Instant, bidirectional unit conversion across seven categories — fast, private, and fully offline.

> A premium, zero-dependency conversion workbench. Type a value into any unit field and every other unit in that category updates live, with real static conversion factors and correct non-linear temperature math — all in your browser, with nothing ever leaving your machine.

## Overview

Unit Converter Pro is part of the **Web Utility Suite**. It runs entirely in the browser with no build step, no frameworks, and no network calls — open `index.html` from disk and it works. Pick a category from the tab bar, type into any field, and every other unit in that category recalculates instantly from a shared base-unit conversion engine.

## Features

- **Seven categories**: Length, Weight/Mass, Temperature, Area, Volume, Speed, and Digital Storage.
- **Live bidirectional conversion** — typing into any unit field instantly updates every other field in the category, driven by a generic base-unit engine (each category converts through one base unit; typed value → base → every other unit).
- **Real static conversion factors** — length (mm → nautical miles), mass (mg → US tons), area (mm² → mi²), volume (mL → Imperial gallons), and speed (m/s → knots), all using accurate real-world constants (e.g. 1 mile = 1609.344 m, 1 lb = 0.45359237 kg, 1 US gallon = 3.785411784 L, 1 acre = 4046.8564224 m², 1 knot = 0.514444 m/s).
- **Correct temperature math** — Celsius, Fahrenheit and Kelvin are non-linear, so they're converted with the real formulas (`C = (F−32)×5/9`, `K = C+273.15`) instead of a bogus multiply table.
- **Dual-base digital storage** — decimal/SI units (KB, MB, GB, TB, PB — 1000-based) and binary/IEC units (KiB, MiB, GiB, TiB, PiB — 1024-based) are both listed side by side, alongside bits and bytes.
- **Clean number formatting** — results are rounded to 12 significant digits and trimmed of trailing zeros and floating-point noise.
- **Per-field copy buttons** and a one-click **Clear** for the active category.
- **Auto-persist** — your last category and values are saved to `localStorage` and restored on return.
- **Dark & light themes**, fully responsive down to 360px, accessible, and keyboard-driven.

## Installation

No dependencies, no build step.

```bash
git clone https://github.com/kasapdev/unit-converter-pro.git
cd unit-converter-pro
```

Then simply open `index.html` in any modern browser (double-click it, or `file://` it). That's it.

## Usage

1. Pick a category from the tab bar — Length, Weight/Mass, Temperature, Area, Volume, Speed, or Digital Storage.
2. Type a value into any unit field. Every other field in that category updates instantly.
3. For Digital Storage, choose whichever decimal (1000-based) or binary (1024-based) units you need — both are always listed.
4. Use **Copy** on any field to grab its formatted value, or **Clear** to reset the whole category.
5. Your last category and values are remembered automatically for next time.

## Keyboard Shortcuts

| Action                | Shortcut          |
| ---------------------- | ----------------- |
| Length                 | <kbd>Alt</kbd> + <kbd>1</kbd> |
| Weight / Mass           | <kbd>Alt</kbd> + <kbd>2</kbd> |
| Temperature             | <kbd>Alt</kbd> + <kbd>3</kbd> |
| Area                    | <kbd>Alt</kbd> + <kbd>4</kbd> |
| Volume                  | <kbd>Alt</kbd> + <kbd>5</kbd> |
| Speed                   | <kbd>Alt</kbd> + <kbd>6</kbd> |
| Digital Storage         | <kbd>Alt</kbd> + <kbd>7</kbd> |
| Clear current category | <kbd>Alt</kbd> + <kbd>X</kbd> |
| Show shortcuts help    | <kbd>?</kbd>       |
| Close dialog            | <kbd>Esc</kbd>     |

## Screenshots

> _Screenshots coming soon._

![screenshot](docs/screenshot-1.png)
![screenshot](docs/screenshot-2.png)

## Roadmap

- [ ] Custom/user-defined units
- [ ] Copy-all as a formatted summary block
- [ ] Fuel economy and pressure categories
- [ ] Unit search/filter within a category
- [ ] Shareable permalink encoding the current category + value

## License

MIT Licensed. Part of the [Web Utility Suite](https://github.com/kasapdev/web-utility-suite).
