"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";

// Sparkline subtile en fond de StatCard
export function Sparkline({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <Area type="monotone" dataKey="value" stroke="currentColor" fill="currentColor" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Chart principal "Performance" (AreaChart)
export function TimelineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey="date" stroke="#a3a3a3" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
        <YAxis stroke="#a3a3a3" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{backgroundColor: '#ffffff', borderColor: '#e5e5e5', color: '#171717'}} itemStyle={{color: '#059669'}} />
        <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
        <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Revenus Mensuels (BarChart)
export function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey="month" stroke="#a3a3a3" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{backgroundColor: '#ffffff', borderColor: '#e5e5e5', color: '#171717'}} cursor={{fill: '#f5f5f5'}} />
        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Radar Performance (RadarChart)
export function RadarPerf({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#e5e5e5" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: '#737373', fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Score" dataKey="value" stroke="#059669" strokeWidth={2} fill="#059669" fillOpacity={0.4} />
        <Tooltip contentStyle={{backgroundColor: '#ffffff', borderColor: '#e5e5e5', color: '#171717'}} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
