<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3">
      <button
        class="text-gray-500 hover:text-gray-700 p-1 -ml-1"
        @click="volverAtras"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <h1 class="text-sm font-bold text-gray-900 truncate">Nueva Consulta</h1>
        <p class="text-xs text-gray-500">Paso {{ step }} de 3</p>
      </div>
    </header>

    <!-- Progreso -->
    <div class="flex h-1">
      <div
        class="bg-blue-600 transition-all duration-300"
        :style="{ width: `${(step / 3) * 100}%` }"
      />
    </div>

    <!-- Contenido -->
    <main class="p-4 max-w-lg mx-auto">
      <PasoIdentificacion
        v-if="step === 1"
        @confirmar="onPacienteConfirmado"
      />
      <PasoMotivo
        v-else-if="step === 2"
        :paciente="paciente!"
        @continuar="onMotivoContinuar"
      />
      <HojaAtencion
        v-else-if="step === 3"
        :consulta-id="consultaId!"
        :paciente="paciente!"
        :motivo="motivo"
        @finalizada="onFinalizada"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import PasoIdentificacion from '~/components/consulta/PasoIdentificacion.vue'
import PasoMotivo from '~/components/consulta/PasoMotivo.vue'
import HojaAtencion from '~/components/consulta/HojaAtencion.vue'
import type { Paciente } from '~/composables/usePacientes'

definePageMeta({ middleware: 'auth' })

const step = ref(1)
const paciente = ref<Paciente | null>(null)
const consultaId = ref<string | null>(null)
const motivo = ref('')

const onPacienteConfirmado = (p: Paciente) => {
  paciente.value = p
  step.value = 2
}

const onMotivoContinuar = (id: string, m: string) => {
  consultaId.value = id
  motivo.value = m
  step.value = 3
}

const onFinalizada = () => {
  navigateTo('/')
}

const volverAtras = () => {
  if (step.value === 1) {
    navigateTo('/')
  } else {
    step.value--
  }
}
</script>
