<script lang="ts">
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '$lib/components/ui/dialog';
    import { Button } from '$lib/components/ui/button';

    export let open = false;
    export let onConfirm: () => void;
    export let onCancel: () => void;
</script>

<Dialog bind:open>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Delete Evaluation</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete this evaluation? This action cannot be undone.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2 sm:gap-0">
            <Button variant="outline" onclick={onCancel}>
                Cancel
            </Button>
            <Button variant="destructive" onclick={onConfirm}>
                Delete
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog> 