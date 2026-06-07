import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
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

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  const firestore = getFirestore(app)
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
