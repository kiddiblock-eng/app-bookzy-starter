"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function AdminChart({ data }) {
  
  const chartData = {
    labels: data.map(i => i.date),
    datasets: [
      {
        label: "Ventes",
        data: data.map(i => i.sales),
        borderColor: "#00FF88",
        backgroundColor: "#00FF8844",
        tension: 0.3,
        fill: true
      }
    ]
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: { legend: { labels: { color: "white" } } },
        scales: {
          x: { ticks: { color: "white" } },
          y: { ticks: { color: "white" } }
        }
      }}
    />
  );
}