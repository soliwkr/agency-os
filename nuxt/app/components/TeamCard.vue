<script setup lang="ts">
import type { Team } from '~/types';

defineProps<{
	person: Team;
}>();

const flipped = ref(false);
</script>
<template>
	<div class="cursor-pointer select-none" @click="flipped = !flipped">
		<div class="relative w-full aspect-square overflow-hidden group border border-dashed border-primary/30 rounded-card corner-marks-inset">
			<!-- Front of Team Card -->
			<NuxtImg
				v-if="person.image"
				width="400"
				height="400"
				class="object-cover w-full h-full transition duration-300 grayscale group-hover:grayscale-0"
				:src="person.image as string"
				:alt="person.name ?? ''"
			/>
			<!-- Back of Team Card -->
			<Motionable
				:show="flipped"
				class="absolute inset-0 p-2 -m-2 overflow-hidden bg-primary/80 backdrop-blur-sm"
				:initial="{
					opacity: 0,
					y: 25,
					x: 200,
					scale: 0.9,
				}"
				:animate="{
					opacity: 1,
					scale: 1,
					x: 0,
					y: 0,
				}"
				:exit="{
					opacity: 0,
					scale: 0.9,
					x: 200,
					y: 25,
				}"
			>
				<div class="relative p-4 space-y-2">
					<p class="font-mono tracking-wider uppercase text-sm">Links</p>
					<NuxtLink
						v-for="link in person.social_media"
						:key="link?.service"
						class="inline-flex w-full border border-dashed border-inverted/50 hover:border-inverted hover:text-inverted"
						:href="link?.url"
						target="_blank"
					>
						<div class="flex items-center justify-center flex-none w-14">
							<Icon class="w-8 h-8" :name="`uil:${link?.service}`" />
						</div>
						<p
							class="flex flex-col justify-center py-2 pb-1 pl-3 pr-2 overflow-hidden font-mono text-sm font-semibold leading-none tracking-tight uppercase truncate md:py-3"
						>
							{{ link?.service }}
						</p>
					</NuxtLink>
				</div>
			</Motionable>

			<div class="absolute z-10 bottom-4 left-7 right-7">
				<TypographyHeadline v-if="person.name" :content="person.name" size="sm" class="text-inverted drop-shadow">
					{{ person?.name }}
				</TypographyHeadline>
				<p v-if="person.job_title" class="font-mono text-xs uppercase tracking-widest text-primary mt-1">
					{{ person?.job_title }}
				</p>
			</div>

			<div class="absolute bottom-0 left-0 right-0 h-1/3 opacity-80 bg-gradient-to-b from-transparent to-inverted"></div>
		</div>
	</div>
</template>
