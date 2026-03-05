<script setup lang="ts">
const props = defineProps({
	color: {
		type: String,
		default: null,
	},
	size: {
		type: String,
		default: 'sm',
	},
});

const slots = useSlots();

const colorChoices = [
	'gray',
	'green',
	'purple',
	'blue',
	'amber',
	'orange',
	'red',
	'indigo',
	'violet',
	'pink',
	'yellow',
];

function randomBackgroundColor(seed: number, colors: string[]) {
	return colors[seed % colors.length];
}

const badgeColor = computed(() => {
	if (props.color) return props.color;

	const defaultSlot = slots.default ? slots.default()[0] : undefined;

	if (!defaultSlot || !defaultSlot?.children) return null;

	return randomBackgroundColor(defaultSlot?.children.length as number, colorChoices);
});

const styleProp = computed(() => {
	if (!props.color) return undefined;
	return {
		backgroundColor: props.color,
		color: getContrastColor(props.color),
	};
});
</script>

<template>
	<span
		:style="styleProp"
		:class="[
			'inline-flex items-center font-display font-medium rounded-button',
			badgeColor === 'gray' ? `bg-elevated text-highlighted` : '',
			badgeColor === 'green' ? `bg-elevated text-success` : '',
			badgeColor === 'purple' ? `bg-secondary/10 text-secondary` : '',
			badgeColor === 'blue' ? `bg-elevated text-info` : '',
			badgeColor === 'amber' ? `bg-elevated text-warning` : '',
			badgeColor === 'orange' ? `bg-elevated text-warning` : '',
			badgeColor === 'red' ? `bg-elevated text-error` : '',
			badgeColor === 'indigo' ? `bg-secondary/10 text-secondary` : '',
			badgeColor === 'violet' ? `bg-secondary/10 text-secondary` : '',
			badgeColor === 'pink' ? `bg-primary/10 text-primary` : '',
			badgeColor === 'yellow' ? `bg-elevated text-warning` : '',
			size === 'sm' ? 'text-xs px-2 py-0.5' : '',
			size === 'lg' ? ' px-2.5 py-0.5' : '',

			{
				' bg-elevated text-highlighted': !props.color,
			},
		]"
	>
		<slot />
	</span>
</template>
