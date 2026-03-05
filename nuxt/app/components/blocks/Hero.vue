<script setup lang="ts">
import type { BlockHero, BlockButtonGroup, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockHero;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
</script>
<template>
	<BlockContainer :background="background">
		<div class="relative grid gap-12 md:grid-cols-3">
			<!-- Content -->
			<div class="md:pt-12 md:col-span-2">
				<TypographyTitle v-if="data.title" :data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'title', mode: 'popover' })">
					{{ data.title }}
				</TypographyTitle>
				<TypographyHeadline v-if="data.headline" :content="data.headline" size="title" as="h1" :data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'headline', mode: 'popover' })" />
				<TypographyProse v-if="data.content" :content="data.content" size="lg" class="py-6 font-display" :data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'content', mode: 'popover' })" />
				<BlocksButtonGroup v-if="data.button_group" :data="data.button_group as BlockButtonGroup" :data-directus="setAttr({ collection: 'block_button_group', item: (data.button_group as BlockButtonGroup)?.id, fields: 'buttons', mode: 'modal' })" />
			</div>
			<!-- Image -->
			<div
				v-if="data.image"
				class="overflow-hidden border lg:relative lg:h-full border-default rounded-card"
				:class="data.image_position === 'left' ? 'order-first lg:-ml-48 md:-ml-16' : 'lg:-mr-48 md:-mr-16 '"
				:data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: ['image', 'image_position'], mode: 'modal' })"
			>
				<NuxtImg
					v-if="data.image"
					class="w-full overflow-hidden dark:brightness-90 max-h-[700px] h-full object-cover rounded-card"
					:src="safeRelationId(data.image) as string"
					:alt="safeRelation(data.image)?.description ?? ''"
				/>
			</div>
		</div>
	</BlockContainer>
</template>
