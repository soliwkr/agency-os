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
		class="text-default hover:bg-muted transition duration-150 font-medium hover:text-highlighted py-2 px-3 inline-flex items-center font-display outline-none rounded-button"
		exact-active-class="bg-muted"
		:target="item.open_in_new_tab ? '_blank' : '_self'"
	>
		{{ item.title }}
	</NuxtLink>

	<UPopover v-else v-model:open="popoverOpen" class="relative" :ui="{ content: 'bg-default w-screen max-w-md p-4 border border-dashed border-primary/30 ring-0 shadow-none' }">
		<button class="text-default hover:bg-muted transition duration-150 font-medium hover:text-highlighted py-2 px-3 inline-flex items-center font-display outline-none rounded-button">
			{{ item.title }}
			<Icon name="heroicons:chevron-down" class="flex-none w-5 ml-1 text-muted" aria-hidden="true" />
		</button>

		<template #content>
			<NuxtLink
				v-for="childItem in item.children as NavigationItem[]"
				:key="childItem.id"
				:href="getNavItemUrl(childItem) as RouteLocationRaw"
				class="relative flex p-4 leading-6 transition duration-150 group gap-x-6 hover:bg-muted"
			>
				<div class="relative flex-none mt-1 h-10 w-10 corner-marks-inset">
					<span class="absolute inset-0 corner-marks-inset-alt" />
					<div class="flex items-center justify-center h-full w-full">
						<Icon
							v-if="childItem.icon"
							:name="convertIconName(childItem.icon) as string"
							class="w-6 h-6 text-primary"
						/>
					</div>
				</div>
				<div class="">
					<p class="block font-medium text-highlighted font-display">
						{{ childItem.title }}
					</p>
					<p v-if="childItem.label" class="mt-1 text-sm leading-tight text-muted">
						{{ childItem.label }}
					</p>
				</div>
			</NuxtLink>
		</template>
	</UPopover>
</template>

