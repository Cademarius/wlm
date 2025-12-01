'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DistributionStats {
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    unspecified: number;
  };
  crushDistribution: {
    pending: number;
    matched: number;
    revealed: number;
  };
}

const GENDER_COLORS = {
  male: '#fbbf24',
  female: '#f59e0b',
  other: '#eab308',
  unspecified: '#6b7280',
};

const CRUSH_COLORS = {
  pending: '#fbbf24',
  matched: '#eab308',
  revealed: '#f59e0b',
};

export default function DistributionCharts() {
  const [stats, setStats] = useState<DistributionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            genderDistribution: data.genderDistribution,
            crushDistribution: data.crushDistribution,
          });
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Distribution par genre</h3>
          <div className="h-80 bg-gray-700 animate-pulse rounded"></div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Statut des crushs</h3>
          <div className="h-80 bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const genderData = [
    { name: 'Homme', value: stats.genderDistribution.male, color: GENDER_COLORS.male },
    { name: 'Femme', value: stats.genderDistribution.female, color: GENDER_COLORS.female },
    { name: 'Autre', value: stats.genderDistribution.other, color: GENDER_COLORS.other },
    { name: 'Non spécifié', value: stats.genderDistribution.unspecified, color: GENDER_COLORS.unspecified },
  ].filter(item => item.value > 0);

  const crushData = [
    { name: 'En attente', value: stats.crushDistribution.pending, color: CRUSH_COLORS.pending },
    { name: 'Matché', value: stats.crushDistribution.matched, color: CRUSH_COLORS.matched },
    { name: 'Révélé', value: stats.crushDistribution.revealed, color: CRUSH_COLORS.revealed },
  ].filter(item => item.value > 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
        <h3 className="text-lg font-bold text-gray-100 mb-4">Distribution par genre</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props) => {
                const { name, percent } = props as { name?: string; percent?: number };
                return `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`;
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #fbbf24', color: '#f3f4f6' }} />
            <Legend wrapperStyle={{ color: '#f3f4f6' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
        <h3 className="text-lg font-bold text-gray-100 mb-4">Statut des crushs</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={crushData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props) => {
                const { name, percent } = props as { name?: string; percent?: number };
                return `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`;
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {crushData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #fbbf24', color: '#f3f4f6' }} />
            <Legend wrapperStyle={{ color: '#f3f4f6' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
