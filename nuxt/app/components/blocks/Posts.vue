<script setup lang="ts">
import type { BlockPosts, Post } from '~/types';

const props = defineProps<{
	data: BlockPosts;
}>();

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
	<BlockContainer>
		<header v-if="data.title || data.headline" class="pb-6 border-b border-default">
			<TypographyTitle v-if="data.title">{{ data.title }}</TypographyTitle>
			<TypographyHeadline v-if="data.headline" :content="data.headline" />
		</header>

		<section class="relative w-full py-12 space-y-12">
			<!-- Search + Featured Post (grid layout with show_search) -->
			<div
				v-if="data.show_search || data.featured_post"
				class="relative grid w-full gap-12 pb-12 border-b-2 border-default md:grid-cols-2 lg:grid-cols-4"
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
								'border-b border-default pb-6',
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
						class="relative block w-full mb-6 overflow-hidden transition duration-300 border border-default rounded-card"
					>
						<div class="relative h-56 overflow-hidden rounded-card group">
							<NuxtImg
								v-if="project.image"
								:src="project.image as string"
								class="object-cover transition duration-300 group-hover:scale-110"
							/>
							<div
								class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-default/75 opacity-0 hover:opacity-100"
							>
								<div class="p-8">
									<TypographyTitle v-if="project?.client">{{ project?.client }}</TypographyTitle>
									<TypographyHeadline v-if="project?.title" :content="project.title" />
									<div v-if="project?.built_with" class="flex flex-wrap gap-2 mt-2">
										<UBadge v-for="(item, itemIdx) in project?.built_with" :key="itemIdx" size="md" color="neutral">
											{{ item }}
										</UBadge>
									</div>
								</div>
							</div>
						</div>
					</NuxtLink>
				</div>
			</template>

			<!-- Pagination -->
			<nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-8">
				<UButton
					variant="ghost"
					:disabled="currentPage <= 1"
					@click="goToPage(currentPage - 1)"
				>
					Previous
				</UButton>
				<UButton
					v-for="page in totalPages"
					:key="page"
					:variant="page === currentPage ? 'solid' : 'ghost'"
					@click="goToPage(page)"
				>
					{{ page }}
				</UButton>
				<UButton
					variant="ghost"
					:disabled="currentPage >= totalPages"
					@click="goToPage(currentPage + 1)"
				>
					Next
				</UButton>
			</nav>
		</section>
	</BlockContainer>
</template>
