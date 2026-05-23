<script lang="ts">
  import type { GetAllCheckoutType } from '../../../types/checkout';

  let {
    checkouts,
    onView,
  }: {
    checkouts: GetAllCheckoutType[];
    onView: (orderId: string) => void;
  } = $props();

  // ── Search ────────────────────────────────────────────────────────────────
  let searchQuery = $state('');

  const filtered = $derived(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return checkouts;
    return checkouts.filter(
      (o) =>
        o.order_id.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q),
    );
  });

  // ── Pagination ────────────────────────────────────────────────────────────
  const PAGE_SIZE = 10;
  let currentPage = $state(1);

  // Reset to page 1 whenever the search changes
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

  // Build visible page numbers (show max 5 around current)
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

  // ── Helpers ───────────────────────────────────────────────────────────────
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatPrice(v: number) {
    return `Rp ${v.toLocaleString('id-ID')}`;
  }
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
      id="checkout-search"
      type="text"
      placeholder="Search by order ID, name, or phone…"
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
            <th class="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
            <th class="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
            <th class="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
            <th class="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
            <th class="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
            <th class="px-5 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          {#each paginated() as order (order.id)}
            <tr class="hover:bg-slate-50 transition-colors">
              <!-- Order ID -->
              <td class="px-5 py-4 whitespace-nowrap">
                <span class="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                  {order.order_id}
                </span>
              </td>
              <!-- Customer -->
              <td class="px-5 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-800">{order.name}</div>
                <div class="text-xs text-slate-400">{order.phone}</div>
              </td>
              <!-- Total price -->
              <td class="px-5 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                {formatPrice(order.total_price)}
              </td>
              <!-- Item count -->
              <td class="px-5 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12h4m0 0h4m-4 0V8m0 4v4" stroke-width="2"></path>
                  </svg>
                  {order.total_product} charm{order.total_product !== 1 ? 's' : ''}
                </span>
              </td>
              <!-- Status -->
              <td class="px-5 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                  {order.status_checkout ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}">
                  <div class="w-1.5 h-1.5 rounded-full {order.status_checkout ? 'bg-emerald-500' : 'bg-amber-500'}"></div>
                  {order.status_checkout ? 'Approved' : 'Pending'}
                </span>
              </td>
              <!-- Date -->
              <td class="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                {formatDate(order.created_at)}
              </td>
              <!-- Actions -->
              <td class="px-5 py-4 whitespace-nowrap text-right">
                <button
                  onclick={() => onView(order.order_id)}
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </button>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="7" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                  <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  {#if searchQuery.trim()}
                    <h3 class="text-sm font-medium text-slate-700">No results found</h3>
                    <p class="text-xs text-slate-400 mt-1">Try a different order ID, name, or phone number.</p>
                  {:else}
                    <h3 class="text-sm font-medium text-slate-700">No orders yet</h3>
                    <p class="text-xs text-slate-400 mt-1">Orders placed by customers will appear here.</p>
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
          of {filtered().length} order{filtered().length !== 1 ? 's' : ''}
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
