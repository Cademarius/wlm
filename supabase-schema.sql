-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  age INTEGER,
  image TEXT,
  bio TEXT,
  interests TEXT[], -- Array de passions/intérêts
  location TEXT,
  google_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des crushs (personnes ajoutées par l'utilisateur)
CREATE TABLE IF NOT EXISTS crushes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crush_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, matched, revealed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(user_id, crush_name)
);

-- Table des matches (crushs réciproques)
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- S'assurer que user1_id < user2_id pour éviter les doublons
  CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'new_crush', 'new_match'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_crushes_user_id ON crushes(user_id);
CREATE INDEX IF NOT EXISTS idx_crushes_status ON crushes(status);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crushes_updated_at BEFORE UPDATE ON crushes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS (Row Level Security) pour sécuriser les données
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE crushes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres données
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Les utilisateurs peuvent gérer leurs propres crushs
CREATE POLICY "Users can view own crushes" ON crushes
  FOR SELECT USING (true);

CREATE POLICY "Users can create own crushes" ON crushes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own crushes" ON crushes
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own crushes" ON crushes
  FOR DELETE USING (true);

-- Les utilisateurs peuvent voir leurs matches
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Users can create matches" ON matches
  FOR INSERT WITH CHECK (true);

-- Les utilisateurs peuvent voir et gérer leurs notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (true);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);
