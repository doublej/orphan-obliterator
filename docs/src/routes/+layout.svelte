<script lang="ts">
  import { onMount } from 'svelte';
  import '../lib/styles/global.css';

  let { children } = $props();

  onMount(async () => {
    const { obliterate } = await import('orphan-obliterator');
    const orphans = obliterate('p, li, h2, h3');
    return () => orphans.destroy();
  });
</script>

{@render children()}
