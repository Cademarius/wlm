'use client';

import { useEffect, useState } from 'react';
import { Users, Heart, CheckCircle, Activity } from 'lucide-react';

interface StatsOverview {
  totalUsers: number;
  totalCrushes: number;
  totalMatches: number;
  usersOnline: number;
  newUsersLastWeek: number;
  newMatchesLastWeek: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data.overview);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: 'Utilisateurs Total',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: `+${stats.newUsersLastWeek} cette semaine`,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Crushs',
      value: stats.totalCrushes.toLocaleString(),
      icon: Heart,
      description: 'Crushs créés',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Matchs',
      value: stats.totalMatches.toLocaleString(),
      icon: CheckCircle,
      description: `+${stats.newMatchesLastWeek} cette semaine`,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'En Ligne',
      value: stats.usersOnline.toLocaleString(),
      icon: Activity,
      description: 'Utilisateurs actifs',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      gradient: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className={`h-12 w-12 rounded-lg bg-linear-to-br ${card.gradient} opacity-10`}></div>
            </div>
            <div className="text-3xl font-bold text-gray-100 mb-1">{card.value}</div>
            <p className="text-sm font-medium text-gray-200 mb-1">{card.title}</p>
            <p className="text-xs text-gray-400">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}
