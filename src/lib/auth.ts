import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { type: 'email', label: 'email' },
        password: { type: 'password', label: 'password' },
      },
      async authorize(credentials) {
        return credentials
      },
    }),
  ],
})
