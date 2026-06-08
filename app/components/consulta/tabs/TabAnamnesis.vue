<template>
  <div class="space-y-4">
    <div v-for="campo in campos" :key="campo.key">
      <label class="block text-sm font-medium text-gray-700 mb-1">{{ campo.label }}</label>
      <textarea
        v-model="local[campo.key]"
        :rows="campo.rows"
        :placeholder="campo.placeholder"
        class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        @blur="guardar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ consultaId: string; modelValue: Record<string, string> }>()
const emit = defineEmits<{ 'update:modelValue': [v: Record<string, string>] }>()

const { actualizar } = useConsultas()

const campos = [
  { key: 'enfermedadActual', label: 'Enfermedad Actual', rows: 4, placeholder: 'Describa la enfermedad actual...' },
  { key: 'antecedentesPersonales', label: 'Antecedentes Personales', rows: 3, placeholder: 'Patologías previas, cirugías, hospitalizaciones...' },
  { key: 'antecedentesFamiliares', label: 'Antecedentes Familiares', rows: 2, placeholder: 'Enfermedades en familiares directos...' },
  { key: 'alergias', label: 'Alergias', rows: 2, placeholder: 'Medicamentos, alimentos, otros...' },
] as const

const local = reactive({ ...props.modelValue })

const guardar = async () => {
  emit('update:modelValue', { ...local })
  await actualizar(props.consultaId, { anamnesis: { ...local } })
}
</script>
