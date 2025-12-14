export default function AdminStatsCard({ icon, title, value }) {
  return (
    <div className="bg-[#111] p-5 rounded-xl border border-white/10 flex flex-col">
      <div className="text-green-400 mb-2">{icon}</div>
      <div className="text-gray-300">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}