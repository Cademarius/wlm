import { createClient } from '@/lib/supabase/client';
import type { User, Crush, Match, CreateCrushData } from '@/types/database';

// ============================================
// Fonctions pour les utilisateurs
// ============================================

/**
 * Récupérer un utilisateur par son email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }

  return data;
}

/**
 * Récupérer un utilisateur par son ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }

  return data;
}

/**
 * Mettre à jour les informations d'un utilisateur
 */
export async function updateUser(userId: string, updates: Partial<User>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }

  return data;
}

// ============================================
// Fonctions pour les crushs
// ============================================

/**
 * Ajouter un nouveau crush
 */
export async function addCrush(crushData: CreateCrushData): Promise<Crush | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('crushes')
    .insert({
      user_id: crushData.user_id,
      crush_name: crushData.crush_name,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de l\'ajout du crush:', error);
    return null;
  }

  // Vérifier si c'est un match réciproque
  await checkForMatch(crushData.user_id, crushData.crush_name);

  return data;
}

/**
 * Récupérer tous les crushs d'un utilisateur
 */
export async function getUserCrushes(userId: string): Promise<Crush[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('crushes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des crushs:', error);
    return [];
  }

  return data || [];
}

/**
 * Supprimer un crush
 */
export async function deleteCrush(crushId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('crushes')
    .delete()
    .eq('id', crushId);

  if (error) {
    console.error('Erreur lors de la suppression du crush:', error);
    throw error;
  }
}

/**
 * Vérifier s'il y a un match réciproque
 */
async function checkForMatch(userId: string, crushName: string) {
  const supabase = createClient();

  // Récupérer l'utilisateur actuel
  const { data: currentUser } = await supabase
    .from('users')
    .select('name, email')
    .eq('id', userId)
    .single();

  if (!currentUser) return;

  // Chercher si quelqu'un d'autre a crushé sur l'utilisateur actuel
  const { data: reciprocalCrushes } = await supabase
    .from('crushes')
    .select('user_id, crushes!inner(*)')
    .eq('crush_name', currentUser.name || currentUser.email)
    .neq('user_id', userId);

  // Vérifier si l'utilisateur actuel a également crushé sur cette personne
  if (reciprocalCrushes && reciprocalCrushes.length > 0) {
    for (const crush of reciprocalCrushes) {
      const { data: matchingCrush } = await supabase
        .from('crushes')
        .select('*')
        .eq('user_id', userId)
        .eq('crush_name', crushName)
        .single();

      if (matchingCrush) {
        // C'est un match ! Créer une entrée dans la table matches
        const [user1Id, user2Id] = [userId, crush.user_id].sort();
        
        await supabase.from('matches').insert({
          user1_id: user1Id,
          user2_id: user2Id,
        });

        // Mettre à jour le statut des crushs
        await supabase
          .from('crushes')
          .update({ status: 'matched' })
          .eq('id', matchingCrush.id);

        await supabase
          .from('crushes')
          .update({ status: 'matched' })
          .eq('user_id', crush.user_id)
          .eq('crush_name', currentUser.name || currentUser.email);
      }
    }
  }
}

// ============================================
// Fonctions pour les matches
// ============================================

/**
 * Récupérer tous les matches d'un utilisateur
 */
export async function getUserMatches(userId: string): Promise<Match[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('matched_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des matches:', error);
    return [];
  }

  return data || [];
}

/**
 * Récupérer les détails des matches avec les infos des utilisateurs
 */
export async function getUserMatchesWithDetails(userId: string) {
  const matches = await getUserMatches(userId);
  
  const matchesWithUsers = await Promise.all(
    matches.map(async (match) => {
      const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
      const otherUser = await getUserById(otherUserId);
      
      return {
        ...match,
        otherUser,
      };
    })
  );

  return matchesWithUsers;
}

/**
 * Compter le nombre de crushs par statut
 */
export async function getCrushesStats(userId: string) {
  const crushes = await getUserCrushes(userId);

  return {
    pending: crushes.filter(c => c.status === 'pending').length,
    matched: crushes.filter(c => c.status === 'matched').length,
    total: crushes.length,
  };
}
