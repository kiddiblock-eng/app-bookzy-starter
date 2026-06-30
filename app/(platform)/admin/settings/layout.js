import SettingsSidebar from "./_components/SettingsSidebar";

export default function SettingsLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      <SettingsSidebar />

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
