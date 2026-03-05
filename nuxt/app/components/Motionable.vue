<script setup lang="ts">
import { AnimatePresence } from 'motion-v';

interface MotionableProps {
	as?: string | object;
	show?: boolean;
	initial?: Record<string, any>;
	animate?: Record<string, any>;
	exit?: Record<string, any>;
}

withDefaults(defineProps<MotionableProps>(), {
	as: 'div',
	show: true,
});
</script>
<template>
	<AnimatePresence>
		<component
			:is="as"
			v-if="show"
			v-motion
			:initial="initial"
			:animate="animate"
			:exit="exit"
		>
			<slot />
		</component>
	</AnimatePresence>
</template>
