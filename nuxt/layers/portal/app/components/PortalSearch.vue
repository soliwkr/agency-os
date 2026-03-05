<script setup lang="ts">
import type { GlobalSearchResult } from '~/types/api/global-search';

const props = defineProps({
	placeholder: {
		type: String,
		default: 'Search items',
	},
});

const emit = defineEmits(['close']);

// Pass the cookies to the server call so we can authenticate the request
const headers = useRequestHeaders(['cookie']);

const actions = [
	{
		id: 'projects',
		label: 'Go to Projects',
		onClick: () => navigateTo('/portal/projects'),
	},
	{
		id: 'files',
		label: 'Go to Files',
		onClick: () => navigateTo('/portal/files'),
	},
	{
		id: 'invoices',
		label: 'Go to Invoices',
		onClick: () => navigateTo('/portal/billing/invoices'),
	},
	{
		id: 'acccount',
		label: 'Go to My Account',
		onClick: () => navigateTo('/portal/account'),
	},
];

const groups = computed(() => {
	return [
		{
			key: 'search',
			label: (q: string) => q && `Results matching “${q}”...`,

			search: async (q: string) => {
				loading.value = true;

				if (!q || q.length < 3) {
					loading.value = false;
					return [];
				}

				try {
					const { data }: { data: GlobalSearchResult[] } = await $fetch('/api/portal/search', {
						params: {
							search: q,
							collections: ['os_projects', 'os_tasks', 'os_invoices'],
						},
						headers,
					});

					return data.map((hit) => {
						return {
							id: hit.id,
							label: hit.title,
							href: hit.url,
							suffix: hit.type,
						};
					});
				} catch (error) {
					// console.log(error);
				} finally {
					loading.value = false;
				}
			},
		},
		{
			key: 'actions',
			commands: actions,
		},
	].filter(Boolean);
});

function onSelect(option: any) {
	if (option.onClick) {
		option.onClick();
	} else if (option.to) {
		navigateTo(option.to);
	} else if (option.href) {
		navigateTo(option.href);
	}

	emit('close');
}

const commandPaletteRef = ref(null);
const query = ref('');
const results = ref([]);
const selected = ref(null);
const loading = ref(false);

const ui = {
	wrapper: 'flex flex-col flex-1 min-h-0 bg-muted',
	input: {
		wrapper: 'relative flex items-center mx-3 py-3',
		base: 'w-full rounded border-2 border-primary placeholder:text-dimmed focus:border-primary focus:outline-none focus:ring-0 bg-default',
		padding: 'px-4',
		height: 'h-14',
		size: 'text-lg',
		icon: {
			base: 'pointer-events-none absolute left-3 text-primary',
			size: 'h-6 w-6',
		},
	},
	group: {
		wrapper: 'p-3 relative',
		label:
			'-mx-3 px-3 -mt-4 mb-2 py-1 text-sm font-semibold text-primary font-semibold sticky top-0 bg-muted z-10',
		container: 'space-y-1',
		command: {
			base: 'flex justify-between select-none items-center rounded px-2 py-4 gap-2 relative font-medium text-sm group shadow',
			active: 'bg-primary text-inverted',
			inactive: 'bg-default',
			label: 'flex min-w-0 justify-between',
			suffix: 'text-xs',
			icon: {
				base: 'flex-shrink-0 w-6 h-6',
				active: 'text-inverted',
				inactive: 'text-dimmed',
			},
		},
	},
	emptyState: {
		wrapper: 'flex flex-col items-center justify-center flex-1 py-9',
		label: 'text-sm text-center text-muted',
		queryLabel: 'text-lg text-center text-highlighted',
		icon: 'w-12 h-12 mx-auto text-dimmed mb-4',
	},
};
</script>
<template>
	<div>
		<UCommandPalette
			ref="commandPaletteRef"
			:loading="loading"
			:groups="groups"
			:ui="ui"
			@update:model-value="onSelect"
		/>
	</div>
</template>
