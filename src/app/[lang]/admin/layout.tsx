import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminSidebar from '@/app/[lang]/admin/components/AdminSidebar';
import AdminHeader from '@/app/[lang]/admin/components/AdminHeader';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const session = await auth();
  const resolvedParams = await params;

  if (!session?.user?.email) {
    redirect(`/${resolvedParams.lang}`);
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!adminEmails.includes(session.user.email)) {
    redirect(`/${resolvedParams.lang}`);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-yellow-50">
      <AdminSidebar lang={resolvedParams.lang} />
      <div className="lg:pl-64">
        <AdminHeader user={session.user} />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
