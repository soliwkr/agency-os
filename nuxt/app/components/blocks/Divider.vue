<script setup lang="ts">
interface DividerBlockProps {
	title?: string;
}

defineProps<{ data: DividerBlockProps }>();
</script>
<template>
	<BlockContainer>
		<div v-if="data.title" class="flex-shrink-0 mx-auto lg:mx-0">
			<TypographyHeadline :content="data.title" />
		</div>
		<div class="w-full h-px bg-(--ui-border)"></div>
	</BlockContainer>
</template>
