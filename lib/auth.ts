import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar.events",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // On initial sign-in, `user` and `account` are populated.
      // `user.id` is the Prisma User.id created/found by the adapter —
      // this is the only reliable place to capture it for JWT sessions.
      if (user) {
        token.id = user.id;
      }

      // `account` is populated on EVERY fresh OAuth sign-in (not just the
      // very first one ever). This is also the only place we ever see
      // Google's freshly issued access_token / refresh_token.
      //
      // IMPORTANT: PrismaAdapter's linkAccount() only INSERTS a row into
      // the Account table the first time this Google account is ever
      // linked to a user. On every later sign-in, Auth.js skips
      // linkAccount entirely — it does NOT update the stored tokens.
      // Since syncWorkSessions.ts reads tokens straight out of the
      // Account table, that row would otherwise keep serving whatever
      // tokens existed after your very first login, forever — even
      // after Google expires or revokes them. We persist the fresh
      // tokens here so the DB never goes stale.
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpiresAt = account.expires_at;
        token.providerAccountId = account.providerAccountId;

        try {
          await db.account.update({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            data: {
              access_token: account.access_token,
              // Google doesn't always resend a refresh_token (only on
              // first consent or forced re-consent) — never overwrite a
              // good stored refresh_token with undefined/null.
              ...(account.refresh_token
                ? { refresh_token: account.refresh_token }
                : {}),
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          });
        } catch (err) {
          // Don't block sign-in on this — but make sure it's loud in logs,
          // since a silent failure here reproduces the exact bug we're fixing.
          console.error(
            `[auth] Failed to persist refreshed Google tokens for account ${account.providerAccountId}:`,
            err
          );
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Without this, session.user.id is undefined on every API route
      // that depends on it (onboarding, availability, assessment, etc).
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { auth, handlers, signIn, signOut };
