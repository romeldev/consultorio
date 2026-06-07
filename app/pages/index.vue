<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      <h1 class="text-lg font-bold">🏥 Consultorio</h1>
      <div class="flex items-center gap-3">
        <img :src="user?.photoURL ?? ''" :alt="user?.displayName ?? ''" class="w-8 h-8 rounded-full" />
        <span class="text-sm hidden sm:block">{{ user?.displayName }}</span>
        <button
          class="text-sm bg-gray-100 hover:bg-gray-200 transition px-3 py-1.5 rounded-md"
          @click="logOut"
        >
          Salir
        </button>
      </div>
    </header>

    <main class="p-4">
      <h2 class="text-xl font-semibold mb-1">Bienvenido, {{ user?.displayName?.split(' ')[0] }}</h2>
      <p class="text-gray-500 text-sm">Panel de gestión del consultorio.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { user, logOut } = useAuth()
</script>
