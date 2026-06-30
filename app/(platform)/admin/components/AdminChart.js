"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

export default function AdminChart({ data }) {
  const chartData = {
    labels: data.map((i) => i.date),
    datasets: [
      {
        label: "Ventes",
        data: data.map((i) => i.sales),
        borderColor: "#059669",
        backgroundColor: "rgba(5,150,105,0.10)",
        pointBackgroundColor: "#059669",
        tension: 0.35,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#6b7280" }, grid: { display: false } },
          y: { ticks: { color: "#6b7280" }, grid: { color: "#f1f5f9" } },
        },
      }}
    />
  );
}
