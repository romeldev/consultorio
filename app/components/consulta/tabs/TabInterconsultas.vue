<template>
  <div class="space-y-4">
    <!-- Buscador de especialidad -->
    <div class="space-y-2">
      <div class="relative">
        <input
          v-model="textoBusqueda"
          type="text"
          placeholder="Buscar especialidad..."
          class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="especialidades.buscar(textoBusqueda)"
          @focus="mostrarResultados = true"
        />
        <ul
          v-if="mostrarResultados && especialidades.results.value.length"
          class="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto"
        >
          <li
            v-for="item in especialidades.results.value"
            :key="item.codigo"
            class="px-3 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
            @mousedown.prevent="seleccionar(item)"
          >
            <span class="font-mono text-blue-700 text-xs mr-2">{{ item.codigo }}</span>
            <span class="text-gray-800">{{ item.nombre }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Formulario motivo -->
    <div v-if="nueva.codigoEspecialidad" class="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
      <p class="text-xs font-medium text-gray-600">Interconsulta a <span class="text-blue-700">{{ nueva.nombreEspecialidad }}</span></p>
      <textarea
        v-model="nueva.motivo"
        rows="3"
        placeholder="Motivo de la interconsulta..."
        class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm resize-none"
      />
      <div class="flex gap-2">
        <button
          class="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
          :disabled="!nueva.motivo.trim()"
          @click="agregar"
        >
          Agregar
        </button>
        <button class="px-4 border border-gray-300 rounded-lg py-2 text-sm text-gray-600" @click="cancelar">
          Cancelar
        </button>
      </div>
    </div>

    <!-- Lista -->
    <div v-if="lista.length" class="space-y-2">
      <div
        v-for="(item, i) in lista"
        :key="i"
        class="border border-gray-200 rounded-xl p-3 bg-white"
      >
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="font-mono text-xs text-blue-700">{{ item.codigoEspecialidad }}</span>
              <span class="text-sm font-medium text-gray-900">{{ item.nombreEspecialidad }}</span>
            </div>
            <p class="text-xs text-gray-600">{{ item.motivo }}</p>
          </div>
          <button class="text-red-400 hover:text-red-600 text-lg leading-none" @click="eliminar(i)">×</button>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-gray-400 text-center py-4">Sin interconsultas</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ consultaId: string; modelValue: any[] }>()
const emit = defineEmits<{ 'update:modelValue': [v: any[]] }>()

const { actualizar } = useConsultas()
const especialidades = useEspecialidades()

const textoBusqueda = ref('')
const mostrarResultados = ref(false)
const lista = ref<any[]>([...props.modelValue])
const nueva = reactive({ codigoEspecialidad: '', nombreEspecialidad: '', motivo: '' })

const seleccionar = (item: { codigo: string; nombre: string }) => {
  nueva.codigoEspecialidad = item.codigo
  nueva.nombreEspecialidad = item.nombre
  textoBusqueda.value = ''
  especialidades.limpiar()
  mostrarResultados.value = false
}

const agregar = async () => {
  lista.value.push({ ...nueva })
  Object.assign(nueva, { codigoEspecialidad: '', nombreEspecialidad: '', motivo: '' })
  await guardar()
}

const eliminar = async (i: number) => {
  lista.value.splice(i, 1)
  await guardar()
}

const cancelar = () => {
  Object.assign(nueva, { codigoEspecialidad: '', nombreEspecialidad: '', motivo: '' })
  especialidades.limpiar()
  textoBusqueda.value = ''
}

const guardar = async () => {
  emit('update:modelValue', [...lista.value])
  await actualizar(props.consultaId, { interconsultas: lista.value })
}
</script>
