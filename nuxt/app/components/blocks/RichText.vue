<script setup lang="ts">
import type { BlockRichtext, BackgroundType } from '~/types';

const props = withDefaults(
  defineProps<{
    data: BlockRichtext;
    background?: BackgroundType;
  }>(),
  {
    data: () => ({
      alignment: 'center',
    }),
  },
);

const { setAttr } = useVisualEditing();
</script>

<template>
  <BlockContainer :background="background">
    <div
      :class="[
        {
          'text-left': data.alignment === 'left',
          'text-center': data.alignment === 'center',
        },
      ]"
    >
      <TypographyTitle
        v-if="data.title"
        :data-directus="setAttr({ collection: 'block_richtext', item: data.id, fields: 'title', mode: 'popover' })"
      >
        {{ data.title }}
      </TypographyTitle>
      <TypographyHeadline
        v-if="data.headline"
        :content="data.headline"
        size="lg"
        :data-directus="setAttr({ collection: 'block_richtext', item: data.id, fields: 'headline', mode: 'popover' })"
      />
    </div>
    <TypographyProse
      v-if="data.content"
      :content="data.content"
      :class="[
        {
          'mx-auto': data.alignment === 'center',
        },
        'mt-8 ',
      ]"
      :data-directus="setAttr({ collection: 'block_richtext', item: data.id, fields: 'content', mode: 'drawer' })"
    />
  </BlockContainer>
</template>
