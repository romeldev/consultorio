import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore'

export const useCollection = (collectionName: string) => {
  const { $firestore } = useNuxtApp()
  const col = collection($firestore, collectionName)

  const getAll = () => getDocs(query(col, orderBy('createdAt', 'desc')))

  const add = (data: DocumentData) =>
    addDoc(col, { ...data, createdAt: serverTimestamp() })

  const update = (id: string, data: DocumentData) =>
    updateDoc(doc($firestore, collectionName, id), data)

  const remove = (id: string) =>
    deleteDoc(doc($firestore, collectionName, id))

  return { getAll, add, update, remove }
}
