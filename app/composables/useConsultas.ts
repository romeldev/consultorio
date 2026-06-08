import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'

export const useConsultas = () => {
  const { $firestore } = useNuxtApp()

  const crear = async (data: Record<string, any>): Promise<string> => {
    const col = collection($firestore, 'consultas')
    const ref = await addDoc(col, {
      ...data,
      estado: 'borrador',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  }

  const actualizar = async (id: string, data: Record<string, any>): Promise<void> => {
    const ref = doc($firestore, 'consultas', id)
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
  }

  const completar = async (id: string): Promise<void> => {
    const ref = doc($firestore, 'consultas', id)
    await updateDoc(ref, { estado: 'completada', updatedAt: serverTimestamp() })
  }

  return { crear, actualizar, completar }
}
