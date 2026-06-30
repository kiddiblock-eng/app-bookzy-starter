export default function AdminStatsCard({ icon, title, value }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
        {icon}
      </div>
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-2xl font-bold text-neutral-900 mt-1">{value}</div>
    </div>
  );
}
