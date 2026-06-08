<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2">
        <label class="block text-xs font-medium text-gray-600 mb-1">Presión Arterial (mmHg)</label>
        <input
          v-model="local.presionArterial"
          type="text"
          placeholder="ej. 120/80"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          @blur="guardar"
        />
      </div>
      <div v-for="campo in camposNumericos" :key="campo.key">
        <label class="block text-xs font-medium text-gray-600 mb-1">{{ campo.label }}</label>
        <input
          v-model.number="local[campo.key]"
          type="number"
          :placeholder="campo.placeholder"
          :step="campo.step"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          @blur="guardar"
        />
      </div>
    </div>
    <div v-if="imc" class="bg-gray-50 rounded-lg p-3 text-center">
      <p class="text-xs text-gray-500">IMC</p>
      <p class="text-xl font-bold text-gray-800">{{ imc }}</p>
      <p class="text-xs" :class="clasificacionColor">{{ clasificacion }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ consultaId: string; modelValue: Record<string, any> }>()
const emit = defineEmits<{ 'update:modelValue': [v: Record<string, any>] }>()

const { actualizar } = useConsultas()

const camposNumericos = [
  { key: 'frecuenciaCardiaca', label: 'Frec. Cardíaca (lpm)', placeholder: '72', step: 1 },
  { key: 'frecuenciaRespiratoria', label: 'Frec. Respiratoria (rpm)', placeholder: '16', step: 1 },
  { key: 'temperatura', label: 'Temperatura (°C)', placeholder: '36.5', step: 0.1 },
  { key: 'saturacion', label: 'Saturación O₂ (%)', placeholder: '98', step: 1 },
  { key: 'peso', label: 'Peso (kg)', placeholder: '70', step: 0.1 },
  { key: 'talla', label: 'Talla (cm)', placeholder: '170', step: 1 },
] as const

const local = reactive({ ...props.modelValue })

const imc = computed(() => {
  const p = local.peso
  const t = local.talla
  if (!p || !t || t <= 0) return null
  return (p / Math.pow(t / 100, 2)).toFixed(1)
})

const clasificacion = computed(() => {
  const v = Number(imc.value)
  if (!v) return ''
  if (v < 18.5) return 'Bajo peso'
  if (v < 25) return 'Normal'
  if (v < 30) return 'Sobrepeso'
  return 'Obesidad'
})

const clasificacionColor = computed(() => {
  const v = Number(imc.value)
  if (!v) return ''
  if (v < 18.5 || v >= 30) return 'text-red-600'
  if (v < 25) return 'text-green-600'
  return 'text-yellow-600'
})

const guardar = async () => {
  emit('update:modelValue', { ...local })
  await actualizar(props.consultaId, { signosVitales: { ...local } })
}
</script>
