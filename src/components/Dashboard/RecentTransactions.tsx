import React, { useEffect } from 'react';
import { format, isSameMonth } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { Income, Expense } from '../../types';

type Transaction = (Income | Expense) & { type: 'income' | 'expense' };

export const RecentTransactions: React.FC = () => {
  const { summary, fetchSummary } = useFinance();
  const { user } = useAuth();
  const currencySymbol = user?.currency === 'INR' ? '₹' : user?.currency === 'USD' ? '$' : '';

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (!summary || !summary.recentIncomes || !summary.recentExpenses) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const incomeWithType: Transaction[] = (summary.recentIncomes ?? []).map(income => ({
    ...income,
    type: 'income'
  }));

  const expensesWithType: Transaction[] = (summary.recentExpenses ?? []).map(expense => ({
    ...expense,
    type: 'expense'
  }));

  const combinedTransactions = [...incomeWithType, ...expensesWithType]
    .filter(txn => isSameMonth(new Date(txn.date), new Date()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const incomeCount = incomeWithType.filter(txn =>
    isSameMonth(new Date(txn.date), new Date())
  ).length;

  const expenseCount = expensesWithType.filter(txn =>
    isSameMonth(new Date(txn.date), new Date())
  ).length;

  if (combinedTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="text-right space-y-1 text-sm text-gray-600">
              <p className="text-green-600 font-semibold">Income: {incomeCount}</p>
              <p className="text-red-600 font-semibold">Expense: {expenseCount}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-6">No recent transactions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="text-right space-y-1 text-sm text-gray-600">
            <p className="text-green-600 font-semibold">Income: {incomeCount}</p>
            <p className="text-red-600 font-semibold">Expense: {expenseCount}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {combinedTransactions.map((transaction) => (
            <div
              key={`${transaction.type}-${transaction.id}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-4 ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' 
                    ? <ArrowUpRight className="text-green-600" size={20} />
                    : <ArrowDownRight className="text-red-600" size={20} />
                  }
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.category || (transaction.type === 'income' ? 'Income' : 'Expense')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.note
                      ? transaction.note.length > 25
                        ? `${transaction.note.substring(0, 25)}...`
                        : transaction.note
                      : 'No description'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {currencySymbol}{Number(transaction.amount ?? 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
