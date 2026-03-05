import { theme } from '~/theme';

export default defineAppConfig({
	theme,
	ui: {
		colors: {
			primary: theme.primary,
			neutral: theme.neutral,
		},
	},
});
