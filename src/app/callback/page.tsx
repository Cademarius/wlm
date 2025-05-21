"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface InstagramUser {
  instagram_id: string;
  username: string;
}

const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userParam = searchParams.get("user");
    
    if (!userParam) {
      setError("Aucune information utilisateur n'a été reçue");
      return;
    }

    try {
      // Analyser les informations de l'utilisateur depuis l'URL
      const userData: InstagramUser = JSON.parse(userParam);
      
      // Stocker les informations de l'utilisateur dans le localStorage (ou utiliser un gestionnaire d'état global)
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Redirection vers la page d'accueil après une courte attente
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setError("Impossible de traiter les données utilisateur");
      console.error("Error parsing user data:", err);
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Erreur d&apos;authentification
          </h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <h1 className="mt-4 text-2xl font-bold">Connexion réussie!</h1>
          <p className="mt-2 text-gray-600">
            Vous allez être redirigé vers l&apos;accueil dans un instant...
          </p>
        </div>
      )}
    </div>
  );
};

export default CallbackPage;
