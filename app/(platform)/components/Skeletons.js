export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-pulse">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* HERO SECTION SKELETON */}
        <div className="h-64 bg-slate-200 rounded-2xl w-full border border-slate-300"></div>

        {/* QUICK LINKS SKELETON */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl border border-slate-300"></div>
          ))}
        </div>

        {/* MAIN CONTENT SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl border border-slate-300"></div>
          <div className="space-y-4">
             <div className="h-40 bg-slate-200 rounded-2xl border border-slate-300"></div>
             <div className="h-40 bg-slate-200 rounded-2xl border border-slate-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-72 bg-slate-200 rounded-2xl border border-slate-300"></div>
        ))}
    </div>
  );
}