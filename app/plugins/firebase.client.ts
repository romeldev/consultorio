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

  // Long polling + persistencia local: evita AbortErrors en redes móviles donde
  // el streaming HTTP (WebChannel) es abortado por la red o el navegador.
  let firestore
  try {
    firestore = initializeFirestore(app, {
      localCache: persistentLocalCache(),
      experimentalForceLongPolling: true,
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
