<script lang="ts">
  import type { BraceletSlot } from '../../types/bracelet';

  let {
    slots,
    onRemove,
    onMoveLeft,
    onMoveRight,
    isReadOnly = false,
  }: {
    slots: BraceletSlot[];
    onRemove?: (instanceId: string) => void;
    onMoveLeft: (instanceId: string) => void;
    onMoveRight: (instanceId: string) => void;
    isReadOnly?: boolean;
  } = $props();

  let totalPrice = $derived(slots.reduce((sum, s) => sum + s.product.price, 0));
  // Which charm is "selected" (tapped) on mobile – reveals controls
  let activeId = $state<string | null>(null);

  function toggleActive(id: string) {
    if (!isReadOnly) {
      activeId = activeId === id ? null : id;
    } else {
      activeId = id;
    }
  }

  function formatPrice(price: number) {
    return `Rp ${price.toLocaleString('id-ID')}`;
  }
</script>

{#if slots.length === 0}
  <!-- Empty state -->
  <div class="flex flex-col items-center justify-center py-12 px-6 rounded-lg border border-dashed border-black/20 bg-gray-50 text-center">
    <div class="w-14 h-14 rounded-full bg-white border border-black/20 flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-black/40">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 12h8M12 8v8" stroke-width="1.5"></path>
      </svg>
    </div>
    <p class="text-sm font-semibold text-black mb-1">Your bracelet is empty</p>
    <p class="text-xs text-gray-600 max-w-[160px] leading-relaxed">Pick charms from the catalog above to get started</p>
  </div>

{:else}
  <!-- Bracelet container -->
  <div class="rounded-lg border border-black/10 bg-white overflow-hidden">

    <!-- Header bar -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-black/10">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span class="text-xs font-semibold text-gray-700 uppercase tracking-widest">
          {slots.length} charm{slots.length !== 1 ? 's' : ''}
        </span>
      </div>
      <span class="text-xs font-bold text-black bg-gray-100 px-2.5 py-1 rounded-full">
        {formatPrice(totalPrice)}
      </span>
    </div>

    <!-- Hint: different for touch vs pointer -->
    <p class="text-center text-[10px] text-gray-600 pt-3 px-4 tracking-wide uppercase font-medium">
      {#if isReadOnly}
        <span class="hidden sm:inline">Hover</span><span class="sm:hidden">Tap</span> a charm to reorder
      {:else}
        <span class="hidden sm:inline">Hover</span><span class="sm:hidden">Tap</span> a charm to reorder or remove
      {/if}
    </p>

    <!-- Scrollable chain strip -->
    <div class="overflow-x-auto px-4 pb-5 pt-3 select-none"
      style="-webkit-overflow-scrolling: touch;"
    >
      <div class="flex items-end gap-0 min-w-max mx-auto">
        {#each slots as slot, i (slot.instanceId)}

          {@const isActive = activeId === slot.instanceId}

          <!-- Start clasp -->
          {#if i === 0}
            <div class="flex items-center mr-1 shrink-0 self-start mt-9">
              <div class="w-3 h-3 rounded-full border-2 border-black bg-gray-200 shadow-sm"></div>
              <div class="w-4 h-0.5 bg-gradient-to-r from-black to-gray-400"></div>
            </div>
          {/if}

          <!-- Charm card -->
          <div class="relative flex flex-col items-center shrink-0 group/charm">

            <!-- Position badge -->
            <span class="absolute -top-2 left-1/2 -translate-x-1/2 min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center z-20 shadow-sm">
              {i + 1}
            </span>

            <!-- Card body — tappable on mobile -->
            <div class="relative">
              <button
                type="button"
                onclick={() => toggleActive(slot.instanceId)}
                class="relative w-[68px] sm:w-20 bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-200 focus:outline-none
                  {isActive
                    ? 'border-black shadow-md -translate-y-0.5'
                    : 'border-black/20 sm:group-hover/charm:shadow-md sm:group-hover/charm:border-black sm:group-hover/charm:-translate-y-0.5'}"
                aria-label="Select {slot.product.name}"
              >
                <!-- Charm image -->
                <div class="aspect-square overflow-hidden bg-gray-100">
                  <img src={slot.product.product_image} alt={slot.product.name} class="w-full h-full object-cover" />
                </div>
                <!-- Name -->
                <div class="px-1.5 py-1 bg-white">
                  <p class="text-[9px] sm:text-[10px] font-medium text-gray-700 text-center leading-tight line-clamp-2">{slot.product.name}</p>
                </div>
              </button>

              <!-- Remove button — hidden in read-only mode -->
              {#if !isReadOnly}
                <button
                  type="button"
                  onclick={(e) => { e.stopPropagation(); onRemove?.(slot.instanceId); }}
                  class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-gray-800 z-10 transition-all duration-150 active:scale-90
                    {isActive ? 'opacity-100' : 'opacity-0 sm:group-hover/charm:opacity-100'}"
                  aria-label="Remove {slot.product.name}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              {/if}
            </div>

            <!-- Move controls — always visible on mobile (isActive), hover on desktop -->
            <div class="flex items-center gap-1.5 mt-2 transition-all duration-200
              {isActive ? 'opacity-100' : 'opacity-0 sm:group-hover/charm:opacity-100'}">
              <button
                type="button"
                onclick={() => onMoveLeft(slot.instanceId)}
                disabled={i === 0}
                class="w-7 h-7 rounded-md bg-white border border-black/20 text-gray-600 flex items-center justify-center transition-all duration-150 active:scale-90
                  hover:border-black hover:text-black hover:bg-gray-50
                  disabled:opacity-25 disabled:cursor-not-allowed"
                aria-label="Move left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onclick={() => onMoveRight(slot.instanceId)}
                disabled={i === slots.length - 1}
                class="w-7 h-7 rounded-md bg-white border border-black/20 text-gray-600 flex items-center justify-center transition-all duration-150 active:scale-90
                  hover:border-black hover:text-black hover:bg-gray-50
                  disabled:opacity-25 disabled:cursor-not-allowed"
                aria-label="Move right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <!-- Link between charms -->
          {#if i < slots.length - 1}
            <div class="flex items-center shrink-0 mb-[52px] px-0.5">
              <div class="w-1.5 h-1.5 rounded-full bg-gray-300 border border-black/20"></div>
              <div class="w-3 h-px bg-gray-300"></div>
              <div class="w-1.5 h-1.5 rounded-full bg-gray-300 border border-black/20"></div>
            </div>
          {/if}

          <!-- End cap -->
          {#if i === slots.length - 1}
            <div class="flex items-center ml-1 shrink-0 self-start mt-9">
              <div class="w-4 h-0.5 bg-gradient-to-l from-black to-gray-400"></div>
              <div class="w-3 h-3 rounded-full border-2 border-black bg-gray-200 shadow-sm"></div>
            </div>
          {/if}

        {/each}
      </div>
    </div>
  </div>
{/if}
