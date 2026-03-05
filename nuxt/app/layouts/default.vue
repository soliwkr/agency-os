<script setup lang="ts"></script>
<template>
	<div
		class="relative flex flex-col min-h-screen antialiased transition duration-150 bg-default visual-effects"
	>
		<div class="sticky top-0 z-50 w-full mx-auto">
			<NavigationTheHeader />
		</div>

		<div class="relative text-default">
			<slot />
		</div>

		<div class="relative w-full max-w-6xl px-2 pt-6 pb-12 mx-auto lg:px-16">
			<NavigationTheFooter />
		</div>

		<div class="fixed z-10 bottom-4 left-4">
			<!-- <ScrollTop /> -->
		</div>
	</div>
</template>
