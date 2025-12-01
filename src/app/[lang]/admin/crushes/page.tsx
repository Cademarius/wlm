import CrushesManagement from '@/app/[lang]/admin/components/CrushesManagement';

export default function AdminCrushesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Gestion des crushs
        </h1>
        <p className="text-gray-600 mt-1">
          Liste de tous les crushs créés sur la plateforme
        </p>
      </div>

      <CrushesManagement />
    </div>
  );
}
