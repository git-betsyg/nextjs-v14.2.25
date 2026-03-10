import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAxiosByInterceptorsServer } from '@/lib/request';

// You'll need to import and pass this
// to `NextAuth` in `pages/api/auth/[...nextauth].ts`
export const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        const res = await createAxiosByInterceptorsServer().post('/api/auth/login', {
          username: credentials?.username,
          password: credentials?.password,
        });

        // If no error and we have user data, return it
        if (res) {
          const { accessToken, userInfo } = res.data;

          return {
            id: userInfo.id,
            email: userInfo.email,
            username: userInfo.username,
            accessToken
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name;
      }

      if (user && user?.accessToken) {
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.userId = user.id as number;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      if (token && token?.accessToken) {
        session.accessToken = token.accessToken;
        session.user = {
          ...session.user,
          id: token.userId,
          name: token.username,
          email: token.email,
        };
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;

    user: {
      id?: number;
      accessToken?: string;
      name?: string;
      email?: string;
    }
  }

  interface User {
    id: number;
    accessToken: string;
    username: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string;
    userId?: number;
    email?: string;
  }
}