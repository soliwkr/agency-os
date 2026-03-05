<script setup lang="ts">
import type { File } from '~/types';

export interface GalleryProps {
	items: File[];
}

const props = defineProps<GalleryProps>();

const { fileUrl } = useFiles();

const isOpen = ref(false);
const currentItemIdx = ref(0);

const currentItem = computed(() => {
	return props.items[currentItemIdx.value];
});

const carousel = useTemplateRef('carousel');

function toggle() {
	isOpen.value = !isOpen.value;
}

const isHelpOpen = ref(false);

function toggleHelp() {
	isHelpOpen.value = !isHelpOpen.value;
}

// Scroll carousel to the correct slide when lightbox opens
watch(isOpen, (val) => {
	if (val) {
		nextTick(() => {
			carousel.value?.emblaApi?.scrollTo(currentItemIdx.value, true);
		});
	}
});
</script>
<template>
	<!-- Gallery -->
	<div class="gap-4 mt-4 md:columns-3">
		<button
			v-for="(item, itemIdx) in items"
			:key="item.id"
			:class="[
				'block relative w-full mb-6 overflow-hidden border border-default rounded-card focus:outline-none',
			]"
			@click="
				() => {
					currentItemIdx = itemIdx;
					toggle();
				}
			"
		>
			<div class="relative block w-full overflow-hidden rounded-card group">
				<NuxtImg
					:src="item.id"
					:alt="item.description ?? ''"
					class="object-cover w-full transition duration-300 group-hover:scale-110"
				/>
				<div
					class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-default/75 opacity-0 hover:opacity-100"
				>
					<DirectusIcon name="material-symbols:zoom-in-rounded" class="w-12 h-12 text-primary" />
				</div>
			</div>
		</button>
	</div>
	<!-- Gallery Modal -->
	<Transition
		enter-active-class="ease-out duration-300"
		enter-from-class="opacity-0"
		enter-to-class="opacity-100"
		leave-active-class="ease-in duration-200"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
	>
		<div
			v-if="isOpen"
			class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-inverted/75"
			@keydown.escape="toggle"
			tabindex="0"
		>
			<div class="relative flex flex-col items-center justify-center w-full h-full max-w-7xl">
				<!-- Help Button -->
				<div
					v-auto-animate
					class="absolute z-50 hidden gap-2 text-inverted bg-opacity-75 item-center md:flex top-4 left-4"
				>
					<div>
						<UButton
							:icon="isHelpOpen ? 'material-symbols:hide' : 'material-symbols:help-outline-rounded'"
							size="xl"
							@click="toggleHelp"
						/>
					</div>

					<div
						v-if="isHelpOpen"
						class="flex items-center px-3 py-1 text-xs bg-inverted backdrop-blur-sm rounded-button gap-x-4"
					>
						<p>
							Press
							<UKbd value="esc" />
							to close
						</p>
						<p>
							Press
							<UKbd value="←" />
							or
							<UKbd value="→" />
							to navigate
						</p>
					</div>
				</div>
				<!-- Close Button -->
				<UButton class="absolute z-50 top-4 right-4" icon="material-symbols:close-rounded" size="xl" @click="toggle" />

				<!-- Image Carousel -->
				<div class="relative flex flex-col items-center justify-center w-full h-full p-20 mx-auto">
					<p
						v-if="currentItem.description"
						class="inline-block px-6 py-2 text-sm text-inverted bg-inverted rounded-t-xl"
					>
						{{ currentItem.description }}
					</p>

					<UCarousel
						ref="carousel"
						v-slot="{ item }"
						loop
						arrows
						fade
						:items="items"
						:start-index="currentItemIdx"
						:prev="{ size: 'xl', icon: 'material-symbols:arrow-back-rounded', variant: 'solid' }"
						:next="{ size: 'xl', icon: 'material-symbols:arrow-forward-rounded', variant: 'solid' }"
						:ui="{
							root: 'w-full h-full',
							viewport: 'h-full',
							container: 'h-full',
							item: 'h-full flex items-center justify-center',
							prev: 'left-4',
							next: 'right-4',
						}"
						@select="(idx: number) => currentItemIdx = idx"
					>
						<NuxtImg
							:src="item.id"
							:alt="item.description ?? ''"
							class="object-contain max-h-full rounded-card"
						/>
					</UCarousel>
				</div>
			</div>
		</div>
	</Transition>
</template>
