<template>
	<label :for="name" class="block mb-1 text-sm font-semibold text-muted">{{ label }}</label>
</template>

<script setup>
const props = defineProps({
	label: {
		type: String,
		default: '',
	},
	name: {
		type: String,
		default: '',
	},
});
</script>
