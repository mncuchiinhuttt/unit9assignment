<script lang="ts">
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '$lib/components/ui/dialog';
    
    const CURRENT_VERSION = '1.0.2';

    let showDialog = $state(false);
    let latestVersion = $state('');
    let error = $state('');

    async function checkVersion() {
        try {
            const response = await fetch('https://cdn.mncuchiinhuttt.dev/unit9assignment-version.txt');
            if (!response.ok) {
                throw new Error('Failed to fetch version information');
            }
            const LASTEST_VERSION = (await response.text()).trim();
            latestVersion = LASTEST_VERSION.trim();
            if (LASTEST_VERSION !== CURRENT_VERSION) {
                showDialog = true;
            }
        } catch(error) {
            error = (error as Error).message;
            console.error('Version check failed:', error);
        }
    }

    function refreshPage() {
        window.location.reload();
    }

    function preventClose(e: Event) {
        if (latestVersion !== CURRENT_VERSION) {
            e.preventDefault();
        }
    }

    onMount(() => {
        checkVersion();
    });
</script>

<Dialog 
    bind:open={showDialog}
    onOpenChange={(isOpen) => {
        if (!isOpen && latestVersion !== CURRENT_VERSION) {
            showDialog = true;
        }
    }}
>
    <DialogContent
        onInteractOutside={preventClose}
    >
        <DialogHeader>
            <DialogTitle>Update Required</DialogTitle>
            <DialogDescription>
                A new version of the application is available. Please update to continue using the application.
                <div class="mt-4 p-4 bg-muted rounded-lg">
                    <p>Current version: <span class="font-mono">{CURRENT_VERSION}</span></p>
                    <p>Latest version: <span class="font-mono">{latestVersion}</span></p>
                </div>
                {#if error}
                    <p class="mt-2 text-sm text-destructive">{error}</p>
                {/if}
            </DialogDescription>
        </DialogHeader>
        <div class="flex justify-center gap-4">
            <Button onclick={() => window.open('https://github.com/mncuchiinhuttt/unit9assignment/releases', '_blank')}>
                Download Update
            </Button>
        </div>
    </DialogContent>
</Dialog> 