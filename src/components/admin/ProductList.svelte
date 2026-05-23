<script lang="ts">
  import type { ProductType } from '../../types/product';

  let {
    products,
    onEdit,
    onDelete,
  }: {
    products: ProductType[];
    onEdit: (product: ProductType) => void;
    onDelete: (product: ProductType) => void;
  } = $props();

  // ── Search ────────────────────────────────────────────────────────────────
  let searchQuery = $state('');

  const filtered = $derived(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).includes(q),
    );
  });

  // ── Pagination ────────────────────────────────────────────────────────────
  const PAGE_SIZE = 10;
  let currentPage = $state(1);

  // Reset to page 1 whenever search changes
  $effect(() => {
    searchQuery; // track
    currentPage = 1;
  });

  const totalPages = $derived(() => Math.max(1, Math.ceil(filtered().length / PAGE_SIZE)));

  const paginated = $derived(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered().slice(start, start + PAGE_SIZE);
  });

  function goToPage(p: number) {
    if (p < 1 || p > totalPages()) return;
    currentPage = p;
  }

  // Smart ellipsis page list
  const visiblePages = $derived(() => {
    const total = totalPages();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '…')[] = [];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(total - 1, currentPage + 1);
    pages.push(1);
    if (left > 2) pages.push('…');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push('…');
    pages.push(total);
    return pages;
  });
</script>

<div class="flex flex-col gap-4">

  <!-- ── Search bar ──────────────────────────────────────────────────────── -->
  <div class="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input
      id="product-search"
      type="text"
      placeholder="Search by product name or ID…"
      bind:value={searchQuery}
      class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800
             placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
             shadow-sm transition"
    />
    {#if searchQuery}
      <button
        onclick={() => (searchQuery = '')}
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        aria-label="Clear search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    {/if}
  </div>

  <!-- ── Table ───────────────────────────────────────────────────────────── -->
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
            <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          {#each paginated() as product (product.id)}
            <tr class="hover:bg-slate-50 transition-colors group">
              <!-- Product name + image -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img class="h-full w-full object-cover" src={product.product_image} alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-slate-900">{product.name}</div>
                    <div class="text-sm text-slate-500">ID: {product.id}</div>
                  </div>
                </div>
              </td>
              <!-- Price -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 font-medium">Rp {product.price.toLocaleString('id-ID')}</div>
              </td>
              <!-- Stock -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                  {product.stock > 10
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-red-100 text-red-800 border border-red-200'}">
                  {product.stock} in stock
                </span>
              </td>
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onclick={() => onEdit(product)}
                    class="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button
                    onclick={() => onDelete(product)}
                    class="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="4" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  </div>
                  {#if searchQuery.trim()}
                    <h3 class="text-sm font-medium text-slate-900">No products found</h3>
                    <p class="mt-1 text-sm text-slate-500">Try a different name or product ID.</p>
                  {:else}
                    <h3 class="text-sm font-medium text-slate-900">No products found</h3>
                    <p class="mt-1 text-sm text-slate-500">Get started by creating a new product.</p>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Pagination ──────────────────────────────────────────────────────── -->
  {#if totalPages() > 1 || filtered().length > 0}
    <div class="flex items-center justify-between gap-4 px-1">
      <!-- Result count -->
      <p class="text-xs text-slate-500 shrink-0">
        {#if filtered().length === 0}
          No results
        {:else}
          Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered().length)}
          of {filtered().length} product{filtered().length !== 1 ? 's' : ''}
        {/if}
      </p>

      <!-- Page controls -->
      <div class="flex items-center gap-1">
        <!-- Prev -->
        <button
          onclick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100
                 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <!-- Page numbers -->
        {#each visiblePages() as page}
          {#if page === '…'}
            <span class="w-8 h-8 flex items-center justify-center text-xs text-slate-400 select-none">…</span>
          {:else}
            <button
              onclick={() => goToPage(page as number)}
              class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                     {currentPage === page
                       ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                       : 'text-slate-600 hover:bg-slate-100'}"
              aria-label="Page {page}"
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          {/if}
        {/each}

        <!-- Next -->
        <button
          onclick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages()}
          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100
                 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  {/if}

</div>
