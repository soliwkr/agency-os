<script setup lang="ts">
import type { OsTask } from '~/types';

const { path } = useRoute();

const { data: projects, error } = await useAsyncData(
	path,
	() => {
		return useDirectus(
			readItems('os_projects', {
				fields: [
					'id',
					'name',
					'due_date',
					{
						tasks: ['id', 'name', 'status', 'due_date'],
					},
				],
				deep: {
					// @ts-ignore
					tasks: {
						_sort: ['due_date'],
						_filter: {
							type: {
								_eq: 'milestone',
							},
						},
					},
				},
			}),
		);
	},
	{},
);

if (error) {
	// console.log(error);
}

type TaskStatus = 'pending' | 'active' | 'in_progress' | 'in_review' | 'completed';

const taskStatuses = {
	pending: {
		label: 'Pending',
		icon: 'i-heroicons-clock-20-solid',
		color: 'neutral',
	},
	active: {
		label: 'Active',
		icon: 'i-heroicons-play-20-solid',
		color: 'blue',
	},
	in_progress: {
		label: 'In Progress',
		icon: 'i-heroicons-wrench-screwdriver-20-solid',
		color: 'amber',
	},
	in_review: {
		label: 'In Review',
		icon: 'i-heroicons-exclamation-circle-20-solid',
		color: 'orange',
	},
	completed: {
		label: 'Completed',
		icon: 'i-heroicons-check-20-solid',
		color: 'green',
	},
};

const columns = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'milestones',
		header: 'Status',
	},
	{
		accessorKey: 'due_date',
		header: 'Target Date',
	},
	{
		accessorKey: 'actions',
	},
];

const projectsShown = computed(() => {
	if (!projects.value) {
		return [];
	}

	return projects.value?.map((project) => {
		const tasks = project.tasks as OsTask[];

		return {
			id: project.id,
			name: project.name,
			due_date: project.due_date,
			tasks: tasks.map((task) => {
				return {
					isComplete: task.status === 'completed',
					isCurrent: task.status === 'active' || task.status === 'in_progress' || task.status === 'in_review',
					icon: 'i-heroicons-calendar',
					name: task.name,
					status: taskStatuses[(task.status as TaskStatus) ?? 'pending'].label,
				};
			}),
		};
	});
});
</script>
<template>
	<div>
		<PortalPageHeader
			title="Projects"
			:breadcrumbs="[
				{
					title: 'Portal',
					href: '/portal',
				},
				{
					title: 'Projects',
				},
			]"
		>
			<template #actions></template>
		</PortalPageHeader>
		<UCard class="mt-6">
			<!-- Filters -->
			<template #header>
				<div class="flex items-center justify-between">
					<!-- <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." /> -->
					<!-- <USelectMenu v-model="selectedStatus" :options="todoStatus" multiple placeholder="Status" class="w-40" /> -->
				</div>
			</template>
			<!-- Table -->
			<UTable :columns="columns" :data="projectsShown" >
				<template #name-cell="{ row }">
					<UButton variant="link" :to="`/portal/projects/${row.original.id}`" size="xl" :padded="false">
						{{ row.original.name }}
					</UButton>
				</template>
				<template #due_date-cell="{ row }">
					<VText size="xs">{{ getFriendlyDate(row.original.due_date) }}</VText>
					<VText size="xs" text-color="light">{{ getRelativeTime(row.original.due_date) }}</VText>
				</template>
				<template #milestones-cell="{ row }">
					<ul class="flex items-center">
						<template v-for="({ isComplete, isCurrent, icon }, i) in row.original.tasks" :key="i">
							<li :class="[i !== row.original.tasks.length - 1 ? '' : '', 'relative']">
								<div
									:class="{
										'border-primary border-dashed h-10 w-10 border-2': isCurrent && !isComplete,
										'bg-primary w-5 h-5': isComplete,
										'border-default border-2 w-5 h-5': !isCurrent && !isComplete,
									}"
									class="relative flex items-center justify-center flex-shrink-0 rounded-card"
								>
									<DirectusIcon v-if="isComplete" name="i-heroicons-check" class="w-4 text-inverted" />
									<DirectusIcon
										v-else-if="icon && isCurrent"
										:name="icon"
										class="fill-current"
										:class="{
											'text-primary w-5 h-5': isCurrent,
										}"
									/>
								</div>
							</li>
							<li v-if="i !== row.original.tasks.length - 1" class="w-3" aria-hidden="true">
								<div class="h-0.5 w-full" :class="[isComplete ? 'bg-primary' : 'bg-muted']" />
							</li>
						</template>
					</ul>
				</template>
				<template #actions-cell="{ row }">
					<UButton
						:to="`/portal/projects/${row.original.id}`"
						color="primary"
						variant="outline"
						icon="i-heroicons-arrow-right"
					/>
				</template>
			</UTable>
		</UCard>
	</div>
</template>
