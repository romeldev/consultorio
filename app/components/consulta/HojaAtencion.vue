<template>
  <div class="space-y-4">
    <div class="bg-blue-50 border border-blue-100 rounded-xl p-3">
      <p class="text-xs text-blue-600 font-medium">Paciente</p>
      <p class="font-semibold text-gray-900">{{ paciente.apellidos }}, {{ paciente.nombres }}</p>
      <p class="text-xs text-gray-500 mt-0.5">{{ motivo }}</p>
    </div>

    <!-- Tabs scroll horizontal -->
    <div class="overflow-x-auto -mx-4 px-4">
      <div class="flex gap-1 min-w-max border-b border-gray-200 pb-0">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition"
          :class="tabActivo === tab.key
            ? 'border-blue-600 text-blue-700'
            : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="tabActivo = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Contenido del tab -->
    <div class="pb-4">
      <TabAnamnesis v-if="tabActivo === 'anamnesis'" :consulta-id="consultaId" v-model="datos.anamnesis" />
      <TabSignosVitales v-else-if="tabActivo === 'signosVitales'" :consulta-id="consultaId" v-model="datos.signosVitales" />
      <TabExamenFisico v-else-if="tabActivo === 'examenFisico'" :consulta-id="consultaId" v-model="datos.examenFisico" />
      <TabDiagnosticos v-else-if="tabActivo === 'diagnosticos'" :consulta-id="consultaId" v-model="datos.diagnosticos" />
      <TabMedicamentos v-else-if="tabActivo === 'medicamentos'" :consulta-id="consultaId" v-model="datos.medicamentos" />
      <TabOrdenesMedicas v-else-if="tabActivo === 'ordenesMedicas'" :consulta-id="consultaId" v-model="datos.ordenesMedicas" />
      <TabInterconsultas v-else-if="tabActivo === 'interconsultas'" :consulta-id="consultaId" v-model="datos.interconsultas" />
    </div>

    <!-- Finalizar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <button
        class="w-full bg-green-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
        :disabled="finalizando"
        @click="finalizar"
      >
        {{ finalizando ? 'Finalizando...' : 'Finalizar Consulta' }}
      </button>
    </div>
    <div class="h-16" />
  </div>
</template>

<script setup lang="ts">
import type { Paciente } from '~/composables/usePacientes'

const props = defineProps<{
  consultaId: string
  paciente: Paciente
  motivo: string
}>()
const emit = defineEmits<{ finalizada: [] }>()

const { completar } = useConsultas()
const finalizando = ref(false)

const tabs = [
  { key: 'anamnesis', label: 'Anamnesis' },
  { key: 'signosVitales', label: 'Signos Vitales' },
  { key: 'examenFisico', label: 'Examen Físico' },
  { key: 'diagnosticos', label: 'Diagnósticos' },
  { key: 'medicamentos', label: 'Medicamentos' },
  { key: 'ordenesMedicas', label: 'Órdenes' },
  { key: 'interconsultas', label: 'Interconsultas' },
]

const tabActivo = ref('anamnesis')

const datos = reactive({
  anamnesis: { enfermedadActual: '', antecedentesPersonales: '', antecedentesFamiliares: '', alergias: '' },
  signosVitales: { presionArterial: '', frecuenciaCardiaca: null, frecuenciaRespiratoria: null, temperatura: null, saturacion: null, peso: null, talla: null },
  examenFisico: '',
  diagnosticos: [] as any[],
  medicamentos: [] as any[],
  ordenesMedicas: [] as any[],
  interconsultas: [] as any[],
})

const finalizar = async () => {
  finalizando.value = true
  try {
    await completar(props.consultaId)
    emit('finalizada')
  } finally {
    finalizando.value = false
  }
}
</script>
