import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { DashboardSummary } from '../components/Dashboard/DashboardSummary';
import { RecentTransactions } from '../components/Dashboard/RecentTransactions';
import { ExpenseByCategory } from '../components/Dashboard/ExpenseByCategory';
import { MonthlyComparison } from '../components/Dashboard/MonthlyComparison';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { IncomeForm } from '../components/Income/IncomeForm';
import { ExpenseForm } from '../components/Expense/ExpenseForm';
import { useFinance } from '../context/FinanceContext';

const Dashboard: React.FC = () => {
  const { isLoading } = useFinance();
  const [isIncomeModalOpen, setIsIncomeModalOpen] = React.useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your financial overview</p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setIsIncomeModalOpen(true)}
            variant="success"
          >
            Add Income
          </Button>
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setIsExpenseModalOpen(true)}
          >
            Add Expense
          </Button>
        </motion.div>
      </div>

      <DashboardSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ExpenseByCategory />
        <RecentTransactions />
      </div>

      <div className="mb-6">
        <MonthlyComparison />
      </div>

      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        title="Add New Income"
        size="md"
      >
        <IncomeForm onSuccess={() => setIsIncomeModalOpen(false)} />
      </Modal>

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Add New Expense"
        size="md"
      >
        <ExpenseForm onSuccess={() => setIsExpenseModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;