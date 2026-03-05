<script setup lang="ts">
import type { Post, Category, Team } from '~/types';

const props = withDefaults(
  defineProps<{
    post: Post;
    direction?: 'horizontal' | 'vertical';
  }>(),
  {
    direction: 'vertical',
  },
);

const postCategory = computed(() => {
  return (unref(props.post.category) as Category) ?? null;
});
</script>
<template>
  <figure
    :class="[
      {
        'flex-col': direction === 'vertical',
        'flex-col md:flex-row': direction === 'horizontal',
      },
      'flex group gap-6',
    ]"
  >
    <NuxtLink
      :class="[
        {
          'w-full h-56': direction === 'vertical',
          'w-full h-56 md:w-72 md:h-72': direction === 'horizontal',
        },
        'relative block overflow-hidden border border-dashed border-primary/30 group shrink-0',
      ]"
      :href="`/posts/${post.slug}`"
    >
      <NuxtImg
        v-if="post.image"
        class="relative shrink-0 object-cover w-full h-full transition duration-300 saturate-0 group-hover:saturate-100"
        :src="safeRelationId(post.image) as string"
        :alt="safeRelation(post.image)?.alt ?? ''"
      />
    </NuxtLink>

    <div class="flex flex-col justify-between h-full gap-3">
      <NuxtLink class="space-y-2" :href="`/posts/${post.slug}`">
        <span v-if="postCategory" class="font-mono text-xs uppercase tracking-wider text-primary">
          {{ postCategory.title }}
        </span>
        <TypographyHeadline
          v-if="post.title"
          :content="post.title"
          class="group-hover:text-primary"
          size="xs"
          as="h3"
        />
        <VText text-color="light" class="line-clamp-2">
          {{ post?.summary }}
        </VText>
      </NuxtLink>

      <Author v-if="post.author" size="sm" :author="post.author as Team" />
    </div>
  </figure>
</template>
