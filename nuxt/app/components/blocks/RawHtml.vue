<script setup lang="ts">
import type { BackgroundType } from '~/types';

export interface RawHtmlBlockProps {
	id: string;
	raw_html: string;
}

const props = defineProps<{
	data: RawHtmlBlockProps;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
</script>
<template>
	<BlockContainer :background="background">
		<div v-html="data.raw_html" :data-directus="setAttr({ collection: 'block_html', item: data.id, fields: 'raw_html', mode: 'modal' })" />
	</BlockContainer>
</template>
