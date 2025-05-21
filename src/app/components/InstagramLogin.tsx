"use client";

import { Instagram } from "lucide-react";
import { useState } from "react";

interface InstagramLoginProps {
  className?: string;
}

const InstagramLogin = ({ className }: InstagramLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Redirection vers l'endpoint d'authentification Instagram du backend
    window.location.href = process.env.NEXT_PUBLIC_API_URL + "/auth/instagram";
  };

  return (
    <button
      className={`flex items-center gap-2 ${className}`}
      onClick={handleLogin}
      disabled={isLoading}
    >
      <Instagram className="h-5 w-5" />
      {isLoading ? "Chargement..." : "Se connecter avec Instagram"}
    </button>
  );
};

export default InstagramLogin;
