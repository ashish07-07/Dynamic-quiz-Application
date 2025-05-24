import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import axios from "axios";

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        name: { label: "name", type: "text", placeholder: "enter your name" },
        email: {
          label: "email",
          type: "email",
          placeholder: "bkashishh07@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "123456",
        },
      },
      async authorize(credentials: any) {
        const { email, password, name } = credentials;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
          const response = await axios.post(
            "http://localhost:3000/user/userregistration",
            {
              name,
              email,

              password: hashedPassword,
            }
          );

          if (response.data && response.data.user) {
            const user = response.data.user;
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
            };
          }
        } catch (e) {
          console.error(e);
        }

        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    async session({ token, session }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;

        console.log(session);
      }
      return session;
    },
  },
};
