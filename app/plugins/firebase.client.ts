import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

  // Persistencia local: las escrituras se confirman en IndexedDB al instante
  // y se sincronizan con el servidor en background (evita loops en redes móviles)
  let firestore
  try {
    firestore = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    })
  } catch {
    firestore = getFirestore(app)
  }

  const auth = getAuth(app)
  const googleProvider = new GoogleAuthProvider()

  const user = useState('auth-user', () => null)
  const authReady = useState('auth-ready', () => false)

  onAuthStateChanged(auth, (u) => {
    user.value = u as any
    authReady.value = true
  })

  return {
    provide: { firestore, auth, googleProvider },
  }
})
