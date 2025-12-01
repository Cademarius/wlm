'use client';

import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface DailyStats {
  date: string;
  users: number;
  matches: number;
}

export default function ActivityChart() {
  const [data, setData] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const result = await response.json();
          setData(result.dailyStats);
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
      <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-100">Activité (30 derniers jours)</h3>
        </div>
        <div className="h-80 bg-gray-700 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-100">Activité (30 derniers jours)</h3>
        <p className="text-sm text-gray-400">Évolution des inscriptions et des matchs</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              labelFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString('fr-FR');
              }}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #fbbf24',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                color: '#f3f4f6'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#fbbf24"
              name="Nouveaux utilisateurs"
              strokeWidth={3}
              dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="matches"
              stroke="#eab308"
              name="Nouveaux matchs"
              strokeWidth={3}
              dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
