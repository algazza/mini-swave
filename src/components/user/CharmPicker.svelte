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

  // Group products by name while preserving insertion order
  const groupedProducts = $derived(() => {
    const map = new Map<string, ProductType[]>();
    for (const p of products) {
      const existing = map.get(p.name);
      if (existing) {
        existing.push(p);
      } else {
        map.set(p.name, [p]);
      }
    }
    return Array.from(map.entries()); // [name, products[]][]
  });

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

<div class="space-y-5 w-full overflow-hidden">
  {#each groupedProducts() as [groupName, groupItems] (groupName)}
    <div>
      <!-- Group divider header -->
      <div class="flex items-center gap-2 mb-2.5 sm:mb-3">
        <span class="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.14em] whitespace-nowrap shrink-0">
          {groupName}
        </span>
        <div class="flex-1 h-px bg-black/8"></div>
      </div>

      <!-- Product grid for this group -->
      <div class="grid grid-cols-2 gap-2 sm:gap-4">
        {#each groupItems as product (product.id)}
          {@const count = countInBracelet(product.id)}
          {@const atStock = isAtStock(product)}
          {@const outOfStock = product.stock === 0}

          <div
            class="group relative bg-white rounded-lg border overflow-hidden transition-all duration-300
              {atStock || outOfStock
                ? 'border-black/10 opacity-60'
                : 'border-black/10 hover:border-black/30 hover:shadow-md cursor-pointer'}"
          >
            <!-- Image -->
            <div class="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={product.product_image}
                alt={product.name}
                class="w-full h-full object-cover transition-transform duration-500
                  {atStock || outOfStock ? '' : 'group-hover:scale-105'}"
              />

              <!-- Count badge -->
              {#if count > 0}
                <div class="absolute top-2 right-2 min-w-[20px] h-[20px] px-1 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center z-10">
                  {count}
                </div>
              {/if}

              <!-- Out of stock / max overlay -->
              {#if outOfStock || atStock}
                <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                  <span class="bg-white/95 text-black text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
                    {outOfStock ? 'Out' : 'Max'}
                  </span>
                </div>
              {/if}
            </div>

            <!-- Details -->
            <div class="p-2 sm:p-3 space-y-2">
              <!-- Mobile: Price and stock only -->
              <div class="sm:hidden">
                <p class="text-xs font-semibold text-black">{formatPrice(product.price)}</p>
                <p class="text-[10px] text-gray-600 mt-0.5">{outOfStock ? 'Out of stock' : `${product.stock} left`}</p>
              </div>

              <!-- Desktop: Full details -->
              <div class="hidden sm:block">
                <p class="text-xs text-black font-medium mt-0.5">{formatPrice(product.price)}</p>

                <!-- Stock indicator -->
                <div class="flex items-center gap-1.5 mt-1.5 mb-2">
                  <div class="w-1 h-1 rounded-full shrink-0
                    {product.stock > 5 ? 'bg-black' : product.stock > 0 ? 'bg-gray-400' : 'bg-gray-300'}">
                  </div>
                  <span class="text-[10px] text-gray-600">
                    {outOfStock ? 'Unavailable' : `${product.stock} in stock`}
                  </span>
                </div>
              </div>

              <button
                onclick={() => onAdd(product)}
                disabled={atStock || outOfStock}
                class="w-full flex items-center justify-center gap-1 py-1.5 sm:py-2 rounded-md text-xs font-semibold tracking-wide transition-all duration-200
                  {atStock || outOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-900 active:scale-95'}"
              >
                {#if !(atStock || outOfStock)}
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                {/if}
                <span class="hidden sm:inline">{atStock ? 'Max' : outOfStock ? 'Unavailable' : 'Add'}</span>
                <span class="sm:hidden">{atStock ? 'Max' : outOfStock ? 'Out' : 'Add'}</span>
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
