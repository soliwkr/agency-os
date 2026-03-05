<script setup lang="ts">
import { motion } from 'motion-v';
import type { BlockLogocloud, BlockLogocloudFile, File, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockLogocloud;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
const { fileUrl } = useFiles();
</script>
<template>
	<BlockContainer :background="background">
		<TypographyTitle v-if="data?.title" :data-directus="setAttr({ collection: 'block_logocloud', item: data.id, fields: 'title', mode: 'popover' })">{{ data?.title }}</TypographyTitle>
		<TypographyHeadline v-if="data?.headline" :content="data?.headline" size="lg" :data-directus="setAttr({ collection: 'block_logocloud', item: data.id, fields: 'headline', mode: 'popover' })" />
		<div class="flow-root mt-8 lg:mt-10" :data-directus="setAttr({ collection: 'block_logocloud', item: data.id, fields: 'logos', mode: 'modal' })">
			<div v-if="data.logos && data.logos.length > 0" class="grid gap-4 md:grid-cols-4 md:gap-8">
				<motion.div
					v-for="(logo, fileIdx) in data?.logos as BlockLogocloudFile[]"
					:key="logo.id"
					:initial="{
						opacity: 0,
						y: 100,
					}"
					:whileInView="{
						opacity: 1,
						y: 0,
					}"
					:transition="{ delay: 0.25 + 0.1 * fileIdx }"
					class="flex items-center justify-center p-8 border border-default rounded-card"
				>
					<NuxtImg
						v-if="(logo.directus_files_id as File)?.id"
						class="h-12"
						:src="(logo.directus_files_id as File)?.id"
						:alt="(logo.directus_files_id as File)?.description ?? ''"
					/>
				</motion.div>
			</div>
		</div>
	</BlockContainer>
</template>
