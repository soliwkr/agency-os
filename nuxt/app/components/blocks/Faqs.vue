<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui';
import type { BlockFaq, BlockFaqQuestion, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockFaq;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();

const offset = ref(0);
const limit = ref(5);

const faqs = computed(() => {
	// We don't want to overwhelm the user with too many FAQs at once so let's only show 5 until they want more
	return props.data?.faqs?.slice(offset.value, limit.value).map((item: BlockFaqQuestion) => {
		return {
			label: item?.title,
			content: item?.answer,
		};
	}) as AccordionItem[];
});

function loadMore() {
	limit.value += 5;
}
</script>

<template>
	<BlockContainer :background="background">
		<div
			:class="[
				{
					'mx-auto max-w-3xl': data.alignment === 'center',
				},
			]"
		>
			<TypographyTitle v-if="data.title" :data-directus="setAttr({ collection: 'block_faqs', item: data.id, fields: 'title', mode: 'popover' })">{{ data.title }}</TypographyTitle>
			<TypographyHeadline v-if="data.headline" :content="data.headline" size="lg" :data-directus="setAttr({ collection: 'block_faqs', item: data.id, fields: 'headline', mode: 'popover' })" />
			<div class="pt-6 mt-6" :data-directus="setAttr({ collection: 'block_faqs', item: data.id, fields: 'faqs', mode: 'modal' })">
				<UAccordion
					v-if="faqs"
					:items="faqs"
					:ui="{
						item: 'border-none mb-2',
						trigger: 'rounded-card px-6 py-4 font-medium font-display text-sm md:text-base data-[state=open]:bg-primary/20 data-[state=closed]:bg-muted focus:outline-none focus-visible:outline-primary',
						label: 'text-highlighted',
						body: 'pt-2 pb-6',
					}"
					trailing-icon=""
				>
					<template #trailing="{ open }">
						<DirectusIcon
							:name="open ? 'material-symbols:remove-rounded' : 'material-symbols:add-rounded'"
							class="size-8 ms-auto shrink-0 text-primary"
						/>
					</template>
					<template #body="{ item }">
						<div class="corner-marks-bottom pb-2">
							<div class="prose text-left dark:prose-invert px-6">
								{{ item.content }}
							</div>
						</div>
					</template>
				</UAccordion>
				<div class="mt-2 text-center">
					<UButton
						v-if="faqs && props.data.faqs && faqs.length < props.data.faqs.length"
						variant="ghost"
						size="xl"
						@click="loadMore"
					>
						Load More
					</UButton>
				</div>
			</div>
		</div>
	</BlockContainer>
</template>
