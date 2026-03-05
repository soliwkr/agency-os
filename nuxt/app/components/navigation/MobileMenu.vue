<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const route = useRoute();
const { globals } = useAppConfig();

const isOpen = ref(false);
const subMenuOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
  subMenuOpen.value = false;
};

// Watch route changes and close the menu
watch(
  () => route.path,
  (newVal, oldVal) => {
    isOpen.value = false;
  },
);

// Disbale scrolling when the menu is open
watch(
  () => isOpen.value,
  (newVal, oldVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  },
);
</script>
<template>
  <div class="md:hidden">
    <!-- Menu -->
    <Motionable
      as="div"
      :show="isOpen"
      :initial="{ opacity: 0, y: 400, scale: 0.9 }"
      :animate="{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.3,
        },
      }"
      :exit="{
        opacity: 0,
        y: 400,
        scale: 0.9,
        transition: {
          duration: 0.3,
        },
      }"
      class="fixed inset-0 z-50 flex flex-col w-full h-full bg-muted"
    >
      <div class="relative w-full px-6 pt-6 flex justify-between border-b border-default items-start">
        <div>
          <NuxtLink href="/">
            <Logo class="h-6 text-highlighted" />
          </NuxtLink>
          <VText v-if="globals?.tagline" class="pb-4 mt-2">
            {{ globals.tagline }}
          </VText>
        </div>
        <DarkModeToggle class="shrink-0" />
      </div>
      <div class="flex flex-col justify-center h-full px-6 space-y-4">
        <NavigationMobileMenuItem v-for="item in items" :key="item.id" :item="item" @close="toggle" />

        <UButton href="/contact-us" variant="solid" size="xl" class="font-display">Let's Talk</UButton>
      </div>
    </Motionable>
    <!-- Button -->
    <button
      class="fixed z-50 size-14 flex items-center justify-center text-inverted transition duration-300 shadow-md md:hidden bottom-4 right-4 bg-primary hover:bg-opacity-75 rounded-button"
      @click="toggle"
    >
      <span class="sr-only">{{ isOpen ? 'Close menu' : 'Open menu' }}</span>
      <Icon v-if="!isOpen" name="heroicons:bars-3" class="size-6" />
      <Icon v-if="isOpen" name="heroicons:x-mark" class="size-6" />
    </button>
  </div>
</template>
