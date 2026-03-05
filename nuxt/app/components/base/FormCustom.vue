<script setup lang="ts">
import type { Form as FormType } from '~/types';
import VUpload from '~/components/base/VUpload.vue';
import VSignature from '~/components/base/VSignature.vue';

const widthClassMap: Record<string, string> = {
	'33': 'md:col-span-2',
	'50': 'md:col-span-3',
	'67': 'md:col-span-4',
	'100': 'md:col-span-6',
};

const props = defineProps<{
	schema?: FormType['schema'];
	state?: Record<string, any>;
	validate?: Function;
	onSubmit?: Function;
}>();
</script>
<template>
	<UForm :state="state" :validate="validate">
		<template v-for="(item, idx) in schema" :key="idx">
			<UFormField
				:name="(item as any).name"
				:label="(item as any).label"
				:description="(item as any).description"
				:class="widthClassMap[(item as any).width] || 'md:col-span-6'"
				size="lg"
				:ui="{ label: 'font-mono uppercase tracking-wider text-xs' }"
			>
				<UTextarea
					v-if="(item as any).type === 'textarea'"
					class="w-full"
					:model-value="state?.[(item as any).name]"
					:placeholder="(item as any).placeholder"
					@update:model-value="(v: any) => { if (state) state[(item as any).name] = v }"
				/>
				<VUpload
					v-else-if="(item as any).type === 'file'"
					:model-value="state?.[(item as any).name]"
					:placeholder="(item as any).placeholder"
					@update:model-value="(v: any) => { if (state) state[(item as any).name] = v }"
				/>
				<VSignature
					v-else-if="(item as any).type === 'signature'"
					:model-value="state?.[(item as any).name]"
					:placeholder="(item as any).placeholder"
					@update:model-value="(v: any) => { if (state) state[(item as any).name] = v }"
				/>
				<UCheckbox
					v-else-if="(item as any).type === 'checkbox'"
					:model-value="state?.[(item as any).name]"
					@update:model-value="(v: any) => { if (state) state[(item as any).name] = v }"
				/>
				<UInput
					v-else
					class="w-full"
					:model-value="state?.[(item as any).name]"
					:placeholder="(item as any).placeholder"
					:type="(item as any).type"
					@update:model-value="(v: any) => { if (state) state[(item as any).name] = v }"
				/>
			</UFormField>
		</template>
		<div class="md:col-span-6">
			<UButton
				type="submit"
				size="lg"
				color="primary"
				variant="solid"
				label="Submit"
				class="font-mono uppercase tracking-wider"
				block
				@click.prevent="onSubmit?.()"
			/>
		</div>
	</UForm>
</template>
