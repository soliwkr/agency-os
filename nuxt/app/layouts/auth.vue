<script setup lang="ts">
definePageMeta({
	middleware: ['guest'],
});
</script>
<template>
	<div
		class="relative flex min-h-full overflow-hidden antialiased transition duration-150 bg-default visual-effects bg-gradient-to-br from-default to-muted"
	>
		<div class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
			<div class="w-full max-w-sm mx-auto space-y-8 lg:w-96">
				<DarkModeToggle />
				<Logo class="w-auto h-12" />
				<slot />
			</div>
		</div>
		<div class="relative flex-1 hidden bg-default border-l-2 border-dashed border-primary/50 lg:block">
			<div class="absolute inset-0 dot-grid opacity-30 dark:opacity-15" />
		</div>
	</div>
</template>
<style>
html,
body,
#__nuxt {
	height: 100%;
}
#__nuxt {
	overflow-y: auto !important;
}
</style>
