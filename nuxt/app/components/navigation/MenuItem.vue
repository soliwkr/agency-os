<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router';
import type { NavigationItem } from '~/types';

const route = useRoute();

const props = defineProps<{
	item: NavigationItem;
}>();

const popoverOpen = ref(false);

// If route changes close the menu
watch(
	() => route.path,
	() => {
		popoverOpen.value = false;
	},
);
</script>
<template>
	<NuxtLink
		v-if="!item.has_children"
		:href="getNavItemUrl(item) as RouteLocationRaw"
		class="text-inverted hover:bg-inverted/10 transition duration-150 font-medium hover:text-inverted py-2 px-3 inline-flex items-center font-display outline-none rounded-button"
		exact-active-class="bg-inverted/10"
		:target="item.open_in_new_tab ? '_blank' : '_self'"
	>
		{{ item.title }}
	</NuxtLink>

	<UPopover v-else v-model:open="popoverOpen" class="relative">
		<button class="text-inverted hover:bg-inverted/10 transition duration-150 font-medium hover:text-inverted py-2 px-3 inline-flex items-center font-display outline-none rounded-button">
			{{ item.title }}
			<Icon name="heroicons:chevron-down" class="flex-none w-5 ml-1 text-inverted/50" aria-hidden="true" />
		</button>

		<template #content>
			<div
				class="w-screen max-w-md overflow-hidden bg-inverted shadow-lg rounded-panel"
			>
				<div class="p-4">
					<NuxtLink
						v-for="childItem in item.children as NavigationItem[]"
						:key="childItem.id"
						:href="getNavItemUrl(childItem) as RouteLocationRaw"
						class="relative flex p-4 leading-6 transition duration-150 rounded-panel group gap-x-6 hover:bg-inverted/10"
					>
						<div
							class="flex items-center justify-center flex-none p-2 mt-1 border rounded-button h-11 w-11 border-primary"
						>
							<Icon
								v-if="childItem.icon"
								:name="convertIconName(childItem.icon) as string"
								class="w-10 h-10 text-primary"
							/>
						</div>
						<div class="">
							<p class="block font-medium text-inverted font-display">
								{{ childItem.title }}
							</p>
							<p v-if="childItem.label" class="mt-1 text-sm leading-tight text-inverted/50">
								{{ childItem.label }}
							</p>
						</div>
					</NuxtLink>
				</div>
			</div>
		</template>
	</UPopover>
</template>

