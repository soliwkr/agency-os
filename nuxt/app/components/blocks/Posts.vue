<script setup lang="ts">
import type { BlockPosts, Post, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockPosts;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
const route = useRoute();

const currentPage = computed(() => {
	const page = Number(route.query.page);
	return page > 0 ? page : 1;
});

const perPage = computed(() => props.data.limit ?? 12);

const postFilter = computed(() => {
	const filter: Record<string, any> = {};
	if (props.data.post_type && props.data.post_type !== 'all') {
		filter.type = { _eq: props.data.post_type };
	}
	return filter;
});

const { data: result } = await useAsyncData(
	`block-posts-${props.data.id}-page-${unref(currentPage)}`,
	() => {
		const itemsPromise = useDirectus(
			readItems('posts', {
				filter: unref(postFilter),
				sort: ['-date_published'],
				fields: [
					'id',
					'slug',
					'title',
					'summary',
					'type',
					'image',
					'client',
					'built_with',
					{ category: ['title', 'slug', 'color'], author: ['name', 'job_title', 'image'] },
				],
				limit: unref(perPage),
				offset: (unref(currentPage) - 1) * unref(perPage),
			}),
		);

		const countPromise = useDirectus(
			aggregate('posts', {
				aggregate: { count: '*' },
				query: { filter: unref(postFilter) },
			}),
		);

		return Promise.all([itemsPromise, countPromise]);
	},
	{
		watch: [currentPage],
		transform: ([items, countResult]) => ({
			items,
			total: Number(countResult?.[0]?.count ?? 0),
		}),
	},
);

const posts = computed(() => {
	const items = unref(result)?.items ?? [];
	if (props.data.featured_post && typeof props.data.featured_post === 'object') {
		return items.filter((post: Post) => post.id !== (props.data.featured_post as Post).id);
	}
	return items;
});

const totalCount = computed(() => unref(result)?.total ?? 0);

const totalPages = computed(() => {
	const count = unref(totalCount);
	if (!count) return 1;
	return Math.ceil(count / unref(perPage));
});

function goToPage(page: number) {
	navigateTo({ query: { ...route.query, page: page > 1 ? page : undefined } });
}
</script>
<template>
	<BlockContainer :background="background">
		<header v-if="data.title || data.headline" class="pb-6 border-b border-dashed border-primary/30" :data-directus="setAttr({ collection: 'block_posts', item: data.id, fields: ['title', 'headline', 'post_type', 'layout', 'limit', 'featured_post', 'show_search'], mode: 'modal' })">
			<TypographyTitle v-if="data.title">{{ data.title }}</TypographyTitle>
			<TypographyHeadline v-if="data.headline" :content="data.headline" />
		</header>

		<section class="relative w-full py-12 space-y-12">
			<!-- Search + Featured Post (grid layout with show_search) -->
			<div
				v-if="data.show_search || data.featured_post"
				class="relative grid w-full gap-12 pb-12 border-b border-dashed border-primary/30 md:grid-cols-2 lg:grid-cols-4"
			>
				<div v-if="data.show_search">
					<TypographyTitle class="text-default">Search</TypographyTitle>
					<GlobalSearch :collections="['posts']" class="flex" />
					<TypographyTitle class="mt-8 text-default">Categories</TypographyTitle>
					<Categories />
				</div>
				<div v-if="data.featured_post && typeof data.featured_post === 'object'" class="space-y-4" :class="data.show_search ? 'lg:col-span-3' : 'lg:col-span-4'">
					<TypographyTitle>Featured Article</TypographyTitle>
					<PostCard :post="data.featured_post as Post" direction="horizontal" />
				</div>
			</div>

			<!-- Grid Layout (blog-style) -->
			<template v-if="data.layout !== 'cards'">
				<div class="space-y-4">
					<div class="relative grid gap-8 md:gap-12 md:grid-cols-3 lg:grid-cols-6">
						<PostCard
							v-for="(post, postIdx) in posts"
							:key="post.id"
							:post="post"
							:class="[
								'border-b border-dashed border-primary/30 pb-6',
								postIdx < 2 ? 'md:col-span-3' : 'md:col-span-2',
							]"
						/>
					</div>
				</div>
			</template>

			<!-- Cards Layout (project-style) -->
			<template v-else>
				<div class="grid gap-6 mt-4 md:grid-cols-3">
					<NuxtLink
						v-for="project in posts"
						:key="project.id"
						:href="`/posts/${project.slug}`"
						class="block w-full overflow-hidden transition duration-300 border border-dashed border-primary/30 group"
					>
						<div class="relative h-56 overflow-hidden">
							<NuxtImg
								v-if="project.image"
								:src="project.image as string"
								class="object-cover w-full h-full transition duration-300 saturate-0 group-hover:saturate-100"
							/>
						</div>
						<div class="p-4 space-y-2 border-t border-dashed border-primary/30">
							<span v-if="project?.client" class="block font-mono text-xs tracking-wider text-muted uppercase">
								{{ project.client }}
							</span>
							<TypographyHeadline v-if="project?.title" :content="project.title" size="xs" as="h3" class="group-hover:text-primary" />
							<div v-if="project?.built_with" class="flex flex-wrap gap-2 pt-1">
								<UBadge v-for="(item, itemIdx) in project?.built_with" :key="itemIdx" size="md" color="neutral">
									{{ item }}
								</UBadge>
							</div>
						</div>
					</NuxtLink>
				</div>
			</template>

			<!-- Pagination -->
			<nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-8 mt-8 border-t border-dashed border-primary/30">
				<UButton
					variant="outline"
					class="font-mono uppercase tracking-wider text-xs"
					:disabled="currentPage <= 1"
					@click="goToPage(currentPage - 1)"
				>
					Previous
				</UButton>
				<UButton
					v-for="page in totalPages"
					:key="page"
					:variant="page === currentPage ? 'solid' : 'outline'"
					class="font-mono"
					@click="goToPage(page)"
				>
					{{ page }}
				</UButton>
				<UButton
					variant="outline"
					class="font-mono uppercase tracking-wider text-xs"
					:disabled="currentPage >= totalPages"
					@click="goToPage(currentPage + 1)"
				>
					Next
				</UButton>
			</nav>
		</section>
	</BlockContainer>
</template>
