import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/", // Page de connexion personnalisée
  },
  callbacks: {
    async signIn({ user, account }) {
      // Sauvegarder l'utilisateur dans Supabase via l'API
      if (account?.provider === "google" && user.email) {
        try {
          // Appeler l'API route pour sauvegarder l'utilisateur
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/sync-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              google_id: account.providerAccountId,
            }),
          });

          if (!response.ok) {
            console.error('Failed to sync user to Supabase');
          } else {
            const data = await response.json();
            console.log('User synced to Supabase:', data);
          }
        } catch (error) {
          console.error("Erreur lors de la sauvegarde de l'utilisateur:", error);
          // Continuer la connexion même si la sauvegarde échoue
        }
        // Mettre à jour le statut en ligne à true
        try {
          const getUserRes = await fetch(`${process.env.NEXTAUTH_URL}/api/get-user?email=${encodeURIComponent(user.email)}`);
          if (getUserRes.ok) {
            const userData = await getUserRes.json();
            if (userData.user && userData.user.id) {
              await fetch(`${process.env.NEXTAUTH_URL}/api/set-online`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userData.user.id, is_online: true }),
              });
            }
          }
        } catch (err) {
          console.error('Erreur lors de la mise à jour du statut en ligne:', err);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.userId = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        // Récupérer les données complètes de l'utilisateur depuis Supabase
        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/get-user?email=${encodeURIComponent(token.email as string)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              session.user.id = data.user.id;
              
              // Toujours mettre à jour le nom depuis Supabase (priorité absolue)
              if (data.user.name) {
                session.user.name = data.user.name;
              }
              
              // Mettre à jour l'image depuis Supabase (prioritaire sur Google)
              if (data.user.image) {
                session.user.image = data.user.image;
              }

              // Vérifier la complétion du profil (champs obligatoires)
              const isProfileComplete = !!(
                data.user.age &&
                data.user.location &&
                data.user.bio &&
                data.user.interests &&
                Array.isArray(data.user.interests) &&
                data.user.interests.length > 0
              );
              
              session.user.profileComplete = isProfileComplete;
              token.profileComplete = isProfileComplete;

              // Récupérer le nombre de reports de complétion
              session.user.profileCompletionSkips = data.user.profile_completion_skips || 0;
              token.profileCompletionSkips = data.user.profile_completion_skips || 0;
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
