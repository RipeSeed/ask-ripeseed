import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { connectDB } from '@/models'
import User from '@/models/user/user.model'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (
        credentials: Partial<Record<'email' | 'password', unknown>>,
      ) => {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        await connectDB()

        const user = await User.findOne({ email })
        if (!user) {
          console.error('No user found with the given email')
          throw new Error('Invalid email or password')
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
          console.error('Password mismatch')
          throw new Error('Invalid email or password')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          emailVerified: user.emailVerified || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          emailVerified: null,
        }
      }
      return session
    },
  },
})
