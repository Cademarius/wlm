"use client";

import Link from "next/link";
import { Home, Heart, Eye } from "lucide-react";
import { type Language } from "@/lib/i18n/setting";

interface MobileNavBarProps {
  className?: string;
  activePage: string;
  params: { lang: Language };
}

const TABS = [
  { key: "feed", href: "feed", Icon: Home, label: "Accueil" },
  { key: "addcrush", href: "addcrush", Icon: Heart, label: "Secrets" },
  { key: "matchcrush", href: "matchcrush", Icon: Eye, label: "Admirateurs" },
];

const MobileNavBar = ({ className, activePage, params }: MobileNavBarProps) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 wlm-glass border-t border-white/10 ${className}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex justify-around items-center h-[68px] px-2 max-w-lg mx-auto">
        {TABS.map(({ key, href, Icon, label }) => {
          const active = activePage === key;
          return (
            <Link
              key={key}
              href={`/${params.lang}/${href}`}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center justify-center w-1/3 py-2 group touch-manipulation"
            >
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-2xl transition-all duration-300 ${
                  active
                    ? "wlm-btn-gradient wlm-glow scale-110"
                    : "bg-white/5 group-active:scale-90"
                }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-white" : "text-white/55"}
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-[11px] mt-1 font-medium transition-colors ${
                  active ? "text-[#FF5C8A]" : "text-white/45"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavBar;
