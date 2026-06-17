import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyKkiapayTransaction } from "@/lib/kkiapay";
import { sendSecretAdmirerInvite } from "@/lib/sendSecretAdmirerInvite";
import {
  expectedAmount,
  SLOTS_PACK,
  type ProductKind,
  type HintType,
} from "@/lib/products";

/**
 * Confirme un paiement KkiaPay et accorde le produit.
 * Le client envoie le transactionId ; le serveur revérifie tout.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, transactionId, product, hintType, crushId, phone } =
      body as {
        userId?: string;
        transactionId?: string;
        product?: ProductKind;
        hintType?: HintType;
        crushId?: string;
        phone?: string;
      };

    if (!userId || !transactionId || !product) {
      return NextResponse.json(
        { error: "userId, transactionId et product sont requis" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // Idempotence : transaction déjà traitée ?
    const { data: existing } = await supabase
      .from("purchases")
      .select("id, status")
      .eq("transaction_id", transactionId)
      .maybeSingle();
    if (existing?.status === "confirmed") {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // 1) Vérifier la transaction auprès de KkiaPay
    const verif = await verifyKkiapayTransaction(transactionId);
    if (!verif.ok) {
      await supabase.from("purchases").insert({
        user_id: userId,
        product,
        amount: 0,
        status: "failed",
        transaction_id: transactionId,
        metadata: { hintType, crushId, phone, error: verif.error },
      });
      return NextResponse.json(
        { error: "Paiement non validé", detail: verif.error },
        { status: 402 }
      );
    }

    // 2) Le montant payé couvre-t-il le prix attendu ?
    const due = expectedAmount(product, hintType);
    if (due == null || (verif.amount ?? 0) < due) {
      return NextResponse.json(
        { error: "Montant insuffisant" },
        { status: 402 }
      );
    }

    // 3) Accorder le produit
    if (product === "slots") {
      const { data: u } = await supabase
        .from("users")
        .select("crush_slots")
        .eq("id", userId)
        .single();
      const current = u?.crush_slots ?? 5;
      await supabase
        .from("users")
        .update({ crush_slots: current + SLOTS_PACK.slots })
        .eq("id", userId);
    } else if (product === "hint") {
      if (!crushId || !hintType) {
        return NextResponse.json(
          { error: "crushId et hintType requis pour un indice" },
          { status: 400 }
        );
      }
      await supabase
        .from("unlocked_hints")
        .upsert(
          { user_id: userId, crush_id: crushId, hint_type: hintType },
          { onConflict: "user_id,crush_id,hint_type" }
        );
    } else if (product === "boost") {
      if (!phone) {
        return NextResponse.json(
          { error: "phone requis pour un boost" },
          { status: 400 }
        );
      }
      await sendSecretAdmirerInvite(phone, true);
    }

    // 4) Historiser l'achat confirmé
    await supabase.from("purchases").insert({
      user_id: userId,
      product,
      amount: verif.amount ?? due,
      status: "confirmed",
      transaction_id: transactionId,
      metadata: { hintType, crushId, phone },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erreur payments/confirm:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
