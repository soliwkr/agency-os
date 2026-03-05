<script setup lang="ts">
import type { BlockButtonGroup, BlockCta, BackgroundType } from '~/types';

const props = defineProps<{
  data: BlockCta;
  background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();
</script>
<template>
  <BlockContainer :background="background">
    <div class="relative overflow-hidden p-8 text-highlighted border md:px-10 md:py-8 border-primary/50 rounded-panel">
      <div class="absolute inset-0 bg-gradient-to-br from-default via-muted to-primary" />
      <div class="absolute inset-0 opacity-50 grain-bg dark:opacity-10" />
      <div class="relative md:flex md:items-center md:justify-between md:space-x-4">
        <div>
          <TypographyTitle v-if="data?.title" :data-directus="setAttr({ collection: 'block_cta', item: data.id, fields: 'title', mode: 'popover' })">{{ data.title }}</TypographyTitle>
          <TypographyHeadline v-if="data.headline" :content="data.headline" class="font-bold" :data-directus="setAttr({ collection: 'block_cta', item: data.id, fields: 'headline', mode: 'popover' })" />
          <TypographyProse v-if="data.content" :content="data.content" class="mt-2" :data-directus="setAttr({ collection: 'block_cta', item: data.id, fields: 'content', mode: 'popover' })" />
        </div>
        <div class="shrink-0 mt-4 md:mt-0">
          <BlocksButtonGroup v-if="data.button_group" :data="data.button_group as BlockButtonGroup" :data-directus="setAttr({ collection: 'block_button_group', item: (data.button_group as BlockButtonGroup)?.id, fields: 'buttons', mode: 'modal' })" />
        </div>
      </div>
    </div>
  </BlockContainer>
</template>
