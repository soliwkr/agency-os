<script setup lang="ts"></script>
<template>
	<div
		class="relative flex flex-col min-h-screen antialiased transition duration-150 dot-grid"
	>
		<div class="sticky top-0 z-50 w-full mx-auto">
			<NavigationTheHeader />
		</div>

		<div class="relative text-default max-w-6xl w-full mx-auto bg-default border-x border-t border-dashed border-primary/30">
			<slot />
			<NavigationTheFooter />
		</div>

		<div class="fixed z-10 bottom-4 left-4">
			<!-- <ScrollTop /> -->
		</div>
	</div>
</template>
