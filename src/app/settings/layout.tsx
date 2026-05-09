// Force dynamic rendering for settings page to avoid cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
