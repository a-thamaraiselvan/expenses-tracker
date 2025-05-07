import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useFinance } from '../../context/FinanceContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpenseByCategory: React.FC = () => {
  const { summary } = useFinance();

  // If data is missing or empty, show a message instead of the chart
  if (!summary || !summary.categoryTotals || summary.categoryTotals.length === 0) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-center text-gray-500">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  // Predefined colors for categories
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(199, 199, 199, 0.7)',
    'rgba(83, 102, 255, 0.7)',
    'rgba(255, 99, 255, 0.7)',
    'rgba(54, 162, 99, 0.7)',
  ];

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
    'rgba(255, 99, 255, 1)',
    'rgba(54, 162, 99, 1)',
  ];

  // Ensure categories and amounts are valid, and fallback to 0 if not valid
  const categories = summary.categoryTotals.map(item => item.category);
  const amounts = summary.categoryTotals.map(item => Number(item.amount) || 0);

  // Function to format currency in INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Chart data
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: backgroundColors.slice(0, categories.length),
        borderColor: borderColors.slice(0, categories.length),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const dataset = context.dataset;
            const dataArray = Array.isArray(dataset.data) ? dataset.data : [];
            const total = dataArray.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
      
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',  // Donut chart (inner radius)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center p-4">
        <div className="w-full max-w-xs">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
