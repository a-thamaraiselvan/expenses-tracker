import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonthlySummaryResponse {
  income: number[];
  expenses: number[];
}

export const MonthlyComparison: React.FC = () => {
  const [income, setIncome] = useState<number[]>(Array(12).fill(0));
  const [expenses, setExpenses] = useState<number[]>(Array(12).fill(0));
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get<MonthlySummaryResponse>('/api/finance/monthly-summary');
      setIncome(response.data.income ?? Array(12).fill(0));
      setExpenses(response.data.expenses ?? Array(12).fill(0));
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: income,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
      {
        label: 'Expenses',
        data: expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) =>
            new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(value),
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '400px' }}>
          {loading ? <p>Loading chart...</p> : <Bar options={options} data={data} />}
        </div>
      </CardContent>
    </Card>
  );
};
