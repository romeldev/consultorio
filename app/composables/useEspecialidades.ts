import especialidadesData from '~/data/especialidades.json'

interface Especialidad {
  codigo: string
  nombre: string
}

export const useEspecialidades = () => {
  const query = ref('')
  const results = ref<Especialidad[]>([])
  let debounceTimer: ReturnType<typeof setTimeout>

  const buscar = (texto: string) => {
    query.value = texto
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      if (!texto.trim()) {
        results.value = []
        return
      }
      const q = texto.toLowerCase()
      results.value = (especialidadesData as Especialidad[])
        .filter(item =>
          item.codigo.toLowerCase().includes(q) ||
          item.nombre.toLowerCase().includes(q)
        )
        .slice(0, 10)
    }, 300)
  }

  const limpiar = () => {
    query.value = ''
    results.value = []
    clearTimeout(debounceTimer)
  }

  return { query, results, buscar, limpiar }
}
