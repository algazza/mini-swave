<script lang="ts">
  import type { GetAllCheckoutType } from '../../../types/checkout';

  let {
    checkouts,
    onView,
  }: {
    checkouts: GetAllCheckoutType[];
    onView: (orderId: string) => void;
  } = $props();

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function formatPrice(v: number) {
    return `Rp ${v.toLocaleString('id-ID')}`;
  }
</script>

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
        {#each checkouts as order (order.id)}
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
                <h3 class="text-sm font-medium text-slate-700">No orders yet</h3>
                <p class="text-xs text-slate-400 mt-1">Orders placed by customers will appear here.</p>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
