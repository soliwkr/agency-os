<script setup lang="ts">
const { progress, scrollToTop } = useScrollProgress();
</script>
<template>
	<div class="flex items-center">
		<div class="relative">
			<RadialProgress :radius="25" :progress="progress" :stroke="5" class="text-primary/75" />
			<button
				v-if="progress >= 0.95"
				class="absolute inset-0 flex items-center justify-center"
				@click="() => scrollToTop()"
			>
				<DirectusIcon name="material-symbols:arrow-upward-rounded" class="w-4 h-4 text-primary/75 hover:text-muted" />
			</button>
		</div>
		<span
			v-if="progress >= 0.95"
			class="p-1.5 text-default bg-accented/50 rounded-xl font-display"
		>
			fin.
		</span>
	</div>
</template>
