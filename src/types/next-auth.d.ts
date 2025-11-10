import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profileComplete?: boolean;
      profileCompletionSkips?: number;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    supabaseUserId?: string;
    accessToken?: string;
    profileComplete?: boolean;
    profileCompletionSkips?: number;
  }
}
