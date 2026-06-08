interface ProductoDigemid {
  nombreProducto: string
  codigoDigemid: string
}

export const useDigemid = () => {
  const query = ref('')
  const results = ref<ProductoDigemid[]>([])
  const loading = ref(false)
  const error = ref('')
  let debounceTimer: ReturnType<typeof setTimeout>

  const buscar = (texto: string) => {
    query.value = texto
    clearTimeout(debounceTimer)
    if (!texto.trim()) {
      results.value = []
      loading.value = false
      return
    }
    debounceTimer = setTimeout(async () => {
      loading.value = true
      error.value = ''
      try {
        const url = `https://www.digemid.minsa.gob.pe/WebConsultas/api/Productos/BuscarProducto?nombre=${encodeURIComponent(texto)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Error en la respuesta')
        const data = await res.json()
        results.value = (Array.isArray(data) ? data : []).slice(0, 10).map((item: any) => ({
          nombreProducto: item.nombreProducto ?? item.nombre ?? '',
          codigoDigemid: String(item.codigoProducto ?? item.codigo ?? ''),
        }))
      } catch {
        error.value = 'No se pudo conectar a DIGEMID. Ingrese el medicamento manualmente.'
        results.value = []
      } finally {
        loading.value = false
      }
    }, 400)
  }

  const limpiar = () => {
    query.value = ''
    results.value = []
    error.value = ''
    clearTimeout(debounceTimer)
  }

  return { query, results, loading, error, buscar, limpiar }
}
