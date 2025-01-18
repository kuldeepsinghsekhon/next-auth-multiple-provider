import NextAuth from "next-auth"
import "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import Apple from "next-auth/providers/apple"
import Credentials from "next-auth/providers/credentials"

// import Atlassian from "next-auth/providers/atlassian"
import Auth0 from "next-auth/providers/auth0"
import AzureB2C from "next-auth/providers/azure-ad-b2c"
import BankIDNorway from "next-auth/providers/bankid-no"
import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
import Cognito from "next-auth/providers/cognito"
import Coinbase from "next-auth/providers/coinbase"
import Discord from "next-auth/providers/discord"
import Dropbox from "next-auth/providers/dropbox"
import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
import GitLab from "next-auth/providers/gitlab"
import Google from "next-auth/providers/google"
import Hubspot from "next-auth/providers/hubspot"
import Keycloak from "next-auth/providers/keycloak"
import LinkedIn from "next-auth/providers/linkedin"
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id"
import Netlify from "next-auth/providers/netlify"
import Okta from "next-auth/providers/okta"
import Passage from "next-auth/providers/passage"
import Passkey from "next-auth/providers/passkey"
import Pinterest from "next-auth/providers/pinterest"
import Reddit from "next-auth/providers/reddit"
import Slack from "next-auth/providers/slack"
import Salesforce from "next-auth/providers/salesforce"
import Spotify from "next-auth/providers/spotify"
import Twitch from "next-auth/providers/twitch"
import Twitter from "next-auth/providers/twitter"
import Vipps from "next-auth/providers/vipps"
import WorkOS from "next-auth/providers/workos"
import Zoom from "next-auth/providers/zoom"
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  //adapter: UnstorageAdapter(storage),
  adapter: PrismaAdapter(prisma),
  providers: [
    Apple,
    // Atlassian,
    //Auth0,
    //AzureB2C,
    //BankIDNorway,
    // BoxyHQSAML({
    //   clientId: "dummy",
    //   clientSecret: "dummy",
    //   issuer: process.env.AUTH_BOXYHQ_SAML_ISSUER,
    // }),
    // Cognito,
    // Coinbase,
    // Discord,
    // Dropbox,
    // Facebook,
    GitHub,
    // GitLab,
    Google,
    // Hubspot,
    // Keycloak({ name: "Keycloak (bob/bob)" }),
    // LinkedIn,
    // MicrosoftEntraId,
    // Netlify,
    // Okta,
    // Passkey({
    //   formFields: {
    //     email: {
    //       label: "Username",
    //       required: true,
    //       autocomplete: "username webauthn",
    //     },
    //   },
    // }),
    // Passage,
    // Pinterest,
    // Reddit,
    // Salesforce,
    // Slack,
    // Spotify,
    // Twitch,
    // Twitter,
    // Vipps({
    //   issuer: "https://apitest.vipps.no/access-management-1.0/access/",
    // }),
    // WorkOS({ connection: process.env.AUTH_WORKOS_CONNECTION! }),
     Zoom,
     
  ],
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        })

        // New user - allow sign in
        if (!existingUser) return true

        // Existing user - check if this provider account exists
        if (existingUser.accounts.some(acc => acc.provider === account?.provider)) {
          return true
        }

        // Link new provider account to existing user
        if (account) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          })
          return true
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (token?.provider) {
        session.provider = token.provider
      }
      return session
    }
  },
  experimental: { enableWebAuthn: true },
})
declare module "next-auth" {
  interface Session {
    provider?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
