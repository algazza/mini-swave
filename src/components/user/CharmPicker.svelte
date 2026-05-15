<script lang="ts">
  import type { ProductType } from '../../types/product';
  import type { BraceletSlot } from '../../types/bracelet';

  let {
    products,
    slots,
    onAdd,
  }: {
    products: ProductType[];
    slots: BraceletSlot[];
    onAdd: (product: ProductType) => void;
  } = $props();

  function countInBracelet(productId: number): number {
    return slots.filter(s => s.product.id === productId).length;
  }

  function isAtStock(product: ProductType): boolean {
    return countInBracelet(product.id) >= product.stock;
  }

  function formatPrice(price: number): string {
    return `Rp ${price.toLocaleString('id-ID')}`;
  }
</script>

<div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
  {#each products as product (product.id)}
    {@const count = countInBracelet(product.id)}
    {@const atStock = isAtStock(product)}
    {@const outOfStock = product.stock === 0}

    <div
      class="group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300
        {atStock || outOfStock
          ? 'border-stone-200 opacity-80'
          : 'border-stone-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/60 cursor-pointer'}"
    >
      <!-- Image -->
      <div class="relative aspect-square overflow-hidden bg-stone-50">
        <img
          src={product.product_image}
          alt={product.name}
          class="w-full h-full object-cover transition-transform duration-500
            {atStock || outOfStock ? '' : 'group-hover:scale-107'}"
        />

        <!-- Count badge -->
        {#if count > 0}
          <div class="absolute top-2.5 right-2.5 min-w-[22px] h-[22px] px-1.5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md shadow-amber-400/30 z-10">
            {count}
          </div>
        {/if}

        <!-- Out of stock / max overlay -->
        {#if outOfStock || atStock}
          <div class="absolute inset-0 bg-stone-900/30 backdrop-blur-[1px] flex items-center justify-center">
            <span class="bg-white/95 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
              {outOfStock ? 'Out of stock' : 'Max reached'}
            </span>
          </div>
        {/if}
      </div>

      <!-- Details -->
      <div class="p-3 sm:p-3.5">
        <h3 class="text-sm font-semibold text-stone-800 truncate leading-tight">{product.name}</h3>
        <p class="text-xs text-amber-700 font-medium mt-0.5 tracking-wide">{formatPrice(product.price)}</p>

        <!-- Stock indicator -->
        <div class="flex items-center gap-1.5 mt-2 mb-3">
          <div class="w-1.5 h-1.5 rounded-full shrink-0
            {product.stock > 5 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'}">
          </div>
          <span class="text-[11px] text-stone-400">
            {outOfStock ? 'Unavailable' : `${product.stock} in stock`}
          </span>
        </div>

        <button
          onclick={() => onAdd(product)}
          disabled={atStock || outOfStock}
          class="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200
            {atStock || outOfStock
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95 shadow-sm shadow-amber-300/50'}"
        >
          {#if !(atStock || outOfStock)}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          {/if}
          {atStock ? 'Max' : outOfStock ? 'Unavailable' : 'Add to bracelet'}
        </button>
      </div>
    </div>
  {/each}
</div>
