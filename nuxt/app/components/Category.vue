<script setup lang="ts">
const props = defineProps({
	color: {
		type: String,
		default: null,
	},
	size: {
		type: String,
		default: 'sm',
	},
	active: {
		type: Boolean,
		default: false,
	},
});

const borderStyle = computed(() => {
	if (props.active || !props.color) return undefined;
	return { borderLeftColor: props.color };
});
</script>

<template>
	<span
		:style="borderStyle"
		:class="[
			'inline-flex items-center font-mono uppercase tracking-wider border-l-2 pl-2',
			active ? 'text-primary border-primary' : 'text-default border-primary',
			size === 'sm' ? 'text-xs' : 'text-sm',
		]"
	>
		<slot />
	</span>
</template>
