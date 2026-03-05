<script setup lang="ts">
import type { BlockForm, Form, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockForm;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
</script>
<template>
	<BlockContainer :background="background">
		<div class="max-w-3xl p-8 mx-auto mt-4 bg-elevated rounded-panel">
			<TypographyTitle v-if="data?.title" :data-directus="setAttr({ collection: 'block_form', item: data.id, fields: 'title', mode: 'popover' })">{{ data?.title }}</TypographyTitle>
			<TypographyHeadline v-if="data?.headline" :content="data?.headline" :data-directus="setAttr({ collection: 'block_form', item: data.id, fields: 'headline', mode: 'popover' })" />
			<div :data-directus="setAttr({ collection: 'block_form', item: data.id, fields: 'form', mode: 'modal' })">
				<DirectusForm v-if="data?.form" :form="data?.form as Form" class="mt-4" />
			</div>
		</div>
	</BlockContainer>
</template>
