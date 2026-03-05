<script setup lang="ts">
import type { BlockGalleryFile } from '~/types';

export interface PostProjectProps {
	page: any;
}

const props = defineProps<PostProjectProps>();

const galleryItems = computed(() => {
	if (!props.page) return;
	return unref(props.page)?.gallery.map((item: BlockGalleryFile) => {
		return item.directus_files_id;
	});
});
</script>
<template>
	<div class="py-12">
		<header class="relative h-[400px] overflow-hidden flex justify-center items-center">
			<NuxtImg class="absolute inset-0 object-cover w-full h-full" :src="page?.image" />
			<div class="absolute inset-0 bg-inverted opacity-75" />
			<div class="relative max-w-3xl p-8 mx-auto overflow-hidden bg-inverted/50 rounded-card">
				<TypographyHeadline :content="page?.title" class="text-inverted" size="xl" />
				<TypographyProse :content="page?.summary" class="mt-4 text-inverted" />
			</div>
		</header>

		<BlockContainer class="md:flex gap-8">
			<!-- Main -->
			<main class="p-4">
				<article class="w-full">
					<TypographyProse ref="article" :content="page?.content" />
				</article>
				<!-- Optional Image Gallery -->
				<VGallery v-if="galleryItems && galleryItems.length > 0" :items="galleryItems" />
			</main>
			<!-- Project Metadata -->
			<aside class="md:w-[300px] flex-shrink-0">
				<div class="p-4 space-y-8 border-2 border-default rounded-card">
					<div>
						<TypographyTitle>Client</TypographyTitle>
						<p class="font-bold text-highlighted">
							{{ page?.client }}
						</p>
					</div>
					<div>
						<TypographyTitle>Built With</TypographyTitle>
						<div v-for="(item, itemIdx) in page?.built_with" :key="itemIdx" class="mt-2">
							<UBadge size="lg" color="neutral">{{ item }}</UBadge>
						</div>
					</div>
					<div>
						<TypographyTitle>Cost</TypographyTitle>
						<p class="font-bold text-highlighted">
							{{ page?.cost }}
						</p>
					</div>
				</div>
			</aside>
		</BlockContainer>
	</div>
</template>
