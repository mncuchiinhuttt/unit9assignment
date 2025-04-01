<script lang="ts">
	import '../app.css';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import ConnectionCheck from '$lib/components/connection-check.svelte';
	import VersionCheck from '$lib/components/version-check.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full pt-4">
		{@render children()}
	</main>
	<ConnectionCheck />
	<VersionCheck />
</Sidebar.Provider>
