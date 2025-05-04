import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { IncomeForm } from '../components/Income/IncomeForm';
import { IncomeList } from '../components/Income/IncomeList';
import { useFinance } from '../context/FinanceContext';

const IncomePage: React.FC = () => {
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Income</h1>
          <p className="text-gray-600">Manage your income sources</p>
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
            variant="success"
          >
            Add Income
          </Button>
        </motion.div>
      </div>

      <IncomeList />

      {/* Add Income Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Income"
        size="md"
      >
        <IncomeForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default IncomePage;