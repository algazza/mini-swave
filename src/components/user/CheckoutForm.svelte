<script lang="ts">
  import { useAddCheckout } from '../../composables/checkout/useAddCheckout';
  import type { BraceletSlot } from '../../types/bracelet';

  let {
    slots,
    onSuccess,
  }: {
    slots: BraceletSlot[];
    onSuccess: (orderId: string) => void;
  } = $props();

  const addCheckoutMutation = useAddCheckout();

  // ── Form state ──────────────────────────────────────────────────────────────
  let name        = $state('');
  let phone       = $state('');
  let paymentMethod = $state<'cash' | 'QRIS'>('cash');
  let receiptFile: File | null = $state(null);
  let receiptPreview: string | null = $state(null);
  let isDragging  = $state(false);
  let formError   = $state('');
  let showQrModal = $state(false);

  // ── Derived ─────────────────────────────────────────────────────────────────
  let subtotal  = $derived(slots.reduce((sum, s) => sum + s.product.price, 0));
  let isQris    = $derived(paymentMethod === 'QRIS');
  let isPending = $derived(addCheckoutMutation.isPending);
  let canSubmit = $derived(slots.length > 0 && !isPending);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function formatPrice(v: number) {
    return `Rp ${v.toLocaleString('id-ID')}`;
  }

  function handlePhoneInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let value = input.value;
    
    // Remove any non-digit and non-plus characters
    value = value.replace(/[^0-9+]/g, '');
    
    // Ensure it starts with +62
    if (!value.startsWith('+62')) {
      if (value.startsWith('62')) {
        value = '+' + value;
      } else if (value.startsWith('0')) {
        value = '+62' + value.substring(1);
      } else if (value.length > 0) {
        value = '+62' + value;
      }
    }
    
    // Limit to 15 characters (+62 + 12 digits max)
    value = value.slice(0, 15);
    
    phone = value;
    input.value = value;
  }

  function handleReceiptSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) setReceipt(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) setReceipt(file);
  }

  function setReceipt(file: File) {
    receiptFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => { receiptPreview = ev.target?.result as string; };
    reader.readAsDataURL(file);
  }

  function clearReceipt() {
    receiptFile = null;
    receiptPreview = null;
  }

  function switchToCash() {
    paymentMethod = 'cash';
    clearReceipt();
  }

  function validate(): boolean {
    if (slots.length === 0)              { formError = 'Please add at least one charm to your bracelet.'; return false; }
    const trimmedName = name.trim();
    if (!trimmedName)                    { formError = 'Please enter your full name.'; return false; }
    if (trimmedName.length > 100)        { formError = 'Name must be 100 characters or less.'; return false; }
    const trimmedPhone = phone.trim();
    if (!trimmedPhone)                   { formError = 'Please enter your phone number.'; return false; }
    if (!/^\+62\d{8,12}$/.test(trimmedPhone)) { formError = 'Phone must start with +62 and contain 8-12 digits.'; return false; }
    if (isQris && !receiptFile)          { formError = 'Please upload your payment receipt for QRIS.'; return false; }
    formError = '';
    return true;
  }

  function buildProductCheckout() {
    const map = new Map<number, number>();
    for (const slot of slots) {
      map.set(slot.product.id, (map.get(slot.product.id) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([product_id, quantity]) => ({ product_id, quantity }));
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await addCheckoutMutation.mutateAsync({
        name:            name,
        phone:           phone,
        payment_method:  paymentMethod,
        receipt:         isQris ? receiptFile : null,
        product_checkout: buildProductCheckout(),
      });
      onSuccess(res?.order_id ?? '');
    } catch (err) {
      formError = (err as Error).message || 'Failed to place order. Please try again.';
    }
  }

  function downloadQR() {
    const link = document.createElement('a');
    link.href = '/IMG_8770.png';
    link.download = 'qris-payment-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<!-- ═══════════════════════════════════════════════════ CHECKOUT CARD ══════ -->
<div class="bg-white rounded-lg border border-black/10 shadow-sm overflow-hidden">

  <!-- Card header: Order summary -->
  <div class="px-5 pt-5 pb-4 border-b border-black/10">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-5 h-5 rounded-md bg-black flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      </div>
      <h2 class="text-sm font-bold text-black tracking-tight">Order Summary</h2>
    </div>

    {#if slots.length > 0}
      <div class="space-y-1.5 max-h-40 overflow-y-auto pr-0.5
        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {#each slots as slot, i (slot.instanceId)}
          <div class="flex items-center gap-2.5">
            <span class="w-[18px] h-[18px] rounded-full bg-gray-200 text-gray-600 text-[9px] font-bold flex items-center justify-center shrink-0 border border-black/10">{i + 1}</span>
            <img src={slot.product.product_image} alt="" class="w-6 h-6 rounded-md object-cover shrink-0 border border-black/10" />
            <span class="text-xs text-gray-700 truncate flex-1 font-medium">{slot.product.name}</span>
            <span class="text-[11px] text-gray-500 shrink-0 tabular-nums">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(slot.product.price)}</span>
          </div>
        {/each}
      </div>

      <div class="mt-3 pt-3 border-t border-black/10 flex justify-between items-center">
        <span class="text-xs text-gray-600 font-medium">Subtotal <span class="text-gray-500">({slots.length} charm{slots.length !== 1 ? 's' : ''})</span></span>
        <span class="text-sm font-bold text-black">{formatPrice(subtotal)}</span>
      </div>
    {:else}
      <div class="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50 border border-black/10">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 shrink-0">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p class="text-xs text-gray-500">Add charms to see your order summary.</p>
      </div>
    {/if}
  </div>

  <!-- Form -->
  <form id="checkoutForm" onsubmit={handleSubmit} class="px-5 py-5 space-y-4" novalidate>

    <!-- Name -->
    <div>
      <label for="c-name" class="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
        Full Name <span class="text-red-500">*</span>
      </label>
      <div class="flex items-center gap-2">
        <input
          id="c-name"
          type="text"
          bind:value={name}
          maxlength="100"
          placeholder="e.g. Anya Maharani"
          autocomplete="name"
          class="flex-1 px-3.5 py-2.5 text-sm bg-gray-50 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-black focus:bg-white transition-all duration-150 placeholder:text-gray-400 text-black"
        />
      </div>
    </div>

    <!-- Phone -->
    <div>
      <label for="c-phone" class="block text-xs font-semibold text-gray-700 mb-1.5 tracking-wide">
        Phone Number <span class="text-red-500">*</span>
      </label>
      <input
        id="c-phone"
        type="tel"
        value={phone}
        oninput={handlePhoneInput}
        placeholder="e.g. +628123456789"
        autocomplete="tel"
        class="w-full px-3.5 py-2.5 text-sm font-mono bg-gray-50 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-black focus:bg-white transition-all duration-150 placeholder:text-gray-400 placeholder:font-sans text-black"
      />
      <p class="text-[10px] text-gray-500 mt-1">Must start with +62 and contain 8-12 digits (11-15 characters total)</p>
    </div>

    <!-- Divider -->
    <div class="border-t border-black/10 my-1"></div>

    <!-- Payment method -->
    <div>
      <p class="text-xs font-semibold text-gray-700 mb-2 tracking-wide">
        Payment Method <span class="text-red-500">*</span>
      </p>
      <div class="grid grid-cols-2 gap-2">
        <!-- Cash -->
        <button
          type="button"
          id="payment-cash"
          onclick={switchToCash}
          class="relative flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-lg border-2 text-sm font-medium transition-all duration-200
            {paymentMethod === 'cash'
              ? 'border-black bg-gray-100 text-black'
              : 'border-black/10 text-gray-600 hover:border-black/20 bg-white hover:bg-gray-50'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 12h.01M18 12h.01"></path>
          </svg>
          <span class="text-xs font-semibold">Cash</span>
          {#if paymentMethod === 'cash'}
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-black"></span>
          {/if}
        </button>

        <!-- QRIS -->
        <button
          type="button"
          id="payment-qris"
          onclick={() => paymentMethod = 'QRIS'}
          class="relative flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-lg border-2 text-sm font-medium transition-all duration-200
            {paymentMethod === 'QRIS'
              ? 'border-black bg-gray-100 text-black'
              : 'border-black/10 text-gray-600 hover:border-black/20 bg-white hover:bg-gray-50'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          </svg>
          <span class="text-xs font-semibold">QRIS</span>
          {#if paymentMethod === 'QRIS'}
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-black"></span>
          {/if}
        </button>
      </div>
    </div>

    <!-- ── QRIS section ── -->
    {#if isQris}
      <div class="rounded-lg border border-black/20 bg-white overflow-hidden" id="qris-section">

        <!-- QRIS heading -->
        <div class="px-4 pt-4 pb-3 text-center border-b border-black/10">
          <p class="text-xs font-bold text-black uppercase tracking-widest">Scan to Pay</p>
          <p class="text-[11px] text-gray-600 mt-0.5">Use any mobile banking or e-wallet app</p>
        </div>

        <!-- QR image — full-width on mobile, fixed on larger screens -->
        <div class="flex justify-center px-4 py-4">
          <div class="p-2 bg-white rounded-lg border border-black/20 shadow-sm w-full max-w-[220px] cursor-pointer hover:shadow-md transition-shadow duration-200" onclick={() => showQrModal = true}>
            <img
              src="/IMG_8770.png"
              alt="QRIS Payment Code"
              class="w-full aspect-square object-contain rounded-md"
            />
          </div>
        </div>

        <!-- Instruction -->
        <p class="text-[11px] text-gray-700 text-center px-4 pb-3 leading-relaxed">
          After completing payment, upload your screenshot or receipt below.
        </p>

        <!-- Receipt upload -->
        <div class="px-4 pb-4">
          <div
            role="button"
            tabindex="0"
            class="relative border-2 border-dashed rounded-lg transition-all duration-200 text-center overflow-hidden
              {isDragging ? 'border-black bg-gray-200 scale-[0.99]' : 'border-black/30 hover:border-black/50 bg-white hover:bg-gray-50/50'}"
            ondragover={(e) => { e.preventDefault(); isDragging = true; }}
            ondragleave={() => isDragging = false}
            ondrop={handleDrop}
            onkeydown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLElement).querySelector('input')?.click()}
          >
            <input
              type="file"
              id="upload-receipt"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onchange={handleReceiptSelect}
            />

            {#if receiptPreview}
              <!-- Preview -->
              <div class="p-3">
                <img src={receiptPreview} alt="Payment receipt" class="max-h-36 mx-auto rounded-md object-contain shadow-sm border border-black/10" />
                <div class="flex items-center justify-center gap-1.5 mt-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-black">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <p class="text-[11px] text-black font-semibold">Receipt uploaded</p>
                </div>
                <p class="text-[10px] text-gray-600 mt-0.5">Click or drop to replace</p>
              </div>
            {:else}
              <!-- Upload prompt -->
              <div class="py-5 px-3">
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-black/60">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <p class="text-xs font-semibold text-black">Upload Receipt <span class="text-red-500">*</span></p>
                <p class="text-[11px] text-gray-600 mt-0.5">Click or drag your payment screenshot here</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Error message -->
    {#if formError}
      <div class="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p class="text-xs text-red-700 leading-relaxed">{formError}</p>
      </div>
    {/if}

    <!-- Submit button -->
    <button
      type="submit"
      id="place-order-btn"
      disabled={!canSubmit}
      class="w-full py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2
        {!canSubmit
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-black text-white hover:bg-gray-900 active:scale-[0.98]'}"
    >
      {#if isPending}
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Placing your order…
      {:else if slots.length === 0}
        Add charms to continue
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        Place Order
      {/if}
    </button>

    <!-- Trust note -->
    <p class="text-[10px] text-gray-600 text-center leading-relaxed">
      By placing an order you agree to be contacted via the phone number provided.
    </p>

  </form>
</div>

<!-- ═══════════════════════════════════════════════════ QR MODAL ════════ -->
{#if showQrModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onclick={() => showQrModal = false}>
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full" onclick={(e) => e.stopPropagation()}>
      <!-- Modal header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-black/10">
        <h3 class="text-sm font-bold text-black">QRIS Payment Code</h3>
        <button
          type="button"
          onclick={() => showQrModal = false}
          class="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Modal body -->
      <div class="p-5 flex flex-col items-center gap-4">
        <div class="p-4 bg-gray-50 rounded-lg border border-black/10">
          <img
            src="/IMG_8770.png"
            alt="QRIS Payment Code"
            class="w-full aspect-square object-contain rounded-md"
          />
        </div>
        <p class="text-xs text-gray-600 text-center leading-relaxed">
          Scan this code with any mobile banking or e-wallet app to complete payment.
        </p>
      </div>

      <!-- Modal footer -->
      <div class="px-5 py-4 border-t border-black/10 flex gap-2">
        <button
          type="button"
          onclick={() => showQrModal = false}
          class="flex-1 px-4 py-2.5 rounded-lg border border-black/10 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Close
        </button>
        <button
          type="button"
          onclick={downloadQR}
          class="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download
        </button>
      </div>
    </div>
  </div>
{/if}
