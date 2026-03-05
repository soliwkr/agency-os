<script setup lang="ts">
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
