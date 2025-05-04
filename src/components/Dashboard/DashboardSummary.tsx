import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { isSameMonth } from 'date-fns';

export const DashboardSummary: React.FC = () => {
  const { summary } = useFinance();
  const { user } = useAuth();
  const currency = user?.currency ?? 'INR'; // default to INR if not set

  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-32 animate-pulse">
            <CardContent className="flex items-center justify-center h-full">
              <div className="h-16 w-full bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Filter for current month
  const currentMonth = new Date();
  const currentIncomes = summary.recentIncomes.filter(income =>
    isSameMonth(new Date(income.date), currentMonth)
  );
  const currentExpenses = summary.recentExpenses.filter(expense =>
    isSameMonth(new Date(expense.date), currentMonth)
  );

  // Safely calculate totals
  const totalIncome = currentIncomes.reduce((sum, income) => sum + (Number(income.amount) || 0), 0);
  const totalExpense = currentExpenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
  const balance = totalIncome - totalExpense;

  const summaryItems = [
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: <ArrowUpRight className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Total Expenses',
      amount: totalExpense,
      icon: <ArrowDownRight className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconBg: 'bg-red-100',
    },
    {
      title: 'Balance',
      amount: balance,
      icon: <Wallet className="text-primary-500" />,
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-700',
      iconBg: 'bg-primary-100',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      {/* Current Month and Year Heading */}
      <div className="mb-4 text-xl font-semibold text-gray-700">
        Summary for {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${item.bgColor} border-none`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.title}</p>
                    <p className={`text-2xl font-bold ${item.textColor} mt-1`}>
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${item.iconBg}`}>
                    {item.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
};
