<script setup lang="ts">
import { borderRadiusMap } from '~/theme';

const { globals } = useAppConfig();
const { fileUrl } = useFiles();

// JSON-LD
useSchemaOrg([
	defineOrganization({
		name: globals?.title ?? 'AgencyOS',
		logo: globals?.logo ? fileUrl(globals?.logo as string) : '/logos/agencyos.png',
		sameAs: () => {
			const socialLinks = globals?.social_links ?? [];
			return socialLinks.map((link) => link.url);
		},
	}),
]);

const borderRadius = globals?.border_radius ?? 'lg';
const radiusValues = borderRadiusMap[borderRadius] ?? borderRadiusMap.lg;

useHead({
	style: [
		{
			id: 'theme-vars',
			innerHTML: `:root {
--ui-radius: ${radiusValues.button};
${Object.entries(radiusValues)
				.map(([key, value]) => `--border-radius-${key}: ${value};`)
				.join('\n')}
--font-display: ${globals?.font_display ?? 'Source Serif 4'};
--font-sans: ${globals?.font_body ?? 'Geist'};
--font-code: ${globals?.font_monospace ?? 'Fira Code'};
--font-signature: Nothing You Could Do;}`,
		},
	],
});
</script>
<template>
	<UApp>
		<NuxtLayout>
			<NuxtLoadingIndicator
				color="repeating-linear-gradient(to right,#FF99DD
      0%,#94a3b8 100%)"
			/>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
