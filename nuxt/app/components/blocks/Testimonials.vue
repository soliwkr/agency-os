<script setup lang="ts">
import type { BlockTestimonial, BlockTestimonialItem, Testimonial, File } from '~/types';

const props = defineProps<{
	data: BlockTestimonial;
}>();

const testimonials = computed(() => {
	const testimonialsArray = unref(props.data).testimonials as BlockTestimonialItem[];

	if (!testimonialsArray) return [];

	return testimonialsArray.map((item) => {
		return item.testimonials_id as Testimonial;
	});
});
</script>
<template>
	<BlockContainer class="relative overflow-hidden" full-width>
		<div
			class="absolute inset-0 bg-gradient-to-br from-default via-muted to-primary"
		/>
		<div class="absolute inset-0 opacity-50 grain-bg dark:opacity-10" />

		<div class="relative text-center">
			<TypographyTitle v-if="data.title">{{ data.title }}</TypographyTitle>
			<TypographyHeadline v-if="data.headline" :content="data.headline" size="lg" />
		</div>

		<UCarousel
			v-if="testimonials.length > 0"
			v-slot="{ item: testimonial }"
			loop
			arrows
			dots
			:autoplay="{ delay: 5000 }"
			:prev="{ size: 'lg', square: true, icon: 'material-symbols:arrow-back-rounded', variant: 'solid', color: 'primary' }"
			:next="{ size: 'lg', square: true, icon: 'material-symbols:arrow-forward-rounded', variant: 'solid', color: 'primary' }"
			:items="(testimonials as Testimonial[])"
			:ui="{
				root: 'flex flex-col-reverse py-6',
				container: 'items-stretch',
				item: 'basis-[350px] md:basis-[450px] lg:basis-[600px]',
				controls: 'relative flex items-center justify-end gap-4 px-6 lg:px-16 mb-6',
				arrows: 'flex gap-2 order-2',
				prev: 'static translate-0 rounded-lg',
				next: 'static translate-0 rounded-lg',
				dots: 'static flex-wrap gap-2',
				dot: 'w-12 h-3 rounded-button bg-muted data-[state=active]:bg-primary',
			}"
			class="relative mt-4"
		>
			<div
				class="relative flex flex-col justify-between flex-shrink-0 p-8 bg-default shadow-md rounded-card overflow-hidden h-full"
			>
				<DirectusIcon
					name="material-symbols:format-quote-rounded"
					class="absolute w-20 h-20 rotate-180 left-2 text-primary/20 top-2"
				/>
				<TypographyProse v-if="testimonial?.content" :content="testimonial?.content" size="lg" class="relative" />
				<div class="flex pt-6 mt-4 space-x-2 border-t border-default">
					<NuxtImg
						v-if="(testimonial?.image as unknown as File)?.id"
						class="inline-block w-16 h-16 border rounded-button"
						:src="(testimonial?.image as unknown as File)?.id"
						:alt="testimonial.title ?? ''"
					/>
					<DirectusIcon
						v-else
						name="material-symbols:account-circle"
						class="inline-block w-16 h-16 text-dimmed border rounded-button"
					/>
					<div class="relative">
						<p v-if="testimonial.title" class="font-semibold text-primary font-display lg:text-2xl">
							{{ testimonial.title }}
						</p>
						<p class="text-sm text-default lg:text-lg">
							{{ testimonial.subtitle }} at {{ testimonial.company }}
						</p>
					</div>
				</div>
			</div>
		</UCarousel>
	</BlockContainer>
</template>
