<script setup lang="ts">
import { motion } from 'motion-v';
import type { BlockButtonGroup, BlockColumn, BlockColumnRow, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockColumn;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
</script>

<template>
	<BlockContainer :background="background">
		<TypographyTitle v-if="data?.title" :data-directus="setAttr({ collection: 'block_columns', item: data.id, fields: 'title', mode: 'popover' })">{{ data?.title }}</TypographyTitle>
		<TypographyHeadline v-if="data?.headline" :content="data?.headline" :data-directus="setAttr({ collection: 'block_columns', item: data.id, fields: 'headline', mode: 'popover' })" />
		<div class="mt-12 space-y-16" :data-directus="setAttr({ collection: 'block_columns', item: data.id, fields: 'rows', mode: 'modal' })">
			<div
				v-for="row in data?.rows as BlockColumnRow[]"
				:key="row?.id"
				class="relative grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-24"
			>
				<div class="my-auto">
					<TypographyTitle v-if="row?.title">{{ row?.title }}</TypographyTitle>
					<TypographyHeadline v-if="row?.headline" :content="row?.headline" />
					<TypographyProse v-if="row?.content" :content="row?.content" class="mt-4" />
					<BlocksButtonGroup v-if="row?.button_group" :data="row?.button_group as BlockButtonGroup" class="mt-4" />
				</div>
				<motion.div
					v-if="row.image"
					class="order-first block w-full h-full overflow-hidden border border-default rounded-card"
					:initial="{ opacity: 0, y: 24 }"
					:whileInView="{ opacity: 1, y: 0 }"
					:transition="{ duration: 0.5, delay: 0.1 }"
					:class="[
						{
							'lg:order-last': row?.image_position === 'right',
							'lg:order-first': row?.image_position === 'left',
						},
					]"
				>
					<NuxtImg
						:alt="safeRelation(row.image)?.description ?? ''"
						:src="safeRelationId(row.image) ?? ''"
						height="600"
						width="600"
						class="object-cover object-center w-full h-full bg-elevated rounded-card dark:brightness-90"
					/>
				</motion.div>
			</div>
		</div>
	</BlockContainer>
</template>
