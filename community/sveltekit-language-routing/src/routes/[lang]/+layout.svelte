<script lang="ts">
	import '../layout.css'; // Correct path to src/routes/layout.css
	import { locale } from '$lib/i18n';
	import { page } from '$app/state';

	let { children, data } = $props();

	// Sync the store with the route param
	$effect(() => {
		if (data.lang) {
			$locale = data.lang;
		}
	});
</script>

<div class="min-h-screen bg-gray-50 font-sans text-gray-900">
	<!-- Navigation for Demo -->
	<nav class="flex justify-center gap-6 border-b border-gray-200 bg-white p-4">
		<a
			href="/{data.lang}"
			class="font-medium hover:text-blue-600 {page.url.pathname === `/${data.lang}`
				? 'text-blue-600'
				: 'text-gray-600'}">Home</a
		>
		<a
			href="/{data.lang}/about"
			class="font-medium hover:text-blue-600 {page.url.pathname === `/${data.lang}/about`
				? 'text-blue-600'
				: 'text-gray-600'}">About</a
		>
	</nav>
	{@render children()}
</div>
