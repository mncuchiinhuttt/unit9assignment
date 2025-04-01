<script lang="ts">
    import { Github, Mail, Globe } from '@lucide/svelte';
</script>

<div class="container mx-auto py-8 px-4">
    <div class="max-w-4xl mx-auto">
        <div class="space-y-8">
            <section class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-4">About the Project</h1>
                <p class="text-lg text-muted-foreground">
                    A modern student essay evaluation system built with SvelteKit and Google's Gemini AI
                </p>
            </section>

            <section class="bg-card rounded-lg p-6 shadow-sm mb-8">
                <h2 class="text-2xl font-semibold mb-6">Developer</h2>
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
                        <img 
                            src="https://avatars.githubusercontent.com/u/76028730?v=4" 
                            alt="Developer Avatar"
                            class="w-20 h-20 rounded-full"
                        />
                    </div>
                    <div class="flex-1 text-center md:text-left">
                        <h3 class="text-xl font-semibold">Vo Minh Long</h3>
                        <p class="text-muted-foreground mt-2">Full-stack Developer</p>
                        <p class="text-muted-foreground mt-1">Ben Tre High School for the Gifted</p>
                        <div class="flex items-center justify-center md:justify-start gap-4 mt-4">
                            <a 
                                href="https://github.com/mncuchiinhuttt" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github class="w-5 h-5" />
                                <span>GitHub</span>
                            </a>
                            <a 
                                href="mailto:vominhlong@mncuchiinhuttt.dev"
                                class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Mail class="w-5 h-5" />
                                <span>Email</span>
                            </a>
                            <a 
                                href="https://mncuchiinhuttt.dev/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Globe class="w-5 h-5" />
                                <span>Website</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-card rounded-lg p-6 shadow-sm">
                <h2 class="text-2xl font-semibold mb-4">Project Status</h2>
                <div class="space-y-4">
                    <div>
                        <h3 class="text-lg font-medium">Current Version</h3>
                        <p class="text-muted-foreground mt-2">1.0.0 (April 2025)</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-medium">License</h3>
                        <p class="text-muted-foreground mt-2">MIT License</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-medium">Contributing</h3>
                        <p class="text-muted-foreground mt-2">
                            Contributions are welcome! Please feel free to submit a Pull Request. For major changes, 
                            please open an issue first to discuss what you would like to change.
                        </p>
                    </div>
                </div>
            </section>
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
