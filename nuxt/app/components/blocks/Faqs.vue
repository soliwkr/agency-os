<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui';
import type { BlockFaq, BlockFaqQuestion } from '~/types';

const props = defineProps<{
	data: BlockFaq;
}>();

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
	<BlockContainer>
		<div
			:class="[
				{
					'mx-auto max-w-3xl': data.alignment === 'center',
				},
			]"
		>
			<TypographyTitle v-if="data.title">{{ data.title }}</TypographyTitle>
			<TypographyHeadline v-if="data.headline" :content="data.headline" size="lg" />
			<div class="pt-6 mt-6">
				<UAccordion
					v-if="faqs"
					:items="faqs"
					:ui="{
						item: 'border-none mb-2',
						trigger: 'rounded-card px-6 py-4 font-medium font-display text-sm md:text-base data-[state=open]:bg-primary/20 data-[state=closed]:bg-muted focus:outline-none focus-visible:outline-primary',
						label: 'text-highlighted',
						body: 'px-6 pt-2 pb-6',
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
						<div class="prose text-left dark:prose-invert">
							{{ item.content }}
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
