<script setup lang="ts">
export interface BreadcrumbsProps {
	items: Array<{
		title: string;
		href?: string | null | undefined;
	}>;
}

const props = defineProps<BreadcrumbsProps>();

const breadcrumbItems = computed(() =>
	props.items.map((item) => ({
		label: item.title,
		to: item.href ?? undefined,
	})),
);
</script>
<template>
	<UBreadcrumb :items="breadcrumbItems" />
</template>
