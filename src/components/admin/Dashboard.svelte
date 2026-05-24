<script lang="ts">
  import { useDashboard } from '../../composables/dashboard/useDashboard';

  const dashboardQuery = useDashboard();

  function formatRp(n: number): string {
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
    if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
    return `Rp ${n.toLocaleString('id-ID')}`;
  }
</script>

<!-- ────────────────────────── LOADING ────────────────────────── -->
{#if dashboardQuery.isLoading}
  <div class="flex flex-col items-center justify-center py-32 gap-4">
    <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p class="text-slate-500 text-sm">Loading dashboard…</p>
  </div>

<!-- ────────────────────────── ERROR ─────────────────────────── -->
{:else if dashboardQuery.isError}
  <div class="bg-red-50 border border-red-200 rounded-2xl p-10 text-center max-w-md mx-auto mt-10">
    <div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <h3 class="text-sm font-semibold text-red-800 mb-1">Failed to load dashboard</h3>
    <p class="text-sm text-red-600 mb-4">{dashboardQuery.error?.message}</p>
    <button
      onclick={() => dashboardQuery.refetch()}
      class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>

<!-- ────────────────────────── DATA ──────────────────────────── -->
{:else if dashboardQuery.data}
  {@const d = dashboardQuery.data}

  <div class="space-y-6">

    <!-- ── Revenue cards ── -->
    <section>
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Revenue</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <!-- Total -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 p-5 text-white shadow-lg shadow-indigo-200">
          <div class="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10"></div>
          <div class="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5"></div>
          <p class="text-xs font-semibold opacity-80 uppercase tracking-wider mb-1">Total Revenue</p>
          <p class="text-2xl font-bold leading-tight">{formatRp(d.revenue.total)}</p>
          <p class="text-xs opacity-70 mt-1">All payment methods</p>
        </div>

        <!-- Cash -->
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cash</p>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <circle cx="12" cy="12" r="2"></circle>
                <path d="M6 12h.01M18 12h.01"></path>
              </svg>
            </div>
          </div>
          <p class="text-xl font-bold text-slate-800">{formatRp(d.revenue.cash)}</p>
          <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style="width: {d.revenue.total > 0 ? Math.round((d.revenue.cash / d.revenue.total) * 100) : 0}%"
            ></div>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">
            {d.revenue.total > 0 ? Math.round((d.revenue.cash / d.revenue.total) * 100) : 0}% of total
          </p>
        </div>

        <!-- Cashless -->
        <div class="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cashless / QRIS</p>
            <div class="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
          </div>
          <p class="text-xl font-bold text-slate-800">{formatRp(d.revenue.cashless)}</p>
          <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full rounded-full bg-violet-400 transition-all duration-700"
              style="width: {d.revenue.total > 0 ? Math.round((d.revenue.cashless / d.revenue.total) * 100) : 0}%"
            ></div>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">
            {d.revenue.total > 0 ? Math.round((d.revenue.cashless / d.revenue.total) * 100) : 0}% of total
          </p>
        </div>

      </div>
    </section>

    <!-- ── Orders + Products stats row ── -->
    <section>
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">

        <!-- Total orders -->
        <div class="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-800">{d.orders.total}</p>
          <p class="text-xs text-slate-500 mt-0.5">Total Orders</p>
        </div>

        <!-- Success orders -->
        <div class="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-800">{d.orders.success}</p>
          <p class="text-xs text-slate-500 mt-0.5">Successful</p>
        </div>

        <!-- Pending orders -->
        <div class="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-800">{d.orders.pending}</p>
          <p class="text-xs text-slate-500 mt-0.5">Pending</p>
        </div>

        <!-- Products / stock -->
        <div class="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
          <div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <p class="text-2xl font-bold text-slate-800">{d.products.total_product}</p>
          <p class="text-xs text-slate-500 mt-0.5">Products · <span class="font-semibold text-slate-600">{d.products.total_stock}</span> in stock</p>
        </div>

      </div>
    </section>

    <!-- ── Top Products leaderboard ── -->
    <section>
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Top Products</p>
      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        {#each d.top_products as item, i (item.name)}
          {@const maxSold = d.top_products[0]?.total_sold ?? 1}
          {@const pct = Math.round((item.total_sold / maxSold) * 100)}
          {@const rankColors = ['bg-amber-400', 'bg-slate-300', 'bg-amber-600', 'bg-slate-200', 'bg-slate-200']}

          <div class="flex items-center gap-4 px-5 py-4 {i < d.top_products.length - 1 ? 'border-b border-slate-100' : ''}">
            <!-- Rank -->
            <div class="w-6 h-6 rounded-full {rankColors[i] ?? 'bg-slate-100'} flex items-center justify-center shrink-0">
              <span class="text-[10px] font-bold text-white">{i + 1}</span>
            </div>

            <!-- Image -->
            <div class="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={item.product_image}
                alt={item.name}
                class="w-full h-full object-cover"
                onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            <!-- Name + bar -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
              <div class="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  class="h-full rounded-full bg-indigo-500 transition-all duration-700"
                  style="width: {pct}%"
                ></div>
              </div>
            </div>

            <!-- Sold count -->
            <div class="text-right shrink-0">
              <p class="text-sm font-bold text-slate-800">{item.total_sold}</p>
              <p class="text-[10px] text-slate-400">sold</p>
            </div>
          </div>
        {/each}
      </div>
    </section>

  </div>
{/if}
