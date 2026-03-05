<script setup lang="ts">
export interface HorizontalNavigationProps {
	items: Array<{
		name: string;
		href: string;
	}>;
}

const props = defineProps<HorizontalNavigationProps>();
</script>

<template>
	<div class="inline-flex">
		<nav class="flex gap-4">
			<NuxtLink
				v-for="tab in items"
				:key="tab.name"
				:href="tab.href"
				exact-active-class="text-primary bg-primary/10"
				class="px-3 py-2 text-sm font-medium text-muted transition duration-300 rounded-button hover:text-default"
			>
				{{ tab.name }}
			</NuxtLink>
		</nav>
	</div>
</template>
