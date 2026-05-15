<script lang="ts">
  import type { DiscountType } from '../../../types/discount';

  let {
    discounts,
    onEdit,
    onDelete,
  }: {
    discounts: DiscountType[];
    onEdit: (discount: DiscountType) => void;
    onDelete: (discount: DiscountType) => void;
  } = $props();
</script>

<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-slate-200">
      <thead class="bg-slate-50">
        <tr>
          <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Discount Code
          </th>
          <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Percentage
          </th>
          <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 bg-white">
        {#each discounts as discount (discount.id)}
          <tr class="hover:bg-slate-50 transition-colors group">
            <!-- Code -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </div>
                <span class="font-mono text-sm font-semibold text-slate-800 tracking-widest bg-slate-100 px-2.5 py-1 rounded-md">
                  {discount.disc_code}
                </span>
              </div>
            </td>

            <!-- Percentage -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold
                {discount.percentage >= 50
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : discount.percentage >= 20
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="5" x2="5" y2="19"></line>
                  <circle cx="6.5" cy="6.5" r="2.5"></circle>
                  <circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
                {discount.percentage}% off
              </span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onclick={() => onEdit(discount)}
                  class="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit Discount"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  onclick={() => onDelete(discount)}
                  class="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Discount"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="3" class="px-6 py-16 text-center">
              <div class="flex flex-col items-center justify-center">
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </div>
                <h3 class="text-sm font-medium text-slate-900">No discounts found</h3>
                <p class="mt-1 text-sm text-slate-500">Get started by creating a new discount code.</p>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
