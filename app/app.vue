<template>
  <div>
    <div v-if="!authReady" class="min-h-screen flex items-center justify-center">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
    <template v-else>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </template>
  </div>
</template>

<script setup lang="ts">
const { authReady } = useAuth()
</script>
