import MatchesManagement from '@/app/[lang]/admin/components/MatchesManagement';

export default function AdminMatchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Gestion des matchs
        </h1>
        <p className="text-gray-600 mt-1">
          Liste de tous les matchs réalisés sur la plateforme
        </p>
      </div>

      <MatchesManagement />
    </div>
  );
}
