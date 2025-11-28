import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendPushNotification } from '@/lib/sendPushNotification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, crushUserId } = body;

    if (!userId || !crushUserId) {
      return NextResponse.json(
        { error: "userId and crushUserId are required" },
        { status: 400 }
      );
    }

    // Vérifier qu'on n'essaie pas de se crush soi-même
    if (userId === crushUserId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas vous ajouter vous-même !" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Récupérer les informations du crush (nom et email pour identification)
    const { data: crushUser, error: crushError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("id", crushUserId)
      .single();

    if (crushError || !crushUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si ce crush existe déjà
    const { data: existingCrush } = await supabase
      .from("crushes")
      .select("id")
      .eq("user_id", userId)
      .eq("crush_name", crushUser.email) // On utilise l'email comme identifiant unique
      .single();

    if (existingCrush) {
      return NextResponse.json(
        { error: "Vous avez déjà ajouté cette personne à vos crushs" },
        { status: 409 }
      );
    }

    // Récupérer les informations de l'utilisateur qui ajoute le crush
    const { data: currentUser } = await supabase
      .from("users")
      .select("name")
      .eq("id", userId)
      .single();

    // Ajouter le crush
    const { data: newCrush, error: insertError } = await supabase
      .from("crushes")
      .insert({
        user_id: userId,
        crush_name: crushUser.email,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Erreur lors de l'ajout du crush" },
        { status: 500 }
      );
    }

    // Créer une notification pour la personne ajoutée
    await supabase
      .from("notifications")
      .insert({
        user_id: crushUserId,
        type: "new_crush",
        title: "Nouveau crush !",
        title_en: "New crush!",
        message: `Un utilisateur crush sur vous 💕`,
        message_en: `Someone has a crush on you 💕`,
        from_user_id: userId,
        is_read: false,
      });
    // Envoi push pour la notification "new_crush"
    await sendPushNotification(crushUserId, {
      title: "Nouveau crush !",
      body: `Un utilisateur crush sur vous 💕`
    });

    // Vérifier si c'est un match (l'autre personne nous a déjà ajouté)
    const { data: reverseCrush } = await supabase
      .from("crushes")
      .select("id, user_id")
      .eq("user_id", crushUserId)
      .eq("crush_name", (await supabase
        .from("users")
        .select("email")
        .eq("id", userId)
        .single()
      ).data?.email || "")
      .single();

    if (reverseCrush) {
      // C'est un match ! Créer l'entrée dans la table matches
      const [user1, user2] = [userId, crushUserId].sort();
      
      await supabase
        .from("matches")
        .insert({
          user1_id: user1,
          user2_id: user2,
        });

  // 23505 = duplicate key (match déjà existant)

      // Mettre à jour le statut des deux crushs à "matched"
      await supabase
        .from("crushes")
        .update({ status: "matched" })
        .eq("id", newCrush.id);

      await supabase
        .from("crushes")
        .update({ status: "matched" })
        .eq("id", reverseCrush.id);

      // Créer une notification de match pour les deux utilisateurs
      await supabase
        .from("notifications")
        .insert([
          {
            user_id: userId,
            type: "new_match",
            title: "C'est un match ! 🎉",
            title_en: "It's a match! 🎉",
            message: `Vous et ${crushUser.name} vous êtes mutuellement ajoutés !`,
            message_en: `You and ${crushUser.name} have mutually added each other!`,
            from_user_id: crushUserId,
            is_read: false,
          },
          {
            user_id: crushUserId,
            type: "new_match",
            title: "C'est un match ! 🎉",
            title_en: "It's a match! 🎉",
            message: `Vous et ${currentUser?.name || "quelqu'un"} vous êtes mutuellement ajoutés !`,
            message_en: `You and ${currentUser?.name || "someone"} have mutually added each other!`,
            from_user_id: userId,
            is_read: false,
          },
        ]);
      // Envoi push pour les notifications de match
      await sendPushNotification(userId, {
        title: "C'est un match ! 🎉",
        body: `Vous et ${crushUser.name} vous êtes mutuellement ajoutés !`
      });
      await sendPushNotification(crushUserId, {
        title: "C'est un match ! 🎉",
        body: `Vous et ${currentUser?.name || "quelqu'un"} vous êtes mutuellement ajoutés !`
      });

      return NextResponse.json({
        success: true,
        match: true,
        message: "🎉 C'est un match ! Vous vous êtes mutuellement ajoutés !",
      });
    }

    return NextResponse.json({
      success: true,
      match: false,
      message: "Crush ajouté avec succès !",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
