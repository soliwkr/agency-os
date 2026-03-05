<script setup lang="ts">
export interface PostVideoProps {
	page: any;
}

const props = defineProps<PostVideoProps>();

const { setAttr } = useVisualEditing();
</script>
<template>
	<div class="py-12">
		<div
			class="relative flex items-center justify-center w-full overflow-hidden bg-inverted border-t-2 border-b-2 border-primary/50"
			:data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'video_url', mode: 'modal' })"
		>
			<VVideo :url="page?.video_url" class="max-w-5xl" />
		</div>

		<BlockContainer>
			<!-- Main -->
			<main class="flex flex-col gap-4">
				<TypographyHeadline :content="page?.title" as="h1" size="lg" :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'title', mode: 'popover' })" />
				<TypographyProse :content="page?.summary" :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'summary', mode: 'popover' })" />
				<div
					class="pb-4 space-y-4 border-b md:space-y-0 md:flex md:justify-between md:items-center border-default"
				>
					<Author v-if="page?.author" :author="page?.author" />
					<NuxtLink
						v-if="page?.category"
						:href="`/posts/categories/${page?.category.slug}`"
						class="inline-block hover:opacity-90"
					>
						<Category size="lg" :color="page?.category.color">{{ page?.category.title }}</Category>
					</NuxtLink>
					<div class="inline-flex gap-4">
						<p class="flex text-muted">
							<DirectusIcon name="material-symbols:timer-outline-rounded" class="w-6 h-6 mr-2" />
							{{ calculateReadTime(page?.content) }}
						</p>
						<p class="flex text-muted">
							<DirectusIcon name="material-symbols:calendar-today-rounded" class="w-6 h-6 mr-2" />
							{{ getRelativeTime(page?.date_published) }}
						</p>
					</div>
				</div>
				<article>
					<TypographyProse ref="article" :content="page?.content" :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'content', mode: 'drawer' })" />
				</article>
			</main>
		</BlockContainer>
	</div>
</template>
