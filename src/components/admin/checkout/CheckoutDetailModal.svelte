<script lang="ts">
  import { useOneCheckout } from '../../../composables/checkout/useOneCheckout';
  import { useUpdateCheckoutStatus } from '../../../composables/checkout/useStatusCheckout';
  import Modal from '../../ui/Modal.svelte';
  import Button from '../../ui/Button.svelte';

  let {
    isOpen,
    orderId,
    onclose,
  }: {
    isOpen: boolean;
    orderId: string;
    onclose: () => void;
  } = $props();

  const detailQuery = useOneCheckout(orderId);
  const statusMutation = useUpdateCheckoutStatus();

  function formatPrice(v: number) { return `Rp ${v.toLocaleString('id-ID')}`; }
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  async function setStatus(approved: boolean) {
    await statusMutation.mutateAsync({ order_id: orderId, status_checkout: approved });
    onclose();
  }
</script>

<Modal {isOpen} {onclose} title="Order Detail">
  {#if detailQuery.isLoading}
    <div class="flex flex-col items-center justify-center py-12">
      <svg class="animate-spin h-7 w-7 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-sm text-slate-500">Loading order details…</p>
    </div>

  {:else if detailQuery.isError}
    <div class="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
      <p class="text-sm font-medium text-red-700">Failed to load order</p>
      <p class="text-xs text-red-500 mt-1">{detailQuery.error?.message}</p>
    </div>

  {:else if detailQuery.data}
    {@const d = detailQuery.data}
    <div class="space-y-5 text-sm">

      <!-- Order header -->
      <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <p class="text-xs text-slate-500 mb-0.5">Order ID</p>
          <p class="font-mono font-semibold text-slate-800 text-xs bg-slate-100 px-2.5 py-1 rounded-md inline-block">{d.order_id}</p>
          <p class="text-xs text-slate-400 mt-1.5">{formatDate(d.created_at)}</p>
        </div>
        <span class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
          {d.status_checkout ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}">
          <div class="w-1.5 h-1.5 rounded-full {d.status_checkout ? 'bg-emerald-500' : 'bg-amber-500'}"></div>
          {d.status_checkout ? 'Approved' : 'Pending'}
        </span>
      </div>

      <!-- Customer info -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-slate-50 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-400 mb-0.5">Name</p>
          <p class="font-medium text-slate-800">{d.name}</p>
        </div>
        <div class="bg-slate-50 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-400 mb-0.5">Phone</p>
          <p class="font-medium text-slate-800">{d.phone}</p>
        </div>
        <div class="bg-slate-50 rounded-xl px-4 py-3">
          <p class="text-xs text-slate-400 mb-0.5">Payment</p>
          <p class="font-medium text-slate-800 capitalize">{d.payment_method === 'QRIS' ? 'QRIS' : 'Cash'}</p>
        </div>
        {#if d.disc_code}
          <div class="bg-slate-50 rounded-xl px-4 py-3">
            <p class="text-xs text-slate-400 mb-0.5">Discount Code</p>
            <p class="font-mono font-semibold text-slate-800 tracking-widest">{d.disc_code}</p>
          </div>
        {/if}
      </div>

      <!-- Products ordered -->
      <div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Charms Ordered</p>
        <div class="space-y-2">
          {#each d.product_checkout as item}
            <div class="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
              <img
                src={item.product.product_image}
                alt={item.product.name}
                class="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-slate-800 text-sm truncate">{item.product.name}</p>
                <p class="text-xs text-slate-500">{formatPrice(item.product.price)} × {item.quantity}</p>
              </div>
              <p class="font-semibold text-slate-800 text-sm shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Total -->
      <div class="flex justify-between items-center bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
        <span class="font-semibold text-slate-700">Total Price</span>
        <span class="text-lg font-bold text-indigo-700">{formatPrice(d.total_price)}</span>
      </div>

      <!-- Receipt -->
      {#if d.upload_recipt}
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Payment Receipt</p>
          <a
            href={d.upload_recipt}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            View Receipt Image
          </a>
        </div>
      {/if}

      <!-- Error from mutation -->
      {#if statusMutation.error}
        <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
          {statusMutation.error.message}
        </div>
      {/if}
    </div>
  {/if}

  {#snippet footer()}
    <Button variant="ghost" onclick={onclose} disabled={statusMutation.isPending}>Close</Button>
    {#if detailQuery.data && !detailQuery.data.status_checkout}
      <Button variant="danger" onclick={() => setStatus(false)} disabled={statusMutation.isPending}>
        Reject
      </Button>
      <Button onclick={() => setStatus(true)} disabled={statusMutation.isPending}>
        {#if statusMutation.isPending}
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing…
        {:else}
          Approve Order
        {/if}
      </Button>
    {:else if detailQuery.data?.status_checkout}
      <Button variant="secondary" onclick={() => setStatus(false)} disabled={statusMutation.isPending}>
        Revoke Approval
      </Button>
    {/if}
  {/snippet}
</Modal>
