<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">🏥</div>
      <h1>Consultorio</h1>
      <p>Sistema de gestión médica</p>

      <button class="btn-google" :disabled="loading" @click="handleSignIn">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        {{ loading ? 'Iniciando sesión...' : 'Continuar con Google' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRedirectResult } from 'firebase/auth'

const { $auth } = useNuxtApp()
const { user, signIn } = useAuth()
const loading = ref(true)
const error = ref('')

watch(user, (u) => {
  if (u) navigateTo('/')
}, { immediate: true })

onMounted(async () => {
  try {
    const result = await getRedirectResult($auth)
    if (result?.user) navigateTo('/')
  } catch {
    error.value = 'Error al iniciar sesión. Verifica que el dominio esté autorizado en Firebase.'
  } finally {
    loading.value = false
  }
})

const handleSignIn = async () => {
  loading.value = true
  error.value = ''
  await signIn()
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  text-align: center;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.login-logo {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}

.btn-google:hover:not(:disabled) {
  background: #f8f9fa;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #d32f2f;
  margin-top: 1rem;
  margin-bottom: 0;
  font-size: 0.85rem;
}
</style>
