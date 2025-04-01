<script lang="ts">
    // import { model } from '$lib/index';
    import markdownit from 'markdown-it';
    import { saveEvaluation } from '$lib/db';
    import * as Select from '$lib/components/ui/select/index.js';
    import { GoogleGenerativeAI } from "@google/generative-ai";
    import { env } from "$env/dynamic/public";

    let studentName = $state('');
    let studentClass = $state('');
    let statement = $state('');
    let minWordCount = $state(150);
    let maxWordCount = $state(200);
    let selectedFile: File | null = $state(null);
    let errorMessage = $state('');
    let responseText = $state('');
    let score = $state(-1);
    let review = $state('');
    let status = $state('idle'); 
    let saveStatus = $state(''); 
    let selectedModel = $state('');
    const md = markdownit();

    const ai = new GoogleGenerativeAI(env.PUBLIC_GOOGLE_API_KEY);
    
    const models = [
        { id: 'gemini-2.5-pro-exp-03-25', name: 'Gemini 2.5 Pro Experimental' },
        { id: 'gemini-2.0-flash-thinking-exp-01-21', name: 'Gemini 2.0 Flash Thinking Experimental' },
        { id: 'gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
        { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro' },
    ];

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            const fileType = file.type;

            if (fileType.startsWith('image/') || fileType === 'application/pdf') {
                selectedFile = file;
                errorMessage = '';
            } else {
                errorMessage = 'Please select an image or PDF file';
                selectedFile = null;
            }
        }
    }

    async function fileToGenerativePart(
        file: File
    ): Promise<{ inlineData: { data: string; mimeType: string } }> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
      
            reader.onload = () => {
                const base64Data = reader.result as string;
                const base64String = base64Data.split(',')[1];
                resolve({
                    inlineData: {
                        data: base64String,
                        mimeType: file.type
                    }
                });
            };

            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsDataURL(file);
        });
    }

    async function handleSubmit() {
        if (!selectedFile) {
            errorMessage = 'Please select a file first';
            return;
        }

        if (!studentName || !studentClass || !statement) {
            errorMessage = 'Please fill in all required fields';
            return;
        }

        if (minWordCount > maxWordCount) {
            errorMessage = 'Minimum word count cannot be greater than maximum word count';
            return;
        }

        try {
            status = 'evaluating';
            const model = ai.getGenerativeModel({ model: selectedModel });
            const imagePart = await fileToGenerativePart(selectedFile);
            const fetchPrompt = await fetch('https://cdn.mncuchiinhuttt.dev/unit9assignment-prompt.txt');
            if (!fetchPrompt.ok) {
                throw new Error('Failed to fetch prompt');
            }
            const prompt = (await fetchPrompt.text()).trim();
            const generatedContent = await model.generateContent([prompt, imagePart]);
            responseText = generatedContent.response.text();
            const fetchScoringPrompt = await fetch('https://cdn.mncuchiinhuttt.dev/unit9assignment-scoring-prompt.txt');
            if (!fetchScoringPrompt.ok) {
                throw new Error('Failed to fetch scoring prompt');
            }
            const scoring_prompt = (await fetchScoringPrompt.text()).trim();
            const generatedScore = await model.generateContent([scoring_prompt]);
            console.log(generatedScore.response.text());
            score = parseFloat(generatedScore.response.text().split(':')[1].trim());
            review = generatedScore.response.text().split('Review:')[1].trim();
            status = 'finished';
        } catch (error) {
            errorMessage = 'Error processing file: ' + (error as Error).message;
            status = 'idle';
        }
    }

    async function handleSave() {
        if (!responseText || !score || !review) {
            errorMessage = 'Please evaluate an essay first';
            return;
        }

        try {
            saveStatus = 'saving';
            await saveEvaluation({
                student_name: studentName,
                student_class: studentClass,
                statement: statement,
                essay_text: responseText,
                score: score,
                review: review
            });
            saveStatus = 'saved';
        } catch (error) {
            saveStatus = 'error';
            errorMessage = 'Error saving to database: ' + (error as Error).message;
        }
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Student Essay Evaluation System</h1>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Student Information</h2>
            <div class="space-y-6">
                <div>
                    <label for="studentName" class="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                    <input 
                        type="text" 
                        id="studentName" 
                        bind:value={studentName} 
                        placeholder="Enter student name"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div>
                    <label for="studentClass" class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                    <input 
                        type="text" 
                        id="studentClass" 
                        bind:value={studentClass} 
                        placeholder="Enter class"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label for="statement" class="block text-sm font-medium text-gray-700 mb-1">Statement *</label>
                    <textarea 
                        id="statement" 
                        bind:value={statement} 
                        placeholder="Enter the statement or prompt for the essay"
                        required
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="minWordCount" class="block text-sm font-medium text-gray-700 mb-1">Minimum Word Count *</label>
                        <input 
                            type="number" 
                            id="minWordCount" 
                            bind:value={minWordCount} 
                            min="1"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label for="maxWordCount" class="block text-sm font-medium text-gray-700 mb-1">Maximum Word Count *</label>
                        <input 
                            type="number" 
                            id="maxWordCount" 
                            bind:value={maxWordCount} 
                            min="1"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label for="model" class="block text-sm font-medium text-gray-700 mb-1">AI Model *</label>
                    <Select.Root type="single" name="model" bind:value={selectedModel}>
                        <Select.Trigger class="w-full">{models.find(m => m.id === selectedModel)?.name || 'Select a model'}</Select.Trigger>
                        <Select.Content>
                            {#each models as model}
                                <Select.Item value={model.id}>{model.name}</Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                </div>

                <div>
                    <label for="fileUpload" class="block text-sm font-medium text-gray-700 mb-1">Upload Essay (Image/PDF) *</label>
                    <input 
                        type="file" 
                        id="fileUpload" 
                        accept="image/* .pdf" 
                        onchange={handleFileSelect} 
                        class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    />
                </div>

                {#if errorMessage}
                    <p class="text-red-600 bg-red-50 p-3 rounded-md text-sm">{errorMessage}</p>
                {/if}

                <button 
                    onclick={handleSubmit} 
                    disabled={!selectedFile || !studentName || !studentClass || !statement || status === 'evaluating'} 
                    class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {status === 'evaluating' ? 'Evaluating...' : 'Evaluate Essay'}
                </button>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Evaluation Results</h2>
            
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-700">
                        Status: 
                        <span class={`
                            ${status === 'idle' ? 'text-gray-500' : ''}
                            ${status === 'evaluating' ? 'text-yellow-500' : ''}
                            ${status === 'finished' ? 'text-green-500' : ''}
                        `}>
                            {status === 'idle' ? 'Ready to evaluate' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </div>
                    {#if status === 'finished'}
                        <button 
                            onclick={handleSave}
                            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                            class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {saveStatus === 'saving' ? 'Saving...' : 
                             saveStatus === 'saved' ? 'Saved!' : 
                             saveStatus === 'error' ? 'Error Saving' : 'Save to Database'}
                        </button>
                    {/if}
                </div>

                <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="text-lg font-medium text-gray-800 mb-3">Score</h3>
                    <div class="text-4xl font-bold text-center" class:text-gray-500={score === -1} class:text-red-600={score < 1 && score !== -1} class:text-green-600={score >= 1}>
                        {score === -1 ? '--' : score === 0 ? '0.0' : score === 1 ? '1.0' : score === 2 ? '2.0' : score || '--'}/2.0
                    </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="text-lg font-medium text-gray-800 mb-3">Statement</h3>
                    <div class="text-gray-700 leading-relaxed">
                        {#if statement}
                            {statement}
                        {:else}
                            <p class="text-gray-500 italic">No statement provided</p>
                        {/if}
                    </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="text-lg font-medium text-gray-800 mb-3">Extracted Essay</h3>
                    <div class="prose max-w-none">
                        {#if responseText}
                            {@html md.render(responseText)}
                        {:else}
                            <p class="text-gray-500 italic">No essay evaluated yet</p>
                        {/if}
                    </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="text-lg font-medium text-gray-800 mb-3">Review</h3>
                    <div class="text-gray-700 leading-relaxed">
                        {#if review}
                            {review}
                        {:else}
                            <p class="text-gray-500 italic">No review available yet</p>
                        {/if}
                    </div>
                </div>
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