import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Récupérer et décoder le code OAuth
        const code = request.nextUrl.searchParams.get("code");
        if (!code) {
            return NextResponse.json({ message: "Vous n'avez pas accepté l'authentification." }, { status: 400 });
        }
        const decodedCode = decodeURIComponent(code);
        console.log("Code OAuth reçu :", decodedCode);

        // Vérification des variables d'environnement
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            return NextResponse.json({ error: "Erreur serveur : Variables d'environnement manquantes." }, { status: 500 });
        }

        // Requête pour obtenir l'access token
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: decodedCode,
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();
        console.log("Réponse Google Token API :", data);

        if (!response.ok) {
            return NextResponse.json({ error: `Erreur Google OAuth : ${data.error_description || "Erreur inconnue"}` }, { status: 400 });
        }

        // Requête pour obtenir les infos utilisateur
        const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: { Authorization: `Bearer ${data.access_token}` },
            method: "GET",
        });

        if (!userResponse.ok) {
            throw new Error("Impossible de récupérer les informations utilisateur.");
        }

        const user = await userResponse.json();
        console.log("Utilisateur récupéré :", user);

        // Envoi des données à ton backend (remplace l'URL de ton backend par la bonne)
        const backendResponse = await fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                googleUserData: user,
                accessToken: data.access_token, // Tu peux aussi envoyer l'access_token si nécessaire
            }),
        });

        if (!backendResponse.ok) {
            throw new Error("Impossible d'envoyer les données au backend.");
        }

        // Retourner la réponse du backend ou un message de succès
        return NextResponse.json({ message: "Données envoyées avec succès au backend" });

    } catch (error) {
        console.error("Erreur OAuth Google :", error);
        return NextResponse.json({ error: "Erreur lors de l'authentification." }, { status: 500 });
    }
}
