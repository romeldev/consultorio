import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

export interface Paciente {
  id?: string
  tipoDocumento: string
  numeroDocumento: string
  apellidos: string
  nombres: string
  fechaNacimiento: string
  sexo: 'M' | 'F'
}

export const usePacientes = () => {
  const { $firestore } = useNuxtApp()

  const buscarPorDocumento = async (tipoDocumento: string, numeroDocumento: string): Promise<Paciente | null> => {
    const col = collection($firestore, 'pacientes')
    const q = query(col, where('tipoDocumento', '==', tipoDocumento), where('numeroDocumento', '==', numeroDocumento))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const doc = snap.docs[0]
    return { id: doc.id, ...doc.data() } as Paciente
  }

  const registrar = async (data: Omit<Paciente, 'id'>): Promise<string> => {
    const col = collection($firestore, 'pacientes')
    const ref = await addDoc(col, { ...data, createdAt: serverTimestamp() })
    return ref.id
  }

  return { buscarPorDocumento, registrar }
}
