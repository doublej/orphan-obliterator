import type { OrphanConfig, OrphanInput, OrphanInstance } from './types'
import { resolveRule, shouldApply } from './rules'

const NBSP = '\u00A0'
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

function processElement(el: HTMLElement, config: OrphanConfig): void {
  const node = lastTextNode(el)
  if (!node?.textContent) return

  const rule = resolveRule(config.rules)
  const allWords = (el.textContent || '').trim().split(/\s+/).filter(Boolean)
  if (!shouldApply(el, allWords, rule)) return

  if (!originals.has(node)) originals.set(node, node.textContent)

  const parts = node.textContent.split(/( +)/)
  let replaced = 0
  const needed = rule.minLastLineWords - 1
  for (let i = parts.length - 1; i >= 0 && replaced < needed; i--) {
    if (/^ +$/.test(parts[i])) {
      parts[i] = NBSP
      replaced++
    }
  }
  if (replaced > 0) node.textContent = parts.join('')
}

function restoreElement(el: HTMLElement): void {
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
    },
  }
}
