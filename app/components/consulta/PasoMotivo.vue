<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-800">Motivo de Consulta</h2>
    <div class="bg-blue-50 border border-blue-100 rounded-xl p-3">
      <p class="text-xs text-blue-600 font-medium">Paciente</p>
      <p class="font-semibold text-gray-900">{{ paciente.apellidos }}, {{ paciente.nombres }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">¿Cuál es el motivo de consulta?</label>
      <textarea
        v-model="motivo"
        rows="4"
        placeholder="Describa brevemente el motivo de la consulta..."
        class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <p v-if="error" class="text-red-600 text-xs">{{ error }}</p>
    <button
      class="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
      :disabled="!motivo.trim() || guardando"
      @click="continuar"
    >
      {{ guardando ? 'Guardando...' : 'Iniciar Hoja de Atención' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Paciente } from '~/composables/usePacientes'

const props = defineProps<{ paciente: Paciente }>()
const emit = defineEmits<{ continuar: [consultaId: string, motivo: string] }>()

const { user } = useAuth()
const { crear } = useConsultas()

const motivo = ref('')
const guardando = ref(false)
const error = ref('')

const continuar = async () => {
  if (!motivo.value.trim()) return
  guardando.value = true
  error.value = ''
  try {
    const id = await crear({
      pacienteId: props.paciente.id,
      pacienteNombre: `${props.paciente.apellidos} ${props.paciente.nombres}`,
      medicoId: user.value?.uid,
      medicoNombre: user.value?.displayName ?? '',
      motivoConsulta: motivo.value.trim(),
      fechaConsulta: new Date().toISOString(),
      anamnesis: { enfermedadActual: '', antecedentesPersonales: '', antecedentesFamiliares: '', alergias: '' },
      signosVitales: { presionArterial: '', frecuenciaCardiaca: null, frecuenciaRespiratoria: null, temperatura: null, saturacion: null, peso: null, talla: null },
      examenFisico: '',
      diagnosticos: [],
      medicamentos: [],
      ordenesMedicas: [],
      interconsultas: [],
    })
    emit('continuar', id, motivo.value.trim())
  } catch (e: any) {
    error.value = `Error al guardar: ${e?.message ?? 'desconocido'}`
  } finally {
    guardando.value = false
  }
}
</script>
