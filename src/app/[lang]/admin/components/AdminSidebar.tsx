'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Sparkles
} from 'lucide-react';

interface AdminSidebarProps {
  lang: string;
}

export default function AdminSidebar({ lang }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Vue d\'ensemble',
      href: `/${lang}/admin`,
      icon: LayoutDashboard,
      current: pathname === `/${lang}/admin`,
    },
    {
      name: 'Utilisateurs',
      href: `/${lang}/admin/users`,
      icon: Users,
      current: pathname === `/${lang}/admin/users`,
    },
    {
      name: 'Crushs',
      href: `/${lang}/admin/crushes`,
      icon: Heart,
      current: pathname === `/${lang}/admin/crushes`,
    },
    {
      name: 'Matchs',
      href: `/${lang}/admin/matches`,
      icon: Sparkles,
      current: pathname === `/${lang}/admin/matches`,
    },
  ];

  return (
    <>
      {/* Sidebar pour desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-linear-to-b from-gray-900 to-black px-6 pb-4 border-r border-yellow-500/20">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center">
            <Link href={`/${lang}/admin`} className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-gray-900" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-yellow-500">WhoLikeMe</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </Link>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-200
                            ${
                              item.current
                                ? 'bg-yellow-500 text-gray-900'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-500'
                            }
                          `}
                        >
                          <Icon
                            className={`h-5 w-5 shrink-0 ${
                              item.current ? 'text-gray-900' : 'text-gray-400 group-hover:text-yellow-500'
                            }`}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu button - à implémenter si nécessaire */}
    </>
  );
}
