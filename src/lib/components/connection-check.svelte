<script lang="ts">
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '$lib/components/ui/dialog';
    import { RefreshCw } from 'lucide-svelte';

    let isOnline = $state(true);
    let showDialog = $state(false);

    function checkConnection() {
        isOnline = navigator.onLine;
        showDialog = !isOnline;
    }

    function refreshPage() {
        window.location.reload();
    }

    onMount(() => {
        checkConnection();
        window.addEventListener('online', checkConnection);
        window.addEventListener('offline', checkConnection);

        return () => {
            window.removeEventListener('online', checkConnection);
            window.removeEventListener('offline', checkConnection);
        };
    });
</script>

<Dialog bind:open={showDialog}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>No Internet Connection</DialogTitle>
            <DialogDescription>
                Please check your internet connection and try again.
            </DialogDescription>
        </DialogHeader>
        <div class="flex justify-center">
            <Button onclick={refreshPage} class="gap-2">
                <RefreshCw class="h-4 w-4" />
                Refresh Page
            </Button>
        </div>
    </DialogContent>
</Dialog> 