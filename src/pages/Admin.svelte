<script lang="ts">
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  const STORAGE_KEY = 'swave_admin_auth';

  onMount(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      push('/admin/login');
    }
  });

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    push('/admin/login');
  }

  // Products
  import { useProduct } from '../composables/product/useProduct';
  import ProductList from '../components/admin/ProductList.svelte';
  import ProductFormModal from '../components/admin/ProductFormModal.svelte';
  import DeleteConfirmModal from '../components/admin/DeleteConfirmModal.svelte';
  import type { ProductType } from '../types/product';

  // Discounts
  import { useDiscount } from '../composables/discount/useDiscount';
  import DiscountList from '../components/admin/discount/DiscountList.svelte';
  import DiscountFormModal from '../components/admin/discount/DiscountFormModal.svelte';
  import DiscountDeleteModal from '../components/admin/discount/DiscountDeleteModal.svelte';
  import type { DiscountType } from '../types/discount';

  // Checkouts
  import { useCheckout } from '../composables/checkout/useCheckout';
  import CheckoutList from '../components/admin/checkout/CheckoutList.svelte';
  import CheckoutDetailModal from '../components/admin/checkout/CheckoutDetailModal.svelte';

  import Button from '../components/ui/Button.svelte';

  // ─── Sidebar state ─────────────────────────────────────────────────────────
  type Section = 'products' | 'discounts' | 'checkouts';
  let activeSection: Section = $state('products');
  let sidebarOpen = $state(true);

  const navItems: { id: Section; label: string; icon: string }[] = [
    {
      id: 'products',
      label: 'Products',
      icon: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>`,
    },
    {
      id: 'discounts',
      label: 'Discounts',
      icon: `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>`,
    },
    {
      id: 'checkouts',
      label: 'Checkouts',
      icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>`,
    },
  ];

  // ─── Products ───────────────────────────────────────────────────────────────
  const productQuery = useProduct();
  let isProductModalOpen = $state(false);
  let isProductDeleteOpen = $state(false);
  let selectedProduct: ProductType | null = $state(null);

  function openAddProduct() { selectedProduct = null; isProductModalOpen = true; }
  function openEditProduct(p: ProductType) { selectedProduct = p; isProductModalOpen = true; }
  function openDeleteProduct(p: ProductType) { selectedProduct = p; isProductDeleteOpen = true; }

  // ─── Discounts ──────────────────────────────────────────────────────────────
  const discountQuery = useDiscount();
  let isDiscountModalOpen = $state(false);
  let isDiscountDeleteOpen = $state(false);
  let selectedDiscount: DiscountType | null = $state(null);

  function openAddDiscount() { selectedDiscount = null; isDiscountModalOpen = true; }
  function openEditDiscount(d: DiscountType) { selectedDiscount = d; isDiscountModalOpen = true; }
  function openDeleteDiscount(d: DiscountType) { selectedDiscount = d; isDiscountDeleteOpen = true; }

  // ─── Checkouts ──────────────────────────────────────────────────────────────
  const checkoutQuery = useCheckout();
  let isCheckoutDetailOpen = $state(false);
  let selectedOrderId: string | null = $state(null);

  function openCheckoutDetail(orderId: string) { selectedOrderId = orderId; isCheckoutDetailOpen = true; }
  function closeCheckoutDetail() { isCheckoutDetailOpen = false; selectedOrderId = null; }

  // ─── Section meta ──────────────────────────────────────────────────────────
  const sectionMeta: Record<Section, { title: string; description: string }> = {
    products: {
      title: 'Products',
      description: 'Manage your product catalog, stock levels, and pricing.',
    },
    discounts: {
      title: 'Discounts',
      description: 'Create and manage discount codes that customers can apply at checkout.',
    },
    checkouts: {
      title: 'Checkouts',
      description: 'Review and approve customer orders.',
    },
  };
</script>

<div class="flex min-h-screen bg-slate-100 font-sans">

  <!-- ══════════════════════════════════════════════════════════ SIDEBAR ══════ -->
  <aside
    class="flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out shrink-0
           {sidebarOpen ? 'w-60' : 'w-[68px]'}"
  >
    <!-- Logo / Brand -->
    <div class="flex items-center gap-3 px-4 py-5 border-b border-slate-700/60">
      <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/40">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      {#if sidebarOpen}
        <div transition:slide={{ axis: 'x', duration: 200 }}>
          <p class="font-bold text-white text-sm leading-tight whitespace-nowrap">Swave Admin</p>
          <p class="text-xs text-slate-400 whitespace-nowrap">Control Panel</p>
        </div>
      {/if}
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      {#each navItems as item}
        <button
          onclick={() => (activeSection = item.id)}
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
            {activeSection === item.id
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
          title={!sidebarOpen ? item.label : ''}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="shrink-0"
          >
            {@html item.icon}
          </svg>
          {#if sidebarOpen}
            <span transition:slide={{ axis: 'x', duration: 200 }} class="whitespace-nowrap overflow-hidden">
              {item.label}
            </span>
          {/if}
        </button>
      {/each}
    </nav>

    <!-- Sidebar footer: collapse + sign out -->
    <div class="px-3 py-4 border-t border-slate-700/60 space-y-1">
      <!-- Collapse toggle -->
      <button
        onclick={() => (sidebarOpen = !sidebarOpen)}
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150 text-sm font-medium"
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="shrink-0 transition-transform duration-300 {sidebarOpen ? '' : 'rotate-180'}"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        {#if sidebarOpen}
          <span transition:slide={{ axis: 'x', duration: 200 }} class="whitespace-nowrap">
            Collapse
          </span>
        {/if}
      </button>

      <!-- Sign out -->
      <button
        onclick={signOut}
        id="admin-signout-btn"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-all duration-150 text-sm font-medium"
        title={sidebarOpen ? 'Sign out' : 'Sign out'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        {#if sidebarOpen}
          <span transition:slide={{ axis: 'x', duration: 200 }} class="whitespace-nowrap">
            Sign Out
          </span>
        {/if}
      </button>
    </div>
  </aside>

  <!-- ══════════════════════════════════════════════════════ MAIN CONTENT ══════ -->
  <div class="flex-1 flex flex-col min-w-0">

    <!-- Top Bar -->
    <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 class="text-xl font-bold text-slate-900">{sectionMeta[activeSection].title}</h1>
        <p class="text-sm text-slate-500 mt-0.5">{sectionMeta[activeSection].description}</p>
      </div>

      <!-- Action button per section -->
      {#if activeSection === 'products'}
        <Button onclick={openAddProduct} id="add-product-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Product
        </Button>
      {:else if activeSection === 'discounts'}
        <Button onclick={openAddDiscount} id="add-discount-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Discount
        </Button>
      {:else if activeSection === 'checkouts'}
        <button
          onclick={() => checkoutQuery.refetch()}
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh
        </button>
      {/if}
    </header>

    <!-- Page body -->
    <main class="flex-1 p-6 overflow-auto">

      <!-- ── PRODUCTS section ── -->
      {#if activeSection === 'products'}
        {#if productQuery.isLoading}
          <div class="flex flex-col justify-center items-center py-24">
            <svg class="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-500 text-sm">Loading products…</p>
          </div>
        {:else if productQuery.isError}
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-8">
            <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-red-800 mb-1">Error loading products</h3>
            <p class="text-sm text-red-600 mb-4">{productQuery.error?.message}</p>
            <Button variant="secondary" onclick={() => productQuery.refetch()}>Try again</Button>
          </div>
        {:else if productQuery.data}
          <ProductList products={productQuery.data} onEdit={openEditProduct} onDelete={openDeleteProduct} />
        {/if}

      <!-- ── DISCOUNTS section ── -->
      {:else if activeSection === 'discounts'}
        {#if discountQuery.isLoading}
          <div class="flex flex-col justify-center items-center py-24">
            <svg class="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-500 text-sm">Loading discounts…</p>
          </div>
        {:else if discountQuery.isError}
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-8">
            <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-red-800 mb-1">Error loading discounts</h3>
            <p class="text-sm text-red-600 mb-4">{discountQuery.error?.message}</p>
            <Button variant="secondary" onclick={() => discountQuery.refetch()}>Try again</Button>
          </div>
        {:else if discountQuery.data}
          <DiscountList discounts={discountQuery.data} onEdit={openEditDiscount} onDelete={openDeleteDiscount} />
        {/if}

      <!-- ── CHECKOUTS section ── -->
      {:else if activeSection === 'checkouts'}
        {#if checkoutQuery.isLoading}
          <div class="flex flex-col justify-center items-center py-24">
            <svg class="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-500 text-sm">Loading orders…</p>
          </div>
        {:else if checkoutQuery.isError}
          <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-8">
            <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-red-800 mb-1">Error loading orders</h3>
            <p class="text-sm text-red-600 mb-4">{checkoutQuery.error?.message}</p>
            <Button variant="secondary" onclick={() => checkoutQuery.refetch()}>Try again</Button>
          </div>
        {:else if checkoutQuery.data}
          <CheckoutList checkouts={checkoutQuery.data} onView={openCheckoutDetail} />
        {/if}
      {/if}
    </main>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ MODALS ══════ -->

<!-- Product modals -->
<ProductFormModal
  isOpen={isProductModalOpen}
  product={selectedProduct}
  onclose={() => (isProductModalOpen = false)}
/>
<DeleteConfirmModal
  isOpen={isProductDeleteOpen}
  product={selectedProduct}
  onclose={() => (isProductDeleteOpen = false)}
/>

<!-- Discount modals -->
<DiscountFormModal
  isOpen={isDiscountModalOpen}
  discount={selectedDiscount}
  onclose={() => (isDiscountModalOpen = false)}
/>
<DiscountDeleteModal
  isOpen={isDiscountDeleteOpen}
  discount={selectedDiscount}
  onclose={() => (isDiscountDeleteOpen = false)}
/>

<!-- Checkout detail modal -->
{#if isCheckoutDetailOpen && selectedOrderId}
  <CheckoutDetailModal
    isOpen={isCheckoutDetailOpen}
    orderId={selectedOrderId}
    onclose={closeCheckoutDetail}
  />
{/if}