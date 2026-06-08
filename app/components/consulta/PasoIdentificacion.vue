<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-800">Identificación del Paciente</h2>

    <!-- Buscar -->
    <div v-if="!paciente" class="space-y-3">
      <div class="flex gap-2">
        <select
          v-model="tipoDoc"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="DNI">DNI</option>
          <option value="CE">CE</option>
          <option value="PAS">Pasaporte</option>
          <option value="RUC">RUC</option>
        </select>
        <input
          v-model="nroDoc"
          type="text"
          inputmode="numeric"
          placeholder="Número de documento"
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          @keyup.enter="buscar"
        />
      </div>
      <button
        class="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        :disabled="!nroDoc.trim() || buscando"
        @click="buscar"
      >
        {{ buscando ? 'Buscando...' : 'Buscar' }}
      </button>
      <p v-if="errorBusqueda" class="text-red-600 text-xs">{{ errorBusqueda }}</p>
    </div>

    <!-- Encontrado -->
    <div v-if="paciente && !mostrarFormulario" class="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1">
      <p class="text-xs text-green-600 font-medium uppercase tracking-wide">Paciente encontrado</p>
      <p class="font-semibold text-gray-900">{{ paciente.apellidos }}, {{ paciente.nombres }}</p>
      <p class="text-sm text-gray-600">{{ paciente.tipoDocumento }} {{ paciente.numeroDocumento }}</p>
      <p class="text-sm text-gray-600">Nac. {{ formatFecha(paciente.fechaNacimiento) }} · {{ paciente.sexo === 'M' ? 'Masculino' : 'Femenino' }}</p>
      <div class="flex gap-2 pt-2">
        <button
          class="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition"
          @click="confirmar"
        >
          Continuar
        </button>
        <button
          class="px-4 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
          @click="reiniciar"
        >
          Cambiar
        </button>
      </div>
    </div>

    <!-- No encontrado / Registro -->
    <div v-if="mostrarFormulario" class="space-y-3">
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p class="text-sm text-yellow-800">Paciente no registrado. Complete los datos para registrarlo.</p>
      </div>
      <div class="grid grid-cols-1 gap-3">
        <input
          v-model="form.apellidos"
          type="text"
          placeholder="Apellidos *"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
        />
        <input
          v-model="form.nombres"
          type="text"
          placeholder="Nombres *"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
        />
        <div class="flex gap-2">
          <input
            v-model="form.fechaNacimiento"
            type="date"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <select
            v-model="form.sexo"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Sexo</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          class="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="!formValido || guardando"
          @click="registrarYContinuar"
        >
          {{ guardando ? 'Registrando...' : 'Registrar y Continuar' }}
        </button>
        <button
          class="px-4 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
          @click="reiniciar"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Paciente } from '~/composables/usePacientes'

const emit = defineEmits<{ confirmar: [paciente: Paciente] }>()

const { buscarPorDocumento, registrar } = usePacientes()

const tipoDoc = ref('DNI')
const nroDoc = ref('')
const buscando = ref(false)
const guardando = ref(false)
const errorBusqueda = ref('')
const paciente = ref<Paciente | null>(null)
const mostrarFormulario = ref(false)

const form = reactive({
  apellidos: '',
  nombres: '',
  fechaNacimiento: '',
  sexo: '' as 'M' | 'F' | '',
})

const formValido = computed(() =>
  form.apellidos.trim() && form.nombres.trim() && form.fechaNacimiento && form.sexo
)

const formatFecha = (fecha: string) => {
  if (!fecha) return ''
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

const buscar = async () => {
  if (!nroDoc.value.trim()) return
  buscando.value = true
  errorBusqueda.value = ''
  try {
    const resultado = await buscarPorDocumento(tipoDoc.value, nroDoc.value.trim())
    if (resultado) {
      paciente.value = resultado
    } else {
      mostrarFormulario.value = true
    }
  } catch (e: any) {
    errorBusqueda.value = `Error al buscar: ${e?.message ?? 'desconocido'}`
  } finally {
    buscando.value = false
  }
}

const confirmar = () => {
  if (paciente.value) emit('confirmar', paciente.value)
}

const registrarYContinuar = async () => {
  if (!formValido.value) return
  guardando.value = true
  try {
    const id = await registrar({
      tipoDocumento: tipoDoc.value,
      numeroDocumento: nroDoc.value.trim(),
      apellidos: form.apellidos.trim(),
      nombres: form.nombres.trim(),
      fechaNacimiento: form.fechaNacimiento,
      sexo: form.sexo as 'M' | 'F',
    })
    const nuevo: Paciente = {
      id,
      tipoDocumento: tipoDoc.value,
      numeroDocumento: nroDoc.value.trim(),
      apellidos: form.apellidos.trim(),
      nombres: form.nombres.trim(),
      fechaNacimiento: form.fechaNacimiento,
      sexo: form.sexo as 'M' | 'F',
    }
    emit('confirmar', nuevo)
  } catch (e: any) {
    errorBusqueda.value = `Error al registrar: ${e?.message ?? 'desconocido'}`
  } finally {
    guardando.value = false
  }
}

const reiniciar = () => {
  paciente.value = null
  mostrarFormulario.value = false
  nroDoc.value = ''
  errorBusqueda.value = ''
  Object.assign(form, { apellidos: '', nombres: '', fechaNacimiento: '', sexo: '' })
}
</script>
