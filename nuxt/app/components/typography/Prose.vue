<script setup lang="ts">
export interface ProseProps {
  content: string;
  size?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<ProseProps>(), {
  size: 'lg',
});

const config = useRuntimeConfig();
const contentEl = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!contentEl.value) return;

  const anchors = Array.from(contentEl.value.getElementsByTagName('a'));
  if (!anchors) return;

  for (const anchor of anchors) {
    const href = anchor.getAttribute('href');

    if (!href) return;

    const url = new URL(href, window.location.origin);

    const isLocal = url.hostname === config.public.siteUrl;

    if (isLocal) {
      anchor.addEventListener('click', (e) => {
        const { pathname, searchParams, hash } = new URL(anchor.href);

        navigateTo({
          path: pathname,
          hash: hash,
          query: Object.fromEntries(searchParams.entries()),
        });

        e.preventDefault();
      });
    } else {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
  }
});
</script>

<template>
  <div
    ref="contentEl"
    :class="[
      {
        'prose-sm': size === 'sm',
        'md:prose-base lg:prose-lg': size === 'md',
        'prose-lg lg:prose-xl': size === 'lg',
      },
      'prose',
    ]"
    v-html="content"
  />
</template>
