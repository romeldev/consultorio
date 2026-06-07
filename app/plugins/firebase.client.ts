import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, getRedirectResult } from 'firebase/auth'

export default defineNuxtPlugin(async () => {
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

  // Procesar resultado de redirect antes de que el router actúe
  try {
    const result = await getRedirectResult(auth)
    if (result?.user) {
      user.value = result.user as any
      console.log('[Auth] redirect result OK:', result.user.email)
    }
  } catch (e) {
    console.error('[Auth] redirect result error:', e)
  }

  onAuthStateChanged(auth, (u) => {
    user.value = u as any
    authReady.value = true
    console.log('[Auth] state changed:', u?.email ?? 'null')
  })

  return {
    provide: { firestore, auth, googleProvider },
  }
})
