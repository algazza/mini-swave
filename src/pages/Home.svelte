<script lang="ts">
  import { useProduct } from '../composables/product/useProduct';
  import CharmPicker from '../components/user/CharmPicker.svelte';
  import BraceletPreview from '../components/user/BraceletPreview.svelte';
  import CheckoutForm from '../components/user/CheckoutForm.svelte';
  import type { ProductType } from '../types/product';
  import type { BraceletSlot } from '../types/bracelet';

  const productQuery = useProduct();

  // ── Bracelet state ───────────────────────────────────────────────────────────
  let braceletSlots: BraceletSlot[] = $state([]);
  let finalizedSlots: BraceletSlot[] = $state([]);
  let successOrderId: string | null = $state(null);
  let searchQuery: string = $state('');

  // Mobile tab — 'charms' | 'bracelet' | 'checkout'
  type MobileTab = 'charms' | 'bracelet' | 'checkout';
  let mobileTab = $state<MobileTab>('charms');

  // Filter products based on search query
  const filteredProducts = $derived(
    productQuery.data?.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? []
  );

  function addCharm(product: ProductType) {
    braceletSlots = [...braceletSlots, { instanceId: crypto.randomUUID(), product }];
  }

  function removeCharm(instanceId: string) {
    braceletSlots = braceletSlots.filter(s => s.instanceId !== instanceId);
  }

  function moveLeft(instanceId: string) {
    const i = braceletSlots.findIndex(s => s.instanceId === instanceId);
    if (i <= 0) return;
    const updated = [...braceletSlots];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    braceletSlots = updated;
  }

  function moveRight(instanceId: string) {
    const i = braceletSlots.findIndex(s => s.instanceId === instanceId);
    if (i < 0 || i >= braceletSlots.length - 1) return;
    const updated = [...braceletSlots];
    [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
    braceletSlots = updated;
  }

  function moveFinalizedLeft(instanceId: string) {
    const i = finalizedSlots.findIndex(s => s.instanceId === instanceId);
    if (i <= 0) return;
    const updated = [...finalizedSlots];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    finalizedSlots = updated;
  }

  function moveFinalizedRight(instanceId: string) {
    const i = finalizedSlots.findIndex(s => s.instanceId === instanceId);
    if (i < 0 || i >= finalizedSlots.length - 1) return;
    const updated = [...finalizedSlots];
    [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
    finalizedSlots = updated;
  }

  function handleSuccess(orderId: string) {
    finalizedSlots = [...braceletSlots];
    successOrderId = orderId;
  }

  function resetOrder() {
    braceletSlots = [];
    finalizedSlots = [];
    successOrderId = null;
    searchQuery = '';
    mobileTab = 'charms';
  }
</script>

<svelte:head>
  <title>Swave — Design Your Italian Charm Bracelet</title>
  <meta name="description" content="Design your own Italian charm bracelet. Choose your charms, arrange them in order, and place your order online." />
</svelte:head>

<div class="min-h-screen bg-white font-sans antialiased text-black">

  <!-- ════════════════════════════════════════════════════════════ HEADER ══════ -->
  <header class="bg-white border-b border-black/10 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between min-h-[60px] sm:h-16">

      <!-- Brand -->
      <a href="/" class="flex items-center gap-2.5 group" aria-label="Swave home">
        <img src="/logo-swave.png" alt="Swave Logo" class="w-16 md:w-28">
        <div class="leading-tight">
          <span class="hidden sm:inline text-gray-500 text-xs ml-2 font-light tracking-wide">Italian Charm Bracelets</span>
        </div>
      </a>

      <!-- Charm count badge -->
      {#if braceletSlots.length > 0 && !successOrderId}
        <button
          type="button"
          onclick={() => mobileTab = 'bracelet'}
          class="inline-flex items-center gap-1.5 px-3 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black text-white text-xs font-semibold transition-all active:scale-95 hover:bg-gray-800"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
          <span class="hidden xs:inline">{braceletSlots.length} charm{braceletSlots.length !== 1 ? 's' : ''}</span>
          <span class="inline xs:hidden">{braceletSlots.length}</span>
        </button>
      {/if}
    </div>
  </header>

  <!-- ════════════════════════════════════════════════ SUCCESS SCREEN ══════ -->
  {#if successOrderId !== null}
    <div class="flex flex-col items-center justify-start min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-64px)] p-4 sm:p-5 pt-8 sm:pt-12">
      <div class="text-center max-w-sm w-full mb-6 sm:mb-8">

        <!-- Success icon -->
        <div class="relative mx-auto mb-4 sm:mb-6 w-fit">
          <div class="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-black flex items-center justify-center border border-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        <h1 class="text-xl sm:text-2xl font-bold text-black mb-1 sm:mb-2 tracking-tight">Order Placed!</h1>
        <p class="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
          Thank you for your order. Our team will review your bracelet and reach out shortly.
        </p>

        <!-- Order ID -->
        <div class="bg-white border border-black/20 rounded-xl px-4 sm:px-5 py-3 sm:py-4 mb-4 sm:mb-5 text-left">
          <p class="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">Order ID</p>
          <p class="font-mono text-sm sm:text-base font-bold text-black break-all">{successOrderId}</p>
          <p class="text-[10px] sm:text-[11px] text-gray-500 mt-1.5">Save this for your records</p>
        </div>

              <!-- Finalized bracelet preview for cashier -->
      {#if finalizedSlots.length > 0}
        <div class="w-full max-w-2xl mb-4 sm:mb-5">
          <BraceletPreview
            slots={finalizedSlots}
            isReadOnly={true}
            onMoveLeft={moveFinalizedLeft}
            onMoveRight={moveFinalizedRight}
          />
        </div>
      {/if}

        <!-- Next steps -->
        <div class="bg-gray-50 border border-black/10 rounded-xl px-4 sm:px-5 py-3 sm:py-4 mb-5 sm:mb-6 text-left space-y-2 sm:space-y-2.5">
          <p class="text-[9px] sm:text-xs font-bold text-black uppercase tracking-widest mb-1">What's next?</p>
          {#each [
            'Our team will verify your order and payment',
            "You'll be contacted via the phone number provided",
            'Your bracelet will be handcrafted with care ✨'
          ] as step, i}
            <div class="flex items-start gap-2 sm:gap-2.5">
              <span class="w-5 h-5 rounded-full bg-black text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <p class="text-[10px] sm:text-xs text-gray-700 leading-relaxed">{step}</p>
            </div>
          {/each}
        </div>

        <button
          onclick={resetOrder}
          id="design-another-btn"
          class="w-full py-3 sm:py-3.5 rounded-xl bg-black text-white font-semibold text-sm sm:text-base active:scale-[0.98] transition-all hover:bg-gray-900 min-h-[48px]"
        >
          Design Another Bracelet
        </button>
      </div>


    </div>

  <!-- ════════════════════════════════════════════════════ MAIN LAYOUT ══════ -->
  {:else}

  <!-- ════════════════════════════════════════════════════ MAIN LAYOUT ══════ -->

    <!-- Hero strip -->
    <div class="bg-white border-b border-black/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <p class="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-1.5">
          Italian Charm Bracelets — Swave
        </p>
        <h1 class="text-lg sm:text-2xl lg:text-3xl font-bold text-black tracking-tight mb-2">
          Design Your Bracelet
        </h1>
        <p class="text-gray-600 text-xs sm:text-sm max-w-lg leading-relaxed hidden sm:block">
          Choose your charms, arrange them in your preferred order, then fill in your details to place an order.
        </p>

        <!-- Step indicator — desktop only -->
        <div class="hidden sm:flex items-center gap-2 sm:gap-3 mt-4 sm:mt-5 flex-wrap">
          {#each [
            { n: 1, label: 'Choose charms' },
            { n: 2, label: 'Arrange order' },
            { n: 3, label: 'Checkout' },
          ] as step}
            <div class="flex items-center gap-2 sm:gap-3">
              <span class="w-6 h-6 rounded-full text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shrink-0 transition-all duration-300
                {braceletSlots.length > 0 && step.n <= 2 ? 'bg-black' :
                 step.n === 3 && braceletSlots.length > 0 ? 'bg-black' : 'bg-gray-300 text-gray-700'}">
                {step.n}
              </span>
              <span class="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">{step.label}</span>
            </div>
            {#if step.n < 3}
              <div class="w-6 sm:w-10 h-px bg-gray-200"></div>
            {/if}
          {/each}
        </div>
      </div>
    </div>

    <!-- ── MOBILE TAB BAR ── (hidden on lg+) -->
    <div class="lg:hidden sticky top-[60px] sm:top-16 z-20 bg-white border-b border-black/10">
      <div class="flex">
        {#each [
          { id: 'charms' as MobileTab,   label: 'Charms',   n: '1' },
          { id: 'bracelet' as MobileTab, label: 'Bracelet', n: '2', badge: braceletSlots.length },
          { id: 'checkout' as MobileTab, label: 'Checkout', n: '3' },
        ] as tab}
          <button
            type="button"
            onclick={() => mobileTab = tab.id}
            class="flex-1 relative py-3 px-2 text-xs sm:text-sm font-semibold transition-colors duration-150 flex flex-col items-center gap-1 min-h-[52px] active:bg-gray-50
              {mobileTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'}"
          >
            <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center transition-colors
              {mobileTab === tab.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'}">
              {tab.n}
            </span>
            <span class="truncate">{tab.label}</span>
            <!-- {#if tab.badge && tab.badge > 0}
              <span class="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center">{tab.badge}</span>
            {/if} -->
            <!-- Active underline -->
            {#if mobileTab === tab.id}
              <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-black"></span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <!-- ── DESKTOP: two-column, MOBILE: tabbed ── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <!-- LEFT column (desktop) / Tabbed panels (mobile) -->
        <div class="flex-1 min-w-0 w-full space-y-8">

          <!-- ── CHARMS section ── -->
          <section
            id="charm-picker-section"
            aria-labelledby="charm-picker-heading"
            class="{mobileTab !== 'charms' ? 'hidden lg:block' : ''}"
          >
            <div class="flex items-center justify-between mb-3 sm:mb-4">
              <div class="min-w-0">
                <h2 id="charm-picker-heading" class="text-xs sm:text-sm font-bold text-black tracking-tight">
                  Choose Your Charms
                </h2>
                {#if productQuery.data}
                  <p class="text-[10px] sm:text-xs text-gray-500 mt-1">{filteredProducts.length} of {productQuery.data.length} styles</p>
                {/if}
              </div>
            </div>

            <!-- Search input -->
            <div class="mb-4 sm:mb-5">
              <input
                type="text"
                placeholder="Search charms by name..."
                bind:value={searchQuery}
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-black/20 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
            </div>

            {#if productQuery.isLoading}
              <div class="grid grid-cols-2 gap-3 w-full overflow-hidden">
                {#each Array(6) as _}
                  <div class="bg-white rounded-lg border border-black/10 overflow-hidden animate-pulse">
                    <div class="aspect-square bg-gray-100"></div>
                    <div class="p-2.5 space-y-2">
                      <div class="h-3 bg-gray-100 rounded-lg w-3/4"></div>
                      <div class="h-2.5 bg-gray-100 rounded-lg w-1/2"></div>
                      <div class="h-8 bg-gray-100 rounded-lg mt-2"></div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else if productQuery.isError}
              <div class="bg-gray-100 border border-black/20 rounded-lg p-8 text-center">
                <p class="text-sm font-semibold text-black mb-1">Failed to load charms</p>
                <p class="text-xs text-gray-600 mb-4">{productQuery.error?.message}</p>
                <button onclick={() => productQuery.refetch()} class="text-xs font-semibold text-black underline">Try again</button>
              </div>
            {:else if filteredProducts.length === 0 && searchQuery}
              <div class="bg-gray-50 border border-black/10 rounded-lg p-8 text-center">
                <p class="text-sm font-semibold text-black mb-1">No charms found</p>
                <p class="text-xs text-gray-600">Try searching with different keywords</p>
              </div>
            {:else if productQuery.data}
              <CharmPicker products={filteredProducts} slots={braceletSlots} onAdd={addCharm} />

              <!-- Mobile CTA after picking at least one charm -->
              {#if braceletSlots.length > 0}
                <div class="mt-4 sm:mt-5 lg:hidden">
                  <button
                    type="button"
                    onclick={() => mobileTab = 'bracelet'}
                    class="w-full py-3 sm:py-3.5 rounded-lg bg-black text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all min-h-[48px]"
                  >
                    View Bracelet ({braceletSlots.length} charm{braceletSlots.length !== 1 ? 's' : ''})
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              {/if}
            {/if}
          </section>

          <!-- ── BRACELET section ── -->
          <section
            id="bracelet-preview-section"
            aria-labelledby="bracelet-heading"
            class="{mobileTab !== 'bracelet' ? 'hidden lg:block' : ''}"
          >
            <div class="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <div class="min-w-0">
                <h2 id="bracelet-heading" class="text-xs sm:text-sm font-bold text-black tracking-tight">Your Bracelet</h2>
                {#if braceletSlots.length > 0}
                  <p class="text-[10px] sm:text-xs text-gray-500 mt-1">
                    <span class="hidden sm:inline">Hover</span><span class="sm:hidden">Tap</span>
                    a charm to reorder or remove
                  </p>
                {/if}
              </div>
              {#if braceletSlots.length > 0}
                <button
                  onclick={() => braceletSlots = []}
                  class="text-xs text-gray-600 hover:text-black font-medium transition-colors underline underline-offset-2 shrink-0"
                >
                  Clear all
                </button>
              {/if}
            </div>

            <BraceletPreview
              slots={braceletSlots}
              onRemove={removeCharm}
              onMoveLeft={moveLeft}
              onMoveRight={moveRight}
            />

            <!-- Mobile nav buttons inside bracelet tab -->
            <div class="mt-4 sm:mt-5 flex gap-2 sm:gap-3 lg:hidden">
              <button
                type="button"
                onclick={() => mobileTab = 'charms'}
                class="flex-1 py-3 sm:py-3.5 rounded-lg border border-black/20 text-black text-sm sm:text-base font-semibold bg-white active:scale-[0.98] transition-all min-h-[48px]"
              >
                ← Add Charms
              </button>
              <button
                type="button"
                onclick={() => mobileTab = 'checkout'}
                class="flex-1 py-3 sm:py-3.5 rounded-lg bg-black text-white text-sm sm:text-base font-semibold active:scale-[0.98] transition-all min-h-[48px]
                  {braceletSlots.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                disabled={braceletSlots.length === 0}
              >
                Checkout →
              </button>
            </div>
          </section>
        </div>

        <!-- RIGHT: Checkout form (desktop sticky / mobile tab) -->
        <div
          class="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-[calc(60px+52px)]
            {mobileTab !== 'checkout' ? 'hidden lg:block' : ''}"
        >
          <div class="mb-2 sm:mb-3 hidden lg:block">
            <h2 class="text-xs sm:text-sm font-bold text-black tracking-tight">Checkout</h2>
            <p class="text-[10px] sm:text-xs text-gray-500 mt-1">Fill in your details to place an order</p>
          </div>
          <CheckoutForm slots={braceletSlots} onSuccess={handleSuccess} />

          <!-- Mobile back button inside checkout tab -->
          <button
            type="button"
            onclick={() => mobileTab = 'bracelet'}
            class="mt-3 sm:mt-4 w-full py-3 sm:py-3.5 rounded-lg border border-black/20 text-black text-sm sm:text-base font-medium bg-white active:scale-[0.98] transition-all lg:hidden min-h-[48px]"
          >
            ← Back to Bracelet
          </button>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-black/10 mt-6 sm:mt-8 py-4 sm:py-6 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2">
        <div class="flex items-center gap-2">
          <img src="/logo-swave.png" alt="Swave Logo" class="w-16 md:w-28">
        </div>
        <p class="text-xs text-gray-600 text-center sm:text-right">© {new Date().getFullYear()} Swave — Handcrafted Italian Charm Bracelets</p>
      </div>
    </footer>
  {/if}
</div>