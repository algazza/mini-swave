<script lang="ts">
  import Modal from '../../ui/Modal.svelte';
  import Button from '../../ui/Button.svelte';
  import { useAddDiscount } from '../../../composables/discount/useAddDiscount';
  import { useEditDiscount } from '../../../composables/discount/useEditDiscount';
  import type { DiscountType } from '../../../types/discount';

  let {
    isOpen,
    discount = null,
    onclose,
  }: {
    isOpen: boolean;
    discount?: DiscountType | null;
    onclose: () => void;
  } = $props();

  const addDiscountMutation = useAddDiscount();
  const editDiscountMutation = useEditDiscount();

  let discCode = $state('');
  let percentage = $state(10);
  let codeError = $state('');

  $effect(() => {
    if (isOpen) {
      if (discount) {
        discCode = discount.disc_code;
        percentage = discount.percentage;
      } else {
        discCode = '';
        percentage = 10;
      }
      codeError = '';
    }
  });

  function handleCodeInput(e: Event) {
    const input = e.target as HTMLInputElement;
    discCode = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    input.value = discCode;
    codeError = discCode.length === 5 || discCode.length === 0 ? '' : `${5 - discCode.length} more character(s) needed`;
  }

  function validate(): boolean {
    if (discCode.length !== 5) {
      codeError = 'Discount code must be exactly 5 characters.';
      return false;
    }
    if (percentage < 1 || percentage > 100) {
      return false;
    }
    return true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (discount) {
        await editDiscountMutation.mutateAsync({
          id: discount.id,
          old_disc_code: discount.disc_code,
          disc_code: discCode,
          percentage,
        });
      } else {
        await addDiscountMutation.mutateAsync({
          disc_code: discCode,
          percentage,
        });
      }
      onclose();
    } catch (err) {
      console.error(err);
    }
  }

  let isPending = $derived(addDiscountMutation.isPending || editDiscountMutation.isPending);
  let errorMessage = $derived(addDiscountMutation.error?.message || editDiscountMutation.error?.message || '');
</script>

<Modal {isOpen} {onclose} title={discount ? 'Edit Discount' : 'Add New Discount'}>
  <form id="discountForm" onsubmit={handleSubmit} class="space-y-6">

    <!-- Discount Code -->
    <div>
      <label for="disc_code" class="block text-sm font-medium text-slate-700 mb-1.5">
        Discount Code
        <span class="ml-1 text-xs font-normal text-slate-400">(exactly 5 characters)</span>
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        </div>
        <input
          id="disc_code"
          type="text"
          value={discCode}
          oninput={handleCodeInput}
          maxlength="5"
          placeholder="e.g. SAVE5"
          autocomplete="off"
          spellcheck="false"
          class="w-full pl-10 pr-16 py-2.5 font-mono tracking-widest text-sm uppercase bg-slate-50 border rounded-lg transition-all
            focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
            {codeError ? 'border-red-400 bg-red-50' : 'border-slate-300'}"
        />
        <!-- Character counter -->
        <span class="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-mono
          {discCode.length === 5 ? 'text-emerald-500' : 'text-slate-400'}">
          {discCode.length}/5
        </span>
      </div>
      {#if codeError}
        <p class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {codeError}
        </p>
      {/if}
    </div>

    <!-- Percentage -->
    <div>
      <label for="percentage" class="block text-sm font-medium text-slate-700 mb-1.5">
        Discount Percentage
      </label>
      <div class="relative">
        <input
          id="percentage"
          type="number"
          bind:value={percentage}
          min="1"
          max="100"
          required
          class="w-full pr-12 pl-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm
            focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
        />
        <span class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 font-semibold pointer-events-none">%</span>
      </div>
      <!-- Visual slider -->
      <div class="mt-2.5">
        <input
          type="range"
          min="1"
          max="100"
          bind:value={percentage}
          class="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-600 bg-slate-200"
        />
        <div class="flex justify-between text-xs text-slate-400 mt-1">
          <span>1%</span>
          <span class="font-medium {percentage >= 50 ? 'text-red-500' : percentage >= 20 ? 'text-amber-500' : 'text-emerald-500'}">
            {percentage}% off
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>

    <!-- Preview badge -->
    <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <p class="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Preview</p>
      <div class="flex items-center gap-3">
        <span class="font-mono font-bold text-lg tracking-widest text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          {discCode || '?????'}
        </span>
        <span class="text-slate-400">→</span>
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold
          {percentage >= 50 ? 'bg-red-100 text-red-700 border border-red-200' : percentage >= 20 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
          </svg>
          {percentage}% off
        </span>
      </div>
    </div>

    <!-- Error from server -->
    {#if errorMessage}
      <div class="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 mt-0.5 shrink-0">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p class="text-sm text-red-700">{errorMessage}</p>
      </div>
    {/if}
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={onclose} disabled={isPending}>Cancel</Button>
    <Button type="submit" form="discountForm" disabled={isPending || discCode.length !== 5}>
      {#if isPending}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
      {:else}
        {discount ? 'Save Changes' : 'Create Discount'}
      {/if}
    </Button>
  {/snippet}
</Modal>
