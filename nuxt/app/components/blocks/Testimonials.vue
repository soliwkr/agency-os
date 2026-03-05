<script setup lang="ts">
import type { BlockTestimonial, BlockTestimonialItem, Testimonial, File, BackgroundType } from '~/types';

const props = withDefaults(defineProps<{
  data: BlockTestimonial;
  background?: BackgroundType;
}>(), {
  background: 'default',
});

const { setAttr } = useVisualEditing();

const testimonials = computed(() => {
  const testimonialsArray = unref(props.data).testimonials as BlockTestimonialItem[];

  if (!testimonialsArray) return [];

  return testimonialsArray.map((item) => {
    return item.testimonials_id as Testimonial;
  });
});
</script>
<template>
  <BlockContainer :background="background" class="relative overflow-hidden" full-width>
    <div class="text-center">
      <TypographyTitle v-if="data.title" :data-directus="setAttr({ collection: 'block_testimonials', item: data.id, fields: 'title', mode: 'popover' })">{{ data.title }}</TypographyTitle>
      <TypographyHeadline v-if="data.headline" :content="data.headline" size="lg" :data-directus="setAttr({ collection: 'block_testimonials', item: data.id, fields: 'headline', mode: 'popover' })" />
    </div>

    <div :data-directus="setAttr({ collection: 'block_testimonials', item: data.id, fields: 'testimonials', mode: 'modal' })">
      <UCarousel
        v-if="testimonials.length > 0"
        v-slot="{ item: testimonial }"
        loop
        arrows
        dots
        :autoplay="{ delay: 5000 }"
        :prev="{
          size: 'lg',
          square: true,
          icon: 'material-symbols:arrow-back-rounded',
          variant: 'outline',
          color: 'primary',
        }"
        :next="{
          size: 'lg',
          square: true,
          icon: 'material-symbols:arrow-forward-rounded',
          variant: 'outline',
          color: 'primary',
        }"
        :items="testimonials as Testimonial[]"
        :ui="{
          root: 'flex flex-col-reverse py-6',
          container: 'items-stretch',
          item: 'basis-[350px] md:basis-[500px] lg:basis-[650px]',
          controls: 'relative flex items-center justify-end gap-4 px-6 lg:px-16 mb-6',
          arrows: 'flex gap-2 order-2',
          prev: 'static translate-0 rounded-lg',
          next: 'static translate-0 rounded-lg',
          dots: 'static flex-wrap gap-2',
          dot: 'w-8 h-3 rounded-none bg-elevated data-[state=active]:bg-primary',
        }"
        class="relative mt-4"
      >
        <div
          class="relative flex flex-col justify-between shrink-0 p-8 md:p-10 border border-dashed border-primary/50 bg-default rounded-card h-full corner-marks"
        >
          <div>
            <TypographyProse v-if="testimonial?.content" :content="testimonial?.content" size="lg" />
          </div>
          <div class="flex pt-6 mt-6 space-x-3 border-t border-dashed border-primary/30">
            <NuxtImg
              v-if="(testimonial?.image as unknown as File)?.id"
              class="inline-block w-14 h-14 ring-1 ring-primary/30 rounded-button"
              :src="(testimonial?.image as unknown as File)?.id"
              :alt="testimonial.title ?? ''"
            />
            <DirectusIcon
              v-else
              name="material-symbols:account-circle"
              class="inline-block w-14 h-14 text-dimmed ring-1 ring-primary/30 rounded-button"
            />
            <div class="relative flex flex-col justify-center">
              <p v-if="testimonial.title" class="font-semibold text-primary font-display lg:text-xl">
                {{ testimonial.title }}
              </p>
              <p class="font-mono text-xs uppercase tracking-wider text-muted">{{ testimonial.subtitle }} at {{ testimonial.company }}</p>
            </div>
          </div>
        </div>
      </UCarousel>
    </div>
  </BlockContainer>
</template>
