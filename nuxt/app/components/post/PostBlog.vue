<script setup lang="ts">
export interface PostBlogProps {
	page: any;
}

const props = defineProps<PostBlogProps>();

const { setAttr } = useVisualEditing();
</script>
<template>
	<BlockContainer>
		<header class="max-w-4xl mx-auto">
			<!-- Category + Meta Row -->
			<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
				<NuxtLink
					v-if="page?.category"
					:href="`/posts/categories/${page?.category.slug}`"
					class="inline-block hover:opacity-90"
				>
					<Category size="lg" :color="page?.category.color">{{ page?.category.title }}</Category>
				</NuxtLink>
				<div class="flex items-center gap-4 font-mono text-xs tracking-wider text-muted uppercase">
					<span class="flex items-center gap-1.5">
						<DirectusIcon name="material-symbols:timer-outline-rounded" class="size-4" />
						{{ calculateReadTime(page?.content) }}
					</span>
					<span class="flex items-center gap-1.5">
						<DirectusIcon name="material-symbols:calendar-today-rounded" class="size-4" />
						{{ getRelativeTime(page?.date_published) }}
					</span>
				</div>
			</div>

			<!-- Title + Summary -->
			<div class="mt-6 pb-8 border-b border-dashed border-primary/30">
				<TypographyHeadline
					:content="page?.title"
					as="h1"
					size="xl"
					:data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'title', mode: 'popover' })"
				/>
				<TypographyProse
					v-if="page?.summary"
					:content="page?.summary"
					class="mt-4"
					size="lg"
					:data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'summary', mode: 'popover' })"
				/>
			</div>

			<!-- Author -->
			<div v-if="page?.author" class="py-6">
				<Author :author="page.author" />
			</div>
		</header>

		<!-- Hero Image -->
		<div
			class="relative max-w-4xl mx-auto overflow-hidden border border-dashed border-primary/30 corner-marks rounded-card"
			:data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'image', mode: 'modal' })"
		>
			<div class="relative w-full h-[300px] md:h-[500px]">
				<NuxtImg :src="page?.image" class="object-cover w-full h-full saturate-0 dark:brightness-90" alt="" />
				<div class="absolute inset-0 mix-blend-multiply bg-gradient-to-b from-muted to-inverted" />
			</div>
		</div>

		<!-- Article -->
		<main class="w-full max-w-4xl mx-auto mt-12">
			<TypographyProse
				ref="article"
				:content="page?.content"
				:data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'content', mode: 'drawer' })"
			/>
		</main>
	</BlockContainer>
</template>
