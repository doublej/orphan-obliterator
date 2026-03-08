# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run build       # Bundle for browser + emit .d.ts into dist/
bun run typecheck   # Type-check without emitting
```

No test runner configured yet. No linter.

## Architecture

Browser-only library. Single public export: `obliterate()` from `src/index.ts`.

- **types.ts** — `OrphanRule`, `OrphanConfig`, `OrphanInput`, `OrphanInstance` interfaces
- **rules.ts** — Rule defaults, `shouldApply()` gating logic, `parsePx()` for CSS unit conversion (px/rem)
- **core.ts** — DOM manipulation: finds last text node via reverse tree walk, replaces trailing spaces with `\u00A0`, manages MutationObserver/ResizeObserver lifecycle

Key design choices:
- Operates on **Text nodes** (not innerHTML) to preserve event listeners and nested elements
- Original text stored in a `WeakMap<Text, string>` for clean `destroy()` restoration
- `processing` flag guards against re-entrant observer callbacks
- Observer callbacks are debounced (100ms mutation, 150ms resize)
- `OrphanInput` accepts a bare CSS selector string, a single config, or an array of configs

