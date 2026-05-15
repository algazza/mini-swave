<script lang="ts">
  import Modal from '../../ui/Modal.svelte';
  import Button from '../../ui/Button.svelte';
  import { useDeleteDiscount } from '../../../composables/discount/useDeleteDiscount';
  import type { DiscountType } from '../../../types/discount';

  let {
    isOpen,
    discount,
    onclose,
  }: {
    isOpen: boolean;
    discount: DiscountType | null;
    onclose: () => void;
  } = $props();

  const deleteDiscountMutation = useDeleteDiscount();

  async function handleDelete() {
    if (!discount) return;
    try {
      await deleteDiscountMutation.mutateAsync({ disc_code: discount.disc_code });
      onclose();
    } catch (error) {
      console.error(error);
    }
  }
</script>

<Modal {isOpen} {onclose} title="Delete Discount">
  <div class="py-2">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>
      <div>
        <p class="text-slate-600 text-sm leading-relaxed">
          Are you sure you want to delete the discount code
          <span class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded tracking-widest mx-0.5">
            {discount?.disc_code}
          </span>
          ({discount?.percentage}% off)?
        </p>
        <p class="text-sm text-slate-500 mt-2">
          This discount will no longer be applicable at checkout. This action cannot be undone.
        </p>
      </div>
    </div>

    {#if deleteDiscountMutation.error}
      <div class="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 shrink-0">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p class="text-sm text-red-700">{deleteDiscountMutation.error.message}</p>
      </div>
    {/if}
  </div>

  {#snippet footer()}
    <Button variant="ghost" onclick={onclose} disabled={deleteDiscountMutation.isPending}>Cancel</Button>
    <Button variant="danger" onclick={handleDelete} disabled={deleteDiscountMutation.isPending}>
      {#if deleteDiscountMutation.isPending}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Deleting...
      {:else}
        Delete Discount
      {/if}
    </Button>
  {/snippet}
</Modal>
