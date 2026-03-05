<script setup lang="ts">
const page = ref(1);
const rowsPerPage = ref(5);

const { data, pending, error, refresh } = await useAsyncData(
	'user-open-tasks',
	() => {
		const filter = {
			_and: [
				{
					status: {
						_neq: 'open',
					},
				},
				{
					is_visible_to_client: {
						_eq: true,
					},
				},
			],
		};

		const tasks = useDirectus(
			readItems('os_tasks', {
				fields: ['id', 'name', 'due_date'],
				sort: ['due_date'],
				filter,
				limit: unref(rowsPerPage),
				offset: (unref(page) - 1) * 5,
			}),
		);

		const count = useDirectus(
			readItems('os_tasks', {
				filter,
				aggregate: { count: ['*'] },
			}),
		);

		return Promise.all([tasks, count]);
	},
	{
		transform: ([data, count]) => {
			return {
				tasks: data,
				count: parseInt(count[0].count) ?? 0,
			};
		},
	},
);

const columns = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'due_date',
		header: 'Due Date',
	},
];

const tasks = computed(() => {
	return data.value?.tasks ?? [];
});

const count = computed(() => {
	return data.value?.count ?? 0;
});

watch(page, () => {
	refresh();
});

const showTask = ref(false);
const selectedTaskId: Ref<string | null> = ref(null);

async function openTask(id: string) {
	selectedTaskId.value = id;
	showTask.value = true;
}
</script>
<template>
	<div class="px-4 py-10 bg-default border border-default rounded-panel">
		<div>
			<dt class="font-medium leading-6 text-muted font-display">Open Tasks</dt>
			<dd class="flex-none w-full text-3xl font-medium leading-10 tracking-tight text-highlighted">
				{{ count }} tasks
			</dd>
		</div>

		<UTable :columns="columns" :data="tasks">
			<template #name-cell="{ row }">
				<UButton variant="link" class="max-w-[250px]" :padded="false" @click="openTask(row.original.id)">
					<span class="truncate">{{ row.original.name ?? 'Task with no name' }}</span>
				</UButton>
			</template>
			<template #due_date-cell="{ row }">
				<p class="capitalize">{{ getRelativeTime(row.original.due_date) }}</p>
			</template>
		</UTable>
		<UPagination v-model="page" :max="5" :page-count="rowsPerPage" :total="count" />
		<!-- Task Item -->
		<USlideover
			v-model:open="showTask"
			:ui="{
				width: 'max-w-xl',
			}"
		>
			<template #content>
				<PortalTask v-if="selectedTaskId" :task-id="selectedTaskId" class="overflow-y-auto" @close="showTask = false" />
			</template>
		</USlideover>
	</div>
</template>
