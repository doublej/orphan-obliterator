import type { OrphanConfig, OrphanInput, OrphanInstance } from './types'
import { resolveRule, shouldApply } from './rules'

const NBSP = '\u00A0'
const DEMO_ATTR = 'data-orphan-demo'
const STYLE_ID = 'orphan-obliterator-demo'
const originals = new WeakMap<Text, string>()

function normalizeConfigs(input: OrphanInput): OrphanConfig[] {
  if (typeof input === 'string') {
    return [{ selectors: input.split(',').map(s => s.trim()) }]
  }
  return Array.isArray(input) ? input : [input]
}

function lastTextNode(el: Node): Text | null {
  for (let i = el.childNodes.length - 1; i >= 0; i--) {
    const child = el.childNodes[i]
    if (child.nodeType === Node.TEXT_NODE && child.textContent?.includes(' ')) {
      return child as Text
    }
    if (child.nodeType === Node.ELEMENT_NODE) {
      const found = lastTextNode(child)
      if (found) return found
    }
  }
  return null
}

function injectDemoStyles(): void {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = [
    `[${DEMO_ATTR}]{outline:1px dotted #ccc;outline-offset:2px;border-radius:2px;cursor:pointer;position:relative}`,
    `[${DEMO_ATTR}]:hover{outline-color:#999}`,
    `[${DEMO_ATTR}]::after{content:attr(data-orphan-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);padding:4px 8px;background:#333;color:#fff;font-size:12px;line-height:1.4;white-space:nowrap;border-radius:4px;opacity:0;pointer-events:none;transition:opacity .15s}`,
    `[${DEMO_ATTR}]:hover::after{opacity:1;pointer-events:auto}`,
  ].join('\n')
  document.head.appendChild(style)
}

function wrapDemoSpan(node: Text, splitIndex: number, protectedText: string): void {
  const parent = node.parentNode!
  const span = document.createElement('span')
  span.setAttribute(DEMO_ATTR, '')
  span.setAttribute('data-orphan-tip', 'corrected using orphan-obliterator')
  span.addEventListener('click', () => window.open('https://github.com/doublej/orphan-obliterator', '_blank'))
  span.textContent = protectedText
  const before = node.textContent!.slice(0, splitIndex)
  if (before) {
    node.textContent = before
    parent.insertBefore(span, node.nextSibling)
  } else {
    parent.replaceChild(span, node)
  }
}

function processElement(el: HTMLElement, config: OrphanConfig): void {
  const node = lastTextNode(el)
  if (!node?.textContent) return

  const rule = resolveRule(config.rules)
  const allWords = (el.textContent || '').trim().split(/\s+/).filter(Boolean)
  if (!shouldApply(el, allWords, rule)) return

  if (!originals.has(node)) originals.set(node, node.textContent)

  const parts = node.textContent.split(/( +)/)
  let replaced = 0
  let firstReplacedIndex = -1
  const needed = rule.minLastLineWords - 1
  for (let i = parts.length - 1; i >= 0 && replaced < needed; i--) {
    if (/^ +$/.test(parts[i])) {
      parts[i] = NBSP
      firstReplacedIndex = i
      replaced++
    }
  }
  if (replaced === 0) return

  const fixed = parts.join('')

  if (config.demo) {
    const heightBefore = el.scrollHeight
    node.textContent = fixed
    const heightAfter = el.scrollHeight

    if (heightBefore !== heightAfter) {
      // Fix actually moved words between lines — restore and wrap with demo span
      node.textContent = originals.get(node)!
      injectDemoStyles()
      const splitPos = parts.slice(0, firstReplacedIndex).join('').length
      const protectedText = parts.slice(firstReplacedIndex).join('')
      wrapDemoSpan(node, splitPos, protectedText)
    }
    // If height didn't change, keep the NBSP fix silently (no highlight)
  } else {
    node.textContent = fixed
  }
}

function restoreElement(el: HTMLElement): void {
  for (const span of el.querySelectorAll(`[${DEMO_ATTR}]`)) {
    const parent = span.parentNode!
    while (span.firstChild) parent.insertBefore(span.firstChild, span)
    parent.removeChild(span)
    parent.normalize()
  }
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let node: Text | null
  while ((node = walker.nextNode() as Text | null)) {
    const original = originals.get(node)
    if (original !== undefined) {
      node.textContent = original
      originals.delete(node)
    }
  }
}

function debounce(fn: () => void, ms: number): () => void {
  let timer: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, ms)
  }
}

export function obliterate(input: OrphanInput): OrphanInstance {
  const configs = normalizeConfigs(input)
  const observers: (MutationObserver | ResizeObserver)[] = []
  let processing = false

  function update() {
    if (processing) return
    processing = true
    for (const config of configs) {
      const selector = config.selectors.join(', ')
      for (const el of document.querySelectorAll<HTMLElement>(selector)) {
        restoreElement(el)
        processElement(el, config)
      }
    }
    processing = false
  }

  update()

  if (configs.some(c => c.observe)) {
    const mo = new MutationObserver(debounce(update, 100))
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    observers.push(mo)
  }

  if (configs.some(c => c.responsive)) {
    const ro = new ResizeObserver(debounce(update, 150))
    ro.observe(document.documentElement)
    observers.push(ro)
  }

  return {
    update,
    destroy() {
      observers.forEach(o => o.disconnect())
      observers.length = 0
      for (const config of configs) {
        const selector = config.selectors.join(', ')
        for (const el of document.querySelectorAll<HTMLElement>(selector)) {
          restoreElement(el)
        }
      }
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
