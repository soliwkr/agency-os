<script setup lang="ts">
export interface DividerProps {
	vertical?: boolean;
}

withDefaults(defineProps<DividerProps>(), {
	vertical: false,
});
</script>
<template>
	<div v-if="vertical" class="h-full border-l border-default" />
	<div v-else class="w-full border-t border-default" />
</template>
