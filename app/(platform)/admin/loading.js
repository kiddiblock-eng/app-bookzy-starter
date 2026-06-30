// Feedback INSTANTANÉ de navigation (Suspense) : s'affiche dès le clic pendant
// que la page serveur charge ses données — fini le "clic qui semble ignoré".
export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 bg-neutral-100 rounded-lg" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white border border-neutral-200 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-80 bg-white border border-neutral-200 rounded-2xl lg:col-span-2" />
        <div className="h-80 bg-white border border-neutral-200 rounded-2xl" />
      </div>
    </div>
  );
}
