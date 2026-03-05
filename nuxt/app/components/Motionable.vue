<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';

defineOptions({ inheritAttrs: false });

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

const attrs = useAttrs();
</script>
<template>
	<AnimatePresence>
		<motion.div
			v-if="show"
			v-bind="attrs"
			:initial="initial"
			:animate="animate"
			:exit="exit"
		>
			<slot />
		</motion.div>
	</AnimatePresence>
</template>
