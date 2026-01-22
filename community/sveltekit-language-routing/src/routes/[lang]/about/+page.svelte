<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { translateObject } from '$lib/i18n';
	import { toast } from 'svelte-sonner';
	const { data } = $props();

	// Original English Content
	const originalContent = {
		title: 'About This Starter',
		intro:
			'This is a demonstration of the Lingo.dev JavaScript SDK integrated into a SvelteKit application.',
		feature1_title: 'Real-time AI Translation',
		feature1_desc:
			'Unlike static localization files, this content is translated on-demand using AI.',
		feature2_title: 'Language Routing',
		feature2_desc:
			'We use Next.js-style [lang] routing to ensure every language has its own unique URL.',
		how_it_works_title: 'How it works',
		how_it_works_desc:
			'The page detects the language from the URL (e.g., /es/about) and uses the Lingo.dev SDK to localize this content object on the fly.',
		learn_more: 'Learn more at lingo.dev'
	};

	let content = $state(originalContent);
	let isLoading = $state(false);
	let currentLang = $derived(data.lang ?? 'en');

	afterNavigate(() => {
		if (currentLang === 'en') {
			content = originalContent;
			return;
		}
		toast.promise(translateObject(originalContent, 'en', currentLang, 'about-page'), {
			loading: 'Translating...',
			success: (res) => {
				content = res;
				return 'Translation completed successfully.';
			},
			error: 'Translation failed. Please try again.'
		});
	});
</script>

<div class="mx-auto max-w-3xl p-8 {isLoading ? 'opacity-50 transition-opacity' : ''}">
	<h1 class="mb-6 text-4xl font-bold text-blue-700">{content.title}</h1>

	<p class="mb-8 text-xl leading-relaxed text-gray-700">
		{content.intro}
	</p>

	<div class="mb-12 grid gap-6 md:grid-cols-2">
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="mb-2 text-xl font-semibold">{content.feature1_title}</h3>
			<p class="text-gray-600">{content.feature1_desc}</p>
		</div>
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="mb-2 text-xl font-semibold">{content.feature2_title}</h3>
			<p class="text-gray-600">{content.feature2_desc}</p>
		</div>
	</div>

	<div class="mb-8 rounded-lg bg-gray-100 p-6">
		<h2 class="mb-4 text-2xl font-bold">{content.how_it_works_title}</h2>
		<p class="mb-4">{content.how_it_works_desc}</p>
		<div class="overflow-x-auto rounded bg-gray-900 p-4 font-mono text-sm text-gray-100">
			{`// Example of the underlying call
await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "${currentLang}"
});`}
		</div>
	</div>

	<a href="https://lingo.dev" target="_blank" class="text-blue-600 hover:underline">
		{content.learn_more} &rarr;
	</a>
</div>
