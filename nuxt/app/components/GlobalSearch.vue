<script setup lang="ts">
import type { GlobalSearchResult } from '~/types/api/global-search';

const props = defineProps({
	collections: {
		type: Array as PropType<string[]>,
		required: true,
		validator: (value: string[]) => {
			return value.every((collection) => {
				return ['posts', 'pages', 'categories', 'projects'].includes(collection);
			});
		},
	},
	placeholder: {
		type: String,
		default: 'Search items',
	},
});

defineShortcuts({
	meta_k: {
		usingInput: true,
		handler: () => {
			isOpen.value = !isOpen.value;
		},
	},
});

const isOpen = ref(false);
const searchTerm = ref('');
const loading = ref(false);
const searchResults = ref<any[]>([]);

const { fileUrl } = useFiles();

watch(searchTerm, async (q) => {
	if (!q || q.length < 3) {
		searchResults.value = [];
		loading.value = false;
		return;
	}

	loading.value = true;

	try {
		const { data }: { data: GlobalSearchResult[] } = await $fetch('/api/search', {
			params: {
				search: q,
				collections: props.collections,
			},
		});

		searchResults.value = data.map((hit: any) => ({
			id: hit.id,
			label: hit.title,
			to: hit.url,
			avatar: { src: fileUrl(hit.image) },
			suffix: hit.type,
		}));
	} catch (error) {
		searchResults.value = [];
	} finally {
		loading.value = false;
	}
});

const groups = computed(() => [
	{
		id: 'search',
		label: searchTerm.value ? `Results matching "${searchTerm.value}"...` : 'Search',
		items: searchResults.value,
		ignoreFilter: true,
	},
]);

function onModalUpdate(val: boolean) {
	isOpen.value = val;
}

function onSearchTermUpdate(val: string) {
	searchTerm.value = val;
}

function openSearch() {
	isOpen.value = true;
}

function onSelect(item: any) {
	if (item.to) {
		isOpen.value = false;
		navigateTo(item.to);
	}
}
</script>
<template>
	<div>
		<UButton
			icon="material-symbols:search-rounded"
			color="neutral"
			variant="outline"
			size="lg"
			@click="openSearch"
		>
			Search
			<div class="flex items-center gap-0.5">
				<UKbd>&#8984;</UKbd>
				<UKbd>K</UKbd>
			</div>
		</UButton>
		<UModal
			:open="isOpen"
			@update:open="onModalUpdate"
		>
			<template #content>
				<UCommandPalette
					:search-term="searchTerm"
					:loading="loading"
					:groups="groups"
					:placeholder="placeholder"
					class="h-80"
					@update:search-term="onSearchTermUpdate"
					@update:model-value="onSelect"
				/>
			</template>
		</UModal>
	</div>
</template>
