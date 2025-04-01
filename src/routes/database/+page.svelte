<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getEvaluations, deleteEvaluation, type Evaluation } from '$lib/db';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Download, Search, Trash2 } from "@lucide/svelte";

	let evaluations = $state<Evaluation[]>([]);
	let searchQuery = $state('');
	let selectedClass = $state('all');
	let classList = $state<string[]>([]);
	let isLoading = $state(true);
	let error = $state('');

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

	// Filter evaluations based on search and class
	let filteredEvaluations = $derived(evaluations.filter((evaluation) => {
		const matchesSearch = 
			evaluation.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			evaluation.student_class.toLowerCase().includes(searchQuery.toLowerCase()) ||
			evaluation.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
			evaluation.essay_text.toLowerCase().includes(searchQuery.toLowerCase());
		
		const matchesClass = selectedClass === 'all' || evaluation.student_class === selectedClass;
		
		return matchesSearch && matchesClass;
	}));

	// Export to CSV
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

	// Delete evaluation
	async function handleDelete(id: number) {
		if (!confirm('Are you sure you want to delete this evaluation?')) return;
		
		try {
			await deleteEvaluation(id);
			await loadEvaluations(); // Reload after deletion
		} catch (e) {
			error = 'Failed to delete evaluation';
			console.error(e);
		}
	}

	// Load evaluations on mount
	onMount(() => {
		if (browser) {
			loadEvaluations();
		}
	});
</script>

<div class="container mx-auto py-8">
	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">Evaluation Database</h1>
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
								<TableCell>{evaluation.score}</TableCell>
								<TableCell class="max-w-[200px] truncate">{evaluation.review}</TableCell>
								<TableCell>{new Date(evaluation.created_at).toLocaleDateString()}</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="icon"
										onclick={() => handleDelete(evaluation.id)}
										class="h-8 w-8"
									>
										<Trash2 class="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		{/if}
	</div>
</div>
