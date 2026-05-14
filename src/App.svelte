<script>
    import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
    import Router from "svelte-spa-router";
    import { routes } from "./routes";

    const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
    <Router {routes}/>
</QueryClientProvider>