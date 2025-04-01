<script lang="ts">
    import { onMount } from 'svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import { saveApiKey, getApiKeys, deleteApiKey, type ApiKey } from '$lib/db';
    import { Trash2 } from '@lucide/svelte';

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    let apiKeys = $state<ApiKey[]>([]);
    let selectedKeyId = $state<string | null>(null);
    let newKeyName = $state('');
    let newKeyValue = $state('');
    let error = $state('');

    onMount(async () => {
        await loadApiKeys();
        const savedSelectedKeyId = localStorage.getItem('selected_api_key_id');
        if (savedSelectedKeyId) {
            selectedKeyId = savedSelectedKeyId;
        }
    });

    async function loadApiKeys() {
        try {
            apiKeys = await getApiKeys();
        } catch (e) {
            error = 'Failed to load API keys';
            console.error(e);
        }
    }

    async function handleAddKey() {
        if (!newKeyName || !newKeyValue) {
            error = 'Please fill in all fields';
            return;
        }

        try {
            const newKey: Omit<ApiKey, 'created_at'> = {
                id: generateId(),
                name: newKeyName,
                key: newKeyValue
            };
            await saveApiKey(newKey);
            await loadApiKeys();
            newKeyName = '';
            newKeyValue = '';
            error = '';
        } catch (e) {
            error = 'Failed to save API key';
            console.error(e);
        }
    }

    async function handleDeleteKey(id: string) {
        try {
            await deleteApiKey(id);
            await loadApiKeys();
            if (selectedKeyId === id) {
                selectedKeyId = null;
                localStorage.removeItem('selected_api_key_id');
            }
            error = '';
        } catch (e) {
            error = 'Failed to delete API key';
            console.error(e);
        }
    }

    function handleSelectKey(id: string) {
        selectedKeyId = id;
        localStorage.setItem('selected_api_key_id', id);
    }
</script>

<div class="container mx-auto py-8 px-4">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Settings</h1>

        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-2xl font-semibold mb-6">Google AI API Keys</h2>
            
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <Label for="keyName">Key Name</Label>
                    <Input 
                        class="mt-1"
                        id="keyName" 
                        bind:value={newKeyName} 
                        placeholder="Enter a name for this API key"
                    />
                </div>

                <div>
                    <Label for="keyValue">API Key</Label>
                    <Input 
                        class="mt-1"
                        id="keyValue" 
                        type="password"
                        bind:value={newKeyValue} 
                        placeholder="Enter your Google AI API key"
                    />
                </div>

                {#if error}
                    <p class="text-red-600 text-sm">{error}</p>
                {/if}
            </div>

            <Button onclick={handleAddKey} class="w-full mt-4">
                Add API Key
            </Button>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold mb-6">Saved API Keys</h2>
            
            <div class="space-y-4">
                {#each apiKeys as key}
                    <div class="flex items-center justify-between p-4 border rounded-lg">
                        <div class="flex items-center gap-4">
                            <input 
                                type="radio" 
                                id={key.id} 
                                name="selectedKey" 
                                checked={selectedKeyId === key.id}
                                onchange={() => handleSelectKey(key.id)}
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label for={key.id} class="text-sm font-medium text-gray-700">
                                {key.name}
                            </label>
                        </div>
                        <button 
                            onclick={() => handleDeleteKey(key.id)}
                            class="text-red-600 hover:text-red-800"
                        >
                            <Trash2 class="h-5 w-5" />
                        </button>
                    </div>
                {:else}
                    <p class="text-gray-500 text-center py-4">No API keys saved yet</p>
                {/each}
            </div>
        </div>
    </div>
</div>

<footer class="w-full border-t mt-auto py-4">
    <div class="container mx-auto px-4">
        <div class="text-sm text-muted-foreground text-center">
            <p>Developed by <a href="https://github.com/mncuchiinhuttt">Vo Minh Long</a></p>
            <p>© 2025 Unit 9 Assignment. All rights reserved.</p>
            <p>Source code: <a href="https://github.com/mncuchiinhuttt/unit9assignment/">GitHub</a></p>
        </div>
    </div>
</footer>
