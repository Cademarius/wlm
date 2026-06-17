import { redirect } from 'next/navigation';
import { getServerAuthUser, isAdminPhone } from '@/lib/supabase/serverAuth';
import AdminSidebar from '@/app/[lang]/admin/components/AdminSidebar';
import AdminHeader from '@/app/[lang]/admin/components/AdminHeader';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const authUser = await getServerAuthUser();
  const resolvedParams = await params;

  if (!authUser) {
    redirect(`/${resolvedParams.lang}`);
  }

  if (!isAdminPhone(authUser.phone)) {
    redirect(`/${resolvedParams.lang}`);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50" style={{ colorScheme: "light" }}>
      <AdminSidebar lang={resolvedParams.lang} />
      <div className="lg:pl-64">
        <AdminHeader user={{ name: authUser.phone, email: authUser.phone }} />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
