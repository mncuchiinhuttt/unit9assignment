<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getEvaluations, deleteEvaluation, type Evaluation } from '$lib/db';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import DeleteConfirmation from '$lib/components/delete-confirmation.svelte';
	import EvaluationDetail from '$lib/components/evaluation-detail.svelte';
	import { Download, Search, Trash2, Eye } from "@lucide/svelte";

	let evaluations = $state<Evaluation[]>([]);
	let searchQuery = $state('');
	let selectedClass = $state('all');
	let classList = $state<string[]>([]);
	let isLoading = $state(true);
	let error = $state('');
	let deleteDialogOpen = $state(false);
	let evaluationToDelete = $state<number | null>(null);
	let detailDialogOpen = $state(false);
	let selectedEvaluation = $state<Evaluation | null>(null);

	async function loadEvaluations() {
		try {
			isLoading = true;
			const data = await getEvaluations();
			evaluations = data;
			classList = [...new Set(data.map((e) => e.student_class))];
		} catch (e) {
			error = 'Failed to load evaluations';
			console.error(e);
		} finally {
			isLoading = false;
		}
	}

	let filteredEvaluations = $derived(evaluations.filter((evaluation) => {
		const matchesSearch = 
			evaluation.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			evaluation.student_class.toLowerCase().includes(searchQuery.toLowerCase()) ||
			evaluation.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
			evaluation.essay_text.toLowerCase().includes(searchQuery.toLowerCase());
		
		const matchesClass = selectedClass === 'all' || evaluation.student_class === selectedClass;
		
		return matchesSearch && matchesClass;
	}));

	function exportToCSV() {
		const headers = ['Student Name', 'Class', 'Statement', 'Essay Text', 'Score', 'Review', 'Created At'];
		const csvContent = [
			headers.join(','),
			...filteredEvaluations.map((e) => [
				`"${e.student_name}"`,
				`"${e.student_class}"`,
				`"${e.statement.replace(/"/g, '""')}"`,
				`"${e.essay_text.replace(/"/g, '""')}"`,
				e.score,
				`"${e.review.replace(/"/g, '""')}"`,
				`"${e.created_at}"`
			].join(','))
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `evaluations_${new Date().toISOString().split('T')[0]}.csv`;
		link.click();
	}

	function openDeleteDialog(id: number) {
		evaluationToDelete = id;
		deleteDialogOpen = true;
	}

	function closeDeleteDialog() {
		deleteDialogOpen = false;
		evaluationToDelete = null;
	}

	function openDetailDialog(evaluation: Evaluation) {
		selectedEvaluation = evaluation;
		detailDialogOpen = true;
	}

	function closeDetailDialog() {
		detailDialogOpen = false;
		selectedEvaluation = null;
	}

	async function handleDelete() {
		if (!evaluationToDelete) return;
		
		try {
			await deleteEvaluation(evaluationToDelete);
			await loadEvaluations();
			closeDeleteDialog();
		} catch (e) {
			error = 'Failed to delete evaluation';
			console.error(e);
		}
	}

	onMount(() => {
		if (browser) {
			loadEvaluations();
		}
	});
</script>

<div class="container mx-auto py-8 w-full">
	<div class="flex flex-col gap-4 w-full">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold mr-auto">Evaluation Database</h1>
			<Button onclick={exportToCSV} class="flex items-center gap-2">
				<Download class="h-4 w-4" />
				Export CSV
			</Button>
		</div>

		<div class="flex flex-col gap-4 md:flex-row md:items-center">
			<div class="relative flex-1">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search by name, class, statement, or essay..."
					bind:value={searchQuery}
					class="pl-9"
				/>
			</div>
		</div>

		{#if error}
			<div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
				{error}
			</div>
		{/if}

		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			</div>
		{:else if filteredEvaluations.length === 0}
			<div class="flex items-center justify-center py-8 text-muted-foreground">
				No evaluations found
			</div>
		{:else}
			<div class="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Student Name</TableHead>
							<TableHead>Class</TableHead>
							<TableHead>Statement</TableHead>
							<TableHead>Essay Text</TableHead>
							<TableHead>Score</TableHead>
							<TableHead>Review</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead class="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each filteredEvaluations as evaluation}
							<TableRow>
								<TableCell>{evaluation.student_name}</TableCell>
								<TableCell>{evaluation.student_class}</TableCell>
								<TableCell class="max-w-[200px] truncate">{evaluation.statement}</TableCell>
								<TableCell class="max-w-[200px] truncate">{evaluation.essay_text}</TableCell>
								{#if evaluation.score < 1.0}
									<TableCell class="text-red-600">{evaluation.score}</TableCell>
								{:else}
									<TableCell class="text-green-600">{evaluation.score}</TableCell>
								{/if}
								<TableCell class="max-w-[200px] truncate">{evaluation.review}</TableCell>
								<TableCell>{new Date(evaluation.created_at).toLocaleDateString()}</TableCell>
								<TableCell>
									<div class="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onclick={() => openDetailDialog(evaluation)}
											class="h-8 w-8"
										>
											<Eye class="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onclick={() => openDeleteDialog(evaluation.id)}
											class="h-8 w-8"
										>
											<Trash2 class="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		{/if}
	</div>
</div>

<DeleteConfirmation 
	open={deleteDialogOpen}
	onConfirm={handleDelete}
	onCancel={closeDeleteDialog}
/>

<EvaluationDetail
	open={detailDialogOpen}
	evaluation={selectedEvaluation}
	onClose={closeDetailDialog}
/>

<footer class="w-full border-t mt-auto py-4">
	<div class="container mx-auto px-4">
		<div class="text-sm text-muted-foreground text-center">
			<p>Developed by <a href="https://github.com/mncuchiinhuttt">Vo Minh Long</a></p>
			<p>© 2025 Unit 9 Assignment. All rights reserved.</p>
            <p>Source code: <a href="https://github.com/mncuchiinhuttt/unit9assignment/">GitHub</a></p>
		</div>
	</div>
</footer>