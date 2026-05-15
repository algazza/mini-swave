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
  let successOrderId: string | null = $state(null);

  // Mobile tab — 'charms' | 'bracelet' | 'checkout'
  type MobileTab = 'charms' | 'bracelet' | 'checkout';
  let mobileTab = $state<MobileTab>('charms');

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

  function handleSuccess(orderId: string) {
    successOrderId = orderId;
  }

  function resetOrder() {
    braceletSlots = [];
    successOrderId = null;
    mobileTab = 'charms';
  }
</script>

<svelte:head>
  <title>Swave — Design Your Italian Charm Bracelet</title>
  <meta name="description" content="Design your own Italian charm bracelet. Choose your charms, arrange them in order, and place your order online." />
</svelte:head>

<div class="min-h-screen bg-stone-50 font-sans antialiased">

  <!-- ════════════════════════════════════════════════════════════ HEADER ══════ -->
  <header class="bg-white/90 backdrop-blur-md border-b border-stone-100/80 sticky top-0 z-30 shadow-sm shadow-stone-100/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-2 flex items-center justify-between min-h-[60px] sm:h-14">

      <!-- Brand -->
      <a href="/" class="flex items-center gap-2.5 group" aria-label="Swave home">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-300/40 transition-transform duration-200 group-hover:scale-105 active:scale-95 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
        <div class="leading-tight">
          <span class="font-bold text-stone-800 text-sm sm:text-base tracking-tight">Swave</span>
          <span class="hidden sm:inline text-stone-400 text-xs ml-2 font-light tracking-wide">Italian Charm Bracelets</span>
        </div>
      </a>

      <!-- Charm count badge -->
      {#if braceletSlots.length > 0 && !successOrderId}
        <button
          type="button"
          onclick={() => mobileTab = 'bracelet'}
          class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-200/60 transition-colors active:scale-95 hover:bg-amber-200/70 sm:hover:bg-amber-200/70 min-h-[44px] sm:min-h-auto"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
          <span class="hidden xs:inline">{braceletSlots.length} charm{braceletSlots.length !== 1 ? 's' : ''}</span>
          <span class="inline xs:hidden">{braceletSlots.length}</span>
        </button>
      {/if}
    </div>
  </header>

  <!-- ════════════════════════════════════════════════ SUCCESS SCREEN ══════ -->
  {#if successOrderId !== null}
    <div class="flex items-center justify-center min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-56px)] p-4 sm:p-5">
      <div class="text-center max-w-sm w-full">

        <!-- Success icon -->
        <div class="relative mx-auto mb-4 sm:mb-6 w-fit">
          <div class="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200 shadow-lg shadow-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        <h1 class="text-xl sm:text-2xl font-bold text-stone-800 mb-1 sm:mb-2 tracking-tight">Order Placed!</h1>
        <p class="text-stone-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
          Thank you for your order. Our team will review your bracelet and reach out shortly.
        </p>

        <!-- Order ID -->
        <div class="bg-stone-50 border border-stone-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 mb-4 sm:mb-5 text-left">
          <p class="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-widest font-semibold mb-1.5">Order ID</p>
          <p class="font-mono text-sm sm:text-base font-bold text-stone-800 break-all">{successOrderId}</p>
          <p class="text-[10px] sm:text-[11px] text-stone-400 mt-1.5">Save this for your records</p>
        </div>

        <!-- Next steps -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 mb-5 sm:mb-6 text-left space-y-2 sm:space-y-2.5">
          <p class="text-[9px] sm:text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">What's next?</p>
          {#each [
            'Our team will verify your order and payment',
            "You'll be contacted via the phone number provided",
            'Your bracelet will be handcrafted with care ✨'
          ] as step, i}
            <div class="flex items-start gap-2 sm:gap-2.5">
              <span class="w-5 h-5 rounded-full bg-amber-200 text-amber-700 text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <p class="text-[10px] sm:text-xs text-amber-700 leading-relaxed">{step}</p>
            </div>
          {/each}
        </div>

        <button
          onclick={resetOrder}
          id="design-another-btn"
          class="w-full py-3 sm:py-3.5 rounded-xl bg-amber-500 text-white font-semibold text-sm sm:text-base active:scale-[0.98] transition-all shadow-md shadow-amber-300/50 hover:bg-amber-600 min-h-[48px]"
        >
          Design Another Bracelet
        </button>
      </div>
    </div>

  <!-- ════════════════════════════════════════════════════ MAIN LAYOUT ══════ -->
  {:else}

    <!-- Hero strip -->
    <div class="bg-white border-b border-stone-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <p class="text-[10px] sm:text-[11px] font-semibold text-amber-600 uppercase tracking-[0.15em] mb-1.5">
          Italian Charm Bracelets — Swave
        </p>
        <h1 class="text-lg sm:text-2xl lg:text-3xl font-bold text-stone-800 tracking-tight mb-2">
          Design Your Bracelet
        </h1>
        <p class="text-stone-500 text-xs sm:text-sm max-w-lg leading-relaxed hidden sm:block">
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
                {braceletSlots.length > 0 && step.n <= 2 ? 'bg-amber-500' :
                 step.n === 3 && braceletSlots.length > 0 ? 'bg-amber-500' : 'bg-stone-200 text-stone-500'}">
                {step.n}
              </span>
              <span class="text-xs sm:text-sm font-medium text-stone-500 whitespace-nowrap">{step.label}</span>
            </div>
            {#if step.n < 3}
              <div class="w-6 sm:w-10 h-px bg-stone-200"></div>
            {/if}
          {/each}
        </div>
      </div>
    </div>

    <!-- ── MOBILE TAB BAR ── (hidden on lg+) -->
    <div class="lg:hidden sticky top-[60px] sm:top-14 z-20 bg-white border-b border-stone-100 shadow-sm">
      <div class="flex">
        {#each [
          { id: 'charms' as MobileTab,   label: 'Charms',   n: '1' },
          { id: 'bracelet' as MobileTab, label: 'Bracelet', n: '2', badge: braceletSlots.length },
          { id: 'checkout' as MobileTab, label: 'Checkout', n: '3' },
        ] as tab}
          <button
            type="button"
            onclick={() => mobileTab = tab.id}
            class="flex-1 relative py-3 px-2 text-xs sm:text-sm font-semibold transition-colors duration-150 flex flex-col items-center gap-1 min-h-[52px] active:bg-amber-50
              {mobileTab === tab.id ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'}"
          >
            <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center transition-colors
              {mobileTab === tab.id ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200'}">
              {tab.n}
            </span>
            <span class="truncate">{tab.label}</span>
            {#if tab.badge && tab.badge > 0}
              <span class="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center">{tab.badge}</span>
            {/if}
            <!-- Active underline -->
            {#if mobileTab === tab.id}
              <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-amber-500"></span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <!-- ── DESKTOP: two-column, MOBILE: tabbed ── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <!-- LEFT column (desktop) / Tabbed panels (mobile) -->
        <div class="flex-1 min-w-0 space-y-8">

          <!-- ── CHARMS section ── -->
          <section
            id="charm-picker-section"
            aria-labelledby="charm-picker-heading"
            class="{mobileTab !== 'charms' ? 'hidden lg:block' : ''}"
          >
            <div class="flex items-center justify-between mb-3 sm:mb-4">
              <div class="min-w-0">
                <h2 id="charm-picker-heading" class="text-xs sm:text-sm font-bold text-stone-800 tracking-tight">
                  Choose Your Charms
                </h2>
                {#if productQuery.data}
                  <p class="text-[10px] sm:text-xs text-stone-400 mt-1">{productQuery.data.length} styles available</p>
                {/if}
              </div>
            </div>

            {#if productQuery.isLoading}
              <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {#each Array(6) as _}
                  <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse">
                    <div class="aspect-square bg-stone-100"></div>
                    <div class="p-3.5 space-y-2">
                      <div class="h-3 bg-stone-100 rounded-lg w-3/4"></div>
                      <div class="h-2.5 bg-stone-100 rounded-lg w-1/2"></div>
                      <div class="h-8 bg-stone-100 rounded-xl mt-3"></div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else if productQuery.isError}
              <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p class="text-sm font-semibold text-red-700 mb-1">Failed to load charms</p>
                <p class="text-xs text-red-500 mb-4">{productQuery.error?.message}</p>
                <button onclick={() => productQuery.refetch()} class="text-xs font-semibold text-red-600 underline">Try again</button>
              </div>
            {:else if productQuery.data}
              <CharmPicker products={productQuery.data} slots={braceletSlots} onAdd={addCharm} />

              <!-- Mobile CTA after picking at least one charm -->
              {#if braceletSlots.length > 0}
                <div class="mt-4 sm:mt-5 lg:hidden">
                  <button
                    type="button"
                    onclick={() => mobileTab = 'bracelet'}
                    class="w-full py-3 sm:py-3.5 rounded-xl bg-amber-500 text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-md shadow-amber-300/40 active:scale-[0.98] transition-all min-h-[48px]"
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
                <h2 id="bracelet-heading" class="text-xs sm:text-sm font-bold text-stone-800 tracking-tight">Your Bracelet</h2>
                {#if braceletSlots.length > 0}
                  <p class="text-[10px] sm:text-xs text-stone-400 mt-1">
                    <span class="hidden sm:inline">Hover</span><span class="sm:hidden">Tap</span>
                    a charm to reorder or remove
                  </p>
                {/if}
              </div>
              {#if braceletSlots.length > 0}
                <button
                  onclick={() => braceletSlots = []}
                  class="text-xs text-red-400 hover:text-red-600 font-medium transition-colors underline underline-offset-2 shrink-0"
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
                class="flex-1 py-3 sm:py-3.5 rounded-xl border border-stone-200 text-stone-600 text-sm sm:text-base font-semibold bg-white active:scale-[0.98] transition-all min-h-[48px]"
              >
                ← Add Charms
              </button>
              <button
                type="button"
                onclick={() => mobileTab = 'checkout'}
                class="flex-1 py-3 sm:py-3.5 rounded-xl bg-amber-500 text-white text-sm sm:text-base font-semibold shadow-md shadow-amber-300/40 active:scale-[0.98] transition-all min-h-[48px]
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
            <h2 class="text-xs sm:text-sm font-bold text-stone-800 tracking-tight">Checkout</h2>
            <p class="text-[10px] sm:text-xs text-stone-400 mt-1">Fill in your details to place an order</p>
          </div>
          <CheckoutForm slots={braceletSlots} onSuccess={handleSuccess} />

          <!-- Mobile back button inside checkout tab -->
          <button
            type="button"
            onclick={() => mobileTab = 'bracelet'}
            class="mt-3 sm:mt-4 w-full py-3 sm:py-3.5 rounded-xl border border-stone-200 text-stone-600 text-sm sm:text-base font-medium bg-white active:scale-[0.98] transition-all lg:hidden min-h-[48px]"
          >
            ← Back to Bracelet
          </button>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-stone-100 mt-6 sm:mt-8 py-4 sm:py-6 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <span class="text-xs font-semibold text-stone-600">Swave</span>
        </div>
        <p class="text-xs text-stone-400 text-center sm:text-right">© {new Date().getFullYear()} Swave — Handcrafted Italian Charm Bracelets</p>
      </div>
    </footer>
  {/if}
</div>