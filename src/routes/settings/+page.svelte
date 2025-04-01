<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Plus, Trash2 } from "@lucide/svelte";
    import { onMount } from "svelte";

    interface ApiKey {
        id: string;
        name: string;
        key: string;
    }

    let apiKeys = $state<ApiKey[]>([]);
    let selectedKeyId = $state<string>("");
    let newKeyName = $state("");
    let newKeyValue = $state("");
    let errorMessage = $state("");

    onMount(() => {
        // Load saved API keys from localStorage
        const savedKeys = localStorage.getItem("google_ai_api_keys");
        if (savedKeys) {
            apiKeys = JSON.parse(savedKeys);
            // Set the first key as selected if none is selected
            if (!selectedKeyId && apiKeys.length > 0) {
                selectedKeyId = apiKeys[0].id;
            }
        }
    });

    function generateId() {
        return Math.random().toString(36).substring(2, 15);
    }

    function addApiKey() {
        if (!newKeyName || !newKeyValue) {
            errorMessage = "Please fill in both name and API key";
            return;
        }

        const newKey: ApiKey = {
            id: generateId(),
            name: newKeyName,
            key: newKeyValue
        };

        apiKeys = [...apiKeys, newKey];
        localStorage.setItem("google_ai_api_keys", JSON.stringify(apiKeys));
        
        // Clear form
        newKeyName = "";
        newKeyValue = "";
        errorMessage = "";

        // Select the new key if it's the first one
        if (!selectedKeyId) {
            selectedKeyId = newKey.id;
        }
    }

    function deleteApiKey(id: string) {
        apiKeys = apiKeys.filter(key => key.id !== id);
        localStorage.setItem("google_ai_api_keys", JSON.stringify(apiKeys));
        
        // Select another key if the deleted one was selected
        if (selectedKeyId === id && apiKeys.length > 0) {
            selectedKeyId = apiKeys[0].id;
        }
    }

    function selectApiKey(id: string) {
        selectedKeyId = id;
        localStorage.setItem("selected_api_key_id", id);
    }
</script>

<div class="container mx-auto py-8 px-4">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Settings</h1>

        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-2xl font-semibold mb-6">Google AI API Keys</h2>
            <p class="text-sm text-muted-foreground mb-6">
                Add your Google AI API keys to use the AI model. <a href="https://aistudio.google.com/apikey" target="_blank" class="text-blue-500 hover:text-blue-600">Click here</a> to get your API key.
            </p>
            
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label for="keyName">Key Name</Label>
                        <Input 
                            id="keyName" 
                            bind:value={newKeyName} 
                            placeholder="e.g., Production Key"
                            class="mt-1"
                        />
                    </div>
                    <div>
                        <Label for="keyValue">API Key</Label>
                        <Input 
                            id="keyValue" 
                            type="password"
                            bind:value={newKeyValue} 
                            placeholder="Enter your API key"
                            class="mt-1"
                        />
                    </div>
                </div>

                {#if errorMessage}
                    <p class="text-red-600 text-sm">{errorMessage}</p>
                {/if}

                <Button onclick={addApiKey} class="gap-2">
                    <Plus class="h-4 w-4" />
                    Add API Key
                </Button>

                {#if apiKeys.length > 0}
                    <div class="mt-8">
                        <h3 class="text-lg font-medium mb-4">Saved API Keys</h3>
                        <div class="space-y-4">
                            {#each apiKeys as key}
                                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div class="flex items-center gap-4">
                                        <input 
                                            type="radio" 
                                            id={key.id} 
                                            name="selectedKey" 
                                            value={key.id}
                                            checked={selectedKeyId === key.id}
                                            onchange={() => selectApiKey(key.id)}
                                            class="h-4 w-4 text-blue-600"
                                        />
                                        <label for={key.id} class="font-medium">{key.name}</label>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onclick={() => deleteApiKey(key.id)}
                                        class="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
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
