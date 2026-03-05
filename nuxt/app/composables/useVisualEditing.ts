import { apply as applyVisualEditing, setAttr } from '@directus/visual-editing';

interface ApplyOptions {
	elements?: HTMLElement[] | HTMLElement;
	onSaved?: (data: { collection?: string; item?: string | number | null; payload?: Record<string, any> }) => void;
	customClass?: string;
}

export default function useVisualEditing() {
	const isVisualEditingEnabled = useState('visual-editing-enabled', () => false);
	const route = useRoute();
	const {
		public: { enableVisualEditing, directusUrl },
	} = useRuntimeConfig();

	if (route.query['visual-editing'] === 'true' && enableVisualEditing) {
		isVisualEditingEnabled.value = true;
	} else if (route.query['visual-editing'] === 'false') {
		isVisualEditingEnabled.value = false;
	}

	const apply = (options: ApplyOptions) => {
		if (!isVisualEditingEnabled.value) return;
		applyVisualEditing({
			...options,
			directusUrl,
		});
	};

	return {
		isVisualEditingEnabled,
		apply,
		setAttr,
	};
}
