# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.1] - 2026-09-06

### Fixed

- The Speed category's knot-to-m/s conversion factor was truncated to 6 decimal places (`0.514444`) instead of the repeating decimal it actually is (1 knot = 1852/3600 m/s exactly). The sibling km/h factor already carried 12 decimal places (`0.277777777778`) for the same kind of repeating value; knots now match that precision (`0.514444444444`), cutting the relative error from ~8.6e-7 to ~8.6e-13 and eliminating a visible discrepancy in knot conversions at the tool's documented 12-significant-digit output precision.
