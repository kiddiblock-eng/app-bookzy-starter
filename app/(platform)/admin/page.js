import { NextRequest } from "next/server";
import DashboardClient from "./DashboardClient";

// Logique des routes admin appelée EN INTERNE (in-process, sans HTTP) :
// même logique testée, mais zéro auto-appel réseau (donc pas de sérialisation
// pathologique en dev) et pas d'aller-retour inutile.
import { GET as dashboardGET } from "@/app/api/admin/analytics/dashboard/route";
import { GET as timelineGET } from "@/app/api/admin/analytics/timeline/route";
import { GET as usersListGET } from "@/app/api/admin/users/list/route";
import { GET as ebooksListGET } from "@/app/api/admin/ebooks/list/route";
import { GET as notificationsGET } from "@/app/api/admin/analytics/notifications/route";
import { GET as goalsGET } from "@/app/api/admin/analytics/goals/route";
import { GET as leaderboardGET } from "@/app/api/admin/analytics/leaderboard/route";
import { GET as activityGET } from "@/app/api/admin/analytics/activity/route";
import { GET as revenueGET } from "@/app/api/admin/analytics/revenue-monthly/route";
import { GET as performanceGET } from "@/app/api/admin/analytics/performance/route";

export const dynamic = "force-dynamic";

const SECRET = process.env.ADMIN_SECRET || "";

// Appel in-process d'une route avec auth admin (x-admin-secret).
async function call(handler, path) {
  try {
    const req = new NextRequest(`http://internal${path}`, {
      headers: { "x-admin-secret": SECRET },
    });
    const res = await handler(req);
    const d = await res.json();
    return d?.success ? d.data : null;
  } catch {
    return null;
  }
}

// Cache mémoire ~20s (quasi temps réel, navigations instantanées).
let _cache = { at: 0, data: null };

async function getInitialData() {
  const now = Date.now();
  if (_cache.data && now - _cache.at < 20000) return _cache.data;

  const [
    dashboard, timelineRaw, recentUsers, recentEbooks, notifications,
    goals, topUsers, activityData, revenueData, performanceData,
  ] = await Promise.all([
    call(dashboardGET, "/api/admin/analytics/dashboard"),
    call(timelineGET, "/api/admin/analytics/timeline?period=30"),
    call(usersListGET, "/api/admin/users/list?limit=5"),
    call(ebooksListGET, "/api/admin/ebooks/list?limit=5"),
    call(notificationsGET, "/api/admin/analytics/notifications"),
    call(goalsGET, "/api/admin/analytics/goals"),
    call(leaderboardGET, "/api/admin/analytics/leaderboard?limit=5"),
    call(activityGET, "/api/admin/analytics/activity?days=7"),
    call(revenueGET, "/api/admin/analytics/revenue-monthly?months=6"),
    call(performanceGET, "/api/admin/analytics/performance"),
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

  const data = {
    ok: !!dashboard, // si le pré-chargement échoue, le client bascule en fallback
    period: "30",
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

  if (data.ok) _cache = { at: now, data }; // on ne met pas en cache les échecs
  return data;
}

export default async function AdminDashboardPage() {
  const initial = await getInitialData();
  return <DashboardClient initial={initial} />;
}
