import { signInWithPopup, signOut, type User } from 'firebase/auth'

export const useAuth = () => {
  const { $auth, $googleProvider } = useNuxtApp()
  const user = useState<User | null>('auth-user')
  const authReady = useState<boolean>('auth-ready')

  const signIn = () => signInWithPopup($auth, $googleProvider)
  const logOut = () => signOut($auth)

  return { user, authReady, signIn, logOut }
}
