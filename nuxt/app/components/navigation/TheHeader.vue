<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core';

const { globals } = useAppConfig();
const navigation = computed(() => globals?.header_navigation ?? []);

const { y } = useWindowScroll();
const isScrolled = computed(() => y.value > 50);
</script>
<template>
  <header
    class="w-full mx-auto transition-all duration-300"
    :class="isScrolled ? 'max-w-4xl px-4 py-0' : 'max-w-6xl lg:px-10 py-4'"
  >
    <div
      class="flex items-center justify-between py-2 px-6 border transition-all duration-300"
      :class="
        isScrolled
          ? 'bg-default border-primary/30 rounded-b-card rounded-t-none border-t-0 py-4'
          : 'border-transparent rounded-card'
      "
    >
      <NuxtLink href="/" class="py-2">
        <Logo class="h-6 text-highlighted" />
        <span v-if="globals?.title" class="sr-only">{{ globals.title }}</span>
      </NuxtLink>
      <nav class="hidden md:flex md:space-x-4 lg:space-x-6" aria-label="Global">
        <NavigationMenuItem v-for="item in navigation" :key="item.id" :item="item" />
      </nav>
      <div class="flex items-center justify-end shrink-0 space-x-2">
        <DarkModeToggle class="hidden text-muted md:flex items-center hover:text-highlighted" />
        <div class="hidden gap-2 md:flex">
          <UButton to="/portal" color="primary" variant="ghost" size="xl">Login</UButton>
          <UButton to="/contact-us" color="primary" size="xl">Let's Talk</UButton>
        </div>
      </div>
    </div>
    <NavigationMobileMenu v-if="navigation.length" :items="navigation" />
  </header>
</template>
