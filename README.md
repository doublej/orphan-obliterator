# Orphan Obliterator

Prevent orphaned words on the last line of HTML elements. Scoped via CSS selectors, configurable with font-size thresholds, word count minimums, and more.

Works by replacing the last space(s) with non-breaking spaces (`\u00A0`), forcing words to wrap together. Operates on Text nodes directly — event listeners and nested markup are preserved.

## Install

```bash
bun add orphan-obliterator
```

Or link locally from the repo:

```bash
cd orphan-obliterator && bun link
```

Then in your project:

```bash
bun link orphan-obliterator
```

## Usage

```typescript
import { obliterate } from 'orphan-obliterator'

// Quick — pass a CSS selector string
const instance = obliterate('p, li, h2')

// With rules
const instance = obliterate({
  selectors: ['p', '.content li'],
  rules: {
    minWords: 4,
    maxFontSize: '24px',
    minLastLineWords: 2,
  },
  observe: true,
  responsive: true,
})

// Multiple rule sets
const instance = obliterate([
  { selectors: ['p'], rules: { minWords: 4 } },
  { selectors: ['h1', 'h2'], rules: { minWords: 3, minLastLineWords: 3 } },
])

// Manual re-apply
instance.update()

// Restore original text and disconnect observers
instance.destroy()
```

## Rules

| Rule | Type | Default | Description |
|---|---|---|---|
| `minWords` | `number` | `4` | Skip elements with fewer words |
| `maxFontSize` | `string` | — | Skip elements with font-size above this (e.g. `'24px'`, `'1.5rem'`) |
| `minFontSize` | `string` | — | Skip elements with font-size below this |
| `minLastLineWords` | `number` | `2` | How many words to keep together at the end |
| `maxProtectedChars` | `number` | `25` | Skip if the joined word group exceeds this length |
| `onlyMultiLine` | `boolean` | `false` | Only apply to elements that span multiple lines |

Font-size values support `px` and `rem` units. Compared against the element's computed font-size.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `selectors` | `string[]` | — | CSS selectors to target |
| `observe` | `boolean` | `false` | Re-apply when DOM content changes (MutationObserver) |
| `responsive` | `boolean` | `false` | Re-apply on window resize (ResizeObserver) |

## API

### `obliterate(input): OrphanInstance`

Accepts a CSS selector string, a config object, or an array of config objects. Processes matching elements immediately and returns an instance with:

- **`update()`** — Re-process all matching elements
- **`destroy()`** — Restore original text, disconnect all observers

## License

MIT
