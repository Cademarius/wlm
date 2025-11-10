import ProfileCompletionModal from './components/ProfileCompletionModal';

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProfileCompletionModal />
    </>
  );
}