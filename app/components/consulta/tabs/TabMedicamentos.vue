<template>
  <div class="space-y-4">
    <!-- Buscador DIGEMID -->
    <div class="space-y-2">
      <div class="relative">
        <input
          v-model="textoBusqueda"
          type="text"
          placeholder="Buscar medicamento en DIGEMID..."
          class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="digemid.buscar(textoBusqueda)"
          @focus="mostrarResultados = true"
        />
        <ul
          v-if="mostrarResultados && digemid.results.value.length"
          class="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto"
        >
          <li
            v-for="item in digemid.results.value"
            :key="item.codigoDigemid"
            class="px-3 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
            @mousedown.prevent="seleccionar(item)"
          >
            <span class="font-mono text-blue-700 text-xs mr-2">{{ item.codigoDigemid }}</span>
            <span class="text-gray-800">{{ item.nombreProducto }}</span>
          </li>
        </ul>
      </div>
      <p v-if="digemid.loading.value" class="text-xs text-gray-500">Buscando...</p>
      <p v-if="digemid.error.value" class="text-xs text-yellow-600">{{ digemid.error.value }}</p>
    </div>

    <!-- Formulario inline si hay selección o error DIGEMID -->
    <div v-if="nuevo.nombreProducto" class="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
      <p class="text-xs font-medium text-gray-600">Nuevo medicamento</p>
      <input
        v-model="nuevo.nombreProducto"
        type="text"
        placeholder="Nombre del producto"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        v-model="nuevo.cantidad"
        type="text"
        placeholder="Cantidad (ej. 1 caja, 30 tabletas)"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <input
        v-model="nuevo.indicacion"
        type="text"
        placeholder="Indicación (ej. 1 tableta cada 8h por 7 días)"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <div class="flex gap-2">
        <button
          class="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
          :disabled="!nuevo.nombreProducto || !nuevo.cantidad || !nuevo.indicacion"
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
        v-for="(med, i) in lista"
        :key="i"
        class="border border-gray-200 rounded-xl p-3 bg-white"
      >
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ med.nombreProducto }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ med.cantidad }}</p>
            <p class="text-xs text-blue-700 mt-0.5">{{ med.indicacion }}</p>
          </div>
          <button class="text-red-400 hover:text-red-600 text-lg leading-none" @click="eliminar(i)">×</button>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-gray-400 text-center py-4">Sin medicamentos agregados</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ consultaId: string; modelValue: any[] }>()
const emit = defineEmits<{ 'update:modelValue': [v: any[]] }>()

const { actualizar } = useConsultas()
const digemid = useDigemid()

const textoBusqueda = ref('')
const mostrarResultados = ref(false)
const lista = ref<any[]>([...props.modelValue])
const nuevo = reactive({ nombreProducto: '', codigoDigemid: '', cantidad: '', indicacion: '' })

const seleccionar = (item: { nombreProducto: string; codigoDigemid: string }) => {
  nuevo.nombreProducto = item.nombreProducto
  nuevo.codigoDigemid = item.codigoDigemid
  textoBusqueda.value = ''
  digemid.limpiar()
  mostrarResultados.value = false
}

const agregar = async () => {
  lista.value.push({ ...nuevo })
  Object.assign(nuevo, { nombreProducto: '', codigoDigemid: '', cantidad: '', indicacion: '' })
  await guardar()
}

const eliminar = async (i: number) => {
  lista.value.splice(i, 1)
  await guardar()
}

const cancelar = () => {
  Object.assign(nuevo, { nombreProducto: '', codigoDigemid: '', cantidad: '', indicacion: '' })
  digemid.limpiar()
  textoBusqueda.value = ''
}

const guardar = async () => {
  emit('update:modelValue', [...lista.value])
  await actualizar(props.consultaId, { medicamentos: lista.value })
}
</script>
