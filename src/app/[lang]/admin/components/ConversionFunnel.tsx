'use client';

import { useEffect, useState } from 'react';
import { Users, Heart, CheckCircle, ArrowRight } from 'lucide-react';

interface FunnelData {
  totalUsers: number;
  usersWithCrush: number;
  usersWithMatches: number;
  conversionRate: number;
}

export default function ConversionFunnel() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const stats = await response.json();
          
          // Simuler les données du funnel (à remplacer par de vraies requêtes)
          const totalUsers = stats.overview.totalUsers || 0;
          
          // Estimation: environ 70% des users ont créé au moins 1 crush
          const usersWithCrush = Math.floor(totalUsers * 0.7);
          // Estimation: environ 40% des users avec crushs ont eu un match
          const usersWithMatches = Math.floor(usersWithCrush * 0.4);
          
          const conversionRate = totalUsers > 0 ? (usersWithMatches / totalUsers) * 100 : 0;

          setData({
            totalUsers,
            usersWithCrush,
            usersWithMatches,
            conversionRate,
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
        <div className="h-64 bg-gray-700 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!data) return null;

  const stages = [
    {
      title: 'Utilisateurs Inscrits',
      value: data.totalUsers,
      percentage: 100,
      icon: Users,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Ont créé un Crush',
      value: data.usersWithCrush,
      percentage: data.totalUsers > 0 ? (data.usersWithCrush / data.totalUsers) * 100 : 0,
      icon: Heart,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Ont obtenu un Match',
      value: data.usersWithMatches,
      percentage: data.totalUsers > 0 ? (data.usersWithMatches / data.totalUsers) * 100 : 0,
      icon: CheckCircle,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-100">Funnel de Conversion</h3>
          <p className="text-sm text-gray-400">Parcours utilisateur de l&apos;inscription au match</p>
        </div>
        <div className="px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-xs text-gray-400">Taux de conversion global</p>
          <p className="text-2xl font-bold text-yellow-500">
            {data.conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={index} className="relative">
              <div className="bg-gray-700 rounded-lg p-5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <div className={`inline-flex p-3 rounded-lg ${stage.bgColor} mb-3`}>
                  <Icon className="w-6 h-6 text-yellow-500" />
                </div>
                
                <p className="text-sm font-medium text-gray-400 mb-1">{stage.title}</p>
                <p className="text-3xl font-bold text-gray-100 mb-2">
                  {stage.value.toLocaleString()}
                </p>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-300">
                    {stage.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Flèche entre les étapes */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
