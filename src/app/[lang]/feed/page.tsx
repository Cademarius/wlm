"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../components/AuthGuard";
import { Heart, Eye, ArrowRight } from "lucide-react";
import { type Language } from "@/lib/i18n/setting";

const Feed = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const { lang } = use(params);
  const { user } = useAuth();
  const [secrets, setSecrets] = useState(0);
  const [admirers, setAdmirers] = useState(0);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const [c, a] = await Promise.all([
          fetch(`/api/get-crushes?userId=${user.id}`).then((r) => r.json()),
          fetch(`/api/get-admirers?userId=${user.id}`).then((r) => r.json()),
        ]);
        setSecrets(c.count || 0);
        setAdmirers(a.count || 0);
      } catch {
        // ignore
      } finally {
        setStatsLoaded(true);
      }
    })();
  }, [user?.id]);

  const firstName = user?.name?.trim().split(" ")[0];

  return (
    <div className="w-full min-h-screen flex flex-col text-white">
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 mb-24 xl:mb-8 space-y-6">
        {/* Accueil personnalisé */}
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold">
            {firstName ? (
              <>
                Salut <span className="wlm-gradient-text">{firstName}</span> 👋
              </>
            ) : (
              <>Bienvenue 👋</>
            )}
          </h1>
          <p className="text-white/50 mt-1">Découvre qui t&apos;aime en secret.</p>
        </header>

        {/* Carte action principale */}
        <Link
          href={`/${lang}/addcrush`}
          className="wlm-card p-6 sm:p-8 flex flex-col items-center text-center gap-4 transition hover:scale-[1.01]"
        >
          <div className="h-20 w-20 rounded-full wlm-btn-gradient wlm-glow flex items-center justify-center animate-float">
            <Heart size={40} className="text-white fill-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Qui t&apos;aime en secret ?</h2>
          <p className="text-white/60 max-w-sm">
            Ajoute en secret les personnes que tu aimes. Si c&apos;est réciproque,
            c&apos;est révélé 💘
          </p>
          <span className="wlm-btn-gradient text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2">
            Ajouter en secret <ArrowRight size={18} />
          </span>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Link href={`/${lang}/addcrush`} className="wlm-card p-6 transition hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-xl wlm-glass flex items-center justify-center">
                <Heart size={18} className="text-[#FF5C8A]" />
              </div>
              <span className="text-white/70 text-sm">Mes secrets</span>
            </div>
            {statsLoaded ? (
              <div className="text-4xl font-bold wlm-gradient-text">{secrets}</div>
            ) : (
              <div className="h-10 w-12 rounded-lg bg-white/10 animate-pulse" />
            )}
          </Link>
          <Link href={`/${lang}/matchcrush`} className="wlm-card p-6 transition hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-xl wlm-glass flex items-center justify-center">
                <Eye size={18} className="text-[#B14DFF]" />
              </div>
              <span className="text-white/70 text-sm">Mes admirateurs</span>
            </div>
            {statsLoaded ? (
              <div className="text-4xl font-bold wlm-gradient-text">{admirers}</div>
            ) : (
              <div className="h-10 w-12 rounded-lg bg-white/10 animate-pulse" />
            )}
          </Link>
        </div>

        {/* Comment ça marche */}
        <section className="wlm-card p-6">
          <h3 className="font-semibold mb-4">Comment ça marche</h3>
          <ol className="space-y-3">
            {[
              { n: "1", t: "Ajoute un numéro", d: "La personne que tu aimes en secret — même si elle n'est pas inscrite." },
              { n: "2", t: "C'est 100% secret", d: "Elle ne saura jamais que c'est toi." },
              { n: "3", t: "Si c'est réciproque…", d: "Vous êtes prévenus tous les deux 💘" },
            ].map((s) => (
              <li key={s.n} className="flex items-start gap-3">
                <span className="h-7 w-7 shrink-0 rounded-full wlm-btn-gradient flex items-center justify-center text-sm font-bold">
                  {s.n}
                </span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className="text-white/55 text-sm">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
};

export default Feed;
