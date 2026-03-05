<script setup>
definePageMeta({
	layout: 'blank',
	middleware: ['auth'],
});

const { logout, user } = useDirectusAuth();

const NuxtLink = resolveComponent('NuxtLink');

function useCommandPalette() {
	const showCommandPalette = ref(false);

	defineShortcuts({
		meta_k: {
			usingInput: true,
			handler: () => {
				showCommandPalette.value = !showCommandPalette.value;
			},
		},
	});

	return {
		showCommandPalette,
	};
}

const sidebarNavigation = {
	top: [
		{ name: 'Search', onClick: () => (showCommandPalette.value = true), icon: 'material-symbols:search-rounded' },
		{ name: 'Dashboard', href: '/portal', icon: 'material-symbols:home-outline-rounded' },
		{ name: 'Projects', href: '/portal/projects', icon: 'material-symbols:tab-group-outline-rounded' },
		{ name: 'Files', href: '/portal/files', icon: 'material-symbols:folder-outline-rounded' },
		{ name: 'Billing', href: '/portal/billing', icon: 'material-symbols:attach-money-rounded' },
		{ name: 'Account', href: '/portal/account', icon: 'material-symbols:account-circle-outline' },
	],
	bottom: [],
};

const userNavigation = [
	[
		{
			label: 'Your Profile',
			icon: 'i-heroicons-user-circle',
			onClick: () => {
				navigateTo('/portal/account#profile');
			},
		},
		{ label: 'Sign out', icon: 'i-heroicons-arrow-left-on-rectangle', onClick: () => logout() },
	],
];

const { showCommandPalette } = useCommandPalette();
const mobileMenuOpen = ref(false);
</script>

<template>
	<div class="flex h-full transition duration-150 bg-muted">
		<div class="hidden p-3 md:block">
			<!-- Narrow sidebar -->
			<div class="w-24 h-full bg-inverted rounded-panel">
				<div class="flex flex-col items-center w-full h-full py-6">
					<div class="flex items-center flex-shrink-0">
						<Logo class="w-20 text-inverted" alt="Your Company" />
					</div>
					<div class="flex flex-col justify-between flex-1 h-full gap-y-4">
						<div class="w-full px-2 mt-6 space-y-1">
							<component
								:is="item.href ? NuxtLink : 'button'"
								v-for="item in sidebarNavigation.top"
								:key="item.name"
								:href="item.href ?? undefined"
								:class="[
									item.current ? 'bg-accented text-inverted' : 'text-inverted/80 hover:bg-accented hover:text-inverted',
									'group flex w-full flex-col items-center rounded-card py-3 px-2 text-xs font-bold ',
								]"
								:aria-current="item.current ? 'page' : undefined"
								@click="item.onClick ? item.onClick() : undefined"
							>
								<DirectusIcon
									:name="item.icon"
									:class="[item.current ? 'text-inverted' : 'text-inverted/70 group-hover:text-inverted', 'h-6 w-6']"
									aria-hidden="true"
								/>
								<span class="mt-2">{{ item.name }}</span>
							</component>
						</div>
						<div class="flex flex-col items-center justify-center w-full px-2 space-y-2">
							<NuxtLink
								v-for="item in sidebarNavigation.bottom"
								:key="item.name"
								:href="item.href"
								:class="[
									item.current ? 'bg-accented text-inverted' : 'text-inverted/80 hover:bg-accented hover:text-inverted',
									'group flex w-full flex-col items-center rounded-card py-3 px-2 text-xs font-bold ',
								]"
								:aria-current="item.current ? 'page' : undefined"
							>
								<DirectusIcon
									:name="item.icon"
									:class="[item.current ? 'text-inverted' : 'text-inverted/70 group-hover:text-inverted', 'h-6 w-6']"
									aria-hidden="true"
								/>
								<span class="mt-2">{{ item.name }}</span>
							</NuxtLink>
							<DarkModeToggle bg="dark" class="" />
							<!-- Profile dropdown -->
							<UDropdownMenu class="relative" :items="userNavigation">
								<button>
									<span class="sr-only">Open user menu</span>
									<UAvatar class="w-12 h-12 mx-auto" :src="user?.avatar" :alt="user ? userName(user) : ''" />
								</button>
							</UDropdownMenu>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile menu -->
		<USlideover v-model:open="mobileMenuOpen" side="left" class="md:hidden">
			<template #content>
				<div class="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-inverted h-full">
					<div class="flex items-center flex-shrink-0 px-4">
						<Logo class="w-auto h-8" alt="Your Company" />
					</div>
					<div class="flex-1 h-0 px-2 mt-5 overflow-y-auto">
						<nav class="flex flex-col h-full">
							<div class="space-y-1">
								<NuxtLink
									v-for="item in sidebarNavigation.top"
									:key="item.name"
									:href="item.href"
									:class="[
										item.current ? 'bg-accented text-inverted' : 'text-inverted/80 hover:bg-accented hover:text-inverted',
										'group flex items-center rounded-md py-2 px-3 text-sm font-medium ',
									]"
									:aria-current="item.current ? 'page' : undefined"
								>
									<DirectusIcon
										:name="item.icon"
										:class="[item.current ? 'text-inverted' : 'text-inverted/70 group-hover:text-inverted', 'mr-3 h-6 w-6']"
										aria-hidden="true"
									/>
									<span>{{ item.name }}</span>
								</NuxtLink>
							</div>
						</nav>
					</div>
				</div>
			</template>
		</USlideover>

		<!-- Content area -->
		<div class="flex flex-col flex-1 overflow-y-auto">
			<NuxtErrorBoundary>
				<template #error="{ error, clearError }">
					<UAlert color="error" variant="outline" :description="String(error)" />
					<button class="mt-4 text-sm text-muted underline" @click="clearError">Try again</button>
					<p>An error occurred: {{ error }}</p>
				</template>
				<div class="w-full max-w-5xl p-4 mx-auto">
					<NuxtPage />
				</div>
			</NuxtErrorBoundary>
		</div>

		<!-- Meta layer -->
		<UModal v-model:open="showCommandPalette">
			<template #content>
				<PortalSearch @close="showCommandPalette = false" />
			</template>
		</UModal>
	</div>
</template>

<style>
html {
	@apply h-full;
}
body {
	@apply h-full antialiased;
}
#__nuxt {
	@apply h-full;
}
</style>
