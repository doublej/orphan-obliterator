import type { OrphanRule } from './types'

const DEFAULTS: Required<OrphanRule> = {
  minWords: 4,
  maxFontSize: '',
  minFontSize: '',
  minLastLineWords: 2,
  maxProtectedChars: 25,
  onlyMultiLine: false,
}

export function resolveRule(rule?: OrphanRule): Required<OrphanRule> {
  return { ...DEFAULTS, ...rule }
}

export function parsePx(value: string): number | null {
  if (!value) return null
  const match = value.match(/^([\d.]+)\s*(px|rem)?$/i)
  if (!match) return null
  const num = parseFloat(match[1])
  if (!Number.isFinite(num)) return null
  const unit = (match[2] || 'px').toLowerCase()
  if (unit === 'px') return num
  if (unit === 'rem') {
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return num * root
  }
  return null
}

export function isMultiLine(el: HTMLElement): boolean {
  const style = getComputedStyle(el)
  const lineHeight =
    parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2
  return el.clientHeight > lineHeight * 1.5
}

export function shouldApply(
  el: HTMLElement,
  words: string[],
  rule: Required<OrphanRule>,
): boolean {
  if (words.length < rule.minWords) return false

  const fontSize = parsePx(getComputedStyle(el).fontSize)
  if (fontSize !== null) {
    const max = parsePx(rule.maxFontSize)
    if (max !== null && fontSize > max) return false
    const min = parsePx(rule.minFontSize)
    if (min !== null && fontSize < min) return false
  }

  if (rule.onlyMultiLine && !isMultiLine(el)) return false

  const lastWords = words.slice(-rule.minLastLineWords)
  if (lastWords.join('\u00A0').length > rule.maxProtectedChars) return false

  return true
}
