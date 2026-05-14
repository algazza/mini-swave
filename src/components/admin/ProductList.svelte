<script lang="ts">
  import type { ProductType } from '../../types/product';

  let { 
    products, 
    onEdit, 
    onDelete 
  }: { 
    products: ProductType[], 
    onEdit: (product: ProductType) => void, 
    onDelete: (product: ProductType) => void 
  } = $props();
</script>

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
        {#each products as product (product.id)}
          <tr class="hover:bg-slate-50 transition-colors group">
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
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-slate-900 font-medium">Rp {product.price.toLocaleString('id-ID')}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {product.stock > 10 ? 'bg-green-100 text-green-800 border border-green-200' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-red-100 text-red-800 border border-red-200'}">
                {product.stock} in stock
              </span>
            </td>
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
                <h3 class="text-sm font-medium text-slate-900">No products found</h3>
                <p class="mt-1 text-sm text-slate-500">Get started by creating a new product.</p>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
