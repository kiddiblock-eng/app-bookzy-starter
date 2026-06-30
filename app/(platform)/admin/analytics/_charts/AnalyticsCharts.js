"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Couleurs Charts
const PIE_COLORS = ["#059669", "#10b981", "#f59e0b", "#3b82f6", "#34d399", "#ec4899", "#f43f5e"];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-3 shadow-xl">
        <p className="text-neutral-700 text-xs font-bold mb-2 border-b border-neutral-200 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1">
            <span className="text-neutral-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}
            </span>
            <span className="text-neutral-900 font-mono font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function PerformanceAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
          <linearGradient id="gradEbooks" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
          <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey="date" stroke="#a3a3a3" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
        <YAxis stroke="#a3a3a3" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d4d4d4', strokeWidth: 1 }} />
        <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fill="url(#gradUsers)" />
        <Area type="monotone" dataKey="ebooks" stroke="#3b82f6" strokeWidth={2} fill="url(#gradEbooks)" />
        <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#gradRev)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TemplatesPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="template" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
          {data.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke="rgba(0,0,0,0)" />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
