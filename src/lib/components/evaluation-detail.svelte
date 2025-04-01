<script lang="ts">
    import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
    import type { Evaluation } from '$lib/db';

    export let open = false;
    export let evaluation: Evaluation | null = null;
    export let onClose: () => void;

    function handleClose() {
        open = false;
        onClose();
    }
</script>

<Dialog {open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
    <DialogContent onInteractOutside={handleClose}>
        <DialogHeader>
            <DialogTitle>Evaluation Details</DialogTitle>
        </DialogHeader>

        {#if evaluation}
            <div class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Student Name</h3>
                        <p class="mt-1 text-sm text-gray-900">{evaluation.student_name}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500">Class</h3>
                        <p class="mt-1 text-sm text-gray-900">{evaluation.student_class}</p>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-medium text-gray-500">Statement</h3>
                    <p class="mt-1 text-sm text-gray-900">{evaluation.statement}</p>
                </div>

                <div>
                    <h3 class="text-sm font-medium text-gray-500">Score</h3>
                    <p class="mt-1 text-2xl font-bold" class:text-red-600={evaluation.score < 1.0} class:text-green-600={evaluation.score >= 1.0}>
                        {evaluation.score}/2.0
                    </p>
                </div>

                <div>
                    <h3 class="text-sm font-medium text-gray-500">Essay Text</h3>
                    <div class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{evaluation.essay_text}</div>
                </div>

                <div>
                    <h3 class="text-sm font-medium text-gray-500">Review</h3>
                    <p class="mt-1 text-sm text-gray-900">{evaluation.review}</p>
                </div>

                <div>
                    <h3 class="text-sm font-medium text-gray-500">Created At</h3>
                    <p class="mt-1 text-sm text-gray-900">{new Date(evaluation.created_at).toLocaleString()}</p>
                </div>
            </div>
        {/if}
    </DialogContent>
</Dialog> 