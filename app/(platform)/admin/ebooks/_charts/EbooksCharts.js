"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

// ChartJS registration (inchangé) - déplacé ici pour le lazy-load
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

export function LineChart({ data, options }) {
  return <Line data={data} options={options} />;
}

export function BarChart({ data, options }) {
  return <Bar data={data} options={options} />;
}

export function DoughnutChart({ data, options }) {
  return <Doughnut data={data} options={options} />;
}
