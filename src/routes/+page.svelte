<script lang="ts">
    import { model } from '$lib/index';
    import markdownit from 'markdown-it';

	let prompt = $state(
`This is my student essay. Please convert it to text and output with this markdown structure:
**Name:** <name>

**Essay:**

<essay>`);
	let selectedFile: File | null = $state(null);
	let errorMessage = $state('');
	let responseText = $state('');
  const md = markdownit();

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

		try {
			const imagePart = await fileToGenerativePart(selectedFile);
			const generatedContent = await model.generateContent([prompt, imagePart]);
			responseText = generatedContent.response.text();
		} catch (error) {
			errorMessage = 'Error processing file: ' + (error as Error).message;
		}
	}
</script>

<div class="flex h-full flex-col items-center justify-center">
	<div class="upload-section">
		<input type="file" accept="image/* .pdf" onchange={handleFileSelect} class="file-input" />

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		<button onclick={handleSubmit} disabled={!selectedFile} class="submit-button">
			Process File
		</button>
	</div>

	{#if responseText}
		<div class="response-section">
			<h3>Response:</h3>
			{@html (md.render(responseText))}
		</div>
	{/if}
</div>

<style>
	.upload-section {
		margin-bottom: 20px;
	}

	.file-input {
		margin-bottom: 10px;
	}

	.error {
		color: red;
		margin: 10px 0;
	}

	.submit-button {
		background-color: #4caf50;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.submit-button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}

	.response-section {
		margin-top: 20px;
		padding: 15px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
</style>
