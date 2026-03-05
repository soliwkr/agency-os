<script setup lang="ts">
export interface HelpCollectionsDetailProps {
	baseUrl?: string;
}

const props = defineProps<HelpCollectionsDetailProps>();

const { params, path } = useRoute();

const {
	data: collection,
	pending,
	error,
} = await useAsyncData(
	path,
	() => {
		return useDirectus(
			readItems('help_collections', {
				filter: {
					slug: {
						_eq: params.slug,
					},
				},
				fields: ['*', 'articles.slug', 'articles.title', 'articles.id', 'articles.summary'],
			}),
		);
	},
	{
		transform: (data) => data[0],
	},
);
</script>
<template>
	<section class="max-w-full mt-8">
		<div class="flex flex-col gap-10 pt-4 max-sm:gap-8 max-sm:pt-2">
			<div>
				<div class="mb-5">
					<Icon
						v-if="collection?.icon"
						:name="convertIconName(collection?.icon) as string"
						class="h-9 w-9 sm:h-10 sm:w-10 text-primary"
					></Icon>
				</div>
				<div class="flex flex-col">
					<TypographyHeadline :content="collection?.title" />

					<div class="text-muted text-md">
						<p>{{ collection?.description }}</p>
					</div>
				</div>
				<div class="mt-5 text-muted">{{ collection?.articles.length }} articles</div>
			</div>
			<div class="flex flex-col gap-5 p-2 border-2 border-accented rounded-card">
				<NuxtLink
					v-for="article in collection?.articles"
					:key="article.id"
					:to="`${baseUrl}/help/articles/${article.slug}`"
					class="flex flex-col p-3 transition duration-150 rounded-card hover:bg-primary/10"
				>
					<div class="flex items-center justify-between">
						<div>
							<TypographyHeadline :content="article.title" size="sm" />
							<p class="mt-2 text-sm text-muted">
								{{ article.summary }}
							</p>
						</div>
						<Icon name="heroicons:arrow-right" class="w-6 h-6 text-toned" />
					</div>
				</NuxtLink>
			</div>
		</div>
	</section>
</template>
