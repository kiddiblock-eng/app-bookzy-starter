import SettingsSidebar from "./_components/SettingsSidebar";

export default function SettingsLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#0a0a15] text-white">
      <SettingsSidebar />

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}