"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register the necessary components for Pie Chart
ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeSalesChart = ({ data }) => {
  // Sort data by totalSales in descending order and take the top 5
  const top5Employees = [...data]
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  const chartData = {
    labels: top5Employees.map((employee) => employee.name),
    datasets: [
      {
        data: top5Employees.map((employee) => employee.totalSales),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default EmployeeSalesChart;
