// Types TypeScript pour Supabase
export interface User {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  image: string | null;
  bio: string | null;
  interests: string[] | null;
  location: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  google_id: string | null;
  created_at: string;
  updated_at: string;
  is_online?: boolean;
}

export interface Crush {
  id: string;
  user_id: string;
  crush_name: string;
  status: 'pending' | 'matched' | 'revealed';
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
}

// Types pour les requêtes
export interface CreateUserData {
  email: string;
  name?: string;
  image?: string;
  google_id?: string;
}

export interface CreateCrushData {
  user_id: string;
  crush_name: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      crushes: {
        Row: Crush;
        Insert: Omit<Crush, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Crush, 'id' | 'created_at' | 'updated_at'>>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'matched_at'>;
        Update: Partial<Omit<Match, 'id' | 'matched_at'>>;
      };
    };
  };
}
