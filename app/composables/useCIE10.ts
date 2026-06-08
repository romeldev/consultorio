import cie10Data from '~/data/cie10.json'

interface CIE10Item {
  codigo: string
  descripcion: string
}

export const useCIE10 = () => {
  const query = ref('')
  const results = ref<CIE10Item[]>([])
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
      results.value = (cie10Data as CIE10Item[])
        .filter(item =>
          item.codigo.toLowerCase().includes(q) ||
          item.descripcion.toLowerCase().includes(q)
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
