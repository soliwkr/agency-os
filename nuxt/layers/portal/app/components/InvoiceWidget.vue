<script setup lang="ts">
const {
	data: invoices,
	pending,
	error,
} = await useAsyncData(
	'organization-open-invoices',
	() => {
		return useDirectus(
			readItems('os_invoices', {
				fields: ['*'],
				filter: {
					_and: [
						{
							status: {
								_neq: 'open',
							},
						},
					],
				},
			}),
		);
	},
	{},
);

const totalAmountDue = computed(() => {
	return invoices.value?.reduce((acc, invoice) => {
		return acc + invoice.amount_due;
	}, 0);
});

const columns = [
	{
		accessorKey: 'invoice_number',
		header: '#',
	},
	{
		accessorKey: 'due_date',
		header: 'Due Date',
	},
	{
		accessorKey: 'amount_due',
		header: 'Amount Due',
	},
];
</script>
<template>
	<div class="w-full px-4 py-10 bg-default border border-default rounded-panel">
		<div>
			<dt class="font-medium leading-6 text-muted font-display">Open Invoices</dt>
			<dd class="flex-none w-full text-3xl font-medium leading-10 tracking-tight text-highlighted">
				{{ totalAmountDue ? formatCurrency(totalAmountDue) : 'N/A' }}
			</dd>
		</div>

		<UTable :columns="columns" :data="invoices as any">
			<template #invoice_number-cell="{ row }">
				<UButton variant="outline" :to="`/portal/billing/invoices/${row.original.id}`">{{ row.original.invoice_number }}</UButton>
			</template>
			<template #due_date-cell="{ row }">
				<p class="capitalize">{{ getFriendlyDate(row.original.due_date) }}</p>
			</template>
			<template #amount_due-cell="{ row }">
				<p class="capitalize">{{ formatCurrency(row.original.amount_due) }}</p>
			</template>
		</UTable>
	</div>
</template>
