<template>
  <div class="space-y-4">
    <!-- Buscador -->
    <div class="relative">
      <input
        v-model="textoBusqueda"
        type="text"
        placeholder="Buscar por código o descripción CIE-10..."
        class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="cie10.buscar(textoBusqueda)"
        @focus="mostrarResultados = true"
      />
      <ul
        v-if="mostrarResultados && cie10.results.value.length"
        class="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto"
      >
        <li
          v-for="item in cie10.results.value"
          :key="item.codigo"
          class="px-3 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
          @mousedown.prevent="agregar(item)"
        >
          <span class="font-mono text-blue-700 text-xs mr-2">{{ item.codigo }}</span>
          <span class="text-gray-800">{{ item.descripcion }}</span>
        </li>
      </ul>
    </div>

    <!-- Lista de diagnósticos -->
    <div v-if="lista.length" class="space-y-2">
      <div
        v-for="(dx, i) in lista"
        :key="i"
        class="border border-gray-200 rounded-xl p-3 space-y-2"
        :class="i === 0 ? 'border-blue-300 bg-blue-50' : 'bg-white'"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span v-if="i === 0" class="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">Principal</span>
              <span class="font-mono text-xs text-blue-700">{{ dx.codigo }}</span>
            </div>
            <p class="text-sm text-gray-800 mt-0.5">{{ dx.descripcion }}</p>
          </div>
          <button class="text-red-400 hover:text-red-600 shrink-0 text-lg leading-none" @click="eliminar(i)">×</button>
        </div>
        <select
          v-model="dx.tipo"
          class="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white w-full"
          @change="guardar"
        >
          <option value="presuntivo">Presuntivo</option>
          <option value="repetitivo">Repetitivo</option>
          <option value="definitivo">Definitivo</option>
        </select>
      </div>
    </div>
    <p v-else class="text-sm text-gray-400 text-center py-4">Sin diagnósticos agregados</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ consultaId: string; modelValue: any[] }>()
const emit = defineEmits<{ 'update:modelValue': [v: any[]] }>()

const { actualizar } = useConsultas()
const cie10 = useCIE10()

const textoBusqueda = ref('')
const mostrarResultados = ref(false)
const lista = ref<any[]>([...props.modelValue])

const agregar = (item: { codigo: string; descripcion: string }) => {
  if (lista.value.some(d => d.codigo === item.codigo)) return
  lista.value.push({ codigo: item.codigo, descripcion: item.descripcion, tipo: 'presuntivo' })
  textoBusqueda.value = ''
  cie10.limpiar()
  mostrarResultados.value = false
  guardar()
}

const eliminar = (i: number) => {
  lista.value.splice(i, 1)
  guardar()
}

const guardar = async () => {
  emit('update:modelValue', [...lista.value])
  await actualizar(props.consultaId, { diagnosticos: lista.value })
}

const cerrarResultados = (e: MouseEvent) => {
  mostrarResultados.value = false
}
onMounted(() => document.addEventListener('click', cerrarResultados))
onUnmounted(() => document.removeEventListener('click', cerrarResultados))
</script>
