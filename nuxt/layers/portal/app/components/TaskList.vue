<script setup lang="ts">
export interface TaskListProps {
	projectId: string;
}

const props = defineProps<TaskListProps>();

const {
	data: tasks,
	pending,
	error,
} = await useAsyncData(`${props.projectId}-tasks`, () => {
	return useDirectus(
		readItems('os_tasks', {
			fields: [
				'*',
				{
					assigned_to: ['id', 'first_name', 'last_name', 'email', 'avatar'],
				},
			],
			filter: {
				_and: [
					{
						project: {
							_eq: props.projectId,
						},
					},

					{
						is_visible_to_client: {
							_eq: true,
						},
					},
					{
						type: {
							_neq: 'milestone',
						},
					},
				],
			},
		}),
	);
});

const columns = [
	{
		accessorKey: 'name',
		header: 'Name',

	},
	{
		accessorKey: 'due_date',
		header: 'Due Date',

	},
	{
		accessorKey: 'status',
		header: 'Status',

	},
	{
		accessorKey: 'type',
		header: 'Type',

	},
	{
		accessorKey: 'assigned_to',
		header: 'Assigned To',

	},

	{
		accessorKey: 'actions',
	},
];

const showTask = ref(false);
const selectedTaskId: Ref<string | null> = ref(null);

async function openTask(id: string) {
	selectedTaskId.value = id;
	showTask.value = true;
}

const searchQuery = ref();

const tasksShown = computed(() => {
	// Filter out tasks with a type of "milestone" and use search query to filter tasks

	const items = unref(tasks)
		?.filter((task) => task.type !== 'milestone')
		.filter((task) => {
			if (!searchQuery.value) return true;
			return task.name.toLowerCase().includes(searchQuery?.value?.toLowerCase());
		});

	return items;
});
</script>
<template>
	<!-- Filters -->
	<div class="flex items-center justify-between gap-3 pb-3 border-b border-default">
		<UInput v-model="searchQuery" type="text" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
	</div>
	<!-- Table -->
	<UTable :columns="columns" :data="tasksShown">
		<template #name-cell="{ row }">
			<UButton variant="link" :padded="false" @click="openTask(row.original.id)">{{ row.original.name }}</UButton>
		</template>
		<template #due_date-cell="{ row }">
			<p class="font-medium text-highlighted">
				{{
					getFriendlyDate(row.original.due_date, {
						monthAbbr: true,
					})
				}}
			</p>
			<p class="text-xs capitalize">{{ getRelativeTime(row.original.due_date) }}</p>
		</template>
		<template #type-cell="{ row }">
			<UBadge class="capitalize" variant="subtle">{{ row.original.type }}</UBadge>
		</template>
		<template #assigned_to-cell="{ row }">
			<UserBadge v-if="row.original.assigned_to" :user="row.original.assigned_to" size="sm" />
		</template>
		<template #actions-cell="{ row }">
			<UButton icon="i-heroicons-arrow-right" color="primary" size="sm" variant="outline" @click="openTask(row.original.id)" />
		</template>
	</UTable>
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
</template>
