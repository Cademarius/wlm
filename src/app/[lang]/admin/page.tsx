import StatsCards from '@/app/[lang]/admin/components/StatsCards';
import ActivityChart from '@/app/[lang]/admin/components/ActivityChart';
import DistributionCharts from '@/app/[lang]/admin/components/DistributionCharts';
import RecentActivity from '@/app/[lang]/admin/components/RecentActivity';
import TopMetrics from '@/app/[lang]/admin/components/TopMetrics';
import ConversionFunnel from '@/app/[lang]/admin/components/ConversionFunnel';

export default async function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header avec titre et période */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Vue d&apos;ensemble
          </h1>
          <p className="text-gray-600 mt-1">
            Tableau de bord complet de votre plateforme
          </p>
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500">
          <option>7 derniers jours</option>
          <option>30 derniers jours</option>
          <option>90 derniers jours</option>
          <option>Cette année</option>
        </select>
      </div>

      {/* KPIs principaux */}
      <StatsCards />

      {/* Top Metrics - Métriques de performance */}
      <TopMetrics />

      {/* Conversion Funnel */}
      <ConversionFunnel />

      {/* Graphique d'activité */}
      <ActivityChart />

      {/* Distribution et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DistributionCharts />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
