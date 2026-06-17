import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPushNotification } from "@/lib/sendPushNotification";
import { sendSecretAdmirerInvite } from "@/lib/sendSecretAdmirerInvite";

/**
 * Ajoute "quelqu'un qu'on aime en secret" PAR NUMÉRO (E.164), même si la
 * personne n'est pas encore inscrite. Détecte un match réciproque fiable
 * (basé sur le numéro), et notifie. La relance WhatsApp des non-inscrits
 * est gérée à part (voir tâche relance virale).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, crushPhone, crushUserId, crushLabel } = body as {
      userId?: string;
      crushPhone?: string;
      crushUserId?: string;
      crushLabel?: string;
    };

    if (!userId || (!crushPhone && !crushUserId)) {
      return NextResponse.json(
        { error: "userId et un numéro (ou crushUserId) sont requis" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Résoudre le numéro cible : soit fourni directement, soit via l'id d'un inscrit
    let phone = crushPhone?.trim();
    if (!phone && crushUserId) {
      const { data: target } = await supabase
        .from("users")
        .select("phone")
        .eq("id", crushUserId)
        .maybeSingle();
      if (!target?.phone) {
        return NextResponse.json(
          { error: "Cette personne n'a pas de numéro vérifié." },
          { status: 400 }
        );
      }
      phone = target.phone;
    }
    if (!phone) {
      return NextResponse.json({ error: "Numéro cible manquant" }, { status: 400 });
    }

    // Normalisation : chiffres uniquement (Supabase stocke le téléphone sans "+")
    // → garantit que crush_phone matche users.phone (sinon aucun match ne se déclenche).
    phone = phone.replace(/\D/g, "");

    // Utilisateur courant (son numéro + son quota)
    const { data: currentUser, error: currentErr } = await supabase
      .from("users")
      .select("id, phone, name, crush_slots")
      .eq("id", userId)
      .single();

    if (currentErr || !currentUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // On ne peut pas s'aimer soi-même 🙂
    if (currentUser.phone && currentUser.phone === phone) {
      return NextResponse.json(
        { error: "Tu ne peux pas t'ajouter toi-même !" },
        { status: 400 }
      );
    }

    // Quota de slots (gratuit = crush_slots, défaut 5)
    const { count: existingCount } = await supabase
      .from("crushes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const slots = currentUser.crush_slots ?? 5;
    if ((existingCount ?? 0) >= slots) {
      return NextResponse.json(
        { error: "limite_atteinte", slots },
        { status: 402 }
      );
    }

    // Insérer le secret (l'index unique (user_id, crush_phone) bloque les doublons)
    const { data: newCrush, error: insertError } = await supabase
      .from("crushes")
      .insert({
        user_id: userId,
        crush_phone: phone,
        crush_name: crushLabel?.trim() || null,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Tu as déjà ajouté ce numéro." },
          { status: 409 }
        );
      }
      console.error("Erreur insertion crush:", insertError);
      return NextResponse.json({ error: "Échec de l'ajout" }, { status: 500 });
    }

    // La cible est-elle déjà inscrite ?
    const { data: targetUser } = await supabase
      .from("users")
      .select("id, name")
      .eq("phone", phone)
      .maybeSingle();

    let isMatch = false;

    if (targetUser) {
      // Notifier la cible : "quelqu'un t'aime en secret" (sans révéler qui)
      await supabase.from("notifications").insert({
        user_id: targetUser.id,
        type: "new_crush",
        title: "👀 Quelqu'un t'aime en secret",
        title_en: "👀 Someone likes you in secret",
        message: "Inscris ton crush pour savoir si c'est réciproque 💘",
        message_en: "Add your crush to find out if it's mutual 💘",
        from_user_id: userId,
        is_read: false,
      });
      await sendPushNotification(targetUser.id, {
        title: "👀 Quelqu'un t'aime en secret",
        body: "Découvre si c'est réciproque 💘",
      });

      // Réciprocité : la cible a-t-elle un secret sur MON numéro ?
      const { data: reverseCrush } = await supabase
        .from("crushes")
        .select("id")
        .eq("user_id", targetUser.id)
        .eq("crush_phone", currentUser.phone ?? "")
        .maybeSingle();

      if (reverseCrush && currentUser.phone) {
        isMatch = true;

        // Créer le match (ids triés pour éviter les doublons symétriques)
        const [user1, user2] = [userId, targetUser.id].sort();
        await supabase.from("matches").insert({ user1_id: user1, user2_id: user2 });

        // Passer les deux secrets en "matched"
        await supabase.from("crushes").update({ status: "matched" }).eq("id", newCrush.id);
        await supabase.from("crushes").update({ status: "matched" }).eq("id", reverseCrush.id);

        // Notifier les deux (révélation)
        await supabase.from("notifications").insert([
          {
            user_id: userId,
            type: "new_match",
            title: "💘 C'est réciproque !",
            title_en: "💘 It's mutual!",
            message: `${targetUser.name || "Quelqu'un"} t'aime aussi en secret !`,
            message_en: `${targetUser.name || "Someone"} likes you back!`,
            from_user_id: targetUser.id,
            is_read: false,
          },
          {
            user_id: targetUser.id,
            type: "new_match",
            title: "💘 C'est réciproque !",
            title_en: "💘 It's mutual!",
            message: `${currentUser.name || "Quelqu'un"} t'aime aussi en secret !`,
            message_en: `${currentUser.name || "Someone"} likes you back!`,
            from_user_id: userId,
            is_read: false,
          },
        ]);
        await sendPushNotification(userId, {
          title: "💘 C'est réciproque !",
          body: `${targetUser.name || "Quelqu'un"} t'aime aussi en secret !`,
        });
        await sendPushNotification(targetUser.id, {
          title: "💘 C'est réciproque !",
          body: `${currentUser.name || "Quelqu'un"} t'aime aussi en secret !`,
        });
      }
    } else {
      // Cible non inscrite → invitation virale par WhatsApp (anti-spam intégré).
      // On ne révèle jamais l'identité de l'admirateur.
      try {
        await sendSecretAdmirerInvite(phone);
      } catch (e) {
        console.error("Invite virale échouée:", e);
      }
    }

    return NextResponse.json({
      success: true,
      match: isMatch,
      registered: !!targetUser,
      message: isMatch
        ? "💘 C'est réciproque !"
        : "Ajouté en secret 🤫",
    });
  } catch (e) {
    console.error("Erreur add-crush:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
