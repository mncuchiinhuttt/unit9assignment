<script lang="ts">
    import { onMount } from 'svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import { saveApiKey, getApiKeys, deleteApiKey, type ApiKey } from '$lib/db';
    import { Trash2, Info } from '@lucide/svelte';
    import * as Dialog from '$lib/components/ui/dialog';

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    let apiKeys = $state<ApiKey[]>([]);
    let selectedKeyId = $state<string | null>(null);
    let newKeyName = $state('');
    let newKeyValue = $state('');
    let error = $state('');
    let apiKeyInfoOpen = $state(false);

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
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold">Google AI API Keys</h2>
                <button 
                    class="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    onclick={() => apiKeyInfoOpen = true}
                >
                    <Info class="h-4 w-4" />
                    <span>How to get an API key</span>
                </button>
            </div>
            
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

<!-- Google AI API Key Information Dialog -->
<Dialog.Root bind:open={apiKeyInfoOpen}>
    <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content class="sm:max-w-[600px]">
            <Dialog.Header>
                <Dialog.Title>Getting a Google AI API Key</Dialog.Title>
                <Dialog.Description>
                    Follow these steps to create and use a Google AI API key securely.
                </Dialog.Description>
            </Dialog.Header>
            
            <div class="space-y-4 my-6 text-sm">
                <div>
                    <h3 class="font-semibold text-base mb-2">Step 1: Accept the AI Studio Terms and Privacy Policy</h3>
                    <ol class="list-decimal pl-5 space-y-1">
                        <li>Go to the <a href="https://aistudio.google.com/u/4/apikey?pli=1" target="_blank" class="text-blue-600 hover:underline">Google AI Studio API Key Page</a></li>
                        <li>Create a new API key</li>
                        <li>Copy your API Key (The API key is the random string such as 'AIzaS...')</li>
                    </ol>
                </div>
                
                <div>
                    <h3 class="font-semibold text-base mb-2">Step 2: Copy and paste to the app</h3>
                    <ol class="list-decimal pl-5 space-y-1">
                        <li>If it not working go to Google AI Studio in step 1 and try again with new API key</li>
                    </ol>
                </div>
                
                <div>
                    <h3 class="font-semibold text-base mb-2">Step 3: Secure Your API Key</h3>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Restrict your API key to the specific Google AI APIs you need</li>
                        <li>Consider adding application or IP address restrictions</li>
                        <li>Never expose your API key in client-side code</li>
                        <li>Treat API keys like passwords - store securely and rotate regularly</li>
                    </ul>
                </div>
                
                <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p class="font-medium">Important Security Note:</p>
                    <p>When you use API keys in your applications, ensure they are kept secure during both storage and transmission. Publicly exposing your API keys can lead to unexpected charges on your account.</p>
                    <p class="mt-2">For more information, see <a href="https://cloud.google.com/docs/authentication/getting-started" target="_blank" class="text-blue-600 hover:underline">Google Cloud Authentication documentation</a>.</p>
                </div>
            </div>
            
            <Dialog.Footer>
                <Button on:click={() => apiKeyInfoOpen = false}>Got it, thanks!</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<footer class="w-full border-t mt-auto py-4">
    <div class="container mx-auto px-4">
        <div class="text-sm text-muted-foreground text-center">
            <p>Developed by <a href="https://github.com/mncuchiinhuttt">Vo Minh Long</a></p>
            <p>© 2025 Unit 9 Assignment. All rights reserved.</p>
            <p>Source code: <a href="https://github.com/mncuchiinhuttt/unit9assignment/">GitHub</a></p>
        </div>
    </div>
</footer>
