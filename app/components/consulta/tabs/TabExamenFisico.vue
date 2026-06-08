<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">Examen Físico</label>
    <textarea
      v-model="local"
      rows="10"
      placeholder="Describa los hallazgos del examen físico por sistemas..."
      class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      @blur="guardar"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ consultaId: string; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

const { actualizar } = useConsultas()
const local = ref(props.modelValue)

const guardar = async () => {
  emit('update:modelValue', local.value)
  await actualizar(props.consultaId, { examenFisico: local.value })
}
</script>
