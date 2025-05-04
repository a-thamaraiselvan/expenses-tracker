import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ReportFilterValues } from './ReportFilters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ReportChartsProps {
  filters: ReportFilterValues;
}

export const ReportCharts: React.FC<ReportChartsProps> = ({ filters }) => {
  const [data, setData] = useState<any>(null);

  // Fetch live data from API (replace with actual API call)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/report-data'); // Replace with your API endpoint
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchData();
  }, [filters]);

  if (!data) {
    return <p>Loading...</p>; // Display loading state until data is fetched
  }

  // Time series data for income and expenses
  const timeSeriesData = {
    labels: data.labels, // Using the labels (e.g., months or categories)
    datasets: [
      ...(filters.type !== 'expense' ? [{
        label: 'Income',
        data: data.income, // Actual income data
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
      }] : []),
      ...(filters.type !== 'income' ? [{
        label: 'Expenses',
        data: data.expenses, // Actual expense data
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
      }] : []),
    ],
  };

  // Category data for doughnut chart
  const categoryData = {
    labels: data.labels, // Using the labels (e.g., categories or periods)
    datasets: [
      {
        data: filters.type === 'income' ? data.income :
              filters.type === 'expense' ? data.expenses : data.categoryData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset?.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', { // INR formatting
                style: 'currency',
                currency: 'INR',
              }).format(context.parsed.y || context.raw);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₹' + value.toLocaleString(); // Format as INR with ₹
          }
        }
      }
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Income vs Expenses Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Line options={options} data={timeSeriesData} height={100} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{filters.type === 'income' ? 'Income' : filters.type === 'expense' ? 'Expenses' : 'Income vs Expenses'} Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar options={options} data={timeSeriesData} height={250} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {filters.groupBy === 'category' 
              ? 'Expense by Category' 
              : filters.type === 'income' 
                ? 'Income Distribution' 
                : filters.type === 'expense' 
                  ? 'Expense Distribution' 
                  : 'Distribution by Period'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <Doughnut 
                data={categoryData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context: any) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          return `${label}: ₹${value.toFixed(2)}`; // INR format with ₹
                        }
                      }
                    }
                  }
                }} 
                height={250} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
