<script setup lang="ts">
import { motion } from 'motion-v';
import type { BlockQuote, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockQuote;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
</script>
<template>
	<BlockContainer :background="background">
		<motion.div
			:initial="{
				opacity: 0,
				y: 100,
			}"
			:whileInView="{
				opacity: 1,
				y: 0,
			}"
			:transition="{ delay: 0.25 }"
			class="relative"
		>
			<div
				class="relative text-4xl italic leading-tight text-highlighted font-display md:leading-tight md:text-6xl text-wrap-[balance] dark:drop-shadow"
				v-html="data.content"
				:data-directus="setAttr({ collection: 'block_quote', item: data.id, fields: 'content', mode: 'popover' })"
			/>
			<DirectusIcon
				name="material-symbols:format-quote-rounded"
				class="absolute w-20 h-20 rotate-180 -left-8 text-primary/20 -top-8"
			/>
		</motion.div>

		<div class="w-full mt-4 text-sm font-semibold tracking-wider uppercase word-spacing-tight lg:text-lg font-display">
			<p v-if="data.title" class="text-primary" :data-directus="setAttr({ collection: 'block_quote', item: data.id, fields: 'title', mode: 'popover' })">
				{{ data.title }}
			</p>
			<p v-if="data.subtitle" class="text-highlighted" :data-directus="setAttr({ collection: 'block_quote', item: data.id, fields: 'subtitle', mode: 'popover' })">{{ data.subtitle }}</p>
		</div>
	</BlockContainer>
</template>
