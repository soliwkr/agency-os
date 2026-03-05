<script setup lang="ts">
import type { BackgroundType } from '~/types';

interface BlockContainerProps {
	fullWidth?: boolean;
	background?: BackgroundType;
}

const props = withDefaults(defineProps<BlockContainerProps>(), {
	fullWidth: false,
	background: 'default',
});

const backgroundClassMap: Record<BackgroundType, string> = {
	default: 'bg-default',
	muted: 'bg-muted',
	elevated: 'bg-elevated',
	accented: 'bg-accented',
	inverted: 'bg-inverted',
	primary: 'bg-primary',
};

const darkBackgrounds: BackgroundType[] = ['accented', 'inverted', 'primary'];

const hasBackground = computed(() => props.background && props.background !== 'default');
const theme = computed(() => darkBackgrounds.includes(props.background) ? 'dark' : 'light');
const backgroundClass = computed(() => backgroundClassMap[props.background]);

provide('blockTheme', theme);
</script>
<template>
	<section
		:class="[
			'py-8 lg:py-24',
			backgroundClass,
			theme === 'dark' ? 'text-inverted' : '',
		]"
	>
		<div
			:class="[
				'mx-auto',
				!fullWidth ? 'px-6 lg:px-16 max-w-6xl' : '',
			]"
		>
			<slot :theme="theme" />
		</div>
	</section>
</template>
