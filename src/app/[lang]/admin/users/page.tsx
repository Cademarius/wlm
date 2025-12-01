import UsersManagement from '@/app/[lang]/admin/components/UsersManagement';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600 mt-1">
          Liste complète des utilisateurs de la plateforme
        </p>
      </div>

      <UsersManagement />
    </div>
  );
}
