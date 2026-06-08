import cpmsData from '~/data/cpms.json'

interface CPMSItem {
  codigo: string
  descripcion: string
}

export const useCPMS = () => {
  const query = ref('')
  const results = ref<CPMSItem[]>([])
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
      results.value = (cpmsData as CPMSItem[])
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
