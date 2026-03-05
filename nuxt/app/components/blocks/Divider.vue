<script setup lang="ts">
import type { BackgroundType } from '~/types';

interface DividerBlockProps {
  id?: string;
  title?: string;
}

const props = defineProps<{ data: DividerBlockProps; background?: BackgroundType }>();

const { setAttr } = useVisualEditing();
</script>
<template>
  <BlockContainer :background="background">
    <div v-if="data.title" class="shrink-0 mx-auto lg:mx-0" :data-directus="setAttr({ collection: 'block_divider', item: data.id, fields: 'title', mode: 'popover' })">
      <TypographyHeadline :content="data.title" />
    </div>
    <div class="flex items-center w-full">
      <span class="text-primary font-mono text-xs leading-none select-none">+</span>
      <div class="flex-1 border-t border-dashed border-primary/30"></div>
      <span class="text-primary font-mono text-xs leading-none select-none">+</span>
    </div>
  </BlockContainer>
</template>
