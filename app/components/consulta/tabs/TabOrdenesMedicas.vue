<template>
  <div class="space-y-4">
    <!-- Formulario nueva orden -->
    <div class="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
      <p class="text-xs font-medium text-gray-600">Nueva Orden</p>
      <select
        v-model="nueva.tipo"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
      >
        <option value="laboratorio">Laboratorio</option>
        <option value="imagen">Imagen</option>
      </select>

      <!-- Buscador CPMS -->
      <div class="relative">
        <input
          v-model="textoBusqueda"
          type="text"
          placeholder="Buscar procedimiento CPMS..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="cpms.buscar(textoBusqueda)"
          @focus="mostrarResultados = true"
        />
        <ul
          v-if="mostrarResultados && cpms.results.value.length"
          class="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto"
        >
          <li
            v-for="item in cpms.results.value"
            :key="item.codigo"
            class="px-3 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
            @mousedown.prevent="seleccionarCpms(item)"
          >
            <span class="font-mono text-blue-700 text-xs mr-2">{{ item.codigo }}</span>
            <span class="text-gray-800">{{ item.descripcion }}</span>
          </li>
        </ul>
      </div>

      <input
        v-model="nueva.codigoCpms"
        type="text"
        placeholder="Código CPMS (opcional si no encontró)"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        v-model="nueva.descripcion"
        type="text"
        placeholder="Descripción *"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        v-model="nueva.cantidad"
        type="text"
        placeholder="Cantidad (ej. 1 vez) *"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        v-model="nueva.indicacion"
        type="text"
        placeholder="Indicación / instrucciones"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <button
        class="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
        :disabled="!nueva.descripcion || !nueva.cantidad"
        @click="agregar"
      >
        Agregar Orden
      </button>
    </div>

    <!-- Lista -->
    <div v-if="lista.length" class="space-y-2">
      <div
        v-for="(orden, i) in lista"
        :key="i"
        class="border border-gray-200 rounded-xl p-3 bg-white"
      >
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span
                class="text-xs px-1.5 py-0.5 rounded font-medium"
                :class="orden.tipo === 'laboratorio' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'"
              >
                {{ orden.tipo === 'laboratorio' ? 'Lab' : 'Imagen' }}
              </span>
              <span v-if="orden.codigoCpms" class="font-mono text-xs text-gray-500">{{ orden.codigoCpms }}</span>
            </div>
            <p class="text-sm font-medium text-gray-900">{{ orden.descripcion }}</p>
            <p class="text-xs text-gray-500">{{ orden.cantidad }}</p>
            <p v-if="orden.indicacion" class="text-xs text-blue-700">{{ orden.indicacion }}</p>
          </div>
          <button class="text-red-400 hover:text-red-600 text-lg leading-none" @click="eliminar(i)">×</button>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-gray-400 text-center py-4">Sin órdenes médicas</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ consultaId: string; modelValue: any[] }>()
const emit = defineEmits<{ 'update:modelValue': [v: any[]] }>()

const { actualizar } = useConsultas()
const cpms = useCPMS()

const textoBusqueda = ref('')
const mostrarResultados = ref(false)
const lista = ref<any[]>([...props.modelValue])
const nueva = reactive({ tipo: 'laboratorio', codigoCpms: '', descripcion: '', cantidad: '', indicacion: '' })

const seleccionarCpms = (item: { codigo: string; descripcion: string }) => {
  nueva.codigoCpms = item.codigo
  nueva.descripcion = item.descripcion
  textoBusqueda.value = item.descripcion
  cpms.limpiar()
  mostrarResultados.value = false
}

const agregar = async () => {
  lista.value.push({ ...nueva })
  Object.assign(nueva, { tipo: 'laboratorio', codigoCpms: '', descripcion: '', cantidad: '', indicacion: '' })
  textoBusqueda.value = ''
  await guardar()
}

const eliminar = async (i: number) => {
  lista.value.splice(i, 1)
  await guardar()
}

const guardar = async () => {
  emit('update:modelValue', [...lista.value])
  await actualizar(props.consultaId, { ordenesMedicas: lista.value })
}
</script>
