<script lang="ts">
	import { translateObject } from '$lib/i18n';
	import { toast } from 'svelte-sonner';

	// State
	let currentText = $state('Hello, World!');
	let name = $state('SvelteKit Developer');
	let isLoading = $state(false);
	const { data } = $props();

	$effect(() => {
		updateTranslations(currentLang);
	});

	// Derived state for the greeting
	let greetingMessage = $derived(`Hello, ${name}!`);
	let translatedGreeting = $state('');

	// Access the lang param from the layout/page data
	let currentLang = $derived(data.lang ?? 'en');

	// Effect to handle translation when URL param (lang) changes
	async function updateTranslations(lang: string) {
		const id = toast.loading('Translating...', { duration: 10000 });
		try {
			if (lang === 'en') {
				currentText = 'Hello, World!';
				translatedGreeting = `Hello, ${name}!`;
			} else {
				// Use translateObject to batch translate multiple strings at once
				const contentToTranslate = {
					hello: 'Hello, World!',
					greeting: `Hello, ${name}!`
				};

				const translated = await translateObject(contentToTranslate, 'en', lang, 'landing-page');

				currentText = translated.hello;
				translatedGreeting = translated.greeting;
				toast.success('Translation completed!', { id });
			}
		} finally {
			toast.dismiss(id);
		}
	}
</script>

<div class="flex min-h-[80vh] flex-col items-center justify-center gap-8 p-4">
	<!-- Logo / Header -->
	<h1
		class="text-5xl font-bold text-blue-600 transition-opacity duration-200 {isLoading
			? 'opacity-50'
			: 'opacity-100'}"
	>
		{currentText}
	</h1>

	<!-- Dynamic Content Demo -->
	<div class="flex flex-col items-center gap-2">
		<p class="text-xl text-gray-600">
			{translatedGreeting || greetingMessage}
		</p>
	</div>

	<!-- Current State -->
	<div class="rounded border border-gray-200 bg-white p-4 shadow">
		<p class="font-mono text-sm">
			Current Language (URL): <span class="font-bold">{currentLang}</span>
		</p>
	</div>

	<!-- Language Switcher Controls (Now standard links) -->
	<div class="flex gap-4">
		<a
			href="/en"
			class="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 {currentLang ===
			'en'
				? 'pointer-events-none cursor-not-allowed opacity-50'
				: ''}"
		>
			English
		</a>
		<a
			href="/es"
			class="rounded bg-emerald-500 px-4 py-2 text-white transition hover:bg-emerald-600 {currentLang ===
			'es'
				? 'pointer-events-none cursor-not-allowed opacity-50'
				: ''}"
		>
			Español (AI)
		</a>
		<a
			href="/fr"
			class="rounded bg-purple-500 px-4 py-2 text-white transition hover:bg-purple-600 {currentLang ===
			'fr'
				? 'pointer-events-none cursor-not-allowed opacity-50'
				: ''}"
		>
			Français (AI)
		</a>
		<a
			href="/hi"
			class="rounded bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 {currentLang ===
			'hi'
				? 'pointer-events-none cursor-not-allowed opacity-50'
				: ''}"
		>
			Hindi (AI)
		</a>
	</div>

	<div class="mt-8 max-w-md text-center">
		<p class="mb-2 text-sm text-gray-400">Lingo.dev SvelteKit Starter</p>
		<p class="text-xs text-gray-300">
			Now using <code>/[lang]/...</code> routing.
		</p>
	</div>
</div>
