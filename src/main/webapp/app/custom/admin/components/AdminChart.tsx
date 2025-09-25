import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ChartData = { stage: string; count: number }[];

type AdminChartProps = {
  data: ChartData;
};

export const AdminChart = ({ data }: AdminChartProps) => {
  const chartData = {
    labels: data.map(item => item.stage),
    datasets: [
      {
        label: 'Opportunities',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
