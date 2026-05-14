<script lang="ts">
  import { useProduct } from '../composables/product/useProduct';
  import ProductList from '../components/admin/ProductList.svelte';
  import ProductFormModal from '../components/admin/ProductFormModal.svelte';
  import DeleteConfirmModal from '../components/admin/DeleteConfirmModal.svelte';
  import Button from '../components/ui/Button.svelte';
  import type { ProductType } from '../types/product';

  const productQuery = useProduct();

  let isProductModalOpen = $state(false);
  let isDeleteModalOpen = $state(false);
  let selectedProduct: ProductType | null = $state(null);

  function openAddModal() {
    selectedProduct = null;
    isProductModalOpen = true;
  }

  function openEditModal(product: ProductType) {
    selectedProduct = product;
    isProductModalOpen = true;
  }

  function openDeleteModal(product: ProductType) {
    selectedProduct = product;
    isDeleteModalOpen = true;
  }
  console.log(import.meta.env.VITE_SUPABASE_KEY)
</script>

<div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Product Dashboard
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Manage your products, stock, and pricing.
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <Button onclick={openAddModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Product
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    {#if productQuery.isLoading}
      <div class="flex flex-col justify-center items-center py-20">
        <svg class="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-slate-500 text-sm">Loading products...</p>
      </div>
    {:else if productQuery.isError}
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h3 class="text-sm font-medium text-red-800 mb-1">Error loading products</h3>
        <p class="text-sm text-red-600 mb-4">{productQuery.error?.message}</p>
        <Button variant="secondary" onclick={() => productQuery.refetch()}>Try again</Button>
      </div>
    {:else if productQuery.data}
      <ProductList 
        products={productQuery.data} 
        onEdit={openEditModal} 
        onDelete={openDeleteModal} 
      />
    {/if}
  </div>
</div>

<ProductFormModal 
  isOpen={isProductModalOpen} 
  product={selectedProduct} 
  onclose={() => isProductModalOpen = false} 
/>

<DeleteConfirmModal 
  isOpen={isDeleteModalOpen} 
  product={selectedProduct} 
  onclose={() => isDeleteModalOpen = false} 
/>