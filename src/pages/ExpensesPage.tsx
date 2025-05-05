import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ExpenseForm } from '../components/Expense/ExpenseForm';
import { ExpenseList } from '../components/Expense/ExpenseList';
import { useFinance } from '../context/FinanceContext';

const ExpensesPage: React.FC = () => {
  const { isLoading } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage your expenses</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 md:mt-0"
        >
          <Button
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Expense
          </Button>
        </motion.div>
      </div>

      {/* Expense List */}
      <ExpenseList />

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Expense"
        size="md"
      >
        <ExpenseForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ExpensesPage;
