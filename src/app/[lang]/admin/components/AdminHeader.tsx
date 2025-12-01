'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Bell, Search, Menu } from 'lucide-react';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-yellow-500/20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-800">
              <Menu className="w-6 h-6 text-gray-400" />
            </button>
            
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-100">
                Dashboard Admin
              </h2>
              <p className="text-xs text-gray-400">
                {currentTime.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {currentTime.toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-100">{user.name || 'Admin'}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Admin'}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-900"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-900">
                  <span className="text-gray-900 font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
