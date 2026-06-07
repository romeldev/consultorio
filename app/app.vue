<template>
  <div>
    <div v-if="!authReady" class="loading">
      <div class="spinner" />
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

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f5;
  color: #333;
}

.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
