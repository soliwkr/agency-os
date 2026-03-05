<script setup lang="ts">
interface HeaderProps {
  title: string;
  organization: string;
}

defineProps<HeaderProps>();

const { showSidebar, toggleSidebar } = useProposals();
</script>
<template>
  <header class="w-full space-y-4 md:flex md:items-center md:space-x-6 md:space-y-0">
    <div class="flex items-center bg-inverted rounded-lg md:justify-between md:flex-1">
      <div class="px-4 py-3">
        <Logo class="h-6 text-inverted" />
      </div>

      <TypographyHeadline size="xs" :content="`Proposal for ${organization}`" class="text-inverted" />

      <div class="flex items-center justify-end shrink-0 p-2 space-x-2">
        <DarkModeToggle class="hidden text-inverted/80 md:block hover:text-inverted" />
      </div>
    </div>

    <div class="hidden gap-2 md:flex">
      <UButton color="primary" size="lg" @click="navigateTo('#accept')">Accept Proposal</UButton>
      <!-- @TODO - Add Chat -->
      <UButton
        variant="outline"
        class="uppercase"
        icon="i-heroicons-chat-bubble-bottom-center-text"
        @click="toggleSidebar"
      />
    </div>
  </header>
</template>
