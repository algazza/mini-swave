<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    type = 'button', 
    variant = 'primary', 
    disabled = false, 
    form,
    class: className = '', 
    onclick, 
    children 
  }: { 
    type?: 'button' | 'submit' | 'reset', 
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost', 
    disabled?: boolean, 
    form?: string,
    class?: string, 
    onclick?: (e: MouseEvent) => void, 
    children?: Snippet 
  } = $props();

  const baseClasses = 'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-md shadow-indigo-200/50',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md shadow-red-200/50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500'
  };
</script>

<button {type} {form} class="{baseClasses} {variants[variant]} {className}" {disabled} {onclick}>
  {@render children?.()}
</button>
