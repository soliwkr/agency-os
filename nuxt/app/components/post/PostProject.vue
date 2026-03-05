<script setup lang="ts">
import type { BlockGalleryFile } from '~/types';

export interface PostProjectProps {
  page: any;
}

const props = defineProps<PostProjectProps>();

const { setAttr } = useVisualEditing();

const galleryItems = computed(() => {
  if (!props.page) return;
  return unref(props.page)?.gallery.map((item: BlockGalleryFile) => {
    return item.directus_files_id;
  });
});
</script>
<template>
  <BlockContainer>
    <header class="max-w-4xl mx-auto">
      <!-- Client Eyebrow -->
      <p
        v-if="page?.client"
        class="font-mono text-xs tracking-wider text-muted uppercase"
        :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'client', mode: 'popover' })"
      >
        {{ page.client }}
      </p>

      <!-- Title + Summary -->
      <TypographyHeadline
        :content="page?.title"
        as="h1"
        size="xl"
        class="mt-2"
        :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'title', mode: 'popover' })"
      />
      <TypographyProse
        v-if="page?.summary"
        :content="page?.summary"
        class="mt-4"
        size="lg"
        :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'summary', mode: 'popover' })"
      />

      <!-- Meta Row -->
      <div
        class="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-dashed border-primary/30"
        :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: ['built_with', 'cost'], mode: 'modal' })"
      >
        <div v-if="page?.built_with?.length" class="flex flex-wrap gap-2">
          <UBadge v-for="(item, itemIdx) in page.built_with" :key="itemIdx" size="lg" color="neutral">
            {{ item }}
          </UBadge>
        </div>
        <span v-if="page?.cost" class="font-mono text-xs tracking-wider text-muted uppercase">
          {{ page.cost }}
        </span>
      </div>
    </header>

    <!-- Hero Image -->
    <div
      class="relative max-w-4xl mx-auto mt-8 overflow-hidden border border-dashed border-primary/30 corner-marks rounded-card"
      :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'image', mode: 'modal' })"
    >
      <div class="relative w-full h-[300px] md:h-[500px]">
        <NuxtImg :src="page?.image" class="object-cover w-full h-full saturate-0 dark:brightness-90" alt="" />
        <div class="absolute inset-0 mix-blend-multiply bg-gradient-to-b from-muted to-inverted" />
      </div>
    </div>

    <!-- Article -->
    <main class="w-full max-w-4xl mx-auto mt-12">
      <TypographyProse
        ref="article"
        :content="page?.content"
        :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'content', mode: 'drawer' })"
      />

      <!-- Gallery -->
      <div
        v-if="galleryItems && galleryItems.length > 0"
        :data-directus="setAttr({ collection: 'posts', item: page?.id, fields: 'gallery', mode: 'modal' })"
      >
        <VGallery :items="galleryItems" />
      </div>
    </main>
  </BlockContainer>
</template>
