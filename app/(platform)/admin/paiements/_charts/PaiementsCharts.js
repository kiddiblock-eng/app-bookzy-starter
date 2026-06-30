"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export function RevenueChart({ data, options }) {
  return <Line data={data} options={options} />;
}

export function StatusChart({ data, options }) {
  return <Doughnut data={data} options={options} />;
}

export function CountryChart({ data, options }) {
  return <Bar data={data} options={options} />;
}
