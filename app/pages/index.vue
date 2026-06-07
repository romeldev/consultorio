<template>
  <div>
    <header class="header">
      <h1>🏥 Consultorio</h1>
      <div class="user-info">
        <img :src="user?.photoURL ?? ''" :alt="user?.displayName ?? ''" class="avatar" />
        <span>{{ user?.displayName }}</span>
        <button class="btn-logout" @click="logOut">Cerrar sesión</button>
      </div>
    </header>

    <main class="main">
      <h2>Bienvenido, {{ user?.displayName?.split(' ')[0] }}</h2>
      <p>Panel de gestión del consultorio.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { user, logOut } = useAuth()
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

h1 { font-size: 1.2rem; font-weight: 700; }

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.btn-logout {
  padding: 0.4rem 0.8rem;
  background: #f1f3f4;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-logout:hover { background: #e0e0e0; }

.main {
  padding: 2rem 1.5rem;
}

h2 { font-size: 1.3rem; margin-bottom: 0.5rem; }
p { color: #666; }
</style>
