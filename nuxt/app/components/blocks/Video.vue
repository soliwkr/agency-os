<script setup lang="ts">
import type { BlockVideo, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockVideo;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
const { fileUrl } = useFiles();

const url = computed(() => {
	if (props.data.type === 'file' && props.data.video_file) {
		return fileUrl(props.data.video_file as string);
	}

	if (props.data.type === 'url' && props.data.video_url) {
		return props.data.video_url;
	}

	return null;
});
</script>
<template>
	<BlockContainer :background="background">
		<TypographyTitle v-if="data.title" :data-directus="setAttr({ collection: 'block_video', item: data.id, fields: 'title', mode: 'popover' })">{{ data.title }}</TypographyTitle>
		<TypographyHeadline v-if="data.headline" :content="data.headline" size="lg" :data-directus="setAttr({ collection: 'block_video', item: data.id, fields: 'headline', mode: 'popover' })" />
		<div :data-directus="setAttr({ collection: 'block_video', item: data.id, fields: ['type', 'video_url', 'video_file'], mode: 'modal' })">
			<VVideo
				v-if="url"
				class="relative mt-6 overflow-hidden border border-default rounded-card"
				:url="url"
				:title="data.title ?? undefined"
			/>
		</div>
	</BlockContainer>
</template>
