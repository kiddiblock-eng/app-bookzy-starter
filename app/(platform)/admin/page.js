import { headers } from "next/headers";
import DashboardClient from "./DashboardClient";

// Données chargées CÔTÉ SERVEUR (la page arrive déjà remplie, plus de squelette au 1er affichage).
// Cache ~20s : quasi temps réel, sans retaper la base à chaque navigation.
async function getInitialData() {
  try {
    const h = headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") || (host?.startsWith("localhost") ? "http" : "https");
    const base = `${proto}://${host}`;
    const period = "30";
    const opts = {
      headers: { "x-admin-secret": process.env.ADMIN_SECRET || "" },
      next: { revalidate: 20 },
    };

    async function get(path) {
      try {
        const r = await fetch(`${base}${path}`, opts);
        const d = await r.json();
        return d?.success ? d.data : null;
      } catch {
        return null;
      }
    }

    const [
      dashboard, timelineRaw, recentUsers, recentEbooks, notifications,
      goals, topUsers, activityData, revenueData, performanceData,
    ] = await Promise.all([
      get("/api/admin/analytics/dashboard"),
      get(`/api/admin/analytics/timeline?period=${period}`),
      get("/api/admin/users/list?limit=5"),
      get("/api/admin/ebooks/list?limit=5"),
      get("/api/admin/analytics/notifications"),
      get("/api/admin/analytics/goals"),
      get("/api/admin/analytics/leaderboard?limit=5"),
      get("/api/admin/analytics/activity?days=7"),
      get("/api/admin/analytics/revenue-monthly?months=6"),
      get("/api/admin/analytics/performance"),
    ]);

    // Même transformation que côté client (timeline → {date, users, sales, total})
    const timeline = Array.isArray(timelineRaw)
      ? timelineRaw.map((item) => ({
          date: `${item._id.day}-${item._id.month}`,
          users: item.users || 0,
          sales: item.sales || 0,
          total: item.total || 0,
        }))
      : [];

    return {
      ok: !!dashboard, // si le pré-chargement échoue, le client bascule en fallback
      period,
      stats: dashboard || { totalUsers: 0, totalEbooks: 0, revenue: 0, totalSales: 0, activeNow: 0 },
      timeline,
      recentUsers: recentUsers || [],
      recentEbooks: recentEbooks || [],
      notifications: notifications || [],
      goals: goals || [],
      topUsers: topUsers || [],
      activityData: activityData || [],
      revenueData: revenueData || [],
      performanceData: performanceData || [],
    };
  } catch {
    return { ok: false }; // fallback total : le client chargera lui-même
  }
}

export default async function AdminDashboardPage() {
  const initial = await getInitialData();
  return <DashboardClient initial={initial} />;
}
