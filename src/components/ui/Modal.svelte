<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import type { Snippet } from 'svelte';

  let { 
    isOpen, 
    onclose, 
    title,
    children,
    footer
  }: { 
    isOpen: boolean; 
    onclose: () => void; 
    title: string;
    children?: Snippet;
    footer?: Snippet;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
    transition:fade={{ duration: 200 }}
    onclick={onclose}
    aria-hidden="true"
  ></div>

  <!-- Modal Panel -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
    <div 
      class="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">{title}</h3>
        <button 
          type="button"
          class="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onclick={onclose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 overflow-y-auto max-h-[70vh]">
        {@render children?.()}
      </div>

      <!-- Footer -->
      {#if footer}
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
