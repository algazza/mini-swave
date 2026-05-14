<script lang="ts">
  import Modal from '../ui/Modal.svelte';
  import Button from '../ui/Button.svelte';
  import { useDeleteProduct } from '../../composables/product/useDeleteProduct';

  let { isOpen, product, onclose }: { isOpen: boolean, product: any, onclose: () => void } = $props();

  const deleteProductMutation = useDeleteProduct();

  async function handleDelete() {
    if (!product) return;
    try {
      await deleteProductMutation.mutateAsync({
        id: product.id,
        imageUrl: product.product_image
      });
      onclose();
    } catch (error) {
      console.error(error);
    }
  }
</script>

<Modal {isOpen} {onclose} title="Confirm Deletion">
  <div class="py-2">
    <div class="flex items-center gap-4 mb-4">
      <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
      </div>
      <p class="text-slate-600">
        Are you sure you want to delete <strong class="text-slate-900">{product?.name}</strong>? This action cannot be undone.
      </p>
    </div>
  </div>

  {#snippet footer()}
    <Button variant="ghost" onclick={onclose}>Cancel</Button>
    <Button variant="danger" onclick={handleDelete} disabled={deleteProductMutation.isPending}>
      {#if deleteProductMutation.isPending}
        Deleting...
      {:else}
        Delete Product
      {/if}
    </Button>
  {/snippet}
</Modal>
