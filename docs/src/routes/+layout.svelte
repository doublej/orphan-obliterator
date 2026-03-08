<script lang="ts">
  import { onMount } from 'svelte';
  import '../lib/styles/global.css';

  let { children } = $props();

  onMount(async () => {
    const { obliterate } = await import('orphan-obliterator');
    const orphans = obliterate({
      selectors: ['p', 'li', 'h2', 'h3'],
      rules: { onlyMultiLine: true },
      demo: true,
    });
    return () => orphans.destroy();
  });
</script>

{@render children()}
