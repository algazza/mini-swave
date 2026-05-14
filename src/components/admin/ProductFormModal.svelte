<script lang="ts">
  import Modal from '../ui/Modal.svelte';
  import Button from '../ui/Button.svelte';
  import { useAddProduct } from '../../composables/product/useAddProduct';
  import { useEditProduct } from '../../composables/product/useEditProduct';
  import type { ProductType } from '../../types/product';

  let { isOpen, product = null, onclose }: { isOpen: boolean, product?: ProductType | null, onclose: () => void } = $props();

  const addProductMutation = useAddProduct();
  const editProductMutation = useEditProduct();

  let name = $state('');
  let stock = $state(0);
  let price = $state(0);
  let imageFile: File | null = $state(null);
  let imagePreview: string | null = $state(null);
  let isDragging = $state(false);

  $effect(() => {
    if (isOpen) {
      if (product) {
        name = product.name;
        stock = product.stock;
        price = product.price;
        imagePreview = product.product_image;
        imageFile = null;
      } else {
        name = '';
        stock = 0;
        price = 0;
        imagePreview = null;
        imageFile = null;
      }
    }
  });

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      setImage(file);
    }
  }

  function setImage(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50MB limit');
      return;
    }
    imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (product) {
      await editProductMutation.mutateAsync({
        id: product.id,
        name,
        stock,
        price,
        image: imageFile,
        oldImage: product.product_image
      });
    } else {
      if (!imageFile) {
        alert('Image is required');
        return;
      }
      await addProductMutation.mutateAsync({
        name,
        stock,
        price,
        image: imageFile
      });
    }
    
    onclose();
  }

  let isPending = $derived(addProductMutation.isPending || editProductMutation.isPending);
</script>

<Modal {isOpen} {onclose} title={product ? 'Edit Product' : 'Add New Product'}>
  <form id="productForm" onsubmit={handleSubmit} class="space-y-5">
    <!-- Image Upload (Drag & Drop) -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
      <div 
        class="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 {isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-300 hover:border-indigo-400 bg-slate-50'}"
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onchange={handleFileSelect}
        />
        
        {#if imagePreview}
          <div class="relative w-full h-48 rounded-lg overflow-hidden flex items-center justify-center bg-slate-100 group">
            <img src={imagePreview} alt="Preview" class="max-w-full max-h-full object-contain" />
            <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span class="text-white text-sm font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Drop or Click to replace
              </span>
            </div>
          </div>
        {:else}
          <div class="py-10 flex flex-col items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </div>
            <div class="text-sm text-slate-600">
              <span class="font-semibold text-indigo-600">Click to upload</span>
              <span> or drag and drop</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (MAX. 50MB)</p>
          </div>
        {/if}
      </div>
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
      <input type="text" id="name" bind:value={name} required placeholder="e.g. Wireless Headphones" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="price" class="block text-sm font-medium text-slate-700 mb-1">Price</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-medium">Rp</span>
          <input type="number" id="price" bind:value={price} required min="0" class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
        </div>
      </div>
      <div>
        <label for="stock" class="block text-sm font-medium text-slate-700 mb-1">Stock Amount</label>
        <input type="number" id="stock" bind:value={stock} required min="0" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
      </div>
    </div>
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={onclose}>Cancel</Button>
    <Button type="submit" form="productForm" disabled={isPending}>
      {#if isPending}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
      {:else}
        {product ? 'Save Changes' : 'Create Product'}
      {/if}
    </Button>
  {/snippet}
</Modal>
