<script lang="ts">
  import { push } from 'svelte-spa-router';

  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME as string;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;
  const STORAGE_KEY    = 'swave_admin_auth';

  let username    = $state('');
  let password    = $state('');
  let showPw      = $state(false);
  let error       = $state('');
  let isLoading   = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';

    if (!username.trim() || !password) {
      error = 'Please enter both username and password.';
      return;
    }

    // Simulate a brief loading state for UX polish
    isLoading = true;
    await new Promise(r => setTimeout(r, 500));
    isLoading = false;

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      push('/admin');
    } else {
      error = 'Incorrect username or password.';
    }
  }
</script>

<svelte:head>
  <title>Admin Login — Swave</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 flex items-center justify-center px-4 font-sans antialiased">

  <!-- Background pattern -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl"></div>
  </div>

  <div class="relative w-full max-w-sm">

    <!-- Brand mark -->
    <div class="text-center mb-8">
      <div class="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-900/50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <h1 class="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
      <p class="text-sm text-slate-400 mt-1">Sign in to access the Swave dashboard</p>
    </div>

    <!-- Card -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/40">
      <form onsubmit={handleSubmit} novalidate class="space-y-4">

        <!-- Username -->
        <div>
          <label for="admin-username" class="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
            Username
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              id="admin-username"
              type="text"
              bind:value={username}
              placeholder="Enter username"
              autocomplete="username"
              spellcheck="false"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all duration-150"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="admin-password" class="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
            Password
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              id="admin-password"
              type={showPw ? 'text' : 'password'}
              bind:value={password}
              placeholder="Enter password"
              autocomplete="current-password"
              class="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all duration-150"
            />
            <!-- Show / hide toggle -->
            <button
              type="button"
              onclick={() => showPw = !showPw}
              class="absolute inset-y-0 right-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {#if showPw}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Error -->
        {#if error}
          <div class="flex items-center gap-2.5 bg-red-950/60 border border-red-800/60 rounded-xl px-3.5 py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400 shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p class="text-xs text-red-400">{error}</p>
          </div>
        {/if}

        <!-- Submit -->
        <button
          type="submit"
          id="admin-login-btn"
          disabled={isLoading}
          class="w-full py-3 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200
            {isLoading
              ? 'bg-indigo-700/50 text-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-900/50'}"
        >
          {#if isLoading}
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in…
          {:else}
            Sign In
          {/if}
        </button>

      </form>
    </div>

    <!-- Back to store link -->
    <p class="text-center mt-6 text-xs text-slate-600">
      <a href="/#/" class="hover:text-slate-400 transition-colors underline underline-offset-2">← Back to store</a>
    </p>

  </div>
</div>
