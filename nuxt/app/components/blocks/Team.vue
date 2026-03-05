<script setup lang="ts">
import type { BlockTeam, Team, BackgroundType } from '~/types';

const props = defineProps<{
	data: BlockTeam;
	background?: BackgroundType;
}>();

const { setAttr } = useVisualEditing();

const { data: team }: { data: Ref<Team[]> } = await useAsyncData(
	'team',
	() => {
		return useDirectus(readItems('team', {}));
	},
	{
		transform: (data) => data,
	},
);

const allMembers = computed(() => unref(team) ?? []);

const splitMembers = computed(() => {
	const members = allMembers.value;
	const left: Team[] = [];
	const right: Team[] = [];

	members.forEach((member, i) => {
		if (i % 2 === 0) left.push(member);
		else right.push(member);
	});

	// Keep both columns populated when there are very few members.
	if (!left.length && right.length) left.push(...right);
	if (!right.length && left.length) right.push(...left);

	return {
		left,
		right,
	};
});

const MIN_ITEMS_PER_COLUMN = 12;

function buildLoopColumn(members: Team[]) {
	if (!members.length) return [];

	// Build enough slides so Embla can safely keep loop mode enabled.
	const repeatCount = Math.max(1, Math.ceil(MIN_ITEMS_PER_COLUMN / members.length));
	return Array.from({ length: repeatCount }, () => members).flat();
}

const teamToDisplay = computed(() => {
	const { left, right } = splitMembers.value;

	return {
		left: buildLoopColumn(left),
		right: buildLoopColumn(right),
	};
});

const leftCarousel = ref<{ emblaApi?: any } | null>(null);
const rightCarousel = ref<{ emblaApi?: any } | null>(null);

function keepCarouselAutoScrollAlive(carouselRef: Ref<{ emblaApi?: any } | null>) {
	return watch(
		() => carouselRef.value?.emblaApi,
		(api, _, onCleanup) => {
			if (!api) return;

			const play = () => api.plugins()?.autoScroll?.play?.();
			const wrapIfNeeded = () => {
				if (api.canScrollNext()) return;
				api.scrollTo(0, true);
			};
			const keepAlive = () => {
				wrapIfNeeded();
				play();
			};

			keepAlive();
			api.on('pointerUp', keepAlive);
			api.on('select', keepAlive);
			api.on('settle', keepAlive);
			api.on('slideFocus', keepAlive);
			api.on('reInit', keepAlive);

			onCleanup(() => {
				api.off('pointerUp', keepAlive);
				api.off('select', keepAlive);
				api.off('settle', keepAlive);
				api.off('slideFocus', keepAlive);
				api.off('reInit', keepAlive);
			});
		},
		{ immediate: true },
	);
}

let stopLeftAutoScrollWatcher: (() => void) | undefined;
let stopRightAutoScrollWatcher: (() => void) | undefined;

onMounted(() => {
	stopLeftAutoScrollWatcher = keepCarouselAutoScrollAlive(leftCarousel);
	stopRightAutoScrollWatcher = keepCarouselAutoScrollAlive(rightCarousel);
});

onBeforeUnmount(() => {
	stopLeftAutoScrollWatcher?.();
	stopRightAutoScrollWatcher?.();
});
</script>
<template>
	<section>
		<BlockContainer :background="background">
			<div class="flex flex-col mx-auto lg:flex-row">
				<!-- Text -->
				<div class="flex flex-col pr-4 lg:w-3/5">
					<TypographyTitle v-if="data.title" :data-directus="setAttr({ collection: 'block_team', item: data.id, fields: 'title', mode: 'popover' })">{{ data.title }}</TypographyTitle>
					<TypographyHeadline v-if="data.headline" :content="data.headline" size="lg" :data-directus="setAttr({ collection: 'block_team', item: data.id, fields: 'headline', mode: 'popover' })" />
					<TypographyProse v-if="data.content" :content="data.content" class="mt-4" :data-directus="setAttr({ collection: 'block_team', item: data.id, fields: 'content', mode: 'popover' })" />
				</div>

				<!-- Mobile: Single horizontal carousel -->
				<div class="relative w-full mt-8 border-y border-dashed border-primary/30 py-4 md:hidden">
					<UCarousel
						v-slot="{ item }"
						loop
						:contain-scroll="false"
						:auto-scroll="{ speed: 1, stopOnInteraction: false }"
						wheel-gestures
						:items="allMembers"
						:ui="{
							item: 'basis-3/5 ps-2',
							container: 'ms-0',
						}"
					>
						<TeamCard :person="item" />
					</UCarousel>
				</div>

				<!-- Desktop: Two vertical carousels -->
				<div class="relative w-full border-y border-dashed border-primary/30 h-[40rem] overflow-hidden hidden md:block lg:mt-0">
					<div class="absolute top-0 z-10 w-full h-16 bg-gradient-to-b from-default to-transparent pointer-events-none" />
					<div class="absolute bottom-0 z-10 w-full h-16 bg-gradient-to-t from-default to-transparent pointer-events-none" />

					<div class="relative grid grid-cols-2 gap-2 px-4 h-full">
						<!-- Left Column -->
						<UCarousel
							v-slot="{ item }"
							ref="leftCarousel"
							class="h-full"
							orientation="vertical"
							loop
							drag-free
							align="start"
							:contain-scroll="false"
							:auto-scroll="{
								speed: 1,
								playOnInit: true,
								stopOnInteraction: false,
								stopOnMouseEnter: false,
								stopOnFocusIn: false,
							}"
							wheel-gestures
							:items="teamToDisplay.left"
							:ui="{
								viewport: 'h-full',
								container: 'h-full',
								item: 'pt-4 basis-auto',
							}"
						>
							<TeamCard :person="item" />
						</UCarousel>

						<!-- Right Column -->
						<UCarousel
							v-slot="{ item }"
							ref="rightCarousel"
							class="h-full"
							orientation="vertical"
							loop
							drag-free
							align="start"
							:contain-scroll="false"
							:auto-scroll="{
								speed: 0.7,
								playOnInit: true,
								stopOnInteraction: false,
								stopOnMouseEnter: false,
								stopOnFocusIn: false,
							}"
							wheel-gestures
							:items="teamToDisplay.right"
							:ui="{
								viewport: 'h-full',
								container: 'h-full',
								item: 'pt-4 basis-auto',
							}"
						>
							<TeamCard :person="item" />
						</UCarousel>
					</div>
				</div>
			</div>
		</BlockContainer>
	</section>
</template>
