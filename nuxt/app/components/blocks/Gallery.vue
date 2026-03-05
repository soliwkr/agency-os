<script setup lang="ts">
import type { BlockGallery, BlockGalleryFile, File, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockGallery;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();

const galleryItems = computed(() => {
	return props.data.gallery_items?.map((item: BlockGalleryFile) => {
		return item.directus_files_id as File;
	});
});
</script>

<template>
	<BlockContainer :background="background">
		<TypographyTitle v-if="data.title" :data-directus="setAttr({ collection: 'block_gallery', item: data.id, fields: 'title', mode: 'popover' })">{{ data.title }}</TypographyTitle>
		<TypographyHeadline v-if="data.headline" :content="data.headline" size="lg" :data-directus="setAttr({ collection: 'block_gallery', item: data.id, fields: 'headline', mode: 'popover' })" />
		<div :data-directus="setAttr({ collection: 'block_gallery', item: data.id, fields: 'gallery_items', mode: 'modal' })">
			<VGallery v-if="galleryItems && galleryItems.length > 0" :items="galleryItems" />
		</div>
	</BlockContainer>
</template>
