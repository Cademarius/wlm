import ProfileCompletionModal from './components/ProfileCompletionModal';

export default async function LangLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  return (
    <>
      {children}
      <ProfileCompletionModal lang={resolvedParams.lang} />
    </>
  );
}