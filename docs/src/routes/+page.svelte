<script lang="ts">
  const features = [
    {
      title: 'CSS Selector Scoping',
      description: 'Target any elements with standard CSS selectors. Apply different rules to paragraphs, headings, and list items independently.'
    },
    {
      title: 'Font-Size Thresholds',
      description: 'Skip elements above or below a font-size threshold. Keep large headings untouched while fixing body text orphans.'
    },
    {
      title: 'Word Count Minimum',
      description: 'Only apply to elements with enough words. Short phrases are left alone — no awkward forced joins on two-word lines.'
    },
    {
      title: 'Multi-Line Detection',
      description: 'Optionally skip single-line elements entirely. Only fix orphans where text actually wraps to multiple lines.'
    },
    {
      title: 'Live Observers',
      description: 'Watch for DOM mutations and window resizes. Content loaded dynamically or reflowed responsively stays orphan-free.'
    },
    {
      title: 'Clean Teardown',
      description: 'Call destroy() to restore all original text and disconnect observers. No side effects left behind.'
    }
  ];

  const steps = [
    {
      title: 'Install',
      description: 'Add the package to your project.',
      code: `bun add orphan-obliterator`
    },
    {
      title: 'Import and call',
      description: 'Pass a CSS selector string for the simplest usage.',
      code: `import { obliterate } from 'orphan-obliterator'\n\nconst instance = obliterate('p, li, h2')`
    },
    {
      title: 'Configure rules',
      description: 'Fine-tune with word count, font-size, and line detection rules.',
      code: `const instance = obliterate({\n  selectors: ['p', '.content li'],\n  rules: {\n    minWords: 4,\n    maxFontSize: '24px',\n    minLastLineWords: 2,\n  },\n  observe: true,\n  responsive: true,\n})`
    }
  ];

  const rules = [
    { name: 'minWords', type: 'number', def: '4', desc: 'Skip elements with fewer words' },
    { name: 'maxFontSize', type: 'string', def: '—', desc: "Skip if font-size exceeds this (e.g. '24px', '1.5rem')" },
    { name: 'minFontSize', type: 'string', def: '—', desc: 'Skip if font-size is below this' },
    { name: 'minLastLineWords', type: 'number', def: '2', desc: 'Words to keep together at end' },
    { name: 'maxProtectedChars', type: 'number', def: '25', desc: 'Skip if joined group exceeds this length' },
    { name: 'onlyMultiLine', type: 'boolean', def: 'false', desc: 'Only apply to multi-line elements' }
  ];

  let copied = $state(false);

  function copyInstall() {
    navigator.clipboard.writeText('bun add orphan-obliterator');
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<svelte:head>
  <title>Orphan Obliterator</title>
</svelte:head>

<main>
  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <p class="badge">v0.1.0</p>
      <h1>Orphan Obliterator</h1>
      <p class="description">
        Prevent orphaned words on the last line of HTML elements.
        Scoped via CSS selectors, configurable with font&#8209;size thresholds,
        word&#8209;count&nbsp;minimums, and&nbsp;more.
      </p>
      <div class="install-box">
        <code>bun add orphan-obliterator</code>
        <button onclick={copyInstall}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
    </div>
  </section>

  <!-- Before / After -->
  <section class="demo" style="animation-delay: 200ms">
    <div class="container">
      <div class="demo-grid">
        <div class="demo-card">
          <span class="demo-label">Before</span>
          <p class="demo-text before">Good typography keeps words together so no single word sits on a line by <span class="orphan">itself.</span></p>
        </div>
        <div class="demo-card">
          <span class="demo-label active">After</span>
          <p class="demo-text after">Good typography keeps words together so no single word sits on a line by&nbsp;itself.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="features" style="animation-delay: 400ms">
    <div class="container">
      <h2>Features</h2>
      <div class="grid">
        {#each features as feature, i}
          <div class="feature-card" style="animation-delay: {400 + i * 100}ms">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Getting Started -->
  <section class="getting-started" style="animation-delay: 600ms">
    <div class="container">
      <h2>Getting Started</h2>
      <div class="steps">
        {#each steps as step, i}
          <div class="step" style="animation-delay: {600 + i * 200}ms">
            <div class="step-number">{i + 1}</div>
            <div class="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {#if step.code}
                <pre><code>{step.code}</code></pre>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Rules Reference -->
  <section class="reference" style="animation-delay: 800ms">
    <div class="container">
      <h2>Rules Reference</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {#each rules as rule}
              <tr>
                <td><code>{rule.name}</code></td>
                <td><code>{rule.type}</code></td>
                <td><code>{rule.def}</code></td>
                <td>{rule.desc}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- API -->
  <section class="api" style="animation-delay: 900ms">
    <div class="container">
      <h2>API</h2>
      <div class="api-card">
        <h3><code>obliterate(input): OrphanInstance</code></h3>
        <p>
          Accepts a CSS selector string, a config object, or an array of config objects.
          Processes matching elements immediately and returns an instance.
        </p>
        <div class="api-methods">
          <div>
            <code>instance.update()</code>
            <p>Re-process all matching elements.</p>
          </div>
          <div>
            <code>instance.destroy()</code>
            <p>Restore original text and disconnect all observers.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="container">
    <p>
      <a href="https://github.com/doublej/orphan-obliterator" target="_blank" rel="noopener">GitHub</a>
      &middot; MIT License
    </p>
  </div>
</footer>

<style>
  .container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--container-padding);
  }

  section {
    padding: var(--section-padding) 0;
    animation: fadeSlideUp 0.5s ease-out forwards;
    opacity: 0;
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
  }

  /* Hero */
  .hero {
    padding: 80px 0 40px;
    text-align: center;
    opacity: 1;
    animation: fadeSlideUp 0.5s ease-out forwards;
  }

  .badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    color: var(--text-tertiary);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 14px;
    margin-bottom: 20px;
  }

  .hero h1 {
    font-size: 3rem;
    font-weight: 600;
    letter-spacing: -0.04em;
    margin-bottom: 16px;
  }

  .description {
    font-size: 1.15rem;
    color: var(--text-secondary);
    max-width: 560px;
    margin: 0 auto 32px;
    line-height: 1.7;
  }

  .install-box {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: var(--bg-code);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
  }

  .install-box code {
    font-size: 0.95rem;
    color: var(--text-primary);
  }

  .install-box button {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 14px;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .install-box button:hover {
    opacity: 0.8;
  }

  /* Demo */
  .demo {
    padding: 0 0 20px;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--grid-gap);
    max-width: 700px;
    margin: 0 auto;
  }

  .demo-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px;
  }

  .demo-label {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    margin-bottom: 12px;
  }

  .demo-label.active {
    color: #16a34a;
  }

  .demo-text {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 300px;
  }

  .orphan {
    color: #dc2626;
    text-decoration: underline wavy #dc2626;
    text-underline-offset: 3px;
  }

  /* Features */
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--grid-gap);
  }

  .feature-card {
    background: var(--bg-secondary);
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 8px;
    animation: fadeSlideUp 0.5s ease-out forwards;
    opacity: 0;
  }

  .feature-card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .feature-card p {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  /* Getting Started */
  .steps {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .step {
    display: flex;
    gap: 20px;
    animation: fadeSlideUp 0.5s ease-out forwards;
    opacity: 0;
  }

  .step-number {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background: var(--accent);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .step-content {
    flex: 1;
    min-width: 0;
  }

  .step-content h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .step-content p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin-bottom: 12px;
  }

  pre {
    background: var(--bg-code);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.6;
  }

  /* Reference table */
  .table-wrap {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-secondary);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  th {
    text-align: left;
    font-weight: 600;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-primary);
    white-space: nowrap;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
  }

  tr:last-child td {
    border-bottom: none;
  }

  td code {
    font-size: 0.85rem;
    background: var(--bg-code);
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* API */
  .api-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 28px;
  }

  .api-card > h3 {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .api-card > h3 code {
    font-size: 0.95rem;
  }

  .api-card > p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin-bottom: 20px;
  }

  .api-methods {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .api-methods code {
    font-size: 0.85rem;
    font-weight: 500;
    background: var(--bg-code);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .api-methods p {
    color: var(--text-tertiary);
    font-size: 0.9rem;
    margin-top: 4px;
  }

  /* Footer */
  footer {
    padding: 40px 0;
    text-align: center;
    color: var(--text-tertiary);
    font-size: 0.9rem;
  }

  footer a {
    color: var(--text-secondary);
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }

  /* Responsive */
  @media (max-width: 1000px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 700px) {
    .hero h1 {
      font-size: 2.2rem;
    }

    .description {
      font-size: 1rem;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }

    .install-box {
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .install-box button {
      width: 100%;
    }
  }
</style>
